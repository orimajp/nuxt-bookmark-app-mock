import { useDummyStore } from '~/composables/api/use-dummy-store'
import { GetBookmarkListResponse } from '~/models/api/get-bookmark-list-response'
import { GetBookmarkListRequest } from '~/models/api/get-bookmark-list-request'
import { GetTagInfoListResponse } from '~/models/api/get-tag-info-list-response'
import { BookmarkEditItem, BookmarkItem, BookmarkRegisterItem, BookmarkUpdateItem } from '~/models/bookmark-item'
import { Tag } from '~/models/tag'

export const useBookmarkApi = () => {

  const {
    getBookmarkList,
    getBookmark,
    getBookmarkForEdit,
    getTagInfoList,
    registerBookmark,
    updateBookmark,
    deleteBookmark,
    updateTag,
  } = useDummyStore()

  const getBookmarkListApi = (params: GetBookmarkListRequest): Promise<GetBookmarkListResponse> => {
    return new Promise(resolve => {
      const searchTags = params.searchTags? params.searchTags : []
      const bookmarks = getBookmarkList(searchTags, params.userId)
      resolve({
        lists: bookmarks
      })
    })
  }

  const getTagInfoListApi = (userId: string): Promise<GetTagInfoListResponse> => {
    return new Promise(resolve => {
      const tagInfos = getTagInfoList(userId)
      resolve({
        tagInfos
      })
    })
  }

  const getBookmarkApi = (url: string, userId: string): Promise<BookmarkItem | null> => {
    return new Promise(resolve => {
      const bookmark = getBookmark(url, userId)
      resolve(bookmark)
    })
  }

  const getBookmarkForEditApi = (url: string, userId: string): Promise<BookmarkEditItem | null> => {
    return new Promise(resolve => {
      const bookmark = getBookmarkForEdit(url, userId)
      resolve(bookmark)
    })
  }

  const registerBookmarkApi = (newBookmark: BookmarkRegisterItem, userId: string): Promise<BookmarkItem | null> => {
    return new Promise(resolve => {
      const bookmark = registerBookmark(newBookmark, userId)
      resolve(bookmark)
    })
  }

  const updateBookmarkApi = (existsBookmark: BookmarkUpdateItem, userId: string): Promise<BookmarkItem | null> => {
    return new Promise(resolve => {
      const bookmark = updateBookmark(existsBookmark, userId)
      resolve(bookmark)
    })
  }

  const deleteBookmarkApi = (bookmarkId: string, userId: string): Promise<boolean> => {
    return new Promise(resolve => {
      const result = deleteBookmark(bookmarkId, userId)
      resolve(result)
    })
  }

  const updateTagApi = (tag: Tag): Promise<boolean> => {
    return new Promise<boolean>(resolve => {
      const result = updateTag(tag)
      resolve(result)
    })
  }

  return {
    getBookmarkListApi,
    getBookmarkApi,
    getBookmarkForEditApi,
    getTagInfoListApi,
    registerBookmarkApi,
    updateBookmarkApi,
    deleteBookmarkApi,
    updateTagApi,
  }
}
