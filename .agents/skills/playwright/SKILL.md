---
name: playwright
description: >-
  Playwright otomasyonu: Uçtan uca (E2E) testler, tarayıcı otomasyonu, ekran görüntüsü alma, görsel regresyon ve UI doğrulama iş akışları.
---

# Playwright Browser Automation & Testing Skill

Bu beceri, modern web uygulamalarını uçtan uca (E2E) test etmek, tarayıcı otomasyonu yürütmek, ekran görüntüleri/videolar kaydetmek ve UI doğrulamasını otomatikleştirmek için kullanılır.

## Temel İlkeler ve Kurallar

1. **Güvenilir Seçiciler (Reliable Selectors)**
   - Kırılgan CSS/XPath seçiciler yerine kullanıcı odaklı seçicileri (`page.getByRole`, `page.getByText`, `page.getByLabel`, `page.getByTestId`) tercih edin.
   - Sayfa yüklenmelerini ve dinamik DOM güncellemelerini beklemek için açık bekleme süreleri (`sleep`) yerine `toBeVisible()`, `waitForSelector()` gibi otomatik bekleme (auto-waiting) mekanizmalarını kullanın.

2. **Ekran Görüntüsü ve Görsel Regresyon**
   - Sayfa veya bileşen bazlı ekran görüntüleri için `page.screenshot({ path: '...', fullPage: true })` kullanın.
   - Görsel farkları (visual diff) tespit etmek için `toMatchSnapshot()` assertion'ları uygulayın.

3. **Çoklu Cihaz ve Viewport Testi**
   - Mobil (iPhone, Pixel) ve masaüstü (Desktop Chrome, Safari, Firefox) cihaz emülasyonları ile responsive uyumluluğu doğrulayın.
   - Karanlık ve aydınlık tema tercihlerini (`colorScheme: 'dark'`) test senaryolarında taklit edin.

4. **İzleme ve Hata Ayıklama (Trace & Debugging)**
   - Test hatalarında Playwright Trace Viewer (`page.context().tracing.start(...)`) kayıtlarını etkinleştirin.
   - Ağ isteklerini (Network calls) mock'layarak (`page.route()`) sınır durumları ve hata senaryolarını test edin.
