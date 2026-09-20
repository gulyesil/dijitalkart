import { useEffect, useState } from 'react';
import { WEBHOOK_URLS } from '../config.js';
import { buildVCard, downloadVCard } from '../utils/vcard.js';
import { SaveIcon, CalendarIcon } from './icons.jsx';
import Modal from './Modal.jsx';
import PrivacyPolicyLink from './PrivacyPolicy.jsx';

function StatusMessage({ status }) {
  if (!status) return null;
  return (
    <p className={`status-msg status-${status.type}`} role="status">
      {status.type === 'success' ? 'Gönderildi ✓' : "Webhook'a ulaşılamadı ⚠"}
    </p>
  );
}

async function postToWebhook(url, payload) {
  // no-cors + text/plain keeps this a CORS "simple request" so it isn't blocked by a
  // preflight OPTIONS check — most webhook receivers (n8n, webhook.site, Zapier, ...)
  // don't return Access-Control-Allow-* headers, which would otherwise stop the browser
  // from ever sending the real POST. The response is opaque, so we can't read status;
  // a resolved promise means the request was sent, a rejection means it never left the browser.
  await fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
    body: JSON.stringify(payload),
  });
}

function useAutoClearStatus(status, setStatus) {
  useEffect(() => {
    if (!status) return undefined;
    const timer = setTimeout(() => setStatus(null), 4000);
    return () => clearTimeout(timer);
  }, [status, setStatus]);
}

function useRateLimit(durationMs) {
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (!disabled) return undefined;
    const timer = setTimeout(() => setDisabled(false), durationMs);
    return () => clearTimeout(timer);
  }, [disabled, durationMs]);

  return [disabled, () => setDisabled(true)];
}

function SaveCardModal({ onClose, onSubmit, status, contactEmail }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });
  const [consent, setConsent] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <Modal title="Kartı Telefonuma Kaydet" ariaLabel="Kartı kaydet formu" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <label>
          Ad
          <input type="text" name="firstName" value={form.firstName} onChange={handleChange} required />
        </label>
        <label>
          Soyad
          <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required />
        </label>
        <label>
          E-posta
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label className="consent-label">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
          Kişisel verilerimin <PrivacyPolicyLink contactEmail={contactEmail} />'nda açıklanan şekilde işlenmesini kabul
          ediyorum.
        </label>
        <StatusMessage status={status} />
        <button type="submit" className="btn btn-modal-submit" disabled={!consent}>
          Kartı İndir
        </button>
      </form>
    </Modal>
  );
}

function MeetingRequestModal({ onClose, onSubmit, status, contactEmail }) {
  const [form, setForm] = useState({ name: '', email: '', preferredDateTime: '', note: '' });
  const [consent, setConsent] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <Modal title="Toplantı Talep Et" ariaLabel="Toplantı talep formu" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <label>
          Ad
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          E-posta
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Tercih edilen tarih/saat
          <input type="datetime-local" name="preferredDateTime" value={form.preferredDateTime} onChange={handleChange} required />
        </label>
        <label>
          Kısa konu/not
          <textarea name="note" value={form.note} onChange={handleChange} rows={3} />
        </label>
        <label className="consent-label">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required />
          Kişisel verilerimin <PrivacyPolicyLink contactEmail={contactEmail} />'nda açıklanan şekilde işlenmesini kabul
          ediyorum.
        </label>
        <StatusMessage status={status} />
        <button type="submit" className="btn btn-modal-submit" disabled={!consent}>
          Gönder
        </button>
      </form>
    </Modal>
  );
}

export default function CardActions({ profile }) {
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [meetingModalOpen, setMeetingModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [meetingStatus, setMeetingStatus] = useState(null);
  const [saveButtonDisabled, disableSaveButton] = useRateLimit(10000);
  const [meetingButtonDisabled, disableMeetingButton] = useRateLimit(10000);

  useAutoClearStatus(saveStatus, setSaveStatus);
  useAutoClearStatus(meetingStatus, setMeetingStatus);

  async function handleSaveSubmit(form) {
    const vcardText = buildVCard(profile);
    downloadVCard(vcardText, `${profile.name.replace(/\s+/g, '-')}.vcf`);

    try {
      await postToWebhook(WEBHOOK_URLS.cardSave, {
        event: 'card.save',
        ...form,
        timestamp: new Date().toISOString(),
      });
      setSaveStatus({ type: 'success' });
      setSaveModalOpen(false);
    } catch {
      setSaveStatus({ type: 'error' });
    }
  }

  async function handleMeetingSubmit(form) {
    try {
      await postToWebhook(WEBHOOK_URLS.meetingRequest, {
        event: 'meeting.request',
        ...form,
        timestamp: new Date().toISOString(),
      });
      setMeetingStatus({ type: 'success' });
      setMeetingModalOpen(false);
    } catch {
      setMeetingStatus({ type: 'error' });
    }
  }

  return (
    <>
      <div className="card-actions">
        <button
          type="button"
          className="btn btn-save"
          disabled={saveButtonDisabled}
          onClick={() => {
            disableSaveButton();
            setSaveModalOpen(true);
          }}
        >
          <SaveIcon />
          Kartı Telefonuma Kaydet
        </button>
        {!saveModalOpen && <StatusMessage status={saveStatus} />}

        <button
          type="button"
          className="btn btn-meeting"
          disabled={meetingButtonDisabled}
          onClick={() => {
            disableMeetingButton();
            setMeetingModalOpen(true);
          }}
        >
          <CalendarIcon />
          Toplantı Talep Et
        </button>
        {!meetingModalOpen && <StatusMessage status={meetingStatus} />}
      </div>

      {saveModalOpen && (
        <SaveCardModal
          onClose={() => setSaveModalOpen(false)}
          onSubmit={handleSaveSubmit}
          status={saveStatus}
          contactEmail={profile.email}
        />
      )}
      {meetingModalOpen && (
        <MeetingRequestModal
          onClose={() => setMeetingModalOpen(false)}
          onSubmit={handleMeetingSubmit}
          status={meetingStatus}
          contactEmail={profile.email}
        />
      )}
    </>
  );
}
