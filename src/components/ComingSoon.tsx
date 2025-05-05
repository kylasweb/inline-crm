
import React from 'react';

interface ComingSoonProps {
  name: string;
}

const ComingSoon = ({ name }: ComingSoonProps) => (
  <div className="flex flex-col items-center justify-center h-[70vh]">
    <div className="neo-flat h-24 w-24 rounded-full flex items-center justify-center mb-6">
      <div className="neo-pressed h-16 w-16 rounded-full flex items-center justify-center">
        <div className="text-neo-primary text-2xl font-bold">!</div>
      </div>
    </div>
    <h2 className="text-xl font-bold mb-2">{name}</h2>
    <p className="text-neo-text-secondary mb-6">This module is coming soon!</p>
    <p className="text-center max-w-md text-sm">
      We're currently working on implementing this feature. 
      Please check back later or explore the Dashboard, Lead Management, Opportunities, and Tickets modules which are already available.
    </p>
  </div>
);

export default ComingSoon;
