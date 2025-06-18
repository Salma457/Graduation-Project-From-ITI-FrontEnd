import { useState, useEffect } from 'react';
import { 
  fetchComments, 
  addComment, 
  updateComment, 
  deleteComment,
  addReply,
} from '../services/api';
import Reply from './Reply';

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await fetchComments(postId);
      setComments(data);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      setLoading(true);
      await addComment(postId, newComment);
      await loadComments();
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReply = async (commentId) => {
    if (!replyText.trim()) return;
    
    try {
      setLoading(true);
      await addReply(postId, commentId, replyText);
      await loadComments();
      setReplyingTo(null);
      setReplyText('');
    } catch (error) {
      console.error('Error adding reply:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateComment = async () => {
    if (!editCommentText.trim()) return;
    
    try {
      setLoading(true);
      await updateComment(editingCommentId, editCommentText);
      await loadComments();
      setEditingCommentId(null);
      setEditCommentText('');
    } catch (error) {
      console.error('Error updating comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      setLoading(true);
      await deleteComment(commentId);
      await loadComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    try {
      setLoading(true);
      await deleteComment(replyId);
      await loadComments();
    } catch (error) {
      console.error('Error deleting reply:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReply = async (commentId, replyId, newContent) => {
    try {
      await updateComment(replyId, newContent);
      await loadComments();
    } catch (error) {
      console.error('Error updating reply:', error);
    }
  };

  return (
    <div className="mt-6 border-t border-gray-200 pt-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Comments ({comments.length})</h3>
      
      {/* Add Comment Form */}
      <div className="flex mb-6">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          onClick={handleAddComment}
          disabled={loading || !newComment.trim()}
          className="bg-red-600 text-white px-4 py-2 rounded-r-lg hover:bg-red-700 disabled:bg-red-300 transition-colors"
        >
          Post
        </button>
      </div>
      
      {/* Comments List */}
      {loading && comments.length === 0 ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
              {editingCommentId === comment.id ? (
                <div className="flex mb-2">
                  <input
                    type="text"
                    value={editCommentText}
                    onChange={(e) => setEditCommentText(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-l-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <button
                    onClick={handleUpdateComment}
                    disabled={loading || !editCommentText.trim()}
                    className="bg-green-600 text-white px-3 py-1 rounded-r-lg hover:bg-green-700 disabled:bg-green-300 transition-colors"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{comment.user.name}</h4>
                      <p className="text-gray-600 mt-1">{comment.content}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => {
                          setEditingCommentId(comment.id);
                          setEditCommentText(comment.content);
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                      <button 
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        className="text-sm text-green-600 hover:text-green-800"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(comment.created_at).toLocaleString()}
                  </div>
                  
                  {/* Reply Form */}
                  {replyingTo === comment.id && (
                    <div className="mt-3 flex">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                        className="flex-1 border border-gray-300 rounded-l-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <button
                        onClick={() => handleAddReply(comment.id)}
                        disabled={loading || !replyText.trim()}
                        className="bg-red-600 text-white px-3 py-1 rounded-r-lg hover:bg-red-700 disabled:bg-red-300 transition-colors"
                      >
                        Reply
                      </button>
                    </div>
                  )}

                  {/* Replies List */}
                  {comment.replies.map((reply) => (
                    <Reply
                      key={reply.id}
                      reply={reply}
                      onUpdate={(newContent) => handleUpdateReply(comment.id, reply.id, newContent)}
                      onDelete={() => handleDeleteReply(comment.id, reply.id)}
                    />
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;
