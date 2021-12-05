<template>
  <div v-if='loading'></div>
  <v-alert
    v-else-if='noBookmark'
    type='error'
  >
    ブックマークが見つかりません
  </v-alert>
  <bookmark-edit-form
    v-else
    :bookmark-id='id'
    :valid.sync='valid'
    :url.sync='url'
    :title.sync='title'
    :memo.sync='memo'
    :selected-tags.sync='selectedTags'
    @updateBookmark='updateBookmark'
    @deleteBookmark='deleteBookmark'
    @cancelEdit='cancelEdit'
  />
</template>

<script lang='ts'>
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  useFetch, useMeta,
  useRoute,
  useRouter
} from '@nuxtjs/composition-api'
import { useBookmarkApi } from '~/composables/api/use-bookmark-api'
import BookmarkEditForm from '~/components/BookmarkEditForm.vue'
import { BookmarkUpdateItem } from '~/models/bookmark-item'

export default defineComponent({
  components: { BookmarkEditForm },
  setup() {
    const { title } = useMeta()
    const route = useRoute()
    const router = useRouter()
    const {
      getBookmarkForEditApi,
      updateBookmarkApi,
      deleteBookmarkApi,
    } = useBookmarkApi()

    const noBookmark = ref(false)
    const loading = ref(true)
    const bookmark = reactive({
      id: '',
      valid: true,
      url: '',
      title: '',
      memo: '',
      selectedTags: [] as Array<{ key: string, value: string }>
    })

    const { fetch, } = useFetch(async () => {
      const tmpBookmark = await getBookmarkForEditApi(route.value.params.url, '1')
      if (tmpBookmark) {
        bookmark.id = tmpBookmark.id
        bookmark.url = tmpBookmark.url
        bookmark.title = tmpBookmark.title
        bookmark.memo = tmpBookmark.memo
        bookmark.selectedTags = tmpBookmark.tags.map(tag => ({ key: tag.id, value: tag.name }))
      } else {
        noBookmark.value = true
      }

      loading.value = false
    })

    title.value = 'ブックマーク編集'

    fetch()

    const deleteBookmark = async () => {
      const result = await deleteBookmarkApi(bookmark.id, '1')
      if (!result) {
        alert('ブックマーク削除エラー')
        return
      }
      router.push('/')
    }

    const cancelEdit = () => {
      router.push('/')
    }

    const updateBookmark = async () => {
      const updateBookmark: BookmarkUpdateItem = {
        id: bookmark.id,
        url: bookmark.url,
        title: bookmark.title,
        memo: bookmark.memo,
        tags: bookmark.selectedTags.map(tag => tag.value)
      }
      const result = await updateBookmarkApi(updateBookmark, '1')
      if (!result) {
        alert('ブックマーク更新エラー')
        return
      }
      router.push('/')
    }

    return {
      noBookmark,
      loading,
      ...toRefs(bookmark),
      deleteBookmark,
      cancelEdit,
      updateBookmark,
    }
  },
  head: {},
})
</script>

<style>
</style>
