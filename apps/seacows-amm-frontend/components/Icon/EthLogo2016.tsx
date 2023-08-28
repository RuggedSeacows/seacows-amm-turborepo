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

export default function EthLogo2016(props: IconProps) {
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
        <path fill="#B7FAF6" d="m9.995 4-.08.273v7.935l.08.08 3.682-2.177L9.995 4Z" />
        <path fill="#F0CDC4" d="m9.995 4-3.682 6.11 3.682 2.178V4Z" />
        <path fill="#C9B3F4" d="m9.995 12.985-.046.056v2.826l.046.132 3.685-5.19-3.685 2.176Z" />
        <path fill="#F0CDC4" d="M9.995 16v-3.015L6.313 10.81 9.995 16Z" />
        <path fill="#C9B3F4" d="m9.992 12.287 3.683-2.176-3.683-1.674v3.85Z" />
        <path fill="#88AAF0" d="m6.313 10.11 3.682 2.178V8.436L6.313 10.11Z" />
      </g>
    </svg>
  );
}
