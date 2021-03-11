<template>
  <v-navigation-drawer app v-model="drawer" floating persistent :width="320" id="navigation-body">
    <div class="scrollbar" id="style-1">
      <v-list-item id="nav-header">
        <v-btn @click="hideNavigation()" dark icon id="sidebar-btn">
          <v-icon color="white">reorder</v-icon>
        </v-btn>
        <v-list-item-avatar>
          <v-icon dark large>mdi-account-circle</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title id="sidebar-title">{{this.authUserData.username}}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <!------------------------------------ COMPANY SELECT ------------------------------------------------>

      <v-col id="selectCompany">
        <v-autocomplete
          color="red"
          v-model="selectedCompanyData"
          prepend-inner-icon="work"
          :items="authPermissions.company"
          item-text="name"
          return-object
          item-value="company_id"
          @change="selectedCompany"
          dense
          dark
          filled
          label="Nombre de la compañía"
        ></v-autocomplete>
      </v-col>

      <!----------------------------------- MENU TYPE ---------------------------------------------------->
      <v-col
        align="center"
        style="background-color:#3e3e3e; color:gray; margin:0;"
      >{{authUserSelectedCompany.name}} - {{authUserData.title}}</v-col>
      <br>
      <v-divider class="divider"></v-divider>
      <v-list dark id="list" v-for="item in formattedModuleData" :key="item.nombre" dense>
        <v-list-group
          style="margin: 0.4em 15px 19px 15px; padding: 0px 2px"
          v-if="item.child.length > 0"
          false
          active-class="white--text sombra"
        >
          <template v-slot:activator>
            <v-list-item-icon id="gap">
              <v-icon color="white">{{item.icon}}</v-icon>
            </v-list-item-icon>

            <v-tooltip color="black" bottom>
              <template v-slot:activator="{ on }">
                <v-list-item-title v-on="on" class="white--text">{{item.nombre}}</v-list-item-title>
              </template>
              <span>{{item.nombre}}</span>
            </v-tooltip>
          </template>
          <!--------------------------------------- CHILDREN -------------------------------------------->
          <v-list id="list" v-for="child in item.child" :key="child.nombre" dense>
            <v-list-group
              style="margin: 0.4em 15px 19px 15px; padding: 0px 2px"
              v-if="child.child.length > 0"
              false
              active-class="white--text sombra"
            >
              <template v-slot:activator>
                <v-list-item-icon id="gap">
                  <v-icon color="white">{{child.icon}}</v-icon>
                </v-list-item-icon>

                <v-tooltip color="black" bottom>
                  <template v-slot:activator="{ on }">
                    <v-list-item-title v-on="on" class="white--text">{{child.nombre}}</v-list-item-title>
                  </template>
                  <span>{{child.nombre}}</span>
                </v-tooltip>
              </template>

              <v-list id="list" v-for="grand in child.child" :key="grand.nombre" dense>
                <v-list-item
                  active-class="sidebar-btn white--text sombra"
                  style="margin:0.4em 15px 19px 15px; padding: 0px 20px"
                  :to="grand.route"
                  v-if="grand.access || authUserData.super"
                  link
                  dark
                >
                  <v-list-item-icon id="gap">
                    <v-icon>{{grand.icon}}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-tooltip color="black" bottom>
                      <template v-slot:activator="{ on }">
                        <v-list-item-title
                          v-on="on"
                          style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size:13px;"
                        >{{grand.nombre}}</v-list-item-title>
                      </template>
                      <span>{{grand.nombre}}</span>
                    </v-tooltip>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-list-group>
            <!--------------------------------------- CHILDREN ----------------------------------------------->
            <!--------------------------------------- GRAND CHILDREN ----------------------------------------->
            <v-list-item
              v-else-if="child.access || authUserData.super"
              active-class="sidebar-btn white--text sombra"
              style="margin: 0.4em 15px 19px 15px; padding: 0px 20px"
              :to="child.route"
              link
              dark
            >
              <v-list-item-icon id="gap">
                <v-icon>{{child.icon}}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-tooltip color="black" bottom>
                  <template v-slot:activator="{ on }">
                    <v-list-item-title
                      v-on="on"
                      style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size:13px;"
                    >{{child.nombre}}</v-list-item-title>
                  </template>
                  <span>{{child.nombre}}</span>
                </v-tooltip>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-list-group>
        <!-- v-else-if="permissionVariables.access" -->
        <v-list-item
          v-else-if="item.access || authUserData.super"
          active-class="sidebar-btn white--text sombra"
          style="margin: 0.4em 15px 19px 15px; padding: 0px 20px"
          :to="item.route"
          link
          dark
        >
          <v-list-item-icon id="gap">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-tooltip color="black" bottom>
              <template v-slot:activator="{ on }">
                <v-list-item-title
                  v-on="on"
                  style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size:15px;"
                >{{ item.nombre }}</v-list-item-title>
              </template>
              <span>{{item.nombre}}</span>
            </v-tooltip>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      
      <br>
      <v-divider class="divider"></v-divider>
      <v-btn @click="logout" id="logout-btn">
        <v-icon medium color="white">power_settings_new</v-icon>CERRAR SESION
      </v-btn>
      <br>
      <br>
      <v-img
        id="logo"
        src="../assets/logointelsys/Logo V.B.png"
        lazy-src="../assets/logointelsys/Logo V.B.png"
        aspect-ratio="1"
        max-width="204"
        max-height="188"
      ></v-img>
    </div>
  </v-navigation-drawer>
