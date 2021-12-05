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
        <v-list-item-content>
          <v-list-item-title
            class='item-link'
            @click='goTagLink(tagLink.link)'
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
import { computed, defineComponent, PropType, ref, useRouter, watch } from "@nuxtjs/composition-api";
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
    }
  },
  setup(prop, { emit }) {
    const router = useRouter()

    const searchString = ref<string | null>('')

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
    const tagLinks = computed(() => {
      const links: Array<TagLink> = [{
        name: 'タグ指定無し',
        link: '/',
        count: prop.bookmarkItems.length
      }]
      const addLink = filteredTags.value.map(tagInfo => ({
        name: tagInfo.name,
        link: `/?tag=${encodeURIComponent(tagInfo.name)}`,
        count: tagInfo.tagNumber,
      }))
      return links.concat(addLink)
    })

    watch(
      () => searchString.value,
      (newVal) => {
        console.log('searchString', newVal)
      }
    )

    const goTagLink = (link: string) => {
      router.push(link)
    }

    const goTagListPage = () => {
      router.push('/tag')
    }

    return {
      searchString,
      drawer,
      tagLinks,
      goTagLink,
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
