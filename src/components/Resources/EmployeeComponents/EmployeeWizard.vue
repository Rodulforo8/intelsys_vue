<template>
  <v-container>
  
    <v-row>
      <v-col md="12" cols="12">
        <v-card id="outer-card" elevation="6">
          <v-col
            cols="12"
            style="position: absolute;text-align: right;color: #113d4c;"
          >{{employeeStepperValue}}/4</v-col>
          <v-card id="inner-title-card" elevation="6">
            <v-col id="inner-title-card-col">
              <v-icon id="inner-card-icon" large color="white">mdi-account-plus</v-icon>Crear Empleado
            </v-col>
          </v-card>
          <v-col style="margin:auto;" cols="12" md="12">
            <v-stepper v-model="employeeStepperValue" class="mt-1 elevation-0">
              <v-stepper-header default>
                <v-stepper-step
                  color="#1c6255"
                  :complete="employeeStepperValue > 1"
                  step="1"
                >Empleado</v-stepper-step>
                <v-divider></v-divider>
                <v-stepper-step
                  color="#1c6255"
                  :complete="employeeStepperValue > 2"
                  step="2"
                >Contrato</v-stepper-step>
                <v-divider></v-divider>

                <v-stepper-step
                  color="#1c6255"
                  :complete="employeeStepperValue > 3"
                  step="3"
                >Salario</v-stepper-step>
                <v-divider></v-divider>

                <v-stepper-step
                  color="#1c6255"
                  :complete="employeeStepperValue > 4"
                  step="4"
                >Acumulados</v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step color="#1c6255" step="5">Finalizar</v-stepper-step>
              </v-stepper-header>
            </v-stepper>
          </v-col>

          <v-col cols="12">
            <v-divider></v-divider>
          </v-col>

          <transition name="slide-fade">
            <PersonalData v-if="employeeStepperValue===1 || employeeStepperValue >4"/>
          </transition>

          <transition name="slide-fade">
            <ContractData v-if="employeeStepperValue===2 || employeeStepperValue >4"/>
          </transition>

          <transition name="slide-fade">
            <SalaryData v-if="employeeStepperValue===3 || employeeStepperValue >4"/>
          </transition>

          <transition name="slide-fade">
            <AccumulatedData v-if="employeeStepperValue===4 || employeeStepperValue >4"/>
          </transition>
          <v-col style="padding:0;" cols="12">
            <v-divider></v-divider>
          </v-col>

          <v-row>
            <v-col align="left" cols="6" md="6">
              <v-btn
                @click="backStep()"
                v-if="employeeStepperValue > 1"
                color="#1c6255"
                class="stepper-btn"
              >
                <v-icon dark>arrow-left</v-icon>RETROCEDER
              </v-btn>
            </v-col>

            <v-col align="right" cols="6" md="6">
              <v-btn
                @click="nextStep()"
                v-if="employeeStepperValue < 5"
                color="#1c6255"
                class="stepper-btn"
              >
                CONTINUAR
                <v-icon dark>arrow-right</v-icon>
              </v-btn>
              <v-btn @click="finalize()" v-else color="#1c6255" class="stepper-btn">
                FINALIZAR
                <v-icon dark>arrow-right</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import PersonalData from "@/components/Resources/EmployeeComponents/PersonalData.vue";
import ContractData from "@/components/Resources/EmployeeComponents/ContractData.vue";
import SalaryData from "@/components/Resources/EmployeeComponents/SalaryData.vue";
import AccumulatedData from "@/components/Resources/EmployeeComponents/AccumulatedData.vue";
const Swal = require("sweetalert2");
export default {
  props: ["fieldColor"],
  components: {
    PersonalData,
    ContractData,
    SalaryData,
    AccumulatedData
  },
  data() {
    return {
      radioGroup: 1
    };
  },
  created() {
    this.$bus.on("saveEmployee", () => {
      this.finalize();
    });
  },
  computed: {
    ...mapGetters(["employeeStepperValue", "oneEmployee", "updatingEmployee"])
  },
  methods: {
    ...mapActions([
      "employeeStepFoward",
      "employeeStepBackward",
      "createEmployee",
      "updateEmployee"
    ]),
    nextStep() {
      if (this.employeeStepperValue <= 1) {
        this.$bus.emit("employeePersonalDataStep");
      } else if (this.employeeStepperValue === 2) {
        this.$bus.emit("employeeContractDataStep");
        // this.employeeStepFoward();
      } else if (this.employeeStepperValue === 3) {
        this.$bus.emit("employeeSalaryDataStep");
      }
       else if (this.employeeStepperValue === 4) {
        this.$bus.emit("employeeAccumulatedDataStep");
      }
    },
    backStep() {
      this.employeeStepBackward();
    },
    finalize() {
      if (this.updatingEmployee) {
        Swal.fire({
          title: "Esta seguro de que quiere actualizar el empleado?",
          text: "",
          type: "warning",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancelar",
          confirmButtonText: "Aceptar",
          showCancelButton: true
        }).then(result => {
          if (result.value) {
            this.updateEmployee(this.oneEmployee);
          }
        });
      } else {
        Swal.fire({
          title: "Esta seguro de que quiere crear el empleado?",
          text: "",
          type: "warning",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          cancelButtonText: "Cancelar",
          confirmButtonText: "Aceptar",
          showCancelButton: true
        }).then(result => {
          if (result.value) {
            this.createEmployee(this.oneEmployee);
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.stepper-btn {
  margin-left: 1em;
  margin-right: 1em;
  color: white;
}

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
