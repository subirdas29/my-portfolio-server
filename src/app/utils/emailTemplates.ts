const signature = `
  <table style="margin-top:32px;border-top:1px solid #e5e7eb;padding-top:20px;width:100%">
    <tr>
      <td>
        <p style="margin:0;font-size:15px;font-weight:700;color:#111827">Subir Das</p>
        <p style="margin:4px 0 0;font-size:13px;color:#6b7280">Full Stack Developer · AI & Automation</p>
        <p style="margin:8px 0 0;font-size:12px;color:#9ca3af">
          <a href="https://subirdas.com" style="color:#f59e0b;text-decoration:none">subirdas.com</a>
          &nbsp;·&nbsp;
          <a href="mailto:subirdas1045@gmail.com" style="color:#f59e0b;text-decoration:none">subirdas1045@gmail.com</a>
        </p>
      </td>
    </tr>
  </table>
`;

const wrapper = (content: string) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#f59e0b,#f97316);padding:32px;text-align:center">
            <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.5px">Subir Das</h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:13px">Full Stack Developer · AI & Automation</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:36px 40px 32px">
            ${content}
            ${signature}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;text-align:center">
            <p style="margin:0;font-size:12px;color:#9ca3af">
              You received this because you subscribed at
              <a href="https://subirdas.com" style="color:#f59e0b;text-decoration:none">subirdas.com</a>
            </p>
            <p style="margin:6px 0 0;font-size:12px;color:#9ca3af">
              <a href="https://subirdas.com/unsubscribe?email={{email}}" style="color:#9ca3af;text-decoration:underline">Unsubscribe</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

export const welcomeEmailTemplate = (email: string) => wrapper(`
  <h2 style="margin:0 0 12px;font-size:22px;font-weight:800;color:#111827">Welcome aboard! 🎉</h2>
  <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.7">
    Hey there! Thanks for subscribing. You're now part of a small group that gets notified when I ship something new.
  </p>
  <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.7">
    Here's what you can expect:
  </p>
  <table style="width:100%;margin-bottom:24px">
    ${[
      ['🚀', 'New project launches'],
      ['✍️', 'Dev articles & tutorials'],
      ['💡', 'Freelance tips & updates'],
      ['🎁', 'Occasional special offers'],
    ].map(([icon, text]) => `
      <tr>
        <td style="padding:6px 0">
          <span style="font-size:18px">${icon}</span>
          <span style="font-size:14px;color:#374151;margin-left:10px">${text}</span>
        </td>
      </tr>
    `).join('')}
  </table>
  <p style="margin:0;font-size:14px;color:#6b7280;line-height:1.6">
    No spam, no fluff — only when it's worth your time. You can unsubscribe anytime.
  </p>
`.replace('{{email}}', email));

export const broadcastEmailTemplate = ({ subject, body, email }: { subject: string; body: string; email: string }) =>
  wrapper(`
    <h2 style="margin:0 0 20px;font-size:22px;font-weight:800;color:#111827">${subject}</h2>
    <div style="font-size:15px;color:#374151;line-height:1.8">${body}</div>
  `.replace('{{email}}', email));
