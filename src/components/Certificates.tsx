import { useContent } from "../context/ContentProvider";
import "./styles/Certificates.css";

const Certificates = () => {
  const { certificates } = useContent();
  // Keep the anchor even when empty, so the navbar link still has a target.
  if (!certificates.length) return <div id="certificates" />;

  return (
    <div className="certs-section section-container" id="certificates">
      <h2>
        Certificates <span>&</span>
        <br /> credentials
      </h2>
      <div className="certs-grid">
        {certificates.map((cert) => {
          const card = (
            <>
              {cert.image ? (
                <img src={cert.image} alt="" loading="lazy" />
              ) : null}
              <div className="cert-body">
                <span className="cert-year">{cert.year}</span>
                <h4>{cert.title}</h4>
                <h5>{cert.issuer}</h5>
                {cert.url ? (
                  <em className="cert-link">Lihat kredensial ↗</em>
                ) : null}
              </div>
            </>
          );
          const key = `${cert.title}-${cert.year}`;
          return cert.url ? (
            <a
              className="cert-card"
              key={key}
              href={cert.url}
              target="_blank"
              rel="noreferrer"
            >
              {card}
            </a>
          ) : (
            <div className="cert-card" key={key}>
              {card}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Certificates;
