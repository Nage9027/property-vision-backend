import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone } from 'lucide-react';
import { ContactAdminForm } from './ContactAdminForm';
import { PRIMARY_CONTACT_NUMBER } from '@/data/contact';
import { authStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function PublishModal({ isOpen, onClose }: Props) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    if (!authStore.isAuthenticated()) {
      navigate('/login');
    } else if (authStore.getUser()?.role === 'ADMIN') {
      navigate('/post-property');
    }
  }, [isOpen, navigate]);

  if (!isOpen) return null;
  if (!authStore.isAuthenticated()) return null;
  if (authStore.getUser()?.role === 'ADMIN') return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-[#081120]/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed inset-4 z-[90] mx-auto flex max-h-[90vh] w-full max-w-lg flex-col overflow-y-auto rounded-3xl border border-gray-200 bg-white shadow-2xl sm:inset-x-auto sm:inset-y-8"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-[#0a2540]">Contact Admin to Publish</h2>
                <p className="text-sm text-gray-500">
                  Reach out to our team to get your property listed
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 p-6">
              <div className="mb-6 rounded-xl bg-gradient-to-br from-[#081120] to-[#0a2540] p-4 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#c6a43f]/80">
                  Admin Contact
                </p>
                <a
                  href={PRIMARY_CONTACT_NUMBER.href}
                  className="mt-2 flex items-center gap-2 text-lg font-bold hover:text-[#c6a43f]"
                >
                  <Phone className="h-5 w-5 text-[#c6a43f]" />
                  {PRIMARY_CONTACT_NUMBER.display}
                </a>
                <p className="mt-1 text-xs text-white/50">
                  Call or WhatsApp to get your property published
                </p>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-gray-400">or submit a request</span>
                </div>
              </div>

              <ContactAdminForm onSuccess={onClose} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
