import mongoose, { Schema, Document } from 'mongoose';

// Security: Input validation and sanitization
const sanitizeString = (value: string): string => {
  return value
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 500); // Limit length
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^(06\d{8}|(\+212|00212)\d{9})$/;
  return phoneRegex.test(phone);
};

export interface IContactSubmission extends Document {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  ipAddress: string;
  userAgent: string;
  status: 'pending' | 'processed' | 'spam' | 'blocked';
  riskScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSubmissionSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
      set: sanitizeString,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: validateEmail,
        message: 'Please provide a valid email address',
      },
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: validatePhone,
        message: 'Please provide a valid Moroccan phone number (06xxxxxxxx or +212...)',
      },
    },
    company: {
      type: String,
      trim: true,
      maxlength: [200, 'Company name cannot exceed 200 characters'],
      set: sanitizeString,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      enum: {
        values: [
          'Automatisme Industriel',
          'Régulation & Instrumentation',
          'Installation Électrique',
          'Maintenance Industrielle',
          'Autre demande',
        ],
        message: '{VALUE} is not a valid subject',
      },
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [10, 'Message must be at least 10 characters'],
      maxlength: [5000, 'Message cannot exceed 5000 characters'],
      set: sanitizeString,
    },
    ipAddress: {
      type: String,
      required: true,
      trim: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processed', 'spam', 'blocked'],
      default: 'pending',
    },
    riskScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
    // Security: Add indexes for performance and query optimization
    indexes: [
      { email: 1 },
      { ipAddress: 1 },
      { status: 1 },
      { createdAt: -1 },
    ],
  }
);

// Security: Pre-save middleware for additional validation
ContactSubmissionSchema.pre('save', function (next) {
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /onerror=/i,
    /onload=/i,
    /<iframe/i,
    /eval\(/i,
  ];

  const checkSuspicious = (value: string): boolean => {
    return suspiciousPatterns.some(pattern => pattern.test(value));
  };

  if (checkSuspicious(this.name) || checkSuspicious(this.message)) {
    this.status = 'spam';
    this.riskScore = 100;
  }

  next();
});

// Security: Add text index for search functionality
ContactSubmissionSchema.index({ name: 'text', email: 'text', message: 'text' });

export default mongoose.models.ContactSubmission || mongoose.model<IContactSubmission>('ContactSubmission', ContactSubmissionSchema);
