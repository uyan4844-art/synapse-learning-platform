---
name: design-dna
description: >-
  Design DNA analizi: Marka tasarımı ayrıştırma, modern tipografi hiyerarşisi, renk paleti adaptasyonları, boşluk ve grid kuralları ile tutarlı tasarım dili oluşturma.
---

# Design DNA Skill

Bu beceri, ürünlerin veya marka kimliklerinin görsel DNA'sını analiz etmek, ayrıştırmak ve sıfırdan modern, tutarlı ve uyumlu tasarım sistemleri inşa etmek için kullanılır.

## Temel İlkeler ve Kurallar

1. **Tipografi Hiyerarşisi (Typography Hierarchy)**
   - Standart sistem yazı tipleri yerine Google Fonts (Inter, Plus Jakarta Sans, Outfit, Syne, Clash Display vb.) seçin.
   - Orantılı tipografi ölçeği (örneğin Major Third 1.25 veya Perfect Fourth 1.33) kullanarak `h1`'den `small`'a kadar katı bir font-size ve line-height dengesi kurun.

2. **Renk Paleti Adaptasyonu ve Anlamı**
   - Rastgele renk seçiminden kaçının. 60-30-10 kuralını (Dominant %60, İkincil %30, Vurgu/Accent %10) uygulayın.
   - HSL/OKLCH renk uzayları kullanarak karanlık ve aydınlık modlara mükemmel uyum sağlayan semantik renk token'ları (`--bg-surface`, `--text-primary`, `--accent-glow`) tanımlayın.

3. **Boşluk & Grid Sistemi (Spacing & Layout Rhythm)**
   - 4px/8px tabanlı boşluk cetveli kullanın (`gap-1` = 4px, `gap-2` = 8px, `gap-4` = 16px, `gap-6` = 24px).
   - İçerik yoğunluğuna göre ritmik dikey ve yatay aralıkları koruyun.

4. **Tasarım Dili ve Bileşen Bütünlüğü**
   - Kenar yuvarlaklıkları (`border-radius`), gölgeler (`box-shadow`), cam efektleri (`backdrop-filter`) ve kenarlık opaklıklarında tek bir tasarım temasını sürdürün.
