import React, { useState } from "react";
import $api from "./http";
import MyButton from "./UI/button/myButton";
import MyModal from "./UI/MyModal/myModal";

const PostItem = ({
   authorLogin,
   content,
   markdown,
   authorId,
   createdAt,
   user,
   postId,
   posts,
   setPosts,
}) => {
   //костыль с setPosts, но я и не фронтенд разработчик :)
   const [confirmModal, setConfirmModal] = useState(false);
   const [newPostContent, setNewPostContent] = useState(markdown);
   const [updatePostError, setUpdatePostError] = useState("");
   const [updatePostModal, setUpdatePostModal] = useState(false);
   const [deletePostError, setDeletePostError] = useState("");

   async function deletePost(id) {
      const res = await $api
         .delete(`/posts/${id}`)
         .catch((err) => setDeletePostError(err.response.data.message));
      if (res) {
         setPosts(posts.filter((post) => post.id !== id));
      }
   }

   async function updatePost(newContent, postId) {
      const res = await $api
         .put(`/posts`, {
            markdown: newContent,
            id: postId,
         })
         .catch((err) => setUpdatePostError(err.response.data.message));

      if (res) {
         setUpdatePostModal(false);
      }
   }

   return (
      <div className="post">
         <h2 className="post__author">Автор поста: {authorLogin}</h2>
         <h3>Дата создания: {new Date(createdAt).toLocaleString("ru-RU")}</h3>
         <div
            className="post__content"
            dangerouslySetInnerHTML={{ __html: content }}
         />
         <div className="post__btns">
            {user.id === authorId ? (
               <div>
                  <MyButton
                     onClick={() => setUpdatePostModal(true)}
                     title="Редактировать"
                  />
                  <MyModal
                     visible={updatePostModal}
                     setVisible={setUpdatePostModal}
                  >
                     <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
                        Тут обновленный контент (в markdown) :)
                     </h2>
                     <h4 style={{ textAlign: "center", marginBottom: "10px" }}>
                        {updatePostError}
                     </h4>
                     <textarea
                        onInput={(e) => setNewPostContent(e.target.value)}
                        value={newPostContent}
                        style={{ resize: "none" }}
                        cols="59"
                        rows="10"
                     ></textarea>
                     <MyButton
                        onClick={() => updatePost(newPostContent, postId)}
                        title="Обновить пост"
                     />
                  </MyModal>
                  <MyButton
                     onClick={() => setConfirmModal(true)}
                     title="Удалить"
                  />
                  <MyModal visible={confirmModal} setVisible={setConfirmModal}>
                     <h4 style={{ marginBottom: "5px" }}>
                        Подтвердите удаление
                     </h4>
                     <span>{deletePostError}</span>
                     <MyButton
                        onClick={() => deletePost(postId)}
                        title="Подтверждаю"
                     />
                     <MyButton
                        onClick={() => setConfirmModal(false)}
                        title="Я передумал"
                     />
                  </MyModal>
               </div>
            ) : (
               <div></div>
            )}
         </div>
      </div>
   );
};

export default PostItem;
