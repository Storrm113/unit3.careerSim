import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

function Account() {
  const { user, logout } = useContext(AuthContext);
  const [checkedOutBooks, setCheckedOutBooks] = useState([]);

  useEffect(() => {
    if (user) {
      fetch("https://fsa-book-buddy-b6e748d1380d.herokuapp.com/checked-out-books", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
        .then((res) => res.json())
        .then((data) => setCheckedOutBooks(data))
        .catch((err) => console.error("Error fetching checked out books:", err));
    }
  }, [user]);

  if (!user) return <p>Please log in to view your account.</p>;

  return (
    <div>
      <h2>Welcome, {user.username}!</h2>
      <button onClick={logout}>Logout</button>
      <h3>Your Checked-Out Books:</h3>
      <ul>
        {checkedOutBooks.length > 0 ? (
          checkedOutBooks.map((book) => <li key={book.id}>{book.title}</li>)
        ) : (
          <p>No books checked out.</p>
        )}
      </ul>
    </div>
  );
}

export default Account;
