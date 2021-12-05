<template>
  <div>
    <v-text-field
      v-model='searchString'
      placeholder='tag search'
      clearable
    />
    <v-alert
      v-if='noTagInfos'
      type='info'
    >
      タグが見つかりません
    </v-alert>
    <v-card
      v-else
    >
      <v-card-text>
        <tag-item-list
          :tag-infos='filteredTagInfos'
          @executeTagEdit='openTagEditModal'
        />
      </v-card-text>
    </v-card>
    <tag-edit-dialog
      v-model='modal'
      :user-id='userId'
      :tag-id='tagId'
      :tag-name='tagName'
      :tag-infos='tagInfos'
      @competeTagUpdate='competeTagUpdate'
    />
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent, reactive, ref, toRefs, useFetch, useMeta } from '@nuxtjs/composition-api'
import { TagInfo } from '~/models/tag'
import TagItemList from '~/components/TagItemList.vue'
import { useBookmarkApi } from '~/composables/api/use-bookmark-api'
import TagEditDialog from '~/components/TagEditDialog.vue'

export default defineComponent({
  components: { TagEditDialog, TagItemList },
  setup() {
    const { title } = useMeta()
    const {
      getTagInfoListApi,
    } = useBookmarkApi()

    const userId = ref('1')
    const searchString = ref('')
    const tagInfosState = reactive({
      tagInfos: [] as Array<TagInfo>
    })
    const tagEditState = reactive({
      modal: false,
      tagId: '',
      tagName: '',
    })

    const filteredTagInfos = computed(() => {
      if (searchString.value === '') {
        return  tagInfosState.tagInfos
      } else {
        return tagInfosState.tagInfos.filter(tagInfo => tagInfo.name.includes(searchString.value))
      }
    })
    const noTagInfos = computed(() => filteredTagInfos.value.length === 0)

    const { fetch, } = useFetch(async () => {
      const result = await getTagInfoListApi(userId.value)
      tagInfosState.tagInfos = result.tagInfos
    })

    title.value = 'タグ一覧'

    fetch()

    const openTagEditModal = ({ tagId, tagName }: { tagId: string, tagName: string }) => {
      tagEditState.tagId = tagId
      tagEditState.tagName = tagName
      tagEditState.modal = true
    }

    const competeTagUpdate = async () => {
      const result = await getTagInfoListApi(userId.value)
      tagInfosState.tagInfos = result.tagInfos
    }

    return {
      userId,
      searchString,
      filteredTagInfos,
      noTagInfos,
      ...toRefs(tagInfosState),
      ...toRefs(tagEditState),
      openTagEditModal,
      competeTagUpdate,
    }
  },
  head: {},
})
</script>

<style scoped>

</style>
