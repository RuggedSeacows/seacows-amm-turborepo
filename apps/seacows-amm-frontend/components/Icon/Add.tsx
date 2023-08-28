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

export default function Add(props: IconProps) {
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
      viewBox="0 0 36 36"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      role="presentation"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className || ''} ${spin ? styles.spin : ''} ${rtl ? styles.rtl : ''}`.trim()}
      {...rest}
    >
      <g>
        <rect rx="17" height="34" width="34" y="1" x="1" data-follow-fill="#47494F" fill={_fill} />
        <path
          fill="url(#7b816__a)"
          d="M19.5 12a1.5 1.5 0 0 0-3 0v4.5H12a1.5 1.5 0 0 0 0 3h4.5V24a1.5 1.5 0 0 0 3 0v-4.5H24a1.5 1.5 0 0 0 0-3h-4.5V12Z"
          clipRule="evenodd"
          fillRule="evenodd"
        />
        <rect
          strokeWidth="2"
          rx="17"
          height="34"
          width="34"
          y="1"
          x="1"
          data-follow-stroke="#191B23"
          stroke={_stroke}
        />
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" y2="18" x2="25.5" y1="18" x1="10.5" id="7b816__a">
            <stop stopColor="#01EAF9" />
            <stop stopColor="#0A58E1" offset="1" />
          </linearGradient>
        </defs>
      </g>
    </svg>
  );
}
