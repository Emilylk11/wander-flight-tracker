type MessageBubbleProps = {
  role: 'user' | 'assistant';
  content: string;
  userName?: string;
};

export default function MessageBubble({ role, content, userName = 'E' }: MessageBubbleProps) {
  const isAI = role === 'assistant';
  const initial = userName.charAt(0).toUpperCase();

  return (
    <div
      className={`flex gap-2 animate-fade-up ${
        isAI ? 'flex-row' : 'flex-row-reverse'
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] ${
          isAI
            ? 'bg-gradient-to-br from-gold-3 to-gold text-white'
            : 'bg-cream-2 text-wtext-2'
        }`}
      >
        {isAI ? '✦' : initial}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[80%] px-[13px] py-2.5 rounded-xl text-xs leading-relaxed ${
          isAI
            ? 'bg-cream text-wtext rounded-bl-[4px]'
            : 'bg-gradient-to-br from-gold-3 to-gold text-white rounded-br-[4px]'
        }`}
      >
        {content}
      </div>
    </div>
  );
}
