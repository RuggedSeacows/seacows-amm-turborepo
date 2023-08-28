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

export default function Danger(props: IconProps) {
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
      viewBox="0 0 64 64"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      role="presentation"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className || ''} ${spin ? styles.spin : ''} ${rtl ? styles.rtl : ''}`.trim()}
      {...rest}
    >
      <g>
        <path
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="2"
          d="M32 25v13.333m.001 18.76h-16.16c-9.253 0-13.12-6.614-8.64-14.694l8.32-14.986 7.84-14.08c4.747-8.56 12.534-8.56 17.28 0l7.84 14.106 8.32 14.987c4.48 8.08.587 14.693-8.64 14.693h-16.16v-.026Z"
          data-follow-stroke="#D27A75"
          stroke={_stroke}
        />
        <path
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="4"
          d="M31.988 45.333h.024"
          data-follow-stroke="#D27A75"
          stroke={_stroke}
        />
      </g>
    </svg>
  );
}
