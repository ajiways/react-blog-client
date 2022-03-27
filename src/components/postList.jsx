import React, { useEffect, useCallback, useState, useContext } from "react";
import PostItem from "./postItem";
import $api from "./http";
import { getPageCount, getPagesArray } from "../utils/pages";
import MyButton from "./UI/button/myButton";

import { context } from "../App";

const PostList = ({ user }) => {
   const [posts, setPosts] = useState([]);
   const [totalPages, setTotalPages] = useState(0);
   const [page, setPage] = useState(1);
   const [skip, setSkip] = useState(0);
   const take = 10;

   let pagesArray = getPagesArray(totalPages);

   const fetchPosts = useCallback(async () => {
      const response = await $api.get(`/posts?take=${take}&skip=${skip}`);
      const totalCount = response.data.totalCount;
      setTotalPages(getPageCount(totalCount, take));
      setPosts(response.data.posts);
   }, [skip, take]);

   const localContext = useContext(context);

   localContext.func = fetchPosts;

   useEffect(() => {
      fetchPosts();
   }, [fetchPosts, page]);

   function changePage(page) {
      setPage(page);
      setSkip((page - 1) * take);
   }

   return (
      <div className="post__list">
         <h1 className="list__title">Список постов</h1>
         <MyButton
            style={{ marginBottom: "10px" }}
            onClick={() => fetchPosts()}
            title="Обновить"
         />
         {posts.length ? (
            posts.map((post) => (
               <PostItem
                  markdown={post.markdown}
                  createdAt={post.created_at}
                  posts={posts}
                  setPosts={setPosts}
                  postId={post.id}
                  authorId={post.author_id}
                  user={user}
                  key={post.id}
                  authorLogin={post.author_login}
                  content={post.html_content}
               />
            ))
         ) : (
            <div className="posts__empty">
               <h1 className="empty__title">Постов нет!</h1>
            </div>
         )}
         <div className="page__wrapper">
            {pagesArray.map((p) => (
               <span
                  onClick={() => changePage(p)}
                  key={p}
                  className={page === p ? "page page__current" : "page"}
               >
                  {p}
               </span>
            ))}
         </div>
      </div>
   );
};

export default PostList;
