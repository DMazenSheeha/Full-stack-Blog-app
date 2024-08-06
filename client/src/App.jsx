import { Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.scss";
import { UserContextProvider } from "./components/userContext";
import CreatePost from "./pages/CreatePost";
import SinglePost from "./pages/SinglePost";
import UpdatePost from "./pages/UpdatePost";

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" index element={<Home />} />
          <Route path="/posts" element={<Home />} />
          <Route path="/login" index element={<Login />} />
          <Route path="/register" index element={<Register />} />
          <Route path="/createPost" index element={<CreatePost />} />
          <Route path="/posts/:id" index element={<SinglePost />} />
          <Route path="/posts/:id/update" index element={<UpdatePost />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
