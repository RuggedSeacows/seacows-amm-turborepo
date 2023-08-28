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

export default function SeacowsBnBbg(props: IconProps) {
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
        <rect fill="#47494F" rx="12" height="24" width="24" />
        <path
          fill="#E8E8E9"
          d="m8.047 12 .006 2.32 1.972 1.161v1.359L6.9 15.007V11.32l1.147.68Zm0-2.32v1.351l-1.149-.679V9l1.149-.68L9.2 9l-1.154.68ZM10.849 9l1.148-.68 1.154.68-1.154.68L10.85 9Z"
        />
        <path
          fill="#E8E8E9"
          d="M8.877 13.84v-1.36l1.148.68v1.352l-1.148-.673Zm1.972 2.128 1.148.68 1.155-.68v1.352l-1.155.68-1.148-.68v-1.352ZM14.799 9l1.148-.68 1.154.68v1.352l-1.154.68V9.678L14.8 9Zm1.148 5.32.006-2.32 1.149-.68v3.686l-3.126 1.833v-1.358l1.971-1.16Z"
        />
        <path fill="#E8E8E9" d="m15.123 13.84-1.148.672V13.16l1.148-.68v1.36Z" />
        <path
          fill="#E8E8E9"
          d="m15.124 10.16.006 1.359-1.978 1.16v2.327l-1.148.673-1.149-.673v-2.327l-1.977-1.16V10.16l1.153-.68 1.966 1.167 1.977-1.166 1.155.679h-.005ZM8.877 7.84 11.997 6l3.127 1.84-1.149.68-1.978-1.167-1.972 1.166-1.148-.68Z"
        />
      </g>
    </svg>
  );
}
