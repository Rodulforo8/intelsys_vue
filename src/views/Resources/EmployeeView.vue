<template>
  <v-container>
    <v-row>
      <v-col md="8" cols="12"></v-col>
    
      <v-row id="action-btn-list-multi" align="center">
        <v-col align="center" cols="3" md="3">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-if="!showEmployeeForm"
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
            <span>Buscar empleados</span>
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
            <span>Crear empleado</span>
          </v-tooltip>
        </v-col>
        <v-col align="center" cols="3" md="3">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                id="action-btn"
                @click="roleStepperValue ===3 ? saveRole(): null"
                v-if="update"
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
                v-if="deletes"
                id="action-btn"
                @click="delEmployee()"
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

      <transition name="slide-fade">
     
        <EmployeeSearch :fieldColor="fieldColor" v-if="!showEmployeeForm"/>
  
        <EmployeeWizard :fieldColor="fieldColor" v-if="showEmployeeForm"/>
      </transition>
    </v-row>
  </v-container>
</template>
<script>
import EmployeeSearch from "@/components/Resources/EmployeeComponents/EmployeeSearch";
import EmployeeWizard from "@/components/Resources/EmployeeComponents/EmployeeWizard";
import { mapGetters, mapActions } from "vuex";
const Swal = require("sweetalert2");
import mixin from "@/mixins";
export default {
  mixins: [mixin],
  components: {
    EmployeeSearch,
    EmployeeWizard
  },
  data() {
    return {
      fieldColor: "#1c6255",
      creationText: "Esta seguro, quiere salir de la creación de empleado? ",
      updatingText: "Esta seguro, quiere salir de la edición del empleado? ",
      deleteText: "Esta seguro que desea borrar el empleado? : "
    };
  },
  beforeDestroy() {
    this.resetEmployeeState();
  },
  computed: {
    ...mapGetters([
      "showEmployeeForm",
      "employeeStepperValue",
      "oneEmployee",
      "allProvinces",
      "updatingEmployee",
      "permissionVariables",
      "authUserData",
      "authUserSelectedCompany"
    ]),
    update: function() {
      if (this.showEmployeeForm && this.permissionVariables.update) {
        return true;
      } else {
        return false;
      }
    },
    deletes: function() {
      if (this.showEmployeeForm && this.permissionVariables.delete) {
        return true;
      } else {
        return false;
      }
    }
  },
  created() {
    this.checkAuth();
    this.addAuthModulePermissions();
    this.$bus.emit("tokenRefreshTimerReset");
    this.fetchEmployees();
  },
  methods: {
    ...mapActions([
      "changeEmployeeView",
      "fetchEmployees",
      "resetEmployeeState",
      "deleteEmployee",
      "addAuthModulePermissions"
    ]),
    renderForm() {
      this.changeEmployeeView(true);
    },
    renderSearch() {
      var text = this.updatingEmployee ? this.updatingText : this.creationText;
      if (this.showEmployeeForm) {
        Swal.fire({
          title: text,
          text: "Los datos no guardados seran borrados",
          type: "warning",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancelar",
          confirmButtonText: "Salir",
          showCancelButton: true
        }).then(result => {
          if (result.value) {
            this.resetEmployeeState();
          }
        });
      }
    },
    delEmployee() {
      var text = this.updatingEmployee ? this.deleteText : this.creationText;
      Swal.fire({
        title: text,
        text: "Los datos seran borrados permanentemente",
        type: "warning",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Salir",
        showCancelButton: true
      }).then(result => {
        if (result.value) {
          this.updatingEmployee
            ? this.deleteEmployee(this.oneEmployee.id)
            : this.resetEmployeeState();
        }
      });
    }
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
</style>
