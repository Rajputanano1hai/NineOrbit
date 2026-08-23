// NineOrbit — contact form handler
//
// This function receives the JSON body posted by /js/main.js and sends a
// notification email using Resend (https://resend.com). No credentials are
// stored in this file — everything sensitive comes from environment
// variables configured in the hosting dashboard, never in frontend code.
//
// Required environment variables (set in Netlify: Site settings →
// Environment variables):
//   RESEND_API_KEY   – API key from your Resend account
//   CONTACT_TO_EMAIL – destination inbox, e.g. sushil194ss@gmail.com
//   CONTACT_FROM_EMAIL – a verified sending address/domain in Resend,
//                        e.g. enquiries@nineorbit.in
//
// If these variables are not set, the function returns a clear 500 error
// instead of pretending the email was sent.

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  // Honeypot check (mirrors the client-side trap)
  if (payload.company_website_hp) {
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  var name = (payload.name || '').trim();
  var business = (payload.business || '').trim();
  var phone = (payload.phone || '').trim();
  var email = (payload.email || '').trim();
  var website = (payload.website || '').trim();
  var service = (payload.service || '').trim();
  var budget = (payload.budget || '').trim();
  var message = (payload.message || '').trim();

  if (!name || !phone || !email || !message) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
  }

  var apiKey = process.env.RESEND_API_KEY;
  var toEmail = process.env.CONTACT_TO_EMAIL;
  var fromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !toEmail || !fromEmail) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Email is not configured yet. Set RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL in your hosting environment variables.'
      })
    };
  }

  var html =
    '<h2>New NineOrbit website enquiry</h2>' +
    '<p><strong>Name:</strong> ' + escapeHtml(name) + '</p>' +
    '<p><strong>Business:</strong> ' + escapeHtml(business) + '</p>' +
    '<p><strong>Phone:</strong> ' + escapeHtml(phone) + '</p>' +
    '<p><strong>Email:</strong> ' + escapeHtml(email) + '</p>' +
    '<p><strong>Website:</strong> ' + escapeHtml(website) + '</p>' +
    '<p><strong>Service required:</strong> ' + escapeHtml(service) + '</p>' +
    '<p><strong>Monthly marketing budget:</strong> ' + escapeHtml(budget) + '</p>' +
    '<p><strong>Message:</strong><br>' + escapeHtml(message).replace(/\n/g, '<br>') + '</p>';

  try {
    var res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromEmail,
        to: toEmail,
        reply_to: email,
        subject: 'New NineOrbit Website Enquiry — ' + name,
        html: html
      })
    });

    if (!res.ok) {
      var errBody = await res.text();
      return { statusCode: 502, body: JSON.stringify({ error: 'Email provider error', detail: errBody }) };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Unexpected server error' }) };
  }
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
