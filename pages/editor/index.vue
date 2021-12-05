<template>
  <bookmark-edit-form
    :bookmark-id='id'
    :create='true'
    :valid.sync='valid'
    :url.sync='url'
    :title.sync='title'
    :memo.sync='memo'
    :selected-tags.sync='selectedTags'
    @registerBookmark='registerBookmark'
    @cancelEdit='cancelEdit'
  />
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs, useMeta, useRouter } from '@nuxtjs/composition-api'
import BookmarkEditForm from '~/components/BookmarkEditForm.vue'
import { useBookmarkApi } from '~/composables/api/use-bookmark-api'
import { BookmarkRegisterItem } from '~/models/bookmark-item'

export default defineComponent({
  components: { BookmarkEditForm },
  setup() {
    const { title } = useMeta()
    const router = useRouter()
    const {
      registerBookmarkApi,
    } = useBookmarkApi()

    const bookmark = reactive({
      id: '',
      valid: true,
      url: '',
      title: '',
      memo: '',
      selectedTags: [] as Array<{ key: string, value: string }>
    })

    title.value = 'ブックマーク作成'

    const cancelEdit = () => {
      router.push('/')
    }

    const registerBookmark = async () => {
      const newBookmark: BookmarkRegisterItem = {
        url: bookmark.url,
        title: bookmark.title,
        memo: bookmark.memo,
        tags: bookmark.selectedTags.map(tag => tag.value)
      }
      const result = await registerBookmarkApi(newBookmark, '1')
      if (!result) {
        alert('ブックマーク登録エラー')
        return
      }
      router.push('/')
    }

    return {
      ...toRefs(bookmark),
      cancelEdit,
      registerBookmark,
    }
  },
  head: {},
})
</script>

<style scoped>

</style>
