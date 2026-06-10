import React, { useState, useEffect } from 'react';
import { BookOpen, Target, AlertTriangle, Trophy, ArrowLeft } from 'lucide-react';

export default function Journal({ onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/journal-analytics')
      .then(res => res.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-text-dim text-center mt-10">Loading AI Journal...</div>;
  if (!data) return <div className="p-6 text-red text-center mt-10">Failed to load journal.</div>;

  return (
    <div className="fade-in slide-up pb-24">
      <div className="page-header" style={{ marginBottom: 20 }}>
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={16} color="#94A3B8" />
        </button>
        <div className="page-title">AI Trade Journal</div>
        <div style={{ width: 32 }} />
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 16px' }}>
        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="text-blue" size={28} />
          <h2 className="section-title">Behavioral Analytics</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-5">
            <div className="flex items-center gap-2 text-text-dim mb-2"><Trophy size={18} /> Consistency</div>
            <div className="price-big text-green">{data.consistency_score}</div>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-2 text-text-dim mb-2"><Target size={18} /> Win Rate</div>
            <div className="price-big text-blue">{data.win_rate}</div>
          </div>
          <div className="card p-5 md:col-span-2">
            <div className="flex items-center gap-2 text-text-dim mb-2"><AlertTriangle size={18} /> Top Mistakes Tracked</div>
            <div className="flex gap-2 flex-wrap mt-2">
              {data.mistakes_tracked.map(m => (
                <span key={m} className="bg-red/10 text-red px-3 py-1 rounded-full text-xs font-bold border border-red/20">{m}</span>
              ))}
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-4 font-grotesk">Recent Trades</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.recent_trades.map((trade, i) => (
            <div key={i} className="card p-0 overflow-hidden group cursor-pointer hover:border-blue transition-colors">
              <div className="h-32 bg-card2 overflow-hidden relative">
                <img src={trade.screenshot} alt="Trade chart" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold border border-white/10">{trade.symbol}</div>
                <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${trade.type==='LONG'?'bg-green/20 text-green':'bg-red/20 text-red'}`}>{trade.type}</div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                   <div>
                      <div className="text-[10px] text-text-dim uppercase font-bold mb-1">Detected Pattern</div>
                      <div className="text-xs font-bold text-blue">{trade.pattern}</div>
                   </div>
                   <div className="text-right">
                      <div className="text-[10px] text-text-dim uppercase font-bold mb-1">AI Confidence</div>
                      <div className="text-xs font-bold text-white">{trade.confidence}</div>
                   </div>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                  <div>
                    <div className="text-[10px] text-text-dim uppercase font-bold mb-1">Trader Emotion</div>
                    <div className="text-xs font-bold">{trade.emotion}</div>
                  </div>
                  <div className={`text-lg font-bold font-grotesk ${trade.result.startsWith('+') ? 'text-green' : 'text-red'}`}>
                    {trade.result}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
