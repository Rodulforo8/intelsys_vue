<template>
  <v-container id="report-container">
    <!-- {{oneCalcReport}} -->
    <v-row>
      <v-col md="8" cols="12"></v-col>
      <!------------------------------------------[ ACTION BUTTONS ]----------------------------------------->
      <v-row id="action-btn-list-multi" align="center">
        <v-col align="center" cols="3" md="3">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-if="!showCalcReportForm"
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
            <span>Buscar Reporte</span>
          </v-tooltip>
        </v-col>
        <v-col align="center" cols="3" md="3">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn
                id="action-btn"
                @click="renderForm()"
                v-if="permissionVariables.create"
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
              <!-- <v-btn
                v-if="update"
                id="action-btn"
                v-on="on"
                absolute
                dark
                fab
                color="blue"
              >
                <v-icon large>save</v-icon>
              </v-btn>-->
              <v-btn id="action-btn" v-on="on" absolute dark fab color="blue lighten-4">
                <v-icon large>save</v-icon>
              </v-btn>
            </template>
            <span>Guardar</span>
          </v-tooltip>
        </v-col>
        <v-col align="center" cols="3" md="3">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <!-- <v-btn
                v-if="deletes"
                id="action-btn"
                v-on="on"
                absolute
                dark
                fab
                color="red"
              >
                <v-icon large>delete</v-icon>
              </v-btn>-->
              <v-btn id="action-btn" v-on="on" absolute dark fab color="red lighten-3">
                <v-icon large>delete</v-icon>
              </v-btn>
            </template>
            <span>Eliminar</span>
          </v-tooltip>
        </v-col>
      </v-row>
      <!------------------------------------------[ ACTION BUTTONS ]----------------------------------------->
      <transition name="slide-fade">
        <CalcReportSearch :fieldColor="fieldColor" v-if="!showCalcReportForm"/>
      </transition>

      <transition name="slide-fade">
        <CalcReportForm :fieldColor="fieldColor" v-if="showCalcReportForm"/>
      </transition>
    </v-row>
  </v-container>
</template>
<script>
import CalcReportForm from "@/components/Resources/CalcReportComponents/CalcReportForm";
import CalcReportSearch from "@/components/Resources/CalcReportComponents/CalcReportSearch";
const Swal = require("sweetalert2");
import { mapGetters, mapActions } from "vuex";
import mixin from "@/mixins";
export default {
  mixins: [mixin],
  components: {
    CalcReportForm,
    CalcReportSearch
  },
  data() {
    return {
      fieldColor: "#1c6255"
    };
  },
  created() {
    this.checkAuth();
    this.addAuthModulePermissions();
    this.$bus.emit("tokenRefreshTimerReset");
  },
  beforeDestroy(){
         this.resetCalcReportState();
  },
  computed: {
    ...mapGetters([
      "showCalcReportForm",
      "authModulePermission",
      "authUserData",
      "permissionVariables",
      "allTrxTypes",
      "oneCalcReport"
    ]),
    update: function() {
      if (this.showCalcReportForm && this.permissionVariables.update) {
        return true;
      } else {
        return false;
      }
    },
    deletes: function() {
      if (this.showCalcReportForm && this.permissionVariables.delete) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    ...mapActions(["renderCalcReportForm", "resetCalcReportState", "addAuthModulePermissions"]),
    renderForm() {
      this.renderCalcReportForm(true);
    },
    renderSearch() {
      Swal.fire({
        title: `Esta seguro que quiere salir de la generacion de reporte de calculos?`,
        text: "Los datos ingresados seran borrados",
        type: "question",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Salir",
        showCancelButton: true
      }).then(result => {
        if (result.value) {
          this.resetCalcReportState();
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
