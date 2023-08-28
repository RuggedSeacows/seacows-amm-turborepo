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

export default function EthLogo20gbg(props: IconProps) {
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
      viewBox="0 0 20 20"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      role="presentation"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className || ''} ${spin ? styles.spin : ''} ${rtl ? styles.rtl : ''}`.trim()}
      {...rest}
    >
      <g>
        <rect fillOpacity=".2" fill="#fff" rx="10" height="20" width="20" />
        <path fill="#B7FAF6" d="m9.998 2-.107.365v10.58l.107.106 4.91-2.902L9.999 2Z" />
        <path fill="#F0CDC4" d="m9.997 2-4.911 8.149 4.91 2.902V2Z" />
        <path fill="#C9B3F4" d="m9.998 13.981-.06.074v3.769l.06.176 4.914-6.92-4.914 2.901Z" />
        <path fill="#F0CDC4" d="M9.997 18v-4.019l-4.911-2.9L9.996 18Z" />
        <path fill="#C9B3F4" d="m9.996 13.051 4.91-2.903-4.91-2.232v5.135Z" />
        <path fill="#88AAF0" d="m5.086 10.148 4.91 2.903V7.916l-4.91 2.232Z" />
      </g>
    </svg>
  );
}
