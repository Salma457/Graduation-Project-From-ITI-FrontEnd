import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('access-token');
  return {
    Authorization: `Bearer ${token}`
  };
};

// Posts
export const fetchPosts = async () => {
  const response = await axios.get(`${API_BASE_URL}/posts`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const createPost = async (postData) => {
  const response = await axios.post(`${API_BASE_URL}/posts`, postData, {
    headers: getAuthHeaders()
  });
  return response.data;
};

// Reactions
export const reactToPost = async (postId, reactionType) => {
  const response = await axios.post(
    `${API_BASE_URL}/posts/${postId}/react`,
    { reaction_type: reactionType }, // ✅ المفتاح الصحيح
    { headers: getAuthHeaders() }
  );
  return response.data;
};


export const removeReaction = async (postId) => {
  const response = await axios.delete(
    `${API_BASE_URL}/posts/${postId}/reaction`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const getPostReactions = async (postId) => {
  const response = await axios.get(
    `${API_BASE_URL}/posts/${postId}/reactions`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

// Comments
export const fetchComments = async (postId) => {
  const response = await axios.get(
    `${API_BASE_URL}/posts/${postId}/comments`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const addComment = async (postId, content) => {
  const response = await axios.post(
    `${API_BASE_URL}/posts/${postId}/comments`,
    { content },
    { headers: getAuthHeaders() }
  );
  return response.data;
};


export const updateComment = async (commentId, commentText) => {
  const response = await axios.put(
    `${API_BASE_URL}/comments/${commentId}`,
    { content: commentText },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

export const deleteComment = async (commentId) => {
  const response = await axios.delete(
    `${API_BASE_URL}/comments/${commentId}`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};
// Replies
export const addReply = async (postId, commentId, replyText) => {
  const response = await axios.post(
    `${API_BASE_URL}/posts/${postId}/comments`,
    {
      content: replyText,
      parent_comment_id: commentId
    },
    { headers: getAuthHeaders() }
  );
  return response.data.comment; // تأكد إنك بترجع التعليق نفسه
};



export const fetchReplies = async (commentId) => {
  const response = await axios.get(
    `${API_BASE_URL}/comments/${commentId}/replies`,
    { headers: getAuthHeaders() }
  );
  return response.data;
};