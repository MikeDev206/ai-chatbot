import React from 'react';

interface CapitalLettersProps {
  text: string;
}

const CapitalLetters: React.FC<CapitalLettersProps> = ({ text }) => {
  const renderText = () => {
    return text.split('').map((char, index) => {
      const isCapital = char.match(/[A-Z]/);
      return (
        <span
          key={index}
          style={isCapital ? { fontFamily: 'Waltograph, cursive' } : undefined}
        >
          {char}
        </span>
      );
    });
  };

  return <>{renderText()}</>;
};

export default CapitalLetters; 