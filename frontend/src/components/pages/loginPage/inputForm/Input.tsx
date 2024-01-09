interface InputProps {
  label: string;
  inputType: "number" | "text";
}

const Input: React.FC<InputProps> = ({ label, inputType }) => {
  return (
    <div>
      <label htmlFor={label}></label>
      <input type={inputType} />
    </div>
  );
};

export default Input;
