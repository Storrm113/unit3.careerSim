import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Fetch user details using the token
      fetch("https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/users/me", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setUser(data);
        })
        .catch((err) => {
          console.error("Error fetching user details:", err);
        });
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    fetch("https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/users/me", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setUser(data);
        navigate("/books");
      })
      .catch((err) => {
        console.error("Error fetching user details:", err);
      });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
