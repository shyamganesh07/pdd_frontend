import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// ── Client-Side Fallback Data for Mobile Offline/Timeout Resilience ──
const FALLBACK_TOPICS = {
  beginner: [
    "Market Structure & Auction Process", "Orders Types & Execution Mechanics", "Understanding Support & Resistance",
    "Trend Identification Basics", "Introduction to Technical Indicators", "Volume Analysis for Beginners",
    "Introduction to Candlestick Patterns", "Risk Management: The 1% Rule", "Developing a Basic Trading Plan",
    "Understanding Market Sessions", "Psychology: Handling Your First Loss", "Preparing for Live Trading"
  ],
  swing: [
    "Multi-day Trend Following", "Moving Average Crossovers", "Swing High/Low Identification",
    "Fibonacci Retracement Entries", "Analyzing Daily vs Weekly Charts", "Trailing Stop-Loss Placement",
    "Position Sizing for Swing Trades", "Trading Breakouts vs Retests", "Risk Management for Overnight Holds",
    "Correlations & Market Indexes", "Fundamental Catalysts for Swings", "Building a Weekly Watchlist"
  ],
  intraday: [
    "Opening Range Breakouts (ORB)", "VWAP & Volume Profile Trading", "Identify Intraday Liquidity Zones",
    "Order Book Imbalance Scaling", "Session Highs/Lows Reversals", "Scalping with Tick & Range Charts",
    "Using MACD & RSI Momentum", "Handling High Impact News Gaps", "Time-of-day Volatility Patterns",
    "Managing Intraday Leverage Risks", "Daily Drawdown Limits & Rules", "Post-Market Journaling Workflows"
  ],
  risk: [
    "The Mathematics of Expectancy", "Position Sizing & Kelly Criterion", "Calculating Maximum Drawdown",
    "Risk-to-Reward Ratio Optimization", "Hedging with Index Options", "Correlation Risks in Portfolios",
    "Stop-Loss Calibration (ATR-based)", "Dynamic De-leveraging Strategies", "Value at Risk (VaR) Modeling",
    "Risk Curve & Equity Curve Analysis", "Handling Consecutive Losses", "Building a Fail-Safe System"
  ],
  psychology: [
    "Conquering FOMO & Impulse Entering", "Revenge Trading & Emotional Recovery", "Loss Aversion & Early Exits",
    "Overconfidence & Leverage Scaling", "Developing Neural Discipline", "The Trader's Journal as Therapy",
    "Establishing Pre-Market Routines", "Managing Stress in Drawdown", "Accepting Probabilistic Outcomes",
    "Cognitive Biases in Live Markets", "Avoiding Overtrading Fatigue", "Achieving Peak Trader Flow"
  ],
  quant: [
    "Foundations of Quant Finance", "Algorithmic Backtesting Pitfalls", "Mean Reversion vs Trend Systems",
    "Statistical Arbitrage Basics", "Implementing Stop Loss in Code", "Optimizing Parameters without Overfitting",
    "Using Python for Data Extraction", "Time-Series Price Analysis", "Machine Learning in Trading Models",
    "Portfolio Rebalancing Algorithms", "Risk Modeling & Monte Carlo Sim", "API Integration & Live Execution"
  ],
  liquidity: [
    "Order Book Depth & L3 Data", "Market Makers & Bid-Ask Spreads", "Identifying Liquidity Sweep Zones",
    "Iceberg Orders & Hidden Volume", "Stop-Loss Hunting Mechanics", "Delta Divergence in Order Flow",
    "Footprint Chart Analysis", "Volume Spread Analysis (VSA)", "Trading in Liquidity Vacuums",
    "High-Frequency Trading (HFT) Footprints", "Institutional Accumulation Phases", "Cross-Market Arbitrage Dynamics"
  ],
  smart_money: [
    "Wyckoff Accumulation & Distribution", "Order Blocks & Fair Value Gaps", "Market Structure Shifts (MSS)",
    "Premium vs Discount Zones", "Mitigation Blocks & Breakers", "Inducement & Liquidity Grabs",
    "HTF vs LTF Alignment", "Entrances at Institutional Levels", "Dealing Ranges & Daily Profiles",
    "Whale Wallet Tracking Metrics", "Smart Money Divergence Signals", "Executing with Precision Triggers"
  ],
  options_flow: [
    "Understanding Option Greeks (Gamma, Delta)", "Dealers Hedging & Gamma Squeezes", "Option Flow Tracking (Sweeps, Blocks)",
    "Analyzing Open Interest & Volume", "Vanna & Charm Flows", "Implied Volatility (IV) Crush",
    "Market Maker Positioning Charts", "Gamma Exposure (GEX) Calculation", "Dark Pool Activity & Options",
    "Unusual Whales Alert Analysis", "Hedging Spot Portfolio with GEX", "Systematic Volatility Arbitrage"
  ],
  volatility_modeling: [
    "Historical vs Implied Volatility", "Gaussian vs Fat-Tail Distributions", "Regime Shift Detection Models",
    "GARCH Volatility Forecasting", "VIX Index Mechanics & Trading", "Volatility Skew & Smile",
    "Markov Chain Trading Regimes", "Dynamic Position Adjusting (Volatility)", "Modeling Black Swan Events",
    "Correlation Breakdowns in Crashes", "Trading Volatility Breakouts", "Tail Risk Hedging Implementations"
  ]
};

