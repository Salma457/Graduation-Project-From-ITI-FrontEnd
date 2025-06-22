import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { fetchComments, addComment, updateComment, deleteComment } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiTrash2, FiCornerUpLeft, FiSend, FiX } from 'react-icons/fi';

const CommentSection = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 5,
    total: 0
  });

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
      setPagination(prev => ({
        ...prev,
        currentPage: data.current_page,
        lastPage: data.last_page
      }));
    } catch (err) {
      console.error('Error loading more comments:', err);
      toast.error('Failed to load more comments');
    } finally {
      setLoadingMore(false);
    }
  };

  // Add comment or reply
  const handleAddComment = async () => {
    const content = replyingTo ? replyContent : newComment;
    if (!content.trim()) return;

    try {
      const response = await addComment(postId, content, replyingTo);
      
      if (replyingTo) {
        const addReplyToComments = (commentsList, parentId, newReply) => {
          return commentsList.map(comment => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newReply]
              };
            }
            
            if (comment.replies) {
              return {
                ...comment,
                replies: addReplyToComments(comment.replies, parentId, newReply)
              };
            }
            
            return comment;
          });
        };
        
        setComments(prev => addReplyToComments(prev, replyingTo, response));
        setReplyContent('');
      } else {
        setComments(prev => [response, ...prev]);
        setNewComment('');
      }

      setReplyingTo(null);
      toast.success(replyingTo ? 'Reply added successfully' : 'Comment added successfully');
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
      
      const updateCommentInList = (commentsList, commentId, updatedContent) => {
        return commentsList.map(comment => {
          if (comment.id === commentId) {
            return { ...comment, content: updatedContent };
          }
          
          if (comment.replies) {
            return {
              ...comment,
              replies: updateCommentInList(comment.replies, commentId, updatedContent)
            };
          }
          
          return comment;
        });
      };
      
      setComments(prev => updateCommentInList(prev, editingComment, updatedComment.comment.content));

      setEditingComment(null);
      setEditContent('');
      toast.success('Comment updated successfully');
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment');
    }
  };

  // Delete confirmation
  const confirmDelete = (commentId) => {
    setCommentToDelete(commentId);
    setShowDeleteModal(true);
  };

  // Delete comment or reply
  const handleDeleteComment = async () => {
    if (!commentToDelete) return;
    
    try {
      await deleteComment(commentToDelete);

      const deleteCommentFromList = (commentsList, commentId) => {
        const filtered = commentsList.filter(comment => comment.id !== commentId);
        
        if (filtered.length === commentsList.length) {
          return commentsList.map(comment => {
            if (comment.replies) {
              return {
                ...comment,
                replies: deleteCommentFromList(comment.replies, commentId)
              };
            }
            return comment;
          });
        }
        
        return filtered;
      };
      
      setComments(prev => deleteCommentFromList(prev, commentToDelete));
      toast.success('Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    } finally {
      setShowDeleteModal(false);
      setCommentToDelete(null);
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

  // Render comment with its replies
  const renderComment = (comment, depth = 0) => {
    const isTopLevel = depth === 0;
    return (
      <div key={comment.id} className={`space-y-3 ${!isTopLevel ? 'ml-8 pl-4 border-l-2 border-gray-100' : ''}`}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg p-4 shadow-xs"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              {comment.user.profile_picture ? (
                <img
                  src={`http://localhost:8000/storage/${comment.user.profile_picture}`}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center text-gray-600 font-medium text-sm">
                  {comment.user.name?.charAt(0)}
                </div>
              )}
              <div>
                <h4 className="font-medium text-gray-900">{comment.user.name}</h4>
                <p className="text-xs text-gray-500">{formatDate(comment.created_at)}</p>
              </div>
            </div>
            
            {isOwner(comment.user.id) && (
              <div className="flex space-x-2">
                <button 
                  className="text-gray-400 hover:text-blue-500 p-1 transition-colors"
                  onClick={() => {
                    setEditingComment(comment.id);
                    setEditContent(comment.content);
                    setReplyingTo(null);
                  }}
                >
                  <FiEdit2 size={16} />
                </button>
                <button 
                  className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                  onClick={() => confirmDelete(comment.id)}
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            )}
          </div>

          {editingComment === comment.id ? (
            <div className="mt-3 space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                rows={3}
                autoFocus
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleUpdateComment}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Update
                </button>
                <button
                  onClick={() => setEditingComment(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-2">
              <p className="text-gray-700 whitespace-pre-line">{comment.content}</p>
              <div className="flex items-center mt-3 space-x-4">
                <button
                  onClick={() => {
                    setReplyingTo(comment.id);
                    setEditingComment(null);
                  }}
                  className="flex items-center text-sm text-gray-500 hover:text-blue-500 transition-colors"
                >
                  <FiCornerUpLeft className="mr-1" size={14} />
                  Reply
                </button>
              </div>
            </div>
          )}

          {/* Reply Input */}
          {replyingTo === comment.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 ml-8 pl-4 border-l-2 border-gray-100"
            >
              <div className="flex items-start space-x-3 pt-2">
                {user?.profile_picture ? (
                  <img
                    src={`http://localhost:8000/storage/${user.profile_picture}`}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center text-blue-600 font-medium text-sm">
                    {user?.name?.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write your reply..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    rows={2}
                    autoFocus
                  />
                  <div className="flex justify-end mt-2 space-x-2">
                    <button
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyContent('');
                      }}
                      className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddComment}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        replyContent.trim() 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!replyContent.trim()}
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Render replies */}
        {comment.replies?.map(reply => renderComment(reply, depth + 1))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Comment Input */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg p-4 shadow-xs"
      >
        <div className="flex items-start space-x-3">
          {user?.profile_picture ? (
            <img
              src={`http://localhost:8000/storage/${user.profile_picture}`}
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center text-blue-600 font-medium text-lg">
              {user?.name?.charAt(0)}
            </div>
          )}
          
          <div className="flex-1 space-y-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              rows={3}
            />
            <div className="flex justify-end">
              {replyingTo && (
                <button 
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent('');
                  }}
                  className="mr-auto flex items-center text-sm text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <FiX className="mr-1" size={14} />
                  Cancel reply
                </button>
              )}
              <button
                onClick={handleAddComment}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  newComment.trim() 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!newComment.trim()}
              >
                <FiSend size={16} />
                <span>Comment</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : comments.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 py-8 bg-white rounded-lg p-6"
        >
          No comments yet. Be the first to comment!
        </motion.div>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => renderComment(comment))}

          {/* Load More Button */}
          {pagination.currentPage < pagination.lastPage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center pt-2"
            >
              <button
                onClick={loadMoreComments}
                disabled={loadingMore}
                className={`px-4 py-2 text-sm rounded-lg flex items-center space-x-2 transition-colors ${
                  loadingMore
                    ? 'bg-gray-200 text-gray-500'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {loadingMore ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-500 mr-2"></span>
                    Loading...
                  </>
                ) : (
                  'Load more comments'
                )}
              </button>
            </motion.div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6"
            >
              <div className="text-center space-y-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <FiTrash2 className="h-6 w-6 text-red-600" />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Delete comment?</h3>
                  <p className="text-gray-500 mt-1">This action cannot be undone.</p>
                </div>

                <div className="flex justify-center space-x-3 pt-2">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteComment}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommentSection;