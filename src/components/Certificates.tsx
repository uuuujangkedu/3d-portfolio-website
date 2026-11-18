import { useContent } from "../context/ContentProvider";
import CertCard from "./CertCard";
import "./styles/Certificates.css";

const Certificates = () => {
  const { certificates } = useContent();
  if (!certificates.length) return <div id="certificates" />;

  return (
    <div className="certs-section section-container" id="certificates">
      <h2>
        Certificates <span>&</span> credentials
      </h2>
      <div className="certs-grid">
        {certificates.map((cert, index) => (
          <CertCard cert={cert} key={`${cert.title}-${cert.year}-${index}`} />
        ))}
      </div>
      <div className="certs-more-wrap">
        <a className="certs-more" href="/certificates.html">
          Lihat semua sertifikat ↗
        </a>
      </div>
    </div>
  );
};

export default Certificates;
