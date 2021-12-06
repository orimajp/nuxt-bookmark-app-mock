<template>
  <v-simple-table>
    <template #default>
      <tbody>
      <tr
        v-for='bookmark in bookmarks'
        :key='bookmark.id'
      >
        <td
          style='padding-top: 3px; padding-bottom: 3px;'
        >
          <div>
            <a
              class='external-link'
              :href='bookmark.url'
              target='_blank'
              rel='noopener noreferrer'
            >
              {{ bookmark.title }}
            </a>
          </div>
          <div>
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
                v-for='tag in bookmark.tags'
                :key='tag'
                x-small
                @click='addTag(tag)'
              >
                <v-avatar
                  left
                  style="margin-left: -6px; margin-right: 0; min-width: 12px; width: 12px;"
                >
                  <v-icon
                    x-small
                    class="check-icon"
                    v-text="matchTagIcon(tag)"
                  />
                </v-avatar>
                {{ tag }}
              </v-chip>
            </v-chip-group>
          </div>
        </td>
        <td class='icon-block' style='padding-right: 6px;'>
          <v-btn icon>
            <v-icon
              color="grey lighten-1"
              @click='goBookmarkPage(bookmark.encodedUrl)'
            >
              mdi-information
            </v-icon>
          </v-btn>
        </td>
      </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script lang='ts'>
import { defineComponent, PropType, useRouter } from '@nuxtjs/composition-api'
import { BookmarkItem } from '~/models/bookmark-item'

export default defineComponent({
  props: {
    bookmarks: {
      type: Array as PropType<Array<BookmarkItem>>,
      default: () => []
    },
    searchingTags: {
      type: Array as PropType <Array<string>>,
      default: () => [],
    },
  },
  setup(prop, { emit }) {
    const router = useRouter()

    const goBookmarkPage = (url: string) => {
      router.push(`/item/${url}`)
    }

    const addTag = (tag: string) => {
      emit('addTag', tag)
    }

    const matchTagIcon = (tag: string): string => {
      return prop.searchingTags.includes(tag)
        ? 'mdi-checkbox-marked-circle' : 'mdi-checkbox-blank-circle'
    }

    return {
      goBookmarkPage,
      addTag,
      matchTagIcon,
    }
  }
})
</script>

<style scoped>
.external-link {
  font-size: 130%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
.icon-block {
  text-align: right;
}
.no-tags {
  font-size: 10px;
  padding: 9px 0;
}
.check-icon {
  width: 12px;
  /*
  margin-left: -12px;
  margin-right: -12px;

   */
}
</style>
