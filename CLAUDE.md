# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**DijitalKart (BizCard)** — Gül Yeşil'in (Operation Specialist, data lojistik operasyon alanı) kişisel dijital kartviziti. Şu an tek sayfalık statik bir HTML/CSS kartvizit; planlanan hedef, bunun bir React + Vite uygulamasına dönüştürülmesi ve ileride n8n ile entegre edilerek bir AI asistanına evrilmesidir.

## Current State & Commands

Şu an `package.json` yok — proje tek dosyadan (`index.html`) oluşuyor, build/lint/test adımı gerektirmiyor. Dosya doğrudan bir tarayıcıda açılarak (veya `python -m http.server` gibi basit bir statik sunucuyla) görüntülenebilir.

React + Vite'a geçiş için onaylanmış bir tasarım dokümanı mevcut ama henüz uygulanmadı: `docs/superpowers/specs/2026-09-18-react-vite-conversion-design.md`. Bu geçiş yapıldığında standart Vite komutları (`npm install`, `npm run dev`, `npm run build`) geçerli olacak — o noktada bu dosya güncellenmeli.

## Architecture

- `index.html` — tüm sayfa: dahili `<style>` bloğu (CSS custom properties ile açık/koyu tema desteği, `prefers-color-scheme` üzerinden) ve statik içerik (profil bilgisi, "Hakkımda" bölümü, LinkedIn/GitHub buton linkleri).
- Planlanan React yapısı (spec dosyasında detaylı): `ProfileCard`, `AboutSection`, `ContactLinks` bileşenlerine bölünecek, tek bir global `src/index.css` mevcut stilleri birebir taşıyacak — class adları ve görsel çıktı korunacak.
