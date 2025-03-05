const ReviewsList = ({ reviews }) => {
  return (
    <div className="reviews-list">
      <h3>Received Reviews</h3>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review._id} className="review-card">
            <p>
              <strong>From:</strong> {review.reviewerId.name}
            </p>
            <p>
              <strong>Task:</strong> {review.taskId.title}
            </p>
            <p>
              <strong>Rating:</strong> {review.rating} ⭐
            </p>
            <p>
              <strong>Comment:</strong> {review.comment}
            </p>
          </div>
        ))
      ) : (
        <p className="no-reviews">No reviews yet.</p>
      )}
    </div>
  );
};

export default ReviewsList;
