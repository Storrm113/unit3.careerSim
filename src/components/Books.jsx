import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Books() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/books")
      .then((res) => res.ok ? res.json() : Promise.reject("Failed to load books"))
      .then((data) => setBooks(data.books || []))
      .catch(() => setError("Could not fetch books."));
  }, []);

  return (
    <div className="container">
      <h1>Library Books</h1>
      {error ? <p>{error}</p> : (
        <div className="book-grid">
          {books.map((book) => (
            <div key={book.id} className="book-item">
              <Link to={`/books/${book.id}`}>
                <img src={book.coverimage} alt={book.title} />
                <p>{book.title}</p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Books;
