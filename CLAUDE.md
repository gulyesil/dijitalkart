# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**DijitalKart (BizCard)** — Gül Yeşil'in (Operation Specialist, data lojistik operasyon alanı) kişisel dijital kartviziti. Şu an tek sayfalık statik bir HTML/CSS kartvizit; planlanan hedef, bunun bir React + Vite uygulamasına dönüştürülmesi ve ileride n8n ile entegre edilerek bir AI asistanına evrilmesidir.

## Current State & Commands

`package.json` mevcut — proje React + Vite ile yapılandırılmış. Standart Vite komutları:
- `npm install`: bağımlılıkları yükle
- `npm run dev`: geliştirme sunucusu (örn. `http://localhost:5173`)
- `npm run build`: `dist/` klasörüne üretim derlemesi
- `npm run preview`: derlenmiş sürümü önizleme

Lint veya test adımı bulunmuyor (proje kapsamında değil). Orijinal statik HTML versiyonu git geçmişinde (depo ilk commit'inde) `git show <first-commit-sha>:index.html` ile erişilebilir.

## Architecture

- `index.html` — kök sayfa, `#root` div'ine React uygulaması monte edilir.
- `src/main.jsx` — `App.jsx` bileşenini `index.html`'deki `#root`'a bağlar.
- `src/App.jsx` — üç sunum bileşenini oluşturur: `ProfileCard` (avatar/ad/unvan/tagline), `AboutSection` (başlık + paragraf), `ContactLinks` (LinkedIn/GitHub düğmeleri, `icons.jsx`'den inline SVG'ler kullanır). Profil/hakkımda/linkler verileri konsts olarak tanımlanmış ve bileşenlere prop olarak aktarılmış — ayrı veri dosyası, state yönetimi veya veri getirme yok, statik kişi kartı.
- `src/index.css` — orjinal statik sayfadan aktarılan global stiller, açık/koyu tema desteği (`prefers-color-scheme`) ve 400px'te responsive kesinti noktası.
