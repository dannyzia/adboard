import React, { useState } from 'react';

interface Props {
  isOpen: boolean;
  title?: string;
  placeholder?: string;
  onCancel: () => void;
  onSubmit: (value: string) => void;
}

export const InputDialog: React.FC<Props> = ({ isOpen, title, placeholder, onCancel, onSubmit }) => {
  const [value, setValue] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 h-28 mb-4"
        />
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50">Cancel</button>
          <button onClick={() => onSubmit(value)} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Submit</button>
        </div>
      </div>
    </div>
  );
};
