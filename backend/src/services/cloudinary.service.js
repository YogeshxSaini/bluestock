import cloudinary from '../config/cloudinary.js';

/**
 * Upload image to Cloudinary
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Upload result with URL
 */
export const uploadImage = (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const defaultOptions = {
      folder: 'company-registration',
      resource_type: 'image',
      transformation: [
        { width: 1000, height: 1000, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
    };

    const uploadOptions = { ...defaultOptions, ...options };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          return reject(new Error(`Cloudinary upload failed: ${error.message}`));
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Upload company logo
 * @param {Buffer} fileBuffer - File buffer
 * @returns {Promise<Object>} Upload result
 */
export const uploadLogo = async (fileBuffer) => {
  return uploadImage(fileBuffer, {
    folder: 'company-registration/logos',
    transformation: [
      { width: 500, height: 500, crop: 'limit' },
      { quality: 'auto' },
    ],
  });
};

/**
 * Upload company banner
 * @param {Buffer} fileBuffer - File buffer
 * @returns {Promise<Object>} Upload result
 */
export const uploadBanner = async (fileBuffer) => {
  return uploadImage(fileBuffer, {
    folder: 'company-registration/banners',
    transformation: [
      { width: 1920, height: 600, crop: 'limit' },
      { quality: 'auto' },
    ],
  });
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Public ID of the image
 * @returns {Promise<Object>} Deletion result
 */
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};

export default {
  uploadImage,
  uploadLogo,
  uploadBanner,
  deleteImage,
};
