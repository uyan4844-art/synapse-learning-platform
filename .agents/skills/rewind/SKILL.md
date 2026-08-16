---
name: rewind
description: >-
  /rewind Güvenli Geri Alma: Hatalı uygulanan değişiklikleri, bozuk kod yollarını veya istenmeyen durumları kontrollü ve güvenli şekilde bir önceki stabil noktaya geri alma becerisi.
---

# /rewind State Rollback & Recovery Skill

Bu beceri; yapay zeka tarafından yapılan hatalı yönelimleri, bozuk refactor işlemlerini veya istenmeyen dosya değişikliklerini hızla tespit edip kontrollü olarak temiz bir duruma geri döndürmek için yönergeler sunar.

## Temel İlkeler ve Kurallar

1. **Hata Tespiti ve Etki Analizi**
   - Hatanın hangi commit, diff veya dosya işleminde başladığını net olarak izole edin.
   - Doğrudan projenin çalışan diğer kısımlarını riske atmadan yalnızca bozulmuş dosyaları hedefleyin.

2. **Geri Alma Mekanizmaları (Rollback Strategies)**
   - Git tabanlı projelerde: `git checkout <file>`, `git restore <file>` veya `git revert <commit-hash>` komutlarıyla güvenli dönüş sağlayın.
   - Yapay zeka oturum geçmişindeki diff'leri referans alarak son stabil durumdaki dosya içeriğini hassas biçimde geri yükleyin.

3. **Geri Alma Sonrası Doğrulama**
   - Dosyalar geri alındıktan sonra projenin derlendiğini (build) ve temel testlerin geçtiğini doğrulayın.
   - Kullanıcıya neyin geri alındığını ve sistemin stabil hale geldiğini özetleyen temiz bir durum raporu iletin.
