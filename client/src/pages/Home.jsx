import { useContext, useEffect, useState } from "react";
import Card from "../components/Card";
import { UserContext } from "../components/userContext";

function Home() {
  const { setUserInfo } = useContext(UserContext);
  const [data, setData] = useState(null);
  const fetchData = async () => {
    const fetched = await fetch("http://localhost:4000/posts");
    if (fetched.status === 200) {
      const data = await fetched.json();
      setData(data);
    }
  };
  const fetchUserInfo = async () => {
    const fetched = await fetch("http://localhost:4000/profile", {
      credentials: "include",
    });
    if (fetched.status === 200) {
      const data = await fetched.json();
      setUserInfo(data);
    }
  };
  useEffect(() => {
    fetchData();
    fetchUserInfo();
  }, []);

  return (
    <div className="container">
      {data ? (
        !data[0] ? (
          <h1>No Posts Yet</h1>
        ) : (
          data.map((item) => {
            return (
              <Card
                key={item._id}
                id={item._id}
                image={item.cover}
                title={item.title}
                summary={item.summary}
                createdAt={item.createdAt}
                createdBy={item.createdBy}
              />
            );
          })
        )
      ) : (
        <div className="loaderContainer">
          <span class="loader"></span>
        </div>
      )}
    </div>
  );
}

export default Home;
