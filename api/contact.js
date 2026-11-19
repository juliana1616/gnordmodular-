/*
 * GNORD enquiry email endpoint (Vercel Node.js Function).
 * Preview integration: requires RESEND_API_KEY and GNORD_FROM_EMAIL as
 * Vercel server-side environment variables, with a verified sender domain.
 * Never expose these variables in client HTML/JS.
 */
const MAX_ATTACHMENT_BYTES = 3 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set(['pdf','dwg','dxf','skp','step','stp','igs','iges']);

const field = (value, max) => typeof value === 'string' ? value.trim().slice(0, max) : '';
function looksLikeEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length < 255;
}
function cleanFilename(value) {
  return String(value || '').split(/[\\/]/).pop().replace(/[\x00-\x1f<>:"|?*]/g, '_').slice(0, 140);
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Only POST is supported.' });
  }
  if (!String(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) {
    return res.status(415).json({ error: 'Unsupported form format.' });
  }

  let data;
  try {
    data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw Error('Invalid JSON');
  } catch (_) {
    return res.status(400).json({ error: 'Invalid enquiry data.' });
  }
  // Hidden honeypot field; normal users must never fill this.
  if (data.website) return res.status(200).json({ ok: true });

  const name = field(data.name, 120);
  const email = field(data.email, 254);
  const phone = field(data.phone, 50);
  const clientType = field(data.userType, 120);
  const projectCity = field(data.projectCity, 150);
  const compliance = field(data.compliance, 150);
  const design = field(data.designInquiry, 150);
  const importSupport = field(data.importSupport, 150);
  const message = field(data.message, 10000);

  if (!name || !looksLikeEmail(email) || !clientType || !projectCity || !compliance || !design || !importSupport || !message) {
    return res.status(400).json({ error: 'Please complete all required enquiry fields with a valid email address.' });
  }

  let attachments = [];
  if (data.attachment) {
    const a = data.attachment;
    if (typeof a !== 'object' || typeof a.base64 !== 'string' || typeof a.name !== 'string') {
      return res.status(400).json({ error: 'Invalid attachment.' });
    }
    const filename = cleanFilename(a.name);
    const extension = filename.split('.').pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(extension)) {
      return res.status(400).json({ error: 'Attach PDF or supported CAD drawings only.' });
    }
    if (a.base64.length > Math.ceil(MAX_ATTACHMENT_BYTES / 3) * 4 + 8 ||
        !/^[A-Za-z0-9+/]+={0,2}$/.test(a.base64)) {
      return res.status(413).json({ error: 'The attachment exceeds 3 MB or is invalid.' });
    }
    const decoded = Buffer.from(a.base64, 'base64');
    if (!decoded.length || decoded.length > MAX_ATTACHMENT_BYTES) {
      return res.status(413).json({ error: 'The attachment must be no larger than 3 MB.' });
    }
    attachments = [{ filename, content: decoded.toString('base64') }];
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress = process.env.GNORD_FROM_EMAIL;
  if (!apiKey || !fromAddress) {
    return res.status(503).json({
      error: 'Enquiry email delivery is being configured. Please email contactgnord@gmail.com directly in the meantime.'
    });
  }

  const contents = [
    'New GNORD website enquiry',
    'Name: ' + name,
    'Reply email: ' + email,
    'Phone: ' + (phone || 'Not provided'),
    'Client type: ' + clientType,
    'Project city: ' + projectCity,
    'Required compliance: ' + compliance,
    'Design enquiry: ' + design,
    'Import support: ' + importSupport,
    '',
    'Message:',
    message,
    '',
    attachments.length ? 'Attached drawing: ' + attachments[0].filename : 'No file attached.'
  ];
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromAddress,
        to: ['contactgnord@gmail.com'],
        reply_to: email,
        subject: 'GNORD Website Enquiry — ' + name.replace(/[\r\n]/g, ' ') + ' — ' + projectCity.replace(/[\r\n]/g, ' '),
        text: contents.join('\n'),
        ...(attachments.length ? { attachments } : {})
      })
    });
    if (!response.ok) {
      return res.status(502).json({ error: 'We could not deliver your enquiry. Please email contactgnord@gmail.com directly.' });
    }
    return res.status(200).json({ ok: true });
  } catch (_) {
    return res.status(502).json({ error: 'Email delivery is temporarily unavailable. Please email contactgnord@gmail.com directly.' });
  }
}
