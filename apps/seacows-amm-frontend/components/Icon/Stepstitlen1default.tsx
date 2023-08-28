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

export default function Stepstitlen1default(props: IconProps) {
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
        <rect fill="#3B3D44" rx="16" height="32" width="32" />
        <path
          fillOpacity=".8"
          fill="#fff"
          d="M16.432 21a.39.39 0 0 1-.288-.112.404.404 0 0 1-.096-.272v-8.288L13.616 14.2a.426.426 0 0 1-.288.08.45.45 0 0 1-.256-.176l-.672-.864a.453.453 0 0 1-.08-.304.391.391 0 0 1 .176-.256l3.584-2.768a.408.408 0 0 1 .192-.096c.064-.01.133-.016.208-.016h1.408a.37.37 0 0 1 .272.112.37.37 0 0 1 .112.272v10.432a.37.37 0 0 1-.112.272.37.37 0 0 1-.272.112h-1.456Z"
        />
      </g>
    </svg>
  );
}
