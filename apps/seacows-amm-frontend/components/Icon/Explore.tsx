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

export default function Explore(props: IconProps) {
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
          d="M14 16c0 1.77-.77 3.37-2 4.46A5.93 5.93 0 0 1 8 22c-3.31 0-6-2.69-6-6a5.991 5.991 0 0 1 2.555-4.903c.249-.174.584-.055.718.218a7.493 7.493 0 0 0 4.747 3.915c.63.18 1.29.27 1.98.27.487 0 .954-.046 1.407-.131.289-.054.576.13.588.424.004.07.005.138.005.207Z"
          data-follow-fill="#fff"
          fill={_fill}
        />
        <path
          d="M18 8a5.993 5.993 0 0 1-4.42 5.79c-.5.14-1.03.21-1.58.21s-1.08-.07-1.58-.21A5.993 5.993 0 0 1 6 8c0-3.31 2.69-6 6-6s6 2.69 6 6Zm4 8a6.005 6.005 0 0 1-8.119 5.614c-.319-.121-.378-.529-.156-.788A7.406 7.406 0 0 0 15.5 16c0-.34-.03-.68-.08-1a.444.444 0 0 1 .228-.456 7.448 7.448 0 0 0 3.079-3.229c.134-.272.47-.392.718-.217A5.992 5.992 0 0 1 22 16Z"
          data-follow-fill="#fff"
          fill={_fill}
        />
      </g>
    </svg>
  );
}
