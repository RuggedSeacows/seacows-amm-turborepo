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

export default function Quicksell(props: IconProps) {
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
          d="M10 7h4.917a2 2 0 0 1 2 2v4.917a6.001 6.001 0 0 0-1-11.917A6.002 6.002 0 0 0 10 7Z"
          clipRule="evenodd"
          fillRule="evenodd"
          data-follow-fill="#fff"
          fill={_fill}
        />
        <path
          d="M4 9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2H4Zm4.681 3.388a.2.2 0 0 0-.362 0l-.902 1.932a.2.2 0 0 1-.097.097l-1.932.902a.2.2 0 0 0 0 .362l1.932.902a.2.2 0 0 1 .097.097l.902 1.932a.2.2 0 0 0 .362 0l.902-1.932a.2.2 0 0 1 .097-.097l1.932-.902a.2.2 0 0 0 0-.362l-1.932-.902a.2.2 0 0 1-.097-.097l-.902-1.932Z"
          clipRule="evenodd"
          fillRule="evenodd"
          data-follow-fill="#fff"
          fill={_fill}
        />
      </g>
    </svg>
  );
}
