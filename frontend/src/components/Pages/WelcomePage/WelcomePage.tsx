import React from "react";

interface WelcomePageProps {
  name: string;
  isNew: boolean;
}

const WelcomePage: React.FC<WelcomePageProps> = (props) => {
  const { name, isNew } = props;
  const greeting = isNew ? "aboard" : "back";
  return (
    <div className="w-full h-full text-5xl font-bold text-center flex items-center justify-center">
      <div>
        Welcome {greeting} {name}
      </div>
    </div>
  );
};

export default WelcomePage;
