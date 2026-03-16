import { useState } from 'react'
import type { Book } from '../../models/Book';
import './AddBook.css'


function AddBook() {
  const emptybook = {
    name: "",
    genre: "",
    author:"",
    year: 0,
    activeBorrows: [],
    available: true
  }

  const [book, setBook] = useState<Book>(emptybook);


  const addBook = async () => {
    fetch(import.meta.env.VITE_BACKEND_URL + "/save-book", {
      method: "POST",
      body: JSON.stringify(book),
      headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + sessionStorage.getItem("token")
      }
    })
    .then(res => {
      if (res.ok) {
        alert("Book added");
        setBook(emptybook);
      }
    })
  }

  return (
    <div>
      <h3>Add Book</h3>
      <div className="insert-data">
        <div className="field">
          <label>Name</label>
          <input value={book.name} onChange={(e) => setBook({...book, name: e.target.value})} type="text" /> <br />
        </div>
        <div className="field">
          <label>Genre</label>
          <input value={book.genre} onChange={(e) => setBook({...book, genre: e.target.value})} type="text" /> <br />
        </div>
        <div className="field">
          <label>Author</label>
          <input value={book.author} onChange={(e) => setBook({...book, author: e.target.value})} type="text" /> <br />
        </div>
        <div className="field">
          <label>Year</label>
          <input value={book.year} onChange={(e) => setBook({...book, year: Number(e.target.value)})} type="text" /> <br />
        </div>
        <div className="btn-container" >
          <button onClick={addBook}>Add new book</button>
        </div>
      </div>
    </div>
  )
}

export default AddBook