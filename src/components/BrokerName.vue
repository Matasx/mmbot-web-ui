<template>
  <span>
    <b-img width="32" :src="$serviceUrl + info.brokerIcon" alt="Ex."></b-img> {{ info.title }}
  </span>
</template>

<script>
export default {
  name: 'BrokerName',
  props: {
    info: {
      type: Object,
      required: true
    }
  }
}
</script>
