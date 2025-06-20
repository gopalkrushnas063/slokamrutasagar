// src/components/decorative/RectangularMandalaBorder/index.tsx
import React from 'react';
import Svg, { Path, Rect, G, Circle } from 'react-native-svg';
import { View } from 'react-native';
import styles from '@/src/components/decorative/RectangularMandalaBorder/styles';

interface RectangularMandalaBorderProps {
  width: number;
  height: number;
  color?: string;
  strokeWidth?: number;
  cornerRadius?: number;
}

const RectangularMandalaBorder: React.FC<RectangularMandalaBorderProps> = ({
  width,
  height,
  color = "#d19a9c",
  strokeWidth = 1,
  cornerRadius = 8,
}) => {
  // Calculate positions for patterns
  const patternSpacing = 20;
  const cornerSize = 30;
  
  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height}>
        {/* Main rectangle with rounded corners */}
        <Rect
          x={strokeWidth/2}
          y={strokeWidth/2}
          width={width - strokeWidth}
          height={height - strokeWidth}
          rx={cornerRadius}
          ry={cornerRadius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
        />
        
        {/* Corner Mandalas */}
        {/* Top Left */}
        <G transform={`translate(${cornerSize/2}, ${cornerSize/2})`}>
          <CornerMandala color={color} size={cornerSize} />
        </G>
        
        {/* Top Right */}
        <G transform={`translate(${width - cornerSize/2}, ${cornerSize/2}) rotate(90)`}>
          <CornerMandala color={color} size={cornerSize} />
        </G>
        
        {/* Bottom Right */}
        <G transform={`translate(${width - cornerSize/2}, ${height - cornerSize/2}) rotate(180)`}>
          <CornerMandala color={color} size={cornerSize} />
        </G>
        
        {/* Bottom Left */}
        <G transform={`translate(${cornerSize/2}, ${height - cornerSize/2}) rotate(270)`}>
          <CornerMandala color={color} size={cornerSize} />
        </G>
        
        {/* Side Patterns */}
        {/* Top */}
        {Array.from({ length: Math.floor((width - cornerSize * 2) / patternSpacing) }).map((_, i) => (
          <G key={`top-${i}`} transform={`translate(${cornerSize + i * patternSpacing}, 0)`}>
            <SidePattern color={color} size={patternSpacing} />
          </G>
        ))}
        
        {/* Right */}
        {Array.from({ length: Math.floor((height - cornerSize * 2) / patternSpacing) }).map((_, i) => (
          <G key={`right-${i}`} transform={`translate(${width}, ${cornerSize + i * patternSpacing}) rotate(90)`}>
            <SidePattern color={color} size={patternSpacing} />
          </G>
        ))}
        
        {/* Bottom */}
        {Array.from({ length: Math.floor((width - cornerSize * 2) / patternSpacing) }).map((_, i) => (
          <G key={`bottom-${i}`} transform={`translate(${width - cornerSize - i * patternSpacing}, ${height}) rotate(180)`}>
            <SidePattern color={color} size={patternSpacing} />
          </G>
        ))}
        
        {/* Left */}
        {Array.from({ length: Math.floor((height - cornerSize * 2) / patternSpacing) }).map((_, i) => (
          <G key={`left-${i}`} transform={`translate(0, ${height - cornerSize - i * patternSpacing}) rotate(270)`}>
            <SidePattern color={color} size={patternSpacing} />
          </G>
        ))}
      </Svg>
    </View>
  );
};

// Corner Mandala Component
const CornerMandala = ({ color, size }: { color: string; size: number }) => {
  return (
    <G>
      <Circle cx={0} cy={0} r={size/4} fill="none" stroke={color} strokeWidth={1} />
      {[...Array(8)].map((_, i) => (
        <Path
          key={`corner-petal-${i}`}
          d={`M0,0 L${size/3},${size/3} Q${size/4},${size/4} 0,0`}
          transform={`rotate(${i * 45})`}
          fill="none"
          stroke={color}
          strokeWidth={0.8}
        />
      ))}
    </G>
  );
};

// Side Pattern Component
const SidePattern = ({ color, size }: { color: string; size: number }) => {
  return (
    <G>
      <Path
        d={`M0,0 Q${size/2},${size/2} ${size},0`}
        fill="none"
        stroke={color}
        strokeWidth={0.8}
      />
      <Circle cx={size/2} cy={size/4} r={1.5} fill={color} />
    </G>
  );
};

export default RectangularMandalaBorder;