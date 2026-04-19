import React from 'react';
import Svg, { Line, Rect, Circle, Text as SvgText } from 'react-native-svg';
import { CHORD_SHAPES } from '../constants/songs';
import { Theme } from '../constants/theme';

interface Props {
  name: string;
  size?: number;
  theme: Theme;
  showName?: boolean;
}

export function ChordDiagram({ name, size = 1, theme, showName = true }: Props) {
  const shape = CHORD_SHAPES[name];
  if (!shape) return null;

  const w = 78 * size, h = 90 * size;
  const left = 10 * size, top = 14 * size;
  const innerW = 58 * size, innerH = 60 * size;
  const strings = 6, frets = 4;
  const sx = innerW / (strings - 1);
  const fy = innerH / frets;
  const minFret = Math.min(...shape.frets.filter((f) => f > 0)) || 1;
  const offset = minFret > 1 ? minFret : 0;

  return (
    <Svg width={w} height={h}>
      {showName && (
        <SvgText
          x={w / 2}
          y={10 * size}
          textAnchor="middle"
          fontWeight="600"
          fontSize={11 * size}
          fill={theme.ink}
        >
          {name}
        </SvgText>
      )}
      {/* Nut */}
      {offset === 0 && (
        <Rect
          x={left - 0.5}
          y={top - 2 * size}
          width={innerW + 1}
          height={2 * size}
          fill={theme.ink}
        />
      )}
      {/* Fret number */}
      {offset > 0 && (
        <SvgText
          x={left + innerW + 4 * size}
          y={top + 6 * size}
          fontSize={8 * size}
          fill={theme.inkDim}
        >
          {offset}fr
        </SvgText>
      )}
      {/* Fret lines */}
      {Array.from({ length: frets + 1 }).map((_, i) => (
        <Line
          key={`f${i}`}
          x1={left}
          y1={top + i * fy}
          x2={left + innerW}
          y2={top + i * fy}
          stroke={theme.rule}
          strokeWidth={1}
        />
      ))}
      {/* String lines */}
      {Array.from({ length: strings }).map((_, i) => (
        <Line
          key={`s${i}`}
          x1={left + i * sx}
          y1={top}
          x2={left + i * sx}
          y2={top + innerH}
          stroke={theme.inkDim}
          strokeWidth={0.8}
        />
      ))}
      {/* Mutes / opens */}
      {shape.frets.map((f, i) => {
        const x = left + (strings - 1 - i) * sx;
        const y = top - 5 * size;
        if (f === -1)
          return (
            <SvgText key={`x${i}`} x={x} y={y} textAnchor="middle" fontSize={8 * size} fill={theme.inkDim}>
              ×
            </SvgText>
          );
        if (f === 0)
          return (
            <Circle key={`o${i}`} cx={x} cy={y - 2} r={2.5 * size} fill="none" stroke={theme.inkDim} strokeWidth={0.8} />
          );
        return null;
      })}
      {/* Finger dots */}
      {shape.frets.map((f, i) => {
        if (f <= 0) return null;
        const fretPos = offset > 0 ? f - offset + 1 : f;
        const x = left + (strings - 1 - i) * sx;
        const y = top + (fretPos - 0.5) * fy;
        const finger = shape.fingers[i];
        return (
          <React.Fragment key={`d${i}`}>
            <Circle cx={x} cy={y} r={3.5 * size} fill={theme.ink} />
            {finger > 0 && (
              <SvgText x={x} y={y + 3 * size} textAnchor="middle" fontSize={7 * size} fontWeight="600" fill={theme.bg}>
                {finger}
              </SvgText>
            )}
          </React.Fragment>
        );
      })}
    </Svg>
  );
}
