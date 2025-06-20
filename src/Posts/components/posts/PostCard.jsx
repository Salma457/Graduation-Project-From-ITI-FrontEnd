import { useState } from 'react';
import { reactToPost, removeReaction, deletePost } from '../../services/api';
import ReactionPicker from './ReactionPicker';
import CommentSection from './CommentSection';
import EditPostModal from './EditPostModal';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

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
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg relative group">
      {/* Edit/Delete dropdown for my posts */}
      {isMyPost && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-sm btn-ghost rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-white rounded-box w-40">
              <li>
                <button onClick={() => setIsEditing(true)} className="text-gray-700 hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit
                </button>
              </li>
              <li>
                <button 
                  onClick={handleDelete} 
                  disabled={isDeleting}
                  className="text-red-500 hover:bg-red-50"
                >
                  {isDeleting ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                  Delete
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {post.itian.profile_picture ? (
                <img
                  src={`http://localhost:8000/storage/${post.itian.profile_picture}`}
                  alt="Profile"
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-red-200 to-red-300 flex items-center justify-center text-red-600 font-bold">
                  {post.itian.first_name?.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {post.itian.first_name} {post.itian.last_name}
              </h3>
              <p className="text-xs text-gray-500">
                {new Date(post.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h2>
          <p className="text-gray-600 whitespace-pre-line">{post.content}</p>
          
          {post.image && (
            <div className="mt-4">
              <img 
                src={`http://localhost:8000/storage/${post.image}`} 
                alt="Post" 
                className="rounded-lg max-h-96 w-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button 
                  onClick={() => setShowReactionPicker(!showReactionPicker)}
                  className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                >
                  {userReaction ? (
                    <span className="text-lg">{reactionIcons[userReaction]}</span>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      <span>React</span>
                    </>
                  )}
                </button>
                {showReactionPicker && (
                  <ReactionPicker 
                    onSelect={handleReaction}
                    onClose={() => setShowReactionPicker(false)}
                  />
                )}
              </div>
              
              <button 
                onClick={() => setShowComments(!showComments)}
                className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Comment</span>
              </button>
            </div>
            
            <div className="flex space-x-1">
              {Object.entries(reactions)
                .filter(([, count]) => count > 0)
                .map(([type, count]) => (
                  <span key={type} className="flex items-center px-2 py-1 bg-gray-100 rounded-full text-xs">
                    <span className="mr-1">{reactionIcons[type]}</span>
                    {count}
                  </span>
                ))}
            </div>
          </div>
          
          {showComments && (
            <div className="mt-4">
              <CommentSection postId={post.id} />
            </div>
          )}
        </div>
      </div>

      {/* Edit Post Modal */}
      {isEditing && (
        <EditPostModal 
          post={post}
          onClose={() => setIsEditing(false)}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
};

export default PostCard;