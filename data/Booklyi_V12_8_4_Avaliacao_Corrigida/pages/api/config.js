export default function handler(req, res) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    return res.status(500).json({ error: 'Supabase environment variables are missing.' });
  }

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ supabaseUrl, supabasePublishableKey });
}
