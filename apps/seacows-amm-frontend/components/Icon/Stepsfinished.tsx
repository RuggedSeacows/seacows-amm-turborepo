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

export default function Stepsfinished(props: IconProps) {
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
      viewBox="0 0 32 32"
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
          strokeWidth="1.5"
          stroke="url(#7b7f1__a)"
          d="m11.75 16 2.83 2.83 5.67-5.66"
        />
        <rect strokeWidth="2" stroke="url(#7b7f1__b)" rx="15" height="30" width="30" y="1" x="1" />
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" y2="16" x2="20.25" y1="16" x1="11.75" id="7b7f1__a">
            <stop stopColor="#01EAF9" />
            <stop stopColor="#0A58E1" offset="1" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" y2="16" x2="32" y1="16" x1="0" id="7b7f1__b">
            <stop stopColor="#01EAF9" />
            <stop stopColor="#0A58E1" offset="1" />
          </linearGradient>
        </defs>
      </g>
    </svg>
  );
}
