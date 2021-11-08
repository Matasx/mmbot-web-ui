<template>
  <div>
    <b-form-checkbox v-model="value.show" switch>Show</b-form-checkbox>
    <div v-if="value.show">
      <b-form-checkbox v-model="value.modern" switch>Style: {{ value.modern ? 'modern' : 'classic' }}</b-form-checkbox>
      <label for="page-size">Page size: {{ value.pageSize }}</label>
      <b-form-input v-model="value.pageSize" id="page-size" type="range" min="3" max="100" number/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TradesSettings',
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  watch: {
    settings: {
      handler (newSettings) {
        this.$emit('input', newSettings)
      },
      deep: true
    }
  }
}
</script>
