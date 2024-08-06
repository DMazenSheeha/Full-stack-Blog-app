import { useState } from "react";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";

function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState();
  const [redirect, setRedirect] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    if (userName.trim() === "") {
      setErrors("User Name Is Required");
    } else if (password === "") {
      setErrors("Password Is Required");
    } else {
      const fetched = await fetch("http://localhost:4000/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName,
          password,
        }),
      });
      if (fetched.status === 400) {
        Swal.fire({
          text: "Something wrong\nPlease try another user name",
          icon: "error",
        });
      } else if (fetched.status === 404) {
        setErrors("User is not defiend");
      } else if (fetched.status === 405) {
        setErrors("Wrong password");
      } else {
        setErrors(false);
        setRedirect(true);
      }
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }
  return (
    <form className="login" onSubmit={(e) => login(e)}>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="User Name"
        onChange={(e) => setUserName(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="btn hundred">Login</button>
      {errors && <span className="error">{errors}</span>}
    </form>
  );
}

export default Login;
