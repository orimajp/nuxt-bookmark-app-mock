import { nanoid } from 'nanoid'
// import dayjs from '@nuxtjs/dayjs'
import * as dayjs from 'dayjs'
import { BookmarkEditItem, BookmarkItem, BookmarkRegisterItem, BookmarkUpdateItem } from '~/models/bookmark-item'
import { Tag, TagInfo } from '~/models/tag'

interface BookmarkData {
  id: string
  url: string
  title: string
  memo: string
  encodedUrl: string
  registerTime: number
  updateTime: number
  userId: string
}

interface TagData {
  id: string
  name: string
  userId: string
}

interface BookmarkTag {
  id: string
  bookmarkId: string
  tagId: string
  userId: string
}

let bookmarkList: Array<BookmarkData> = []
let tagList: Array<TagData> = []
let bookmarkTagList: Array<BookmarkTag> = []

tagList.push(
  {
    id: '11', name: 'Google', userId: '1',
  },
  {
    id: '22', name: 'AWS', userId: '1',
  },
  {
    id: '33', name: 'Azure', userId: '1',
  },
  {
    id: '44', name: 'Oracle', userId: '1',
  },
  {
    id: '55', name: 'IBM', userId: '1',
  },
  {
    id: '66', name: '富士通', userId: '1',
  },
  {
    id: '77', name: 'UNISYS', userId: '1',
  },
)

bookmarkList.push(
  {
    id: 'aa',
    url: 'http://example.com',
    encodedUrl: encodeURIComponent('http://example.com'),
    title: 'example.com',
    memo: 'example.com 米国本社',
    registerTime: 1,
    updateTime: 1,
    userId: '1',
  },
  {
    id: 'bb',
    url: 'http://example.jp',
    encodedUrl: encodeURIComponent('http://example.jp'),
    title: 'example.jp',
    memo: 'example.com 日本支社',
    registerTime: 2,
    updateTime: 2,
    userId: '1',
  },
)

bookmarkTagList.push(
  {
    id: '1', bookmarkId: 'aa', tagId: '11', userId: '1',
  },
  {
    id: '2', bookmarkId: 'aa', tagId: '22', userId: '1',
  },
  {
    id: '3', bookmarkId: 'aa', tagId: '33', userId: '1',
  },
  {
    id: '4', bookmarkId: 'bb', tagId: '11', userId: '1',
  },
  {
    id: '5', bookmarkId: 'bb', tagId: '22', userId: '1',
  },
)

