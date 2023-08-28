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

export default function Stepstitlen3default(props: IconProps) {
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
          d="M15.476 21.16c-.747 0-1.392-.09-1.936-.272-.544-.181-.997-.416-1.36-.704a3.309 3.309 0 0 1-.8-.96 2.43 2.43 0 0 1-.288-1.04c0-.096.032-.17.096-.224a.382.382 0 0 1 .256-.096h1.44a.54.54 0 0 1 .272.064c.075.043.139.128.192.256.096.288.25.517.464.688.224.17.48.293.768.368.288.064.592.096.912.096.64 0 1.147-.15 1.52-.448.384-.31.576-.747.576-1.312 0-.565-.176-.97-.528-1.216-.352-.256-.843-.384-1.472-.384H13.94a.427.427 0 0 1-.288-.096.39.39 0 0 1-.112-.288v-.672a.54.54 0 0 1 .064-.272c.053-.085.107-.155.16-.208l2.864-2.8h-4.576a.39.39 0 0 1-.288-.112.404.404 0 0 1-.096-.272V10.2c0-.117.032-.213.096-.288a.39.39 0 0 1 .288-.112h6.864a.39.39 0 0 1 .288.112.39.39 0 0 1 .112.288v.96a.507.507 0 0 1-.064.256.904.904 0 0 1-.144.192l-2.768 2.848.192.016c.65.053 1.227.203 1.728.448a2.62 2.62 0 0 1 1.184 1.04c.288.459.432 1.035.432 1.728 0 .725-.192 1.35-.576 1.872-.373.512-.89.907-1.552 1.184-.661.277-1.419.416-2.272.416Z"
        />
      </g>
    </svg>
  );
}
