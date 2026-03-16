import { useEffect, useState } from 'react'
import type { Book } from '../../models/Book';
import { useParams } from 'react-router-dom';

function EditBook() {
  const {book_id} = useParams();
  const [book, setBook] = useState<Book>({
    id: 0,
    name: "",
    genre: "",
    author:"",
    year: 0,
    activeBorrows: []
  });

  useEffect(() => {
      fetch(import.meta.env.VITE_BACKEND_URL + "/book/" + book_id)
      .then(res => res.json())
      .then(json => setBook(json))
    }, [book_id]);

  const editBook = async () => {
    const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/book", {
      method: "PUT",
      body: JSON.stringify(book),
      headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + sessionStorage.getItem("token")
      }
    });
    const json = await res.json();
    if (!json.message) {
      alert("Book edited");
    }
    setBook(json);
  }
  return (
    <div>
      <h3>Edit Book</h3>
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
          <button onClick={editBook}>Edit book</button>
        </div>
      </div>
    </div>
  )
}

export default EditBook