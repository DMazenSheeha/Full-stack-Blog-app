import { Link } from "react-router-dom";
import { format } from "date-fns";
import "./card.css";

function Card({ title, image, id, summary, createdAt, createdBy }) {
  return (
    <Link to={`/posts/${id}`} className="link">
      <div class="card">
        <div class="card-header">
          <img src={`http://localhost:4000/${image}`} alt="user" />
        </div>
        <div class="card-body">
          <h4>{title}</h4>
          <p>{summary}</p>
          <div class="user">
            <div class="user-info">
              <h5>{createdBy}</h5>
              <small>{format(createdAt, "MMM dd, yyy")}</small>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Card;