export const useDummyStore = () => {
  const createId = () => nanoid()

  const getBookmarkList = (searchTags: Array<string>, userId: string): Array<BookmarkItem> => {
    console.log(`tags=${searchTags}, userId=${userId}`)

    const currentTagIds = searchTags.length
      ? tagList
        .filter(tag => tag.userId === userId && searchTags.includes(tag.name))
        .map(tag => tag.id)
      : []

    console.log('currentTagIds', currentTagIds)

    if (searchTags.length && !currentTagIds.length) {
      return []
    }

    const bookmarkTagMap = new Map<string, Array<string>>()
    bookmarkTagList
      .filter(bookmarkTag => bookmarkTag.userId === userId)
      .forEach(bookmarkTag => {
        const map = bookmarkTagMap.get(bookmarkTag.bookmarkId)
        if (map) {
          map.push(bookmarkTag.tagId)
        } else {
          bookmarkTagMap.set(bookmarkTag.bookmarkId, [bookmarkTag.tagId])
        }
      })

    console.log('bookmarkTagMap', bookmarkTagMap)

    if (bookmarkTagMap.size === 0) {
      return []
    }

    const tagMatchBookmarkIds: Array<string> = []
    bookmarkTagMap.forEach((value, key) => {
      if (currentTagIds.every(id => value.includes(id))) {
        tagMatchBookmarkIds.push(key)
      }
    })

    console.log('tagMatchBookmarkIds', tagMatchBookmarkIds)

    if (searchTags.length && !tagMatchBookmarkIds.length) {
      return []
    }

    return bookmarkList
      .filter(bookmark => bookmark.userId === userId)
      .filter(bookmark => !searchTags.length || !tagMatchBookmarkIds.length || tagMatchBookmarkIds.includes(bookmark.id))
      .map(bookmark => ({
        id: bookmark.id,
        url: bookmark.url,
        title: bookmark.title,
        memo: bookmark.memo,
        encodedUrl: bookmark.encodedUrl,
        tags: getTags(bookmark.id).map(tag => tag[1])
      }))
  }

  const getBookmark = (url: string, userId: string): BookmarkItem | null => {
    const bookmark = bookmarkList
      .filter(bookmark => bookmark.userId === userId && bookmark.url === url)
    if (bookmark.length) {
      const tmp = bookmark[0]
      return ({
        id: tmp.id,
        url: tmp.url,
        title: tmp.title,
        memo: tmp.memo,
        encodedUrl: tmp.encodedUrl,
        tags: getTags(tmp.id).map(tag => tag[1]),
      })
    }
    return null
  }

  const getBookmarkForEdit = (url: string, userId: string): BookmarkEditItem | null => {
    const bookmark = bookmarkList
      .filter(bookmark => bookmark.userId === userId && bookmark.url === url)
    if (bookmark.length) {
      const tmp = bookmark[0]
      return ({
        id: tmp.id,
        url: tmp.url,
        title: tmp.title,
        memo: tmp.memo,
        encodedUrl: tmp.encodedUrl,
        tags: getTags(tmp.id).map(tag => ({ id: tag[0], name: tag[1] })),
      })
    }
    return null
  }

  const getTagInfoList = (userId: string): Array<TagInfo> => {
    return tagList
      .filter(tag => tag.userId === userId)
      .map(tag => ({
        id: tag.id,
        name: tag.name,
        tagNumber: bookmarkTagList
          .filter(bookmarkTag => bookmarkTag.tagId === tag.id)
          .length
      }))
  }

  const existsBookmark = (url: string, userId: string): boolean => {
    const bookmark = bookmarkList
      .filter(bookmark => bookmark.userId === userId && bookmark.url === url)
    return bookmark.length !== 0
  }

  const registerBookmark = (newBookmark: BookmarkRegisterItem, userId: string): BookmarkItem | null => {
    const checkResult = bookmarkList.filter(bookmark => bookmark.url === newBookmark.url)
    if (checkResult.length) return null

    // 新規ブックマーク登録
    // @ts-ignore
    const now = dayjs().valueOf() as number
    const bookmarkId = createId()
    const bookmark: BookmarkData = {
      id: bookmarkId,
      url: newBookmark.url,
      title: newBookmark.title,
      memo: newBookmark.memo,
      encodedUrl: encodeURIComponent(newBookmark.url),
      registerTime: now,
      updateTime: now,
      userId,
    }
    bookmarkList.push(bookmark)

    // タグ登録
    registerTags(bookmarkId, newBookmark.tags, userId)

    return getBookmark(newBookmark.url, userId)
  }

  const updateBookmark = (existsBookmark: BookmarkUpdateItem, userId: string): BookmarkItem | null => {
    const checkResult = bookmarkList.filter(bookmark => bookmark.id === existsBookmark.id)
    if (!checkResult.length) return null
    const bookmark = checkResult[0]

    // 既存ブックマーク更新
    // @ts-ignore
    const now = dayjs().valueOf() as number
    bookmark.url = existsBookmark.url
    bookmark.title = existsBookmark.title
    bookmark.memo = existsBookmark.memo
    bookmark.encodedUrl = encodeURIComponent(existsBookmark.url)
    bookmark.updateTime = now

    // 対象ブックマークのタグを全削除
    deleteBookmarkAllTags(bookmark.id)

    // タグ再登録
    registerTags(existsBookmark.id, existsBookmark.tags, userId)

    return getBookmark(existsBookmark.url, userId)
  }

  const deleteBookmark = (bookmarkId: string, userId: string): boolean => {
    const bookmark = bookmarkList
      .filter(bookmark => bookmark.userId === userId && bookmark.id === bookmarkId)
    if (!bookmark.length) return false
    // ブックマーク削除
    bookmarkList = bookmarkList.filter(bookmark => bookmark.id !== bookmarkId)
    // ブックマークタグ削除
    bookmarkTagList = bookmarkTagList.filter(bookmarkTag => bookmarkTag.bookmarkId !== bookmarkId)
    return true
  }

  const updateTag = (updateTag: Tag): boolean => {
    const tags = tagList.filter(tag => tag.id === updateTag.id && tag.userId === updateTag.userId)
    if (!tags.length) return false
    tags[0].name = updateTag.name
    return true
  }

  const deleteTag = (deleteTagId: string, userId: string) => {
    tagList = tagList.filter(tag => !(tag.id === deleteTagId && tag.userId === userId))
    bookmarkTagList = bookmarkTagList
      .filter(bookmarkTag => !(bookmarkTag.tagId === deleteTagId && bookmarkTag.userId === userId))
  }

  // ここからプライベートメソッド
  const getTags = (bookmarkId: string): Array<[string, string]> => {
    return bookmarkTagList
      .filter(bookmarkTag => bookmarkTag.bookmarkId === bookmarkId)
      .map(bookmarkTag => tagList.filter(tag => bookmarkTag.tagId === tag.id)[0])
      .map(tag => [tag.id, tag.name])
  }

  const registerTagList = (tagName: string, userId: string): TagData => {
    const newTag: TagData = {
      id: createId(),
      name: tagName,
      userId,
    }
    tagList.push(newTag)
    return newTag
  }

  const registerTags = (bookmarkId: string, tags: Array<string>, userId: string): void => {
    const newTagDatas: Array<TagData> = []
    for (const newTag of tags) {
      const registerTag = tagList
        .filter(tag => tag.userId === userId && tag.name === newTag)
      if (registerTag.length) {
        // 既存タグ
        newTagDatas.push(registerTag[0])
      } else {
        // 新規タグ
        const tagData = registerTagList(newTag, userId)
        newTagDatas.push(tagData)
      }
    }
    newTagDatas.map(tag => registerBookmarkTagList(bookmarkId, tag.id, userId))
  }

  const registerBookmarkTagList = (
    bookmarkId: string,
    tagId: string,
    userId: string
  ): BookmarkTag => {
    const newTagBookmark: BookmarkTag = {
      id: createId(),
      bookmarkId,
      tagId,
      userId,
    }
    bookmarkTagList.push(newTagBookmark)
    return newTagBookmark
  }

  const deleteBookmarkAllTags = (bookmarkId: string): void => {
    bookmarkTagList = bookmarkTagList
      .filter(bookmarkTag => bookmarkTag.bookmarkId !== bookmarkId)
  }

  return {
    getBookmarkList,
    getBookmark,
    getBookmarkForEdit,
    getTagInfoList,
    existsBookmark,
    registerBookmark,
    updateBookmark,
    deleteBookmark,
    updateTag,
    deleteTag,
  }
}
