<template>
  <fa-icon v-b-tooltip.top.html="ratingTooltip" :icon="currentRating.icon" :class="currentRating.class"/>
</template>

<script>
export default {
  name: 'Rating',
  props: {
    rating: String
  },
  data () {
    return {
      ratings: {
        A: {
          icon: 'grin-stars',
          class: 'text-win'
        },
        B: {
          icon: 'grin-beam',
          class: 'text-success'
        },
        C: {
          icon: 'meh',
          class: 'text-info'
        },
        D: {
          icon: 'frown-open',
          class: 'text-warning'
        },
        E: {
          icon: 'sad-cry',
          class: 'text-danger'
        }
      }
    }
  },
  computed: {
    currentRating () {
      return this.ratings[this.rating] ?? this.ratings.E
    },
    ratingTooltip () {
      return '<b>Rating:</b> ' + this.rating
    }
  }
}
</script>
