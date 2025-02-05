import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to="/books" style={{ textDecoration: "none", color: "blue" }}>
        Go back to Books
      </Link>
    </div>
  );
}

export default NotFound;
