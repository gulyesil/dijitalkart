import { useState } from 'react';
import Modal from './Modal.jsx';

export default function PrivacyPolicyLink({ contactEmail }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="link-button"
        onClick={(event) => {
          // Stop the click from bubbling to the wrapping <label> — otherwise the
          // browser's default label-click forwarding also toggles the consent
          // checkbox, letting a user "accept" just by opening the policy.
          event.stopPropagation();
          setOpen(true);
        }}
      >
        Gizlilik Politikası
      </button>
      {open && (
        <Modal title="Gizlilik Politikası" ariaLabel="Gizlilik politikası" onClose={() => setOpen(false)}>
          <div className="privacy-policy-content">
            <h3>Hangi veriler toplanıyor?</h3>
            <p>
              "Kartı Telefonuma Kaydet" formunda ad, soyad ve e-posta adresi; "Toplantı Talep Et" formunda ad, e-posta
              adresi, tercih edilen tarih/saat ve varsa eklediğiniz kısa not toplanır.
            </p>

            <h3>Hangi amaçla işleniyor?</h3>
            <p>
              Bu veriler, kartviziti kaydettiğinizde kimin kaydettiğini belirlemek; toplantı talebinde ise talebinizi
              değerlendirmek ve sizinle iletişime geçmek amacıyla işlenir.
            </p>

            <h3>Kiminle paylaşılıyor?</h3>
            <p>Veriler, talebin işlenmesi için kullanılan bir n8n/otomasyon iş akışına iletilir. Üçüncü bir tarafa satılmaz veya pazarlama amacıyla paylaşılmaz.</p>

            <h3>Ne kadar süre saklanıyor?</h3>
            <p>Veriler, ilgili talebin değerlendirilmesi ve sonuçlandırılması için gerekli süre boyunca saklanır; bu sürenin sonunda silinir.</p>

            <h3>Haklarınız (KVKK m. 11)</h3>
            <p>
              6698 sayılı Kişisel Verilerin Korunması Kanunu'nun 11. maddesi kapsamında, kişisel verilerinizin işlenip
              işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, verilerinizin düzeltilmesini veya
              silinmesini isteme haklarına sahipsiniz. Bu haklarınızı kullanmak için{' '}
              {contactEmail ? <a href={`mailto:${contactEmail}`}>{contactEmail}</a> : 'iletişim e-postamız'} adresinden
              bize ulaşabilirsiniz.
            </p>
          </div>
        </Modal>
      )}
    </>
  );
}
