export default {
  autoFormat (value, addSign = false, allowMicro = true) {
    var significantDigits = 0
    const abs = Math.abs(value)
    if (abs === 0) {
      return 0
    }

    if (abs < 0.000001 && allowMicro) {
      significantDigits = 11
    } else if (abs < 0.001 && allowMicro) {
      significantDigits = 8
    } else if (abs < 0.1 && allowMicro) {
      significantDigits = 5
    } else if (abs < 1000) {
      significantDigits = 2
    }

    const sign = (addSign && value > 0) ? '+' : ''

    if (allowMicro && significantDigits > 6) {
      return sign + (value * 1000000).toFixed(significantDigits - 6) + 'μ'
    }
    return sign + value.toFixed(significantDigits)
  }
}
