// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { toast } from 'react-toastify';
// // import { deletePost } from '../../services/api';

// const DeleteConfirmationModal = ({ postId, onClose, onConfirm }) => {
//   const [isDeleting, setIsDeleting] = useState(false);

//   const handleDelete = async () => {
//     try {
//       setIsDeleting(true);
//       await onConfirm(postId);
//       onClose();
//     } catch (error) {
//       console.error('Error deleting post:', error);
//       toast.error('Failed to delete post');
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   return (
//     <AnimatePresence>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         className="fixed inset-0 z-50 flex items-center justify-center p-4"
//       >
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="absolute inset-0 bg-black/30 backdrop-blur-sm"
//           onClick={onClose}
//         />
        
//         <motion.div
//           initial={{ scale: 0.9, opacity: 0, y: 20 }}
//           animate={{ scale: 1, opacity: 1, y: 0 }}
//           exit={{ scale: 0.9, opacity: 0, y: 20 }}
//           transition={{ type: 'spring', stiffness: 400, damping: 25 }}
//           className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-gray-200 z-10"
//         >
//           <div className="text-center space-y-5">
//             <motion.div 
//               animate={{ 
//                 rotate: [0, 10, -10, 0],
//                 scale: [1, 1.1, 1]
//               }}
//               transition={{ duration: 0.6 }}
//               className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-50"
//             >
//               <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//               </svg>
//             </motion.div>
            
//             <div>
//               <h3 className="text-xl font-bold text-gray-800 mb-1">Delete this post?</h3>
//               <p className="text-gray-500">This action cannot be undone.</p>
//             </div>

//             <div className="flex justify-center space-x-4 pt-2">
//               <motion.button
//                 whileHover={{ scale: 1.03, backgroundColor: "#f3f4f6" }}
//                 whileTap={{ scale: 0.97 }}
//                 onClick={onClose}
//                 className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all font-medium"
//               >
//                 Cancel
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.03, backgroundColor: "#dc2626" }}
//                 whileTap={{ scale: 0.97 }}
//                 onClick={handleDelete}
//                 className="px-5 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all font-medium flex items-center justify-center min-w-[120px]"
//                 disabled={isDeleting}
//               >
//                 {isDeleting ? (
//                   <>
//                     <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Deleting...
//                   </>
//                 ) : (
//                   'Delete'
//                 )}
//               </motion.button>
//             </div>
//           </div>
//         </motion.div>
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// export default DeleteConfirmationModal;