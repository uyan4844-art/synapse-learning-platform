---
name: handoff
description: >-
  /handoff Oturum Devri: Yeni bir sohbet veya çalışma oturumuna geçerken sadece en kritik ilerleme özetini, kararları ve sonraki adımları aktarma yönergeleri.
---

# /handoff Session Handover Skill

Bu beceri; bir oturumdan diğerine veya farklı bir geliştiriciye/göreve geçerken projenin mevcut durumu, tamamlanan işler ve açıkta kalan sonraki görevleri en temiz ve yapılandırılmış formatta aktarmayı sağlar.

## Temel İlkeler ve Kurallar

1. **Handoff Protokolü Yapısı**
   - Handoff belgesi veya çıktısı mutlaka şu bölümleri içermelidir:
     - **🎯 Hedef & Kapsam:** Oturumun ana amacı neydi?
     - **✅ Tamamlananlar:** Hangi dosyalar oluşturuldu veya değiştirildi?
     - **🧠 Alınan Kararlar:** Hangi kritik mimari veya teknik tercihler yapıldı?
     - **⚠️ Bilinen Sorunlar / Riskler:** Varsa bekleyen uyarılar veya kırılma noktaları.
     - **🚀 Sıradaki İlk 3 Görev:** Yeni oturumun doğrudan başlayacağı somut işler.

2. **Kritik Dosya Referansları**
   - Yeni oturumda ajanın doğrudan açıp incelemesi gereken dosya yollarını (`file:///...`) eksiksiz listeleyin.

3. **Gereksiz Ayrıntılardan Arındırma**
   - Sohbet içi geçici denemeleri, ara soru-cevapları ve ham hata çıktılarını aktarmayın; yalnızca nihai ve doğrulanmış bilgi durumunu devredin.
