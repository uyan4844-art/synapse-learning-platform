---
name: motion-design-skill
description: >-
  Motion Design uzmanlığı: Lottie ve SVG animasyonları, mikro-etkileşimler, durum geçişleri ve AI destekli hareket iş akışları.
---

# Motion Design Skill

Bu beceri; Lottie, SVG çizgi animasyonları, sayfa geçişleri ve arayüz dinamiklerini kullanıcı deneyimini zenginleştirecek şekilde hayata geçirme standartlarını içerir.

## Temel İlkeler ve Kurallar

1. **Lottie Animasyonları Entegrasyonu**
   - `@dotlottie/player-component` veya `lottie-web` kütüphanelerini performans dostu şekilde yükleyin.
   - Tetikleyici mantığını (hover, click, scroll-in-view) kullanıcı etkileşimiyle senkronize edin ve lüzumsuz sonsuz döngülerden kaçının.

2. **SVG Path & Çizgi Animasyonları**
   - İkonlar ve vektör grafikler için `stroke-dasharray` ve `stroke-dashoffset` manipülasyonlarıyla dinamik çizim efektleri yaratın.
   - Morphing animasyonları için path düğüm sayısı uyumunu gözetin.

3. **Mikro-Etkileşimler & Geri Bildirim**
   - Buton tıklamaları, form doğrulamaları, yükleme durumları (skeleton loaders) ve başarı bildirimlerinde (toast, badge) 150ms-300ms aralığında hissettiren organik animasyonlar kullanın.

4. **Erişilebilirlik ve Performans**
   - Kullanıcının hareket kısıtlama tercihini (`prefers-reduced-motion: reduce`) her zaman denetleyin ve gerektiğinde hareketleri yumuşatın veya devre dışı bırakın.
   - `will-change: transform, opacity` optimizasyonunu yalnızca animasyon anında uygulayın.
