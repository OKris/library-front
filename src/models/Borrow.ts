export type Borrow = {
    bookId: number,
    title: string,
    borrowedAt: Date,
    returnedAt: Date,
    dueDate: Date,
    lateFee: number
}