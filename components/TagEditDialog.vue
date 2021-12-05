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
          タグ編集
        </span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form
            v-model='valid'
          >
            <v-text-field
              v-model='name'
              :rules='tagNameRules'
              label='Tag'
              outlined
              dense
            />
          </v-form>
        </v-container>
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
          @click='updateTag'
        >
          タグ更新
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang='ts'>
import { computed, defineComponent, PropType, reactive, ref, toRefs, watch } from '@nuxtjs/composition-api'
import { Tag, TagInfo } from '~/models/tag'
import { useBookmarkApi } from '~/composables/api/use-bookmark-api'

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
    tagInfos: {
      type: Array as PropType<Array<TagInfo>>,
      default: () => [],
    },
    userId: {
      type: String,
      default: ''
    }
  },
  setup(prop, { emit }) {
    const {
      updateTagApi,
    } = useBookmarkApi()

    const valid = ref(true)
    const modal = computed({
      get: () => prop.value,
      set: (val) => emit('input', val)
    })
    const form = reactive({
      id: '',
      name: '',
    })

    const tagNameRules = [
      (v: string) => !!v || 'タグ名は必須です',
      (v: string) => validateDuplicateTags(v),
    ]

    watch(
      () => modal.value,
      (newVal) => {
        if (newVal) {
          form.id = prop.tagId
          form.name = prop.tagName
        }
      }
    )

    const validateDuplicateTags = (tagName: string) => {
      if (tagName === '') return true
      const tags = prop.tagInfos?.filter(tagInfo => tagInfo.name === tagName)
      if (!tags.length) return true
      return tags[0].id === form.id ? true : 'タグ名が重複しています'
    }

    const updateTag = async () => {
      if (valid.value) {
        const tag: Tag = {
          id: form.id,
          name: form.name,
          userId: prop.userId,
        }
        const result = await updateTagApi(tag)
        if (!result) {
          alert('タグ更新エラー')
          return
        }
        modal.value = false
        emit('competeTagUpdate')
      }
    }

    const cancelEdit = () => {
      modal.value = false
    }

    return {
      valid,
      modal,
      ...toRefs(form),
      tagNameRules,
      updateTag,
      cancelEdit,
    }
  }
})
</script>

<style>

</style>