</template>

<script>
import mixin from "../mixins";
const Swal = require("sweetalert2");
import { mapGetters, mapActions } from "vuex";
export default {
  mixins: [mixin],
  data() {
    return {
      labelName: "text",
      snackbar: false,
      activeBtn: "",
      user: "",
      roleView: "",
      username: null,
      role: null,
      selectedCompanyData: ""
    };
  },
  beforeCreate() {},
  created() {
    // this.fetchAuthUserCompanies();
    this.selectedCompanyData = this.authUserSelectedCompany;
  },
  computed: {
    ...mapGetters([
      "authUserData",
      "drawer",
      "formattedModuleData",
      "authUserCompanies",
      "authPermissions",
      "authUserSelectedCompany",
      "permissionVariables"
    ])
  },
  methods: {
    ...mapActions([
      "fetchAuthUserCompanies",
      "changeDrawer",
      "authLogoutUser",
      "selectCompany",
      "authAddUserSelectedCompany",
      "fetchModules"
    ]),
    logout() {
      Swal.fire({
        type: "warning",
        title: "Cerrar sesion?",
        text: "Los cambios que no has guardado se borraran",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "NO",
        confirmButtonText: "SI",
        showCancelButton: true
      }).then(result => {
        if (result.value) {
          this.authLogoutUser();
        }
      });
    },
    hideNavigation() {
      this.changeDrawer();
    },
    selectedCompany() {
      this.authAddUserSelectedCompany(this.selectedCompanyData);
    },
    displayNotification() {}
  },
  mixins: [mixin]
};
</script>

<style lang="scss" scoped>
#nav-header {
  background-color: #1e1f20;
  height: 64px;
  color: black;
}

#nav-user {
  margin-left: 10px;
}

#sidebar-title {
  color: white;
  font-size: 19px;
}

#logo {
  margin: auto;
}

#navigation-body {
  background: #000000;
  position: fixed;
  background-size: cover;
  background-position: center;
}

#list {
  margin-bottom: -9%;
}

.sidebar-btn {
  background-color: #1c6255;
}

.sombra {
  box-shadow: 0px 6px 12px -5px rgb(255, 255, 255);
  -moz-box-shadow: 0px 6px 12px -5px rgb(255, 255, 255);
  -webkit-box-shadow: 0px 6px 12px -5px rgb(255, 255, 255);
}

#logout-btn {
  margin-top: 2em;
  margin-left: 10px;
  background-color: #1c6255;
  color: white;
  width: 90%;
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  font-size: 12px;
}

#sidebar-btn {
  margin-left: 14px;
}

#child-items {
  margin-top: 1em;
}

.divider {
  width: 90%;
  margin: auto;
  background-color: rgba(65, 65, 65, 0.664);
}

.scrollbar {
  float: left;
  height: 100%;
  width: 100%;
  overflow-y: scroll;
}

// #style-1::-webkit-scrollbar-track {
//   -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
//   border-radius: 10px;
//   background-color: #f5f5f5;
// }

#style-1::-webkit-scrollbar {
  width: 0px;
  background-color: #f5f5f5;
}

// #style-1::-webkit-scrollbar-thumb {
//   border-radius: 10px;
//   -webkit-box-shadow: inset 0 0 6px rgba(28, 98, 85, 1);
//   background-color: rgba(28, 98, 85, 1);
// }

#gap {
  margin-right: 18px;
}

#selectCompany {
  width: 90%;
  margin: auto;
  margin-bottom: -1.5em;
}
</style>
