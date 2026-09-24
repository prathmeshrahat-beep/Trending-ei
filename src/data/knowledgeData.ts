import { KnowledgeTopic } from '../types';

export const KNOWLEDGE_TOPICS: KnowledgeTopic[] = [
  {
    id: 'candlesticks',
    title: 'Candlestick Anatomy & Psychology',
    category: 'basics',
    summary: 'Understanding the Open, High, Low, Close (OHLC), real body, and upper/lower wicks to decipher buyer vs. seller dominance.',
    content: `
A Japanese candlestick displays four fundamental data points for any chosen timeframe:
1. Open: The first traded price of the interval.
2. High: The peak price reached during the session.
3. Low: The floor price reached during the session.
4. Close: The final executed price before the candle completed.

Psychology of the Parts:
• Green Body: Buyers pushed price significantly higher than the open.
• Red Body: Sellers overwhelmed demand and forced price down below the open.
• Upper Wick: Demonstrates rejection from overhead supply—buyers tried to push higher but were pushed back.
• Lower Wick: Shows defense at lower prices—sellers tried to dump, but buyers stepped in to absorb liquidity.
• Long Lower Wick (Hammer / Pin Bar): Often signals potential trend reversal at support.
• Long Upper Wick (Shooting Star): Often signals price exhaustion at resistance.
    `.trim(),
    keyTakeaways: [
      'Wicks show price rejection; bodies show conviction.',
      'Never trade a single candlestick in isolation; always look at where it forms relative to support and resistance.',
      'Higher timeframe candles (Daily, 4-Hour) are far more reliable than 1-minute noise.',
    ],
  },
  {
    id: 'market_structure',
    title: 'Market Structure (HH, HL, LH, LL)',
    category: 'technical',
    summary: 'The foundational architecture of trends: identifying structural pivot points, trend transitions, and breaks of structure (BOS).',
    content: `
Market structure tracks how price moves across time through distinct structural phases:
• Uptrend (Bullish Structure): Characterized by Higher Highs (HH) followed by Higher Lows (HL).
• Downtrend (Bearish Structure): Characterized by Lower Highs (LH) followed by Lower Lows (LL).
• Range / Consolidation: Price oscillates between equal highs and equal lows without directional progress.

Break of Structure (BOS):
When price in an uptrend closes firmly below the most recent Higher Low, it indicates a structural shift. Conversely, in a downtrend, closing above the last Lower High signals a potential trend reversal.
    `.trim(),
    keyTakeaways: [
      'Trade with the prevailing higher-timeframe market structure.',
      'A trend is valid until a structural pivot is broken with volume.',
      'Avoid counter-trend trades without a verified break of structure.',
    ],
  },
  {
    id: 'price_action',
    title: 'Pure Price Action Trading',
    category: 'technical',
    summary: 'Analyzing naked charts using price movement, swings, and bar characteristics without cluttering screens with lagging indicators.',
    content: `
Price Action is the discipline of making trading decisions based exclusively on the movement of price itself.
Key Components:
1. Swing Highs & Lows: Identifying where institutions took action.
2. Momentum & Velocity: How fast or slow candles are expanding.
3. Consolidation vs Expansion: Markets alternate between compression (low volatility) and expansion (high volatility impulses).
4. False Breakouts (Liquidity Sweeps): Price spikes past a key level to trigger retail stops, then rapidly reverses back inside.
    `.trim(),
    keyTakeaways: [
      'Price is the only real-time truth; all traditional indicators lag price.',
      'Focus on the reaction at key levels rather than predicting direction.',
    ],
  },
  {
    id: 'support_resistance',
    title: 'Support & Resistance Dynamics',
    category: 'technical',
    summary: 'Identifying supply and demand zones where price historically reverses, consolidates, or breaks through.',
    content: `
Support is a price level where buying interest is strong enough to overcome selling pressure and halt a decline.
Resistance is a price ceiling where selling pressure overpowers buying momentum.

Role Reversal Principle:
When a strong resistance level is definitively broken to the upside, it frequently flips into a new support level during subsequent pullbacks (and vice versa).
    `.trim(),
    keyTakeaways: [
      'Support and resistance are zones or bands, not single rigid lines.',
      'The more times a level is tested, the weaker it often becomes as resting orders are consumed.',
      'Always wait for candle close confirmation around key zones.',
    ],
  },
  {
    id: 'volume_liquidity',
    title: 'Volume & Institutional Liquidity',
    category: 'technical',
    summary: 'Deciphering smart-money footprint, order book liquidity pockets, stop runs, and volume confirmation.',
    content: `
Volume is the fuel of the market. High volume indicates substantial institutional participation, while low volume signals lack of commitment.
Liquidity refers to areas where many resting stop-loss orders congregate (e.g. just above prominent double tops or just below prominent swing lows).
Institutions need massive liquidity to fill their orders without slippage, so price is often driven toward these stop clusters before true direction unfolds.
    `.trim(),
    keyTakeaways: [
      'Breakouts on declining volume are prone to failure.',
      'Recognize liquidity pools above obvious swing highs and below swing lows.',
      'Smart money accumulates in low volatility and distributes into high-volume retail excitement.',
    ],
  },
  {
    id: 'risk_management',
    title: 'The Golden Rule of Risk Management',
    category: 'risk',
    summary: 'Why risk control is the single most important factor determining whether a trader survives and compounds capital.',
    content: `
No matter how skilled an analyst is, every trade has an uncertain outcome. Risk management ensures that a string of inevitable losses does not destroy your trading capital.

The 1% - 2% Rule:
Never risk more than 1% to 2% of your total account equity on any single trade.
For example, in a $10,000 account, a 1% risk means if your stop-loss is hit, your loss is strictly capped at $100.
    `.trim(),
    keyTakeaways: [
      'Preservation of capital is priority number one.',
      'With proper risk management, a trader with even a 40% win rate can remain highly profitable using 1:2.5 risk-to-reward ratios.',
      'Never trade without a pre-calculated invalidation point.',
    ],
  },
  {
    id: 'position_sizing',
    title: 'Position Sizing Formula',
    category: 'risk',
    summary: 'The exact mathematical formula to determine how many shares or contracts to purchase based on your stop-loss distance.',
    content: `
Position Size Formula:
Position Size = (Account Capital × Risk %) / |Entry Price - Stop Loss Price|

Example:
• Account: ₹500,000
• Max Risk (1%): ₹5,000
• Entry Price: ₹2,500
• Stop Loss Price: ₹2,450
• Stop Distance: ₹50 per share
• Position Size = ₹5,000 / ₹50 = 100 shares.
Notice that the position size is determined by the stop-loss distance, NOT by gut feeling!
    `.trim(),
    keyTakeaways: [
      'Wider stop-losses require smaller position sizes.',
      'Tighter stop-losses allow larger position sizes, but require precise entry timing.',
    ],
  },
  {
    id: 'stop_loss_take_profit',
    title: 'Stop Loss & Take Profit Discipline',
    category: 'risk',
    summary: 'How to place technical stop-losses beyond noise and establish systematic partial take-profit levels.',
    content: `
A Stop Loss is an automatic exit order that closes a losing trade at a predetermined price to prevent catastrophic drawdowns.
Where to place a Stop Loss:
• Long trade: Place the stop-loss just below the preceding swing low or key structural support, factoring in market volatility (ATR).
• Short trade: Place the stop-loss just above the preceding swing high or key resistance.

Take Profit (TP):
Target logical structural areas such as the next major liquidity pool, un-tested resistance, or Fibonacci extension levels.
    `.trim(),
    keyTakeaways: [
      'Never widen or remove a stop-loss during an active losing trade.',
      'Scale out (e.g. take 50% profit at 1:1.5 RR and move stop to breakeven) to de-risk trades.',
    ],
  },
  {
    id: 'leverage_margin',
    title: 'Leverage & Margin Mechanics',
    category: 'risk',
    summary: 'The double-edged sword of borrowed funds, liquidation thresholds, and avoiding account wipeouts.',
    content: `
Leverage allows a trader to control a large position with a small amount of initial margin capital (e.g., 5x, 10x, 20x).
While leverage magnifies profits, it magnifies losses by the exact same multiplier.

Liquidation Risk:
At 10x leverage, a 10% move against you completely liquidates your margin (100% loss).
At 20x leverage, a mere 5% counter move causes complete liquidation.
    `.trim(),
    keyTakeaways: [
      'High leverage without strict stop-loss rules is financial gambling.',
      'Professional traders keep effective leverage modest (typically 1x to 3x).',
      'Always calculate your liquidation price before executing leveraged trades.',
    ],
  },
  {
    id: 'order_types',
    title: 'Market, Limit, & Stop Orders',
    category: 'basics',
    summary: 'The mechanics of order execution: when to use aggressive taker orders vs. passive maker orders.',
    content: `
1. Market Order: Executes immediately at the best currently available market price. Guarantees execution, but subject to slippage in volatile or illiquid conditions.
2. Limit Order: An order to buy at or below a specified price, or sell at or above a specified price. Guarantees price, but execution is not guaranteed if price turns away.
3. Stop-Market Order: Becomes an active market order as soon as a trigger price is touched (used for stop-losses).
4. Stop-Limit Order: Places a limit order once the stop price is triggered (carries risk of non-execution in flash crashes).
    `.trim(),
    keyTakeaways: [
      'Use Limit orders when entering pullbacks to save on fees and avoid slippage.',
      'Use Market or Stop-Market for emergency risk exits.',
    ],
  },
  {
    id: 'instruments_comparison',
    title: 'Spot, Futures, Options, Forex & Stocks',
    category: 'instruments',
    summary: 'A side-by-side comparison of asset classes: settlement, contract specifications, and risk profiles.',
    content: `
• Spot: Direct ownership of the underlying asset (stocks, crypto). No expiry, no liquidation risk from price fluctuations alone.
• Futures: Derivative contracts agreeing to buy or sell at a predetermined future price. High leverage, mark-to-market daily settlement.
• Options: Contracts giving the right (not obligation) to buy (Call) or sell (Put) at a strike price before expiry. Non-linear risk; options buyers face time-decay (Theta).
• Forex: 24/5 global decentralized currency exchange traded in lots (standard, mini, micro).
• Equities / Stocks: Ownership shares in public corporations (NSE, BSE, NYSE, NASDAQ).
    `.trim(),
    keyTakeaways: [
      'Beginners should master Spot or Cash equities before experimenting with derivatives.',
      'Options buying requires both direction and timing to be correct.',
    ],
  },
];
