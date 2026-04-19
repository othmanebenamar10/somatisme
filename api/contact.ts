import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, company, subject, message } = req.body;

    const ip = req.headers['x-forwarded-for'] as string || 'unknown';

    // Input validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Phone validation (Moroccan format)
    const phoneRegex = /^(06\d{8}|(\+212|00212)\d{9})$/;
    if (phone && !phoneRegex.test(phone)) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }

    // TEMPORARY: Skip email sending to test form submission
    console.log('Form submission received:', { name, email, subject, ip });

    return res.status(200).json({ 
      success: true, 
      message: 'Form submitted successfully (email sending temporarily disabled for testing)' 
    });
  } catch (error) {
    console.error('Contact API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({ error: errorMessage });
  }
}
