<template>
  <v-app dark>
    <navbar>
      <v-btn icon @click="goTop">
        <v-icon>mdi-home</v-icon>
      </v-btn>
    </navbar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang='ts'>
import { defineComponent, useRouter } from '@nuxtjs/composition-api'
import Navbar from '~/components/Navbar.vue'

export default defineComponent({
  components: {
    Navbar,
  },
  setup() {
    const router = useRouter()
    const goTop = () => {
      router.push('/')
    }

    return {
      goTop,
    }
  }
})
</script>
