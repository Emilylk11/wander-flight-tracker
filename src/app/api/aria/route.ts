import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { buildAriaPrompt } from '@/lib/aria-prompt';
import { ariaTools, executeAriaTool } from '@/lib/aria-tools';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { messages, context } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'messages array required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === 'your_anthropic_key') {
      return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const client = new Anthropic({ apiKey });
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Build system prompt with user context
    const systemPrompt = buildAriaPrompt(
      context || {
        userName: 'Traveler',
        homeAirport: 'TUL',
        trips: [],
        wishlist: [],
      }
    );

    // Format messages for Claude API
    const formattedMessages: Anthropic.MessageParam[] = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    // First call — may return tool_use or text
    let response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: formattedMessages,
      tools: ariaTools as Anthropic.Tool[],
    });

    // Handle tool use loop (max 3 rounds to prevent infinite loops)
    let toolRounds = 0;
    const conversationMessages = [...formattedMessages];
    const actionsTaken: string[] = [];

    while (response.stop_reason === 'tool_use' && toolRounds < 3) {
      toolRounds++;

      // Collect all tool uses from the response
      const toolUseBlocks = response.content.filter(
        (block): block is Anthropic.ContentBlockParam & { type: 'tool_use'; id: string; name: string; input: Record<string, unknown> } =>
          block.type === 'tool_use'
      );

      // Add assistant's response (with tool_use blocks) to conversation
      conversationMessages.push({
        role: 'assistant',
        content: response.content as Anthropic.ContentBlockParam[],
      });

      // Execute each tool and collect results
      const toolResults: Anthropic.ToolResultBlockParam[] = [];
      for (const toolUse of toolUseBlocks) {
        let result = '{"error": "Not authenticated"}';
        if (user) {
          result = await executeAriaTool(
            toolUse.name,
            toolUse.input as Record<string, unknown>,
            user.id,
            supabase
          );
        }

        // Track what actions were taken for the UI
        const parsed = JSON.parse(result);
        if (parsed.success) {
          actionsTaken.push(toolUse.name);
        }

        toolResults.push({
          type: 'tool_result',
          tool_use_id: toolUse.id,
          content: result,
        });
      }

      // Add tool results to conversation
      conversationMessages.push({
        role: 'user',
        content: toolResults,
      });

      // Get next response from Claude
      response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages: conversationMessages,
        tools: ariaTools as Anthropic.Tool[],
      });
    }

    // Extract final text from response
    const textBlocks = response.content.filter(
      (block): block is Anthropic.TextBlock => block.type === 'text'
    );
    const finalText = textBlocks.map(b => b.text).join('');

    // Prefix with action indicator if tools were used
    let outputText = finalText;
    if (actionsTaken.length > 0) {
      const actionLabels = actionsTaken.map(a => {
        switch (a) {
          case 'add_itinerary_item': return '📌 Added to itinerary';
          case 'add_wishlist_destination': return '💫 Added to wishlist';
          case 'add_budget_entry': return '💰 Logged expense';
          case 'add_trip_destination': return '🗺️ Added city to trip';
          case 'search_flights': return '✈️ Searched flights';
          default: return '✦ Action taken';
        }
      });
      outputText = `[${actionLabels.join(' · ')}]\n\n${finalText}`;
    }

    // Stream the final text response
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(outputText));
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (err) {
    console.error('ARIA error:', err);
    return new Response(
      JSON.stringify({ error: 'ARIA is temporarily unavailable. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
