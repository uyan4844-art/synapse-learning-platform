---
name: gsap-skills
description: >-
  GSAP uzmanlığı: Zaman çizelgesi (Timeline) animasyonları, ScrollTrigger entegrasyonu, SplitText / metin efektleri, morphing ve ultra akıcı mikro-etkileşimler.
---

# GSAP (GreenSock) Animation Skill

Bu beceri, web projelerinde yüksek kare hızında (60+ FPS), kesintisiz, dinamik ve etkileşimli kullanıcı arayüzü animasyonları geliştirmek için rehberlik sağlar.

## Temel İlkeler ve Kurallar

1. **Zaman Çizelgesi Yönetimi (Timeline Management)**
   - Bağımsız `gsap.to` çağrıları yerine karmaşık sahneler için daima `gsap.timeline({ defaults: { ... } })` kullanın.
   - Pozisyon parametrelerini (`"<"`, `"+=0.2"`, `"-=0.5"`) kullanarak animasyonlar arası kusursuz geçişler oluşturun.

2. **ScrollTrigger Entegrasyonu**
   - Kaydırmaya bağlı animasyonlar için `ScrollTrigger` eklentisini kaydedin (`gsap.registerPlugin(ScrollTrigger)`).
   - `scrub: true` veya `scrub: 1` (smooth scrub) ile kaydırma hızına bağlı akışlar yaratın; `pin: true` ile görsel bölümleri sabitleyerek hikaye anlatımı oluşturun.

3. **Metin & Tipografi Animasyonları**
   - Karakter, kelime ve satır bazlı metin efektleri için `SplitText` benzeri yaklaşımlarla kademeli (`stagger`) girişler sağlayın.
   - Doğal yumuşatma eğrileri (`power3.out`, `power4.out`, `expo.out`, `back.out(1.7)`) uygulayın.

4. **Performans ve Temizlik**
   - Animasyonlarda CSS reflow/repaint tetikleyen `top/left/width/height` yerine GPU hızlandırmalı `x`, `y`, `scale`, `rotation`, `autoAlpha` özelliklerini dönüştürün.
   - React/Next.js ortamlarında `useGSAP()` hook'unu veya bileşen unmount anında `ctx.revert()` / `timeline.kill()` metodlarını eksiksiz çağırın.
