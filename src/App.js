import React, { useEffect, useState } from "react";
import Header from "./components/header";
import $api from "./components/http";
import PostList from "./components/postList";
import "./styles/app.css";

const App = () => {
   const [user, setUser] = useState({ id: 0 });

   useEffect(() => {
      const user = localStorage.getItem("user");

      if (!user) return;

      setUser(JSON.parse(user));
   }, []);

   return (
      <div className="App">
         <Header setUser={setUser} user={user} />
         <PostList user={user} />
      </div>
   );
};
export default App;
