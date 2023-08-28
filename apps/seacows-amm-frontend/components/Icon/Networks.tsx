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

export default function Networks(props: IconProps) {
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
          d="M1.25 12C1.25 6.066 6.066 1.25 12 1.25S22.75 6.066 22.75 12a.75.75 0 0 1-1.5 0c0-.776-.096-1.53-.276-2.25a.75.75 0 0 1-.212-.039 27.658 27.658 0 0 0-3.734-.963c.121 1.08.182 2.166.182 3.252a.75.75 0 0 1-1.5 0c0-1.166-.074-2.332-.222-3.492a27.683 27.683 0 0 0-6.978 0 27.683 27.683 0 0 0 0 6.98 27.66 27.66 0 0 0 3.49.222.75.75 0 0 1 0 1.5c-1.085 0-2.17-.06-3.25-.182a27.64 27.64 0 0 0 .963 3.735.75.75 0 0 1 .038.211c.72.18 1.474.276 2.249.276a.75.75 0 0 1 0 1.5C6.066 22.75 1.25 17.934 1.25 12Zm7.5-5.03a29.11 29.11 0 0 1 6.498-.001 27.94 27.94 0 0 0-.96-3.733.75.75 0 0 1-.038-.21A9.26 9.26 0 0 0 12 2.75c-.775 0-1.529.096-2.249.276a.75.75 0 0 1-.038.212 27.652 27.652 0 0 0-.963 3.731Zm8.06.217c1.19.199 2.37.472 3.535.82a9.296 9.296 0 0 0-4.353-4.352c.346 1.163.619 2.342.818 3.532Zm-9.621 0c-1.19.199-2.37.472-3.534.82a9.297 9.297 0 0 1 4.191-4.273.846.846 0 0 0 .134.016 29.153 29.153 0 0 0-.791 3.437ZM3.026 9.75a.75.75 0 0 0 .212-.039 27.685 27.685 0 0 1 3.733-.963 29.184 29.184 0 0 0 0 6.5 27.93 27.93 0 0 1-3.735-.96.75.75 0 0 0-.21-.037A9.259 9.259 0 0 1 2.75 12c0-.776.096-1.53.276-2.25Zm4.82 10.516a9.298 9.298 0 0 1-4.112-4.112.751.751 0 0 0 .016-.134 29.43 29.43 0 0 0 3.438.79 29.15 29.15 0 0 0 .792 3.44.752.752 0 0 0-.134.016Z"
          clipRule="evenodd"
          fillRule="evenodd"
          data-follow-fill="#fff"
          fill={_fill}
        />
        <path
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="1.5"
          d="M19.502 14.7c-.37-.11-.79-.18-1.25-.18a3.74 3.74 0 0 0 0 7.48c2.06 0 3.74-1.68 3.74-3.74a3.7 3.7 0 0 0-.63-2.08"
          data-follow-stroke="#fff"
          stroke={_stroke}
        />
        <path
          d="M19.358 12.877a.75.75 0 0 0-1.13.987l.71.811-.796.578a.75.75 0 1 0 .88 1.214l1.44-1.045a.75.75 0 0 0 .146-1.116l-1.25-1.43Z"
          clipRule="evenodd"
          fillRule="evenodd"
          data-follow-fill="#fff"
          fill={_fill}
        />
      </g>
    </svg>
  );
}
