<template>
  <v-menu offset-y>
    <template #activator='{ on, attrs }'>
      <v-btn
        color='indigo'
        class='dropdown-menu'
        dark
        elevation='0'
        v-bind="attrs"
        v-on="on"
      >
        山田太郎
        <v-icon
          dark
          light
        >
          mdi-menu-down
        </v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item>
        <v-list-item-title>プロファイル</v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>ログアウト</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang='ts'>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    return {}
  }
})
</script>

<style scoped>
.dropdown-menu {
  margin-right: -10px;
}
</style>
