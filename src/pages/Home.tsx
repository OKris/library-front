import { useContext, useEffect, useState } from 'react'
import type { Book } from '../models/Book';
import { Link } from 'react-router-dom';
import './Home.css'
import { AuthContext } from '../context/AuthContext';

function Home() {
    const {isLoggedIn, person} = useContext(AuthContext);
    const [books, setBooks] = useState<Book[]>([]);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [sort, setSort] = useState("id,asc");
    const [totalPages, setTotalPages] = useState(0);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState("");
    const [query, setQuery] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [borrowList, setBorrowList] = useState<number[]>([]);
    const [reloadBooks, setReloadBooks] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:8080/books?genre=${selectedGenre}&search=${searchQuery}&page=${page}&size=${size}&sort=${sort}`)
        .then(res => res.json())
        .then(json => {
            setBooks(json.content);
            setTotalPages(json.totalPages);
        })
    }, [page, size, sort, selectedGenre, searchQuery, reloadBooks]);

    useEffect(() => {
        if (query === "") {
            setSearchQuery("");
            setPage(0);
        }
    }, [query]);

    useEffect(() => {
        fetch(`http://localhost:8080/genres`)
        .then(res => res.json())
        .then(json => {
            setGenres(json);
        })
    }, []);

    const handleSize = (newSize: number) => {
        setSize(newSize);
        setPage(0);
    }

    const handleSort = (newSort: string) => {
        setSort(newSort);
        setPage(0);
    }

    const list = [1,2,3,4,5,6,7,8,9,10];

    const addOrRemoveBorrow = (book_id: number) => {
        if (book_id === undefined) return;

        if (borrowList.includes(book_id)) {
            setBorrowList(borrowList.filter(id => id !== book_id));
        } else {
            setBorrowList([...borrowList, book_id]);
        }
    }

    const sendToBorrow = async() => {
        if (borrowList.length <= 0) {
            alert("Add books to borrow!");
            return;
        }
        const res = await fetch(`http://localhost:8080/books/borrow-multiple?personId=${person.id}`, {
            method: "POST",
            body: JSON.stringify(borrowList),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("token")
            }
        });
        if (res.ok) {
            alert("Books checked out");
            setBorrowList([]);
            setReloadBooks(prev => !prev);
        }
    }

  return (
    <div>
        <div className="sorting">
            <select defaultValue="10" onChange={(e) => handleSize(Number(e.target.value))}>
                {list.map(index =>
                    <option key={index}>{index}</option>
                )}
            </select>
            <select defaultValue="" onChange={(e) => setSelectedGenre(e.target.value)}>
                <option value="">All</option>
                {genres.map((genre, index) =>
                    <option key={index} value={genre}>{genre}</option>
                )}
            </select>
            <button className={sort === "name,asc" ? "sort-active" : ""} onClick={() => handleSort("name,asc")}>Sort A-Z</button>
            <button className={sort === "name,desc" ? "sort-active" : ""} onClick={() => handleSort("name,desc")}>Sort Z-A</button>
            <button className={sort === "id,asc" ? "sort-active" : ""} onClick={() => handleSort("id,asc")}>Sort by older</button>
            <button className={sort === "id,desc" ? "sort-active" : ""} onClick={() => handleSort("id,desc")}>Sort by new</button>
            <button className={sort === "available,desc" ? "sort-active" : ""} onClick={() => handleSort("available,desc")}>Available</button>
            <button className={sort === "available,asc" ? "sort-active" : ""} onClick={() => handleSort("available,asc")}>Not available</button>
        </div>
        <div className="search-block" >
            <label>Search for books:</label>
            <input value={query} onChange={(e) => setQuery(e.target.value)} type="text" /> 
            <button onClick={() => {setSearchQuery(query)}} >Search</button>
        </div>
        <h2>Available books</h2>
        <div className='book-table'>
            <table className="books">
                <thead>
                    <tr>
                        <th className="col-name"><h3>Name</h3></th>
                        <th className="col-genre"><h3>Genre</h3></th>
                        <th className="col-author"><h3>Author</h3></th>
                        <th className="col-year"><h3>Year of publication</h3></th>
                        <th className="col-available"><h3>Available</h3></th>
                        <th className="col-info"><h3>Info</h3></th>
                        { isLoggedIn &&
                            <th><h3>Borrow</h3></th>
                        }
                    </tr>
                </thead>
                <tbody>
                    {books.map(book => 
                        <tr key={book.id}>
                            <td>{book.name}</td>
                            <td>{book.genre}</td>
                            <td>{book.author}</td>
                            <td>{book.year}</td>
                            <td className={book.activeBorrows.length > 0 ? "not-available" : "available"}>{book.activeBorrows.length > 0 ? "No" : "Yes"}</td>
                            <td><Link to={`book/${book.id}`}>Details</Link></td>
                            { isLoggedIn && 
                                <td>
                                    {book.activeBorrows.length <= 0 &&
                                        <button onClick={() => {addOrRemoveBorrow(Number(book.id))}}>{borrowList.includes(Number(book.id)) ? "Remove" : "Add"}</button>
                                    }
                                </td>
                            }
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
        <div className="checkout">
            <div className="ct"></div>
            <button onClick={() => {sendToBorrow()}} >Checkout books</button>
        </div>
        <div className="page-block">
            <button disabled={page === 0} onClick={() => setPage(page -1)}>Last</button>
            <span>{page + 1} / {totalPages}</span>
            <button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
    </div>
  )
}

export default Home