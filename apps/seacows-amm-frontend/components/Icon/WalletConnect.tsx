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

export default function WalletConnect(props: IconProps) {
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
        <rect fillOpacity=".1" fill="#fff" rx="12" height="24" width="24" />
        <g clipPath="url(#7b806__a)">
          <path
            fill="#3B99FC"
            d="M6.302 8.343c3.424-3.126 8.977-3.126 12.402 0l.411.374a.373.373 0 0 1 0 .566l-1.408 1.287a.238.238 0 0 1-.31 0l-.568-.52c-2.39-2.182-6.263-2.182-8.653 0l-.606.556a.238.238 0 0 1-.31 0L5.848 9.323a.373.373 0 0 1 0-.566l.455-.414Zm15.316 2.662 1.257 1.146a.373.373 0 0 1 0 .566l-5.661 5.167a.465.465 0 0 1-.618 0l-4.015-3.667a.117.117 0 0 0-.157 0L8.41 17.884a.465.465 0 0 1-.617 0L2.13 12.717a.373.373 0 0 1 0-.566l1.257-1.146a.465.465 0 0 1 .618 0l4.014 3.666c.044.04.114.04.157 0l4.015-3.666a.465.465 0 0 1 .618 0l4.014 3.666c.044.04.114.04.158 0l4.014-3.666a.472.472 0 0 1 .623 0Z"
          />
        </g>
        <defs>
          <clipPath id="7b806__a">
            <path transform="translate(2 6)" fill="#fff" d="M0 0h21v12H0z" />
          </clipPath>
        </defs>
      </g>
    </svg>
  );
}
