<template>
  <v-app>
    <v-content>
      <div v-if="authToken ===null">
        <router-view/>
        <Loader v-if="circularPreloader"/>
        <vue-snotify></vue-snotify>
      </div>
      <div v-else>
        <Toolbar/>
        <Sidebar/>
        <!-- <TokenRefreshNotification v-if="startTime"/> -->
        <Loader v-if="circularPreloader"/>
        <v-content style="padding:0">
          <v-fade-transition mode="out-in">
            <router-view/>
          </v-fade-transition>
        </v-content>
      </div>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Toolbar from "@/components/Toolbar";
// import Sidebar from "@/components/OfflineSideBar";
import Sidebar from "@/components/SideBar";
import Loader from "@/components/tools/Preloader";
// import Skeleton from "@/components/tools/Skeleton";
import TokenRefreshNotification from "@/components/tools/TokenRefreshNotification";

import mixin from "./mixins";
export default {
  mixins: [mixin],
  name: "App",
  components: {
    Toolbar,
    Sidebar,
    Loader,
    TokenRefreshNotification
    // Skeleton
  },
  data() {
    return {
      preloader: false,
      skeleton: false,
      startTime: true
    };
  },
  computed: {},
  created() {
    var token = window.localStorage.getItem("token");
    console.log(token)
    if (!token) {
      this.$router.push("/");
    } else {
      this.initialize();
    }

    // this.initialize();
  },
  // NORMALIZAR VARIABLES DEL STORE
  computed: {
    ...mapGetters([
      "allCompanies",
      "allRoles",
      "authUserData",
      "circularPreloader",
      "authToken"
    ])
  },
  mounted() {},
  methods: {
    ...mapActions([
      "authAddToken",
      "authAddUser",
      "authAddPermissions",
      "fetchCountries",
      "fetchModules",
      "fetchRoles",
      "fetchGroups",
      "authAddUserSelectedCompany",
      "addAuthModulePermissionsReload",
      "addAuthHeader",
      "addAuthRefresh",
      "fetchEmployees"
    ]),
    async initialize() {

      var token = window.localStorage.getItem("token");
      var user = JSON.parse(window.localStorage.getItem("userData"));
      // var refreshToken = window.localStorage.getItem("refreshToken");
      var permissions = JSON.parse(window.localStorage.getItem("permissions"));
      var modulePermissions = JSON.parse(
        window.localStorage.getItem("modulePermissions")
      );
      var selectedCompany = JSON.parse(
        window.localStorage.getItem("selectedCompany")
      );

      await this.authAddUserSelectedCompany(selectedCompany);
      await this.authAddToken(token);
      await this.authAddUser(user);
      await this.authAddPermissions(permissions);

    }
  }
};
</script>
<style lang="scss">
h2 {
  color: #52887e;
}

h3 {
  color: #52887e;
}

#header {
  text-align: right;
  color: white;
}

#sidebar-btn {
  margin-left: 1%;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-image: none;
  background-size: 50%;
  background-repeat: no-repeat;
  background-position: center;
  background-color: #113d4c1e;
  background-size: cover;
  z-index: 1;
  width: 100%;
}

#inner-title-card {
  background-color: #1c6255;
  color: white;
  padding: 8px;
  display: inline-block;
  left: 10px;
  bottom: 15px;
  font-size: 16px;
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
}

#inner-title-card-col {
  padding: 0;
  margin-right: 1em;
}

#inner-form-card {
  font-size: 20px;
  background-color: #1c6255;
  color: white;
  width: 60%;
  left: 10px;
  top: 10px;
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
}

#text {
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
}
#btn {
  margin-top: 1em;
  margin-bottom: 1em;
  background-color: #113d4c;
  color: white;
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
}

#inner-card-icon {
  margin-right: 10px;
}

#action-btn-list {
  margin-left: 3em;
  margin-bottom: 4em;
}

#action-btn-list-multi {
  margin-right: 2em;
  margin-bottom: 4em;
}

#action-btn-list-reports {
  margin-left: 2em;
  margin-bottom: 4em;
}

#action-btn {
  background-color: black;
}

#report-container {
  margin-bottom: 27%;
}

.form-col {
  padding: 12px;
}

#outer-card {
  margin: auto;
}

.slide-fade-enter-active {
  transition: all 1s ease;
}
.slide-fade-leave-active {
  transition: all 0s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
#top-step-counter {
  position: absolute;
  text-align: right;
  color: #113d4c;
}
</style>
