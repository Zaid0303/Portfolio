import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactTyped from 'react-typed';
import { Download, Eye, Mail } from 'lucide-react';

const Hero = () => {
  const typedRef = useRef(null);

  const scrollToSection = (id) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden gradient-bg pt-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="flex items-center justify-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white dark:text-white"
            >
              I am a Professional{' '}
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-purple-300 to-pink-300 dark:from-primary-400 dark:via-purple-400 dark:to-pink-400">
                <ReactTyped
                  strings={['Graphic Designer', 'Full Stack Developer', 'Video Editor']}
                  typeSpeed={50}
                  backSpeed={30}
                  loop
                  style={{ display: 'inline-block', minHeight: '1.2em' }}
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg md:text-xl text-white/90 dark:text-gray-300 mb-8"
            >
              Creating stunning designs, powerful web applications, and engaging video content
              that brings your vision to life.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => scrollToSection('#portfolio')}
                className="btn-primary flex items-center justify-center space-x-2 group"
              >
                <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>View Portfolio</span>
              </button>

              <button
                onClick={() => scrollToSection('#resume')}
                className="btn-secondary flex items-center justify-center space-x-2 group"
              >
                <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Download CV</span>
              </button>

              <button
                onClick={() => scrollToSection('#contact')}
                className="btn-secondary flex items-center justify-center space-x-2 group border-2 border-primary-600 dark:border-primary-400"
              >
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Contact Me</span>
              </button>
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-1 h-3 bg-gray-400 dark:bg-gray-600 rounded-full mt-2"
          ></motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

