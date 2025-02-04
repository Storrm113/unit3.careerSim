import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/books/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        console.log("Fetched book details:", data); // Check structure in console
        
        // If the response is an object with a nested book key, access it properly
        if (data.book) {
          setBook(data.book);
        } else {
          throw new Error("Book data not found.");
        }
      } catch (err) {
        console.error("Error fetching book details:", err);
        setError("Failed to load book details.");
      }
    };

    fetchBookDetails();
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{book.title}</h1>
      <img
        src={book.coverimage}
        alt={book.title}
        style={{ width: "200px", height: "300px" }}
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/200x300?text=No+Image";
        }}
      />
      <p>{book.description}</p>
      <p>
        <strong>Author:</strong> {book.author}
      </p>
      <p>
        <strong>Available:</strong> {book.available ? "Yes" : "No"}
      </p>
    </div>
  );
}

export default BookDetail;
