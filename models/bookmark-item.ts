export interface BookmarkItem {
  id: string
  url: string
  title: string
  memo: string
  encodedUrl: string
  tags: Array<string>
}

export interface BookmarkEditItem {
  id: string
  url: string
  title: string
  memo: string
  encodedUrl: string
  tags: Array<{ id: string, name: string }>
}

export interface BookmarkRegisterItem {
  url: string
  title: string
  memo: string
  tags: Array<string>
}

export interface BookmarkUpdateItem {
  id: string
  url: string
  title: string
  memo: string
  tags: Array<string>
}
