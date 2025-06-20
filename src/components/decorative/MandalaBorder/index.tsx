// src/components/decorative/MandalaBorder/index.tsx
import React from 'react';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { View } from 'react-native';
import { MandalaBorderProps } from './types';
import styles from './styles';

const MandalaBorder: React.FC<MandalaBorderProps> = ({
  color = "#5d0e0f",
  size = 300,
  strokeWidth = 0.5,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {/* Base Circle */}
        <Circle 
          cx="50" 
          cy="50" 
          r="48" 
          fill="none" 
          stroke={color} 
          strokeWidth={strokeWidth} 
        />
        
        {/* Main Petals */}
        <G fill={color}>
          {[...Array(8)].map((_, i) => (
            <Path
              key={`main-petal-${i}`}
              d="M50,10 Q55,15 50,20 Q45,15 50,10"
              transform={`rotate(${i * 45},50,50)`}
            />
          ))}
        </G>
        
        {/* Secondary Decoration */}
        <G stroke={color} strokeWidth={strokeWidth}>
          {[...Array(24)].map((_, i) => (
            <Circle
              key={`dot-${i}`}
              cx={50 + 40 * Math.cos((i * 15 * Math.PI) / 180)}
              cy={50 + 40 * Math.sin((i * 15 * Math.PI) / 180)}
              r={0.8}
              fill={color}
            />
          ))}
          
          {/* Inner detailing */}
          <Circle cx="50" cy="50" r="35" fill="none" />
          <Circle cx="50" cy="50" r="25" fill="none" />
        </G>
        
        {/* Center Flower */}
        <G fill={color}>
          <Circle cx="50" cy="50" r="3" />
          {[...Array(12)].map((_, i) => (
            <Path
              key={`center-petal-${i}`}
              d="M50,45 Q52,47 50,49 Q48,47 50,45"
              transform={`rotate(${i * 30},50,50)`}
            />
          ))}
        </G>
      </Svg>
    </View>
  );
};

export default MandalaBorder;