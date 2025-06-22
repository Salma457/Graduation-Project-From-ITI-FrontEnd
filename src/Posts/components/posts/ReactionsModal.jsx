import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchReactionDetails } from '../../services/api';

const ReactionsModal = ({ postId, onClose }) => {
  const [reactions, setReactions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const loadReactions = async () => {
      setIsLoading(true);
      try {
        const data = await fetchReactionDetails(postId);
        setReactions(data);
      } catch (error) {
        console.error('Error loading reactions:', error);
        // toast.error('Failed to load reactions');
      } finally {
        setIsLoading(false);
      }
    };

    loadReactions();
  }, [postId]);

  // Group all reactors together for the "All" tab
  const allReactors = reactions ? Object.values(reactions).flat() : [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 20, scale: 0.95 }}
          animate={{ y: 0, scale: 1 }}
          exit={{ y: 20, scale: 0.95 }}
          className="relative bg-white rounded-xl shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="border-b border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-center">Reactions</h3>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Reaction Tabs */}
          <div className="border-b border-gray-200 flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-3 font-medium text-sm flex-1 min-w-max ${activeTab === 'all' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
            >
              All {allReactors.length}
            </button>
            
            {reactions && Object.entries(reactions).map(([type, reactors]) => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`px-4 py-3 font-medium text-sm flex items-center space-x-1 min-w-max ${activeTab === type ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
              >
                <span>{getReactionIcon(type)}</span>
                <span>{type.charAt(0).toUpperCase() + type.slice(1)} {reactors.length}</span>
              </button>
            ))}
          </div>

          {/* Reactors List */}
          <div className="overflow-y-auto flex-1">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {(activeTab === 'all' ? allReactors : reactions?.[activeTab] || []).map((user) => (
                  <div key={user.id} className="p-4 flex items-center space-x-3 hover:bg-gray-50">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {user.avatar ? (
                        <img 
                          src={`http://localhost:8000/storage/${user.avatar}`} 
                          alt={user.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-600 font-medium">
                          {user.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Helper function to get reaction icons
const getReactionIcon = (type) => {
  const icons = {
    like: '👍',
    love: '❤️',
    haha: '😂',
    wow: '😮',
    sad: '😢',
    angry: '😠',
    support: '💪'
  };
  return icons[type] || '👍';
};

export default ReactionsModal;