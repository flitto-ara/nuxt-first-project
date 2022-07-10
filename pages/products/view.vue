<template>
  <div>
    <h1>View Product {{ product._id }}</h1>
    <p>{{ product.title }}</p>
    <p>Price: {{ product.price }}</p>
  </div>
</template>

<script>
import { mapState } from "vuex"
import {ActionTypes} from "~/store/product/constants"

export default {
  created () {
    this.$store.dispatch(ActionTypes.LOAD)
  },
  computed: {
    ...mapState(['product'])
  }
}
</script>
