import { v2 as cloudinary } from 'cloudinary';
import config from './index.js';

/**
 * Initialize Cloudinary configuration
 */
export const initializeCloudinary = () => {
  if (!config.cloudinary.cloudName || !config.cloudinary.apiKey || !config.cloudinary.apiSecret) {
    console.warn('⚠️  Cloudinary credentials not configured. Image upload features will be limited.');
    return false;
  }

  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
    secure: true,
  });

  console.log('✅ Cloudinary configured successfully');
  return true;
};

export default cloudinary;
