# 📱 Odaklanma Takip Uygulaması (Focus Tracker App)

Bu proje, kullanıcıların günlük odaklanma sürelerini takip etmesini, dikkat dağınıklıklarını kaydetmesini ve geçmiş seanslara yönelik istatistikler görmesini sağlayan bir mobil uygulamadır. Uygulama **React Native – Expo** kullanılarak geliştirilmiştir ve ödev gereksinimlerini tam olarak karşılamaktadır.

---

## 🚀 Özellikler

### 🎯 **1. Odaklanma Seansı Başlatma**
- 25, 45 veya 60 dakikalık odaklanma süreleri seçilebilir.
- Ders, Kodlama, Kitap, Proje gibi kategoriler arasından seçim yapılabilir.
- Zamanlayıcı başlatılabilir, duraklatılabilir veya sıfırlanabilir.

### ⚠️ **2. Dikkat Dağınıklığı Takibi**
- Uygulamadan çıkıldığında (AppState “inactive/ background”) dikkat dağınıklığı sayılır.
- Kullanıcı uygulamaya döndüğünde sayaç devam edip etmeyeceğini seçebilir.

### 🧾 **3. Seans Özeti**
Her tamamlanan odaklanma seansı için:
- Geçen süre
- Kategori
- Dikkat dağınıklığı sayısı  
bir modal pencerede gösterilir ve kayıt altına alınır.

### 🗃️ **4. Veri Kaydetme (AsyncStorage)**
- Tüm seanslar cihazda kalıcı olarak saklanır.
- Uygulama kapatılsa bile geçmiş veriler kaybolmaz.

### 📊 **5. Raporlar (Dashboard) Ekranı**
Kayıtlı veriler kullanıcıya görsel ve anlamlı şekilde sunulur:

#### **Genel İstatistikler**
- Bugünün toplam odaklanma süresi  
- Tüm zamanların toplam odaklanma süresi  
- Toplam dikkat dağınıklığı sayısı  

#### **Grafikler**
- **Bar Chart:** Son 7 günün odaklanma süreleri (dk bazlı)  
- **Pie Chart:** Kategorilere göre yüzdeli dağılım  

#### **Tüm Seanslar**
- Seans bazlı geçmiş listesi (kategori, süre, dikkat dağınıklığı)

---

## 🧩 Kullanılan Teknolojiler

- **React Native (Expo)**
- **expo-router**
- **TypeScript**
- **AsyncStorage**
- **react-native-chart-kit**
- **Context API (Global State Management)**

---

## 🔮 Gelecekte Yapılabilecek Geliştirmeler

- Kullanıcıya özel hedef belirleme
- Odaklanma seansları için bildirim (push notification)
- Bulut tabanlı senkronizasyon (Firebase)
- Karanlık mod (Dark Mode)
- Haftalık / aylık raporlar


---

## 📁 Proje Dosya Yapısı

```bash
project-root/
│
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx        # Ana ekran (seans başlatma)
│   │   ├── reports.tsx      # Raporlar ekranı
│   │   └── _layout.tsx      # Tab navigasyonu
│   │
│   └── _layout.tsx          # Root layout (Stack Router)
│
├── src/
│   └── context/
│       └── SessionsContext.tsx  # Global seans yönetimi
│
├── assets/
├── README.md
├── app.json
├── package.json
└── tsconfig.json
