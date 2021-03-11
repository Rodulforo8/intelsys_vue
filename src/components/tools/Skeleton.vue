<template>
  <v-container>
    <v-row>
      <v-col md="8" cols="12"></v-col>
      <v-row id="action-btn-list-multi" align="center">
        <v-col align="center" cols="3" md="3">
          <v-skeleton-loader class="mx-auto" max-width="300" type="avatar"></v-skeleton-loader>
        </v-col>
        <v-col align="center" cols="3" md="3">
          <v-skeleton-loader class="mx-auto" max-width="300" type="avatar"></v-skeleton-loader>
        </v-col>
        <v-col align="center" cols="3" md="3">
          <v-skeleton-loader class="mx-auto" max-width="300" type="avatar"></v-skeleton-loader>
        </v-col>
        <v-col align="center" cols="3" md="3">
          <v-skeleton-loader class="mx-auto" max-width="300" type="avatar"></v-skeleton-loader>
        </v-col>
      </v-row>
      <v-col id="skeleton-card" md="12" cols="12">
        <v-skeleton-loader class="mx-auto" max-width="1000" type="card"></v-skeleton-loader>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  inject: ["theme"],

  components: {
    // Create a new component that
    // extends v-skeleton-loader
    VBoilerplate: {
      functional: true,

      render(h, { data, props, children }) {
        return h(
          "v-skeleton-loader",
          {
            ...data,
            props: {
              boilerplate: true,
              elevation: 2,
              ...props
            }
          },
          children
        );
      }
    }
  }
};
</script>
<style lang="scss" scoped>

#skeleton-card{
 margin-top: -3em;
}

</style>
