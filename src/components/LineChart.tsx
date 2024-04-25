'use client';

/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */

import { lineOptions } from '@/utils/chartjs';
import { Switch } from '@nextui-org/react';
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { useState } from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export default function LineChart({
  data,
}: {
  data: {
    counts: [string[], number[]];
    growth: [string[], number[]];
}
}) {
  const [growth, setGrowth] = useState(false);
  const [starsDates, starsCount] = growth? data.growth: data.counts;

  return (
    <div
      className="flex flex-col items-center rounded-medium border
      border-[#303031] bg-[#111112] p-2 sm:p-5 lg:min-h-[30rem] xl:w-2/3"
    >
      <div className="relative w-full">
        <h1 className="text-center text-lg font-semibold text-white">
          {growth ? 'Stars Growth' : 'Stars Count'}
        </h1>
        <Switch
          isSelected={growth}
          onValueChange={setGrowth}
          className="absolute right-0 top-0"
        />
      </div>
      <Line
        options={lineOptions}
        data={{
          labels: starsDates,
          datasets: [
            {
              data: starsCount,
              fill: true,
              pointRadius: 1,
              pointHoverRadius: 7,
              pointHitRadius: 30,
              label: 'Stars',
              borderColor: '#62C3F8',
              backgroundColor: '#62C3F810',
              hoverBackgroundColor: '#62C3F8',
              tension: 0.5,
            },
          ],
        }}
      />
    </div>
  );
}
