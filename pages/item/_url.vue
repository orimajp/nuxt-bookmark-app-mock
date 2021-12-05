<template>
  <div v-if='loading'>
    loading...
  </div>
  <v-alert
    v-else-if='bookmark === null'
    type='error'
  >
    ブックマークが見つかりません
  </v-alert>
  <v-card
    v-else
    class='mx-auto'
  >
    <v-card-text>
      <a
        :href='bookmark.url'
        target='_blank'
        rel='noreferrer'
        style='font-size: 150%'
      >
        {{ bookmark.title }}
      </a>
      <div
        v-if='!bookmark.tags.length'
        class='no-tags'
      >
        タグ未設定
      </div>
      <v-chip-group
        v-else
      >
        <v-chip
          v-for='(tag, index) in bookmark.tags'
          :key='index'
          x-small
        >
          {{ tag }}
        </v-chip>
      </v-chip-group>
      <pre class='rounded memo-area'>{{ bookmark.memo }}</pre>
    </v-card-text>
    <v-card-actions>
      <v-list-item>
        <v-row
          align='center'
          justify='end'
        >
          <v-btn
            class='primary'
            @click='goEdit'
          >
            編集
          </v-btn>
        </v-row>
      </v-list-item>
    </v-card-actions>
  </v-card>
</template>

<script lang='ts'>
import {
  computed,
  defineComponent,
  reactive,
  ref,
  toRefs,
  useFetch, useMeta,
  useRoute,
  useRouter
} from '@nuxtjs/composition-api'
import { useBookmarkApi } from '~/composables/api/use-bookmark-api'
import { BookmarkItem } from '~/models/bookmark-item'

export default defineComponent({
  setup() {
    const { title } = useMeta()
    const route = useRoute()
    const router = useRouter()
    const {
      getBookmarkApi,
    } = useBookmarkApi()

    const loading = ref(true)
    const state = reactive({
      bookmark: null as null | BookmarkItem
    })

    const url = computed(() => encodeURIComponent(route.value.params.url))

    const { fetch, } = useFetch(async () => {
      const tmp = await getBookmarkApi(route.value.params.url, '1')
      if (tmp) {
        state.bookmark = tmp
        title.value = tmp.title
      } else {
        title.value = 'ブックマークが見つかりません'
      }
      loading.value = false
    })

    fetch()

    const goEdit = () => {
      router.push(`/editor/${url.value}`)
    }

    return {
      ...toRefs(state),
      loading,
      goEdit,
    }
  },
  head: {},
})
</script>

<style scoped>
.no-tags {
  font-size: 10px;
  padding: 5px 0;
}
.memo-area {
  background-color: rgba(0,0,0,0.12);
  padding: 10px;
  min-height: 42px;
}
</style>
