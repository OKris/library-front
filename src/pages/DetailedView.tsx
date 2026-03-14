import { useContext, useEffect, useState } from 'react'
import type { Book } from '../models/Book';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './DetailedView.css'

function DetailedView() {
  const {isLoggedIn, person} = useContext(AuthContext);
  const [favourites, setFavourites] = useState<number[]>(JSON.parse(localStorage.getItem("favourites") ||"[]"));
  const {book_id} = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book>({
    id: 0,
    name: "",
    genre: "",
    author:"",
    year: 0,
    activeBorrows: [],
    available: true
  });

  useEffect(() => {
    fetch(`http://localhost:8080/book/${book_id}`)
    .then(res => res.json())
    .then(json => setBook(json))
  }, [book_id]);

  useEffect(() => {
    fetch(`http://localhost:8080/favourites?personId=${person.id}`)
    .then(res => res.json())
    .then(json => setFavourites(json.map((book: Book) => book.id)))
  }, [person.id]);



  function addRemoveFavourite(bookId: number) {
     const update = favourites.includes(bookId)
      ? favourites.filter(id => id !== bookId)
      : [...favourites, bookId];

      setFavourites(update);
      localStorage.setItem("favourites", JSON.stringify(update));
      addToPerson(update);
  }

  const addToPerson = async (updated: number[]) => {
    console.log("send favou ", updated);
    await fetch(`http://localhost:8080/favourites?personId=${person.id}`, {
      method: "POST",
      body: JSON.stringify(updated),
      headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + sessionStorage.getItem("token")
      }
    });
  }

  const checkout = async(book_id: number) => {
    await fetch(`http://localhost:8080/books/borrow?id=${book_id}&personId=${person.id}`, {
        method: "POST",
        body: JSON.stringify(person),
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        }
    })
    .then(res => {
      if (res.ok) {
        alert("Book checked out");
      }
    })
  }

  function deleteBook(bookId: number) {
    fetch(`http://localhost:8080/delete?id=${bookId}`, {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + sessionStorage.getItem("token")
      }
    })
      .then(res => {
        if (res.ok) {
          alert("book deleted");
          navigate("/");
        }
      })
  }

  
  return (
    <div>
      <div className="details">
        <div>{book.name}</div>
        <div>{book.genre}</div>
        <div>{book.author}</div>
        <div>{book.year}</div>
      </div>
      <div className="btns" >
        <div className="user-btns" >
          <button onClick={() => addRemoveFavourite(Number(book.id))}>
            {favourites.includes(Number(book.id)) ? "Remove favourite" : "Favourite"}
          </button>
        
          {book.activeBorrows.length === 0 &&
            <button onClick={() => checkout(Number(book.id))} >Checkout</button>
          }
        </div>
        {isLoggedIn && person.role == "ADMIN" &&
        <>
        <div className="admin-btns">
          <Link to={`/admin/edit-book/${book.id}`}>Edit</Link>
          <button onClick={() => deleteBook(Number(book.id))}>Delete</button>
        </div>
        </>
        }
      </div>
    </div>
  )
}

export default DetailedView