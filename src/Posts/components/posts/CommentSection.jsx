import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { fetchComments, addComment, updateComment, deleteComment } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiTrash2, FiCornerUpLeft, FiMoreVertical } from 'react-icons/fi';



const CommentSection = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 5,
    total: 0
  });
  const commentEndRef = useRef(null);

  // Load initial comments
  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoading(true);
        const data = await fetchComments(postId);
        setComments(data.data);
        setPagination({
          currentPage: data.current_page,
          lastPage: data.last_page,
          perPage: data.per_page,
          total: data.total
        });
      } catch (err) {
        setError('Failed to load comments');
        console.error('Error loading comments:', err);
        toast.error('Failed to load comments');
      } finally {
        setLoading(false);
      }
    };

    loadComments();
  }, [postId]);

  // Load more comments
  const loadMoreComments = async () => {
    if (pagination.currentPage >= pagination.lastPage || loadingMore) return;

    try {
      setLoadingMore(true);
      const nextPage = pagination.currentPage + 1;
      const data = await fetchComments(postId, { page: nextPage });

      setComments(prev => [...prev, ...data.data]);
      setPagination({
        currentPage: data.current_page,
        lastPage: data.last_page,
        perPage: data.per_page,
        total: data.total
      });
    } catch (err) {
      console.error('Error loading more comments:', err);
      toast.error('Failed to load more comments');
    } finally {
      setLoadingMore(false);
    }
  };

  // Add comment or reply
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      let response;
      if (replyingTo) {
        response = await addComment(postId, newComment, replyingTo);
      } else {
        response = await addComment(postId, newComment);
      }

      if (replyingTo) {
        setComments(prev => prev.map(comment => 
          comment.id === replyingTo 
            ? { ...comment, replies: [...comment.replies, response] } 
            : comment
        ));
      } else {
        setComments(prev => [response, ...prev]);
      }

      setNewComment('');
      setReplyingTo(null);
      setTimeout(() => commentEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  // Update comment or reply
  const handleUpdateComment = async () => {
    if (!editContent.trim() || !editingComment) return;

    try {
      const updatedComment = await updateComment(editingComment, editContent);
      
      setComments(prev => prev.map(comment => {
        if (comment.id === editingComment) {
          return { ...comment, content: updatedComment.comment.content };
        }
        
        const updatedReplies = comment.replies.map(reply => 
          reply.id === editingComment 
            ? { ...reply, content: updatedComment.comment.content } 
            : reply
        );
        
        return { ...comment, replies: updatedReplies };
      }));

      setEditingComment(null);
      setEditContent('');
      toast.success('Comment updated successfully');
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment');
    }
  };

  // Delete comment or reply
  const handleDeleteComment = async (commentId, isReply = false, parentId = null) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await deleteComment(commentId);

      if (isReply && parentId) {
        setComments(prev => prev.map(comment => 
          comment.id === parentId
            ? { ...comment, replies: comment.replies.filter(reply => reply.id !== commentId) }
            : comment
        ));
      } else {
        setComments(prev => prev.filter(comment => comment.id !== commentId));
      }

      toast.success('Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Check if current user owns the content
  const isOwner = (commentUserId) => {
  return String(user?.user_id) === String(commentUserId);
};

  return (
    <div className="space-y-4">
      {/* Comment Input */}
      <div className="flex items-start space-x-3">
        {user?.profile_picture ? (
          <img
            src={`http://localhost:8000/storage/${user.profile_picture}`}
            alt="Profile"
            className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-100 to-red-300 flex items-center justify-center text-red-600 font-bold text-lg shadow-sm">
            {user?.name?.charAt(0)}
          </div>
        )}
        
        <div className="flex-1">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={replyingTo ? "Write your reply..." : "Write your comment..."}
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none transition-all"
            rows={2}
          />
          <div className="flex justify-between items-center mt-2">
            {replyingTo && (
              <span className="text-sm text-gray-500">
                Replying to comment
                <button 
                  onClick={() => setReplyingTo(null)}
                  className="ml-2 text-red-500 hover:text-red-700 text-sm"
                >
                  Cancel
                </button>
              </span>
            )}
            <button
              onClick={handleAddComment}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm"
              disabled={!newComment.trim()}
            >
              {replyingTo ? 'Post Reply' : 'Post Comment'}
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-4">{error}</div>
      ) : comments.length === 0 ? (
        <div className="text-center text-gray-500 py-4">No comments yet. Be the first to comment!</div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              {/* Main Comment */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    {comment.user.profile_picture ? (
                      <img
                        src={`http://localhost:8000/storage/${comment.user.profile_picture}`}
                        alt="Profile"
                        className="h-8 w-8 rounded-full object-cover border border-white shadow-sm"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center text-gray-600 font-bold text-sm shadow-sm">
                        {comment.user.name?.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900">{comment.user.name}</h4>
                      <p className="text-xs text-gray-500">{formatDate(comment.created_at)}</p>
                    </div>
                  </div>
                  
                  {isOwner(comment.user.id) && (
                    <div className="relative">
                      <button className="text-gray-400 hover:text-gray-600 p-1">
                        <FiMoreVertical />
                      </button>
                      <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <button
                          onClick={() => {
                            setEditingComment(comment.id);
                            setEditContent(comment.content);
                          }}
                          className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          <FiEdit2 className="mr-2" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="flex items-center px-3 py-2 text-sm text-red-500 hover:bg-red-50 w-full text-left"
                        >
                          <FiTrash2 className="mr-2" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {editingComment === comment.id ? (
                  <div className="mt-3 space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-lg focus:ring-red-500 focus:border-red-500"
                      rows={2}
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleUpdateComment}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm shadow-sm"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => setEditingComment(null)}
                        className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-100 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 text-gray-700 whitespace-pre-line">{comment.content}</p>
                )}

                <div className="flex items-center mt-3 space-x-4">
                  <button
                    onClick={() => {
                      setReplyingTo(comment.id);
                      setEditingComment(null);
                    }}
                    className="flex items-center text-sm text-gray-500 hover:text-red-500"
                  >
                    <FiCornerUpLeft className="mr-1" />
                    Reply
                  </button>
                </div>
              </motion.div>

              {/* Replies */}
              {comment.replies.length > 0 && (
                <div className="ml-8 space-y-3 border-l-2 border-gray-200 pl-4">
                  {comment.replies.map((reply) => (
                    <motion.div
                      key={reply.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-gray-50 rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          {reply.user.profile_picture ? (
                            <img
                              src={`http://localhost:8000/storage/${reply.user.profile_picture}`}
                              alt="Profile"
                              className="h-8 w-8 rounded-full object-cover border border-white shadow-sm"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center text-gray-600 font-bold text-sm shadow-sm">
                              {reply.user.name?.charAt(0)}
                            </div>
                          )}
                          <div>
                            <h4 className="font-medium text-gray-900">{reply.user.name}</h4>
                            <p className="text-xs text-gray-500">{formatDate(reply.created_at)}</p>
                          </div>
                        </div>
                        
                        {isOwner(reply.user.id) && (
                          <div className="relative">
                            <button className="text-gray-400 hover:text-gray-600 p-1">
                              <FiMoreVertical />
                            </button>
                            <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                              <button
                                onClick={() => {
                                  setEditingComment(reply.id);
                                  setEditContent(reply.content);
                                }}
                                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <FiEdit2 className="mr-2" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteComment(reply.id, true, comment.id)}
                                className="flex items-center px-3 py-2 text-sm text-red-500 hover:bg-red-50 w-full text-left"
                              >
                                <FiTrash2 className="mr-2" />
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {editingComment === reply.id ? (
                        <div className="mt-3 space-y-2">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-red-500 focus:border-red-500"
                            rows={2}
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={handleUpdateComment}
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm shadow-sm"
                            >
                              Update
                            </button>
                            <button
                              onClick={() => setEditingComment(null)}
                              className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-100 text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-2 text-gray-700 whitespace-pre-line">{reply.content}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Load More Button */}
          {pagination.currentPage < pagination.lastPage && (
            <div className="flex justify-center pt-4">
              <button
                onClick={loadMoreComments}
                disabled={loadingMore}
                className="px-4 py-2 text-sm text-gray-600 hover:text-red-500 flex items-center"
              >
                {loadingMore ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-red-500 mr-2"></span>
                    Loading...
                  </>
                ) : (
                  'Load more comments'
                )}
              </button>
            </div>
          )}

          <div ref={commentEndRef} />
        </div>
      )}
    </div>
  );
};

export default CommentSection;