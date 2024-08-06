import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import { UserContext } from "../components/userContext";

function SinglePost() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    fetch(`http://localhost:4000/posts/:${id}`)
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  if (!data) {
    return (
      <div className="loaderContainer">
        <span class="loader"></span>
      </div>
    );
  }

  return (
    <div className="singelPost">
      <h1>{data.title}</h1>
      <span className="date">
        {format(data.createdAt, `MMM dd, yyy HH:mm`)}
      </span>
      <span className="auther">by @{data.createdBy}</span>
      {userInfo !== null
        ? userInfo.userName === data.createdBy && (
            <Link
              to={`/posts/${id}/update`}
              className="link btn"
              style={{ alignSelf: "center" }}
            >
              Update this post
            </Link>
          )
        : null}
      <div className="image">
        <img src={`http://localhost:4000/${data.cover}`} alt="" />
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: data.content }}
        className="content"
      />
      <Link to={"/"} className="link btn hundred">
        Go Back
      </Link>
    </div>
  );
}

export default SinglePost;
