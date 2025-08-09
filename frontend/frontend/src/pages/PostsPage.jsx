import React from 'react';
import Post from '../components/Post';

export default function PostsPage({ posts, onLike, onFollow, followRequiredPostId, following }) {
  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <Post
          key={post.id}
          post={post}
          onLike={onLike}
          onFollow={onFollow}
          followRequired={post.id === followRequiredPostId}
          following={following}
        />
      ))}
    </div>
  );
}
