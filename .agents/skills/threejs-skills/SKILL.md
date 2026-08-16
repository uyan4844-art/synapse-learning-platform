---
name: threejs-skills
description: >-
  Three.js uzmanlığı: Etkileşimli 3D sahneler, parçacık (particle) efektleri, gölgelendiriciler (shaders), kamera kontrolleri, 3D model optimizasyonu ve WebGL render performans yönergeleri.
---

# Three.js Expert Skill

Bu beceri, web uygulamalarında üst düzey, yüksek performanslı ve görsel olarak etkileyici 3D deneyimler oluşturmak için rehberlik ve standartlar sunar.

## Temel İlkeler ve Kurallar

1. **Sahne ve Render Kurulumu**
   - Her zaman pencere yeniden boyutlandırmasını (`resize` event listener) yönetin ve `pixelRatio` değerini `Math.min(window.devicePixelRatio, 2)` olarak sınırlandırın (performans optimizasyonu).
   - Antialias desteği ve uygun ton haritalama (`ACESFilmicToneMapping`) ve renk uzayı (`SRGBColorSpace`) kullanın.
   - Sahne temizliği ve bellek sızıntılarını önlemek için kullanılmayan geometri, materyal ve dokuları `dispose()` edin.

2. **Parçacık Efektleri (Particle Systems)**
   - `Points` ve `BufferGeometry` kullanarak GPU tabanlı binlerce parçacığı minimum CPU yüküyle render edin.
   - Özel hareketler ve dinamik etkiler için `ShaderMaterial` veya `gl_PointSize` & vertex shader manipülasyonlarını tercih edin.

3. **Kamera Kontrolleri ve İnteraktivite**
   - `OrbitControls`, `PointerLockControls` veya fare hareketine bağlı yumuşatılmış (`lerp` / damping) kamera takibi sağlayın.
   - Nesne seçimi ve etkileşimi için optimize edilmiş `Raycaster` mekanizmalarını uygulayın.

4. **Model Yükleme & Işıklandırma**
   - GLTF/GLB modelleri için `GLTFLoader` ve `DRACOLoader` entegrasyonu kullanın.
   - Yumuşak gölgeler (`PCFSoftShadowMap`) ve ortam aydınlatması (`AmbientLight` + `DirectionalLight` + `EnvironmentMap`) ile gerçekçi derinlik katın.
