import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getServices } from '../firebase/firestoreServices';
import { Code, Palette, Smartphone, Video } from 'lucide-react';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const result = await getServices();
      if (result.success && result.data) {
        setServices(result.data);
      } else {
        // Default services if no Firebase data
        setServices([
          {
            title: 'Graphic Designing',
            description: 'Creating stunning visual designs, logos, and brand identities that make your business stand out.',
            icon: 'Palette',
          },
          {
            title: 'Web Development',
            description: 'Building responsive, modern web applications with the latest technologies and best practices.',
            icon: 'Code',
          },
          {
            title: 'App Development',
            description: 'Developing native and cross-platform mobile applications for iOS and Android devices.',
            icon: 'Smartphone',
          },
          {
            title: 'Video Editing',
            description: 'Professional video editing, motion graphics, and post-production services for your content.',
            icon: 'Video',
          },
        ]);
      }
    } catch (error) {
      console.error('Error loading services:', error);
      setServices([
        {
          title: 'Graphic Designing',
          description: 'Creating stunning visual designs and brand identities.',
          icon: 'Palette',
        },
        {
          title: 'Web Development',
          description: 'Building responsive, modern web applications.',
          icon: 'Code',
        },
        {
          title: 'App Development',
          description: 'Developing mobile applications for iOS and Android.',
          icon: 'Smartphone',
        },
        {
          title: 'Video Editing',
          description: 'Professional video editing and post-production services.',
          icon: 'Video',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const iconMap = {
    Palette: Palette,
    Code: Code,
    Smartphone: Smartphone,
    Video: Video,
  };

  if (loading) {
    return (
      <section id="services" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-20 bg-white dark:bg-gray-800">
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
            My <span className="text-primary-600 dark:text-primary-400">Services</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-600 to-purple-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Professional services to bring your ideas to life
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const iconName = service?.icon || 'Code';
            const IconComponent = iconMap[iconName] || Code;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10 }}
                className="card group hover:border-primary-500 dark:hover:border-primary-400 border-2 border-transparent"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-500 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;

