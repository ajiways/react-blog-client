import React, { useContext, useState } from "react";
import MyButton from "./UI/button/myButton";
import MyInput from "./UI/input/myInput";
import MyModal from "./UI/MyModal/myModal";
import $api from "./http/index";

import { context } from "../App";

const Header = ({ user, setUser }) => {
   const [loginModal, setLoginModal] = useState(false);
   const [registerModal, setRegisterModal] = useState(false);
   const [createPostModal, setCreatePostModal] = useState(false);
   const [loginError, setLoginError] = useState("");
   const [login, setLogin] = useState("");
   const [password, setPassword] = useState("");
   const [loginInvalid, setLoginInvalid] = useState("");
   const [passwordInvalid, setPasswordInvalid] = useState("");
   const [postContent, setPostContent] = useState("");
   const [createPostError, setCreatePostError] = useState("");
   const [registerLogin, setRegisterLogin] = useState("");
   const [registerPassword, setRegisterPassword] = useState("");
   const [registerConfirm, setRegisterConfirm] = useState("");
   const [registerError, setRegisterError] = useState("");
   const [registerLoginInvalid, setRegisterLoginInvalid] = useState("");
   const [registerPasswordInvalid, setRegisterPasswordInvalid] = useState("");
   const [registerConfirmInvalid, setRegisterConfirmInvalid] = useState("");

   async function loginFetch(e) {
      e.preventDefault();
      const res = await $api
         .post("/auth/login", {
            login,
            password,
         })
         .catch((err) => {
            setLoginError(err.response.data.message);
            if (err.response.data.errors) {
               err.response.data.errors.forEach((err) => {
                  const field = err.split("-")[0].trim();
                  const message = err.split("-")[1].trim();

                  switch (field) {
                     case "login":
                        setLoginInvalid(message);
                        break;
                     case "password":
                        setPasswordInvalid(message);
                        break;
                     default:
                        break;
                  }
               });
            }
         });
      if (res) {
         localStorage.setItem("token", res.data.token);
         localStorage.setItem("user", JSON.stringify(res.data.user));
         setUser(res.data.user);
         setLoginModal(false);
      }
   }

   async function registerFetch(e) {
      e.preventDefault();

      const res = await $api
         .post("/auth/registration", {
            login: registerLogin,
            password: registerPassword,
            confirm: registerConfirm,
         })
         .catch((err) => {
            setRegisterError(err.response.data.message);
            if (err.response.data.errors) {
               err.response.data.errors.forEach((err) => {
                  const field = err.split("-")[0].trim();
                  const message = err.split("-")[1].trim();

                  switch (field) {
                     case "login":
                        setRegisterLoginInvalid(message);
                        break;
                     case "password":
                        setRegisterPasswordInvalid(message);
                        break;
                     case "confirm":
                        setRegisterConfirmInvalid(message);
                        break;
                     default:
                        break;
                  }
               });
            }
         });

      if (res) {
         setRegisterModal(false);
         setLoginModal(true);
      }
   }

   const { func } = useContext(context);

   async function createPost(content) {
      content = content.replace(/\</g, "&lt;").replace(/\>/g, "&gt;");

      const res = await $api
         .post("/posts", { markdown: content })
         .catch((err) => {
            if (err.response.data.errors) {
               err.response.data.errors.forEach((err) => {
                  setCreatePostError(err.split("-")[1].trim());
               });
            }
         });

      if (res) {
         setCreatePostModal(false);
         func();
      }
   }

   async function logout() {
      await $api
         .get("/auth/logout")
         .finally(
            localStorage.removeItem("token"),
            setUser({ id: 0 }),
            localStorage.removeItem("user")
         );
   }

   return (
      <div className="header">
         <div className="header__content">
            {user.id > 0 ? (
               <div>
                  <MyButton
                     onClick={() => setCreatePostModal(true)}
                     title="?????????????? ????????"
                  />
                  <MyModal
                     visible={createPostModal}
                     setVisible={setCreatePostModal}
                  >
                     <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
                        ?????? ?????? ?????????????? (?? markdown) :)
                     </h2>
                     <h4 style={{ textAlign: "center", marginBottom: "10px" }}>
                        {createPostError}
                     </h4>
                     <textarea
                        onChange={(e) => setPostContent(e.target.value)}
                        style={{ resize: "none" }}
                        cols="59"
                        rows="10"
                     ></textarea>
                     <MyButton
                        onClick={() => createPost(postContent)}
                        title="?????????????? ????????"
                     />
                  </MyModal>
                  <MyButton onClick={() => logout()} title="??????????" />
               </div>
            ) : (
               <div>
                  <MyButton onClick={() => setLoginModal(true)} title="????????" />
                  <MyModal visible={loginModal} setVisible={setLoginModal}>
                     <h2 style={{ textAlign: "center" }}>??????????</h2>
                     <h3 style={{ textAlign: "center" }}>{loginError}</h3>
                     <form onSubmit={loginFetch}>
                        <span>{loginInvalid}</span>
                        <MyInput
                           onChange={(e) => setLogin(e.target.value)}
                           type="text"
                           placeholder="?????????????? ??????????"
                        />
                        <span>{passwordInvalid}</span>
                        <MyInput
                           onChange={(e) => setPassword(e.target.value)}
                           type="password"
                           placeholder="?????????????? ????????????"
                        />
                        <MyButton title="??????????" />
                     </form>
                  </MyModal>
                  <MyButton
                     onClick={() => setRegisterModal(true)}
                     title="??????????????????????"
                  />
                  <MyModal
                     visible={registerModal}
                     setVisible={setRegisterModal}
                  >
                     <h2 style={{ textAlign: "center" }}>??????????????????????</h2>
                     <h3 style={{ textAlign: "center" }}>{registerError}</h3>
                     <form onSubmit={registerFetch}>
                        <span>{registerLoginInvalid}</span>
                        <MyInput
                           onChange={(e) => setRegisterLogin(e.target.value)}
                           type="text"
                           placeholder="?????????????? ??????????"
                        />
                        <span>{registerPasswordInvalid}</span>
                        <MyInput
                           onChange={(e) => setRegisterPassword(e.target.value)}
                           type="password"
                           placeholder="?????????????? ????????????"
                        />
                        <span>{registerConfirmInvalid}</span>
                        <MyInput
                           onChange={(e) => setRegisterConfirm(e.target.value)}
                           type="password"
                           placeholder="?????????????????????? ????????????"
                        />
                        <MyButton title="????????????????????????????????????" />
                     </form>
                  </MyModal>
               </div>
            )}
         </div>
      </div>
   );
};

export default Header;
