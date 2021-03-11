<template>
  <v-container>
    <!-- {{userCompanies}} --> 
    <v-row>
      <v-col md="8" cols="12"></v-col>
      <v-row id="action-btn-list-multi" align="center">
        <v-col align="center" cols="3" md="3">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-if="!showUserForm"
                id="action-btn"
                @click="renderSearch()"
                v-on="on"
                absolute
                dark
                fab
                color="amber accent-3"
              >
                <v-icon large>search</v-icon>
              </v-btn>
              <v-btn
                v-else
                id="action-btn"
                @click="renderSearch()"
                v-on="on"
                absolute
                dark
                fab
                color="amber accent-3"
              >
                <v-icon large>arrow_back</v-icon>
              </v-btn>
            </template>
            <span>Buscar usuarios</span>
          </v-tooltip>
        </v-col>
        <v-col align="center" cols="3" md="3">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                id="action-btn"
                v-if="permissionVariables.create"
                @click="renderForm()"
                v-on="on"
                absolute
                dark
                fab
                color="green"
              >
                <v-icon large>note_add</v-icon>
              </v-btn>
              <v-btn
                id="action-btn"
                v-else
                v-on="on"
                absolute
                dark
                fab
                color="light-green accent-1"
              >
                <v-icon large>note_add</v-icon>
              </v-btn>
            </template>
            <span>Crear usuario</span>
          </v-tooltip>
        </v-col>
        <v-col align="center" cols="3" md="3">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-if="update"
                id="action-btn"
                v-on="on"
                absolute
                @click="save"
                dark
                fab
                color="blue"
              >
                <v-icon large>save</v-icon>
              </v-btn>
              <v-btn v-else id="action-btn" v-on="on" absolute dark fab color="blue lighten-4">
                <v-icon large>save</v-icon>
              </v-btn>
            </template>
            <span>Guardar</span>
          </v-tooltip>
        </v-col>
        <v-col align="center" cols="3" md="3">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                id="action-btn"
                v-if="deletes"
                v-on="on"
                @click="delUser()"
                absolute
                dark
                fab
                color="red"
              >
                <v-icon large>delete</v-icon>
              </v-btn>
              <v-btn v-else id="action-btn" v-on="on" absolute dark fab color="red lighten-3">
                <v-icon large>delete</v-icon>
              </v-btn>
            </template>
            <span>Eliminar usuario</span>
          </v-tooltip>
        </v-col>
      </v-row>
      <!------------------------------------------[ ACTION BUTTONS ]----------------------------------------->
      <!------------------------------------------[ SEARCH USERS ]------------------------------------------->
      <transition name="slide-fade">
        <UserSearch :fieldColor="fieldColor" v-if="!showUserForm"/>
      </transition>
      <!------------------------------------------[ SEARCH USERS ]------------------------------------------->
      <!---------------------------------------[ CREATE/EDIT USERS ]----------------------------------------->
      <transition name="slide-fade">
        <UserForm v-if="showUserForm" :fieldColor="fieldColor"/>
      </transition>
      <!---------------------------------------[ CREATE/EDIT USERS ]----------------------------------------->
    </v-row>
  </v-container>
</template>
<script>
import UserForm from "@/components/AdminComponents/Users/UserForm";
import UserSearch from "@/components/AdminComponents/Users/UserSearch";
import mixin from "@/mixins";
import { mapGetters, mapActions } from "vuex";
const Swal = require("sweetalert2");
export default {
  name: "CompanyView",
  mixins: [mixin],
  components: {
    UserForm,
    UserSearch
  },
  data() {
    return {
      fieldColor: "#1c6255",
      edit: false,
      deleteBtnColor: "red lighten-3",
    };
  },
  beforeDestroy() {
    this.resetUserState();
  },
  created() {
    this.checkAuth();
    this.addAuthModulePermissions();
    this.$bus.emit('tokenRefreshTimerReset')
  },
  computed: {
    ...mapGetters([
      "showUserForm",
      "allUsers",
      "updatingUser",
      "oneUser",
      "userCompanies",
      "authToken",
      "authUserData",
      "allActiveCompanies",
      "authUserSelectedCompany",
      "authModulePermission",
      "permissionVariables",
      "authPermissions",
       "authUserCompanies"
      
    ]),
    update: function() {
      if (
        (this.showUserForm && this.permissionVariables.update) ||
        this.authUserData.super
      ) {
        return true;
      } else {
        return false;
      }
    },
    deletes: function() {
      if (
        (this.showUserForm && this.permissionVariables.delete) ||
        this.authUserData.super
      ) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    ...mapActions([
      "fetchAllUsers",
      "renderUserForm",
      "resetUserState",
      "deleteUser",
      "fetchAllCompanies",
      "addAuthModulePermissions",
      "deleteUserCompany"
    ]),
    save() {
      this.$bus.emit("submitForm");
    },
    renderForm() {
      this.renderUserForm(true);
    },
    renderSearch() {
      if (this.showUserForm) {
        Swal.fire({
          title: "Esta seguro, quiere salir de la creacion de usuario?",
          text: "Los datos seran borrados",
          type: "warning",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancelar",
          confirmButtonText: "Salir",
          showCancelButton: true
        }).then(result => {
          if (result.value) {
            this.resetUserState();
          }
        });
      }
    },
    delUser() {
      if (this.updatingUser) {
        Swal.fire({
          title: `Esta seguro que quiere borrar el usuario: ${
            this.oneUser.username
          }`,
          text: "",
          type: "question",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancelar",
          confirmButtonText: "Eliminar",
          showCancelButton: true
        }).then(result => {
          if (result.value) {

            this.deleteUserCompany(this.oneUser.company_user_id);
          }
        });
      }
    },

  }
}; 
</script>
<style lang="scss" scoped>
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


