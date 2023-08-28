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

export default function Cardnull(props: IconProps) {
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
          d="M55.56 11.52 36.8 8.56C21.16 6.12 13.92 11.4 11.44 27.04L8.48 45.8c-1.6 10.24.08 16.88 5.88 20.92 3.04 2.16 7.2 3.6 12.6 4.44l18.76 2.96c15.64 2.44 22.88-2.84 25.36-18.48L74 36.88c.48-3.08.68-5.84.52-8.28-.52-10-6.4-15.12-18.96-17.08ZM32.96 37.4c-4.68 0-8.48-3.8-8.48-8.44 0-4.68 3.8-8.48 8.48-8.48 4.64 0 8.44 3.8 8.44 8.48 0 4.64-3.8 8.44-8.44 8.44Z"
          opacity=".4"
        />
        <path
          fill="#303139"
          d="m82 53.88-6 18.04c-5 15.04-13 19.04-28.04 14.04l-18.04-6c-9.08-3-14.12-7.16-15.56-13.24 3.04 2.16 7.2 3.6 12.6 4.44l18.76 2.96c15.64 2.44 22.88-2.84 25.36-18.48L74 36.88c.48-3.08.68-5.84.52-8.28 9.56 5.08 11.64 12.76 7.48 25.28Z"
        />
        <path
          fill="#3B3D44"
          d="M41.4 28.96c0 4.64-3.8 8.44-8.44 8.44-4.68 0-8.48-3.8-8.48-8.44 0-4.68 3.8-8.48 8.48-8.48 4.64 0 8.44 3.8 8.44 8.48Z"
        />
      </g>
    </svg>
  );
}
