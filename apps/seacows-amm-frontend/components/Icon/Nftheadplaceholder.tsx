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

export default function Nftheadplaceholder_6ef0fp10(props: IconProps) {
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
        <g clipPath="url(#868c4__a)">
          <circle fill="#D9D9D9" r="12" cy="12" cx="12" />
          <path
            strokeWidth=".6"
            stroke="#F1F3FC"
            fill="#7289E7"
            d="m18.947 7.624-6.6-3.771a.7.7 0 0 0-.694 0l-6.6 3.771a.7.7 0 0 0-.353.608v7.536a.7.7 0 0 0 .353.608l6.6 3.771a.7.7 0 0 0 .694 0l6.6-3.771a.7.7 0 0 0 .353-.608V8.232a.7.7 0 0 0-.353-.608Z"
          />
          <g filter="url(#868c4__b)" fill="#F8F9FD">
            <path d="M6.161 14a.173.173 0 0 1-.111-.04.143.143 0 0 1-.05-.109V10.15c0-.042.017-.077.05-.103A.16.16 0 0 1 6.16 10h.826c.074 0 .128.015.161.046.033.03.056.055.069.074l1.278 1.891V10.15c0-.042.017-.077.05-.103A.168.168 0 0 1 8.663 10h.93c.046 0 .084.015.113.046.033.026.05.06.05.103v3.702a.143.143 0 0 1-.05.109.158.158 0 0 1-.112.04h-.82c-.074 0-.13-.015-.167-.046a1.401 1.401 0 0 1-.068-.074L7.26 12.091v1.76a.143.143 0 0 1-.05.109.158.158 0 0 1-.111.04H6.16Zm4.534 0a.173.173 0 0 1-.111-.04.143.143 0 0 1-.05-.109V10.15c0-.042.017-.077.05-.103a.16.16 0 0 1 .111-.046h2.992c.046 0 .085.015.118.046.033.026.05.06.05.103v.725a.137.137 0 0 1-.05.103.168.168 0 0 1-.118.046h-1.843v.628h1.719c.045 0 .085.016.118.046.033.027.05.061.05.103v.72a.143.143 0 0 1-.05.109.183.183 0 0 1-.118.04h-1.72v1.182a.143.143 0 0 1-.049.109.158.158 0 0 1-.112.04h-.987Zm4.885 0a.182.182 0 0 1-.119-.04.153.153 0 0 1-.043-.109v-2.788H14.35a.183.183 0 0 1-.118-.04.152.152 0 0 1-.043-.109v-.765c0-.042.014-.077.043-.103A.168.168 0 0 1 14.35 10h3.489c.045 0 .082.015.111.046.033.026.05.06.05.103v.765a.143.143 0 0 1-.05.109.159.159 0 0 1-.111.04H16.77v2.788a.143.143 0 0 1-.05.109.158.158 0 0 1-.111.04h-1.03Z" />
          </g>
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth=".6"
            stroke="#E4E7F9"
            d="m8 8 4-2 4 2m-8 8 4 2 4-2"
          />
        </g>
        <defs>
          <clipPath id="868c4__a">
            <path fill="#fff" d="M0 0h24v24H0z" />
          </clipPath>
          <filter
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
            height="4.4"
            width="12"
            y="10"
            x="6"
            id="868c4__b"
          >
            <feFlood result="BackgroundImageFix" floodOpacity="0" />
            <feColorMatrix result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" in="SourceAlpha" />
            <feOffset dy=".4" />
            <feComposite operator="out" in2="hardAlpha" />
            <feColorMatrix values="0 0 0 0 0.565313 0 0 0 0 0.611871 0 0 0 0 0.8375 0 0 0 0.4 0" />
            <feBlend result="effect1_dropShadow_5860_89584" in2="BackgroundImageFix" />
            <feBlend result="shape" in2="effect1_dropShadow_5860_89584" in="SourceGraphic" />
          </filter>
        </defs>
      </g>
    </svg>
  );
}
