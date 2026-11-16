import "./styles/Career.css";

// ponytail: replace with real career history when it is written down.
const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Full-Stack Developer</h4>
                <h5>DAYA UMKM · tikum.web.id</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Building a UMKM (small business) platform with Laravel and Blade —
              store profiles, product catalogs, and dashboards for local sellers.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Backend Developer</h4>
                <h5>OpenJob RESTful API</h5>
              </div>
              <h3>2025</h3>
            </div>
            <p>
              Designed and shipped a job marketplace REST API on Node.js and
              Express: authentication, job and application endpoints, request
              validation, and automated tests against PostgreSQL.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Mobile & AI Coursework</h4>
                <h5>Darma Persada University</h5>
              </div>
              <h3>2024–26</h3>
            </div>
            <p>
              Flutter mobile app project and an AI-based security project in
              Python, alongside core computer science coursework.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;