import React from "react";
import "./Cards.css";
import Card from '../Card/Card';

const Cards = ({ cards }) => {
  return (
    <div className="CardContainer">
      {cards.map((card, index) => (
        <Card key={index} title={card.title} imageIndex={index} />
      ))}
    </div>
  );
};

export default Cards;
