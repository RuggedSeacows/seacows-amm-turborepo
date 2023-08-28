import React, { useEffect, useRef } from 'react';
import styles from './style.module.scss';
interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: string | number;
  width?: string | number;
  height?: string | number;
  spin?: boolean;
  rtl?: boolean;
  color?: string;
  fill?: string;
  stroke?: string;
}

export default function EthLogo32(props: IconProps) {
  const root = useRef<SVGSVGElement>(null);
  const { size = '1em', width, height, spin, rtl, color, fill, stroke, className, ...rest } = props;
  const _width = width || size;
  const _height = height || size;
  const _stroke = stroke || color;
  const _fill = fill || color;
  useEffect(() => {
    if (!_fill) {
      (root.current as SVGSVGElement)?.querySelectorAll('[data-follow-fill]').forEach((item) => {
        item.setAttribute('fill', item.getAttribute('data-follow-fill') || '');
      });
    }
    if (!_stroke) {
      (root.current as SVGSVGElement)?.querySelectorAll('[data-follow-stroke]').forEach((item) => {
        item.setAttribute('stroke', item.getAttribute('data-follow-stroke') || '');
      });
    }
  }, [stroke, color, fill]);
  return (
    <svg
      ref={root}
      width={_width}
      height={_height}
      viewBox="0 0 32 32"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      role="presentation"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className || ''} ${spin ? styles.spin : ''} ${rtl ? styles.rtl : ''}`.trim()}
      {...rest}
    >
      <g>
        <path fill="#B7FAF6" d="m15.995 2.667-.179.608v17.632l.18.179 8.184-4.838-8.185-13.581Z" />
        <path fill="#F0CDC4" d="m15.997 2.667-8.184 13.58 8.184 4.839V2.667Z" />
        <path fill="#C9B3F4" d="m15.995 22.635-.1.123v6.281l.1.294 8.19-11.533-8.19 4.835Z" />
        <path fill="#F0CDC4" d="M15.997 29.334v-6.699L7.813 17.8l8.184 11.534Z" />
        <path fill="#C9B3F4" d="m16 21.086 8.185-4.838L16 12.528v8.558Z" />
        <path fill="#88AAF0" d="m7.813 16.248 8.184 4.838v-8.559l-8.184 3.72Z" />
      </g>
    </svg>
  );
}
