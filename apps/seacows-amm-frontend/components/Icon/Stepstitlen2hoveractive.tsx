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

export default function Stepstitlen2hoveractive(props: IconProps) {
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
        <rect fill="url(#7b7f6__a)" rx="16" height="32" width="32" />
        <path
          d="M12.104 21a.37.37 0 0 1-.272-.112.37.37 0 0 1-.112-.272V19.8c0-.096.021-.208.064-.336.053-.139.165-.277.336-.416l2.528-2.512a34.955 34.955 0 0 0 1.696-1.408c.437-.395.752-.752.944-1.072.203-.33.304-.656.304-.976 0-.48-.133-.87-.4-1.168-.256-.299-.667-.448-1.232-.448-.373 0-.688.08-.944.24-.256.15-.459.352-.608.608a2.745 2.745 0 0 0-.288.848c-.021.139-.08.235-.176.288a.589.589 0 0 1-.288.08h-1.424a.326.326 0 0 1-.24-.096.307.307 0 0 1-.096-.224 3.58 3.58 0 0 1 .288-1.328c.181-.437.443-.821.784-1.152a3.93 3.93 0 0 1 1.28-.816c.501-.203 1.067-.304 1.696-.304.885 0 1.616.15 2.192.448.587.299 1.024.704 1.312 1.216.299.512.448 1.088.448 1.728 0 .501-.096.965-.288 1.392-.192.416-.47.821-.832 1.216-.363.384-.8.779-1.312 1.184l-2.272 2.304h4.56c.117 0 .208.037.272.112a.339.339 0 0 1 .112.272v1.136a.37.37 0 0 1-.112.272.339.339 0 0 1-.272.112h-7.648Z"
          data-follow-fill="#fff"
          fill={_fill}
        />
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" y2="16" x2="32" y1="16" x1="0" id="7b7f6__a">
            <stop stopColor="#01EAF9" />
            <stop stopColor="#0A58E1" offset="1" />
          </linearGradient>
        </defs>
      </g>
    </svg>
  );
}
