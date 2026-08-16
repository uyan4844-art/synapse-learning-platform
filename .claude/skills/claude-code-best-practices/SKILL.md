---
name: claude-code-best-practices
description: Shanraisshan/Claude-code-Best-Practice deposuna dayanan; Vibe Coding'den Ajan Mühendisliği'ne geçiş ilkelerini, modüler mimariyi, kilitlenmeyen async/LLM akışlarını ve test edilebilir kodlama standartlarını içerir.
---

# Claude Code & Agentic Engineering Best Practices

## 1. Vibe Coding'den Ajan Mühendisliği'ne (Principles)
- **Rastgele Kod Üretimini Engelle:** İş parçacıklarını küçük, bağımsız ve adımlı (iterative) görevlere böl.
- **Tek Sorumluluk İlkesi (SRP):** UI katmanı ile iş mantığını (business logic) kesinlikle ayır.
- **Önce Şema ve Tür:** Kod geliştirmeye başlamadan önce Zod şemalarını ve TypeScript interface tanımlarını netleştir.

## 2. LLM / AI API Entegrasyon Standartları (Timeout & Reliability)
- **Kilitlenmeyen Akışlar:** AI yanıtları beklenirken kullanıcının dondurulmasını engelle. Aşamalı yükleme durumları (Stepped progress) göster.
- **Süre Sınırı (Timeout Guard):** Gemini ve Supabase çağrılarına maximum 25 saniyelik `AbortController` zaman aşımı koy.
- **Yeniden Deneme (Retry):** Zaman aşımına uğrayan isteklerde otomatik 1 kez yeniden dene, başarısız olursa UI'da "Yeniden Dene" butonu çıkar.

## 3. Supabase & Auth Standartları
- **Dinamik Domain Yönetimi:** Auth redirect ve API tanımlarında `window.location.origin` veya `NEXT_PUBLIC_APP_URL` kullan.
- **Doğrulama Güvenliği:** Kayıtlarda e-posta doğrulaması (Email Confirmation) şartı koş.
