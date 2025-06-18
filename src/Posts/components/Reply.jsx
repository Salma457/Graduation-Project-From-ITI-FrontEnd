import { useState } from 'react';

const Reply = ({ reply, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(reply.content);

  const handleUpdate = async () => {
    try {
      await onUpdate(reply.id, editText);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating reply:', error);
    }
  };

  return (
    <div className="ml-6 pl-4 border-l-2 border-gray-200 mt-3">
      <div className="bg-gray-50 p-3 rounded-lg">
        {isEditing ? (
          <div className="flex mb-2">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="flex-1 border border-gray-300 rounded-l-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              onClick={handleUpdate}
              className="bg-green-600 text-white px-3 py-1 rounded-r-lg hover:bg-green-700 transition-colors"
            >
              Save
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start">
              <div>
<h4 className="font-medium text-gray-900">{reply.user?.name || 'Unknown User'}</h4>
                <p className="text-gray-600 mt-1">{reply.content}</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => {
                    setIsEditing(true);
                    setEditText(reply.content);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button 
                  onClick={() => onDelete(reply.id)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {new Date(reply.created_at).toLocaleString()}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Reply;