<template>
  <v-app dark>
    <tag-drawer
      v-model='drawer'
      :tag-infos='tagInfos'
      :bookmark-items="bookmarks"
      :total-bookmark-number="totalBookmarkNumber"
      :searching-tags="searchingTags"
      @addTag="addTag"
    />
    <navbar>
      <v-app-bar-nav-icon @click='drawer = !drawer'></v-app-bar-nav-icon>
    </navbar>
    <v-main>
      <v-container>
        <div
          v-if='searchTagsMessage !== ""'
          class='search-tags'
        >
          {{ searchTagsMessage }}
          <nuxt-link to='/' class='tag-reset-link'>タグクリア</nuxt-link>
        </div>
        <v-text-field
          v-model='searchString'
          placeholder='title search'
          clearable
        />
        <v-alert
          v-if='noBookmarks'
          type='info'
        >
          ブックマークが見つかりません
        </v-alert>
        <v-card
          v-else
        >
          <v-card-text>
            <bookmark-item-list
              :bookmarks='filteredBookmark'
              :searching-tags="searchingTags"
              @addTag='addTag'
            />
          </v-card-text>
        </v-card>
        <v-btn
          class='add-button'
          color='primary'
          dark
          absolute
          bottom
          right
          fab
          @click='goBookmarkCreatePage'
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-container>
    </v-main>
  </v-app>
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
  useRouter,
  watch
} from '@nuxtjs/composition-api'
import Navbar from '~/components/Navbar.vue'
import TagDrawer from '~/components/TagDrawer.vue'
import { BookmarkItem } from '~/models/bookmark-item'
import { useBookmarkApi } from '~/composables/api/use-bookmark-api'
import BookmarkItemList from '~/components/BookmarkItemList.vue'
import { TagInfo } from '~/models/tag'

export default defineComponent({
  components: {
    BookmarkItemList,
    TagDrawer,
    Navbar,
  },
  layout: 'plain',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const { title } = useMeta()
    const {
      getBookmarkListApi,
      getTotalBookmarkNumber,
      getTagInfoListApi,
    } = useBookmarkApi()

    const searchString = ref<string | null>('')
    const drawer = ref(false)
    const totalBookmarkNumber = ref(0)
    const bookmarkState = reactive({
      bookmarks: [] as Array<BookmarkItem>
    })
    const tagInfoState = reactive({
      tagInfos: [] as Array<TagInfo>
    })
    const searchingTagState = reactive({
      searchingTags: [] as Array<string>
    })

    const query = computed(() => route.value.query)
    const filteredBookmark = computed(() => {
      if (!searchString.value || searchString.value === '') {
        return bookmarkState.bookmarks
      } else {
        return bookmarkState.bookmarks
          .filter(bookmark => bookmark.title.includes(searchString.value as string))
      }
    })
    const noBookmarks = computed(() => filteredBookmark.value.length === 0)
    const searchTagsMessage = computed(() =>
      searchingTagState.searchingTags.length === 0
        ? ''
        : 'tags: ' + searchingTagState.searchingTags.join(', ')
    )

    watch(
      () => query.value,
      async (newVal) => {
        let tags: Array<string> = []
        const newTag = newVal.tag
        if (newTag) {
          if (Array.isArray(newTag)) {
            const filteredTags = newTag.filter(tag => tag !== null) as Array<string>
            if (filteredTags.length) {
              tags = tags.concat(filteredTags)
            }
          } else {
            tags.push(newTag)
          }
        }
        const bookmarks = await getBookmarkListApi({searchTags: tags, userId: '1'})
        searchingTagState.searchingTags = tags
        bookmarkState.bookmarks = bookmarks.lists
      }
    )

    const { fetch, } = useFetch(async () => {
      const result = await getTotalBookmarkNumber('1')
      totalBookmarkNumber.value = result.bookmarkNumbers
      const tags: Array<string> = route.value.query.tag
        ? Array.isArray(route.value.query.tag)
          ? route.value.query.tag as Array<string>
          : [route.value.query.tag]
        : []
      const bookmarks = await getBookmarkListApi({searchTags: tags, userId: '1'})
      bookmarkState.bookmarks = bookmarks.lists
      searchingTagState.searchingTags = tags
      const tagInfos = await getTagInfoListApi('1')
      tagInfoState.tagInfos = tagInfos.tagInfos
    })

    title.value = 'ブックマーク一覧'

    fetch()

    const goBookmarkCreatePage = () => {
      router.push('/editor')
    }

    const addTag = (tag: string) => {
      let tags: Array<string> = []
      const currentTags = query.value.tag
      console.log(currentTags)

      if (Array.isArray(currentTags)) {
        console.log('1')
        const stringTags = currentTags as Array<string>
        if (stringTags.includes(tag)) {
          tags = stringTags.filter(stringTag => stringTag !== tag)
        } else {
          tags = tags.concat(stringTags)
//          tags = stringTags
          tags.push(tag)
        }
      } else if (currentTags) {
        console.log('2')
        if (tag !== currentTags) {
          tags.push(currentTags)
          tags.push(tag)
        }
      } else {
        console.log('3')
        tags.push(tag)
      }

      console.log('tags', tags)


      const params = tags.map(tag => `tag=${encodeURIComponent(tag)}` ).join('&')

      console.log('params', params)

      const tagQuery = params.length ? '?' + params : ''

      console.log('tagQuery', tagQuery)

      router.push(`/${tagQuery}`)
    }

    return {
      searchString,
      totalBookmarkNumber,
      drawer,
      filteredBookmark,
      noBookmarks,
      ...toRefs(bookmarkState),
      ...toRefs(tagInfoState),
      ...toRefs(searchingTagState),
      searchTagsMessage,
      goBookmarkCreatePage,
      addTag,
    }
  },
  head: {},
})
</script>
<style>
.add-button {
  margin-bottom: 44px;
}
.tag-reset-link {
  margin-left: 20px;
  font-size: 60%;
}
.search-tags {
  font-size: 150%;
  margin-top: 20px;
}
</style>
