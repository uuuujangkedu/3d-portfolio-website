import { MdArrowOutward, MdCopyright } from "react-icons/md";
import { useContent } from "../context/ContentProvider";
import "./styles/Contact.css";

const Contact = () => {
  const { contact } = useContent();
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>{contact.heading}</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>{contact.connectHeading}</h4>
            <p>
              <a
                href={contact.connectLink.url}
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
              >
                {contact.connectLink.label}
              </a>
            </p>
            <h4>{contact.educationHeading}</h4>
            {contact.education.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <h4>{contact.statusHeading}</h4>
            <p>{contact.status}</p>
          </div>
          <div className="contact-box">
            <h4>{contact.socialHeading}</h4>
            {contact.socials.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
                className="contact-social"
              >
                {social.label} <MdArrowOutward />
              </a>
            ))}
          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by{" "}
              <span>{contact.creditName}</span>
            </h2>
            <h5>
              <MdCopyright /> {contact.year}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;