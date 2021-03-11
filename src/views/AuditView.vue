<template>
  <v-container id="audit-container">
    <Audit/>
  </v-container>
</template>
<script>
import Audit from "@/components/AuditComponents/AuditSearch";
import mixin from "@/mixins";
import { mapGetters, mapActions } from "vuex";
export default {
  mixins: [mixin],
  components: {
    Audit
  },
  created() {
    this.checkAuth();
    this.addAuthModulePermissions();
    this.$bus.emit('tokenRefreshTimerReset')
    this.fetchAllAudits()
  },
  computed: {
    ...mapGetters([
      "authPermissions",
      "authUserSelectedCompany",
      "allActiveCompanies",
      "authUserData"
    ])
  },
  methods: {
    ...mapActions(["addAuthModulePermissions", "fetchAllAudits"])
  }
};
</script>
<style lang="scss" scoped>
#audit-container {
  margin-top: 5.5em;
}
</style>

