import React, { createContext, useContext, useState } from 'react';
import { getPosts, getPostComments } from '../services/api';

const PostContext = createContext();

export function PostProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);

  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [bookmarks, setBookmarks] = useState([]);
  const [commentCache, setCommentCache] = useState({});
  const [likedPostIds, setLikedPostIds] = useState([]);

  const loadMore = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    try {
      const data = await getPosts(10, skip);

      if (!data.posts || data.posts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => {
          const existingIds = prev.map(item => item.id);

          const newPosts = data.posts.filter(
            item => !existingIds.includes(item.id)
          );

          return [...prev, ...newPosts];
        });

        setSkip(prev => prev + 10);
      }
    } catch (error) {
      console.log('POST ERROR:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addPostOptimistic = async post => {
    const tempPost = {
      id: Date.now(),
      title: post.title,
      body: post.body,
      tags: post.tags || [],
      userId: post.userId || 1,
      reactions: {
        likes: 0,
        dislikes: 0,
      },
      views: 0,
      isOptimistic: true,
    };

    setPosts(prev => [tempPost, ...prev]);
    setUserPosts(prev => [tempPost, ...prev]);

    try {
      const response = await fetch('https://dummyjson.com/posts/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: post.title,
          body: post.body,
          userId: post.userId || 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Gönderi paylaşılırken hata oluştu');
      }

      const finalPost = {
        ...tempPost,
        apiId: data.id,
        isOptimistic: false,
      };

      setPosts(prev =>
        prev.map(item => (item.id === tempPost.id ? finalPost : item))
      );

      setUserPosts(prev =>
        prev.map(item => (item.id === tempPost.id ? finalPost : item))
      );

      return { success: true, data: finalPost };
    } catch (error) {
      setPosts(prev => prev.filter(item => item.id !== tempPost.id));
      setUserPosts(prev => prev.filter(item => item.id !== tempPost.id));

      return {
        success: false,
        message: error.message || 'Gönderi paylaşılırken hata oluştu',
      };
    }
  };

  const toggleLike = postId => {
    const alreadyLiked = likedPostIds.includes(postId);

    setLikedPostIds(prev =>
      alreadyLiked ? prev.filter(id => id !== postId) : [...prev, postId]
    );

    const updateLikes = post => {
      if (post.id !== postId) return post;

      const oldLikes = post.reactions?.likes || 0;

      return {
        ...post,
        reactions: {
          ...(post.reactions || {}),
          likes: alreadyLiked ? Math.max(oldLikes - 1, 0) : oldLikes + 1,
        },
      };
    };

    setPosts(prev => prev.map(updateLikes));
    setUserPosts(prev => prev.map(updateLikes));
    setBookmarks(prev => prev.map(updateLikes));
  };

  const isLiked = postId => {
    return likedPostIds.includes(postId);
  };

  const toggleBookmark = post => {
    setBookmarks(prev => {
      const exists = prev.some(item => item.id === post.id);

      if (exists) {
        return prev.filter(item => item.id !== post.id);
      }

      return [post, ...prev];
    });
  };

  const isBookmarked = postId => {
    return bookmarks.some(item => item.id === postId);
  };

  const loadComments = async postId => {
    if (commentCache[postId]) {
      return commentCache[postId];
    }

    try {
      const data = await getPostComments(postId);
      const comments = data.comments || [];

      setCommentCache(prev => ({
        ...prev,
        [postId]: comments,
      }));

      return comments;
    } catch (error) {
      console.log('COMMENT ERROR:', error.message);
      return [];
    }
  };

  const addComment = async (postId, text) => {
    const tempComment = {
      id: Date.now(),
      body: text,
      postId,
      user: {
        id: 1,
        username: 'you',
        fullName: 'Sen',
      },
      isOptimistic: true,
    };

    setCommentCache(prev => ({
      ...prev,
      [postId]: [tempComment, ...(prev[postId] || [])],
    }));

    try {
      const response = await fetch('https://dummyjson.com/comments/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          body: text,
          postId,
          userId: 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Yorum eklenemedi');
      }

      setCommentCache(prev => ({
        ...prev,
        [postId]: prev[postId].map(comment =>
          comment.id === tempComment.id
            ? {
                ...data,
                user: tempComment.user,
              }
            : comment
        ),
      }));

      return { success: true };
    } catch (error) {
      setCommentCache(prev => ({
        ...prev,
        [postId]: prev[postId].filter(
          comment => comment.id !== tempComment.id
        ),
      }));

      return {
        success: false,
        message: error.message,
      };
    }
  };

  const resetPosts = () => {
    setPosts([]);
    setUserPosts([]);
    setSkip(0);
    setHasMore(true);
    setIsLoading(false);
    setBookmarks([]);
    setCommentCache({});
    setLikedPostIds([]);
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        userPosts,
        loadMore,
        hasMore,
        isLoading,

        addPostOptimistic,

        likedPostIds,
        toggleLike,
        isLiked,

        bookmarks,
        toggleBookmark,
        isBookmarked,

        commentCache,
        loadComments,
        addComment,

        resetPosts,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

export function usePosts() {
  return useContext(PostContext);
}  