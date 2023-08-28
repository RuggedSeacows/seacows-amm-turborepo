import Style from './index.module.scss';

export default (props: any) => {
  const { desc, change, value, style = {}, blur } = props;
  const cahngeVaue = (e: any) => {
    change(e.target.value);
  };
  return (
    <div className={Style.input} style={style}>
      <input
        type="text"
        value={value}
        onChange={cahngeVaue}
        onBlur={() => {
          blur && blur();
        }}
      />
      <span> {desc} </span>
    </div>
  );
};
