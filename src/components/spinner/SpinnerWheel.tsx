import React from 'react';
import { Topic } from '../../types';
import { SpinButton } from './SpinButton';

interface SpinnerWheelProps {
  topics: Topic[];
  rotationAngle: number;
  isSpinning: boolean;
  onSpin: () => void;
  winnerTopic: Topic | null;
}

export const SpinnerWheel: React.FC<SpinnerWheelProps> = ({
  topics,
  rotationAngle,
  isSpinning,
  onSpin,
  winnerTopic,
}) => {
  const total = topics.length;
  const sliceAngle = 360 / total;
  const size = 440; // SVG viewBox width & height
  const center = size / 2;
  const radius = center - 20;

  // Vibrant dark palette slice colors
  const sliceColors = [
    '#6366f1', // Indigo
    '#1e1b4b', // Deep Indigo
    '#4338ca', // Violet
    '#0f172a', // Slate
    '#6366f1', // Purple
    '#172554', // Dark Blue
    '#0891b2', // Light Purple
    '#1e293b', // Dark Slate
  ];

  // Utility to calculate slice arc SVG path
  const getSlicePath = (index: number) => {
    const startAngle = (index * sliceAngle - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * sliceAngle - 90) * (Math.PI / 180);

    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);

    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);

    const largeArcFlag = sliceAngle > 180 ? 1 : 0;

    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="relative flex flex-col items-center justify-center my-6">
      {/* Top Pointer Indicator Arrow (Points directly down to top slice) */}
      <div className="absolute top-0 z-30 transform -translate-y-3 filter drop-shadow-lg">
        <div className="w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-t-[28px] border-t-amber-400 animate-bounce" />
      </div>

      {/* Wheel Wrapper */}
      <div className="relative w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] rounded-full p-2 bg-slate-900 border-4 border-slate-800 shadow-2xl flex items-center justify-center">
        {/* SVG Wheel */}
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full transform transition-transform ease-out"
          style={{
            transform: `rotate(${rotationAngle}deg)`,
            transformOrigin: '50% 50%',
          }}
        >
          {/* Wheel Segments */}
          {topics.map((topic, idx) => {
            const isWinner = winnerTopic && winnerTopic.id === topic.id;
            const fill = isWinner
              ? '#fbbf24' // Highlight Amber Gold if winner!
              : sliceColors[idx % sliceColors.length];

            const textAngle = idx * sliceAngle + sliceAngle / 2;
            const textRad = (textAngle - 90) * (Math.PI / 180);
            const textDist = radius * 0.65;
            const textX = center + textDist * Math.cos(textRad);
            const textY = center + textDist * Math.sin(textRad);

            return (
              <g key={topic.id || idx}>
                {/* Sector Path */}
                <path
                  d={getSlicePath(idx)}
                  fill={fill}
                  stroke="#0f172a"
                  strokeWidth="2"
                  className="transition-colors duration-300"
                />

                {/* Topic Label Text */}
                <text
                  x={textX}
                  y={textY}
                  fill={isWinner ? '#0f172a' : '#ffffff'}
                  fontSize={total > 12 ? '11' : '13'}
                  fontWeight={isWinner ? '800' : '600'}
                  textAnchor="middle"
                  dominantBaseline="central"
                  transform={`rotate(${textAngle + 90}, ${textX}, ${textY})`}
                  className="select-none font-sans tracking-wide drop-shadow-sm pointer-events-none"
                >
                  {topic.name.length > 15 ? `${topic.name.substring(0, 14)}…` : topic.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Center Spin Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <SpinButton onClick={onSpin} isSpinning={isSpinning} />
        </div>
      </div>
    </div>
  );
};
