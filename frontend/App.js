import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

// This is the main component for our frontend application.
// It fetches posts from the backend and handles user interactions.
export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // The backend server is expected to be running on localhost:3000
  const API_URL = 'http://localhost:3000';

  // Function to fetch posts from the backend API.
  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/posts`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPosts(data);
    } catch (e) {
      console.error("Failed to fetch posts:", e);
      setError("Failed to load posts. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle the "Like" action.
  const handleLike = async (postId) => {
    try {
      // Send a POST request to the backend to send a satoshi.
      const response = await fetch(`${API_URL}/sats/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to send satoshi.');
      }

      // If the payment is successful, re-fetch the posts to update the UI.
      await fetchPosts();

      console.log(`Successfully sent satoshi to post ${postId}`);
    } catch (e) {
      console.error("Failed to like post:", e);
      alert("Failed to send satoshi. Please check the backend logs.");
    }
  };

  // Fetch posts when the component mounts.
  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p className="text-xl">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-400 p-4">
        <p className="text-xl text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-yellow-400">
          Sats-Social
        </h1>

        <div className="grid gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-yellow-500 transition-colors"
            >
              <h2 className="text-2xl font-semibold mb-2 text-yellow-300">{post.title}</h2>
              <p className="text-gray-300 mb-4">{post.content}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-yellow-400">
                  <Heart fill="currentColor" size={24} />
                  <span className="text-xl font-medium">
                    {post.sats_received} Sats
                  </span>
                </div>
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center px-6 py-2 bg-yellow-500 text-gray-900 font-bold rounded-full shadow-md hover:bg-yellow-400 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-50"
                >
                  <Heart className="mr-2" size={18} />
                  Like
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
