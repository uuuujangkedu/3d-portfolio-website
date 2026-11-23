import { useContent } from "../context/ContentProvider";
import CertCard from "../components/CertCard";
import CollectionPage from "../collection/CollectionPage";

const AllCertificates = () => {
  const { certificates } = useContent();

  return (
    <CollectionPage
      documentTitle="Certificates"
      heading={
        <>
          Certificates <span>&</span> credentials
        </>
      }
      count={`${certificates.length} credential${certificates.length === 1 ? "" : "s"}`}
    >
      {certificates.length ? (
        <div className="card-grid">
          {certificates.map((cert, index) => (
            <CertCard cert={cert} key={`${cert.title}-${cert.year}-${index}`} />
          ))}
        </div>
      ) : (
        <p className="collection-empty">
          No certificates yet. Add them from the admin dashboard.
        </p>
      )}
    </CollectionPage>
  );
};

export default AllCertificates;
