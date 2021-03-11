
<template>
  <v-container id="container" fluid>
    <v-col align="center">
      <v-img
        style="margin-top:10em;"
        src="../assets/building2.jpg"
        lazy-src="../assets/building2.jpg"
        aspect-ratio="1"
        contain
        max-width="500"
        max-height="300"
      ></v-img>
    </v-col>
  </v-container>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
#container {
  background: white;
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
  min-height: 100vh;
}
</style>
