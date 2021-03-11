<template>
  <v-container>
    <h3>Datos del Contrato:</h3>
    <v-form v-model="valid" ref="employeeForm2" lazy-validation>
      <v-row>
        <v-col cols="12" md="3" v-if="!updatingEmployee" >
         <v-autocomplete
            :color="fieldColor"
            v-model="data.companyId"
            :items="authPermissions.company"
            @change="getProjects"
            item-text="name"
            item-value="id"
            dense
            filled
            label="Compañías"
            :rules="[rules.required]"
          >       </v-autocomplete>
        </v-col>
        <v-col cols="12" md="4" v-if="updatingEmployee">
          <v-text-field
            class="field-text"
            v-model="data.proyecto"
            label="Proyecto"
            readonly
            :color="fieldColor"
            required
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3" v-if="!updatingEmployee">
          <v-select
            :color="fieldColor"
            v-model="data.projectData"
            :items="activeCompanyProjects"
            item-text="nameproy"
            item-value="id"
            return-object
            :loading="employeeProyectLoader"
            dense
            filled
            label="Proyecto"
            @change="getCountries"
           :rules="[rules.required]"
          >
          </v-select>
        </v-col>
        <v-col cols="12" md="3" v-if="!updatingEmployee">
           <v-text-field
                class="field-text"
                v-model="data.country"
                label="País"
                readonly
                :color="fieldColor"
                required
                :rules="[rules.required]"
              ></v-text-field>
        </v-col>
          <v-col cols="12" md="4" v-if="updatingEmployee">
           <v-text-field
                class="field-text"
                v-model="country"
                label="País"
                readonly
                :color="fieldColor"
                required
                :rules="[rules.required]"
              ></v-text-field>
        </v-col>
        <v-col cols="12" md="3" v-if="!updatingEmployee">
           <v-text-field
                class="field-text"
                v-model="data.province"
                label="Provincia"
                readonly
                :color="fieldColor"
                required
                :rules="[rules.required]"
              ></v-text-field>
        </v-col>
   <v-col cols="12" md="4" v-if="updatingEmployee">
           <v-text-field
                class="field-text"
                v-model="province"
                label="Provincia"
                readonly
                :color="fieldColor"
                required
                :rules="[rules.required]"
              ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
      <v-select
            :color="fieldColor"
            v-model="data.etipoemple"
            :items="contractType"
            dense
            filled
            label="Tipo de contrato"
          ></v-select>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="data.ecargo"
            label="Cargo del empleado"
            :color="fieldColor"
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            :color="fieldColor"
            v-model="data.etipopag"
            :items="paymentType"
            dense
            :rules="[rules.required]"
            filled
            label="Tipo de pago"
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
                v-model="data.efentrada"
                label="Fecha de entrada/Prueba"
                readonly
                :color="fieldColor"
                v-on="on"
                required
                :rules="[rules.required]"
              ></v-text-field>
            </template>
            <v-date-picker :color="fieldColor" v-model="data.efentrada" @input="menu1 = false"></v-date-picker>
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
                v-model="data.efcontrato"
                label="Fecha de contrato"
                readonly
                :color="fieldColor"
                v-on="on"
                required
                :rules="[rules.required]"
              ></v-text-field>
            </template>
            <v-date-picker :color="fieldColor" v-model="data.efcontrato" @input="menu2 = false"></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" md="4">
          <v-menu
            v-model="menu3"
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
                v-model="data.efvencecont"
                label="Fecha de vencimiento del contrato"
                readonly
                :color="fieldColor"
                v-on="on"
                required
                :rules="[rules.required]"
              ></v-text-field>
            </template>
            <v-date-picker :color="fieldColor" v-model="data.efvencecont" @input="menu3 = false"></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" md="4">
          <v-menu
            v-model="menu4"
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
                v-model="data.efac"
                label="Fecha de actualizacion"
                readonly
                :color="fieldColor"
                v-on="on"
                required
              ></v-text-field>
            </template>
            <v-date-picker :color="fieldColor" v-model="data.efac" @input="menu4 = false"></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="data.estatus"
            :color="fieldColor"
            :items="employeeStatus"
            item-text="text"
            item-value="value"
            dense
            filled
            :rules="[rules.required]"
            label="Estatus del empleado"
          ></v-select>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="data.refnumemple"
            label="Numero de referencia del empleado"
            :color="fieldColor"
             :rules="[rules.required]"
            type="number"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            type="number"
            required
            v-model="data.ediav"
            :rules="[rules.day]"
            label="Dia Ultimas Vacaciones"
            :color="fieldColor"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            label="Mes Ultimas Vacaciones"
            required
            type="number"
            v-model="data.emesv"
            :rules="[ rules.month]"
            :color="fieldColor"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            label="Año Ultimas Vacaciones"
            v-model="data.eanouv"
            type="number"
            :rules="[ rules.year]"
            required
            :color="fieldColor"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-menu
            v-model="menu6"
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
                v-model="data.efecucom"
                label="Fecha de ultima comisión"
                readonly
                     :rules="[rules.required]"
                :color="fieldColor"
                v-on="on"
                required
              ></v-text-field>
            </template>
            <v-date-picker :color="fieldColor" v-model="data.efecucom" @input="menu6 = false"></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field v-model="data.edepto" label="Departamento" :color="fieldColor"></v-text-field>
        </v-col>

        <v-col cols="12" md="4"></v-col>
        <v-col cols="12">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="data.eprimaprod"
            label="Monto Prima de Producción Fijo"
            :color="fieldColor"
            type="number"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="data.eviaticos"
            label="Monto viatico fijo"
            :color="fieldColor"
            type="number"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="data.esindicato"
            label="Monto sindicato fijo"
            :color="fieldColor"
            type="number"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-divider></v-divider>
        </v-col>

        <v-col md="1" cols="12"></v-col>
        <v-col md="2" cols="12">
          <p class="font-weight-light" style="color:#757575;font-size:15px;">En vacaciones:</p>
          <v-radio-group v-model="data.eesvac">
            <v-radio
              :color="fieldColor"
              required
              v-for="n in question"
              :key="n.value"
              :label="n.text"
              :value="n.value"
            ></v-radio>
          </v-radio-group>
        </v-col>
        <v-col md="2" cols="12">
          <p class="font-weight-light" style="color:#757575;font-size:15px;">Horas extras:</p>
          <v-radio-group v-model="data.ehex" required :rules="[rules.required]">
            <v-radio
              :color="fieldColor"
              required
              :rules="[rules.required]"
              v-for="n in question"
              :key="n.value"
              :label="n.text"
              :value="n.value"
            ></v-radio>
          </v-radio-group>
        </v-col>
        <v-col md="2" cols="12">
          <p class="font-weight-light" style="color:#757575;font-size:15px;">Seguro Educ:</p>
          <v-radio-group v-model="data.ecse">
            <v-radio
              :color="fieldColor"
              v-for="n in question"
              :key="n.value"
              :label="n.text"
              :value="n.value"
            ></v-radio>
          </v-radio-group>
        </v-col>
        <v-col md="2" cols="12">
          <p class="font-weight-light" style="color:#757575;font-size:15px;">Seguro Social:</p>
          <v-radio-group v-model="data.ecss">
            <v-radio
              v-for="n in question"
              :key="n.value"
              :label="n.text"
              :color="fieldColor"
              :value="n.value"
            ></v-radio>
          </v-radio-group>
        </v-col>
        <v-col md="2" cols="12">
          <p class="font-weight-light" style="color:#757575;font-size:15px;">Renta:</p>
          <v-radio-group v-model="data.eir">
            <v-radio
              v-for="n in question"
              :key="n.value"
              :color="fieldColor"
              :label="n.text"
              :value="n.value"
            ></v-radio>
          </v-radio-group>
        </v-col>
        <v-col cols="12">
          <v-divider></v-divider>
        </v-col>

        <v-col md="1" cols="12"></v-col>

        <v-col md="2" cols="12">
          <p class="font-weight-light" style="color:#757575;font-size:15px;">Viaticos:</p>
          <v-radio-group required :rules="[rules.required]" v-model="data.eviati">
            <v-radio
              v-for="n in question"
              :key="n.value"
              :label="n.text"
              :color="fieldColor"
              :value="n.value"
            ></v-radio>
          </v-radio-group>
        </v-col>
        <v-col md="2" cols="12">
          <p class="font-weight-light" style="color:#757575;font-size:15px;">Prelaborada:</p>
          <v-radio-group v-model="data.ecprelaborada">
            <v-radio
              v-for="n in question"
              :key="n.value"
              :label="n.text"
              :color="fieldColor"
              :value="n.value"
            ></v-radio>
          </v-radio-group>
        </v-col>
        <v-col md="2" cols="12">
          <p class="font-weight-light" style="color:#757575;font-size:15px;">Anexo 03:</p>
          <v-radio-group v-model="data.eanexo03" required :rules="[rules.required]">
            <v-radio
              v-for="n in question"
              :key="n.value"
              :label="n.text"
              :color="fieldColor"
              :value="n.value"
            ></v-radio>
          </v-radio-group>
        </v-col>
        <v-col md="2" cols="12">
          <p class="font-weight-light" style="color:#757575;font-size:15px;">Descuentos:</p>
          <v-radio-group v-model="data.descue">
            <v-radio
              v-for="n in question"
              :key="n.value"
              :label="n.text"
              :color="fieldColor"
              :value="n.value"
            ></v-radio>
          </v-radio-group>
        </v-col>
        <v-col md="2" cols="12">
          <p class="font-weight-light" style="color:#757575;font-size:15px;">Comisiones:</p>
          <v-radio-group v-model="data.ecomisi" required :rules="[rules.required]">
            <v-radio
              v-for="n in question"
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
import moment from "moment";
export default {
  mixins: [mixin],
  data() {
    return {
      fieldColor: "#1c6255",
      data: null,
      proyect: "",
      searchInput: null,
      valid: true,
      companyId: "",
      projectData: "",
      countryId: "",
      country: "",
      province: "",
      radios: "",
      question: [
        {
          text: "Si",
          value: "S"
        },
        {
          text: "No",
          value: "N"
        }
      ],
      contractType: ["INDEFINIDO", "FIJO", "TEMPORAL"],
      employeeType: ["FIJO", "TEMPORAL"],
      employeeStatus: [
        {
          text: "Activo",
          value: "A"
        },
        {
          text: "Inactivo",
          value: "I"
        }
      ],
   
      paymentType: [
        { text: "(D) Diario", value: "D" },
        { text: "(S) Semanal", value: "S" },
        {
          text: "(2s) Segunda semana o primera quincena",
          value: "2s"
        },
        {
          text: "(4s) Segunda Quincena o Cuarta Semana",
          value: "4s"
        },
        {
          text: "(Q) Quincenal",
          value: "Q"
        },
        { text: "(M) Mensual", value: "M" }
      ],
      menu1: false,
      menu2: false,
      menu3: false,
      menu4: false,
      menu5: false,
      menu6: false
    };
  },
  created() {
    // this.fetchAllowedCompanies();
    this.data = this.oneEmployee;
   
    // this.data.
    // this.fetchProjectsOfCompany();
    this.$bus.on("employeeContractDataStep", () => {
      this.validateContractData();
    });

    var date = moment().format("");
    date = moment(date, "YY-MM-DD").format("DD-MM-Y");

    this.data.efac = date;
    
  if(this.updatingEmployee){
      console.log('buscando el proyecto')
      this.fetchProject(this.data.proyecto_id)
      this.country = this.oneProject.pais
      this.province = this.oneProject.provincia
  }

  },

  beforeDestroy() {
    this.$bus.off("employeeContractDataStep");
  },
  computed: {
    ...mapGetters([
      "activeCompanyProjects",
      "userAllowedCompanies",
      "oneEmployee",
      "authPermissions",
      "authUserSelectedCompany",
      "provinceLoader",
      "employeeCountryLoader",
      "employeeProyectLoader",
      "activeCompanyProjects",
      "allProvinces",
      "updatingEmployee",
      "oneProject"
    ])
  },
  methods: {
    ...mapActions(["fetchLocalizedProjectsOfCompany", "employeeStepFoward", "fetchCountries", "fetchAuthUserCompanies", "fetchProject"]),
    validateContractData() {
      if (this.$refs.employeeForm2.validate()) {
        this.employeeStepFoward();
      }
    },
    getProjects() {
      this.country= ""
      this.province = ""
      this.fetchLocalizedProjectsOfCompany(this.data.companyId);
      this.fetchAuthUserCompanies()
    },
    getCountries(){

      this.data.country = this.data.projectData.pais
      this.data.province = this.data.projectData.prvincia
      this.data.eprovincia   = this.data.projectData.provincia_id
      this.data.proyecto_id = this.data.projectData.id
    }
  }
};
</script>

<style lang="scss" scoped>
.radio-btn-col {
  padding: 0;
}
</style>

