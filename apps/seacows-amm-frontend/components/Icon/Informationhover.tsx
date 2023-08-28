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

export default function Informationhover(props: IconProps) {
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
      viewBox="0 0 15 15"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      role="presentation"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className || ''} ${spin ? styles.spin : ''} ${rtl ? styles.rtl : ''}`.trim()}
      {...rest}
    >
      <g>
        <path
          fillOpacity=".8"
          d="M7.5 5.2a.7.7 0 1 1 0-1.4.7.7 0 0 1 0 1.4Z"
          clipRule="evenodd"
          fillRule="evenodd"
          data-follow-fill="#fff"
          fill={_fill}
        />
        <path fillOpacity=".8" d="M7 6.5a.5.5 0 0 1 1 0v4a.5.5 0 0 1-1 0v-4Z" data-follow-fill="#fff" fill={_fill} />
        <path
          fillOpacity=".8"
          d="M7.5 14a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Zm0 1a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z"
          clipRule="evenodd"
          fillRule="evenodd"
          data-follow-fill="#fff"
          fill={_fill}
        />
      </g>
    </svg>
  );
}
