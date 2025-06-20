import { useState, useRef, useEffect } from 'react';
import { createPost } from '../../services/api';
import {  AnimatePresence } from 'framer-motion';

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
  const [postData, setPostData] = useState({ title: '', content: '', image: null });
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPostData({ ...postData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newPost = await createPost(postData);
      onPostCreated(newPost);
      setShowSuccess(true);
      setTimeout(() => {
        setPostData({ title: '', content: '', image: null });
        setPreview(null);
        setShowSuccess(false);
        onClose();
      }, 1500); // Close after 1.5s
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white bg-opacity-80 shadow-md hover:bg-gray-100 transition-all"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6">
              <h2 className="text-2xl font-bold text-white">Create New Post</h2>
              <p className="text-red-100 mt-1">Share your thoughts with the community</p>
            </div>

            <div className="p-6 overflow-y-auto flex-grow">
              {showSuccess ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-green-600 text-lg font-semibold text-center"
                >
                  🎉 Post created successfully!
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Title */}
                  <div className="mb-6">
                    <input
                      type="text"
                      placeholder="Title"
                      value={postData.title}
                      onChange={(e) => setPostData({ ...postData, title: e.target.value })}
                      className="w-full border-0 border-b-2 border-gray-200 focus:border-red-500 focus:ring-0 px-0 py-3 text-lg font-medium transition-all"
                      required
                    />
                  </div>

                  {/* Content */}
                  <div className="mb-6">
                    <textarea
                      placeholder="What's on your mind?"
                      rows="4"
                      value={postData.content}
                      onChange={(e) => setPostData({ ...postData, content: e.target.value })}
                      className="w-full border-0 border-b-2 border-gray-200 focus:border-red-500 focus:ring-0 px-0 py-3 resize-none transition-all"
                      required
                    />
                  </div>

                  {/* Image */}
                  <div className="mb-8">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="flex items-center justify-center w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-red-400 transition-all"
                    >
                      📷 <span className="ml-2 text-gray-600 font-medium">Add Image</span>
                    </button>

                    {preview && (
                      <div className="mt-4 relative group">
                        <img src={preview} alt="Preview" className="rounded-lg w-full object-cover max-h-64" />
                        <button
                          type="button"
                          onClick={() => {
                            setPreview(null);
                            setPostData({ ...postData, image: null });
                          }}
                          className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✖
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-70 transition-all font-medium flex items-center justify-center min-w-24"
                    >
                      {isSubmitting ? 'Posting...' : 'Post'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreatePostModal;
