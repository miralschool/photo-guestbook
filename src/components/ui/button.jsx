import React from 'react';

export function Button({ children, ...props }) {
  return (
    <button
      {...props}
      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
    >
      {children}
    </button>
  );
}
