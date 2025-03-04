const RatingStars = ({ rating }) => {
    return (
      <span>
        {"★".repeat(Math.round(rating))}{"☆".repeat(5 - Math.round(rating))}
      </span>
    );
  };
  
  export default RatingStars;
  