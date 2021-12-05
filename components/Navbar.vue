<template>
  <v-app-bar
    dense
    fixed
    clipped-left
    app
    dark
    color='indigo'
  >
    <slot />
    <v-toolbar-title>Bookmarks</v-toolbar-title>
    <v-spacer></v-spacer>
    <dropdown-menu/>
  </v-app-bar>
</template>

<script lang='ts'>
import { defineComponent } from '@nuxtjs/composition-api'
import DropdownMenu from '~/components/DropdownMenu.vue'

export default defineComponent({
  components: {
    DropdownMenu,
  },
  setup() {

  }
})
</script>

<style scoped>
</style>
