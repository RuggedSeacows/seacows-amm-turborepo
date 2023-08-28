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

export default function Switch(props: IconProps) {
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
          strokeWidth="1.5"
          d="M23 15.97c0 3.87-3.13 7-7 7l1.05-1.75M1 7.97c0-3.87 3.13-7 7-7L6.95 2.72"
          data-follow-stroke="#01ECFA"
          stroke={_stroke}
        />
        <path
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="1.5"
          d="M6.621 13.07h2.81c.62 0 1.13.56 1.13 1.13 0 .62-.5 1.13-1.13 1.13h-2.81v-2.26Zm0 2.26h3.22c.71 0 1.29.5 1.29 1.13 0 .62-.58 1.13-1.29 1.13h-3.22v-2.26Zm1.801 2.25v1.12m0-6.75v1.12"
          data-follow-stroke="#01ECFA"
          stroke={_stroke}
        />
        <path
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="1.5"
          d="M14.852 15.33c0 3.41-2.76 6.17-6.17 6.17s-6.17-2.76-6.17-6.17 2.76-6.17 6.17-6.17c.16 0 .31.01.48.02 3.03.23 5.45 2.65 5.68 5.68 0 .15.01.3.01.47Z"
          data-follow-stroke="#01ECFA"
          stroke={_stroke}
        />
        <path
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="1.5"
          d="M21.5 8.67c0 3.41-2.76 6.17-6.17 6.17h-.49a6.174 6.174 0 0 0-5.68-5.68v-.49c0-3.41 2.76-6.17 6.17-6.17s6.17 2.76 6.17 6.17Z"
          data-follow-stroke="#01ECFA"
          stroke={_stroke}
        />
      </g>
    </svg>
  );
}
