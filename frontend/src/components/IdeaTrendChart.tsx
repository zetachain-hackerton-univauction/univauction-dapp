import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Area, AreaChart } from 'recharts';

const data = [
  { name: 'Jan', value: 12000, volume: 450 },
  { name: 'Feb', value: 11500, volume: 380 },
  { name: 'Mar', value: 13200, volume: 520 },
  { name: 'Apr', value: 12800, volume: 480 },
  { name: 'May', value: 14100, volume: 610 },
  { name: 'Jun', value: 13900, volume: 590 },
  { name: 'Jul', value: 15200, volume: 680 },
  { name: 'Aug', value: 14800, volume: 650 },
  { name: 'Sep', value: 16100, volume: 720 },
  { name: 'Oct', value: 15800, volume: 690 },
  { name: 'Nov', value: 16478, volume: 758 },
  { name: 'Dec', value: 17200, volume: 800 },
];

export function IdeaTrendChart() {
  return (
    <div className="w-full h-full relative">
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 bottom-12 w-16 flex flex-col justify-between text-right pr-2 text-[12px] text-[#94969c]">
        <span>$20,000</span>
        <span>$15,000</span>
        <span>$10,000</span>
        <span>$5,000</span>
        <span>$0</span>
      </div>

      {/* Chart container */}
      <div className="ml-16 mr-0 h-full pb-12">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#DDFB24" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#DDFB24" stopOpacity={0.05} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Grid lines */}
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={false}
              domain={[0, 20000]}
              tickCount={5}
            />
            <XAxis 
              axisLine={false}
              tickLine={false}
              tick={false}
              dataKey="name"
            />
            
            {/* Area fill */}
            <Area
              type="monotone"
              dataKey="value"
              stroke="none"
              fill="url(#areaGradient)"
              fillOpacity={1}
            />
            
            {/* Main line */}
            <Line
              type="monotone"
              dataKey="value"
              stroke="#DDFB24"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 6,
                fill: "#DDFB24",
                stroke: "#ffffff",
                strokeWidth: 2,
                filter: "url(#glow)"
              }}
              filter="url(#glow)"
            />
            
            {/* Tooltip */}
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[rgba(16,20,30,0.48)] backdrop-blur-sm border border-[#1f242f] rounded p-3 text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-4 rounded-full bg-[#1ed760] flex items-center justify-center">
                            <span className="text-white text-xs">🎵</span>
                          </div>
                          <span className="text-[13px] leading-[20px] font-medium text-[#f5f5f6]">Spotify</span>
                        </div>
                        <span className="text-[10px] leading-[18px] text-[#94969c]">28 NOV 2023</span>
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[12px] leading-[24px] text-[#94969c] uppercase">Value</span>
                        <span className="text-[12px] leading-[18px] font-semibold text-[#ffffff]">
                          ${payload[0].value?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] leading-[24px] text-[#94969c] uppercase">Return</span>
                        <span className="text-[12px] leading-[18px] text-[#47cd89]">
                          +$58.78
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Grid lines overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <pattern id="chartGrid" width="100%" height="20%" patternUnits="userSpaceOnUse">
              <line x1="0" y1="100%" x2="100%" y2="100%" stroke="#333741" strokeWidth="0.5" strokeDasharray="16 16" strokeOpacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#chartGrid)" />
        </svg>
      </div>

      {/* Active data point */}
      <div className="absolute top-[60%] left-[60%] w-6 h-6 pointer-events-none">
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <circle cx="12" cy="12" r="4" fill="#ffffff" />
          <circle cx="12" cy="12" r="2.4" fill="#47CD89" />
        </svg>
      </div>

      {/* Dotted line to tooltip */}
      <div className="absolute top-[60%] left-[60%] w-[71px] h-0 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 71 1" preserveAspectRatio="none">
          <line 
            x1="0" y1="0.75" x2="71" y2="0.75" 
            stroke="url(#dashedLineGradient)" 
            strokeWidth="0.5" 
            strokeDasharray="5 5"
          />
          <defs>
            <linearGradient id="dashedLineGradient" x1="77.1739" y1="1" x2="1.54348" y2="1">
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}