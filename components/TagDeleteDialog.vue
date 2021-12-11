<template>
  <v-dialog
    v-model='modal'
    persistent
    max-width='600px'
  >
    <v-card>
      <v-card-title>
        <span
          class='text-h5'
        >
          タグ削除
        </span>
      </v-card-title>
      <v-card-text>
        タグ <strong>{{ tagName }}</strong> ({{ tagNumber }}) を削除します。<br>
        よろしいですか？
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          text
          @click='cancelEdit'
        >
          キャンセル
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click='deleteTag'
        >
          削除
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "@nuxtjs/composition-api";
import { useBookmarkApi } from "~/composables/api/use-bookmark-api";

export default defineComponent({
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    tagId: {
      type: String,
      default: '',
    },
    tagName: {
      type: String,
      default: '',
    },
    tagNumber: {
      type: Number,
      default: 0,
    },
    userId: {
      type: String,
      default: ''
    },
  },
  setup(prop, { emit }) {
    const {
      deleteTagApi,
    } = useBookmarkApi()

    const modal = computed({
      get: () => prop.value,
      set: (val) => emit('input', val)
    })

    const deleteTag = async () => {
      await deleteTagApi(prop.tagId, prop.userId)
      modal.value = false
      emit('completeDeleteTag', prop.tagId)
    }

    const cancelEdit = () => {
      modal.value = false
    }

    return {
      modal,
      deleteTag,
      cancelEdit,
    }
  }
})
</script>

<style>

</style>
