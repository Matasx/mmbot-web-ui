<template>
  <span style="display: inline;">
    <b-img style="vertical-align: middle;" class="mr-1" width="32" :src="info.brokerIcon" alt="Ex." v-b-tooltip.top="info.brokerName"></b-img>
    <router-link v-if="navigation" style="vertical-align: middle;" :to="'/trader/' + info.symbol">{{ info.title }}</router-link>
    <span v-else style="vertical-align: middle;">{{ info.title }}</span>
  </span>
</template>

<script>
export default {
  name: 'BrokerName',
  props: {
    info: {
      type: Object,
      required: true
    },
    navigation: {
      type: Boolean,
      default: false
    }
  }
}
</script>
