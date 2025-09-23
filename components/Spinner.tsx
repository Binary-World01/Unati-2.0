import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="w-16 h-16 relative">
      <div className="absolute inset-0 border-4 border-slate-600 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-t-cyan-500 border-l-cyan-500 border-b-transparent border-r-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;