import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';
import { PRIMARY_CONTACT_NUMBER } from '../data/contact';
import { authStore } from '@/store/authStore';
import { PublishModal } from './PublishModal';

const NAV_LOGO_SRC = '/assets/logo-1.png';

const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Properties', path: '/properties' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHeroPage = location.pathname === '/' || location.pathname === '/properties' || location.pathname === '/about' || location.pathname === '/services' || location.pathname === '/contact' || /^\/properties\/.+/.test(location.pathname);
  const transparentNavbar = isHeroPage && !scrolled;

  const user = authStore.getUser();
  const isAuthenticated = authStore.isAuthenticated();
  const isAdmin = user?.role === 'ADMIN';

  const handlePublishClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (isAdmin) {
      navigate('/post-property');
      return;
    }
    setPublishOpen(true);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          transparentNavbar
            ? 'bg-transparent'
            : 'bg-white shadow-lg'
        }`}
      >
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo + Brand */}
          <Link to="/" className="flex shrink-0 items-center gap-4" aria-label="Property Vision — Home">
            <img
              src={NAV_LOGO_SRC}
              alt="Property Vision"
              className="h-[70px] w-auto object-contain"
              decoding="async"
            />
            <span className="flex items-center gap-1 font-sans font-bold tracking-tight">
              <span className={`text-xl transition-all duration-500 md:text-[26px] lg:text-[32px] ${transparentNavbar ? 'text-white' : 'text-[#0A1931]'}`}>Property</span>
              <span className="text-xl font-bold text-[#14B8A6] transition-all duration-500 md:text-[26px] lg:text-[32px]">Vision</span>
              <span className="ml-0.5 h-1.5 w-1.5 rounded-full bg-[#14B8A6] md:h-2 md:w-2" />
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center lg:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative mx-1.5 px-3 py-2 text-base font-bold tracking-wide transition-colors duration-200 ${
                    active
                      ? transparentNavbar ? 'text-white' : 'text-[#0A1931]'
                      : transparentNavbar ? 'text-white hover:text-[#D4AF37]' : 'text-slate-600 hover:text-[#D4AF37]'
                  } ${active ? 'after:absolute after:bottom-0 after:left-1/2 after:h-[2.5px] after:w-5 after:-translate-x-1/2 after:rounded-full after:bg-[#D4AF37]' : ''}`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Phone */}
            <a
              href={PRIMARY_CONTACT_NUMBER.href}
              className={`hidden h-9 items-center gap-2 rounded-xl border px-3.5 text-xs font-semibold transition-colors lg:inline-flex ${
                transparentNavbar
                  ? 'border-white/30 text-white hover:bg-white/10'
                  : 'border-slate-200 text-slate-700 hover:bg-gray-50'
              }`}
            >
              <Phone className="h-3.5 w-3.5" />
              {PRIMARY_CONTACT_NUMBER.display}
            </a>

            {/* CTA */}
            {isAdmin && isAuthenticated ? (
              <Link
                to="/post-property"
                className="hidden h-9 items-center rounded-xl bg-[#D4AF37] px-3.5 text-xs font-bold text-[#0A1931] shadow-sm transition-all hover:brightness-105 lg:inline-flex"
              >
                Post Property
              </Link>
            ) : (
              <button
                type="button"
                onClick={handlePublishClick}
                className="hidden h-9 items-center rounded-xl bg-[#D4AF37] px-3.5 text-xs font-bold text-[#0A1931] shadow-sm transition-all hover:brightness-105 lg:inline-flex"
              >
                Publish
              </button>
            )}

            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors lg:hidden ${
                transparentNavbar ? 'text-white hover:bg-white/10' : 'text-[#0A1931] hover:bg-gray-100'
              }`}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed inset-y-0 right-0 z-[70] flex w-[min(22rem,calc(100vw-3rem))] flex-col bg-white shadow-2xl"
            >
              <div className="flex h-16 items-center justify-between border-b border-gray-100 px-5">
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5"
                  aria-label="Property Vision — Home"
                >
                  <img
                    src={NAV_LOGO_SRC}
                    alt="Property Vision"
                    className="h-10 w-auto object-contain"
                    decoding="async"
                  />
                </Link>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl p-2 text-gray-500 hover:bg-gray-100"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-5">
                <ul className="space-y-1">
                  {NAV_LINKS.map((link, idx) => (
                    <motion.li
                      key={link.path}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`block rounded-xl px-4 py-3.5 text-[15px] font-semibold transition-colors ${
                          location.pathname === link.path
                            ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {link.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
                <div className="mt-8 space-y-3 border-t border-gray-100 pt-8">
                  <a
                    href={PRIMARY_CONTACT_NUMBER.href}
                    className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-[#D4AF37]" />
                    {PRIMARY_CONTACT_NUMBER.display}
                  </a>
                  {isAdmin && isAuthenticated ? (
                    <Link
                      to="/post-property"
                      onClick={() => setIsOpen(false)}
                      className="flex h-11 items-center justify-center rounded-xl bg-[#D4AF37] text-sm font-bold text-[#0A1931]"
                    >
                      Post Property
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        handlePublishClick();
                      }}
                      className="flex h-11 w-full items-center justify-center rounded-xl bg-[#D4AF37] text-sm font-bold text-[#0A1931]"
                    >
                      Publish
                    </button>
                  )}
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <PublishModal isOpen={publishOpen} onClose={() => setPublishOpen(false)} />
    </>
  );
};

export default Navbar;
export { Navbar };
