
"use client";

import React, { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { Menu, X, ChevronDown, ArrowUpRight } from "lucide-react";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  {
    href: "/how-it-works",
    label: "How It Works",
    dropdown: [
      { label: "Our Approach", href: "/how-it-works/our-approach" },
      { label: "Frequently Asked Questions", href: "/how-it-works/faqs" },
      { label: "Latest Articles", href: "/how-it-works/blog" },
    ],
  },
  { href: "/contact", label: "Contact" },
];

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.25, delay: 0.12 },
  },
};

const drawerVariants = {
  hidden: { x: "-100%" },
  visible: {
    x: 0,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    x: "-100%",
    transition: {
      duration: 0.4,
      ease: [0.7, 0, 0.84, 0],
    },
  },
};

const dropdownVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22 },
  },
  exit: {
    opacity: 0,
    y: 8,
    transition: { duration: 0.16 },
  },
};

function LogoMark({ size = 36 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 34 34"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M17 6.5C17 6.5 21.5 2 26 6.5C30.5 11 26 17 26 17C26 17 30.5 23 26 27.5C21.5 32 17 27.5 17 27.5C17 27.5 12.5 32 8 27.5C3.5 23 8 17 8 17C8 17 3.5 11 8 6.5C12.5 2 17 6.5 17 6.5Z"
        stroke="#4754ff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="17" cy="17" r="4" fill="#4754ff" />
    </svg>
  );
}

