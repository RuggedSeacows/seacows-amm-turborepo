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

export default function Tokennull(props: IconProps) {
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
      viewBox="0 0 96 96"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      role="presentation"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className || ''} ${spin ? styles.spin : ''} ${rtl ? styles.rtl : ''}`.trim()}
      {...rest}
    >
      <g>
        <path
          fill="#25272E"
          d="M64.76 16H31.24C16.68 16 8 24.68 8 39.24v25.48C8 79.32 16.68 88 31.24 88h33.48c14.56 0 23.24-8.68 23.24-23.24V39.24C88 24.68 79.32 16 64.76 16Z"
          opacity=".4"
        />
        <path
          fill="#303139"
          d="M85.2 48.92H71.28c-3.92 0-7.4 2.16-9.16 5.68l-3.36 6.64c-.8 1.6-2.4 2.6-4.16 2.6H41.48c-1.24 0-3-.28-4.16-2.6l-3.36-6.6c-1.76-3.48-5.28-5.68-9.16-5.68h-14c-1.56 0-2.8 1.24-2.8 2.8V64.8C8 79.32 16.72 88 31.28 88H64.8c13.72 0 22.16-7.52 23.2-20.88v-15.4c0-1.52-1.24-2.8-2.8-2.8Z"
        />
        <path
          fill="#3B3D44"
          d="M58.122 25.88a3.018 3.018 0 0 0-4.24 0l-2.88 2.88V8c0-1.64-1.36-3-3-3s-3 1.36-3 3v20.76l-2.88-2.88a3.018 3.018 0 0 0-4.24 0 3.018 3.018 0 0 0 0 4.24l8 8c.04.04.08.04.08.08.24.24.56.44.88.6.4.12.76.2 1.16.2.4 0 .76-.08 1.12-.24.36-.16.68-.36 1-.64l8-8a3.018 3.018 0 0 0 0-4.24Z"
        />
      </g>
    </svg>
  );
}