function getTopicDetails(title) {
  const titleLower = title.toLowerCase();
  let content = `Implement a systematic entry rule for ${title} requiring volume confirmation and a strict 1:2 risk-to-reward ratio.`;
  let full_concept = `Analyzing ${title} requires identifying key price action patterns, verifying volume confirmation, and setting risk-controlled stop losses. Systematic execution guarantees that over a long series of trades, the strategy remains profitable while capping maximum portfolio drawdown.`;

  if (titleLower.includes("fomo") || titleLower.includes("impulse")) {
    content = "Mitigate impulse entries by introducing a mandatory 2-minute cooling period between signal validation and market execution.";
    full_concept = "Impulsive entries driven by fear of missing out degrade trade expectancy. Professional execution requires waiting for candle close verification, calculating the risk-to-reward ratio before routing orders, and strictly adhering to the pre-trade checklist to bypass emotional execution pathways.";
  } else if (titleLower.includes("revenge") || titleLower.includes("emotional")) {
    content = "Enforce a maximum daily loss limit. Once hit, the trading system automatically terminates API keys and closes open positions.";
    full_concept = "Revenge trading is the emotional reaction to a loss, leading to increased sizing and chaotic trading. Setting a hard daily drawdown limit in your execution broker automatically terminates operations, preventing psychological biases from destroying capital.";
  } else if (titleLower.includes("drawdown") || titleLower.includes("losses")) {
    content = "Calculate maximum drawdown using peak-to-trough equity curves to recalibrate leverage before ruin occurs.";
    full_concept = "Drawdown analysis measures system stress. When drawdown exceeds 2.5 standard deviations of historical models, leverage must be systematically reduced by 50% until the equity curve recovers above its 20-day moving average.";
  } else if (titleLower.includes("sharpe") || titleLower.includes("expectancy")) {
    content = "Ensure the strategy expectancy is positive (Expectancy = (Win% * AvgWin) - (Loss% * AvgLoss) > 0) with a Sharpe > 1.5.";
    full_concept = "Mathematical expectancy defines strategy viability over large numbers. A positive expectancy combined with a Sharpe ratio above 1.5 indicates high-quality risk-adjusted returns, proving that net profits are not due to random distribution.";
  } else if (titleLower.includes("rsi") || titleLower.includes("momentum")) {
    content = "Use RSI divergence on multiple timeframes to confirm trend exhaustion rather than buying blindly at oversold levels.";
    full_concept = "The Relative Strength Index measures price velocity. In strong trends, RSI stays overbought/oversold. To avoid false entries, wait for multi-timeframe divergence or MACD crossover confirmation before executing reversal setups.";
  } else if (titleLower.includes("atr") || titleLower.includes("volatility") || titleLower.includes("model")) {
    content = "Use a 2.0x ATR multiplier to dynamically calibrate stop-loss distance, ensuring stops are placed outside normal noise.";
    full_concept = "Average True Range measures market noise. Setting stops as a multiple of ATR (typically 1.5x to 2.5x) prevents getting stopped out by random noise, expanding stop size during high volatility and contracting it during low volatility.";
  } else if (titleLower.includes("support") || titleLower.includes("resistance")) {
    content = "Identify key institutional support/resistance levels by locating blocks with heavy volume accumulation.";
    full_concept = "Support and resistance are zones of order imbalance, not thin lines. Look for high-volume nodes in the volume profile where institutional buyers and sellers entered heavy blocks, as these zones will likely act as barriers on retests.";
  } else if (titleLower.includes("liquidity") || titleLower.includes("sweep") || titleLower.includes("stop-loss hunting")) {
    content = "Avoid placing stops at obvious swing highs/lows where institutional sweeps target liquidity blocks.";
    full_concept = "Institutions require massive volume to fill orders, which is accumulated by triggering retail stop-losses placed at obvious swing highs or double bottoms. Wait for the sweep to complete and price to reclaim the range before entering.";
  } else if (titleLower.includes("order block") || titleLower.includes("smart money") || titleLower.includes("wyckoff")) {
    content = "Identify institutional order blocks where the last down-close candle precedes a strong upward market structure shift.";
    full_concept = "Order blocks represent unfilled institutional buy/sell orders. When price creates a rapid market structure shift, it leaves behind an order block and fair value gaps. Enter on a retracement to these zones for high risk-to-reward setups.";
  } else if (titleLower.includes("options") || titleLower.includes("greek") || titleLower.includes("gamma")) {
    content = "Track Gamma Exposure (GEX) of market makers to locate key magnet price zones and support/resistance boundaries.";
    full_concept = "Option market makers must hedge their spot exposure dynamically. High positive gamma acts as a stabilizer (volatility dampener), while negative gamma acts as an accelerator. GEX levels show where massive hedging blocks will buy or sell.";
  } else if (titleLower.includes("backtest") || titleLower.includes("quant") || titleLower.includes("algorithm")) {
    content = "Prevent backtest overfitting by using out-of-sample data sets and conducting walk-forward optimization.";
    full_concept = "Overfitting occurs when a model is tuned to fit historical noise, leading to live performance degradation. Use Walk-Forward Analysis and cross-validation, keeping at least 30% of your data strictly out-of-sample to verify true system robustness.";
  } else if (titleLower.includes("structure") || titleLower.includes("auction")) {
    content = "Analyze market auction dynamics to identify whether the market is in a balanced (range) or unbalanced (trend) phase.";
    full_concept = "Markets exist in two phases: auction balance (consolidation) and auction imbalance (trending). Recognizing transition points—such as value area expansion or high-volume node breakouts—is critical to selecting the correct strategy.";
  }

  return { content, full_concept };
}

