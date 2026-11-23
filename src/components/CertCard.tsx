import type { Certificate } from "../lib/content";
import "./styles/CertCard.css";

const CertCard = ({ cert }: { cert: Certificate }) => {
  const body = (
    <>
      {cert.image ? <img src={cert.image} alt="" loading="lazy" /> : null}
      <div className="info-card-body">
        <span className="info-card-tag">{cert.year}</span>
        <h4>{cert.title}</h4>
        <h5>{cert.issuer}</h5>
        {cert.url ? <em className="info-card-link">View credential ↗</em> : null}
      </div>
    </>
  );

  return cert.url ? (
    <a className="info-card" href={cert.url} target="_blank" rel="noreferrer">
      {body}
    </a>
  ) : (
    <div className="info-card">{body}</div>
  );
};

export default CertCard;
