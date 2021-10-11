export class PaginationModel<T> {
  count: number | undefined
  next: string | undefined
  previous: string | undefined
  results: T[] | undefined
}