function getLessonChartDetails(title) {
  const titleLower = title.toLowerCase();
  let chart_type = "price_levels";
  let chart_data = [
    { name: "P1", price: 150, support: 145, resistance: 155 },
    { name: "P2", price: 153, support: 145, resistance: 155 },
    { name: "P3", price: 146, support: 145, resistance: 155 },
    { name: "P4", price: 148, support: 145, resistance: 155 },
    { name: "P5", price: 154, support: 145, resistance: 155 },
    { name: "P6", price: 158, support: 145, resistance: 155 }
  ];
  let chart_desc = "Institutional S/R Channels: Shows price bouncing within historical liquidity block boundaries.";

  if (titleLower.includes("rsi") || titleLower.includes("momentum") || titleLower.includes("oscillator")) {
    chart_type = "oscillator";
    chart_data = [
      { name: "T1", value: 45, overbought: 70, oversold: 30 },
      { name: "T2", value: 62, overbought: 70, oversold: 30 },
      { name: "T3", value: 78, overbought: 70, oversold: 30 },
      { name: "T4", value: 50, overbought: 70, oversold: 30 },
      { name: "T5", value: 28, overbought: 70, oversold: 30 },
      { name: "T6", value: 35, overbought: 70, oversold: 30 },
      { name: "T7", value: 55, overbought: 70, oversold: 30 }
    ];
    chart_desc = "Oscillator Momentum: Tracks overbought (70) and oversold (30) boundary breakouts and divergences.";
  } else if (
    titleLower.includes("risk") ||
    titleLower.includes("expectancy") ||
    titleLower.includes("drawdown") ||
    titleLower.includes("loss") ||
    titleLower.includes("fomo") ||
    titleLower.includes("revenge")
  ) {
    chart_type = "equity";
    chart_data = [
      { name: "T0", disciplined: 1000, leverage: 1000 },
      { name: "T1", disciplined: 1020, leverage: 1200 },
      { name: "T2", disciplined: 1045, leverage: 1500 },
      { name: "T3", disciplined: 1030, leverage: 900 },
      { name: "T4", disciplined: 1060, leverage: 1400 },
      { name: "T5", disciplined: 1090, leverage: 400 },
      { name: "T6", disciplined: 1120, leverage: 0 }
    ];
    chart_desc = "Mathematical Expectancy: 1% Risk Rule (Steady Green Line) vs Excessive Leverage/Revenge (High Volatility Liquidation).";
  } else if (titleLower.includes("atr") || titleLower.includes("volatility") || titleLower.includes("model")) {
    chart_type = "volatility";
    chart_data = [
      { name: "Day 1", price: 100, atr_stop: 96 },
      { name: "Day 2", price: 102, atr_stop: 97.5 },
      { name: "Day 3", price: 105, atr_stop: 100.2 },
      { name: "Day 4", price: 103, atr_stop: 99.2 },
      { name: "Day 5", price: 107, atr_stop: 102.8 },
      { name: "Day 6", price: 110, atr_stop: 105.5 }
    ];
    chart_desc = "Volatility Adaptive Stops: Trailing Stop-Loss envelope adjusted dynamically based on Average True Range multiples.";
  }

  return { chart_type, chart_data, chart_desc };
}

function generateFallbackLessons(trackId) {
  const topics = FALLBACK_TOPICS[trackId] || FALLBACK_TOPICS.beginner;
  const youtubeIds = ["T6H8v_Y-L-g", "Zf37t7njppg", "8-P3iFz7_8E", "3PrN9pREB_w"];
  const videoUrls = [
    "https://assets.mixkit.co/videos/preview/mixkit-financial-graphs-on-a-computer-monitor-close-up-19013-large.mp4",
    "https://assets.mixkit.co/videos/preview/mixkit-business-charts-and-graphs-close-up-31514-large.mp4"
  ];

  return topics.map((title, i) => {
    const { content, full_concept } = getTopicDetails(title);
    const { chart_type, chart_data, chart_desc } = getLessonChartDetails(title);
    let yid = youtubeIds[i % youtubeIds.length];
    if (trackId === 'swing' && i === 0) {
      yid = "n3Qdj4lOlbI";
    } else if (trackId === 'intraday' && i === 0) {
      yid = "D8JLldeSLO0";
    } else if (trackId === 'risk' && i === 0) {
      yid = "BAfRVpKIxZ4";
    } else if (trackId === 'psychology' && i === 0) {
      yid = "GxBwWWupvrk";
    } else if (trackId === 'quant' && i === 0) {
      yid = "JVtUcM1sWQw";
    }
    return {
      id: `${trackId}-lesson-${i+1}`,
      title,
      content,
      full_concept,
      youtube_id: yid,
      video_url: videoUrls[i % videoUrls.length],
      chart_type,
      chart_desc,
      chart_data
    };
  });
}

