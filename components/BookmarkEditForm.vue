<template>
  <v-card>
    <v-card-title>
      <span>
        {{ cardTitle }}
      </span>
    </v-card-title>
    <v-card-text>
      <v-form
        ref='formRef'
        v-model='localValid'
      >
        <v-text-field
          v-model='localUrl'
          placeholder='Url...'
          label='Url'
          :rules='urlRules'
          :error-messages='urlMessages'
          required
          outlined
          dense
        />
        <v-text-field
          v-model='localTitle'
          label='Title'
          placeholder='Title...'
          :rules='titleRules'
          required
          outlined
          dense
        />
        <tags-input
          v-model='localSelectedTags'
          class='tags-input'
          :typeahead="true"
          :existing-tags='existingTags'
          element-id='tags'
        />
        <v-textarea
          v-model='localMemo'
          label='Memo'
          outlined
          dense
          placeholder='Memo...'
        />
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-btn
        v-if='!create'
        color='error'
        @click='deleteBookmark'
      >
        削除
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        @click='cancelEdit'
      >
        キャンセル
      </v-btn>
      <v-btn
        v-if='create'
        class='primary'
        @click='registerBookmark'
      >
        登録
      </v-btn>
      <v-btn
        v-else
        class='primary'
        @click='updateBookmark'
      >
        更新
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang='ts'>
import { computed, defineComponent, PropType, reactive, ref, toRefs, useFetch, watch } from '@nuxtjs/composition-api'
import { useBookmarkApi } from '~/composables/api/use-bookmark-api'

export default defineComponent({
  props: {
    valid: {
      type: Boolean,
      default: false,
    },
    bookmarkId: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    memo: {
      type: String,
      default: '',
    },
    selectedTags: {
      type: Array as PropType<Array<{ key: string, value: string }>>,
      default: () => {},
    },
    create: {
      type: Boolean,
      default: false,
    },
  },
  setup(prop, { emit }) {
    const {
      getTagInfoListApi,
      getBookmarkApi,
    } = useBookmarkApi()

    const formRef = ref<HTMLFormElement>()
    const waitValidate = ref(false)
    const rules = reactive({
      urlRules: [
        (v: string) => !!v || 'URLは必須です',
      ],
      titleRules: [
        (v: string) => !!v || 'タイトルは必須です',
      ],
    })
    const messages = reactive({
      urlMessages: [] as Array<string>,
    })
    const tagState = reactive({
      existingTags: [] as Array<{ key: string, value: string }>
    })

    const cardTitle = computed(() => prop.create ? 'ブックマーク作成' : 'ブックマーク編集')

    const localValid = computed({
      get: () => prop.valid,
      set: (val) => emit('update:valid', val)
    })

    const localUrl = computed({
      get: () => prop.url,
      set: (val) => emit('update:url', val)
    })

    const localTitle= computed({
      get: () => prop.title,
      set: (val) => emit('update:title', val)
    })

    const localMemo = computed({
      get: () => prop.memo,
      set: (val) => emit('update:memo', val)
    })

    const localSelectedTags = computed({
      get: () => prop.selectedTags,
      set: (val) => emit('update:selectedTags', val)
    })

    watch(
      () => prop.url,
      (newVal) => {
        if (newVal === '') return
        if (waitValidate.value) return
        waitValidate.value = true
        setTimeout(async () => {
          if (prop.url !== '') {
            const result = await validateUrl(prop.url)
            if (prop.url !== '') {
              if (result !== true) {
                messages.urlMessages = [result]
              } else {
                messages.urlMessages = []
              }
            }
          }
          waitValidate.value = false
        }, 200)
      }
    )

    const { fetch, } = useFetch(async () => {
      const tagTmp = await getTagInfoListApi('1')
      tagState.existingTags = tagTmp.tagInfos.map(tagInfo =>
        ({
          key: tagInfo.id,
          value: tagInfo.name
        })
      )
    })

    fetch()

    const validateUrl = async (url: string) => {
      const bookmark = await getBookmarkApi(url, '1')
      if (prop.create) {
        if (bookmark === null) return true
        return 'URLが登録済みです'
      } else {
        if (!bookmark) return true
        // 同じURLが別IDで登録されていたらエラー
        return bookmark.id === prop.bookmarkId ? true : 'URLが登録済みです'
      }
    }

    const registerBookmark = () => {
      validate()
      if (prop.valid) {
        emit('registerBookmark')
      }
    }

    const updateBookmark = () => {
      validate()
      if (prop.valid) {
        emit('updateBookmark')
      }
    }

    const deleteBookmark = () => {
      emit('deleteBookmark')
    }

    const cancelEdit = () => {
      emit('cancelEdit')
    }

    const validate = () => {
      formRef.value?.validate()
    }

    return {
      formRef,
      ...toRefs(rules),
      ...toRefs(tagState),
      ...toRefs(messages),
      cardTitle,
      localValid,
      localUrl,
      localTitle,
      localMemo,
      localSelectedTags,
      registerBookmark,
      updateBookmark,
      deleteBookmark,
      cancelEdit,
      validate,
    }
  }
})
</script>

<style>
.tags-input .tags-input-badge {
  font-size: 16px;
}
.tags-input-wrapper-default {
  width: 100%;
  padding: 9px;
}

p.typeahead-badges {
  margin-bottom: 0;
}

.tags-input-root {
  margin-bottom: 24px;
}
</style>
