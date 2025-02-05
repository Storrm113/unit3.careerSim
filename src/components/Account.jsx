import { useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import API_BASE_URL from "./config"; // ✅ Import API base URL

const Account = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchCheckedOutBooks = async () => {
      try {
        console.log("Fetching checked-out books...");

        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/reservations`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to load checked-out books: ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response for Reservations:", data);

        if (data.reservation && Array.isArray(data.reservation)) {
          setBooks(data.reservation);
        } else {
          throw new Error("Invalid API response format: Missing 'reservation' array.");
        }
      } catch (err) {
        console.error("Error fetching account details:", err);
        setError(err.message || "Failed to load your checked-out books.");
      } finally {
        setLoading(false);
      }
    };

    fetchCheckedOutBooks();
  }, [isAuthenticated]);

  const handleReturnBook = async (reservationId) => {
    try {
      console.log(`Returning book with reservation ID: ${reservationId}`);

      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to return book: ${response.status}`);
      }

      console.log("Book returned successfully!");
      
      // Remove the returned book from the state
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== reservationId));
    } catch (err) {
      console.error("Error returning book:", err);
      setError(err.message || "Failed to return the book.");
    }
  };

  if (!isAuthenticated) return <div>Please log in to access your account.</div>;
  if (loading) return <div>Loading checked-out books...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h2>Account</h2>
      <p><strong>Email:</strong> {user?.email}</p>
      <h3>Checked Out Books</h3>

      {books.length > 0 ? (
        <ul>
          {books.map((book) => (
            <li key={book.id} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <img
                src={book.coverimage}
                alt={book.title}
                style={{ width: "50px", height: "75px", marginRight: "10px" }}
                onError={(e) => (e.target.src = "https://via.placeholder.com/50x75?text=No+Image")}
              />
              <p>{book.title}</p>
              <button
                onClick={() => handleReturnBook(book.id)}
                style={{
                  marginLeft: "15px",
                  padding: "5px 10px",
                  backgroundColor: "#dc3545",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Return
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No books checked out.</p>
      )}
    </div>
  );
};

export default Account;