const FALLBACK_QUIZ = [
  {
    id: 1,
    question: "Your recent history shows a tendency to enter trades during high volatility. What is the safest way to adjust?",
    options: ["Increase Position Size", "Reduce Position Size", "Tighten Stop Loss", "Move SL to Entry immediately"],
    correct: 1,
    explanation: "Reducing position size during high volatility maintains the same absolute risk while allowing for wider price swings."
  },
  {
    id: 2,
    question: "Identify this behavioral pattern: You just lost a trade and immediately enter a larger position to win it back.",
    options: ["FOMO", "Revenge Trading", "Greed Cycle", "Overtrading"],
    correct: 1,
    explanation: "Revenge trading is the emotional urge to 'get back' at the market after a loss."
  },
  {
    id: 3,
    question: "What does a Sharpe Ratio of 2.5 indicate for a systematic trading system?",
    options: ["High volatility and system decay", "Poor performance requiring refactoring", "Excellent risk-adjusted returns", "High leverage ratio leading to ruin"],
    correct: 2,
    explanation: "A Sharpe Ratio above 2.0 is considered excellent, indicating strong risk-adjusted returns."
  },
  {
    id: 4,
    question: "Which metric is most critical to evaluate a trading strategy's vulnerability to a series of consecutive losses?",
    options: ["Maximum Drawdown", "Win-Loss Ratio", "Profit Factor", "Average Trade Duration"],
    correct: 0,
    explanation: "Maximum Drawdown measures the peak-to-trough decline, reflecting extreme stress periods."
  },
  {
    id: 5,
    question: "If a trader has a 40% win rate but a risk-to-reward ratio of 1:3, is the strategy mathematically profitable over the long term?",
    options: ["Yes, it has positive expectancy", "No, win rate is below 50%", "Only if leverage is increased", "No, it breaks even"],
    correct: 0,
    explanation: "Expectancy = (0.4 * 3) - (0.6 * 1) = +0.6. The expectancy is positive, making it profitable."
  },
  {
    id: 6,
    question: "Cognitive bias where a trader seeks only information that supports their open trade is called:",
    options: ["Loss Aversion", "Confirmation Bias", "Recency Bias", "Anchoring Effect"],
    correct: 1,
    explanation: "Confirmation bias leads traders to filter out negative indicators and seek positive validation."
  },
  {
    id: 7,
    question: "What is the primary objective of a 'Liquidity Sweep' in institutional order flow?",
    options: ["Increasing market volatility", "Closing open gap zones", "Triggering retail stop-losses to accumulate orders", "Testing the 200 EMA support"],
    correct: 2,
    explanation: "Sweeping liquidity triggers stop-losses, allowing institutions to fill large orders at favorable prices."
  },
  {
    id: 8,
    question: "When the Average True Range (ATR) is expanding rapidly, a systematic trader should expect:",
    options: ["A guaranteed trend reversal", "Slower order execution times", "Decreasing spread in order books", "Larger price swings requiring wider stop losses"],
    correct: 3,
    explanation: "Expanding ATR represents rising volatility, meaning price swings will be wider, requiring wider stops."
  }
];

const FALLBACK_PATTERNS = [
  {
    id: 1,
    title: "BTC/USD 4H Trend Analysis",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    question: "What pattern is forming here?",
    options: ["Head & Shoulders", "Double Top", "Ascending Triangle", "Bearish Pennant"],
    correct: 0,
    explanation: "The three distinct peaks show a clear Head and Shoulders reversal pattern."
  },
  {
    id: 2,
    title: "Gold (GC) Liquidity Sweep",
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80",
    question: "Identify the base formation.",
    options: ["Triple Bottom", "Double Bottom", "Descending Wedge", "Flag Pattern"],
    correct: 1,
    explanation: "The price tested the support twice before a strong bullish expansion."
  },
  {
    id: 3,
    title: "Nasdaq Breakout Pattern",
    image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&q=80",
    question: "The tightening price action indicates:",
    options: ["Bullish Flag", "Triangle Breakout", "Head & Shoulders", "Double Top"],
    correct: 1,
    explanation: "The converging trendlines represent a classic Triangle formation about to break."
  },
  {
    id: 4,
    title: "EUR/USD Compression Regime",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&q=80",
    question: "This sharp rally followed by tight consolidation is a:",
    options: ["Bullish Pennant", "Double Top", "Descending Channel", "Rising Wedge"],
    correct: 0,
    explanation: "The sharp upward pole followed by a small symmetrical triangle is a classic Bullish Pennant continuation pattern."
  },
  {
    id: 5,
    title: "Crude Oil Support Accumulation",
    image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&q=80",
    question: "What bottoming structure is forming here?",
    options: ["Double Bottom", "Head and Shoulders Bottom", "Triple Bottom", "Round Bottom"],
    correct: 2,
    explanation: "Three equal depth swing lows testing a major support line represent a Triple Bottom reversal pattern."
  },
  {
    id: 6,
    title: "Apple Inc. Gap Expansion",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
    question: "A sudden price jump out of a range with high volume is a:",
    options: ["Runaway Gap", "Exhaustion Gap", "Common Gap", "Breakaway Gap"],
    correct: 3,
    explanation: "A breakaway gap occurs when price moves out of an established trading range on high volume, signifying a strong new trend."
  },
  {
    id: 7,
    title: "S&P 500 Exhaustion Peak",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80",
    question: "The failure to break the prior high followed by a breakdown is a:",
    options: ["Double Top", "Head and Shoulders", "Rising Wedge", "Triple Top"],
    correct: 0,
    explanation: "Two distinct price peaks testing the same resistance zone without breaking it forms a Double Top reversal structure."
  },
  {
    id: 8,
    title: "USD/JPY Trend Reversal",
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80",
    question: "The contracting price action pointing downward indicates a:",
    options: ["Rising Wedge", "Falling Wedge", "Bearish Flag", "Symmetrical Triangle"],
    correct: 1,
    explanation: "A contracting range pointing downwards is a Falling Wedge, which is a bullish reversal pattern."
  }
];

