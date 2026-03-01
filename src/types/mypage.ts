export type MyMemberProfile = {
  name: string
  birthDate: string
  phone: string
}

export type SavedProduct = {
  id: string
  name: string
  imageUrl: string
}

export type MyPageData = {
  member: MyMemberProfile
  savedProducts: SavedProduct[]
}
