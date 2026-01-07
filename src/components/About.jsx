import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { getAbout } from '../firebase/firestoreServices';
import { Award, Briefcase, Code, Palette, Smartphone, Video } from 'lucide-react';

// Counter animation component
const AnimatedCounter = ({ end, duration = 2, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const endValue = parseInt(end.replace(/\D/g, '')) || 0;
    const startTime = Date.now();
    const endTime = startTime + duration * 1000;

    const updateCounter = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (endTime - startTime), 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * endValue);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setCount(endValue);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
};

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAboutData();
  }, []);

  const loadAboutData = async () => {
    try {
      const result = await getAbout();
      if (result.success && result.data) {
        setAboutData(result.data);
      } else {
        // Default data if no Firebase data
        setAboutData({
          text: 'I am a passionate creative professional with expertise in graphic design, full-stack development, and video editing. I love turning ideas into reality through beautiful designs and functional applications.',
          skills: ['Graphic Designing', 'Web Development', 'App Development', 'Video Editing'],
          experience: {
            years: '5+',
            projects: '100+',
            clients: '50+',
          },
          profileImageUrl: '',
        });
      }
    } catch (error) {
      console.error('Error loading about data:', error);
      setAboutData({
        text: 'I am a passionate creative professional with expertise in graphic design, full-stack development, and video editing.',
        skills: ['Graphic Designing', 'Web Development', 'App Development', 'Video Editing'],
        experience: {
          years: '5+',
          projects: '100+',
          clients: '50+',
        },
        profileImageUrl: '',
      });
    } finally {
      setLoading(false);
    }
  };

  const skillIcons = {
    'Graphic Designing': Palette,
    'Web Development': Code,
    'App Development': Smartphone,
    'Video Editing': Video,
  };

  if (loading) {
    return (
      <section id="about" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-primary-600 dark:text-primary-400">Me</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-purple-600 mx-auto"></div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Profile Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-purple-400 rounded-2xl transform rotate-6"></div>
              <div className="relative w-80 h-80 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl">
                {aboutData?.profileImageUrl ? (
                  <img
                    src={aboutData.profileImageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-400 to-purple-400 flex items-center justify-center text-6xl">
                    👤
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right: About Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* About Text */}
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {aboutData?.text || 'I am a passionate creative professional...'}
            </p>

            {/* Skills Badges */}
            <div>
              <h3 className="text-2xl font-bold mb-4">Skills</h3>
              <div className="flex flex-wrap gap-3">
                {aboutData?.skills?.map((skill, index) => {
                  const IconComponent = skillIcons[skill] || Award;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
                    >
                      <IconComponent className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      <span className="font-medium">{skill}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Experience Counters with Animation */}
            <div className="grid grid-cols-3 gap-4">
              {aboutData?.experience && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                      <AnimatedCounter 
                        end={aboutData.experience.years || '5+'} 
                        suffix="+"
                        duration={2}
                      />
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Years</div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                      <AnimatedCounter 
                        end={aboutData.experience.projects || '100+'} 
                        suffix="+"
                        duration={2.5}
                      />
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Projects</div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                      <AnimatedCounter 
                        end={aboutData.experience.clients || '50+'} 
                        suffix="+"
                        duration={2.2}
                      />
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Clients</div>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;