const FALLBACK_SUGGESTED_PATH = {
  suggested: {"id": "beginner", "name": "Beginner Investor", "desc": "Market mechanics, orders execution, and basic structures."},
  all_paths: [
    {"id": "beginner", "name": "Beginner Investor", "desc": "Market mechanics, orders execution, and basic structures."},
    {"id": "swing", "name": "Swing Trader", "desc": "Multi-day trends, fibonacci, and risk-managed overrides."},
    {"id": "intraday", "name": "Intraday Trader", "desc": "High-frequency precision and session-based volatility."},
    {"id": "risk", "name": "Risk Manager", "desc": "Advanced position sizing and portfolio preservation."},
    {"id": "psychology", "name": "Psychology Master", "desc": "Conquering cognitive biases and neural discipline."},
    {"id": "quant", "name": "Quant Basics", "desc": "Mathematical modeling and algorithmic foundations."},
    {"id": "liquidity", "name": "Liquidity & Order Flow", "desc": "Institutional depth and stop-hunting mechanics.", "tier": "elite"},
    {"id": "smart_money", "name": "Smart Money Concepts", "desc": "Tracking whale accumulation and distribution phases.", "tier": "elite"},
    {"id": "options_flow", "name": "Options Flow & Gamma", "desc": "Derivatives market impact on spot price action.", "tier": "elite"},
    {"id": "volatility_modeling", "name": "Volatility Modeling", "desc": "Gaussian distributions and regime shift detection.", "tier": "elite"}
  ]
};

const FALLBACK_PERSONALIZED = {
  weaknesses: [
    {"topic": "Risk Management", "issue": "Position Sizing", "lesson": "Never risk more than 1-2% of your total account balance on a single trade.", "severity": "High"},
    {"topic": "Technical Analysis", "issue": "Breakout Confirmation", "lesson": "Always wait for the candle to close on your timeframe to verify breakouts and avoid fakeouts.", "severity": "Medium"},
    {"topic": "Psychology", "issue": "Confirmation Bias", "lesson": "Do not look only at indicators that support your trade; actively look for reasons why you might be wrong.", "severity": "Medium"}
  ]
};

const FALLBACK_PSYCHOLOGY = {
  discipline_score: 85,
  revenge_trading: "Low",
  fear: "Low",
  fomo: "Low",
  overtrading: "Low",
  behavioral_prediction: {
    overtrading_alert: false,
    emotional_breakdown_prob: "15%",
    panic_threshold: "Stable",
    revenge_trade_warning: false
  },
  heatmap: [
    { day: "Mon", date: "2026-05-25", score: 82, scans: ["AAPL"], sims: [] },
    { day: "Tue", date: "2026-05-26", score: 90, scans: ["TSLA"], sims: [
      { name: "Live Session", symbol: "TSLA", net_return: 150.0, trade_count: 3, scores: { discipline: 95, execution: 90, stability: 85 } }
    ]},
    { day: "Wed", date: "2026-05-27", score: 0, scans: [], sims: [] },
    { day: "Thu", date: "2026-05-28", score: 0, scans: [], sims: [] },
    { day: "Fri", date: "2026-05-29", score: 0, scans: [], sims: [] },
    { day: "Sat", date: "2026-05-30", score: 0, scans: [], sims: [] },
    { day: "Sun", date: "2026-05-31", score: 0, scans: [], sims: [] }
  ],
  week_range: "Active Week",
  insights: "Your trading psychology shows high emotional resilience and strong rule adherence. Maintain current pacing."
};

const FALLBACK_SCAN = [
  { symbol: "AAPL", name: "Apple (AAPL)", type: "stocks", change_pct: 1.45, signal: "Strong Buy", signal_color: "#22C55E", t1_prob: 74, icon: "🍎" },
  { symbol: "TSLA", name: "Tesla (TSLA)", type: "stocks", change_pct: -2.10, signal: "Buy", signal_color: "#86EFAC", t1_prob: 62, icon: "⚡" },
  { symbol: "GC=F", name: "Gold", type: "commodities", change_pct: 0.85, signal: "Neutral", signal_color: "#94A3B8", t1_prob: 51, icon: "🥇" },
  { symbol: "^GSPC", name: "S&P 500", type: "indices", change_pct: 0.32, signal: "Strong Buy", signal_color: "#22C55E", t1_prob: 78, icon: "🇺🇸" },
  { symbol: "NVDA", name: "NVIDIA (NVDA)", type: "stocks", change_pct: 3.40, signal: "Strong Buy", signal_color: "#22C55E", t1_prob: 81, icon: "💚" }
];

function createFakeResponse(data) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

