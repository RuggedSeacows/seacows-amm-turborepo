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

export default function Boxnull(props: IconProps) {
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
          d="M80.398 27.76c0 2.16-1.16 4.12-3 5.12l-6.96 3.76-5.92 3.16-12.28 6.64a8.794 8.794 0 0 1-4.24 1.08c-1.48 0-2.92-.36-4.24-1.08l-25.16-13.56c-1.84-1-3-2.96-3-5.12s1.16-4.12 3-5.12l7.88-4.24 6.28-3.4 11-5.92a8.863 8.863 0 0 1 8.48 0l25.16 13.56c1.84 1 3 2.96 3 5.12Z"
          opacity=".4"
        />
        <path
          fill="#303139"
          d="m39.599 51.16-23.4-11.72c-1.8-.92-3.88-.8-5.6.24-1.72 1.04-2.72 2.88-2.72 4.88v22.12a9.99 9.99 0 0 0 5.56 9l23.4 11.68c.8.4 1.68.6 2.56.6 1.04 0 2.08-.28 3-.88 1.72-1.04 2.72-2.88 2.72-4.88V60.08c.04-3.76-2.08-7.2-5.52-8.92Z"
          opacity=".4"
        />
        <path
          fill="#25272E"
          d="M88.12 44.6v22.12c0 3.8-2.12 7.24-5.56 8.96L59.16 87.4a5.729 5.729 0 0 1-5.6-.28 5.74 5.74 0 0 1-2.72-4.88V60.16a9.99 9.99 0 0 1 5.56-9l8.6-4.28 6-3 8.8-4.4c1.8-.92 3.88-.84 5.6.24a5.74 5.74 0 0 1 2.72 4.88Z"
          opacity=".4"
        />
        <path
          fill="#3B3D44"
          d="m70.44 36.64-5.92 3.16-38.04-21.4 6.28-3.4 36.72 20.72c.4.24.72.56.96.92Zm.56 7.24v9.08c0 1.64-1.36 3-3 3s-3-1.36-3-3v-6.08l6-3Z"
        />
      </g>
    </svg>
  );
}
