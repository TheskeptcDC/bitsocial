import React from 'react';
import {
  HeartIcon,
  PlusIcon,
  BoltIcon
} from '@heroicons/react/24/solid';

export default function Post({ post, onLike, onFollow, followRequired, following }) {
  const getButtonText = () => {
    if (followRequired) return 'Follow Creator to Tip';
    if (following) return 'Tip Creator';
    return 'Tip Post';
  };

  const getButtonAction = () => {
    if (followRequired) return () => onFollow(post.creatorPublicKey);
    return () => onLike(post.id, post.creatorPublicKey);
  }

  return (
    <div className="bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-700 transition-all duration-300 hover:scale-[1.01]">
      <h3 className="text-xl font-bold text-yellow-400 mb-2">{post.title}</h3>
      <p className="text-gray-300 font-light mb-4 leading-relaxed">{post.content}</p>
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700">
        <span style={{ color: '#facc15', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          <BoltIcon style={{ width: '20px', height: '20px', color: '#facc15', marginRight: '8px' }} />
          {post.sats_received} sats received
        </span>
        <button
          style={{
            padding: '8px 24px',
            borderRadius: '9999px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            background: followRequired ? '#4f46e5' : '#facc15',
            color: followRequired ? '#fff' : '#1f2937',
            boxShadow: followRequired ? '0 2px 8px #6366f1' : '0 2px 8px #facc15',
            outline: 'none',
            border: 'none',
            cursor: 'pointer',
            marginLeft: '8px'
          }}
          onClick={getButtonAction()}
        >
          {followRequired ? (
            <PlusIcon style={{ width: '20px', height: '20px', marginRight: '8px', color: '#facc15' }} />
          ) : (
            <HeartIcon style={{ width: '20px', height: '20px', marginRight: '8px', color: '#f87171' }} />
          )}
          {getButtonText()}
        </button>
      </div>
    </div>
  );
}
