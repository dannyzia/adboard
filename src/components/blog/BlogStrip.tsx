import React from 'react';
import { Link } from 'react-router-dom';

type BlogItem = {
  id?: string;
  title: string;
  href?: string;
};

type Props = {
  previous?: BlogItem;
  current?: BlogItem;
  future?: BlogItem;
};

export const BlogStrip: React.FC<Props> = ({ previous, current, future }) => {
  const item = (b?: BlogItem) => (
    <div className="flex-1">
      {b ? (
        <Link to={b.href || '#'} className="block text-sm font-medium text-gray-800 hover:underline">
          {b.title}
        </Link>
      ) : (
        <div className="text-sm text-gray-400">—</div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 mb-4">
      <div className="flex items-center gap-6">
        <div className="w-1/3">
          <div className="text-xs text-gray-500 uppercase">Previous</div>
          {item(previous)}
        </div>
        <div className="w-1/3">
          <div className="text-xs text-gray-500 uppercase">Current</div>
          {item(current)}
        </div>
        <div className="w-1/3">
          <div className="text-xs text-gray-500 uppercase">Future</div>
          {item(future)}
        </div>
      </div>
    </div>
  );
};

export default BlogStrip;
