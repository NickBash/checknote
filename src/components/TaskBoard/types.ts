export type Id = string | number

export type Column = {
  id: Id
  title: string
}

export type Task = {
  id: Id
  titleCard: string
  columnId: Id
  description: string
  title: string
  performers: string | null
  priority: string
  beginDate: Date | undefined
  endDate: Date | undefined
  creator: string
}
