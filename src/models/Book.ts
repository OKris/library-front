export type Book = {
    id?: number,
    name: string,
    genre: string,
    author: string,
    year: number,
    activeBorrows: Array<string>,
    available?: boolean
}