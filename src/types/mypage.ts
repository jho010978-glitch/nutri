export type MyMemberProfile = {
  id: number
  email: string
  name: string
  nickname: string
  gender: 'MALE' | 'FEMALE' | string
  birthDate: string
}

export type MyPageData = {
  member: MyMemberProfile
}
