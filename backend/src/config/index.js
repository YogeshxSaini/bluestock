import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    connectionString: process.env.DATABASE_URL,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'company_db',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '90d',
  },
  
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
  
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB default
  },
};

// Validate critical environment variables
const requiredEnvVars = ['JWT_SECRET', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];

if (config.nodeEnv !== 'test') {
  requiredEnvVars.forEach((varName) => {
    let value;
    
    if (varName === 'JWT_SECRET') {
      value = config.jwt.secret;
    } else if (varName === 'DB_NAME') {
      value = config.database.database;
    } else if (varName === 'DB_USER') {
      value = config.database.user;
    } else if (varName === 'DB_PASSWORD') {
      value = config.database.password;
    }
      
    if (!value) {
      console.error(`❌ Missing required environment variable: ${varName}`);
      // eslint-disable-next-line no-process-exit
      process.exit(1);
    }
  });
}

export default config;