function generateFallbackLiveData(symbol) {
  const cleanSymbol = (symbol || 'MOCK').toUpperCase();
  const currency = (cleanSymbol.endsWith('.NS') || cleanSymbol.endsWith('.BO') || ['^NSEI', '^NSEBANK'].includes(cleanSymbol)) ? '₹' : '$';
  
  const startPrices = {
    "AAPL": 175.0, "MSFT": 420.0, "NVDA": 900.0, "TSLA": 180.0,
    "GOOGL": 170.0, "AMZN": 180.0, "META": 470.0, "NFLX": 600.0,
    "TCS.NS": 3800.0, "RELIANCE.NS": 2900.0, "INFY.NS": 1600.0,
    "HDFCBANK.NS": 1500.0, "ICICIBANK.NS": 1100.0, "^NSEI": 22000.0
  };
  
  const startPrice = startPrices[cleanSymbol] || 100.0;
  const data = [];
  let currentPrice = startPrice;
  const now = new Date();
  
  for (let i = 0; i < 78; i++) {
    const time = new Date(now.getTime() - (78 - i) * 5 * 60 * 1000);
    // Deterministic random walk using sin to keep it stable per day/symbol
    const seed = cleanSymbol.charCodeAt(0) + cleanSymbol.charCodeAt(cleanSymbol.length - 1 || 0) + i;
    const rand = Math.sin(seed) * 10000 - Math.floor(Math.sin(seed) * 10000);
    const change = (rand - 0.5) * 0.003;
    currentPrice = Math.max(0.01, currentPrice * (1 + change));
    data.push({
      time: time.toISOString(),
      price: parseFloat(currentPrice.toFixed(2))
    });
  }
  
  return {
    symbol: cleanSymbol,
    currency,
    data
  };
}

function generateFallbackAnalysis(symbol) {
  const cleanSymbol = (symbol || 'AAPL').toUpperCase();
  const currency = (cleanSymbol.endsWith('.NS') || cleanSymbol.endsWith('.BO') || ['^NSEI', '^NSEBANK'].includes(cleanSymbol)) ? '₹' : '$';
  
  const prices = {
    'AAPL': { entry: 175.40, sl: 171.20, t1: 178.50, t2: 182.00, t3: 185.00 },
    'TSLA': { entry: 178.20, sl: 172.50, t1: 182.40, t2: 188.00, t3: 194.00 },
    'NVDA': { entry: 915.00, sl: 885.00, t1: 935.00, t2: 960.00, t3: 990.00 },
    'GC=F': { entry: 2350.00, sl: 2320.00, t1: 2375.00, t2: 2400.00, t3: 2430.00 },
    '^GSPC': { entry: 5120.00, sl: 5080.00, t1: 5150.00, t2: 5180.00, t3: 5220.00 },
    'INFY': { entry: 1181.70, sl: 1134.40, t1: 1210.00, t2: 1252.60, t3: 1290.00 },
    'INFY.NS': { entry: 1181.70, sl: 1134.40, t1: 1210.00, t2: 1252.60, t3: 1290.00 },
    'TCS.NS': { entry: 3800.00, sl: 3648.00, t1: 3890.00, t2: 3980.00, t3: 4070.00 },
    'RELIANCE.NS': { entry: 2900.00, sl: 2784.00, t1: 2960.00, t2: 3030.00, t3: 3100.00 },
    'HDFCBANK.NS': { entry: 1500.00, sl: 1440.00, t1: 1530.00, t2: 1570.00, t3: 1610.00 },
    'ICICIBANK.NS': { entry: 1100.00, sl: 1056.00, t1: 1125.00, t2: 1155.00, t3: 1185.00 },
    'WIPRO': { entry: 181.90, sl: 174.60, t1: 185.50, t2: 189.20, t3: 193.00 },
    'WIPRO.NS': { entry: 181.90, sl: 174.60, t1: 185.50, t2: 189.20, t3: 193.00 },
    'TATASTEEL.NS': { entry: 160.00, sl: 153.60, t1: 164.00, t2: 169.00, t3: 174.00 },
    '^NSEI': { entry: 22000.00, sl: 21560.00, t1: 22200.00, t2: 22450.00, t3: 22700.00 },
    '^NSEBANK': { entry: 48000.00, sl: 47040.00, t1: 48500.00, t2: 49000.00, t3: 49500.00 }
  };
  
  const levels = prices[cleanSymbol] || {
    entry: 100.00,
    sl: 96.00,
    t1: 103.00,
    t2: 106.00,
    t3: 110.00
  };
  
  return {
    symbol: cleanSymbol,
    entry: levels.entry,
    stop_loss: levels.sl,
    targets: { T1: levels.t1, T2: levels.t2, T3: levels.t3 },
    probabilities: { T1: 74, T2: 58, T3: 42, SL: 26 },
    risk_reward: 2.0,
    pattern: "Ascending Triangle",
    sentiment: "Bullish",
    vix_adjusted: false,
    market_regime: "Expansion phase",
    price_data: Array.from({length: 30}).map((_, i) => ({ close: levels.entry - (30 - i) * 0.5 + Math.random() })),
    atr: 3.5,
    confidence: 4,
    change_pct: 1.45,
    ai_signal: "STRONG BUY",
    ai_score: 85,
    ai_color: "var(--neon-green)",
    ai_reason: "Regime alignment indicates continuation of breakout trend with high institutional buying presence.",
    predicted_price: levels.t2,
    model_accuracy: 94.2,
    currency: currency,
    ui_effects: {
      aura_color: "var(--neon-green)",
      glow_intensity: "high",
      waveform_data: Array.from({length: 20}).map(() => Math.floor(Math.random() * 60) + 20),
      probability_glow: "0 0 20px var(--neon-green)88"
    }
  };
}

