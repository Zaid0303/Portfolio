// Auto-detect icon from title/keywords
import { Code, Palette, Smartphone, Video, Briefcase, Camera, Music, Image, Film, Globe, Monitor} from 'lucide-react';

// Icon mapping based on keywords
const iconKeywords = {
  // Design & Graphics
  'design': Palette,
  'graphic': Palette,
  'logo': Palette,
  'brand': Palette,
  'illustration': Palette,
  'ui': Palette,
  'ux': Palette,
  'photoshop': Palette,
  'illustrator': Palette,
  
  // Web Development
  'web': Code,
  'website': Code,
  'frontend': Code,
  'backend': Code,
  'react': Code,
  'javascript': Code,
  'html': Code,
  'css': Code,
  'node': Code,
  'api': Code,
  'full stack': Code,
  
  // App Development
  'app': Smartphone,
  'mobile': Smartphone,
  'android': Smartphone,
  'ios': Smartphone,
  'flutter': Smartphone,
  'react native': Smartphone,
  'app development': Smartphone,
  
  // Video & Media
  'video': Video,
  'editing': Video,
  'film': Film,
  'cinema': Film,
  'production': Video,
  'youtube': Video,
  'after effects': Video,
  'premiere': Video,
  'motion': Video,
  
  // Photography
  'photo': Camera,
  'photography': Camera,
  'camera': Camera,
  'portrait': Camera,
  
  // Music & Audio
  'music': Music,
  'audio': Music,
  'sound': Music,
  
  // Other
  'business': Briefcase,
  'portfolio': Briefcase,
  'image': Image,
  'website': Globe,
  'monitor': Monitor,
};

export const detectIconFromTitle = (title) => {
  if (!title || typeof title !== 'string') {
    return Code; // Default icon
  }
  
  const titleLower = title.toLowerCase();
  
  // Check for exact matches first
  for (const [keyword, icon] of Object.entries(iconKeywords)) {
    if (titleLower.includes(keyword)) {
      return icon;
    }
  }
  
  // Default to Code if no match
  return Code;
};

export const detectIconNameFromTitle = (title) => {
  const icon = detectIconFromTitle(title);
  
  // Map icon component to name
  if (icon === Palette) return 'Palette';
  if (icon === Code) return 'Code';
  if (icon === Smartphone) return 'Smartphone';
  if (icon === Video || icon === Film) return 'Video';
  if (icon === Camera) return 'Palette'; // Use Palette for camera
  if (icon === Music) return 'Video'; // Use Video for music
  if (icon === Briefcase) return 'Code';
  if (icon === Image) return 'Palette';
  
  return 'Code'; // Default
};




