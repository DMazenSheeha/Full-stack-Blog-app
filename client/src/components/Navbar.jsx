import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./userContext";

function Navbar() {
  const { userInfo, setUserInfo } = useContext(UserContext);
  useEffect(() => {
    fetch("http://localhost:4000/profile", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => (data === null ? setUserInfo(null) : setUserInfo(data)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = async () => {
    await fetch("http://localhost:4000/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    setUserInfo(null);
  };

  return (
    <header>
      <h1>
        <Link to="/" className="link">
          MyBlog
        </Link>
      </h1>
      <nav>
        {userInfo ? (
          <>
            <Link to="/createPost" className="link">
              Create Post
            </Link>
            <span
              className="link"
              style={{ cursor: "pointer" }}
              onClick={logout}
            >
              Logout
            </span>
          </>
        ) : (
          <>
            <Link to="/login" className="link">
              Login
            </Link>
            <Link to="/register" className="link">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
