export type Person = {
    id?: number,
    firstName: string,
    lastName: string,
    email: string,
    password?: string,
    role: "USER" | "ADMIN",
    favourites: Array<string>
}