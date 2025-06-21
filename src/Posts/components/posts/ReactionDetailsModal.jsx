import React from 'react';

const ReactionDetailsModal = ({ data, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 shadow-lg max-h-[80vh] overflow-y-auto relative">
        <h3 className="text-lg font-semibold mb-4">Reactions</h3>
        <button onClick={onClose} className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl">×</button>

        {Object.keys(data).map((type) => (
          <div key={type} className="mb-4">
            <h4 className="font-medium text-gray-700 capitalize mb-2">{type}</h4>
            <ul className="space-y-2">
              {data[type].map((user) => (
                <li key={user.id} className="flex items-center space-x-3">
                  <img
                    src={`http://localhost:8000/storage/${user.avatar}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span>{user.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReactionDetailsModal;
