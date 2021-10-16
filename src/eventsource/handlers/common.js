export default {
  addNested (collection, key1, key2, dto) {
    if (key1 in collection) {
      collection[key1][key2] = dto
    } else {
      collection[key1] = { [key2]: dto }
    }
  }
}
