<template>
  <span>
    <b-img class="mr-1" width="32" :src="$serviceUrl + info.brokerIcon" alt="Ex." v-b-tooltip.top="info.brokerName"></b-img>
    <router-link v-if="navigation" :to="'/trader/' + info.symbol">{{ info.title }}</router-link>
    <span v-else>{{ info.title }}</span>
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
