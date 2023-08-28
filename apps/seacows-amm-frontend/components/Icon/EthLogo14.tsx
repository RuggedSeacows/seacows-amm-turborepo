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

export default function EthLogo14(props: IconProps) {
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
      viewBox="0 0 14 14"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      role="presentation"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className || ''} ${spin ? styles.spin : ''} ${rtl ? styles.rtl : ''}`.trim()}
      {...rest}
    >
      <g>
        <path fill="#B7FAF6" d="m6.682 1-.08.273v7.935l.08.08 3.683-2.177L6.682 1Z" />
        <path fill="#F0CDC4" d="M6.683 1 3 7.11l3.683 2.178V1Z" />
        <path fill="#C9B3F4" d="m6.682 9.985-.045.056v2.826l.045.132 3.685-5.19-3.685 2.176Z" />
        <path fill="#F0CDC4" d="M6.683 13V9.984L3 7.81 6.683 13Z" />
        <path fill="#C9B3F4" d="m6.68 9.288 3.683-2.177L6.68 5.437v3.85Z" />
        <path fill="#88AAF0" d="m3 7.11 3.683 2.178V5.437L3 7.11Z" />
      </g>
    </svg>
  );
}
