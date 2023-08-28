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

export default function Copied(props: IconProps) {
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
      viewBox="0 0 16 16"
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
          stroke="#8F909A"
          d="M14.667 7.4V4.6c0-2.334-.933-3.267-3.266-3.267H8.6c-2.334 0-3.267.933-3.267 3.267v.733H7.4c2.333 0 3.266.933 3.266 3.267v2.066h.734c2.333 0 3.266-.933 3.266-3.266Z"
          opacity=".4"
        />
        <path
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="1.5"
          stroke="#fff"
          d="M10.667 11.4V8.6c0-2.334-.933-3.267-3.266-3.267H4.6c-2.334 0-3.267.933-3.267 3.267v2.8c0 2.333.933 3.266 3.267 3.266h2.8c2.333 0 3.266-.933 3.266-3.266Z"
        />
        <path
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="1.5"
          stroke="#01ECFA"
          d="m4.053 10 1.3 1.3 2.593-2.6"
        />
      </g>
    </svg>
  );
}
