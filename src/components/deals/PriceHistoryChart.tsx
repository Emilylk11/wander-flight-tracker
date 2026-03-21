'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { PriceHistoryPoint } from '@/types/flights';
import { format, parseISO } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

type PriceHistoryChartProps = {
  data: PriceHistoryPoint[];
  stats: {
    low12mo: number;
    current: number;
    avg12mo: number;
  };
};

export default function PriceHistoryChart({ data, stats }: PriceHistoryChartProps) {
  const labels = data.map((p) => format(parseISO(p.date), 'MMM d'));
  const prices = data.map((p) => p.price);

  const chartData = {
    labels,
    datasets: [
      {
        data: prices,
        borderColor: '#B8965A',
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#B8965A',
        tension: 0.4,
        fill: true,
        backgroundColor: 'rgba(184,150,90,0.06)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // CRITICAL: never let Chart.js control height
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1C1A16',
        borderColor: 'rgba(184,150,90,0.3)',
        borderWidth: 1,
        titleColor: '#9C9485',
        bodyColor: '#FAF8F3',
        padding: 10,
        callbacks: {
          label: (ctx: { raw: unknown }) =>
            '$' + (ctx.raw as number).toLocaleString(),
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#9C9485',
          maxTicksLimit: 6,
          font: { size: 10 },
        },
      },
      y: {
        grid: { color: 'rgba(184,150,90,0.08)' },
        ticks: {
          color: '#9C9485',
          callback: (value: string | number) =>
            '$' + Number(value).toLocaleString(),
          font: { size: 10 },
        },
      },
    },
  };

  if (data.length < 3) {
    return (
      <div className="text-center py-8">
        <div className="text-2xl mb-2">📈</div>
        <p className="text-sm text-wtext-3">
          WANDER is building price history for this route.
          <br />
          Check back after a few more searches.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Chart wrapper: CRITICAL — position:relative + fixed height 120px */}
      <div style={{ position: 'relative', height: '120px', width: '100%' }}>
        <Line data={chartData} options={options} />
      </div>

      {/* Stat pills */}
      <div className="flex gap-2.5 mt-3">
        <div className="flex-1 text-center py-2 px-2 bg-cream rounded-lg">
          <div className="text-[10px] text-wtext-3 mb-[3px]">12-mo low</div>
          {/* Price display: DM Sans 600 */}
          <div className="price-display text-sm text-[#3C7850]">
            ${stats.low12mo.toLocaleString()}
          </div>
        </div>
        <div className="flex-1 text-center py-2 px-2 bg-cream rounded-lg">
          <div className="text-[10px] text-wtext-3 mb-[3px]">Current</div>
          <div className="price-display text-sm text-gold-3">
            ${stats.current.toLocaleString()}
          </div>
        </div>
        <div className="flex-1 text-center py-2 px-2 bg-cream rounded-lg">
          <div className="text-[10px] text-wtext-3 mb-[3px]">12-mo avg</div>
          <div className="price-display text-sm text-wtext">
            ${stats.avg12mo.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
