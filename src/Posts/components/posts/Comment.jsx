import { useState } from 'react';
import { addReply } from '../../services/api';

const Comment = ({ comment, postId }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return;

    try {
      await addReply(postId, comment.id, replyContent);
      setReplyContent('');
      setShowReplyForm(false);
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg my-2">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {comment.user.profile_picture ? (
              <img
                src={`http://localhost:8000/storage/${comment.user.profile_picture}`}
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-red-200 to-red-300 flex items-center justify-center text-red-600 font-bold">
                {comment.user.first_name?.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900">
              {comment.user.first_name} {comment.user.last_name}
            </h4>
            <p className="text-sm text-gray-600 mt-1">{comment.content}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(comment.created_at).toLocaleString()}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          Reply
        </button>
      </div>

      {showReplyForm && (
        <div className="mt-3 ml-10 flex">
          <input
            type="text"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            className="flex-1 border border-gray-300 rounded-l px-3 py-1 text-sm"
          />
          <button
            onClick={handleReplySubmit}
            className="bg-red-500 text-white px-3 py-1 rounded-r text-sm"
          >
            Post
          </button>
        </div>
      )}

      {/* Replies */}
      {comment.replies?.length > 0 && (
        <div className="mt-3 ml-10 pl-4 border-l-2 border-gray-200 space-y-3">
          {comment.replies.map(reply => (
            <div key={reply.id} className="bg-gray-100 p-3 rounded">
              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0">
                  {reply.user.profile_picture ? (
                    <img
                      src={`http://localhost:8000/storage/${reply.user.profile_picture}`}
                      alt="Profile"
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-gradient-to-r from-red-200 to-red-300 flex items-center justify-center text-red-600 text-xs">
                      {reply.user.first_name?.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h5 className="text-xs font-medium text-gray-900">
                    {reply.user.first_name} {reply.user.last_name}
                  </h5>
                  <p className="text-xs text-gray-600">{reply.content}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(reply.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
