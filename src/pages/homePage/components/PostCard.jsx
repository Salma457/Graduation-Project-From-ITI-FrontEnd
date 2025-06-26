import { MessageCircle, Heart, Share2, Calendar, User } from "lucide-react"

export default function PostCard({ post }) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
          {post.user?.avatar ? (
            <img 
              src={post.user.avatar} 
              alt={post.user.name} 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-red-600" />
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{post.user?.name || "Anonymous"}</h4>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg text-gray-900 mb-2">{post.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-3">{post.content}</p>
        </div>

        {post.image && (
          <div className="rounded-lg overflow-hidden">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.src = '/placeholder.svg'
              }}
            />
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <button className="flex items-center text-sm text-gray-500 hover:text-red-600">
              <Heart className="w-4 h-4 mr-1" />
              <span>{post.reactions_count || 0}</span>
            </button>
            <button className="flex items-center text-sm text-gray-500 hover:text-red-600">
              <MessageCircle className="w-4 h-4 mr-1" />
              <span>{post.comments_count || 0}</span>
            </button>
          </div>
          <button className="text-sm text-gray-500 hover:text-red-600">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}