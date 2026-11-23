import { useState } from "react";
import "./styles/Certificates.css";
import { useContent } from "../context/ContentProvider";
import { MdArrowForward, MdArrowBack } from "react-icons/md";

const Certificates = () => {
  const { certificates } = useContent();
  const [activeIndex, setActiveIndex] = useState(0);

  if (!certificates.length) return <div id="certificates" />;

  const nextCert = () => {
    setActiveIndex((prev) => (prev + 1) % certificates.length);
  };

  const prevCert = () => {
    setActiveIndex((prev) => (prev === 0 ? certificates.length - 1 : prev - 1));
  };

  return (
    <div className="certs-section section-container" id="certificates">
      <h2>
        Certificates <span>&</span> credentials
      </h2>

      <div className="certs-stack-wrapper">
        <div className="certs-deck">
          {certificates.map((cert, index) => {
            const offset = (index - activeIndex + certificates.length) % certificates.length;
            // offset 0 = top card, 1 = behind, 2 = further back, etc.
            if (offset > 2) return null; // Only render top 3 for performance & depth

            return (
              <div
                key={`${cert.title}-${index}`}
                className={`certs-stack-card cert-stack-${offset}`}
                style={{ zIndex: certificates.length - offset }}
                onClick={() => offset === 0 && cert.url && window.open(cert.url, "_blank")}
              >
                {cert.image && (
                  <div className="certs-stack-img-wrap">
                    <img src={cert.image} alt={cert.title} loading="lazy" />
                  </div>
                )}
                <div className="certs-stack-body">
                  <span className="info-card-tag">{cert.year}</span>
                  <h4>{cert.title}</h4>
                  <h5>{cert.issuer}</h5>
                  {cert.url && <em className="info-card-link">View credential ↗</em>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="certs-stack-controls">
          <button
            className="carousel-arrow certs-stack-btn"
            onClick={prevCert}
            aria-label="Previous certificate"
            data-cursor="disable"
          >
            <MdArrowBack />
          </button>
          <span className="certs-stack-indicator">
            0{activeIndex + 1} / 0{certificates.length}
          </span>
          <button
            className="carousel-arrow certs-stack-btn"
            onClick={nextCert}
            aria-label="Next certificate"
            data-cursor="disable"
          >
            <MdArrowForward />
          </button>
        </div>
      </div>

      <div className="section-more-wrap">
        <a className="section-more" href="/certificates.html" target="_blank" rel="noreferrer">
          View all certificates ↗
        </a>
      </div>
    </div>
  );
};

export default Certificates;
