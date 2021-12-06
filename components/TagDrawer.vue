<template>
  <v-navigation-drawer
    v-model='drawer'
    app
    dark
    clipped
    color='secondary'
  >
    <div style='padding: 0 16px'>
      <v-text-field
        v-model="searchString"
        placeholder='tag search'
        clearable
      />
    </div>
    <v-list
      dense
      nav
    >
      <v-list-item
        v-for='tagLink in tagLinks'
        :key='tagLink.name'
        class='list-item-content'
      >
        <v-list-item-icon
          style="margin-right: 3px;"
        >
          <v-icon
            small
            v-text="tagLink.icon"
          />
        </v-list-item-icon>
        <v-list-item-content
          @click='addTag(tagLink.tag)'
        >
          <v-list-item-title
            class='item-link'
          >
            {{ tagLink.name }} ({{ tagLink.count }})
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <template #append>
      <div class="pa-2">
        <v-btn
          block
          color='primary'
          @click='goTagListPage'
        >
          タグ編集
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script lang='ts'>
import { computed, defineComponent, PropType, reactive, ref, toRefs, useRouter, watch } from "@nuxtjs/composition-api";
import { TagInfo } from '~/models/tag'
import { TagLink } from '~/models/tag-link'
import { BookmarkItem } from '~/models/bookmark-item'

export default defineComponent({
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    tagInfos: {
      type: Array as PropType<Array<TagInfo>>,
      default: () => [],
    },
    bookmarkItems: {
      type: Array as PropType<Array<BookmarkItem>>,
      default: () => [],
    },
    totalBookmarkNumber: {
      type: Number,
      default: 0,
    },
    searchingTags: {
      type: Array as PropType <Array<string>>,
      default: () => [] as Array<string>,
    },
  },
  setup(prop, { emit }) {
    const router = useRouter()

    const searchString = ref<string | null>('')

    const tagLinksState = reactive({
      tagLinks: [] as Array<TagLink>
    })

    const drawer = computed({
      get: () => prop.value,
      set: (val) => emit('input', val)
    })
    const filteredTags = computed(() => {
      if (searchString.value === '' || searchString.value === null) {
        return prop.tagInfos
      } else {
        return prop.tagInfos
          .filter(tagInfo => tagInfo.name.includes(searchString.value as string))
      }
      })

    watch(
      () => [filteredTags.value , prop.searchingTags],
      ([newFilteredTags, newSearchingTags]) => {
        const tags: Array<TagLink> = [{
          name: 'タグ指定無し',
          tag: '',
          icon: newSearchingTags.length
            ? 'mdi-checkbox-blank-circle' : 'mdi-checkbox-marked-circle',
          count: prop.totalBookmarkNumber,
        }]
        const addTags = (newFilteredTags as Array<TagInfo>).map(tagInfo => ({
          name: tagInfo.name,
          tag: tagInfo.name,
          icon: (newSearchingTags as Array<string>).includes(tagInfo.name)
            ? 'mdi-checkbox-marked-circle' : 'mdi-checkbox-blank-circle',
          count: tagInfo.tagNumber,
        }))
        tagLinksState.tagLinks = tags.concat(addTags)
      }
    )

    watch(
      () => searchString.value,
      (newVal) => {
        console.log('searchString', newVal)
      }
    )

    const addTag = (tag: string) => {
      if (tag === '') {
        router.push('/')
      } else {
        emit('addTag', tag)
      }
    }

    const goTagListPage = () => {
      router.push('/tag')
    }

    return {
      searchString,
      drawer,
      ...toRefs(tagLinksState),
      addTag,
      goTagListPage,
    }
  }
})
</script>

<style scoped>
.item-link {
  cursor: pointer;
}
.list-item-content:hover {
  background: gray;
}
</style>
