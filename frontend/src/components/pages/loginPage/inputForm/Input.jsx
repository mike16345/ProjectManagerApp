const Input = (props) => {
  return (
    <div>
      <label htmlFor={props.for}></label>
      <input type={props.type} />
    </div>
  );
};

export default Input;
