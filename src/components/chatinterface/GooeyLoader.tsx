import React from 'react';

interface GooeyLoaderProps {
  color?: string;
  size?: number;
}

const GooeyLoader: React.FC<GooeyLoaderProps> = ({ 
  color = "#40599f",
  size = 48
}) => {
  // Generate unique IDs for animations to prevent conflicts with multiple instances
  const firstAnimId = React.useId();
  const lastAnimId = React.useId();

  return (
    <div className="gooey-loader" style={{ width: size, height: size }}>
      <svg 
        fill={color}
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
      >
        <circle cx="4" cy="12" r="3">
          <animate 
            id={`spinner_${firstAnimId}`}
            begin={`0;spinner_${lastAnimId}.end+0.25s`}
            attributeName="cy" 
            calcMode="spline" 
            dur="0.6s" 
            values="12;6;12" 
            keySplines=".33,.66,.66,1;.33,0,.66,.33"
          />
        </circle>
        <circle cx="12" cy="12" r="3">
          <animate 
            begin={`spinner_${firstAnimId}.begin+0.1s`}
            attributeName="cy" 
            calcMode="spline" 
            dur="0.6s" 
            values="12;6;12" 
            keySplines=".33,.66,.66,1;.33,0,.66,.33"
          />
        </circle>
        <circle cx="20" cy="12" r="3">
          <animate 
            id={`spinner_${lastAnimId}`}
            begin={`spinner_${firstAnimId}.begin+0.2s`}
            attributeName="cy" 
            calcMode="spline" 
            dur="0.6s" 
            values="12;6;12" 
            keySplines=".33,.66,.66,1;.33,0,.66,.33"
          />
        </circle>
      </svg>
    </div>
  );
};

export default GooeyLoader; 