import style from './index.module.scss';

const Empty = (props: any) => {
  const { Icon, text, className } = props;
  return (
    <div className={style.empty}>
      <Icon className={`${className || style.icon}`} />
      <p>{text}</p>
    </div>
  );
};

export default Empty;
