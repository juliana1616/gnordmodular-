# GNORD enquiry email form — preview release checklist

**This is review-only. Do not merge or publish until email delivery is verified.**

## Customer-facing behaviour
- Work With Us form submits to `/api/contact` rather than WhatsApp.
- Required: name, email, client type, project city, compliance, design needs, import needs, message.
- Optional PDF/CAD: .pdf, .dwg, .dxf, .skp, .step, .stp, .igs, .iges.
- File size limit **3 MB** (Vercel Functions have a small HTTP request payload limit).
- Larger drawing files should be emailed directly to contactgnord@gmail.com.
- Success text is displayed **only** after the email provider accepts the email. Failure or unconfigured backend displays a non-success notice.
- 6-stage timeline / return-to-source navigation remains unchanged.
- DDP note is corrected: “Note: DDP service is available only for selected countries.”

## Email service to configure (Vercel environment variables)
The backend currently uses Resend's Email API. Before end-to-end operation, the site owner must:
1. Create or connect a Resend account and verify a sender domain (e.g. gnordmodularfurniture.com) by completing its DNS requirements.
2. Add `RESEND_API_KEY` to the **Vercel server-side** environment for Preview. Never put it in public source code or screenshots.
3. Add `GNORD_FROM_EMAIL` to Vercel (a sender address on that verified domain, such as `GNORD Enquiries <enquiries@gnordmodularfurniture.com>`).
4. Redeploy Preview after adding those variables.
5. Submit one real enquiry with a small PDF, and check that `contactgnord@gmail.com` receives it with the attachment and correct Reply-To address.
6. Submit an invalid format/oversized file and verify the site rejects it.
7. Add production environment variables only when ready for approved publication. Confirm anti-spam (e.g. Turnstile or rate-limiting) and privacy wording first.

No email API credentials have been provided or set by ChatGPT, and receipt has **not** been verified.

## Repository findings
The checked `main` form used `action="#"` and a client-side placeholder `grecaptcha.execute('YOUR_RECAPTCHA_SITE_KEY', ...)` handler with a success message and console logging, without an email delivery call. Earlier tracked versions inspected also had `action="#"` without a native upload field. The owner's account of an earlier working upload workflow may refer to a different deployment or a separate integration not represented in the inspected history.

## Security and privacy
Uploads are limited to the listed extensions and 3 MB, validated both client- and server-side. No attachment is stored in the repository. Email contents and optional files will pass through the configured mail provider; ensure the business privacy notice reflects this. The current honeypot is only basic spam deterrence; strengthen protections before production.
