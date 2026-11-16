import Marquee from "react-fast-marquee";
import { useContent } from "../context/ContentProvider";
import CertCard from "./CertCard";
import "./styles/Certificates.css";

const Certificates = () => {
  const { certificates } = useContent();
  // Keep the anchor even when empty, so the navbar link still has a target.
  if (!certificates.length) return <div id="certificates" />;

  const cards = certificates.map((cert, index) => (
    <CertCard cert={cert} key={`${cert.title}-${cert.year}-${index}`} />
  ));

  // A strip that never stops moving is a barrier for some readers, so they
  // get the same cards laid out flat instead.
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className="certs-section section-container" id="certificates">
      <h2>
        Certificates <span>&</span>
        <br /> credentials
      </h2>
      {still ? (
        <div className="certs-grid">{cards}</div>
      ) : (
        <Marquee
          className="certs-marquee"
          speed={45}
          autoFill
          pauseOnHover
          gradient={false}
        >
          {cards}
        </Marquee>
      )}
      <a className="certs-more" href="/certificates.html">
        Lihat semua sertifikat ↗
      </a>
    </div>
  );
};

export default Certificates;
