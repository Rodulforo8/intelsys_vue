<template>
  <div>
    <v-toolbar app id="toolbar" dark elevation="5">

      <v-fade-transition mode="out-in">
        <!-- <show-at breakpoint="small">
          <v-btn @click="showNavigation()" dark icon id="sidebar-btn">
            <v-icon color="white">reorder</v-icon>
          </v-btn>
        </show-at>-->
      </v-fade-transition>
      <v-fade-transition mode="out-in">
        <show-at breakpoint="mediumAndAbove">
          <v-btn v-if="!drawer" @click="showNavigation()" dark icon id="sidebar-btn">
            <v-icon color="white">reorder</v-icon>
          </v-btn>
        </show-at>
      </v-fade-transition>
      <!-- usuario: {{authUserData}} -->
      <!-- compania: {{selectedCompany}} -->
      <v-spacer></v-spacer>
      <v-img
        id="logo"
        src="@/assets/logointelsys/Logo H.N.png"
        lazy-src="@/assets/logointelsys/Logo H.B.png"
        aspect-ratio="1"
        max-width="170"
        max-height="40"
      ></v-img>
    </v-toolbar>
  </div>
</template>
<script>
import { showAt, hideAt } from "vue-breakpoints";
import { mapGetters, mapActions } from "vuex";
const Swal = require("sweetalert2");
export default {
  components: { hideAt, showAt },
  data() {
    return {
      snackbar: false,
      showBtn: false,
      value: 2000
    };
  },
  mounted() {
  },
  computed: {
    ...mapGetters([
      "drawer",
      "authUserData",
      "selectedCompany",
      "authToken",
      "authUserSelectedCompany",
      "authModulePermission",
      "permissionVariables",
      "authHeader",
      "authRefreshToken",

    ])
  },
  methods: {
    ...mapActions(["changeDrawer"]),
    showNavigation() {
      this.changeDrawer();
    },
    welcome() {
      this.snackbar = true;
    }
  }
};
</script>
<style lang="scss" scoped>
#toolbar {
  background-image: linear-gradient(
    to right,
    rgb(28, 98, 85, 1),
    rgb(28, 98, 85, 1),
    rgb(255, 255, 255)
  );
}
</style>
