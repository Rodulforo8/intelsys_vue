<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card id="outer-card" elevation="6">
            <v-card id="inner-title-card" elevation="6">
              <v-col id="inner-title-card-col">
                <v-icon id="inner-card-icon" large color="white">attach_money</v-icon>Crear Descuento
              </v-col>
            </v-card>
            <!---------------------------- CAMPOS DE INPUT ------------------------------------->
            <v-form v-model="valid" ref="discountForm" lnazy-validation>
              <v-container>
                <v-row>
                  <!--[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[ EMPLOYEE FIELD ]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]-->
                  <v-col cols="12" md="4">
                    <v-autocomplete
                      :color="fieldColor"
                      prepend-icon="mdi-account-tie"
                      :items="allEmployees"
                      item-text="nombre"
                      item-value="id"
                      v-model="data.empleado_id"
                      filled
                      label="Empleado"
                      required
                      :rules="[rules.required]"
                    ></v-autocomplete>
                  </v-col>
                  <!-- <v-col cols="12" md="4">
                    <v-text-field
                      :color="fieldColor"
                      type="number"
                      v-model="data.decedula"
                      label="Cedula del Empleado"
                      readonly
                      required
                      :rules="[rules.required]"
                    ></v-text-field>
                  </v-col>-->
                  <!--[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[ PROYECT FIELD ]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]-->
                  <v-col cols="12" md="4">
                    <v-autocomplete
                      :color="fieldColor"
                      prepend-icon="work"
                      :items="activeCompanyProjects"
                      item-text="nameproy"
                      item-value="id"
                      v-model="data.deidproy"
                      filled
                      label="Proyecto:"
                      required
                      :rules="[rules.required]"
                    ></v-autocomplete>
                  </v-col>
                  <!--[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[ CREDITOR FIELD ]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]-->
                  <v-col cols="12" md="4">
                    <v-autocomplete
                      :color="fieldColor"
                      :items="allCreditors"
                      item-text="acnameacree"
                      item-value="id"
                      v-model="data.acreedor_id"
                      prepend-icon="mdi-account-cash-outline"
                      filled
                      label="Acreedor"
                      required
                      :rules="[rules.required]"
                    ></v-autocomplete>
                  </v-col>
                  <!--[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[ LOAN NUMBER FIELD ]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]-->
                  <!-- <v-col cols="12" md="4">
                    <v-autocomplete
                      :color="fieldColor"
                      prepend-icon="work"
                     
                      filled
                      label="N del prestamo"
                      required
                      :rules="[rules.required]"
                    ></v-autocomplete>
                  </v-col>-->
                  <!--[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[ DEDUCTION TYPE FIELD ]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]-->
                  <v-col cols="12" md="4">
                    <v-autocomplete
                      :color="fieldColor"
                      prepend-icon="work"
                      :items="allDeductionTypes"
                      item-text="nombre_deduccion"
                      item-value="id"
                      v-model="data.detipodeduc"
                      filled
                      label="Tipo de deducción"
                      required
                      :rules="[rules.required]"
                    ></v-autocomplete>
                  </v-col>

                  <v-col md="4" cols="12">
                    <v-text-field
                      id="search-bar"
                      :color="fieldColor"
                      type="number"
                      v-model="data.demontoini"
                      label="Monto total inicial"
                      prepend-icon="attach_money"
                      required
                      step="0.01"
                      min="0.00"
                      max="1000.00"
                      :rules="[rules.required]"
                    ></v-text-field>
                  </v-col>
                  <v-col md="4" cols="12">
                    <v-text-field
                      id="search-bar"
                      :color="fieldColor"
                      label="Monto total pagado"
                      v-model="data.depagado"
                      type="number"
                      prepend-icon="attach_money"
                      required
                      :rules="[rules.required]"
                    ></v-text-field>
                  </v-col>
                  <v-col md="4" cols="12">
                    <v-text-field
                      :color="fieldColor"
                      label="Saldo total"
                      required
                      v-model="data.desaldo"
                      type="number"
                      :rules="[rules.required]"
                      prepend-icon="attach_money"
                    ></v-text-field>
                  </v-col>
                  <v-col md="4" cols="12">
                    <v-menu
                      v-model="menu2"
                      :color="fieldColor"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          label="Fecha del descuento"
                          prepend-icon="event"
                          v-model="data.defechadesc"
                          readonly
                          :color="fieldColor"
                          v-on="on"
                          required
                          :rules="[rules.required]"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="data.defechadesc"
                        @change="formatDiscountDate"
                        :color="fieldColor"
                        @input="menu2 = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col md="4" cols="12">
                    <v-menu
                      v-model="menu"
                      :color="fieldColor"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          label="Fecha de inicio del descuento"
                          prepend-icon="event"
                          v-model="data.defini"
                          readonly
                          :color="fieldColor"
                          v-on="on"
                          required
                          :rules="[rules.required]"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="data.defini"
                        @change="formatDiscountFinalDate"
                        :color="fieldColor"
                        @input="menu = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col md="4" cols="12">
                    <v-text-field
                      :color="fieldColor"
                      v-model="data.refprestamo"
                      label="Referencia del Prestamo"
                      prepend-icon="attach_money"
                      required
                      :rules="[rules.required]"
                    ></v-text-field>
                  </v-col>
                  <v-col md="12" cols="12">
                    <v-divider></v-divider>
                  </v-col>
                  <!--****************************************[ RADIO BUTTONS ]*********************************************** -->
                  <v-col md="1" cols="12"></v-col>
                  <v-col md="2" cols="12">
                    <p
                      class="font-weight-light"
                      style="color:#757575;font-size:15px;"
                    >El descuento es en:</p>
                    <v-radio-group disabled v-model="radioGroupdDiscountType">
                      <v-radio
                        :color="fieldColor"
                        required
                        :rules="[rules.required]"
                        v-for="n in discountType"
                        :key="n.value"
                        :label="n.text"
                        :value="n.value"
                      ></v-radio>
                    </v-radio-group>
                  </v-col>
                  <v-col md="2" cols="12">
                    <p
                      class="font-weight-light"
                      style="color:#757575;font-size:15px;"
                    >Aplica en diciembre:</p>
                    <v-radio-group required v-model="data.dedic" :rules="[rules.required]">
                      <v-radio
                        :color="fieldColor"
                        v-for="n in booleanRadioItem"
                        :key="n.value"
                        :label="n.text"
                        :value="n.value"
                      ></v-radio>
                    </v-radio-group>
                  </v-col>
                  <v-col style="margin-right:-3em;" md="3" cols="12">
                    <p
                      class="font-weight-light"
                      style="color:#757575;font-size:15px;"
                    >Aplica para décimo tercero:</p>
                    <v-radio-group v-model="data.deendeci" required :rules="[rules.required]">
                      <v-radio
                        v-for="n in booleanRadioItem"
                        :key="n.value"
                        :label="n.text"
                        :color="fieldColor"
                        :value="n.value"
                      ></v-radio>
                    </v-radio-group>
                  </v-col>
                  <v-col md="2" cols="12">
                    <p
                      class="font-weight-light"
                      style="color:#757575;font-size:15px;"
                    >Es descuento sindical:</p>

                    <v-radio-group
                      required
                      :rules="[rules.required]"
                      v-model="radioGroupUnionDiscount"
                    >
                      <v-radio
                        v-for="n in booleanRadioItem"
                        :key="n.value"
                        :color="fieldColor"
                        :label="n.text"
                        :value="n.value"
                      ></v-radio>
                    </v-radio-group>
                  </v-col>

                  <v-col md="2" cols="12">
                    <p class="font-weight-light" style="color:#757575;font-size:15px;">Estatus:</p>
                    <v-radio-group required :rules="[rules.required]" v-model="data.destatus">
                      <v-radio
                        v-for="n in statusRadioItem"
                        :key="n.value"
                        :label="n.text"
                        :color="fieldColor"
                        :value="n.value"
                      ></v-radio>
                    </v-radio-group>
                  </v-col>

                  <!--****************************************[ RADIO BUTTONS ]*********************************************** -->
                </v-row>
                <v-row>
                  <!-------------------------------- CAMPOS DE INPUT ----------------------------------------->
                  <!--------------------------------- RADIO BOTONES ------------------------------------------>
                  <v-col cols="12">
                    <v-divider></v-divider>
                  </v-col>
                  <v-col md="6" cols="12">
                    <p
                      class="font-weight-light"
                      style="color:#757575;font-size:20px;"
                    >Periodo a descontar:</p>
                    <v-radio-group disabled v-model="radioGroupPeriod">
                      <v-radio
                        :color="fieldColor"
                        @change="discountPeriod(n.value)"
                        v-for="n in discountPeriods"
                        :key="n.value"
                        :label="n.value + n.text"
                        :value="n.value"
                      ></v-radio>
                    </v-radio-group>
                  </v-col>
                  <!---------------------------------- RADIO BOTONES ---------------------------------------------->
                  <v-col cols="1">
                    <v-divider vertical></v-divider>
                  </v-col>
                  <!--------------------------------- FORMULARIO DINAMICO ------------------------------------------>
                  <v-col md="4" cols="12">
                    <v-select
                      :items="discountItems"
                      item-text="name"
                      item-value="id"
                      v-model="formSelection"
                      prepend-icon="help"
                      label="Descuento por periodo"
                      @change="renderForm()"
                      required
                      :rules="[rules.required]"
                      :color="fieldColor"
                      outlined
                    ></v-select>
                    <v-col v-if="showForm1" cols="12">
                      <v-text-field
                        label="Monto"
                        :color="fieldColor"
                        v-model="data.demontopla"
                        prepend-icon="attach_money"
                        required
                        :rules="[rules.required]"
                        type="number"
                      ></v-text-field>
                    </v-col>
                    <v-col v-if="showForm2" cols="12">
                      <v-text-field
                        label="Porcentaje"
                        required
                        :color="fieldColor"
                        v-model="data.deporcentaje"
                        :rules="[rules.required]"
                        prepend-icon="mdi-percent"
                        type="number"
                      ></v-text-field>
                    </v-col>
                    <v-col v-if="showForm3" cols="12">
                      <v-text-field
                        label="Semana 1°"
                        v-model="data.monp1"
                        prepend-icon="event"
                        :color="fieldColor"
                        type="number"
                        required
                        :rules="[rules.required]"
                      ></v-text-field>
                      <v-text-field
                        label="Semana 2° ó 1° quincena"
                        prepend-icon="event"
                        v-model="data.monp2"
                        type="number"
                        :color="fieldColor"
                        required
                        :rules="[rules.required]"
                      ></v-text-field>
                      <v-text-field
                        label="Semana 3°"
                        prepend-icon="event"
                        v-model="data.monp3"
                        :color="fieldColor"
                        type="number"
                        required
                        :rules="[rules.required]"
                      ></v-text-field>
                      <v-text-field
                        label="Semana 4° ó 2° quincena"
                        v-model="data.monp4"
                        prepend-icon="event"
                        type="number"
                        :color="fieldColor"
                        required
                        :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import mixin from "@/mixins";
