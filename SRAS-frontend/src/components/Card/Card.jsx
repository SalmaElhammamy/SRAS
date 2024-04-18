import React, { useState } from "react";
import "./Card.css";
import { FaTimes } from 'react-icons/fa';

const images = [
 "/assets/img1.jpg",
 "/assets/img2.jpg",
"/assets/img3.jpg",
 "/assets/img4.jpg",
"/assets/img5.jpg",
 "/assets/img6.jpg",
];

const Card = ({ title, imageIndex }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <div
        className={`Card ${expanded ? 'ExpandedCard' : ''}`}
        onClick={toggleExpanded}
      >
        <img src={images[imageIndex]} alt={title} className="expanded-img" />
        <div className="title">{title}</div>
      </div>
      {expanded && (
        <div className="ExpandedCard" onClick={toggleExpanded}>
          <div className="close-icon">
            <FaTimes />
          </div>
          <img src={images[imageIndex]} alt={title} className="expanded-img" />
          <div className="title">{title}</div>
        </div>
      )}
    </>
  );
};

export default Card;
