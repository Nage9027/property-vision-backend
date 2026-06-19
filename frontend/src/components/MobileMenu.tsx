import { X } from "lucide-react";
import { Link } from "react-router-dom";

interface NavLink {
  href: string;
  label: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: NavLink[];
  activeLink: string;
}

export function MobileMenu({ isOpen, onClose, navLinks, activeLink }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-40 pt-20 transition-all duration-300 flex flex-col md:hidden">
      <div className="flex justify-end px-4 mb-4">
        <button 
          onClick={onClose}
          className="p-2 text-gray-800 hover:text-teal-600 transition-colors"
          aria-label="Close menu"
        >
          <X className="w-8 h-8" />
        </button>
      </div>
      
      <div className="flex flex-col items-center gap-6 mt-8">
        {navLinks.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={onClose}
            className={`text-xl font-medium transition-colors duration-200 ${
              activeLink === item.href
                ? "text-[#c6a43f] border-b-2 border-[#c6a43f]"
                : "text-gray-800 hover:text-[#c6a43f]"
            }`}
          >
            {item.label}
          </Link>
        ))}
        
        <Link
          to="/post-property"
          onClick={onClose}
          className="mt-6 px-8 py-3 rounded-md bg-gradient-to-r from-[#c6a43f] to-[#0d9488] text-white font-medium text-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          Post Property
        </Link>
      </div>
    </div>
  );
}
