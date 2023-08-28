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

export default function Ethlogobg(props: IconProps) {
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
      viewBox="0 0 24 24"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      role="presentation"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className || ''} ${spin ? styles.spin : ''} ${rtl ? styles.rtl : ''}`.trim()}
      {...rest}
    >
      <g>
        <rect fill="#47494F" rx="12" height="24" width="24" />
        <path fill="#B7FAF6" d="m11.996 3-.121.41v11.902l.12.12 5.525-3.265L11.996 3Z" />
        <path fill="#F0CDC4" d="m11.997 3-5.524 9.167 5.524 3.266V3Z" />
        <path fill="#C9B3F4" d="m11.998 16.478-.068.083v4.24l.068.199 5.528-7.786-5.528 3.264Z" />
        <path fill="#F0CDC4" d="M11.997 21v-4.522l-5.524-3.264L11.997 21Z" />
        <path fill="#C9B3F4" d="m11.996 15.433 5.525-3.266-5.525-2.511v5.777Z" />
        <path fill="#88AAF0" d="m6.473 12.167 5.524 3.266V9.656l-5.524 2.511Z" />
      </g>
    </svg>
  );
}
