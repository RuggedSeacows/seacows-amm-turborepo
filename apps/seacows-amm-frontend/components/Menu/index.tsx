import style from './index.module.scss';
import { useState } from 'react';
import {
  Quicksell,
  Explore,
  Earn,
  Help,
  Documentation,
  Twitter,
  Discord,
  Medium,
  Mirrordefault,
  Feedback
} from '../index';
import { useRouter } from 'next/router';

interface Menu {
  icon: any;
  text: string;
  path?: string;
}
const menus: Array<Menu> = [
  {
    text: 'Quick Sell',
    path: '/',
    icon: Quicksell
  },
  {
    text: 'Explore',
    path: '/explore',
    icon: Explore
  },
  {
    text: 'Earn',
    path: '/earn',
    icon: Earn
  }
];
const links: Array<Menu> = [
  {
    text: 'Feedback',
    icon: Feedback,
    path: 'https://seacows.canny.io/'
  },
  {
    text: 'Documentation',
    icon: Documentation,
    path: 'https://docs.seacows.io/'
  }
];
const Menu = (props: any) => {
  const { active = 0 } = props;
  const router = useRouter();
  const jumpPage = (path: string) => {
    router.push(path);
  };
  return (
    <div className={style.menu}>
      <ul className={style.nav}>
        {menus.map((item: Menu, key: number) => (
          <li
            key={key}
            onClick={() => jumpPage(item.path as string)}
            className={`${style.nemuItem} ${active === key ? style.nemuItemActive : ''}`}
          >
            <item.icon fill={'#ffffff'} className={`${style.icon} ${active === key ? style.iconactive : ''}`} />
            {item.text}
          </li>
        ))}
      </ul>
      <ul>
        {links.map((item: Menu, index: number) => (
          <li key={index} className={style.link}>
            <a href={item.path} target={'_blank'}>
              <item.icon className={style.icon} fill="#ffffff" />
              <span>{item.text}</span>
            </a>
          </li>
        ))}
      </ul>
      <ul className={style.about}>
        <li>
          <a href="https://twitter.com/SeaCowsNFT" target={'_blank'}>
            <Twitter className={style.linkicon} fill={'#ffffff'} />
          </a>
        </li>
        <li>
          <a href="https://discord.gg/BwQZpqJt63" target={'_blank'}>
            <Discord className={style.linkicon} fill={'#ffffff'} />
          </a>
        </li>
        <li>
          <a href="https://medium.com/@SeaCows/about" target={'_blank'}>
            <Medium className={style.linkicon} fill={'#ffffff'} />
          </a>
        </li>
        <li>
          <a href="https://mirror.xyz/0xfD541c8A6710006a63C83eC32B9F2D7b3291eFa3" target={'_blank'}>
            <Mirrordefault className={style.linkicon} fill={'#ffffff'} />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Menu;
