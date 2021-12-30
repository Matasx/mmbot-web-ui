<template>
  <fa-icon v-if="rating === 'A'" v-b-tooltip.top.html="ratingTooltip" icon="grin-stars" class="text-success"/>
  <fa-icon v-else-if="rating === 'B'" v-b-tooltip.top.html="ratingTooltip" icon="smile-beam" class="text-success"/>
  <fa-icon v-else-if="rating === 'C'" v-b-tooltip.top.html="ratingTooltip" icon="meh" class="text-info"/>
  <fa-icon v-else-if="rating === 'D'" v-b-tooltip.top.html="ratingTooltip" icon="meh-rolling-eyes" class="text-warning"/>
  <fa-icon v-else v-b-tooltip.top.html="ratingTooltip" icon="sad-cry" class="text-danger"/>
</template>

<script>
export default {
  name: 'Rating',
  props: {
    rating: String
  },
  computed: {
    ratingTooltip () {
      return '<b>Rating:</b> ' + this.rating
    }
  }
}
</script>
