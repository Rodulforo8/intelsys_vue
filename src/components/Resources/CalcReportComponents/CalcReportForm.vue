<template>
  <v-col md="12" cols="12">
    <v-card id="outer-card" elevation="6">
      <v-card id="inner-title-card" elevation="6">
        <v-col id="inner-title-card-col">
          <v-icon id="inner-card-icon" large color="white">attach_money</v-icon>Crear Reportes del calculo
        </v-col>
      </v-card>
      <v-container>
        <!-- {{payload.cpdesde | format-date-latin}}
        <br>
        <br>
        {{payload.cptpago}}-->
        <v-form v-model="valid" ref="calcReportForm" lnazy-validation>
          <v-row>
            <v-col cols="12" md="4">
              <v-autocomplete
                :color="fieldColor"
                v-model="payload.projectId"
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
            <v-col cols="12" md="4">
              <v-select
                v-model="trx"
                :color="fieldColor"
                prepend-icon="work"
                :items="allTrxTypes"
                item-text="codtrx"
                item-value="id"
                return-object
                @change="setTrx"
                dense
                filled
                label="Tipo de transacción"
                required
                :rules="[rules.required]"
              ></v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="payload.paymentTime"
                :color="fieldColor"
                prepend-icon="event"
                :items="discountPeriods"
                item-text="text"
                item-value="value"
                @change="reloadDates()"
                dense
                filled
                label="Tiempo de pago"
                required
                :rules="[rules.required]"
              ></v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-menu
                v-model="menu1"
                :close-on-content-click="false"
                :nudge-right="40"
                :color="fieldColor"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    class="field-text"
                    :value="payload.initDate"
                    label="Desde"
                    prepend-icon="calendar_today"
                    :color="fieldColor"
                    v-on="on"
                    readonly
                    required
                    :rules="[rules.required]"
                    name="Fecha"
                  ></v-text-field>
                </template>
                <v-date-picker
                  @change="createFinalDate()"
                  v-model="payload.initDate"
                  :color="fieldColor"
                  @input="menu1 = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" md="4">
              <v-menu
                v-model="menu2"
                :close-on-content-click="false"
                :nudge-right="40"
                :color="fieldColor"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    class="field-text"
                    :value="payload.finalDate"
                    label="Desde"
                    prepend-icon="calendar_today"
                    :color="fieldColor"
                    v-on="on"
                    readonly
                    required
                    :rules="[rules.required]"
                    name="Fecha"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="payload.finalDate"
                  :color="fieldColor"
                  @input="menu2 = false"
                ></v-date-picker>
              </v-menu>
            </v-col>

            <v-col align="center" cols="10">
              <download-csv
                class="btn btn-default"
                :data="json_data"
                name="reporte_calculo_intelsys.csv"
              >
                <v-btn
                  @click="generateReport"
                  type="submit"
                  absolute
                  dark
                  :color="fieldColor"
                >GENERAR REPORTE</v-btn>
              </download-csv>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </v-card>
  </v-col>
</template>
<script>
import mixin from "@/mixins";
import { mapGetters, mapActions } from "vuex";
const Swal = require("sweetalert2");
import moment from "moment";
export default {
  mixins: [mixin],
  props: ["fieldColor"],
  data() {
    return {
      valid: true,
      offset: true,
      menu: false,
      modal: false,
      menu1: false,
      menu2: false,
      payload: "",
      trx: "",
      deductions: ["Descuento especial", "Abierta"],
      radioGroupPeriod: "",
      nuevoPeriodo: [1, 2, 3, 4],
      discountPeriods: [
        { text: "(D) Diario", value: "D" },
        // { text: "(1s) Primera semana", value: "1s" },
        {
          text: "(2S) Segunda semana o primera quincena",
          value: "2S"
        },
        // { text: "(3S) Tercera semana", value: "3s" },
        {
          text: "(4S) Segunda semana ó primera quincena",
          value: "4S"
        },
        {
          text: "(Q) Quincenal",
          value: "Q"
        },
        { text: "(S) Semanal", value: "S" },
        // {
        //   text: "(A) Cada dos semanas",
        //   value: "A"
        // },
        { text: "(M) Mensual", value: "M" }
      ],
      json_data: [
      {
        empleado: "Jesus Cabrera",
        acreedor: "Banesco",
        tipo_deduccion: "Prestamo Hipotecario",
        monto_descuento: 50.5,
        total: 0,
        paga_diciembre: "N",
        periodo: "Q",
        saldo_adeudado: 500.25,
        fecha: "20/02/2020",
        documento: 31,
        porcentaje: "0.000",
        pagado: 325
      },
      {
        empleado: "Ruben Blades",
        acreedor: "Corporacion Uno",
        tipo_deduccion: "Alquiler de Vivieda",
        monto_descuento: 900,
        total: 0,
        paga_diciembre: "S",
        periodo: "Q",
        saldo_adeudado: 200,
        fecha: "24/02/2020",
        documento: 50,
        porcentaje: "0.000",
        pagado: 400
      }
    ]
    };
  },
  created() {
    this.initialize();
  },
  computed: {
    ...mapGetters([
      "selectedCompany",
      "activeCompanyProjects",
      "allTrxTypes",
      "oneCalcReport"
    ])
  },
  methods: {
    ...mapActions(["fetchProjectsOfCompany", "fetchTrxType"]),
    initialize() {
      this.payload = this.oneCalcReport;
      this.fetchProjectsOfCompany();
      this.fetchTrxType();
    },
    generateReport(e) {
      e.preventDefault();
      if (this.$refs.calcReportForm.validate()) {
        Swal.fire({
          type: "error",
          title: "Error 500 internal server",
          showConfirmButton: false,
          timer: 1500
        });
      }
    },
    dateFormatter(value) {
      var date = moment(value, "YY-MM-DD").format("DD-MM-Y");
      return date;
    },
    finalDateFormatter(date) {
      date = date.split("-").join("/");

      return date;
    },
    createFinalDate() {
      // debugger
      var initDate = this.dateFormatter(this.payload.initDate);
      var paymentTime = this.payload.paymentTime;

      var finalDate = this.getFinalDate(initDate, paymentTime);

      var final = this.dateFormatter(finalDate);

      final = this.finalDateFormatter(final);
      initDate = this.finalDateFormatter(initDate);

      this.payload.initDate = initDate;

      this.payload.finalDate = final;
    },
    reloadDates() {
      this.payload.initDate = "";
      this.payload.finalDate = "";
    },
    setTrx() {
      this.payload.trxId = this.trx.id;
      this.payload.trxType = this.trx.codtrx;
    }
  }
};
</script>
<style lang="scss" scoped>
#dates-title {
  margin-bottom: -3em;
}
</style>
