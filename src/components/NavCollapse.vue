<template>
  <span>
    <b-nav-item v-b-toggle:id="id">
      <fa-icon v-if="toggle" icon="caret-up" class="mb-1"/>
      <fa-icon v-else icon="caret-down" class="mb-1"/>
      {{ title }}
    </b-nav-item>
    <b-collapse :id="id" v-model="toggle" class="ml-3">
      <b-navbar-nav>
        <slot/>
      </b-navbar-nav>
    </b-collapse>
  </span>
</template>

<script>
export default {
  name: 'NavCollapse',
  props: {
    title: String,
    id: String
  },
  data () {
    return {
      toggle: false
    }
  }
}
</script>
