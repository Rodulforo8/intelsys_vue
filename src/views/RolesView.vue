<template>
  <v-container>
    <!-- {{updatingRole}}
  <br><br>
  {{oneRole}}
  <br><br>
    {{updatedPermissions}}-->
    <!-- {{allRoles}} -->
    <!-- {{oneRole}}
    <br><br>
    {{updatedPermissions}}-->
    <!-- <br>
    <br>
    {{allRoles}}-->
    <v-row>
      <v-col md="8" cols="12"></v-col>
      <!-------------------------------------------------[ ACTION BUTTONS ]------------------------------------------------------->
      <v-row id="action-btn-list-multi" align="center">
        <v-col align="center" cols="3" md="3">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-if="!showRoleForm"
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
            <span>Buscar roles</span>
          </v-tooltip>
        </v-col>
        <v-col align="center" cols="3" md="3">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                id="action-btn"
                v-if="permissionVariables.create"
                v-on="on"
                @click="renderForm()"
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
            <span>Crear rol</span>
          </v-tooltip>
        </v-col>
        <v-col align="center" cols="3" md="3">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-if="authUserData.super"
                id="action-btn"
                @click="saveRole()"
                v-on="on"
                absolute
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
                v-if="authUserData.super"
                id="action-btn"
                @click="delRole()"
                v-on="on"
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
            <span>Eliminar registro</span>
          </v-tooltip>
        </v-col>
      </v-row>
      <!---------------------------------------------[ ACTION BUTTONS ]------------------------------------------------------->
      <!-------------------------------------------------[ SEARCH ]------------------------------------------------------->
      <transition name="slide-fade">
        <Search v-if="!showRoleForm" :fieldColor="fieldColor"/>
      </transition>
      <!------------------------------------------------[ SEARCH ]------------------------------------------------------->
      <!-------------------------------------------------[ FORM ]------------------------------------------------------->
      <transition name="slide-fade">
        <RolesForm v-if="showRoleForm"/>
      </transition>
      <!-------------------------------------------------[ FORM ]------------------------------------------------------->
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import RolesForm from "@/components/AdminComponents/Roles/RolesForm";
import Search from "@/components/AdminComponents/Roles/RolesSearch";
import mixin from "../mixins";
const Swal = require("sweetalert2");
export default {
  mixins: [mixin],
  components: {
    RolesForm,
    Search
  },
  data() {
    return {
      fieldColor: "#1c6255",
      search: null,
      status: ["Activo", "Inactivo"],
      headers: [
        { text: "Id", value: "id", align: "left" },
        {
          text: "Nombre",
          align: "left",
          sortable: false,
          value: "nombre",
          align: "center"
        },
        { text: "Actions", value: "action", sortable: false, align: "center" }
      ]
    };
  },
  created() {
    this.checkAuth();
    this.addAuthModulePermissions();
    this.$bus.emit("tokenRefreshTimerReset");
  },
  beforeDestroy() {
    this.resetRoleState();
  },
  computed: {
    ...mapGetters([
      "allRoles",
      "roleName",
      "showRoleForm",
      "updatingRole",
      "oneRole",
      "aditionalPermissions",
      "updatedPermissions",
      "authModulePermission",
      "authUserData",
      "permissionVariables"
    ]),
    update: function() {
      if (
        (this.showRoleForm && this.permissionVariables.update) ||
        this.authUserData.super
      ) {
        return true;
      } else {
        return false;
      }
    },
    deletes: function() {
      if (
        (this.showRoleForm && this.permissionVariables.delete) ||
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
      "addRoleName",
      "createRole",
      "resetRoleState",
      "changeRoleView",
      "changeUpdatingRole",
      "updatingRoleData",
      "updateRole",
      "deleteRole",
      "addAuthModulePermissions",
      "authUserData"
    ]),
    renderForm() {
      this.changeRoleView(true);
    },
    delRole() {
      if (this.updatingRole) {
        Swal.fire({
          type: "warning",
          title: `Esta seguro que quiere eliminar el rol: ${this.roleName}`,
          text: "Se borrara permanentemente el rol seleccionado",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          cancelButtonText: "NO",
          confirmButtonText: "SI",
          showCancelButton: true
        }).then(result => {
          if (result.value) {
            this.deleteRole();
          }
        });
      }
    },
    renderSearch() {
      if (this.showRoleForm) {
        Swal.fire({
          title: "Esta seguro, quiere salir de la creacion de rol?",
          text: "Los datos seran borrados",
          type: "warning",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancelar",
          confirmButtonText: "Salir",
          showCancelButton: true
        }).then(result => {
          if (result.value) {
            this.resetRoleState();
            this.changeRoleView(false);
          }
        });
      } else {
        this.changeRoleView(false);
      }
    },
    saveRole() {
      this.$bus.emit("saveRole");
    }
  }
};
</script>
<style lang="scss" scoped>
.slide-fade-enter-active {
  transition: all 0.6s ease;
}
.slide-fade-leave-active {
  transition: all 0s;
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
.stepper-btn {
  margin-left: 1em;
  margin-right: 1em;
  color: white;
}
</style>
