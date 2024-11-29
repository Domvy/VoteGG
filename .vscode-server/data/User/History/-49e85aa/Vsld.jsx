import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Categories.css';

const Categories = () => {
  const categories = ['Home', 'Topics', 'Live', 'Favorites', 'Settings'];
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    if (category === 'Settings') {
      navigate('/login');
    }
  };

  return (
    <div className="categories">
      {categories.map((category, index) => (
        <div key={index}
          className="category-item"
          onClick={() => handleCategoryClick(category)}>
          {category}
        </div>
      ))}
    </div>
  );
};

export default Categories;
