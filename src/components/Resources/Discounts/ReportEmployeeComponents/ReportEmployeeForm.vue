<template>
  <v-container id="report-container">
    <v-row>
      <v-col>
        <v-card>
          <v-card id="outer-card" elevation="6">
            <v-card id="inner-title-card" elevation="6">
              <v-col id="inner-title-card-col">
                <v-icon id="inner-card-icon" large color="white">attach_money</v-icon>Reportes de descuentos por empleados
              </v-col>
            </v-card>
            <v-container>
              <v-form v-model="valid" ref="reportEmployeeForm" lazy-validation>
                <v-row>
                  <v-col class="form-col" md="4" cols="12">
                    <v-autocomplete
                      v-model="report.reproyec"
                      :color="fieldColor"
                      prepend-icon="work"
                      :items="activeCompanyProjects"
                      item-text="nameproy"
                      item-value="id"
                      dense
                      filled
                      label="Proyecto:"
                      required
                      :rules="[rules.required]"
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="form-col" md="4" cols="12">
                    <v-autocomplete
                      v-model="report.reacre"
                      :color="fieldColor"
                      :items="allCreditors"
                      item-text="acnameacree"
                      item-value="id"
                      prepend-icon="mdi-account-cash-outline"
                      dense
                      filled
                      label="Acreedor"
                      required
                      :rules="[rules.required]"
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="form-col" md="4" cols="12">
                    <v-autocomplete
                      :color="fieldColor"
                      v-model="report.reperiododec"
                      :items="discountPeriods"
                      item-text="text"
                      item-value="value"
                      prepend-icon="mdi-account-cash-outline"
                      dense
                      filled
                      label="Periodo a descontar"
                      required
                      :rules="[rules.required]"
                    ></v-autocomplete>
                  </v-col>
                  <v-col md="6" cols="12">
                    <v-menu
                      v-model="menu1"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="report.erdesde"
                          :color="fieldColor"
                          label="Fecha de inicio del calculo"
                          prepend-icon="event"
                          readonly
                          v-on="on"
                          required
                          :rules="[rules.required]"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="report.erdesde"
                        :color="fieldColor"
                        @input="menu1 = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col md="6" cols="12">
                    <v-menu
                      v-model="menu2"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          :color="fieldColor"
                          v-model="report.erhasta"
                          label="Fecha de fin del calculo"
                          prepend-icon="event"
                          readonly
                          v-on="on"
                          required
                          :rules="[rules.required]"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="report.erhasta"
                        :color="fieldColor"
                        @input="menu2 = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col class="form-col" md="4" cols="12">
                    <v-autocomplete
                      v-model="report.ernpresta"
                      :color="fieldColor"
                      prepend-icon="work"
                      dense
                      filled
                      label="N de prestamo:"
                      required
                      :rules="[rules.required]"
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="form-col" md="4" cols="12">
                    <v-autocomplete
                      v-model="report.erdeduc"
                      :color="fieldColor"
                      prepend-icon="mdi-account-cash-outline"
                      dense
                      filled
                      label="Tipo de deducción"
                      required
                      :rules="[rules.required]"
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="form-col" md="4" cols="12">
                    <v-autocomplete
                      :color="fieldColor"
                      v-model="report.eremcode"
                      prepend-icon="mdi-account-cash-outline"
                      dense
                      filled
                      label="Codigo del empleado"
                      required
                      :rules="[rules.required]"
                    ></v-autocomplete>
                  </v-col>
                  <v-col align="center" cols="10">
                    <v-btn
      
                      @click="generateReport"
                      type="submit"
                      v-on="on"
                      absolute
                      dark
                      :color="fieldColor"
                    >GENERAR REPORTE</v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import mixin from "@/mixins";
export default {
  mixins: [mixin],
  props: ["fieldColor"],
  components: {},
  data() {
    return {
      valid: true,
      menu1: false,
      menu2: false,
      json_data: [
        {
          name: "Tony Peña",
          city: "New York",
          country: "United States",
          birthdate: "1978-03-15",
          phone: "+1 855 275 5071"
        },
        {
          name: "Thessaloniki",
          city: "Athens",
          country: "Greece",
          birthdate: "1987-11-23",
          phone: "+1 855 275 5071"
        }
      ],
      discountPeriods: [
        { text: "Primera semana", value: "1" },
        {
          text: "Segunda semana o primera quincena",
          value: "2"
        },
        { text: "Tercera semana", value: "3" },
        {
          text: "Segunda semana ó primera quincenal",
          value: "4"
        },
        {
          text: "Quincenal",
          value: "Q"
        },
        { text: "Semanal", value: "T" },
        {
          text: "Semanas 2 y 4 (cada 2 semanas)",
          value: "A"
        },
        { text: "Mensual", value: "M" }
      ],
      report: {
        reproyec: "",
        reacre: "",
        reperiododec: "",
        erdesde: "",
        erhasta: "",
        ernpresta: "",
        erdeduc: "",
        eremcode: ""
      }
    };
  },
  created() {
    this.initialize();
  },
  computed: {
    ...mapGetters([
      "allCreditors",
      "activeCompanyProjects",
      "oneReportEmployee"
    ])
  },
  methods: {
    ...mapActions(["fetchAllCreditors", "fetchProjectsOfCompany"]),
    initialize() {
      // this.fetchAllCreditors();
      this.fetchProjectsOfCompany();
      this.report = this.oneReportEmployee;
    },
    generateReport(e) {
      e.preventDefault();
      if (this.$refs.reportEmployeeForm.validate()) {
        console.log("kilroy");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
