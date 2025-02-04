import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../index.css'; // Ensure you import the CSS file

function Books() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch("https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/books")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched data:", data); // Log the data to see what is returned
        if (data.books && Array.isArray(data.books)) {
          setBooks(data.books);
          console.log("Books array:", data.books); // Log the books array to check the structure
        } else {
          console.error("Data does not contain books array:", data);
        }
      })
      .catch((err) => console.error("Error fetching books:", err));
  }, []);

  return (
    <div className="container">
      <h1>Library Books</h1>
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
    </div>
  );
}

export default Books;
