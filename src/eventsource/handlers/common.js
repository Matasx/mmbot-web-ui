export default {
  addNested (collection, key1, key2, dao) {
    if (key1 in collection) {
      collection[key1][key2] = dao
    } else {
      collection[key1] = { [key2]: dao }
    }
  }
}
