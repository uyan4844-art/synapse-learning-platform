---
name: compact
description: >-
  /compact Bağlam Sıkıştırma: Uzun süren oturumlarda konuşma geçmişini, ara adımları ve gereksiz detayları damıtarak bağlam penceresini rahatlatma ve token yükünü düşürme becerisi.
---

# /compact Context Compression Skill

Bu beceri; çok uzun ve karmaşık oturumlarda konuşma geçmişindeki gereksiz detayları, geçici çıktıları ve ara adımları damıtarak net, öz ve eyleme geçirilebilir bir özet haline getirmek için kullanılır.

## Temel İlkeler ve Kurallar

1. **Bağlam Damıtma (Distillation)**
   - Geçmişteki tüm başarılı adımları, çözülen problemleri ve alınan mimari kararları maddeler halinde sıralayın.
   - Denenen ancak başarısız olmuş ara yolları, tekrarlı terminal çıktılarını ve ham log metinlerini eleyin.

2. **Kritik Durum Matrisi (State Retention)**
   - Mevcut sistem durumunu şu 4 başlıkta özetleyin:
     1. **Tamamlanan Maddeler:** Neler başarıyla yapıldı?
     2. **Aktif Dosyalar:** Değiştirilen kritik dosyalar ve bunların rolleri.
     3. **Mevcut Engel / Problem:** Varsa şu anki hata veya bloklayıcı durum.
     4. **Sonraki Adımlar:** Bir sonraki hamlede yapılacak net aksiyonlar.

3. **Yeniden Yükleme Verimliliği**
   - Oluşturulan kompakt özetin, yeni bir oturumda veya temizlenmiş bağlamda ajanın kaldığı yerden sıfır kayıpla devam etmesini sağlayacak yeterlilikte ve kısalıkta olmasını güvence altına alın.
