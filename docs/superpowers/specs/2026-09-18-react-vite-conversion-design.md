# Statik Kartviziti React + Vite Projesine Dönüştürme

## Context
Mevcut `index.html`, Gül Yeşil için tek dosyalık, dahili CSS'li statik bir dijital kartvizit sayfası. Kullanıcı, görsel tasarımı ve içeriği birebir koruyarak bunu bir React + Vite projesine, mantıklı bileşenlere bölerek taşımak istiyor: `ProfileCard`, `AboutSection`, `ContactLinks`. Bu, projeye yeni bir build/araç zinciri (Vite, React, npm) getirdiği için mevcut kod tabanında değiştirilecek bir akış yok — yeni bir alt sistem kuruluyor.

## Approach
Proje dili: **JavaScript** (kullanıcı onayı ile, TypeScript'e gerek yok — statik, tip karmaşıklığı olmayan bir kart).

### Kurulum
`npm create vite@latest . -- --template react` ile mevcut `DijitalKart` klasöründe (doğrudan kök dizinde) bir Vite React (JS) projesi oluşturulacak. Vite'ın oluşturduğu `index.html`, React uygulamasının giriş noktası olacak (`<div id="root">`, `<script type="module" src="/src/main.jsx">`); eski statik `index.html`'in `<head>` bilgileri (title, meta description, `lang="tr"`) yeni `index.html`'e taşınacak.

### Dosya/Klasör Yapısı
```
src/
  main.jsx
  App.jsx
  index.css
  components/
    ProfileCard.jsx
    AboutSection.jsx
    ContactLinks.jsx
```

### Bileşenler
- **ProfileCard** — avatar (baş harfler), isim (`h1`), unvan (`lang="en"` korunur, `text-transform: uppercase` CSS'te kalır), slogan. Props: `initials, name, title, tagline`.
- **AboutSection** — "Hakkımda" başlığı (`h2`) ve paragraf. Props: `heading, text`.
- **ContactLinks** — LinkedIn ve GitHub butonları. Props: `links` — `[{ label, href, variant, Icon }]` şeklinde bir dizi; her link için mevcut inline SVG ikonları küçük bileşen fonksiyonları olarak (`LinkedinIcon`, `GithubIcon`) aynı dosyada veya `icons.jsx` içinde tutulur ve `Icon` prop'u olarak geçirilir.

`App.jsx`, bu üç bileşeni orijinal `<main class="card">` yapısını birebir koruyacak şekilde birleştirir: `ProfileCard` → `<hr className="divider">` → `AboutSection` → `ContactLinks`. Profil verileri (`isim`, `unvan`, `slogan`, `hakkımda metni`, `linkler`) `App.jsx` içinde sabit değişkenler olarak tanımlanır ve prop olarak geçirilir (ayrı bir veri dosyası, tek kişilik statik bir kart için gereksiz soyutlama olacağından eklenmez).

### CSS
Mevcut `<style>` bloğundaki tüm kurallar (CSS custom properties, `.card`, `.avatar`, `h1`, `.title`, `.tagline`, `.divider`, `.about h2/p`, `.contact`, `.btn` ve varyantları, `@media (max-width: 400px)`, `@media (prefers-color-scheme: dark)`) değiştirilmeden `src/index.css`'e taşınır ve `main.jsx` içinde `import './index.css'` ile yüklenir. Class adları JSX'te `className` olarak birebir korunur — bu, görsel çıktının piksel bazında aynı kalmasını garanti eder.

### Erişilebilirlik ve Davranış
- `aria-hidden`, `aria-label`, `target="_blank" rel="noopener noreferrer"`, `lang="en"` gibi tüm mevcut nitelikler bileşenlere birebir taşınır.
- Responsive (mobil-öncelikli, 400px altı media query) ve dark-mode (`prefers-color-scheme`) davranışı saf CSS olduğundan React'e geçişten etkilenmez.

## Files
- `package.json`, `vite.config.js` — Vite scaffolding (otomatik oluşturulur)
- `index.html` — Vite giriş noktası (yeniden yazılır)
- `src/main.jsx` — React mount + CSS import
- `src/App.jsx` — üç bileşeni birleştiren kök bileşen + statik veri
- `src/index.css` — mevcut `<style>` içeriğinin birebir taşınmış hali
- `src/components/ProfileCard.jsx`
- `src/components/AboutSection.jsx`
- `src/components/ContactLinks.jsx`
- Eski `index.html` (statik versiyon) Vite kurulumu sırasında Vite'ın kendi `index.html`'i ile değiştirilir; içeriği yukarıdaki bileşenlere taşındığı için ayrıca saklanmaz.

## Verification
- `npm install` ve `npm run dev` ile geliştirme sunucusu başlatılır.
- Tarayıcıda masaüstü (≥1280px) ve mobil (≤400px, DevTools responsive mode) genişliklerde ekran görüntüsü alınarak orijinal statik sayfayla görsel karşılaştırma yapılır.
- LinkedIn ve GitHub butonlarının doğru URL'lere, yeni sekmede açıldığı doğrulanır.
- Sistem dark mode açıkken renklerin orijinal sayfayla aynı şekilde değiştiği kontrol edilir.
