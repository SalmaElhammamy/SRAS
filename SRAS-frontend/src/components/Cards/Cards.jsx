import React from "react";
import "./Cards.css";
import Card from "../Card/Card";

const Cards = ({ cards, isSetting }) => {
  return (
    <div className="CardContainer">
      {cards.map((card, index) => (
        <Card
          key={index}
          cameraName={card.cameraName}
          videoURL={card.videoURL}
          imagePreview={card.imagePreview}
          isSetting={isSetting}
        />
      ))}
    </div>
  );
};

export default Cards;
