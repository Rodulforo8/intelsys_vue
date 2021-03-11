
<template>
  <div class="text-center">
    <v-overlay  :value="overlay">
      <v-progress-circular :size="120" :width="9" color="#1c6255" :indeterminate="true"></v-progress-circular>
    </v-overlay>
  </div>
</template>
<script>
const Swal = require("sweetalert2");
import { mapGetters, mapActions } from "vuex";
export default {
  inject: ["theme"],
  data() {
    return {
      overlay: true
    };
  },
  created() {
    // setTimeout(() => {
    //   this.showCircularPreloader()
    //   Swal.fire({
    //     type: "error",
    //     title: "Error de comunicacion con el servidor",
    //     showConfirmButton: false,
    //     timer: 40000
    //   });
    // }, 2000);
  },
  methods: {
    ...mapActions(["showCircularPreloader"]),
    
  }
};
</script>


<style scoped>
.v-progress-circular {
  margin: 1rem;
}
</style>