import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { reactToPost, removeReaction, deletePost } from '../../services/api';
import ReactionPicker from './ReactionPicker';
import CommentSection from './CommentSection';
import EditPostModal from './EditPostModal';

const reactionIcons = {
  like: '👍',
  love: '❤️',
  haha: '😂',
  wow: '😮',
  sad: '😢',
  angry: '😠',
  support: '💪'
};

const PostCard = ({ post, onDelete, onUpdate }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [reactions, setReactions] = useState(post.reactions || {});
  const [userReaction, setUserReaction] = useState(post.user_reaction);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showReactionDetails, setShowReactionDetails] = useState(false);

  const isMyPost = user?.user_id === post.itian?.user_id;

  const handleReaction = async (reactionType) => {
    try {
      if (userReaction === reactionType) {
        await removeReaction(post.id);
        setUserReaction(null);
        setReactions(prev => ({
          ...prev,
          [reactionType]: prev[reactionType] - 1
        }));
      } else {
        if (userReaction) {
          await removeReaction(post.id);
          setReactions(prev => ({
            ...prev,
            [userReaction]: prev[userReaction] - 1
          }));
        }
        
        await reactToPost(post.id, reactionType);
        setUserReaction(reactionType);
        setReactions(prev => ({
          ...prev,
          [reactionType]: (prev[reactionType] || 0) + 1
        }));
      }
    } catch (error) {
      console.error('Error reacting to post:', error);
      toast.error('Failed to react to post');
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deletePost(post.id);
      onDelete(post.id);
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    } finally {
      setIsDeleting(false);
      setShowOptions(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowOptions(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg relative group border border-gray-100 max-w-2xl mx-auto"
    >
      {/* Post header */}
      <div className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {/* Avatar with reaction indicator */}
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center overflow-hidden">
                {post.itian.profile_picture ? (
                  <img
                    src={`http://localhost:8000/storage/${post.itian.profile_picture}`}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-red-600 font-semibold">
                    {post.itian.first_name?.charAt(0)}
                  </span>
                )}
              </div>
              {userReaction && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm"
                >
                  <span className="text-sm">{reactionIcons[userReaction]}</span>
                </motion.div>
              )}
            </div>

            {/* User info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">
                {post.itian.first_name} {post.itian.last_name}
              </h3>
              <p className="text-xs text-gray-500">
                {new Date(post.created_at).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          
          {/* Post options dropdown */}
          {isMyPost && (
            <div className="relative">
              <button 
                onClick={() => setShowOptions(!showOptions)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                aria-label="Post options"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>

              <AnimatePresence>
                {showOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                  >
                    <div className="py-1">
                      <button
                        onClick={handleEdit}
                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setShowOptions(false);
                          setShowDeleteConfirm(true);
                        }}
                        className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Post content */}
      <div className="p-4 pt-2">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">{post.title}</h2>
        <p className="text-gray-700 whitespace-pre-line leading-relaxed">{post.content}</p>
        
        {/* Post image */}
        {post.image && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-3 rounded-lg overflow-hidden"
          >
            <img 
              src={`http://localhost:8000/storage/${post.image}`} 
              alt="Post" 
              className="w-full h-auto object-cover max-h-96"
              loading="lazy"
            />
          </motion.div>
        )}
      </div>

      {/* Reactions and comments count */}
      <div className="px-4 pb-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex space-x-1">
            {Object.entries(reactions)
              .filter(([, count]) => count > 0)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 3)
              .map(([type, count]) => (
                <motion.button 
                  key={type} 
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowReactionDetails(true)}
                  className="flex items-center px-2 py-0.5 bg-gray-50 rounded-full font-medium border border-gray-100"
                >
                  <span className="mr-1 text-xs">{reactionIcons[type]}</span>
                  {count}
                </motion.button>
              ))}
          </div>
          
          {post.comments_count > 0 && (
            <button 
              onClick={() => setShowComments(!showComments)}
              className="text-gray-500 hover:text-red-500 transition-colors text-xs"
            >
              {post.comments_count} {post.comments_count === 1 ? 'comment' : 'comments'}
            </button>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="border-t border-gray-100 px-4 py-1">
        <div className="flex justify-around">
          {/* Reaction button */}
          <div className="relative">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowReactionPicker(!showReactionPicker)}
              className={`flex items-center justify-center space-x-1 px-3 py-2 rounded-lg transition-colors text-sm ${
                userReaction ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              {userReaction ? (
                <>
                  <span className="text-sm">{reactionIcons[userReaction]}</span>
                  <span className="capitalize">{userReaction}</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  <span>React</span>
                </>
              )}
            </motion.button>
            {showReactionPicker && (
              <ReactionPicker 
                onSelect={handleReaction}
                onClose={() => setShowReactionPicker(false)}
              />
            )}
          </div>
          
          {/* Comment button */}
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowComments(!showComments)}
            className="flex items-center justify-center space-x-1 px-3 py-2 rounded-lg text-gray-500 hover:text-red-500 transition-colors text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>Comment</span>
          </motion.button>
        </div>
      </div>

      {/* Comments section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-100 overflow-hidden"
          >
            <CommentSection postId={post.id} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reaction Details Modal */}
      <AnimatePresence>
        {showReactionDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setShowReactionDetails(false)}
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="relative bg-white rounded-xl shadow-xl max-w-sm w-full p-5 border border-gray-200 z-10 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Reactions</h3>
                <button 
                  onClick={() => setShowReactionDetails(false)}
                  className="text-gray-500 hover:text-red-500 text-xl"
                >
                  ×
                </button>
              </div>
              
              {Object.entries(reactions)
                .filter(([, count]) => count > 0)
                .sort((a, b) => b[1] - a[1])
                .map(([type, count]) => (
                  <div key={type} className="mb-4">
                    <h4 className="font-medium text-gray-700 capitalize mb-2 flex items-center">
                      <span className="mr-2">{reactionIcons[type]}</span>
                      {type} ({count})
                    </h4>
                    <ul className="space-y-2">
                      {/* Replace with actual user data from your API */}
                      <li className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm">👤</span>
                        </div>
                        <span>User Name</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm">👤</span>
                        </div>
                        <span>Another User</span>
                      </li>
                    </ul>
                  </div>
                ))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={() => setShowDeleteConfirm(false)}
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="relative bg-white rounded-xl shadow-xl max-w-sm w-full p-5 border border-gray-200 z-10"
            >
              <div className="text-center space-y-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-50">
                  <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-1">Delete this post?</h3>
                  <p className="text-gray-500 text-sm">This action cannot be undone.</p>
                </div>

                <div className="flex justify-center space-x-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all text-sm"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm flex items-center justify-center min-w-[100px]"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Deleting
                      </>
                    ) : (
                      'Delete'
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Post Modal */}
      {isEditing && (
        <EditPostModal 
          post={post}
          onClose={() => setIsEditing(false)}
          onUpdate={onUpdate}
        />
      )}
    </motion.div>
  );
};

export default PostCard;