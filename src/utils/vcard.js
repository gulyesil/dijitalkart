function escapeVCardValue(value) {
  return value.replace(/([,;\\])/g, '\\$1');
}

export function buildVCard({ name, title, phone, email, linkedinUrl, githubUrl }) {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${escapeVCardValue(name)}`,
    `FN:${escapeVCardValue(name)}`,
    `TITLE:${escapeVCardValue(title)}`,
    `TEL;TYPE=CELL:${phone}`,
    `EMAIL:${email}`,
  ];

  if (linkedinUrl) lines.push(`URL;TYPE=LinkedIn:${linkedinUrl}`);
  if (githubUrl) lines.push(`URL;TYPE=GitHub:${githubUrl}`);

  lines.push('END:VCARD');
  return lines.join('\r\n');
}

export function downloadVCard(vcardText, filename) {
  const blob = new Blob([vcardText], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
