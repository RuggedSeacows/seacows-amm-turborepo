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

export default function Tokenheadplaceholder_6ef0fp0b(props: IconProps) {
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
        <circle fill="#D9D9D9" r="12" cy="12" cx="12" />
        <path
          fill="#C5CCF3"
          d="M19.985 11.5a8 8 0 1 0-15.97 0 8 8 0 0 1 15.97 0Z"
          clipRule="evenodd"
          fillRule="evenodd"
        />
        <circle strokeWidth=".6" stroke="#F1F3FC" fill="#7289E7" r="7.7" cy="13" cx="12" />
        <path
          strokeLinecap="round"
          strokeWidth=".6"
          stroke="#F1F3FC"
          d="M16.243 8.757a6.001 6.001 0 0 0-8.485 0m-.001 8.486a6 6 0 0 0 8.485 0"
        />
        <g filter="url(#868c6__a)">
          <path fill="#fff" d="M10 10h4l2 2-4 5-4-5 2-2Z" />
          <path
            strokeWidth=".2"
            stroke="#7289E7"
            d="M15.75 12.152 12.272 16.5l1.304-3.913 2.174-.435Zm.047-.213-2.17.434.434-2.17 1.736 1.736ZM12 16.684 10.639 12.6h2.722L12 16.684Zm1.878-6.584-.46 2.3h-2.836l-.46-2.3h3.756ZM8.25 12.152l2.174.435 1.304 3.913-3.478-4.348Zm2.123.22-2.17-.433 1.736-1.736.434 2.17Z"
          />
        </g>
        <defs>
          <filter
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
            height="7.4"
            width="8"
            y="10"
            x="8"
            id="868c6__a"
          >
            <feFlood result="BackgroundImageFix" floodOpacity="0" />
            <feColorMatrix result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" in="SourceAlpha" />
            <feOffset dy=".4" />
            <feComposite operator="out" in2="hardAlpha" />
            <feColorMatrix values="0 0 0 0 0.565313 0 0 0 0 0.611871 0 0 0 0 0.8375 0 0 0 0.4 0" />
            <feBlend result="effect1_dropShadow_5860_89585" in2="BackgroundImageFix" />
            <feBlend result="shape" in2="effect1_dropShadow_5860_89585" in="SourceGraphic" />
          </filter>
        </defs>
      </g>
    </svg>
  );
}
