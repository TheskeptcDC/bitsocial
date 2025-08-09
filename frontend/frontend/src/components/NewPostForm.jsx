import React from 'react';

export default function NewPostForm({ newPost, setNewPost, handleNewPostSubmit }) {
  return (
    <div className="new-post-form-container">
      <h2 className="new-post-form-title">Create a New Post</h2>
      <form onSubmit={handleNewPostSubmit} className="new-post-form">
        <input
          type="text"
          placeholder="Post Title"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          className="new-post-input"
        />
        <textarea
          placeholder="Post Content"
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          className="new-post-textarea"
          rows="5"
        ></textarea>
        <button type="submit" className="new-post-button">
          Publish Post
        </button>
      </form>
    </div>
  );
}
