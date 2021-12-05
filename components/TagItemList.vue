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
            color='primary'
            @click='executeTagEdit(tagInfo.id, tagInfo.name)'
          >
            編集
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

    return {
      executeTagEdit,
    }
  }
})
</script>

<style>

</style>
