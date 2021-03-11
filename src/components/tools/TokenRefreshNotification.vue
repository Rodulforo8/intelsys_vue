
<template>
  <v-container></v-container>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
const Swal = require("sweetalert2");
import mixin from "@/mixins";
import router from "../../router";
import store from "../../store";
import axios from 'axios'
import { setInterval, clearInterval } from "timers";
export default {
  data() {
    return {
      value: 2000,
      myVar: ''
    };
  },
  computed: {
    ...mapGetters(["allModules"])
  },
  methods: {
    ...mapActions(["authLogoutUser", "sayHello"])
  },
  created() {

 console.log('CREATED')

  this.myVar = setInterval(myNotification, 5000);

    function myNotification() {

        console.log(this.allModules)
      // store.dispatch('fetchRoles')
    }

  }

  //  beforeDestroy(){
  //   clearInterval(this.myVar)
  //   this.myVar = ''

  // }
};
</script>
