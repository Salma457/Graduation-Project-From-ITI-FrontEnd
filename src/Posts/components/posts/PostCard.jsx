import { useState } from 'react';
import { reactToPost, removeReaction } from '../../services/api';
import ReactionPicker from './ReactionPicker';
import CommentSection from './CommentSection';

const reactionIcons = {
  like: '👍',
  love: '❤️',
  haha: '😂',
  wow: '😮',
  sad: '😢',
  angry: '😠',
  support: '💪'
};

const PostCard = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const [reactions, setReactions] = useState(post.reactions || {});
  const [userReaction, setUserReaction] = useState(post.user_reaction);
  const [showReactionPicker, setShowReactionPicker] = useState(false);

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
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg">
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
                className="rounded-lg max-h-64 object-cover"
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
                  className="flex items-center space-x-1 text-gray-500 hover:text-red-500"
                >
                  {userReaction ? (
                    <span className="text-lg">{reactionIcons[userReaction]}</span>
                  ) : (
                    <span>React</span>
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
                className="flex items-center space-x-1 text-gray-500 hover:text-red-500"
              >
                <span>Comment</span>
              </button>
            </div>
            
            <div className="flex space-x-1">
              {Object.entries(reactions)
                // .filter(([_, count]) => count > 0)
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
    </div>
  );
};

export default PostCard;