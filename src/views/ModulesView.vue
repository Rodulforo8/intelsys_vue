<template>
  <v-container>
    <!-- {{oneModule}} -->
    <v-row>
      <v-col md="8" cols="12"></v-col>
      <!-------------------------------------------------[ ACTION BUTTONS ]------------------------------------------------------->
      <v-row id="action-btn-list-multi" align="center">
        <v-col align="center" cols="3" md="3">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-if="!showModuleForm"
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
            <span>Buscar modulos</span>
          </v-tooltip>
        </v-col>
        <v-col align="center" cols="3" md="3">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <!-- <v-btn
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
              </v-btn> -->
              <v-btn
                id="action-btn"
    
                v-on="on"
                absolute
                dark
                fab
                color="light-green accent-1"
              >
                <v-icon large>note_add</v-icon>
              </v-btn>
            </template>
            <span>Crear modulo</span>
          </v-tooltip>
        </v-col>
        <v-col align="center" cols="3" md="3">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-if="update"
                id="action-btn"
                @click="saveModule()"
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
            <span>Guardar modulo</span>
          </v-tooltip>
        </v-col>
        <v-col align="center" cols="3" md="3">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-if="deletes"
                @click="delModule()"
                id="action-btn"
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
            <span>Eliminar modulo</span>
          </v-tooltip>
        </v-col>
      </v-row>
      <!----------------------------------------------[ ACTION BUTTONS ]------------------------------------------------------->
      <!-------------------------------------------------[ SEARCH ]------------------------------------------------------------>
      <transition name="slide-fade">
        <ModulesSearch v-if="!showModuleForm" :fieldColor="fieldColor"/>
        <ModulesForm :fieldColor="fieldColor" v-if="showModuleForm"/>
      </transition>
      <!-------------------------------------------------[ SEARCH ]------------------------------------------------------------>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ModulesSearch from "@/components/AdminComponents/Modules/ModulesSearch";
import ModulesForm from "@/components/AdminComponents/Modules/ModulesForm";
const Swal = require("sweetalert2");
import mixin from "../mixins";
export default {
  mixins: [mixin],
  components: {
    ModulesSearch,
    ModulesForm
  },
  data() {
    return {
      fieldColor: "#1c6255"
    };
  },
  beforeCreate() {},
  created() {
    this.checkAuth();
    this.addAuthModulePermissions();
    this.$bus.emit("tokenRefreshTimerReset");
  },
  computed: {
    ...mapGetters([
      "showModuleForm",
      "oneModule",
      "authModulePermission",
      "authUserData",
      "permissionVariables"
    ]),
    update: function() {
      if (this.showModuleForm && this.permissionVariables.update) {
        return true;
      } else {
        return false;
      }
    },
    deletes: function() {
      if (this.showModuleForm && this.permissionVariables.delete) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    ...mapActions([
      "changeModulesView",
      "fetchModules",
      "deleteModule",
      "resetModuleState",
      "oneModule",
      "addAuthModulePermissions"
    ]),
    renderForm() {
      this.changeModulesView(true);
    },
    renderSearch() {
      this.resetModuleState();
    },
    saveModule() {
      this.$bus.emit(`submitModule`);
    },
    delModule() {
      if (this.showModuleForm) {
        Swal.fire({
          title: `Esta seguro que quiere eliminar el modulo ${
            this.oneModule.nombre
          }?`,
          text: "",
          type: "question",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancelar",
          confirmButtonText: "Eliminar",
          showCancelButton: true
        }).then(result => {
          if (result.value) {
            this.deleteModule();
          }
        });
      }
    }
  },
  beforeDestroy() {
    this.resetModuleState();
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
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
