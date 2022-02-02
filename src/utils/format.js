export default {
  autoFormat (value, addSign = false, allowMicro = true) {
    if (value === undefined) {
      return 'N/A'
    }

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
    } else if (abs < 10) {
      significantDigits = 4
    } else if (abs < 100) {
      significantDigits = 3
    } else if (abs < 1000) {
      significantDigits = 2
    }
    const sign = (addSign && value > 0) ? '+' : ''

    if (abs >= 1000000) {
      return sign + (value * 0.000001).toFixed(2) + 'M'
    }
    if (allowMicro && significantDigits > 6) {
      return sign + (value * 1000000).toFixed(significantDigits - 6) + 'μ'
    }
    return sign + Number(value.toFixed(significantDigits))
  }
}
