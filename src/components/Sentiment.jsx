import React, { useState, useEffect } from 'react';
import { Activity, Zap, BarChart2, TrendingUp } from 'lucide-react';

export default function Sentiment() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sentiment-engine')
      .then(res => res.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-text-dim text-center mt-10">Loading Sentiment Data...</div>;
  if (!data) return <div className="p-6 text-red text-center mt-10">Failed to load sentiment.</div>;

  return (
    <div className="fade-in slide-up p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Activity className="text-blue" size={28} />
        <h2 className="section-title">Market Sentiment Engine</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 flex flex-col items-center justify-center text-center col-span-1 md:col-span-2">
          <div className="text-sm text-text-dim font-bold mb-4 uppercase tracking-widest">Fear & Greed Index</div>
          <div className="relative w-48 h-24 overflow-hidden mb-4">
            <div className="absolute top-0 left-0 w-full h-[200%] border-[20px] border-card2 rounded-full border-t-red border-r-yellow-500 border-b-green border-l-red rotate-45"></div>
            <div 
              className="absolute bottom-0 left-[50%] w-1 h-20 bg-text origin-bottom transition-transform duration-1000 ease-out"
              style={{ transform: `translateX(-50%) rotate(${data.fear_greed * 1.8 - 90}deg)` }}
            ></div>
            <div className="absolute bottom-0 left-[50%] w-4 h-4 rounded-full bg-text -translate-x-1/2 translate-y-1/2"></div>
          </div>
          <div className="text-3xl font-bold font-grotesk">{data.fear_greed}</div>
          <div className="text-sm text-text-dim mt-1">{data.fear_greed > 75 ? 'Extreme Greed' : data.fear_greed > 55 ? 'Greed' : data.fear_greed < 25 ? 'Extreme Fear' : data.fear_greed < 45 ? 'Fear' : 'Neutral'}</div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 text-text-dim mb-4"><Zap size={18} /> Smart Money</div>
          <div className="text-2xl font-bold text-blue">{data.smart_money}</div>
          <p className="text-xs text-text-dim mt-2">Institutional money flow behavior over the last 48 hours.</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 text-text-dim mb-4"><BarChart2 size={18} /> Unusual Volume</div>
          <div className="flex flex-col gap-2">
            {data.unusual_volume.map(vol => (
              <div key={vol} className="bg-card2 px-3 py-2 rounded-lg font-bold font-grotesk border border-border text-sm flex justify-between">
                <span>{vol}</span>
                <span className="text-green">+300%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h3 className="font-bold mb-4 font-grotesk text-lg flex items-center gap-2"><TrendingUp size={20} className="text-blue" /> Sector Heatmap</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.sector_heat.map((sec, i) => (
          <div key={i} className={`p-4 rounded-xl border ${sec.performance.startsWith('+') ? 'bg-green/10 border-green/20' : 'bg-red/10 border-red/20'}`}>
            <div className="font-bold mb-1">{sec.sector}</div>
            <div className={`font-grotesk text-xl font-bold ${sec.performance.startsWith('+') ? 'text-green' : 'text-red'}`}>{sec.performance}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
