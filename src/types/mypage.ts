export type MyMemberProfile = {
  id: number
  email: string
  name: string
  nickname: string
  gender: 'MALE' | 'FEMALE' | string
  birth_date: string
}

export type MyPageData = {
  member: MyMemberProfile
}
