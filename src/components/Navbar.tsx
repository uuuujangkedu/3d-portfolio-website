import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useContent } from "../context/ContentProvider";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FaGithub, FaInstagram, FaLinkedinIn, FaSpotify, FaStrava, FaYoutube } from "react-icons/fa6";
import { TbNotes } from "react-icons/tb";
import "./styles/Navbar.css";

const icons: Record<string, any> = {
  github: FaGithub,
  linkedin: FaLinkedinIn,
  instagram: FaInstagram,
  youtube: FaYoutube,
  spotify: FaSpotify,
  strava: FaStrava,
};

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother;

const Navbar = () => {
  const { navbar, social } = useContent();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.7,
      speed: 1.7,
      effects: true,
      autoResize: true,
      ignoreMobileResize: true,
    });

    smoother.scrollTop(0);
    smoother.paused(true);

    let links = document.querySelectorAll(".header ul a, .nav-menu-links a");
    links.forEach((elem) => {
      let element = elem as HTMLAnchorElement;
      element.addEventListener("click", (e) => {
        setIsOpen(false);
        if (window.innerWidth > 1024 || element.classList.contains("nav-link-item")) {
          if (window.innerWidth > 1024) {
            e.preventDefault();
            let elem = e.currentTarget as HTMLAnchorElement;
            let section = elem.getAttribute("data-href");
            if (section) smoother.scrollTo(section, true, "top top");
          }
        }
      });
    });
    window.addEventListener("resize", () => {
      ScrollSmoother.refresh(true);
    });
  }, []);

  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          {navbar.initials}
        </a>
        <a
          href={navbar.connectUrl}
          className="navbar-connect"
          data-cursor="disable"
          target="_blank"
          rel="noreferrer"
        >
          {navbar.connectLabel}
        </a>
        <button
          className="menu-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          data-cursor="disable"
        >
          {isOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>
        <div className={isOpen ? "nav-overlay nav-open" : "nav-overlay"}>
          <div className="nav-menu-content">
            <ul className="nav-menu-links">
              {navbar.links.map((link) => (
                <li key={link.href}>
                  <a className="nav-link-item" data-href={link.href} href={link.href} onClick={() => setIsOpen(false)}>
                    <HoverLinks text={link.label} />
                  </a>
                </li>
              ))}
            </ul>

            <div className="nav-menu-footer">
              <div className="nav-social-icons">
                {social.icons.map((item) => {
                  const Icon = icons[item.icon] ?? FaGithub;
                  return (
                    <a key={item.url} href={item.url} target="_blank" rel="noreferrer" aria-label={item.icon}>
                      <Icon />
                    </a>
                  );
                })}
              </div>
              {social.showResume && (
                <a
                  className="nav-resume-button"
                  href={social.resume}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>RESUME</span>
                  <TbNotes />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
