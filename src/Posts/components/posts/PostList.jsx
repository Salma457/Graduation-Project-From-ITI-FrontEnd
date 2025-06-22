import { useEffect, useState, useRef, useCallback } from 'react';
import { fetchPosts, fetchMyPosts } from '../../services/api';
import PostCard from './PostCard';
import CreatePostModal from './CreatePostModal';
import FilterPosts from './FilterPosts';
import { useSelector, useDispatch } from 'react-redux';
import { fetchItianProfile } from '../../store/itianSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ItianSidebarProfile from './ItianSidebarProfile.jsx';

const PostList = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.itian.user);

  useEffect(() => {
    if (!user) {
      dispatch(fetchItianProfile());
    }
  }, [user, dispatch]);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    sort: 'newest',
    search: '',
    reactions: []
  });

  const observer = useRef();

  const loadPosts = useCallback(async (reset = false, pageNumber = 1) => {
    try {
      setLoading(true);
      const params = {
        page: pageNumber,
        sort: filters.sort,
        search: filters.search,
        reactions: filters.reactions.join(',')
      };

      const data = activeTab === 'all'
        ? await fetchPosts(params)
        : await fetchMyPosts(params);

      const postsArray = Array.isArray(data.data) ? data.data : [];

      if (reset) {
        setPosts(postsArray);
      } else {
        setPosts(prev => [...prev, ...postsArray]);
      }

      setHasMore(data.current_page < data.last_page);
    } catch (err) {
      setError('Failed to load posts. Please try again later.');
      console.error('Error fetching posts:', err);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [activeTab, filters]);

  // تحميل أول مرة أو بعد تغيير الفلاتر أو التاب
  useEffect(() => {
    setPage(1);
    loadPosts(true, 1);
  }, [filters, activeTab, loadPosts]);

  // تحميل الصفحات التالية
  useEffect(() => {
    if (page === 1) return;
    loadPosts(false, page);
  }, [page, loadPosts]);

  const lastPostRef = useCallback(node => {
    if (loading || !hasMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prev => prev + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
    setIsModalOpen(false);
    toast.success('✅ Post created successfully!');
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handleUpdatePost = (updatedPost) => {
    setPosts(posts.map(post =>
      post.id === updatedPost.id ? updatedPost : post
    ));
    toast.success('✅ Post updated successfully!');
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  

 return (
  <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 relative">
    <div className={`max-w-6xl mx-auto transition-all duration-300 ${isModalOpen ? 'blur-md pointer-events-none scale-[0.98] opacity-80' : ''}`}>
      
      {/* التخطيط: Sidebar + Posts */}
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Sidebar */}
        <div className="md:w-1/3">
  <div className="sticky top-6">
    {user && <ItianSidebarProfile profile={user} />}
  </div>
</div>


        {/* Posts */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'all' ? 'bg-red-500 text-white shadow-md' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                All Posts
              </button>
              <button
                onClick={() => setActiveTab('my')}
                className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'my' ? 'bg-red-500 text-white shadow-md' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                My Posts
              </button>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <FilterPosts
                filters={filters}
                onChange={handleFilterChange}
              />

              {user && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center shadow-md transition-all whitespace-nowrap"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Post
                </button>
              )}
            </div>
          </div>

          {/* Posts Rendering */}
          {loading && page === 1 ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
          ) : error ? (
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={() => {
                  setPage(1);
                  loadPosts(true, 1);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              No posts found.
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post, index) => (
                <div
                  key={post.id}
                  ref={index === posts.length - 1 ? lastPostRef : null}
                >
                  <PostCard
                    post={post}
                    onDelete={handleDeletePost}
                    onUpdate={handleUpdatePost}
                  />
                </div>
              ))}

              {loading && page > 1 && (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
                </div>
              )}

              {!hasMore && (
                <div className="text-center py-4 text-gray-500">
                  No more posts to load
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>

    <CreatePostModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onPostCreated={handlePostCreated}
    />

    <ToastContainer position="top-center" autoClose={2000} />
  </div>
);

};

export default PostList;
