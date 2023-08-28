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

export default function EthLogo24bg(props: IconProps) {
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
        <rect fill="#757680" rx="12" height="24" width="24" />
        <path fill="#B7FAF6" d="m11.998 2-.135.456V15.68l.135.134 6.138-3.629L11.998 2Z" />
        <path fill="#F0CDC4" d="M11.998 2 5.859 12.185l6.139 3.629V2Z" />
        <path fill="#C9B3F4" d="m11.998 16.976-.076.092v4.711l.075.22 6.143-8.65-6.143 3.627Z" />
        <path fill="#F0CDC4" d="M11.998 22v-5.024L5.859 13.35 11.998 22Z" />
        <path fill="#C9B3F4" d="m12 15.813 6.138-3.628L12 9.395v6.418Z" />
        <path fill="#88AAF0" d="m5.86 12.185 6.138 3.628V9.395l-6.139 2.79Z" />
      </g>
    </svg>
  );
}
