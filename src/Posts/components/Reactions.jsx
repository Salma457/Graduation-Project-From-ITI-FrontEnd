import { useState, useEffect } from 'react';
import { reactToPost, removeReaction, getPostReactions } from '../services/api.js';

const Reactions = ({ postId, initialReactions = {} }) => {
  const [reactions, setReactions] = useState(initialReactions);
  const [userReaction, setUserReaction] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadReactions = async () => {
      try {
        setLoading(true);
        const data = await getPostReactions(postId);
        setReactions(data.reactions);
        setUserReaction(data.user_reaction); // ✅ إصلاح هنا
      } catch (error) {
        console.error('Error loading reactions:', error);
      } finally {
        setLoading(false);
      }
    };
    loadReactions();
  }, [postId]);

  const handleReact = async (reactionType) => {
    try {
      setLoading(true);
      if (userReaction === reactionType) {
        await removeReaction(postId);
        setUserReaction(null);
        setReactions(prev => ({
          ...prev,
          [reactionType]: (prev[reactionType] || 1) - 1
        }));
      } else {
        if (userReaction) {
          await removeReaction(postId);
          setReactions(prev => ({
            ...prev,
            [userReaction]: (prev[userReaction] || 1) - 1
          }));
        }

        await reactToPost(postId, reactionType);
        setUserReaction(reactionType);
        setReactions(prev => ({
          ...prev,
          [reactionType]: (prev[reactionType] || 0) + 1
        }));
      }
    } catch (error) {
      console.error('Error reacting to post:', error);
    } finally {
      setLoading(false);
    }
  };

  const reactionTypes = [
    { type: 'like', icon: '👍', label: 'Like' },
    { type: 'love', icon: '❤️', label: 'Love' },
    { type: 'haha', icon: '😂', label: 'Haha' },
    { type: 'sad', icon: '😢', label: 'Sad' },
    { type: 'angry', icon: '😠', label: 'Angry' },
    { type: 'support', icon: '🤝', label: 'Support' }
  ];

  return (
    <div className="flex items-center space-x-4 mt-2">
      {reactionTypes.map(({ type, icon }) => (
        <button
          key={type}
          onClick={() => handleReact(type)}
          disabled={loading}
          className={`flex items-center space-x-1 px-2 py-1 rounded-full transition-all 
            ${userReaction === type ? 
              'bg-red-100 text-red-600' : 
              'hover:bg-gray-100 text-gray-600'}
          `}
        >
          <span className="text-lg">{icon}</span>
          <span className="text-sm font-medium">{reactions[type] || 0}</span>
        </button>
      ))}
    </div>
  );
};

export default Reactions;
