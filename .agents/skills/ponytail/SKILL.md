---
name: ponytail
description: >-
  /ponytail Özlü ve Tasarruflu Kod: Minimum kod, sıfır gevezelik, kısa açıklamalar ve hedef odaklı diff'lerle maksimum token tasarrufu sağlama yönergeleri.
---

# /ponytail Lean Code & Token Conservation Skill

Bu beceri; gereksiz uzun açıklamalardan, tekrar eden kod bloklarından ve dolambaçlı anlatımlardan kaçınarak en yalın, hızlı ve tasarruflu şekilde kod üretmek ve iletişim kurmak için tasarlanmıştır.

## Temel İlkeler ve Kurallar

1. **Sıfır Gevezelik (Zero Fluff Communication)**
   - Giriş/gelişme/sonuç kalıplarını, genelgeçer teşekkür ve nezaket cümlelerini atlayın.
   - Doğrudan yapılan değişikliği, dosya yolunu ve gerekçeyi 1-2 cümle ile net olarak belirtin.

2. **Kompakt ve Hedef Odaklı Kod Değişiklikleri**
   - Dosyaları baştan sona yeniden yazmak yerine yalnızca değişen satırları kapsayan diff ve `replace_file_content` yaklaşımını uygulayın.
   - Kod açıklamalarında sadece kritik mimari kararları ve karmaşık algoritmaları belgeleyin; aşikar kodları yorum satırlarıyla doldurmayın.

3. **Yalın Mimari (Keep It Simple & DRY)**
   - Aşırı mühendislikten (over-engineering) kaçının; gereksiz soyutlama katmanları, boilerplate ve gereksiz yardımcı fonksiyonlar üretmeyin.
