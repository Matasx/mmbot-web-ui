Array.prototype.binaryFind = function (searchElement, compareFn) {
  var minIndex = 0
  var maxIndex = this.length - 1
  var currentIndex
  var currentElement

  // todo: optimize ... in most cases we are searching for item out of bounds of the array
  if (this.length === 0) {
    return {
      found: false,
      index: 0,
      element: undefined
    }
  }

  while (minIndex <= maxIndex) {
    currentIndex = (minIndex + maxIndex) / 2 | 0
    currentElement = this[currentIndex]

    const cmp = compareFn(currentElement, searchElement)
    if (cmp < 0) {
      minIndex = currentIndex + 1
    } else if (cmp > 0) {
      maxIndex = currentIndex - 1
    } else {
      return {
        found: true,
        index: currentIndex,
        element: currentElement
      }
    }
  }

  return {
    found: false,
    index: compareFn(currentElement, searchElement) < 0 ? currentIndex + 1 : currentIndex,
    element: undefined
  }
}

Array.prototype.addSorted = function (element, compareFn) {
  var res = this.binaryFind(element, compareFn)
  this.splice(res.index, 0, element)
}