const Swal = require("sweetalert2");
export default {
  props: ["fieldColor"],
  mixins: [mixin],
  data() {
    return {
      menu: false,
      menu2: false,
      props: ["fieldColor"],
      payload: {},
      showForm1: false,
      showForm2: false,
      showForm3: false,
      radioGroupPeriod: "",
      radioGroupdDiscountType: "",
      radioGroupDecemberApply: "",
      radioGroupdThirteenthApply: "",
      radioGroupUnionDiscount: "",
      radioGroupdStatus: "",
      valid: true,
      offset: true,
      item: 1,
      formSelection: "",
      data: "",
      discountItems: [
        {
          id: 1,
          name: "Por dinero"
        },
        {
          id: 2,
          name: "Por porcentaje"
        },
        {
          id: 3,
          name: "En dinero, que varie cada periodo"
        }
      ],
      discountPeriods: [
        { text: "- Si es solo en la primera semana", value: "1" },
        {
          text: "- Si es solo en la segunda semana o primera quincena",
          value: "2"
        },
        { text: "- Si es solo en la tercera semana", value: "3" },
        {
          text: "- Si es solo en la segunda semana ó primera quincena",
          value: "4"
        },
        {
          text: "- Si es quincenal, es decir todas las quincenas",
          value: "Q"
        },
        { text: "- Si es semanal, es decir cada semana", value: "T" },
        {
          text: "- Si es en las semanas 2 y 4, es decir cada 2 semanas",
          value: "A"
        },
        { text: "- Si es mensual, es decir cada mes", value: "M" }
      ],
      discountType: [
        {
          text: "Cheque",
          value: "C"
        },
        {
          text: "Efectivo",
          value: "E"
        },
        {
          text: "Otros",
          value: "O"
        }
      ],
      booleanRadioItem: [
        {
          text: "SI",
          value: "S"
        },
        {
          text: "NO",
          value: "N"
        }
      ],
      statusRadioItem: [
        {
          text: "Activo",
          value: "A"
        },
        {
          text: "Inactivo",
          value: "I"
        }
      ]
    };
  },
  created() {
    this.data = this.oneDiscount;
    this.$bus.on("discountSubmit", () => {
      this.submitForm();
    });
    this.initialize();
  },
  computed: {
    ...mapGetters([
      "allEmployees",
      "allCreditors",
      "activeCompanyProjects",
      "oneDiscount",
      "allDeductionTypes"
    ])
  },
  methods: {
    ...mapActions([
      "fetchAllCreditors",
      "fetchEmployees",
      "fetchProjectsOfCompany",
      "fetchDeductionTypes",
      "createDiscount"
    ]),
    initialize() {
      this.fetchAllCreditors();
      this.fetchProjectsOfCompany();
      this.fetchEmployees();
      this.fetchDeductionTypes();
    },
    submitForm() {
      if (this.$refs.discountForm.validate()) {
        Swal.fire({
          title: "Esta seguro de que quiere crear el descuento?",
          text: "",
          type: "question",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancelar",
          confirmButtonText: "Crear",
          showCancelButton: true
        }).then(result => {
          if (result.value) {
            this.createDiscount(this.data);
          }
        });
      }
    },
    renderForm() {
      if (this.formSelection === 1) {
        this.showForm1 = true;
        this.showForm2 = false;
        this.showForm3 = false;
      } else if (this.formSelection === 2) {
        this.showForm1 = false;
        this.showForm2 = true;
        this.showForm3 = false;
      } else if (this.formSelection === 3) {
        this.showForm1 = false;
        this.showForm2 = false;
        this.showForm3 = true;
      }
    },
    formatDiscountDate() {
      // this.data.defechadesc = this.momentFormatter(this.data.defechadesc);
    },
    formatDiscountFinalDate() {
      // this.data.defini = this.momentFormatter(this.data.defini);
    }
  }
};
</script>
<style lang="scss" scoped>
#card {
  margin-top: 3em;
}
</style>
