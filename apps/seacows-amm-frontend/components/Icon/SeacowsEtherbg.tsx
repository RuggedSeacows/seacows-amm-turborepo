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

export default function SeacowsEtherbg(props: IconProps) {
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
        <path fill="#A3A4A7" d="m11.998 5.484-.088.297v8.617l.088.087 4-2.364-4-6.637Z" />
        <path fill="#E8E8E9" d="m11.998 5.484-4 6.637 4 2.364V5.484Z" />
        <path fill="#A3A4A7" d="m11.998 15.243-.049.06v3.07l.05.143L16 12.88l-4.003 2.363Z" />
        <path fill="#E8E8E9" d="M11.998 18.516v-3.273l-4-2.363 4 5.636Z" />
        <path fill="#3B3D44" d="m11.998 14.485 4-2.364-4-1.818v4.182Z" />
        <path fill="#75767B" d="m7.998 12.12 4 2.365v-4.182l-4 1.818Z" />
      </g>
    </svg>
  );
}
