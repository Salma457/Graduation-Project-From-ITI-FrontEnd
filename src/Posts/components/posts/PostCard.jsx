import { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { reactToPost, removeReaction, deletePost } from '../../services/api';
import ReactionPicker from './ReactionPicker';
import CommentSection from './CommentSection';
import ReactionsModal from './ReactionsModal';

const reactionIcons = {
  like: '👍',
  love: '❤️',
  haha: '😂',
  wow: '😮',
  sad: '😢',
  angry: '😠',
  support: '💪'
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 150
    }
  },
  hover: {
    y: -2,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
  }
};

const PostCard = memo(({ post, onDelete, onEditPost, onShowReactions, onConfirmDelete }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.itian.user);

  const [showComments, setShowComments] = useState(false);
  const [reactions, setReactions] = useState(post.reactions || {});
  const [userReaction, setUserReaction] = useState(post.user_reaction);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showReactionsModal, setShowReactionsModal] = useState(false);

  const isMyPost = user?.user_id === post.itian?.user_id;
  const totalReactions = Object.values(reactions).reduce((sum, count) => sum + count, 0);

  const handleProfileClick = useCallback(() => {
    navigate(`/itian-profile/${post.itian.user_id}`);
  }, [navigate, post.itian.user_id]);

  const handleReaction = useCallback(async (reactionType) => {
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
  }, [post.id, userReaction]);

  const handleDelete = useCallback(async () => {
    try {
      setIsDeleting(true);
      await deletePost(post.id);
      onConfirmDelete?.(post.id);
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
  }, [post.id, onDelete, onConfirmDelete]);

  const PostOptions = () => (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowOptions(!showOptions)}
        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
        aria-label="Post options"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-xl z-10 border border-gray-200 overflow-hidden"
          >
            <div className="py-1">
              <motion.button
                whileHover={{ x: 3 }}
                onClick={() => {
                  onEditPost(post);
                  setShowOptions(false);
                }}
                className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors"
              >
                📝 Edit Post
              </motion.button>
              <motion.button
                whileHover={{ x: 3 }}
                onClick={() => {
                  setShowOptions(false);
                  setShowDeleteConfirm(true);
                }}
                className="flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors"
              >
                🗑️ Delete Post
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const DeleteConfirmationModal = () => (
    <AnimatePresence>
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-gray-200 z-10"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">Delete this post?</h3>
            <p className="text-sm text-gray-500 text-center mb-6">This action cannot be undone.</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="bg-white rounded-xl shadow border border-gray-100 p-5"
      >
        <div className="flex justify-between items-start mb-3">
          <div onClick={handleProfileClick} className="cursor-pointer">
            <h2 className="font-semibold text-gray-800">{post.itian.first_name} {post.itian.last_name}</h2>
            <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleString()}</p>
          </div>
          {isMyPost && <PostOptions />}
        </div>

        <h3 className="text-lg font-bold mb-2">{post.title}</h3>
        <p className="text-gray-700 whitespace-pre-line">{post.content}</p>

        {post.image && (
          <img
            src={`http://localhost:8000/storage/${post.image}`}
            alt="Post"
            className="rounded-lg mt-3 max-h-96 w-full object-cover"
          />
        )}

        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
          <div>
            {totalReactions > 0 && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setShowReactionsModal(true);
                  onShowReactions?.(post.id);
                }}
                className="text-sm text-gray-600 underline hover:text-gray-800"
              >
                {totalReactions} {totalReactions === 1 ? 'reaction' : 'reactions'}
              </motion.button>
            )}
          </div>
          <div>
            {post.comments_count > 0 && <span>{post.comments_count} comment(s)</span>}
          </div>
        </div>

        <div className="mt-4 flex space-x-4">
          <button
            onClick={() => setShowReactionPicker(!showReactionPicker)}
            className="text-gray-500 hover:text-red-500"
          >
            {userReaction ? `${reactionIcons[userReaction]} ${userReaction}` : 'React'}
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-gray-500 hover:text-red-500"
          >
            Comment
          </button>
        </div>

        <AnimatePresence>
          {showReactionPicker && (
            <ReactionPicker
              onSelect={(type) => {
                handleReaction(type);
                setShowReactionPicker(false);
              }}
              onClose={() => setShowReactionPicker(false)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-3"
            >
              <CommentSection postId={post.id} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {showReactionsModal && (
        <ReactionsModal postId={post.id} onClose={() => setShowReactionsModal(false)} />
      )}

      <DeleteConfirmationModal />
    </>
  );
});

export default PostCard;
