<template>
  <v-container>
    <h3>Acumulados:</h3>
    <v-form v-model="valid" ref="employeeForm4" lazy-validation>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            label="Acumulado Total"
            :color="fieldColor"
            v-model="data.eacumbru"
            type="number"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            label="Acumulado Seguro Educ"
            v-model="data.eacumse"
            :color="fieldColor"
            type="number"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            label="Acumulado Seguro Social"
            v-model="data.eacumss"
            :color="fieldColor"
            type="number"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            label="Acumulado Renta"
            v-model="data.eacumre"
            :color="fieldColor"
            type="number"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            label="Acumulado G Representa"
            v-model="data.eacumgr"
            :color="fieldColor"
            type="number"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            label="Acumulado de Vacaciones"
            v-model="data.eacumvac"
            :color="fieldColor"
            type="number"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            label="Acumulado de Decimo"
            :color="fieldColor"
            v-model="data.eacumxiii"
            type="number"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            label="Acumulado Prima de Prod"
            type="number"
            v-model="data.eacumprp"
            :color="fieldColor"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            label="Acumulado de Comision"
            type="number"
            v-model="data.eacumcom"
            :color="fieldColor"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            label="Acumulado Viatico"
            type="number"
            v-model="data.eacumvi"
            :color="fieldColor"
          ></v-text-field>
        </v-col>
        <!-- <v-col cols="12" md="4">
          <v-text-field
            label="Desglose de efectivo"
            type="number"
            v-model="data.esin"
            :color="fieldColor"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            label="Prima"
            type="number"
            v-model="data.eprimap"
            :color="fieldColor"
          ></v-text-field>
        </v-col>-->

        <v-col md="1" cols="12"></v-col>
        <v-col md="2" cols="12">
          <v-radio-group
            v-model="data.esin"
            :rules="[rules.required]"
            required
            label="Desglose de efectivo:"
          >
            <v-radio
              v-for="n in question"
              :key="n.value"
              :label="n.text"
              :color="fieldColor"
              :value="n.value"
            ></v-radio>
          </v-radio-group>
        </v-col>
 <v-col md="1" cols="12"></v-col>
        <v-col md="2" cols="12">
          <v-radio-group v-model="data.eprimap" :rules="[rules.required]" required label="Prima de Produción:">
            <v-radio
              v-for="n in question"
              :key="n.value"
              :label="n.text"
              :color="fieldColor"
              :value="n.value"
            ></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="12">
          <v-divider></v-divider>
        </v-col>
        <v-container>
          <h3>Acumulados para la liquidacion</h3>
        </v-container>
        <!------------------------------------------------------------------------------------------------->
        <v-col cols="12" md="3">
               <v-tooltip color="black" bottom>
                  <template v-slot:activator="{ on }">
          <v-text-field v-on="on" label="Acumulado Total de salarios pagados (Opcional)" type="number" v-model="data.eacumtsa" :color="fieldColor"></v-text-field>
           </template>
                  <span>Acumulado Total de salarios pagados (Opcional)</span>
                </v-tooltip>
        </v-col>
        <v-col cols="12" md="3">
            <v-tooltip color="black" bottom>
                  <template v-slot:activator="{ on }">
                      <v-text-field  v-on="on" label="Acumulado anual de viáticos que pagan Renta, pagadas en el año fiscal
Actual (opcional)" type="number" v-model="data.eacumtva" :color="fieldColor"></v-text-field>
                  </template>
                  <span>Acumulado anual de viáticos que pagan Renta, pagadas en el año fiscal
Actual (opcional)</span>
                </v-tooltip>
    
        </v-col>
        <v-col cols="12" md="3">
           <v-tooltip color="black" bottom>
                  <template v-slot:activator="{ on }">
          <v-text-field v-on="on" label="Acumulado Total de Decimos Pagados Antes de usar este sistema" type="number" v-model="data.eacumtvi" :color="fieldColor"></v-text-field>
            </template>
                  <span>Acumulado Total de Decimos Pagados Antes de usar este sistema)</span>
                </v-tooltip>
        </v-col>
        <v-col cols="12" md="3">
                  <v-tooltip color="black" bottom>
                  <template v-slot:activator="{ on }">
          <v-text-field v-on="on"  label="Acumulado de décimo terceros pagados del año
fiscal Actual antes de usar este sistema" type="number" v-model="data.eacumtco" :color="fieldColor"></v-text-field>
          </template>
                  <span>Acumulado de décimo terceros pagados del año
fiscal Actual antes de usar este sistema</span>
                </v-tooltip>
        </v-col>
        <v-col cols="12" md="3">
                 <v-tooltip color="black" bottom>
                  <template v-slot:activator="{ on }">
          <v-text-field v-on="on" label="Acumulado total del salario, décimo y vacaciones pagados en el año Actual
antes de usar este sistema" type="number" v-model="data.eacumtxiii" :color="fieldColor"></v-text-field>
        </template>
                  <span>Acumulado total del salario, décimo y vacaciones pagados en el año Actual
antes de usar este sistema</span>
                </v-tooltip>
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
      question: [
        {
          text: "Si",
          value: "S"
        },
        {
          text: "No",
          value: "N"
        }
      ]
    };
  },
  created() {
    this.data = this.oneEmployee;
    this.$bus.on("employeeAccumulatedDataStep", () => {
      this.validateAccumulatedData();
    });
  },
  beforeDestroy() {
    this.$bus.off("employeeAccumulatedDataStep");
  },
  computed: {
    ...mapGetters(["oneEmployee"])
  },
  methods: {
    ...mapActions(["employeeStepFoward"]),
    validateAccumulatedData() {
      if (this.$refs.employeeForm4.validate()) {
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
</style>

