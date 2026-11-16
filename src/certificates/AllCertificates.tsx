import { useEffect } from "react";
import { useContent } from "../context/ContentProvider";
import CertCard from "../components/CertCard";
import "../components/styles/Certificates.css";
import "./certificates.css";

const AllCertificates = () => {
  const { certificates, navbar, seo } = useContent();

  useEffect(() => {
    document.title = `Sertifikat — ${navbar.initials}`;
  }, [navbar.initials]);

  return (
    <div className="certs-page">
      <header className="certs-page-head">
        <a href="/" className="certs-page-back">
          ← {navbar.initials}
        </a>
        <span>{seo.title}</span>
      </header>

      <h1>
        Certificates <span>&</span> credentials
      </h1>
      <p className="certs-page-count">
        {certificates.length} kredensial
      </p>

      {certificates.length ? (
        <div className="certs-grid certs-grid-all">
          {certificates.map((cert, index) => (
            <CertCard cert={cert} key={`${cert.title}-${cert.year}-${index}`} />
          ))}
        </div>
      ) : (
        <p className="certs-page-empty">
          Belum ada sertifikat. Tambah dari dashboard admin.
        </p>
      )}
    </div>
  );
};

export default AllCertificates;
