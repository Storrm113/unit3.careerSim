import { useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

function Account() {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/users/me", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBooks(data.books);
      } catch (err) {
        console.error("Error fetching account details:", err);
        setError("Failed to load account details.");
      }
    };

    fetchAccountDetails();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Account</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <h3>Checked Out Books</h3>
      {books.length > 0 ? (
        <ul>
          {books.map((book) => (
            <li key={book.id}>{book.title}</li>
          ))}
        </ul>
      ) : (
        <p>You have no books checked out.</p>
      )}
    </div>
  );
}

export default Account;
