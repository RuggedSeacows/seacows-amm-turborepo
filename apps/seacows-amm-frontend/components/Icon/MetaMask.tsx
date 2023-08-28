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

export default function MetaMask(props: IconProps) {
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
        <g clipPath="url(#7b7d5__a)" strokeLinejoin="round" strokeLinecap="round" strokeWidth=".25">
          <path stroke="#E17726" fill="#E17726" d="m19.152 5.048-6.23 4.648 1.133-2.731 5.097-1.917Z" />
          <path
            stroke="#E27625"
            fill="#E27625"
            d="m4.848 5.048 6.135 4.696-1.085-2.78-5.05-1.916Zm12.085 10.831-1.652 2.54 3.54 1.006.991-3.498-2.879-.048Zm-12.745.048.99 3.498 3.54-1.006-1.651-2.54-2.88.048Z"
          />
          <path
            stroke="#E27625"
            fill="#E27625"
            d="m8.53 11.518-.99 1.485 3.492.144-.095-3.834-2.407 2.204Zm6.94 0-2.454-2.205-.094 3.882 3.492-.144-.944-1.534Zm-6.751 6.901 2.124-1.055-1.841-1.437-.283 2.492Zm4.437-1.055 2.124 1.055-.283-2.492-1.84 1.438Z"
          />
          <path
            stroke="#D5BFB2"
            fill="#D5BFB2"
            d="m15.28 18.419-2.124-1.055.189 1.39v.575l1.935-.91Zm-6.561 0 1.982.958v-.575l.189-1.39-2.171 1.007Z"
          />
          <path
            stroke="#233447"
            fill="#233447"
            d="m10.703 15.016-1.746-.527 1.227-.575.52 1.102Zm2.547 0 .52-1.102 1.226.575-1.746.527Z"
          />
          <path
            stroke="#CC6228"
            fill="#CC6228"
            d="m8.722 18.419.283-2.54-1.935.048 1.652 2.492Zm6.228-2.54.282 2.54 1.652-2.492-1.935-.048Zm1.511-2.829-3.492.145.33 1.82.52-1.102 1.226.575 1.416-1.437Zm-7.506 1.439 1.227-.576.52 1.103.33-1.821-3.493-.144 1.416 1.438Z"
          />
          <path
            stroke="#E27525"
            fill="#E27525"
            d="m7.54 13.05 1.462 2.924-.047-1.438-1.416-1.485Zm7.503 1.439-.047 1.437 1.463-2.923-1.416 1.486Zm-4.013-1.294-.33 1.82.424 2.157.094-2.827-.188-1.15Zm1.89 0-.19 1.15.095 2.827.425-2.156-.33-1.821Z"
          />
          <path
            stroke="#F5841F"
            fill="#F5841F"
            d="m13.249 15.016-.425 2.156.283.192 1.841-1.438.047-1.437-1.746.527Zm-4.292-.527.047 1.438 1.84 1.437.284-.192-.425-2.156-1.746-.527Z"
          />
          <path
            stroke="#C0AC9D"
            fill="#C0AC9D"
            d="M13.297 19.377v-.575l-.142-.143h-2.36l-.141.143v.575l-1.935-.958.708.575 1.368.959h2.408l1.415-.959.661-.575-1.982.958Z"
          />
          <path
            stroke="#161616"
            fill="#161616"
            d="m13.158 17.364-.284-.191h-1.746l-.283.192-.189 1.39.142-.144h2.36l.141.143-.141-1.39Z"
          />
          <path
            stroke="#763E1A"
            fill="#763E1A"
            d="m19.386 10.032.52-2.588-.803-2.396-5.947 4.505 2.313 1.964 3.257.959.707-.863-.33-.191.52-.48-.378-.287.519-.383-.378-.24ZM4.047 7.444l.519 2.588-.33.24.519.383-.378.287.52.48-.331.24.708.862 3.257-.959 2.312-1.964L4.85 5.048l-.802 2.396Z"
          />
          <path
            stroke="#F5841F"
            fill="#F5841F"
            d="m18.725 12.476-3.257-.958.991 1.485-1.463 2.924 1.935-.048h2.88l-1.086-3.403ZM8.53 11.518l-3.257.958-1.085 3.403h2.879l1.935.048-1.463-2.924.99-1.485Zm4.39 1.676.188-3.642.944-2.588h-4.2l.944 2.588.188 3.642.095 1.15v2.828h1.746v-2.828l.094-1.15Z"
          />
        </g>
        <defs>
          <clipPath id="7b7d5__a">
            <path transform="translate(4 5)" fill="#fff" d="M0 0h16v15H0z" />
          </clipPath>
        </defs>
      </g>
    </svg>
  );
}
