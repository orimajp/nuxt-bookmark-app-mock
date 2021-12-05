export interface Bookmark {
  id: string
  url: string
  title: string
  userId: number
  createdAt: number
  updatedAt: number
}

export interface BookmarkInfo {
  id: string
  url: string
  title: string
  tags: Array<string>
}