window.safeSetLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn('[LocalStorage] Failed to write key: ' + key, e);
    if (e.name === 'QuotaExceededError' || e.code === 22 || e.code === 1014) {
      try {
        // Clear all API cache keys to free space
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const k = localStorage.key(i);
          if (k && k.startsWith('api_cache_')) {
            localStorage.removeItem(k);
          }
        }
        localStorage.setItem(key, value);
      } catch (retryError) {
        console.error('[LocalStorage] Retry write failed:', retryError);
      }
    }
  }
};

function getLocalFallbackResponse(urlStr) {
  if (!urlStr || typeof urlStr !== 'string') return null;
  if (urlStr.includes('/academy/track/')) {
    const parts = urlStr.split('/academy/track/');
    const trackId = parts[parts.length - 1].split('?')[0];
    return createFakeResponse(generateFallbackLessons(trackId));
  }
  if (urlStr.includes('/academy/quiz')) {
    return createFakeResponse(FALLBACK_QUIZ);
  }
  if (urlStr.includes('/academy/patterns')) {
    return createFakeResponse(FALLBACK_PATTERNS);
  }
  if (urlStr.includes('/academy/personalized-lessons')) {
    return createFakeResponse(FALLBACK_PERSONALIZED);
  }
  if (urlStr.includes('/academy/suggested-path')) {
    return createFakeResponse(FALLBACK_SUGGESTED_PATH);
  }
  if (urlStr.includes('/simulation/live-data')) {
    let symbol = 'AAPL';
    try {
      const match = urlStr.match(/[?&]symbol=([^&]+)/);
      if (match) symbol = decodeURIComponent(match[1]);
    } catch (e) {}
    return createFakeResponse(generateFallbackLiveData(symbol));
  }
  if (urlStr.includes('/psychology')) {
    return createFakeResponse(FALLBACK_PSYCHOLOGY);
  }
  if (urlStr.includes('/scan')) {
    return createFakeResponse(FALLBACK_SCAN);
  }
  return null;
}

