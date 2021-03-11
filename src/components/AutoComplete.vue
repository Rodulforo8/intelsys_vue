<template>
  <v-card
  >
    <v-card-text>
      <v-autocomplete
        v-model="model"
        :items="allGroups"
        color="white"
         item-text="nameagru"
        item-value="nameagru"
        label="Agrupaciones"
        prepend-icon="group"
      ></v-autocomplete>
    </v-card-text>

  </v-card>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
  export default {
    data: () => ({
      descriptionLimit: 60,
      entries: [],
      isLoading: false,
      model: null,
      search: null,
    }),
    created(){
        this.fetchGroups();
    },
    computed: {
         ...mapGetters([
      "allGroups",
    ]),
      fields () {
        if (!this.model) return []

        return Object.keys(this.model).map(key => {
          return {
            key,
            value: this.model[key] || 'n/a',
          }
        })
      },
      items () {
        return this.entries.map(entry => {
          const Description = entry.Description.length > this.descriptionLimit
            ? entry.Description.slice(0, this.descriptionLimit) + '...'
            : entry.Description

          return Object.assign({}, entry, { Description })
        })
      },
    },
        methods:{
            ...mapActions(['fetchGroups'])
        },

  }
</script>