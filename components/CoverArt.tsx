import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Defs, Pattern, Rect, Line } from 'react-native-svg';
import { Song } from '../constants/songs';

interface Props {
  song: Song;
  size?: number;
  rounded?: number;
}

export function CoverArt({ song, size = 64, rounded = 8 }: Props) {
  const initials = song.title.split(' ').slice(0, 2).map((w) => w[0]).join('');
  const stripeGap = size > 120 ? 18 : 10;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: rounded,
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* Gradient background */}
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          backgroundColor: song.gradient[0],
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          backgroundColor: song.gradient[1],
          opacity: 0.7,
        }}
      />
      {/* Stripe overlay */}
      <Svg
        width={size}
        height={size}
        style={{ position: 'absolute', opacity: 0.18 }}
      >
        <Defs>
          <Pattern
            id={`stripe-${song.id}-${size}`}
            width={stripeGap}
            height={stripeGap}
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <Line x1="0" y1="0" x2="0" y2={stripeGap} stroke="#fff" strokeWidth="1" />
          </Pattern>
        </Defs>
        <Rect
          width={size}
          height={size}
          fill={`url(#stripe-${song.id}-${size})`}
        />
      </Svg>
      {/* Initials */}
      {size >= 80 && (
        <Text
          style={{
            position: 'absolute',
            left: 10,
            bottom: 6,
            fontSize: Math.round(size * 0.28),
            fontWeight: '600',
            color: '#fff',
            letterSpacing: -1,
            lineHeight: size * 0.32,
          }}
        >
          {initials}
        </Text>
      )}
    </View>
  );
}
