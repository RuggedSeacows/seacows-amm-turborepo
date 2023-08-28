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

export default function NavmetaMask(props: IconProps) {
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
        <g clipPath="url(#7b7db__a)" strokeLinejoin="round" strokeLinecap="round" strokeWidth=".25">
          <path stroke="#E17726" fill="#E17726" d="m20.94 2.061-7.788 5.888 1.416-3.46 6.372-2.428Z" />
          <path
            stroke="#E27625"
            fill="#E27625"
            d="m3.063 2.061 7.67 5.949-1.358-3.52-6.313-2.43Zm15.1 13.719-2.065 3.217 4.424 1.275 1.24-4.431-3.6-.061Zm-15.929.06 1.24 4.432 4.424-1.275-2.065-3.217-3.599.06Z"
          />
          <path
            stroke="#E27625"
            fill="#E27625"
            d="m7.665 10.256-1.24 1.881 4.367.183-.118-4.857-3.01 2.793Zm8.673 0L13.27 7.463l-.118 4.917 4.366-.182-1.18-1.942Zm-8.436 8.741 2.655-1.335-2.3-1.821-.355 3.156Zm5.548-1.335 2.654 1.335-.354-3.156-2.3 1.82Z"
          />
          <path
            stroke="#D5BFB2"
            fill="#D5BFB2"
            d="M16.104 18.997 13.45 17.66l.236 1.76v.729l2.42-1.153Zm-8.202 0 2.478 1.214v-.728l.236-1.76-2.714 1.274Z"
          />
          <path
            stroke="#233447"
            fill="#233447"
            d="m10.378 14.687-2.183-.668 1.534-.729.65 1.397Zm3.185 0 .648-1.396 1.534.728-2.182.668Z"
          />
          <path
            stroke="#CC6228"
            fill="#CC6228"
            d="m7.9 18.997.355-3.217-2.42.06 2.066 3.157Zm7.788-3.217.353 3.217 2.065-3.156-2.419-.061Zm1.885-3.582-4.366.182.413 2.307.649-1.397 1.534.729 1.77-1.821Zm-9.377 1.821 1.534-.729.649 1.397.413-2.307-4.366-.182 1.77 1.82Z"
          />
          <path
            stroke="#E27525"
            fill="#E27525"
            d="M6.426 12.198 8.255 15.9l-.06-1.822-1.77-1.881Zm9.379 1.821-.059 1.821 1.829-3.703-1.77 1.882Zm-5.017-1.639-.413 2.307.531 2.732.118-3.582-.236-1.457Zm2.362 0-.236 1.457.118 3.582.531-2.732-.413-2.307Z"
          />
          <path
            stroke="#F5841F"
            fill="#F5841F"
            d="m13.562 14.687-.53 2.732.353.243 2.301-1.821.06-1.821-2.184.667Zm-5.367-.667.06 1.82 2.3 1.822.354-.243-.53-2.732-2.184-.667Z"
          />
          <path
            stroke="#C0AC9D"
            fill="#C0AC9D"
            d="M13.625 20.211v-.728l-.177-.182h-2.95l-.177.182v.728l-2.419-1.214.885.729 1.711 1.214h3.01l1.769-1.215.826-.728-2.478 1.214Z"
          />
          <path
            stroke="#161616"
            fill="#161616"
            d="m13.443 17.662-.354-.243h-2.183l-.354.243-.236 1.76.177-.182h2.95l.177.182-.177-1.76Z"
          />
          <path
            stroke="#763E1A"
            fill="#763E1A"
            d="m21.237 8.374.649-3.278-1.003-3.035-7.434 5.706 2.891 2.489 4.07 1.214.886-1.093-.413-.243.649-.607-.472-.364.649-.485-.472-.304ZM2.059 5.096l.649 3.278-.413.304.649.485-.472.364.649.607-.413.304.885 1.093 4.07-1.214 2.891-2.49-7.492-5.766-1.003 3.035Z"
          />
          <path
            stroke="#F5841F"
            fill="#F5841F"
            d="m20.407 11.47-4.07-1.214 1.238 1.882-1.829 3.703 2.419-.061h3.599l-1.357-4.31ZM7.662 10.256l-4.07 1.214-1.358 4.31h3.6l2.418.06-1.829-3.702 1.24-1.882Zm5.489 2.124.236-4.614 1.18-3.278h-5.25l1.18 3.278.235 4.614.118 1.456v3.582h2.183v-3.582l.118-1.456Z"
          />
        </g>
        <defs>
          <clipPath id="7b7db__a">
            <path transform="translate(2 2)" fill="#fff" d="M0 0h20v19H0z" />
          </clipPath>
        </defs>
      </g>
    </svg>
  );
}
