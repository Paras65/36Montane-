
import '../style/Testimonial.css'; // Import the CSS file for styling

const Testimonial = ({ name, text, location, image }) => {
  return (
    <div className="testimonial-container">
      <div className="testimonial-card">
        <div className="testimonial-image">
          <img src={image} alt={name} />
        </div>
        <div className="testimonial-content">
          <p className="testimonial-text">{`"${text}"`}</p>
          <div className="testimonial-author">
            <p className="author-name">{name}</p>
            <p className="author-location">{location}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
