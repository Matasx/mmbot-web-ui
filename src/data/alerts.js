export default {
  data: {
    unknown: ['Alert with no description', 'alert'],
    below_minsize: ['Order size below allowed minimum', 'too small'],
    accept_loss: ['Strategy reset - accept loss', 'acpt.loss'],
    max_cost: ['Max costs limit reached', 'max cost'],
    no_funds: ['Low funds on account', 'no funds'],
    max_leverage: ['Max leverage reached', 'max lev.'],
    out_of_budget: ['Strategy out of budget', '0-budget'],
    position_limit: ['Position limit reached', 'pos.limit'],
    strategy_enforced: ['Enforced by the strategy (alert for strategy)', 'marked'],
    strategy_outofsync: ['Strategy out of sync - trying to fix', 'resync.'],
    initial_reset: ['Initial reset', 'reset']
  },
  lookup (type) {
    return this.data[type] || this.data.unknown
  }
}
