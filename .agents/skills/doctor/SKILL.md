---
name: doctor
description: >-
  /doctor Maliyet & Token Koruyucu: Her işlem ve prompt öncesinde tahmini token tüketimini hesaplama, bütçeyi koruma ve bağlam optimizasyonu sağlama becerisi.
---

# /doctor Token Cost & Health Diagnostic Skill

Bu beceri; yapay zeka ajanının çalışması sırasında token maliyetlerini izlemek, gereksiz bağlam şişmesini tespit etmek ve bütçeyi koruyarak en verimli token/sonuç oranını sağlamak için kullanılır.

## Temel İlkeler ve Kurallar

1. **Bağlam ve Token Tüketim Analizi**
   - Her işlem öncesinde context window'a aktarılacak dosya ve veri miktarını değerlendirin.
   - Devasa dosyaları (loglar, build çıktıları, büyük JSON'lar) bütünüyle okumak yerine `grep_search` veya satır aralığı (`StartLine`/`EndLine`) ile hedef odaklı okuyun.

2. **Maliyet Optimizasyonu Kuralları**
   - Tekrarlanan büyük çıktıları prompt geçmişine eklemekten kaçının.
   - Hata ayıklama veya analizlerde sadece ilgili stack trace ve kod bloklarını işleyin.

3. **Önleyici Sağlık Raporu**
   - Kullanıcı `/doctor` komutunu veya bütçe analizini talep ettiğinde:
     - Mevcut oturumun token durumunu,
     - Bağlamda gereksiz yer kaplayan unsurları,
     - Token tasarrufu için alınabilecek aksiyonları (örneğin dosya filtreleme, `/compact` veya `/handoff` kullanımı) listeleyin.
