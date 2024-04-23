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
  performers: string[]
  priority: string
  beginDate: string | null
  endDate: string | null
}
