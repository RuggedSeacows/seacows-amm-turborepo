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

export default function Bnblogo(props: IconProps) {
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
          fill="#F0B90B"
          d="M12 0c6.628 0 12 5.372 12 12s-5.372 12-12 12S0 18.628 0 12 5.372 0 12 0Z"
          clipRule="evenodd"
          fillRule="evenodd"
        />
        <path
          fill="#fff"
          d="m6.594 12 .008 3.173 2.696 1.587v1.857l-4.274-2.506v-5.039l1.57.928Zm0-3.173v1.849l-1.57-.929V7.898l1.57-.929 1.578.93-1.578.928Zm3.83-.929 1.57-.929 1.579.93-1.578.928-1.57-.929Z"
        />
        <path
          fill="#fff"
          d="M7.73 14.515v-1.857l1.57.928v1.85l-1.57-.92Zm2.697 2.91 1.57.929 1.578-.929v1.849l-1.578.929-1.57-.929v-1.849Zm5.4-9.527 1.57-.929 1.578.93v1.848l-1.578.929v-1.85l-1.57-.928Zm1.57 7.275L17.406 12l1.57-.929v5.039l-4.274 2.506V16.76l2.695-1.586Z"
        />
        <path fill="#fff" d="m16.27 14.515-1.57.92v-1.848l1.57-.93v1.858Z" />
        <path
          fill="#fff"
          d="m16.27 9.484.01 1.858-2.704 1.587v3.18l-1.57.92-1.57-.92v-3.18L7.73 11.342V9.484l1.577-.928 2.688 1.594L14.7 8.556l1.578.928h-.007ZM7.73 6.312l4.267-2.515 4.274 2.515-1.57.93-2.704-1.595L9.3 7.24l-1.57-.929Z"
        />
      </g>
    </svg>
  );
}
