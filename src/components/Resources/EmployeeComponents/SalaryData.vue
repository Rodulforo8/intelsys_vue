<template>
  <v-container>
    <h3>Datos del Salario:</h3>
    <v-form v-model="valid" ref="employeeForm3" lazy-validation>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            label="Salario por periodo"
            :color="fieldColor"
            required
            type="number"
            v-model="data.esalario"
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            label="Salario por hora"
            :color="fieldColor"
            type="number"
            required
            v-model="data.ebh"
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            label="Horas por periodo"
            v-model="data.ehxperiodo"
            :color="fieldColor"
            type="number"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="data.eclaveir"
            label="Clave de Imp/Renta"
            :color="fieldColor"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="data.edependient"
            label="N Dependiente"
            type="number"
            :color="fieldColor"
            required
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            label="# XIII corridos"
            v-model="data.eperx"
            :color="fieldColor"
            type="number"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            label="# Planillas corridas"
            v-model="data.eperiodo"
            :color="fieldColor"
            type="number"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            label="Comision Fija"
            v-model="data.ecomisiones"
            :color="fieldColor"
            type="number"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            label="Impuesto Renta Fija"
            v-model="data.eirm"
            :color="fieldColor"
            type="number"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            label="Gas. Representa Fijo"
            v-model="data.gasrep"
            prepend-icon="group"
            :color="fieldColor"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="4">
          <v-text-field
            label="Cuenta Bancaria"
            v-model="data.enoctaban"
           
            required
            :color="fieldColor"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            label="Cuenta Bancaria Secundaria"
            v-model="data.enoctaba1"
           
            required
            :color="fieldColor"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            label="Año del calculo"
            v-model="data.ecalyear"
            type="number"
            :rules="[rules.required, rules.year]"
            required
            :color="fieldColor"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            label="Mes del calculo"
            v-model="data.ecalmes"
            type="number"
            maxlength="2"
            :rules="[rules.required, rules.month]"
            required
            :color="fieldColor"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            label="Periodo de Calculo"
            v-model="data.ecalper"
            :rules="[rules.required, rules.limit]"
            maxlength="1"
            required
            :color="fieldColor"
          ></v-text-field>
        </v-col>
        <v-col md="1" cols="12"></v-col>
        <v-col md="2" cols="12">
          <v-radio-group
            v-model="data.eformapag"
            :rules="[rules.required]"
            required
            label="Cobrara en:"
          >
            <v-radio
              v-for="n in paymentIn"
              :key="n.value"
              :label="n.text"
              :color="fieldColor"
              :value="n.value"
            ></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import mixin from "@/mixins";
export default {
  mixins: [mixin],
  data() {
    return {
      valid: true,
      fieldColor: "#1c6255",
      data: null,
      paymentIn: [
        {
          text: "Cheque",
          value: "C"
        },
        {
          text: "Efectivo",
          value: "E"
        },
        {
          text: "ACH",
          value: "O"
        }
      ]
    };
  },
  created() {
    this.data = this.oneEmployee;
    this.$bus.on("employeeSalaryDataStep", () => {
      this.validateSalaryData();
    });
  },
  beforeDestroy() {
    this.$bus.off("employeeSalaryDataStep");
  },
  computed: {
    ...mapGetters(["oneEmployee"])
  },
  methods: {
    ...mapActions(["employeeStepFoward"]),
    validateSalaryData() {
      if (this.$refs.employeeForm3.validate()) {
        this.employeeStepFoward();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.radio-btn-col {
  padding: 0;
}

.v-radio {
  padding: 0;
}
</style>

