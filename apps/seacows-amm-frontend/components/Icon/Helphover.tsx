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

export default function Helphover(props: IconProps) {
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
      viewBox="0 0 15 15"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      role="presentation"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className || ''} ${spin ? styles.spin : ''} ${rtl ? styles.rtl : ''}`.trim()}
      {...rest}
    >
      <g>
        <path
          fillOpacity=".8"
          d="M7.5 9.8a.7.7 0 1 1 0 1.4.7.7 0 0 1 0-1.4Zm-.229-.417a.26.26 0 0 1-.162-.05.203.203 0 0 1-.065-.157v-.394c.015-.283.083-.533.206-.75.122-.217.27-.414.443-.591.18-.178.36-.345.54-.503.181-.164.333-.329.455-.493.13-.164.21-.338.238-.522.029-.237-.021-.434-.151-.592a1.205 1.205 0 0 0-.53-.375 1.923 1.923 0 0 0-.692-.128c-.383 0-.71.092-.985.276-.266.178-.443.48-.53.907a.277.277 0 0 1-.108.168.31.31 0 0 1-.173.05h-.519a.273.273 0 0 1-.173-.06A.203.203 0 0 1 5 6.011c.007-.27.072-.526.195-.769.122-.243.295-.457.519-.64.23-.185.501-.33.811-.434.317-.112.67-.168 1.06-.168.44 0 .815.056 1.125.168.317.105.57.25.757.433.195.178.335.375.422.592.086.217.122.434.108.65a1.66 1.66 0 0 1-.216.71c-.123.204-.27.395-.444.572-.173.171-.35.342-.53.513-.173.164-.32.339-.443.523a1.23 1.23 0 0 0-.217.581l-.021.217v.197a.298.298 0 0 1-.087.168.263.263 0 0 1-.184.06h-.584Z"
          data-follow-fill="#fff"
          fill={_fill}
        />
        <path
          fillOpacity=".8"
          d="M7.5 14a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Zm0 1a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z"
          clipRule="evenodd"
          fillRule="evenodd"
          data-follow-fill="#fff"
          fill={_fill}
        />
      </g>
    </svg>
  );
}
