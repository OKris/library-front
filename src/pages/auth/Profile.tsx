import { useContext, useEffect, useState } from "react";
import type {Person} from "../../models/Person";
import { AuthContext } from "../../context/AuthContext";
import type { Book } from "../../models/Book";
import { Link } from "react-router-dom";
import './Profile.css'
import type { Borrow } from "../../models/Borrow";

function Profile() {
    const [person, setPerson] = useState<Person>({
        id: 0,
        firstName: "",
        lastName: "",
        email: "",
        role: "USER",
        favourites: []
    });

    const {person: dbPerson, setPerson: setDbPerson} = useContext(AuthContext);
    const [favourites, setFavourites] = useState<Book[]>([]);
    const [borrowed, setBorrowed] = useState<Borrow[]>([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [sort, setSort] = useState("id,asc");
    const [totalPages, setTotalPages] = useState(0);
    const [today] = useState(new Date());

    useEffect(() => {
        setPerson(dbPerson);
    }, [dbPerson]);

    useEffect(() => {
        if (person.id == 0) return;
        fetch(import.meta.env.VITE_BACKEND_URL + `/favourites?personId=${person.id}`)
        .then(res => res.json())
        .then(json => {
            setFavourites(json);
            console.log(json);
        })
    }, [person.id]);

    useEffect(() => {
        if (person.id == 0) return;
        loadHistory();
    }, [person.id, page, size, sort]);

    const loadHistory = async() => {
        const res = await fetch(import.meta.env.VITE_BACKEND_URL + `/books/borrowed/${person.id}?&page=${page}&size=${size}&sort=${sort}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("token")
            }
        });
        const json = await res.json();
        const data = json.content.map((b: Borrow) => ({
            ...b,
            borrowedAt: new Date(b.borrowedAt),
            dueDate: new Date(b.dueDate),
            returnedAt: b.returnedAt ? new Date(b.returnedAt) : null
        }));

        setBorrowed(data);
        setTotalPages(json.totalPages);
    }



    const updateProfile = async() => {
        const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/update-profile", {
            method: "PUT",
            body: JSON.stringify(person),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("token")
            }
        });
        const json = await res.json();
        setPerson(json);
        setDbPerson(json);
        if (res.ok) {
            alert("Profile updated");
        }
    }

    if (person.email === "") {
        return <></>
    }

    const returnBook = async(book_id: number) => {
        const res = await fetch(import.meta.env.VITE_BACKEND_URL + `/books/return?bookId=${book_id}&personId=${person.id}`, {
            method: "POST",
            body: JSON.stringify(person),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("token")
            }
        });
        if (res.ok) {
            await loadHistory();
        }
    }

    const handleSize = (newSize: number) => {
        setSize(newSize);
        setPage(0);
    }

    const handleSort = (newSort: string) => {
        setSort(newSort);
        setPage(0);
    }

    const list = [1,2,3,4,5,6,7,8,9,10];

  return (
    <div>
        <div className="info" >
            <div className="update">
                <div className="field">
                    <label>First name</label>
                    <input value={person.firstName} onChange={(e) => setPerson({...person, firstName: e.target.value})} type="text" />
                </div>
                <div className="field">
                    <label>Last name</label>
                    <input value={person.lastName} onChange={(e) => setPerson({...person, lastName: e.target.value})} type="text" />
                </div>
                <div className="field">
                    <label>Email</label>
                    <input value={person.email} onChange={(e) => setPerson({...person, email: e.target.value})} type="text" />
                </div>
                <div className="field">
                    <label>Password</label>
                    <input value={person.password} onChange={(e) => setPerson({...person, password: e.target.value})} type="password" />
                </div>
                <div className="btn-container" >
                    <button onClick={updateProfile}>Update profile</button>
                </div>
            </div>

            {favourites.length > 0 &&
            <>
                <div className="table-favorite">
                    <div className="title">Favourite books</div>
                    <div className="table-wrapper" >
                        <table>
                            <tbody>
                                {favourites.map((book, index) => 
                                    <tr key={`${book.id}-${index}`}>
                                        <td>{book.name}</td>
                                        <td>{book.author}</td>
                                        <td><Link to={`/book/${book.id}`}>Details</Link></td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
            }
        </div>
        <div className="tables-container">
            {borrowed.length > 0 &&
             <>
                <div className="table1">
                    <div className="title">
                        History
                        <select defaultValue="5" onChange={(e) => handleSize(Number(e.target.value))}>
                            {list.map(index =>
                                <option key={index}>{index}</option>
                        )}
                </select>
                    </div>
                    <div className="table-wrapper" >
                        <table>
                            <thead>
                                <tr>
                                    <th><h4>Title</h4></th>
                                    <th><h4>Borrowed at</h4></th>
                                    <th><h4>Return at</h4></th>
                                    <th><h4>Late fee</h4></th>
                                    <th><h4>Returned</h4></th>
                                </tr>
                            </thead>
                            <tbody>
                                {borrowed.map((book, index) => 
                                    <tr key={`${book.bookId}-${index}`}>
                                        <td className="overdue">
                                            {book.dueDate.toLocaleDateString("en-GB") < today.toLocaleDateString("en-GB") && !book.returnedAt ? <span className="overdue-label">Overdue!</span>: ""}
                                            {book.title}
                                        </td>
                                        <td>{book.borrowedAt.toLocaleDateString("en-GB")}</td>
                                        <td>{book.dueDate.toLocaleDateString("en-GB")}</td>
                                        <td>{book.lateFee} €</td>
                                        <td>{book.returnedAt == null ? 
                                        <button onClick={() => returnBook(book.bookId)} >Return</button>
                                            : book.returnedAt.toLocaleDateString("en-GB")}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="footer" >
                    <button disabled={page === 0} onClick={() => setPage(page -1)}>Last</button>
                    <span>{page + 1} / {totalPages}</span>
                    <button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
                </div>
                </>
            }
        </div>
    </div>
  )
}

export default Profile