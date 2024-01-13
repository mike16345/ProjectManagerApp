import React, { useState, ChangeEvent, FormEvent } from "react";
import Button from "../../button/Button";
import { registerHandler, verifyToken } from "../../../API/UserAPIcalls";
import { useNavigate } from "react-router-dom";
import { useUsersStore } from "../../../store/usersStore";

interface InputFormProps {
  actionName: string;
}

interface RegisterInput {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  type: string;
}

const RegisterPage: React.FC<InputFormProps> = ({ actionName }) => {
  const navigate = useNavigate();
  const [registerInput, setRegisterInput] = useState<RegisterInput>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    type: "",
  });

  const { setActiveUser } = useUsersStore();

  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterInput({ ...registerInput, [name]: value });
  };

  const validateConfirmPassword = (): boolean => {
    return registerInput.password === registerInput.confirmPassword;
  };

  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateConfirmPassword()) {
      // Alert passwords dont match
      console.log("not the same");
      return;
    }

    onRegisterHandler(registerInput);
  };

  return (
    <div>
      <form onSubmit={onSubmitHandler} className="">
        <div className="">
          <div className="">
            <label htmlFor="username" className="">
              Full name
              <input
                type="text"
                name="username"
                required
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="">
            <label className="">
              E-mail
              <input
                type="email"
                name="email"
                required
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="">
            <label className="">
              Password
              <input
                type="password"
                name="password"
                required
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="">
            <label className="">
              Confirm Password
              <input
                type="password"
                name="confirmPassword"
                required
                onChange={handleChange}
              />
            </label>
          </div>
        </div>
        <div className="">
          <Button type="submit">{actionName}</Button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
