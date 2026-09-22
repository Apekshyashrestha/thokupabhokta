import React, { useState, useEffect, useRef } from "react";
import logoImg from "../assets/logo.png";

export default function MainHeader({ activeTab, setActiveTab }) {
  const [open, setOpen] = useState(false);
  const headerRef = useRef(null);
  const [isFixed, setIsFixed] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(68);

  useEffect(() => {
    const onScroll = () => {
      const topBar = document.querySelector(".top-bar");
      const topH = topBar ? topBar.offsetHeight : 0;
      setIsFixed(window.scrollY > topH + 2);
    };
    const onResize = () => {
      if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight);
      onScroll();
    };
    onScroll();
    onResize();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);
  const navs = [
    { id: "home", label: "HOME" },
    { id: "products", label: "PRODUCTS" },
    { id: "about", label: "ABOUT US" },
    { id: "contact", label: "CONTACT US" },
    { id: "career", label: "CAREER", isSpecial: true },
  ];

  const handleNav = (id) => {
    setActiveTab(id);
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* spacer prevents content jump when header becomes fixed */}
      {isFixed && <div style={{ height: headerHeight }} aria-hidden="true" />}
      <header
        ref={headerRef}
        className={`main-header ${isFixed ? "is-fixed" : ""}`}
        style={isFixed ? { position: "fixed", top: 0, left: 0, right: 0, zIndex: 1001 } : undefined}
      >
        <div className="logo-box" onClick={() => handleNav("home")}>
          <img src={logoImg} alt="Coop Logo" className="logo-emblem" />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span className="logo-brand-text">coop</span>
            <span className="logo-sub">Thoku Upabhokta</span>
          </div>
        </div>

        <nav className="nav-links">
          {navs.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`nav-link ${item.isSpecial ? "career-link" : ""} ${activeTab === item.id ? "active" : ""}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button className={`hamburger ${open ? "open" : ""}`} onClick={() => setOpen(!open)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </header>

      <div className={`mobile-drawer ${open ? "open" : ""}`}>
        {navs.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNav(item.id)}
            className={`nav-link ${item.isSpecial ? "career-link" : ""} ${activeTab === item.id ? "active" : ""}`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </>
  );
}
