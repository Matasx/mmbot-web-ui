export default {
  price: {
    order: 1,
    title: 'Trade price / Neutral price',
    yTitle: 'Price',
    value: 'price',
    unit: 'currencyInfo',
    secondaryTitle: 'Neutral price',
    secondaryValue: 'p0'
  },
  neutraldist: {
    order: 2,
    title: 'Distance to neutral price',
    yTitle: 'Price dist.',
    value: 'dp0',
    unit: 'currencyInfo'
  },
  profit: {
    order: 3,
    title: 'Equity change / realized P&L',
    yTitle: 'P&L',
    value: 'pl',
    unit: 'currencyInfo',
    secondaryTitle: 'Realized P&L',
    secondaryValue: 'rpl'
  },
  dailyProfit: {
    order: 4,
    sourceName: 'dailyAggregations',
    type: 'column',
    title: 'Daily realized P&L',
    yTitle: 'P&L',
    value: 'rplDiff',
    unit: 'currencyInfo'
  },
  position: {
    order: 5,
    title: 'Position',
    yTitle: 'Asset',
    value: 'pos',
    flipOrderTitles: true
  },
  norm: {
    order: 6,
    title: 'Normalized profit',
    yTitle: 'P&L',
    value: 'norm',
    unit: 'currencyInfo'
  },
  trades: {
    order: 7,
    title: 'Trades',
    yTitle: 'Size',
    value: 'achg',
    flipOrderTitles: true
  }
}
