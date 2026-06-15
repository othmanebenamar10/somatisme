import mongoose from 'mongoose';

// Security: Connection options with TLS and validation
const mongooseOptions = {
  autoIndex: true, // Build indexes
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
  ssl: true, // Force SSL/TLS
  sslValidate: true, // Validate SSL certificate
  tlsAllowInvalidCertificates: false, // Reject invalid certificates
  tlsAllowInvalidHostnames: false, // Reject invalid hostnames
};

let connection: mongoose.Connection | null = null;

/**
 * Connect to MongoDB with military-grade security
 * Includes TLS encryption, connection pooling, and error handling
 */
export async function connectToDatabase(): Promise<mongoose.Connection> {
  if (connection) {
    return connection;
  }

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  try {
    await mongoose.connect(mongoUri, mongooseOptions);
    connection = mongoose.connection;

    // Security: Event listeners for connection monitoring
    connection.on('connected', () => {
      console.log('MongoDB connected successfully with TLS encryption');
    });

    connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    return connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectFromDatabase(): Promise<void> {
  if (connection) {
    await mongoose.disconnect();
    connection = null;
    console.log('MongoDB disconnected');
  }
}

/**
 * Check if MongoDB is connected
 */
export function isConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
