<template>
  <v-container>
    <!-- {{data}} -->
    <h3>Datos Personales:</h3>
    <v-form v-model="valid" ref="employeeForm1" lazy-validation>
      <v-row>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="data.enombre"
            label="Nombres"
            name="Proyectos"
            :color="fieldColor"
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="data.eapellido1"
            label="Primer Apellido"
            name="Proyectos"
            :color="fieldColor"
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="data.eapellido2"
            label="Segundo Apellido"
            name="Proyectos"
            :color="fieldColor"
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field v-model="data.eapellidoc" label="Apellido Matrimonial" :color="fieldColor"></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field v-model="data.ecorreo" label="Email" :color="fieldColor" :rules="[rules.required]"></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="data.ecedula"
            label="Cedula"
            name="Proyectos"
            :color="fieldColor"
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="2">
          <v-text-field v-model="data.edv" maxlength="2" label="DV" :color="fieldColor"></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            label="N seguro social"
            v-model="data.enss"
            :color="fieldColor"

            :rules="[rules.required]"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-menu
            v-model="menu"
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
                v-model="data.efechanac"
                label="Fecha de nacimiento"
                readonly
                :color="fieldColor"
                v-on="on"
                  :rules="[rules.required]"
                name="Fecha"
              ></v-text-field>
            </template>
            <v-date-picker :color="fieldColor" v-model="data.efechanac" @input="menu = false"></v-date-picker>
          </v-menu>
        </v-col>

        <v-col align="center" cols="4">
          <v-select
            v-model="data.esexo"
            :color="fieldColor"
            :items="genderRadio"
            item-text="text"
            item-value="value"
            dense
            filled
            label="Sexo"
            required
            :rules="[rules.required]"
          ></v-select>
        </v-col>

        <v-col cols="4">
          <v-select
            :color="fieldColor"
            v-model="data.ecivil"
            :items="civilState"
            item-text="text"
            item-value="value"
            dense
            filled
            :rules="[rules.required]"
            label="Estado Civil"
          ></v-select>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field label="Ubicacion del empleado" v-model="data.esub" :color="fieldColor"></v-text-field>
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
      menu: false,
      genderRadio: [
        {
          text: "MASCULINO",
          value: "M"
        },
        {
          text: "FEMENINO",
          value: "F"
        }
      ],
      civilState: [
        {
          text: "CASADO(A)",
          value: "CASADO(A)"
        },
        {
          text: "SOLTERO(A)",
          value: "SOLTERO(A)"
        },
        {
          text: "VIUDO(A)",
          value: "VIUDO(A)"
        },
        {
          text: "UNIDO(A)",
          value: "UNIDO(A)"
        },
        {
          text: "DIVORCIADO(A)",
          value: "DIVORCIADO(A)"
        }
      ],
      data: null
    };
  },
  created() {
    // this.fetchDepartmentData();
    this.data = this.oneEmployee;
    this.$bus.on("employeePersonalDataStep", () => {
      this.validatePersonalData();
    });
  },
  beforeDestroy() {
    this.$bus.off("employeePersonalDataStep");
  },
  computed: {
    ...mapGetters([
      "allProjects",
      "provinceLoader",
      "oneEmployee",
      "allProvinces"
    ])
  },
  methods: {
    ...mapActions([
      "employeeStepFoward",
      "addEmployeePersonalData",
      "fetchDepartmentData"
    ]),
    validatePersonalData() {
      if (this.$refs.employeeForm1.validate()) {
        this.addEmployeePersonalData(this.data);
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

