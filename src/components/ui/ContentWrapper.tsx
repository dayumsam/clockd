// components/ui/ContentWrapper.tsx
import React from 'react';

interface ContentWrapperProps {
  children: React.ReactNode;
}

const ContentWrapper: React.FC<ContentWrapperProps> = ({ children }) => {
  return (
    // Add padding to account for the fixed header
    <div className="pt-16">
      {children}
    </div>
  );
};

export default ContentWrapper;