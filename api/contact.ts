export const config = {
  runtime: 'nodejs',
  maxDuration: 10, // 10 seconds timeout
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await req.json();
    const { name, email, phone, company, subject, message } = body;

    const ip = req.headers.get('x-forwarded-for') || 'unknown';

    // Input validation
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Phone validation (Moroccan format)
    const phoneRegex = /^(06\d{8}|(\+212|00212)\d{9})$/;
    if (phone && !phoneRegex.test(phone)) {
      return new Response(
        JSON.stringify({ error: 'Invalid phone number' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // TEMPORARY: Skip email sending to test form submission
    console.log('Form submission received:', { name, email, subject, ip });

    return new Response(
      JSON.stringify({ success: true, message: 'Form submitted successfully (email sending temporarily disabled for testing)' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Contact API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
