import React, { useState } from "react";
import Header from "./components/header";
import PostList from "./components/postList";
import "./styles/app.css";

const App = () => {
   const [user, setUser] = useState({ id: 0 });

   return (
      <div className="App">
         <Header setUser={setUser} user={user} />
         <PostList user={user} />
      </div>
   );
};
export default App;
