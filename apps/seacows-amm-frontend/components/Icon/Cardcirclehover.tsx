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

export default function Cardcirclehover(props: IconProps) {
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
        <path
          strokeLinejoin="round"
          strokeLinecap="round"
          fillOpacity=".2"
          d="M21.5 12c0 5.224-4.276 9.5-9.5 9.5S2.5 17.224 2.5 12 6.776 2.5 12 2.5s9.5 4.276 9.5 9.5Z"
          data-follow-fill="#fff"
          data-follow-stroke="#fff"
          fill={_fill}
          stroke={_stroke}
        />
        <path
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="1.5"
          d="m7.75 12 2.83 2.83 5.67-5.66"
          data-follow-stroke="#fff"
          stroke={_stroke}
        />
      </g>
    </svg>
  );
}
