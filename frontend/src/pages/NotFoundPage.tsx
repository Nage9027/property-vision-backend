import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-32 px-4 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-40 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#18b581]/10 rounded-full blur-3xl mix-blend-multiply"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl mix-blend-multiply"></div>
        </div>

        <motion.div 
          className="relative z-10 text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="text-[150px] md:text-[200px] font-extrabold text-[#0a2540] leading-none tracking-tighter"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
          >
            404
          </motion.div>
          
          <div className="w-24 h-2 bg-[#18b581] mx-auto rounded-full mb-8"></div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-[#0a2540] mb-6 font-sans">
            Page Not Found
          </h1>
          
          <p className="text-gray-500 text-lg md:text-xl mb-12 leading-relaxed max-w-lg mx-auto">
            Oops! The property or page you are looking for doesn't exist, has been moved, or is currently unavailable.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/" 
              className="w-full sm:w-auto bg-[#18b581] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#159a6d] hover:-translate-y-1 transition-all shadow-lg hover:shadow-[0_10px_20px_rgba(24,181,129,0.3)] flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
              Back to Home
            </Link>
            
            <Link 
              to="/properties" 
              className="w-full sm:w-auto bg-white text-[#0a2540] border border-gray-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 hover:-translate-y-1 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5 text-[#18b581]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
              View Properties
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
