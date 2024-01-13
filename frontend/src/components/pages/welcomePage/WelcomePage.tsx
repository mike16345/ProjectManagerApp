import React, { Fragment } from "react";

interface WelcomePageProps {
  name: string;
  isNew: boolean;
}

const WelcomePage: React.FC<WelcomePageProps> = (props) => {
  const { name, isNew } = props;
  const greeting = isNew ? "aboard" : "back";
  return (
    <Fragment>
      <h2 className="welcome">
        Welcome {greeting} {name}
      </h2>
    </Fragment>
  );
};

export default WelcomePage;
