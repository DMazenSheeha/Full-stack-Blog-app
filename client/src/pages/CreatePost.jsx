import { useContext, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { UserContext } from "../components/userContext";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";

function CreatePost() {
  const { userInfo } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);
  let [title, setTitle] = useState("");
  let [summary, setSummary] = useState("");
  let [content, setContent] = useState("");
  let [files, setFiles] = useState("");

  const post = async (ev) => {
    ev.preventDefault();
    if (title !== "" && summary !== "" && content !== "" && files !== "") {
      const data = new FormData();
      data.set("title", title);
      data.set("summary", summary);
      data.set("content", content);
      data.set("file", files[0]);
      const fetched = await fetch("http://localhost:4000/post", {
        method: "POST",
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
    } else {
      Swal.fire({
        text: "All fields are required",
        icon: "error",
      });
    }
  };

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
          />
          <button className="btn hundred">Post</button>
        </form>
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
}

export default CreatePost;
