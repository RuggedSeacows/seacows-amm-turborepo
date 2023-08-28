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

export default function Help(props: IconProps) {
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
          d="M7 2h10c2.76 0 5 2.23 5 4.98v6.98c0 2.75-2.24 4.98-5 4.98h-1.5c-.31 0-.61.15-.8.4l-1.5 1.99c-.66.88-1.74.88-2.4 0l-1.5-1.99c-.17-.22-.53-.4-.8-.4H7c-2.76 0-5-2.23-5-4.98V6.98C2 4.23 4.24 2 7 2Zm4.316 10.553a.246.246 0 0 0 .168.064h1.175a.267.267 0 0 0 .204-.076.728.728 0 0 0 .12-.241l.024-.203c.008-.076.02-.152.036-.228.048-.237.14-.46.276-.672a5.66 5.66 0 0 1 .492-.62c.184-.212.364-.424.54-.635a3.58 3.58 0 0 0 .444-.71c.12-.253.188-.54.204-.862a2.175 2.175 0 0 0-.132-.798 2.131 2.131 0 0 0-.48-.773c-.216-.237-.512-.427-.888-.57-.368-.153-.824-.229-1.367-.229-.496 0-.936.076-1.32.228a2.928 2.928 0 0 0-.984.596A2.578 2.578 0 0 0 9 8.662a.35.35 0 0 0 .072.228c.056.05.12.076.192.076h1.02a.37.37 0 0 0 .228-.063.433.433 0 0 0 .12-.228c.088-.431.252-.744.492-.938.24-.195.548-.292.923-.292.216 0 .42.047.612.14.2.084.356.21.468.38.12.169.168.376.144.62a1.303 1.303 0 0 1-.24.597 4.26 4.26 0 0 1-.48.57c-.184.194-.371.401-.563.621a4.042 4.042 0 0 0-.492.71c-.136.254-.22.545-.252.875v.405c0 .076.024.14.072.19Zm-.072 2.358a.27.27 0 0 0 .204.089h1.163c.088 0 .16-.03.216-.089a.302.302 0 0 0 .084-.215v-1.103a.318.318 0 0 0-.084-.228.284.284 0 0 0-.216-.089h-1.163a.27.27 0 0 0-.204.089.318.318 0 0 0-.084.228v1.103c0 .084.028.156.084.215Z"
          clipRule="evenodd"
          fillRule="evenodd"
          data-follow-fill="#fff"
          fill={_fill}
        />
      </g>
    </svg>
  );
}
