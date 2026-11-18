import type { Certificate } from "../lib/content";
import "./styles/CertCard.css";

const CertCard = ({ cert }: { cert: Certificate }) => {
  const body = (
    <>
      {cert.image ? <img src={cert.image} alt="" loading="lazy" /> : null}
      <div className="cert-body">
        <span className="cert-year">{cert.year}</span>
        <h4>{cert.title}</h4>
        <h5>{cert.issuer}</h5>
        {cert.url ? <em className="cert-link">Lihat kredensial ↗</em> : null}
      </div>
    </>
  );

  return cert.url ? (
    <a className="cert-card" href={cert.url} target="_blank" rel="noreferrer">
      {body}
    </a>
  ) : (
    <div className="cert-card">{body}</div>
  );
};

export default CertCard;
