export const TIMELINE_EVENTS = [
  { id: 't1', week: 'Week -6', title: 'Normal Stock (-1.9%)', alert: false },
  { id: 't2', week: 'Week -5', title: 'Baseline Sales Est.', alert: false },
  { id: 't3', week: 'Week -4', title: '🚨 THE SIGNAL (116% Spike)', alert: true },
  { id: 't4', week: 'Week -3', title: 'Hoarding Continues (+29%)', alert: false },
  { id: 't5', week: 'Week -2', title: 'Stock Depleting Rapidly', alert: false },
  { id: 't6', week: 'Week -1', title: 'Critical Depletion', alert: false },
  { id: 't7', week: 'Week 0',  title: 'COMPETITOR MBO STRIKES', alert: true },
];

export const FLOW_NODES = [
  { id: '1', type: 'custom', position: { x: 50, y: 100 }, data: { label: 'Macro Event', sublabel: 'Winter Resp Surge', color: 'gray' } },
  { id: '2', type: 'custom', position: { x: 50, y: 250 }, data: { label: 'Macro Event', sublabel: 'Hurricane Plastics', color: 'gray' } },
  { id: '3', type: 'custom', position: { x: 350, y: 175 }, data: { label: '4-Week Lead Indicator', sublabel: '+116% Volume Spike', color: 'red', image: '/Warning.png', isAlert: true } },
  { id: '4', type: 'custom', position: { x: 670, y: 80 }, data: { label: 'High Risk Catgeory', sublabel: 'Feeding Tubes (+4536%)', color: 'red', isAlert: true } },
  { id: '5', type: 'custom', position: { x: 670, y: 270 }, data: { label: 'High Risk Category', sublabel: 'Endotracheal Tubes (+1741%)', color: 'red', isAlert: true } },
  { id: '6', type: 'custom', position: { x: 990, y: 175 }, data: { label: 'PREDICTION ENGINE', sublabel: 'Data Pattern Detected', color: 'navy', image: '/Center.png' } },
  { id: '7', type: 'custom', position: { x: 1350, y: 175 }, data: { label: 'Strategic Response', sublabel: 'Proactive Substitution', color: 'green' } },
  { id: '8', type: 'custom', position: { x: 1650, y: 175 }, data: { label: 'Financial Impact', sublabel: '$2.6B Revenue Captured', color: 'green', image: '/Revenue.png' } }
];