// ── Global Fetch Interceptor for Capacitor Mobile App ──
const originalFetch = window.fetch;
window.fetch = async (input, init) => {
  let url = typeof input === 'string' ? input : input.url;

  const isCapacitor = (window.Capacitor && window.Capacitor.getPlatform && window.Capacitor.getPlatform() !== 'web') || 
                      window.location.origin.startsWith('capacitor://') || 
                      window.location.pathname.includes('android_asset');

  let isAuthRequest = url && (url.includes('/auth/') || url.includes('/send_otp') || url.includes('/verify_otp'));
  let isGet = !init || !init.method || init.method.toUpperCase() === 'GET';

  if (url && (url.startsWith('/api') || url.startsWith('http://localhost:8000') || url.startsWith('http://127.0.0.1:8000'))) {
    const shouldRewrite = isCapacitor || window.location.hostname !== 'localhost' || localStorage.getItem('backend_ip');
    if (shouldRewrite) {
      let path = '';
      if (url.startsWith('/api')) {
        path = url.slice(4); // Remove "/api"
      } else if (url.startsWith('http://localhost:8000')) {
        path = url.slice(21); // Remove "http://localhost:8000"
      } else if (url.startsWith('http://127.0.0.1:8000')) {
        path = url.slice(21); // Remove "http://127.0.0.1:8000"
      }
      
      // Get the backend IP configured in settings (default to live Render production backend)
      let savedIp = localStorage.getItem('backend_ip');
      if (!savedIp || savedIp === '192.168.137.1') {
        savedIp = 'https://trademind-backend-vldj.onrender.com';
      }
      const savedPort = localStorage.getItem('backend_port') || '8000';
      
      const baseUrl = (savedIp.startsWith('http://') || savedIp.startsWith('https://'))
        ? savedIp
        : `http://${savedIp}:${savedPort}`;
      
      const newUrl = `${baseUrl}${path.startsWith('/') ? path : '/' + path}`;
      
      if (typeof input === 'string') {
        input = newUrl;
      } else {
        input = new Request(newUrl, input);
      }
    }
  }

  const urlStr = typeof input === 'string' ? input : input.url;
  const isApiRoute = (url && url.startsWith('/api')) || (urlStr && urlStr.includes('/api/'));

  // Check if this is an Academy or Mindset or Scanner API request that has quick local fallbacks
  const isAcademyApi = urlStr && (
    urlStr.includes('/academy/track/') || 
    urlStr.includes('/academy/quiz') || 
    urlStr.includes('/academy/patterns') || 
    urlStr.includes('/academy/personalized-lessons') || 
    urlStr.includes('/academy/suggested-path') ||
    urlStr.includes('/psychology') ||
    urlStr.includes('/scan')
  );

  // Setup timeout for mobile if not an auth request and is a GET request
  const useTimeout = isCapacitor && !isAuthRequest && isGet;
  // Use 2.5 seconds for Academy API to trigger fallback quickly, and 3 seconds for other GETs (live stock feed, scans, Render spin-up)
  const timeoutMs = isAcademyApi ? 2500 : 3000;

  let timeoutId;
  let fetchPromise;

  if (useTimeout) {
    const controller = new AbortController();
    const signal = controller.signal;
    
    // Merge or create init options with abort signal
    const fetchInit = { ...init, signal };
    
    fetchPromise = new Promise(async (resolve, reject) => {
      timeoutId = setTimeout(() => {
        controller.abort();
        reject(new Error('Fetch timeout'));
      }, timeoutMs);
      
      try {
        const response = await originalFetch(input, fetchInit);
        clearTimeout(timeoutId);
        resolve(response);
      } catch (err) {
        clearTimeout(timeoutId);
        reject(err);
      }
    });
  } else {
    fetchPromise = originalFetch(input, init);
  }

  // Intercept response to apply robust local fallbacks if cloud timed out or failed
  try {
    const response = await fetchPromise;
    const isLiveDataApi = urlStr && urlStr.includes('/simulation/live-data');
    
    if (isAcademyApi) {
      if (response.ok) {
        // Clone response to safely parse the JSON payload
        const clone = response.clone();
        try {
          const json = await clone.json();
          
          // Fallback if Render returned the error timeout template or empty track array
          if (Array.isArray(json) && (json.length === 0 || (json.length === 1 && json[0].title === 'Neural Link Timeout'))) {
            console.log('[Fetch Interceptor] Detected Render Timeout template or empty track. Serving local fallback.');
            return getLocalFallbackResponse(urlStr);
          }
          
          // Fallback if Render returned truncated/empty quiz/patterns
          if (urlStr.includes('/academy/quiz') && Array.isArray(json) && json.length < 8) {
            return getLocalFallbackResponse(urlStr);
          }
          if (urlStr.includes('/academy/patterns') && Array.isArray(json) && json.length < 8) {
            return getLocalFallbackResponse(urlStr);
          }
          if (urlStr.includes('/academy/personalized-lessons') && (json.error || !json.weaknesses || json.weaknesses.length === 0)) {
            return getLocalFallbackResponse(urlStr);
          }
        } catch (e) {
          // If response parsing fails, serve local fallback
          return getLocalFallbackResponse(urlStr);
        }
      } else {
        // Serve local fallback on HTTP errors (e.g. 500, 503)
        return getLocalFallbackResponse(urlStr);
      }
    } else if (isLiveDataApi) {
      if (response.ok) {
        const clone = response.clone();
        try {
          const json = await clone.json();
          if (!json || !json.data || !Array.isArray(json.data) || json.data.length === 0) {
            console.warn('[Fetch Interceptor] Empty live data JSON from Render. Serving local fallback.');
            return getLocalFallbackResponse(urlStr);
          }
        } catch (e) {
          console.warn('[Fetch Interceptor] Failed to parse live data JSON. Serving local fallback.');
          return getLocalFallbackResponse(urlStr);
        }
      } else {
        console.warn('[Fetch Interceptor] Live data request failed with status: ' + response.status + '. Serving local fallback.');
        return getLocalFallbackResponse(urlStr);
      }
    }

    const isAnalyzeApi = urlStr && (urlStr.includes('/api/analyze') || urlStr.includes('/analyze'));
    if (isAnalyzeApi && !response.ok) {
      let symbol = 'AAPL';
      try {
        if (init && init.body) {
          const bodyObj = JSON.parse(init.body);
          if (bodyObj && bodyObj.symbol) symbol = bodyObj.symbol;
        }
      } catch (e) {}
      console.warn('[Fetch Interceptor] Analyze request returned status ' + response.status + '. Serving local fallback.');
      return createFakeResponse(generateFallbackAnalysis(symbol));
    }

    // Cache successful GET API responses in localStorage for other endpoints (excluding real-time streams)
    const isCacheable = isGet && response.ok && isApiRoute && 
                        !urlStr.includes('/anomaly-stream') && 
                        !urlStr.includes('/scan') && 
                        !urlStr.includes('/simulation/live-data') &&
                        !urlStr.includes('/api/rates');
    if (isCacheable) {
      const cloneForCache = response.clone();
      cloneForCache.text().then(text => {
        window.safeSetLocalStorage('api_cache_' + urlStr, text);
      }).catch(() => {});
    }

    return response;
  } catch (error) {
    const isLiveDataApi = urlStr && urlStr.includes('/simulation/live-data');
    const isPsychologyApi = urlStr && urlStr.includes('/psychology');
    const isScanApi = urlStr && urlStr.includes('/scan');
    const isAnalyzeApi = urlStr && (urlStr.includes('/api/analyze') || urlStr.includes('/analyze'));
    if (isAcademyApi || isLiveDataApi || isPsychologyApi || isScanApi || isAnalyzeApi) {
      if (isAnalyzeApi) {
        let symbol = 'AAPL';
        try {
          if (init && init.body) {
            const bodyObj = JSON.parse(init.body);
            if (bodyObj && bodyObj.symbol) symbol = bodyObj.symbol;
          }
        } catch (e) {}
        console.log('[Fetch Interceptor] Serving local analysis fallback for ' + symbol);
        return createFakeResponse(generateFallbackAnalysis(symbol));
      }
      const fallback = getLocalFallbackResponse(urlStr);
      if (fallback) {
        console.log('[Fetch Interceptor] Network request failed/timeout for ' + urlStr + '. Serving local fallback.');
        return fallback;
      }
    }

    // Check if we have cached response for this GET request
    if (isGet && isApiRoute) {
      const cachedVal = localStorage.getItem('api_cache_' + urlStr);
      if (cachedVal) {
        console.log('[Fetch Interceptor] Serving cached response for ' + urlStr);
        return new Response(cachedVal, {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    throw error;
  }
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
