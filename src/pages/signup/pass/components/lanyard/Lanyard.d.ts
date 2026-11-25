import type { CSSProperties, ReactElement, ReactNode } from 'react';

export default function Lanyard(props: {
  frontImage?: string;
  backImage?: string;
  fallback?: ReactNode;
  aspectRatio?: number;
  imageFit?: 'cover' | 'contain';
  cardColor?: string;
  orientation?: 'portrait' | 'landscape';
  finish?: 'glossy' | 'matte' | 'holographic' | 'metallic';
  cornerRadius?: number;
  size?: number;
  anchor?: 'left' | 'center' | 'right';
  strapLength?: number;
  strapImage?: string;
  strapColor?: string;
  strapWidth?: number;
  metal?: 'graphite' | 'silver' | 'gold';
  gravity?: number;
  damping?: number;
  elasticity?: number;
  breeze?: number;
  interactive?: boolean;
  intro?: boolean;
  className?: string;
  style?: CSSProperties;
}): ReactElement;
