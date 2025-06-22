import { useEffect, useState } from 'react';
import { fetchPosts } from '../services/api';
import Reactions from './Reactions';
import Comments from './Comments';

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPostId, setExpandedPostId] = useState(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data);
      } catch (err) {
        setError('Failed to load posts. Please try again later.');
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  const toggleComments = (postId) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-red-50 to-white">
      <div className="animate-pulse-slow flex flex-col items-center">
        <div className="h-16 w-16 bg-red-400 rounded-full mb-4"></div>
        <div className="h-4 w-32 bg-red-300 rounded mb-2"></div>
        <div className="h-4 w-48 bg-red-200 rounded"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-red-50 to-white">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center animate-fade-in">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg shadow hover:shadow-lg transition-all duration-300"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
         <h1 className="text-4xl font-extrabold sm:text-5xl sm:tracking-tight lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700">
  Latest Posts
</h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Discover the most recent updates from our community
          </p>
        </div>

        <div className="space-y-8">
          {posts.map((post) => (
            <article 
              key={post.id} 
              className="post-card bg-white rounded-xl shadow-md overflow-hidden animate-fade-in"
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    {post.itian?.profile_picture ? (
                      <img
                        src={`http://localhost:8000/storage/${post.itian.profile_picture}`}
                        alt="Profile"
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-red-200 to-red-300 flex items-center justify-center text-red-600 font-bold">
                        {post.itian?.first_name?.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {post.itian?.first_name} {post.itian?.last_name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>

                    <div className="flex space-x-2 mt-1">
                      {post.itian?.linkedin_profile_url && (
                        <a
                          href={post.itian.linkedin_profile_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-xs underline"
                        >
                          LinkedIn
                        </a>
                      )}
                      {post.itian?.github_profile_url && (
                        <a
                          href={post.itian.github_profile_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-800 hover:text-black text-xs underline"
                        >
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                  {post.title}
                </h2>
                
                <p className="text-gray-600 mb-6">
                  {post.content}
                </p>
                
                <Reactions postId={post.id} initialReactions={post.reactions} />
                
                <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-4">
                  <button 
                    onClick={() => toggleComments(post.id)}
                    className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {post.comments_count} Comments
                  </button>
                </div>
                
                {expandedPostId === post.id && (
                  <Comments postId={post.id} />
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostsList;
