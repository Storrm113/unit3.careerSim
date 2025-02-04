import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateBook() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    coverimage: '',
    available: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("https://fsa-book-buddy-b6e748d1380d.herokuapp.com/api/books", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        navigate(`/books/${data.id}`);
      })
      .catch((err) => console.error("Error creating book:", err));
  };

  return (
    <div>
      <h1>Create New Book</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" name="title" value={formData.title} onChange={handleChange} />
        </label>
        <label>
          Author:
          <input type="text" name="author" value={formData.author} onChange={handleChange} />
        </label>
        <label>
          Description:
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </label>
        <label>
          Cover Image URL:
          <input type="text" name="coverimage" value={formData.coverimage} onChange={handleChange} />
        </label>
        <label>
          Available:
          <input type="checkbox" name="available" checked={formData.available} onChange={handleChange} />
        </label>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default CreateBook;