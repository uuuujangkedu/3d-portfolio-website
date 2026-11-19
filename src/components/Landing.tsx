import { PropsWithChildren } from "react";
import { useContent } from "../context/ContentProvider";
import Lanyard from "./Lanyard";
import SocialIcons from "./SocialIcons";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  const { greeting, firstName, lastName, roleIntro, rolePrimary, roleSecondary } =
    useContent().landing;

  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <Lanyard />
          <div className="landing-intro">
            <h2>{greeting}</h2>
            <h1>
              {firstName}
              <br />
              <span>{lastName}</span>
            </h1>
          </div>
          <div className="landing-info">
            <h3>{roleIntro}</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">{rolePrimary}</div>
              <div className="landing-h2-2">{roleSecondary}</div>
            </h2>
            <h2>
              <div className="landing-h2-info">{roleSecondary}</div>
              <div className="landing-h2-info-1">{rolePrimary}</div>
            </h2>
            <div className="landing-mobile-socials">
              <SocialIcons isMobileInline={true} />
            </div>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;