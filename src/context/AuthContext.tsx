import { createContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type {Person} from "../models/Person";
import type { Role } from "../models/Role";
import type { Book } from "../models/Book";


type AuthContextType = {
    loading: boolean
    person: Person
    isLoggedIn: boolean
    favourites: Book[]
    login: (token: string) => void
    logout: () => void
    setPerson: (person: Person) => void
}

export const AuthContext = createContext<AuthContextType>({
    loading: false,
    person: {
        id: 0,
        firstName: "",
        lastName: "",
        email: "",
        role: "USER" as Role,
        favourites: []
    },
    isLoggedIn: false,
    favourites: [],
    login: () => {},
    logout: () => {},
    setPerson: () => {}
});

export const AuthContextProvider = ({children}: {children: ReactNode}) => {
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [favourites, setFavourites] = useState<Book[]>([]);
    const [person, setPerson] = useState<Person>({
        id: 0,
        firstName: "",
        lastName: "",
        email: "",
        role: "USER",
        favourites: []
    })
    const navigate = useNavigate();

    const getPerson = async() => {
        if (sessionStorage.getItem("token") === null) {
            setLoading(false);
            return;
        }
        const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/profile", {
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("token")
            }
        });

        if (res.status === 403) {
            setLoading(false);
            return;
        }
        const json = await res.json();
        if (json.id > 0) {
            setPerson(json);
            setIsLoggedIn(true);
            setLoading(false);
        }
    } 

    useEffect(() => {
        getPerson();
    }, []);

    useEffect(() => {
        if (!person.id) {
            getFavourites();
        }
    }, [person]);

    const getFavourites = () => {
        if (!person.id) return;
        fetch(import.meta.env.VITE_BACKEND_URL + `/favourites?personId=${person.id}`)
        .then(res => res.json())
        .then(json => { 
            setFavourites(json);
            const ids = json.map((book: Book) => book.id);
            localStorage.setItem("favourites", JSON.stringify(ids));
        })
    }

    const login = (token: string) => {
        setIsLoggedIn(true);
        sessionStorage.setItem("token", token);
        navigate("/profile");
        getPerson();
    }

    const logout = () => {
        setIsLoggedIn(false); 
        sessionStorage.removeItem("token");
        navigate("/");
    }

    return (
        <AuthContext.Provider value={{loading, person, setPerson, isLoggedIn, login, logout, favourites}}>
            {children}
        </AuthContext.Provider>
    )
}