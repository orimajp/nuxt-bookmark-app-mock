<template>
  <v-simple-table>
    <template #default>
      <tbody>
      <tr
        v-for='tagInfo in tagInfos'
        :key='tagInfo.id'
      >
        <td>
          {{ tagInfo.name }} ({{ tagInfo.tagNumber }})
        </td>
        <td style='text-align: right; padding-right: 6px;'>
          <v-btn
            icon
            @click="executeTagDelete(tagInfo.id, tagInfo.name, tagInfo.tagNumber)"
          >
            <v-icon>
              mdi-delete
            </v-icon>
          </v-btn>
          <v-btn
            icon
            @click='executeTagEdit(tagInfo.id, tagInfo.name)'
          >
            <v-icon>
              mdi-pencil
            </v-icon>
          </v-btn>
        </td>
      </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script lang='ts'>
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { TagInfo } from '~/models/tag'

export default defineComponent({
  props: {
    tagInfos: {
      type: Array as PropType<Array<TagInfo>>,
      default: () => [],
    }
  },
  setup(_, { emit }) {
    const executeTagEdit = (tagId: string, tagName: string) => {
      emit('executeTagEdit', { tagId, tagName })
    }

    const executeTagDelete = (tagId: string, tagName: string, tagNumber: number) => {
      emit('executeTagDelete', { tagId, tagName, tagNumber })
    }

    return {
      executeTagEdit,
      executeTagDelete,
    }
  }
})
</script>

<style>

</style>
