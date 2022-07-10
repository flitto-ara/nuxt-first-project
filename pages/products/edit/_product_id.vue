<template>
  <div>
    <div>Editing Product {{ $route.params.product_id }}</div>
  </div>
</template>

<script>
export default {
  validate({ params, query, store }) {
    return /^\d+$/.test(params.product_id)
    return false
  }
}
</script>

<style scoped>

</style>
