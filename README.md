<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00e5a0,50:4a9eff,100:c084fc&height=200&section=header&text=Android%20Project%20Collection&fontSize=38&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Moe%20Kyaw%20Aung%20%7C%20Senior%20Android%20Developer&descAlignY=60&descSize=16&descColor=ffffffaa" width="100%"/>

<a href="https://git.io/typing-svg">
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&size=18&duration=2500&pause=600&color=00E5A0&center=true&vCenter=true&multiline=true&width=700&height=80&lines=%F0%9F%93%B1+12+Production-Grade+Android+Apps;%E2%9A%A1+Kotlin+%7C+Jetpack+Compose+%7C+MVVM+%7C+Clean+Architecture" />
</a>

<br/>

![Kotlin](https://img.shields.io/badge/Kotlin-7F52FF?style=for-the-badge&logo=kotlin&logoColor=white)
![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)
![Jetpack Compose](https://img.shields.io/badge/Jetpack_Compose-4285F4?style=for-the-badge&logo=jetpackcompose&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

</div>

---

## 👨‍💻 About This Collection

This repository indexes **12 production-grade Android applications** developed by **Moe Kyaw Aung**, a Senior Android Developer from Myanmar. Each project demonstrates advanced patterns, real-world architecture, and professional code quality.

> **Tech Philosophy:** Clean Architecture · MVVM · SOLID Principles · Kotlin-first · Test-driven

---

## 📱 Project Index

| # | Project | Category | Key Tech | Status | Repo |
|---|---------|----------|----------|--------|------|
| 01 | **ShopEase** — E-Commerce App | 🛍️ Commerce | Kotlin · Compose · Stripe · Firebase | ✅ Live | [View →](https://github.com/moekyawaung-creator/ShopEase-Android) |
| 02 | **QuickChat** — Realtime Messenger | 💬 Chat | Kotlin · Firebase · WebSocket · AES | ✅ Live | [View →](https://github.com/moekyawaung-creator/QuickChat-Android) |
| 03 | **MoneyMind** — Finance Tracker | 💰 Finance | Kotlin · Room · MPAndroidChart | ✅ Play Store | [View →](https://github.com/moekyawaung-creator/MoneyMind-Android) |
| 04 | **Snaply** — Photo Social Network | 📸 Social | Kotlin · Firebase · Glide · Paging 3 | ✅ Active | [View →](https://github.com/moekyawaung-creator/Snaply-Android) |
| 05 | **FitTrack** — Health & Fitness | 🏃 Health | Kotlin · Compose · Google Fit · Wear OS | ✅ Play Store | [View →](https://github.com/moekyawaung-creator/FitTrack-Android) |
| 06 | **NearMe** — Location & Maps | 🗺️ Utility | Kotlin · Google Maps · Geofencing | 🔶 Beta | [View →](https://github.com/moekyawaung-creator/NearMe-Android) |
| 07 | **FoodRush** — Food Delivery | 🍜 Commerce | Kotlin · Firebase · Maps · Hilt | ✅ Live | [View →](https://github.com/moekyawaung-creator/FoodRush-Android) |
| 08 | **NewsHub** — News Reader | 📰 Utility | Kotlin · Room · Retrofit · TTS | ✅ Active | [View →](https://github.com/moekyawaung-creator/NewsHub-Android) |
| 09 | **TaskFlow** — Project Manager | ✅ Utility | Kotlin · Compose · Room · Drag&Drop | ✅ Active | [View →](https://github.com/moekyawaung-creator/TaskFlow-Android) |
| 10 | **StreamX** — Video Platform | ▶️ Media | Kotlin · ExoPlayer · HLS · Paging 3 | 🔶 Beta | [View →](https://github.com/moekyawaung-creator/StreamX-Android) |
| 11 | **ScanMate** — QR Scanner | 📷 Utility | Kotlin · ML Kit · CameraX · ZXing | ✅ Play Store | [View →](https://github.com/moekyawaung-creator/ScanMate-Android) |
| 12 | **BookNow** — Hotel & Flight | 🏨 Commerce | Kotlin · Compose · Amadeus API | 🚧 In Dev | [View →](https://github.com/moekyawaung-creator/BookNow-Android) |

---

## 🏗️ Architecture Pattern

All projects follow **Clean Architecture** with **MVVM**:

```
┌─────────────────────────────────────────────┐
│                 UI LAYER                    │
│   Activity / Fragment / Composable          │
│   ViewModel · StateFlow · UiState           │
├─────────────────────────────────────────────┤
│               DOMAIN LAYER                  │
│   UseCase · Repository Interface            │
│   Domain Models · Business Logic            │
├─────────────────────────────────────────────┤
│                DATA LAYER                   │
│   Repository Impl · Remote DataSource       │
│   Local DataSource (Room) · API Service     │
│   Retrofit · Firebase · Room DB             │
└─────────────────────────────────────────────┘
```

---

## 🛠️ Common Tech Stack

```kotlin
// All projects use these core dependencies
dependencies {
    // UI
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.navigation:navigation-compose")

    // Architecture
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose")
    implementation("com.google.dagger:hilt-android")

    // Network
    implementation("com.squareup.retrofit2:retrofit")
    implementation("com.squareup.okhttp3:logging-interceptor")

    // Local DB
    implementation("androidx.room:room-runtime")
    implementation("androidx.room:room-ktx")

    // Async
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android")

    // Firebase
    implementation(platform("com.google.firebase:firebase-bom"))
    implementation("com.google.firebase:firebase-auth-ktx")
    implementation("com.google.firebase:firebase-firestore-ktx")
}
```

---

## 📂 Repository Structure (Each Project)

```
ProjectName-Android/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/moekyawaung/projectname/
│   │   │   │   ├── data/
│   │   │   │   │   ├── local/          # Room DB
│   │   │   │   │   ├── remote/         # Retrofit API
│   │   │   │   │   └── repository/     # Repository Impl
│   │   │   │   ├── domain/
│   │   │   │   │   ├── model/          # Domain Models
│   │   │   │   │   ├── repository/     # Interfaces
│   │   │   │   │   └── usecase/        # Use Cases
│   │   │   │   ├── presentation/
│   │   │   │   │   ├── ui/             # Screens / Composables
│   │   │   │   │   └── viewmodel/      # ViewModels
│   │   │   │   └── di/                 # Hilt Modules
│   │   │   └── res/
│   │   └── test/                       # Unit Tests
│   └── build.gradle.kts
├── .gitignore
├── README.md
└── build.gradle.kts
```

---

## 📊 Stats Overview

<div align="center">

| Metric | Value |
|--------|-------|
| Total Projects | 12 |
| Languages | Kotlin (primary), Java |
| Minimum SDK | API 24 (Android 7.0) |
| Target SDK | API 35 (Android 15) |
| Architecture | MVVM + Clean Architecture |
| DI Framework | Hilt (Dagger2) |
| Total Code Lines | 100,000+ |

</div>

---

## 🚀 Quick Start (Any Project)

```bash
# 1. Clone the repo
git clone https://github.com/moekyawaung-creator/ProjectName-Android.git

# 2. Open in Android Studio
# File → Open → Select cloned folder

# 3. Add your google-services.json
# (Firebase projects) Place in /app folder

# 4. Add API keys to local.properties
MAPS_API_KEY=your_key_here
NEWS_API_KEY=your_key_here

# 5. Build & Run
./gradlew assembleDebug
```

---

## 📞 Contact & Hire

<div align="center">

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/moekyawaung)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/moekyawaung-creator)
[![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/+959666000050)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/959666000050)

**📞 +959 666 000 050** — Telegram · WeChat · WhatsApp · Call

</div>

---

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:c084fc,50:4a9eff,100:00e5a0&height=100&section=footer" width="100%"/>

*Senior Android Developer · Myanmar 🇲🇲 · Open to Remote & On-site Opportunities*
</div>