export const FLOW_EDGES = [
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#9CA3AF', strokeWidth: 2 } },
  { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#9CA3AF', strokeWidth: 2 } },
  { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#EF4444', strokeWidth: 3 } },
  { id: 'e3-5', source: '3', target: '5', animated: true, style: { stroke: '#EF4444', strokeWidth: 3 } },
  { id: 'e4-6', source: '4', target: '6', animated: true, style: { stroke: '#9CA3AF', strokeWidth: 2 } },
  { id: 'e5-6', source: '5', target: '6', animated: true, style: { stroke: '#9CA3AF', strokeWidth: 2 } },
  { id: 'e6-7', source: '6', target: '7', animated: true, style: { stroke: '#10B981', strokeWidth: 3 } },
  { id: 'e7-8', source: '7', target: '8', animated: true, style: { stroke: '#10B981', strokeWidth: 3 } }
];

export const CONTENT_DB = {
  '1': {
    title: 'Macro Event: Winter Respiratory Surge',
    desc: 'Seasonal surges strain existing supply chains.',
    whatItMeans: 'During peak flu and RSV seasons, respiratory care units experience extreme patient volume. This creates a highly fragile supply chain for critical care items like Endotracheal tubes, meaning any minor disruption can trigger immediate hoarding.',
    medlineAction: 'Medline algorithms must increase sensitivity during Q4 and Q1 for any sudden volume spikes in the anesthesia and respiratory categories.'
  },
  '2': {
    title: 'Macro Event: Hurricane Plastics Disruption',
    desc: 'Environmental shocks to raw material manufacturing.',
    whatItMeans: 'When major hurricanes hit the Gulf Coast, petrochemical plants shut down. This creates an industry-wide shortage of the raw plastics required for medical consumables like feeding and drainage tubes.',
    medlineAction: 'When weather intelligence predicts major Gulf disruptions, Medline immediately models which specific SKU categories are most reliant on the affected raw materials and begins pre-stocking alternatives.'
  },
  '6': {
    title: 'MEDLINE PREDICTION ENGINE',
    desc: 'The algorithmic core processing market signals.',
    whatItMeans: 'This engine constantly ingests thousands of data points across the competitor landscape, establishing historical baseline volumes for every single hospital supply SKU and calculating their week-over-week burn rates.',
    medlineAction: 'When the engine mathematically detects the footprint of panic hoarding (specifically surpassing a +100% volume spike), it automatically issues action-alerts to the Medline sales floor targeting the exact categories tracked.'
  },
  '7': {
    title: 'Strategic Response: Substitution',
    desc: 'The boots-on-the-ground sales execution phase.',
    whatItMeans: 'An algorithmic alert is only useful if acted upon. This node represents our Medline sales force instantly receiving a prioritized calling list of specific hospitals that triggered the hoarding flags.',
    medlineAction: 'Because they have an exclusive 28-day head start, Medline sales reps can proactively contact these panicking hospitals and secure their future supply using Medline equivalent SKUs, locking the competitor out.'
  },
  't1': {
    title: 'Week -6: Normal Market',
    desc: 'Supply chains are functioning nominally.',
    whatItMeans: 'Six weeks before the competitor backorder strikes, hospital order volumes are completely normal. Stock depletion is sitting at a healthy -1.9% week-over-week.',
    medlineAction: 'The Prediction Engine monitors these early weeks strictly to establish a reliable volume baseline. Without knowing the baseline, we cannot mathematically detect an anomaly later.'
  },
  't2': {
    title: 'Week -5: Baseline Sales Est.',
    desc: 'The final week of normal operations.',
    whatItMeans: 'Rumors of a competitor shortage may be starting internally, but the purchasing data has not shifted yet. Hospitals are ordering exactly as they historically have.',
    medlineAction: 'No action required. The system is armed and tracking week-over-week variance.'
  },
  't4': {
    title: 'Week -3: Sustained Hoarding',
    desc: 'The panic buying event stabilizes at an elevated rate.',
    whatItMeans: 'Following the massive initial 116% hoarding wave in Week -4, order volumes remain elevated at +29% above baseline as the slower-moving hospitals try to aggressively secure stock.',
    medlineAction: 'Medline sales teams must aggressively execute the substitution strategy. Time is rapidly running out before the competitor officially stocks out.'
  },
  't5': {
    title: 'Week -2: Rapid Depletion',
    desc: 'The competitor supply inventory is bleeding out.',
    whatItMeans: 'Massive hoarding combined with normal hospital usage is destroying the competitor\'s inventory flow. Logistics wait-times are increasing, and the depletion rate accelerates to +7.8% WoW.',
    medlineAction: 'Hospitals are now actively feeling the pinch from the competitor. This is the optimal time for Medline to close substitution contracts with any late-adopters.'
  },
  't6': {
    title: 'Week -1: Critical Supply Failure',
    desc: 'The final days of remaining competitor inventory.',
    whatItMeans: 'The competitor is functionally out of stock but may not have officially announced the MBO (Manufacturer Backorder) status yet. Inventory depletion is at its most critical (+12.3%).',
    medlineAction: 'Medline should be finalizing all cross-reference conversions and preparing distribution centers for the massive influx of newly acquired volume.'
  },
  't3': {
    title: 'The Warning Sign (Week -4)',
    desc: 'The exact moment panic buying is mathematically detectable.',
    whatItMeans: 'When hospitals fear an upcoming supply shortage, they quietly and aggressively start hoarding items. Our system detects this hoarding pattern as a massive 116.3% sales volume spike that triggers exactly 28 days before the competitor actually runs out of stock.',
    medlineAction: 'By scanning competitor data for this specific +100% volume spike, Medline sales reps receive an automated 4-week head start to call these panicking hospitals and switch them to Medline-branded products before the competitor backorder hits.',
    stats: [
      { label: 'Panic Buy Spike', value: '+116.3%', color: 'red' },
      { label: 'Order Size Expansion', value: '+23.0%', color: 'navy' }
    ],
    chartData: [
      { name: 'W-6', BurnRate: -1.92, PanicBuy: 21.12 },
      { name: 'W-5', BurnRate: -0.90, PanicBuy: 25.83 },
      { name: 'W-4', BurnRate: 2.90, PanicBuy: 116.30 },
      { name: 'W-3', BurnRate: 6.62, PanicBuy: 29.48 },
      { name: 'W-2', BurnRate: 7.81, PanicBuy: 32.31 }
    ]
  },
  '3': { 
    title: 'The Warning Sign (4 Weeks Prior)',
    desc: 'The exact moment panic buying is mathematically detectable.',
    whatItMeans: 'When hospitals fear an upcoming supply shortage, they quietly and aggressively start hoarding items. Our system detects this hoarding pattern as a massive 116.3% sales volume spike that triggers exactly 28 days before the competitor actually runs out of stock.',
    medlineAction: 'By scanning competitor data for this specific +100% volume spike, Medline sales reps receive an automated 4-week head start to call these panicking hospitals and switch them to Medline-branded products before the competitor backorder hits.',
    stats: [
      { label: 'Predictive Sales Spike', value: '+116.3%', color: 'red' },
      { label: 'Avg Depletion Rate', value: '+12.3%', color: 'navy' }
    ],
    chartData: [
      { name: 'W-6', BurnRate: -1.92, PanicBuy: 21.12 },
      { name: 'W-5', BurnRate: -0.90, PanicBuy: 25.83 },
      { name: 'W-4', BurnRate: 2.90, PanicBuy: 116.30 },
      { name: 'W-3', BurnRate: 6.62, PanicBuy: 29.48 },
      { name: 'W-2', BurnRate: 7.81, PanicBuy: 32.31 }
    ]
  },
  't7': {
    title: 'Week 0: Backorder Realized',
    desc: 'The competitor officially runs out of inventory.',
    whatItMeans: 'The competitor supply chain has failed entirely, forcing unstructured hospitals to seek immediate, desperate alternatives.',
    medlineAction: 'Any hospital that we did not capture during the 4-week warning window will now be flooding our distribution lines frantically seeking emergency substitutes.'
  },
  '8': {
    title: 'Financial Revenue Capture',
    desc: 'Converting the competitor supply failure into Medline top-line growth.',
    whatItMeans: 'There is $10.5 Billion worth of volume experiencing extreme hoarding in the weeks leading up to backorders. Crucially, these are only items for which Medline has an exact direct substitute.',
    medlineAction: 'If our sales force uses the 4-week warning gap to capture just 25% of that panic-buying volume and transitions it to Medline equivalents, we gain massive permanent market revenue entirely at our competitor\'s expense.',
    stats: [
      { label: 'Addressable Market', value: '$10.5B', color: 'navy' },
      { label: 'Moderate Capture', value: '$2.62B', color: 'green' }
    ],
    revenueData: [
      { name: 'Conservative', Value: 1.05 },
      { name: 'Moderate Goal', Value: 2.62 },
      { name: 'Aggressive', Value: 5.25 }
    ]
  },
  '4': {
    title: 'High Risk: Feeding Tubes',
    desc: 'The product line experiencing the most brutal supply shocks.',
    whatItMeans: 'Our data isolation shows hoarding is not spread evenly. Nutritionals and Gastric Sump tubes exhibit a catastrophic 4,536% spike 4 weeks before their MBO.',
    medlineAction: 'Alert the supply chain directly: any hospital spiking in Feeding Tube volume should be universally prioritized for proactive Medline substitution calls before any other category.',
    stats: [
      { label: 'Hoarding Intensity', value: '+4,536%', color: 'red' },
      { label: 'Vulnerable SKUs', value: '5', color: 'navy' }
    ]
  },
  '5': {
    title: 'High Risk: Endotracheal',
    desc: 'Anesthesia Systems face severe shortages leading into respiratory curves.',
    whatItMeans: 'Winter respiratory surgeries drive extreme stress onto endotracheal supplies. They feature a severe 1,741% sustained hoarding spike precisely 4 weeks prior to backorder.',
    medlineAction: 'Our algorithm must rank Endotracheal items as Tier 1 targets immediately upon any volume crossing the 100% threshold.',
    stats: [
      { label: 'Hoarding Intensity', value: '+1,741%', color: 'red' },
      { label: 'Vulnerable SKUs', value: '30', color: 'navy' }
    ]
  }
};
