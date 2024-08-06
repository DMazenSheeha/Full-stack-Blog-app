import { useContext, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { UserContext } from "../components/userContext";
import { Navigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

function UpdatePost() {
  const { userInfo } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);
  let [title, setTitle] = useState("");
  let [summary, setSummary] = useState("");
  let [content, setContent] = useState("");
  let [files, setFiles] = useState("");
  const { id } = useParams();

  const post = async (ev) => {
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary);
    data.set("content", content);
    if (files?.[0]) {
      data.set("file", files?.[0]);
    }
    ev.preventDefault();
    const fetched = await fetch(`http://localhost:4000/posts/${id}`, {
      method: "PUT",
      credentials: "include",
      body: data,
    });
    if (fetched.status === 200) {
      setRedirect(true);
    } else if (fetched.status === 400) {
      Swal.fire({
        text: "Something wrong",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    fetch(`http://localhost:4000/posts/:${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title);
        setSummary(data.summary);
        setContent(data.content);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <>
      {userInfo ? (
        <form className="create-post-form" onSubmit={(ev) => post(ev)}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
          />
          <input
            type="text"
            placeholder="Summary"
            value={summary}
            onChange={(ev) => setSummary(ev.target.value)}
          />
          <input
            type="file"
            onChange={(ev) => setFiles(ev.target.files)}
            style={{ cursor: "pointer" }}
          />
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            className="format"
            style={{ height: "300px", marginBottom: "35px" }}
          />
          <button className="btn hundred">Update</button>
        </form>
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
}

export default UpdatePost;