function Brand({ mobile = false, onClick }) {
  return (
    <a
      href="/"
      onClick={onClick}
      className="flex shrink-0 items-center gap-2"
      aria-label="  home"
    >
      <LogoMark size={mobile ? 29 : 36} />
      <span
        className={`  tracking-tight text-[#0f1681] ${
          mobile ? "text-[22px]" : "text-[27px]"
        }`}
      >
         
      </span>
    </a>
  );
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileDropdown, setMobileDropdown] = useState(null);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 12);
  });

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileDropdown(null);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        closeMobileMenu();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeMobileMenu();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.55,
          ease: [0.16, 1, 0.3, 1],
        }}
        onMouseLeave={() => setActiveMenu(null)}
        className={cn(
          "fixed inset-x-0 top-0 z-[60] w-full transition-all duration-300",
          scrolled
            ? "bg-white/95 shadow-[0_5px_30px_rgba(18,59,69,0.08)] backdrop-blur-md"
            : "bg-white"
        )}
      >
        <div className="mx-auto flex h-[78px] max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:h-[88px] lg:px-12">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="rounded-lg p-2 text-[#0f1681] transition-colors hover:bg-[#eff9f7] lg:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            <Brand onClick={closeMobileMenu} />

            {/* Desktop navigation */}
            <nav
              aria-label="Main navigation"
              className="ml-4 hidden h-full items-center xl:ml-8 lg:flex"
            >
              {navLinks.map((link, index) => (
                <div
                  key={link.label}
                  className="relative flex h-full items-center"
                  onMouseEnter={() =>
                    setActiveMenu(link.dropdown ? index : null)
                  }
                >
                  <a
                    href={link.href}
                    aria-haspopup={link.dropdown ? "true" : undefined}
                    aria-expanded={
                      link.dropdown ? activeMenu === index : undefined
                    }
                    onClick={() => setActiveMenu(null)}
                    className={cn(
                      "inline-flex h-full items-center gap-1.5 px-3 text-[14px] font-medium transition-colors xl:px-4 xl:text-[15px]",
                      link.label === "About"
                        ? "text-[#0f1681]"
                        : "text-[#6b7280] hover:text-[#4754ff]"
                    )}
                  >
                    {link.label}

                    {link.dropdown && (
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-300",
                          activeMenu === index && "rotate-180"
                        )}
                      />
                    )}
                  </a>

                  <AnimatePresence>
                    {link.dropdown && activeMenu === index && (
                      <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute left-0 top-[calc(100%-1px)] w-[260px] rounded-b-xl border border-[#e8ebff] bg-white py-3 shadow-[0_14px_40px_rgba(18,59,69,0.12)]"
                      >
                        {link.dropdown.map((item) => (
                          <a
                            key={item.label}
                            href={item.href}
                            onClick={() => setActiveMenu(null)}
                            className="block px-5 py-3 text-[14px] text-[#6b7280] transition-colors hover:bg-[#eff9f7] hover:text-[#0f1681]"
                          >
                            {item.label}
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>
          </div>

          {/* Desktop CTA */}
          <a
            href="/#contact"
            className="group hidden h-[48px] items-center justify-center gap-2 rounded-full bg-[#0f1681] px-5 text-[14px] font-semibold text-white transition-all duration-300 hover:bg-[#4754ff] sm:px-6 lg:inline-flex"
          >
            Enquire About Care
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </motion.header>

      {/* Mobile navigation drawer */}
      <AnimatePresence mode="sync">
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute inset-0 bg-[#0f1681]/40 backdrop-blur-[2px]"
            >
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={closeMobileMenu}
                className="absolute inset-0 h-full w-full cursor-default"
              />
            </motion.div>

            <motion.aside
              id="mobile-navigation"
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              className="absolute left-0 top-0 z-10 flex h-[100dvh] w-[min(86%,360px)] flex-col overflow-y-auto bg-white shadow-2xl"
            >
              {/* Drawer header */}
              <div className="flex h-[78px] shrink-0 items-center justify-between border-b border-[#e8ebff] px-5">
                <Brand mobile onClick={closeMobileMenu} />

                <button
                  type="button"
                  onClick={closeMobileMenu}
                  aria-label="Close menu"
                  className="rounded-full bg-[#eff9f7] p-2 text-[#0f1681] transition-colors hover:bg-[#e8ebff]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer links */}
              <nav aria-label="Mobile navigation links" className="flex-1 px-5 py-4">
                {navLinks.map((link, index) => (
                  <div
                    key={link.label}
                    className="border-b border-[#e8ebff] last:border-0"
                  >
                    {link.dropdown ? (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setMobileDropdown((current) =>
                              current === index ? null : index
                            )
                          }
                          aria-expanded={mobileDropdown === index}
                          className="flex w-full items-center justify-between py-4 text-left text-[15px] font-medium text-[#0f1681]"
                        >
                          {link.label}
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 text-[#4754ff] transition-transform duration-300",
                              mobileDropdown === index && "rotate-180"
                            )}
                          />
                        </button>

                        <AnimatePresence initial={false}>
                          {mobileDropdown === index && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{
                                height: {
                                  duration: 0.3,
                                  ease: [0.16, 1, 0.3, 1],
                                },
                                opacity: { duration: 0.2 },
                              }}
                              className="overflow-hidden"
                            >
                              <div className="pb-3 pl-3">
                                {link.dropdown.map((item) => (
                                  <a
                                    key={item.label}
                                    href={item.href}
                                    onClick={closeMobileMenu}
                                    className="block rounded-lg px-3 py-2.5 text-[13px] text-[#6b7280] transition-colors hover:bg-[#eff9f7] hover:text-[#0f1681]"
                                  >
                                    {item.label}
                                  </a>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <a
                        href={link.href}
                        onClick={closeMobileMenu}
                        className="block py-4 text-[15px] font-medium text-[#0f1681] transition-colors hover:text-[#4754ff]"
                      >
                        {link.label}
                      </a>
                    )}
                  </div>
                ))}

                <a
                  href="/#contact"
                  onClick={closeMobileMenu}
                  className="mt-6 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#0f1681] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#4754ff]"
                >
                  Enquire About Care
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </nav>

              {/* Drawer footer */}
              <div className="shrink-0 border-t border-[#e8ebff] bg-[#eff9f7] px-5 py-4">
                <p className="text-sm leading-relaxed text-[#6b7280]">
                  Care starts with understanding your needs.
                </p>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Fixed-header spacing */}
      <div className="h-[78px] lg:h-[88px]" />
    </>
  );
}
