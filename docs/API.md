# Company Registration & Verification API Documentation

## Base URL
```
http://localhost:4000/api
```

## Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## Authentication Endpoints

### Register User
Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "StrongPass123!",
  "full_name": "John Doe",
  "gender": "m",
  "mobile_no": "+1234567890",
  "signup_type": "e"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully. Please verify your mobile and email.",
  "data": {
    "user_id": 1,
    "email": "user@example.com"
  }
}
```

**Validation Rules:**
- `email`: Valid email format, unique
- `password`: Min 8 chars, 1 uppercase, 1 number, 1 special character
- `full_name`: Required, non-empty
- `gender`: Optional, must be 'm', 'f', or 'o'
- `mobile_no`: Required, valid phone number with country code
- `signup_type`: Optional, 'e' (email), 's' (sms), 'g' (google)

---

### Login User
Authenticate user and receive JWT token.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "StrongPass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "full_name": "John Doe",
      "mobile_no": "+1234567890",
      "is_email_verified": true,
      "is_mobile_verified": true
    }
  }
}
```

---

### Verify Email
Verify user's email address.

**Endpoint:** `GET /api/auth/verify-email?userId=<user-id>`

**Query Parameters:**
- `userId`: User ID (required)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "email": "user@example.com",
    "is_email_verified": true
  }
}
```

---

### Verify Mobile
Verify user's mobile number with OTP.

**Endpoint:** `POST /api/auth/verify-mobile`

**Request Body:**
```json
{
  "user_id": 1,
  "otp": "123456"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Mobile number verified successfully",
  "data": {
    "mobile_no": "+1234567890",
    "is_mobile_verified": true
  }
}
```

---

### Get Current User
Get the authenticated user's profile.

**Endpoint:** `GET /api/auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User profile retrieved",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "full_name": "John Doe",
      "mobile_no": "+1234567890",
      "is_email_verified": true,
      "is_mobile_verified": true
    }
  }
}
```

---

## Company Endpoints

### Register Company
Create a new company profile.

**Endpoint:** `POST /api/company/register`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "company_name": "Tech Innovations Inc",
  "address": "123 Tech Street",
  "city": "San Francisco",
  "state": "California",
  "country": "USA",
  "postal_code": "94102",
  "website": "https://techinnovations.com",
  "industry": "Technology",
  "founded_date": "2020-01-15",
  "description": "Leading technology solutions provider",
  "social_links": {
    "linkedin": "https://linkedin.com/company/techinnovations",
    "twitter": "https://twitter.com/techinnovations"
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Company registered successfully",
  "data": {
    "company": {
      "id": 1,
      "owner_id": 1,
      "company_name": "Tech Innovations Inc",
      "address": "123 Tech Street",
      "city": "San Francisco",
      "state": "California",
      "country": "USA",
      "postal_code": "94102",
      "website": "https://techinnovations.com",
      "logo_url": null,
      "banner_url": null,
      "industry": "Technology",
      "founded_date": "2020-01-15",
      "description": "Leading technology solutions provider",
      "social_links": {
        "linkedin": "https://linkedin.com/company/techinnovations",
        "twitter": "https://twitter.com/techinnovations"
      },
      "created_at": "2025-01-15T10:30:00.000Z",
      "updated_at": "2025-01-15T10:30:00.000Z"
    }
  }
}
```

---

### Get Company Profile
Retrieve the authenticated user's company profile.

**Endpoint:** `GET /api/company/profile`

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Company profile retrieved",
  "data": {
    "company": {
      "id": 1,
      "owner_id": 1,
      "company_name": "Tech Innovations Inc",
      "address": "123 Tech Street",
      "city": "San Francisco",
      "state": "California",
      "country": "USA",
      "postal_code": "94102",
      "website": "https://techinnovations.com",
      "logo_url": "https://res.cloudinary.com/...",
      "banner_url": "https://res.cloudinary.com/...",
      "industry": "Technology",
      "founded_date": "2020-01-15",
      "description": "Leading technology solutions provider",
      "social_links": {
        "linkedin": "https://linkedin.com/company/techinnovations",
        "twitter": "https://twitter.com/techinnovations"
      },
      "created_at": "2025-01-15T10:30:00.000Z",
      "updated_at": "2025-01-15T10:30:00.000Z"
    }
  }
}
```

---

### Update Company Profile
Update company information.

**Endpoint:** `PUT /api/company/profile`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "company_name": "Tech Innovations Corp",
  "description": "Updated company description",
  "website": "https://newtechinnovations.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Company profile updated successfully",
  "data": {
    "company": {
      // Updated company object
    }
  }
}
```

---

### Upload Company Logo
Upload a company logo image.

**Endpoint:** `POST /api/company/upload-logo`

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request Body (Form Data):**
- `file`: Image file (jpeg, jpg, png, gif, webp)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logo uploaded successfully",
  "data": {
    "logo_url": "https://res.cloudinary.com/your-cloud/image/upload/v123456/company-registration/logos/abcd1234.jpg",
    "company": {
      // Updated company object with logo_url
    }
  }
}
```

---

### Upload Company Banner
Upload a company banner image.

**Endpoint:** `POST /api/company/upload-banner`

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request Body (Form Data):**
- `file`: Image file (jpeg, jpg, png, gif, webp)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Banner uploaded successfully",
  "data": {
    "banner_url": "https://res.cloudinary.com/your-cloud/image/upload/v123456/company-registration/banners/efgh5678.jpg",
    "company": {
      // Updated company object with banner_url
    }
  }
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required",
      "value": "invalid-email"
    }
  ],
  "statusCode": 400
}
```

### Common Status Codes

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Validation error or bad input
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: User doesn't have permission
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists (e.g., duplicate email)
- `500 Internal Server Error`: Server error

---

## Environment Variables

Required environment variables for the backend:

```env
PORT=4000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/company_db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=company_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT
JWT_SECRET=your-strong-secret-key
JWT_EXPIRES_IN=90d

 

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# CORS
CORS_ORIGIN=http://localhost:5173

# Upload
MAX_FILE_SIZE=5242880
```

---

## Rate Limiting

Currently, no rate limiting is implemented. For production, consider implementing rate limiting using `express-rate-limit`.

---

## Testing

Use the provided Postman collection (`postman_collection.json`) to test all endpoints with pre-configured requests and test scripts.
