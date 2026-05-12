import React, { createContext, useContext, useState } from 'react';
import { getPosts, getPostComments } from '../services/api';

const PostContext = createContext();

export function PostProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [bookmarks, setBookmarks] = useState([]);
  const [commentCache, setCommentCache] = useState({});

  const loadMore = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    try {
      const data = await getPosts(10, skip);

      if (!data.posts || data.posts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => [...prev, ...data.posts]);
        setSkip(prev => prev + 10);
      }
    } catch (error) {
      console.log('POST ERROR:', error.message);
    } finally {
      setIsLoading(false);
    }
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
        headers: { 'Content-Type': 'application/json' },
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

  return (
    <PostContext.Provider
      value={{
        posts,
        loadMore,
        hasMore,
        isLoading,

        bookmarks,
        toggleBookmark,
        isBookmarked,

        commentCache,
        loadComments,
        addComment,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

export function usePosts() {
  return useContext(PostContext);
}