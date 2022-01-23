export default {
  addNested (collection, key1, dao) {
    if (key1 in collection) {
      collection[key1].push(dao)
    } else {
      collection[key1] = [dao]
    }
  }
}
