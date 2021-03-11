<template>
  <v-container>
    <v-row>
      <v-col md="8" cols="12"></v-col>
      <!------------------------------------------[ ACTION BUTTONS ]----------------------------------------->
      <v-row id="action-btn-list-multi" align="center">
        <v-col align="center" cols="3" md="3">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-if="!showReportEmployeeForm"
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
            <span>Buscar Reportes</span>
          </v-tooltip>
        </v-col>
        <v-col align="center" cols="3" md="3">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                id="action-btn"
                v-if="authModulePermission.create > 0"
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
            <span>Crear Reporte</span>
          </v-tooltip>
        </v-col>
        <v-col align="center" cols="3" md="3">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-if="showReportEmployeeForm && authModulePermission.update > 0"
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
                v-if="showReportEmployeeForm && authModulePermission.delete > 0"
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
            <span>Eliminar</span>
          </v-tooltip>
        </v-col>
      </v-row>
      <!------------------------------------------[ ACTION BUTTONS ]----------------------------------------->
      <!------------------------------------------[ SEARCH REPORTS ]------------------------------------------->
      <transition name="slide-fade">
        <ReportEmployeeSearch :fieldColor="fieldColor" v-if="!showReportEmployeeForm"/>
      </transition>
      <!------------------------------------------[ SEARCH REPORTS ]------------------------------------------->
      <!---------------------------------------[ CREATE/EDIT REPORTS ]----------------------------------------->
      <transition name="slide-fade">
        <ReportEmployeeForm :fieldColor="fieldColor" v-if="showReportEmployeeForm"/>
      </transition>
      <!---------------------------------------[ CREATE/EDIT REPORTS ]----------------------------------------->
    </v-row>
  </v-container>
</template>
<script>
import ReportEmployeeSearch from "@/components/Resources/Discounts/ReportEmployeeComponents/ReportEmployeeSearch";
import ReportEmployeeForm from "@/components/Resources/Discounts/ReportEmployeeComponents/ReportEmployeeForm";
import mixin from "@/mixins";
import { mapGetters, mapActions } from "vuex";
const Swal = require("sweetalert2");
export default {
  name: "Employee Report",
  mixins: [mixin],
  components: {
    ReportEmployeeSearch,
    ReportEmployeeForm
  },
  data() {
    return {
      fieldColor: "#1c6255"
    };
  },
  beforeCreate() {},
  beforeDestroy() {
    this.resetReportEmployeeState();
  },
  created() {
    this.checkAuth();
    this.addAuthModulePermissions();
        this.$bus.emit('tokenRefreshTimerReset')
  },
  computed: {
    ...mapGetters([
      "showReportEmployeeForm",
      "authModulePermission",
      "activeCompanyProjects",
      "oneReportEmployee"
    ])
  },
  methods: {
    ...mapActions([
      "addAuthModulePermissions",
      "renderReportEmployeeForm",
      "resetReportEmployeeState",
      "resetReportEmployeeState"
    ]),
    save() {
      // this.$bus.emit("submitForm");
    },
    renderForm() {
      this.renderReportEmployeeForm(true);
    },
    renderSearch() {
      if (this.showReportEmployeeForm) {
        Swal.fire({
          title:
            "Esta seguro quiere salir de la creacion de reporte de empleado?",
          text: "Los datos seran borrados",
          type: "warning",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancelar",
          confirmButtonText: "Salir",
          showCancelButton: true
        }).then(result => {
          if (result.value) {
            this.resetReportEmployeeState();
          }
        });
      }
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