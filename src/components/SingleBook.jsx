import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import API_BASE_URL from "./config"; // ✅ Import API base URL

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);

  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        console.log(`Fetching book details for ID: ${id}`);

        const response = await fetch(`${API_BASE_URL}/books/${id}`, {
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to load book details");

        const data = await response.json();
        console.log("Book details fetched:", data);

        if (data.book) {
          setBook(data.book);
        } else {
          throw new Error("Invalid API response: Book data missing");
        }
      } catch (err) {
        console.error("Error fetching book details:", err);
        setError(err.message || "Failed to load book details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleCheckOut = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      console.log("Checking out book...");

      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ available: false }), // Mark book as checked out
      });

      if (!response.ok) {
        throw new Error(`Failed to check out book: ${response.status}`);
      }

      const updatedBook = await response.json();
      console.log("Book successfully checked out:", updatedBook);
      setBook(updatedBook.book); // ✅ Update the state with the new book data
    } catch (err) {
      console.error("Error checking out the book:", err);
      setError(err.message || "Failed to check out the book.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h1>{book.title}</h1>

      {/* Check Out Button at the Top */}
      <button
        onClick={handleCheckOut}
        disabled={!book.available}
        style={{
          padding: "10px 15px",
          backgroundColor: book.available ? "#28a745" : "#ccc",
          color: "#fff",
          border: "none",
          cursor: book.available ? "pointer" : "not-allowed",
          marginBottom: "10px",
        }}
      >
        {book.available ? "Check Out" : "Checked Out"}
      </button>

      <img
        src={book.coverimage}
        alt={book.title}
        onError={(e) => (e.target.src = "https://via.placeholder.com/200x300")}
        style={{ width: "200px", height: "300px" }}
      />
      <p>{book.description}</p>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Available:</strong> {book.available ? "Yes" : "No"}</p>
    </div>
  );
};

export default BookDetail;
