import React, { createContext, useEffect, useState } from "react";
import Header from "./components/header";
import PostList from "./components/postList";
import "./styles/app.css";

export const context = createContext({ func: null });

const App = () => {
   const [user, setUser] = useState({ id: 0 });

   useEffect(() => {
      const user = localStorage.getItem("user");

      if (!user) return;

      setUser(JSON.parse(user));
   }, []);

   const { Provider } = context;

   return (
      <Provider>
         <div className="App">
            <Header setUser={setUser} user={user} />
            <PostList user={user} />
         </div>
      </Provider>
   );
};
export default App;
