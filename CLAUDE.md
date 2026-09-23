# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**DijitalKart (BizCard)** — Gül Yeşil'in (Operation Specialist, data lojistik operasyon alanı) kişisel dijital kartviziti. Bir React + Vite ön yüzü ve bunun arkasında çalışan, n8n ile kurulmuş tam bir otomasyon/AI asistanı backend'inden oluşuyor: kart kaydı ve toplantı talebi webhook'ları, Google Sheets'e kayıt, RAG destekli SSS chatbot'u, Redis ile ziyaretçi bazlı konuşma hafızası, hata bildirimi, MCP üzerinden dış erişim ve n8n API ile otomatik yedekleme/isimlendirme denetimi. Proje "Miuul Claude Code & n8n Bootcamp" ödevi kapsamında uçtan uca (Hafta 0'dan Final'e) geliştirildi.

## Current State & Commands

`package.json` mevcut — proje React + Vite ile yapılandırılmış. Standart Vite komutları:
- `npm install`: bağımlılıkları yükle
- `npm run dev`: geliştirme sunucusu (örn. `http://localhost:5173`)
- `npm run build`: `dist/` klasörüne üretim derlemesi
- `npm run preview`: derlenmiş sürümü önizleme

Lint veya test adımı bulunmuyor (proje kapsamında değil). Orijinal statik HTML versiyonu git geçmişinde (depo ilk commit'inde) `git show <first-commit-sha>:index.html` ile erişilebilir.

n8n backend'i ayrı bir Docker Compose servisi olarak çalışır, ayrıntılar için bkz. "Backend (n8n)" bölümü.

## Architecture — Frontend

- `index.html` — kök sayfa, `#root` div'ine React uygulaması monte edilir.
- `src/main.jsx` — `App.jsx` bileşenini `index.html`'deki `#root`'a bağlar.
- `src/App.jsx` — sabit `profile`/`about`/`links` verileriyle dört sunum bileşenini oluşturur: `ProfileCard` (avatar/ad/unvan/tagline), `AboutSection` (başlık + paragraf), `CardActions` (kart kaydet + toplantı talebi — n8n'e bağlı asıl aktif katman), `ContactLinks` (LinkedIn/GitHub düğmeleri, `icons.jsx`'den inline SVG'ler kullanır). Profil/hakkımda/linkler verileri const olarak tanımlanmış ve bileşenlere prop olarak aktarılmış — ayrı veri dosyası, state yönetimi veya veri getirme yok, statik kişi kartı; dinamik davranış sadece `CardActions` içinde.
- `src/components/CardActions.jsx` — projenin backend'e bağlanan tek noktası:
  - **Kartı Telefonuma Kaydet**: bir modal formu (ad/soyad/e-posta + KVKK onayı) açar, `vcard.js` ile bir `.vcf` dosyası indirtir ve aynı anda `{ event: 'card.save', ...form, timestamp }` payload'ını `WEBHOOK_URLS.cardSave`'e POST eder.
  - **Toplantı Talep Et**: bir modal formu (ad/e-posta/tercih edilen tarih-saat/not + KVKK onayı) açar, `{ event: 'meeting.request', ...form, timestamp }` payload'ını `WEBHOOK_URLS.meetingRequest`'e POST eder.
  - İki webhook da n8n tarafında aynı tek URL'e gider (Switch node `event` alanına göre ayırır) — kod tarafında ayrı env değişkenleriyle tanımlı olması yalnızca esneklik için, production'da ikisi de aynı adrese işaret eder.
  - `postToWebhook`: bilinçli olarak `mode: 'no-cors'` + `Content-Type: text/plain;charset=UTF-8` kullanır — bu, isteği bir CORS "simple request" yapıp tarayıcının preflight `OPTIONS` kontrolüne takılmasını engeller (n8n varsayılan olarak `Access-Control-Allow-*` header'ları döndürmez). Bedeli: yanıt "opaque" olduğu için gerçek HTTP durum kodu okunamaz, sadece isteğin gönderilip gönderilemediği (`fetch` promise'inin resolve/reject olması) bilinir.
  - `nowInTurkey()`: `Europe/Istanbul` saat diliminde `YYYY-MM-DDTHH:mm:ss` formatlı timestamp üretir (`toISOString()` UTC verdiği için Sheet'te kafa karıştırmasın diye eklendi).
  - `useRateLimit(10000)`: her iki gönder butonu için 10 saniyelik client-side cooldown (basit rate limiting; JWT/sunucu taraflı doğrulama yok, bilinçli olarak atlandı — proje kapsamında admin/korumalı alan yok).
- `src/components/PrivacyPolicy.jsx`, `src/components/Modal.jsx` — KVKK açık rıza metni ve genel amaçlı modal kabuğu.
- `src/utils/vcard.js` — `profile` verisinden bir vCard (`.vcf`) metni üretir ve indirtir.
- `src/config.js` — `WEBHOOK_URLS` (`VITE_WEBHOOK_CARDSAVE_URL`, `VITE_WEBHOOK_MEETING_URL`), `.env`'den okunur; `.env.example` şablonu repoda, gerçek `.env`/`.env.local` gitignore'lu.
- `src/index.css` — orijinal statik sayfadan aktarılan global stiller, açık/koyu tema desteği (`prefers-color-scheme`) ve 400px'te responsive kesinti noktası.

## Architecture — Backend (n8n)

n8n, `n8n/docker-compose.yml` ile ayrı bir Docker container'da (`n8n-bizcard`, image `n8nio/n8n:latest`, port `5679:5678` — host:container, container İÇİNDE her zaman 5678'de dinler) çalışır. Kalıcı veri (workflow'lar, credential'lar, `database.sqlite`, yedekleme dosyaları) `n8n_bizcard_data` adlı named volume'da (`/home/node/.n8n`) tutulur. Ortam değişkenleri:
- `GENERIC_TIMEZONE=Europe/Istanbul`, `TZ=Europe/Istanbul` — tüm zaman ifadeleri (`$now`, Schedule Trigger vb.) Türkiye saatiyle çalışır.
- `WEBHOOK_URL=http://localhost:5679/` — üretilen production webhook URL'lerinin base'i.
- `N8N_RESTRICT_FILE_ACCESS_TO=/home/node/.n8n/backups` — dosya node'larının (Read/Write Files from Disk vb.) erişebileceği tek klasör; boş bırakılırsa n8n 2.0+ varsayılanı sadece `~/.n8n-files`'tır.
- `N8N_BLOCK_FILE_ACCESS_TO_N8N_FILES=false` — `N8N_RESTRICT_FILE_ACCESS_TO` içeriğinden BAĞIMSIZ, `~/.n8n` klasörünü (credential/db) her zaman engelleyen ayrı bir bayrak; `backups` alt klasörüne yazabilmek için `false` yapılması zorunlu (bkz. aşağıdaki gotcha).

**Aktif (Active) workflow'lar:**
- **"BizCard Asistanı"** — Final Görev'in TEK/merkezi workflow'u, eski adıyla "BizCard - Günlük Özet". Tek canvas'ta: Webhook (kart/toplantı formlarından, `event` alanına göre Switch ile ayrılır) → Sheets kaydı → acil toplantı talebi için Gmail uyarısı; Manual/Execute-Workflow trigger'lı günlük özet zinciri (Sheets → Merge → Code → AI Agent); Chat Trigger'lı AI Agent (Google Gemini `gemini-3.6-flash`, Redis Chat Memory, RAG için Simple Vector Store retrieve-as-tool, iki ayrı Google Sheets tool). Settings → Error Workflow → "BizCard - Hata Bildirimi"ne bağlı.
- **"BizCard - Ortak Yardımcılar"** — sub-workflow, webhook'un raw text/plain body'sini JSON'a çeviren ortak mantığı barındırır, "BizCard Asistanı" tarafından Execute Sub-workflow ile çağrılır.
- **"BizCard - Hata Bildirimi"** — global Error Workflow (Error Trigger → Google Sheets "Hata Logu"), diğer workflow'ların Settings → Error Workflow alanından bağlanır.
- **"BizCard - MCP Server"** — elle kurulmuş MCP Server Trigger + Call n8n Workflow Tool ("Günlük Özet İstatistiklerini Getir"), n8n'in resmi Instance-level MCP özelliğinden bağımsız öğretici bir alternatif.
- **"BizCard - Yedekleme ve Denetim"** — her gece yarısı (Schedule Trigger) n8n'in kendi Public API'sini ("n8n" node, Resource: Workflow, Get Many) sorgular, her workflow adının "BizCard" ile başlayıp başlamadığını denetler (gevşek isimlendirme kuralı), her workflow'u ayrı bir tarihli JSON dosyası olarak (`<workflowAdı>_<tarih>.json`) `/home/node/.n8n/backups/` altına yazar. Final sunumundan sonra elle Inactive yapılması planlanıyor.

**Inactive (devre dışı, referans için duran) workflow'lar:**
- **"BizCard - Webhook Test"** — webhook dalı "BizCard Asistanı"na taşındı.
- **"BizCard - SSS Chatbot"** — AI Agent + RAG + hafıza dalı "BizCard Asistanı"nda yeniden kuruldu; doküman yükleme (Manual Trigger) dalı yeni bir SSS/Hizmet dokümanı eklemek gerektiğinde elle çalıştırılabilir.

**Bağlı servisler:**
- **Redis** — ayrı container `n8n-redis` (`redis:latest`, `--appendonly yes`), `n8n-bizcard` ile ortak `n8n-network` Docker network'ünde, Host: `n8n-redis` (container adı hostname gibi çözülüyor), Port `6379`. AI Agent'a Redis Chat Memory olarak bağlı (Session ID Chat Trigger'dan otomatik, TTL=0/süresiz, Context Window=5).
- **Google Sheets/Gmail** — `darkness.fener018@gmail.com` hesabı, Google Cloud projesi `n8n-bizcard`, OAuth Client ID/Secret; her iki servisin API'si Cloud Console'da ayrı ayrı Enable edilmiş olmalı.
- **Gemini API** — aynı hesap, Google AI Studio; chat modeli `gemini-3.6-flash`, embeddings `models/gemini-embedding-001`.
- **n8n API Key** — Settings → n8n API'den oluşturuldu, "n8n account" credential'ına bağlı (Base URL: `http://localhost:5678/api/v1` — container içi port + `/api/v1` şart), "BizCard - Yedekleme ve Denetim" workflow'unda kullanılıyor.
- **Instance-level MCP** — etkin, sadece "BizCard Asistanı" MCP'ye açık; canlı harici istemci testi (ngrok tüneli gerektirdiği için) final'e ertelendi.

## Önemli gotcha'lar (n8n ile çalışırken)

- **CORS için `text/plain`:** Webhook node'unda **Options → Raw Body** açık olmalı; hemen ardından bir Code node body'yi elle `JSON.parse` ile ayrıştırıyor (n8n varsayılan olarak sadece `application/json` body'lerini otomatik ayrıştırır).
- **Container içi port ≠ host portu:** n8n container'ın kendi İÇİNDEN kendi API'sine (`localhost`) bağlanan herhangi bir node, docker-compose'daki CONTAINER tarafı portunu (`5678`) kullanmalı, host tarafı portunu (`5679`) değil.
- **n8n Public API `/api/v1` gerektirir:** credential'ın Base URL'i bu son eki otomatik eklemiyor, elle yazılmalı (`http://localhost:5678/api/v1`).
- **"Convert to File" node `$json`'ı ezer:** bu node'dan sonra orijinal veriye ulaşmak için `$('<önceki node adı>').item.json.<alan>` kullanılmalı; Mode ayarı (**Each Item to Separate File** vs. All Items to One File) çıktı dosya sayısını belirler.
- **Dosya erişimi iki bağımsız katmanla kısıtlı:** `N8N_RESTRICT_FILE_ACCESS_TO` (allowlist) ve `N8N_BLOCK_FILE_ACCESS_TO_N8N_FILES` (varsayılan `true`, `~/.n8n` klasörünü her zaman engeller) — `~/.n8n` altına yazmak için ikisi birlikte doğru ayarlanmalı.
- **Merge node'da Combine ≠ Append:** iki farklı kaynaktan gelen satırları uç uca eklemek için **Append**, alan bazında eşleştirip yan yana koymak için **Combine** kullanılmalı — Combine + "Combining All Inputs" kartezyen çarpım üretir.
- **AI Agent (LangChain) node'larının metin alanlarında `{{ }}` Fixed modda çalışmayabilir:** gerekiyorsa alanı **Expression** moduna geçirip içeriği tam bir JS template literal olarak yazmak gerekir.
- **Bir workflow'un işlevi başka workflow'a taşınınca eski workflow otomatik devre dışı kalmaz** — elle Inactive yapılmalı (webhook path çakışması veya duplicate AI Agent riskine karşı).
- **`docker exec` interaktif olmayan bir shell'den `-it` bayraklarıyla çağrılırsa "not a TTY" hatası verir** — otomasyon/script bağlamında `-it` kullanılmamalı.

## Bilinçli olarak atlanan/ertelenen şeyler

- JWT/sunucu taraflı kimlik doğrulama — projede admin/korumalı alan yok, sadece client-side rate limiting var.
- Expo/React Native mobil port, QR kod — final teslim önceliği gereği atlandı.
- n8n'in internete açılması (ngrok/Cloudflare Tunnel) — hem Vercel'in canlı sitesinin n8n'e bağlanması hem de MCP'nin harici istemcilerce (Claude gibi) kullanılabilmesi için gerekli, final teslime kadar ertelendi.

Daha fazla ayrıntı (tüm mimari kararlar, hafta hafta ilerleme, çözülen 28 teknik zorluk) için proje kapsamındaki `yol-haritasi.md` dokümanına bakılabilir.
