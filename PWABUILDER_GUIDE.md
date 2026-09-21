# 📱 Guide PWABuilder - Compilation Mobile Legba Note

## 🎯 Vue d'Ensemble

Ce guide explique comment transformer l'application web Legba Note en application mobile native pour Android et iOS via **PWABuilder**.

---

## ✅ Configuration PWA Complétée

### Fichiers Créés

1. **`public/manifest.json`** - Manifest PWA complet
2. **`public/sw.js`** - Service Worker pour cache et mode hors-ligne
3. **`public/offline.html`** - Page hors-ligne élégante
4. **`public/icons/icon-192x192.svg`** - Icône 192x192
5. **`public/icons/icon-512x512.svg`** - Icône 512x512
6. **`index.html`** - Meta tags PWA ajoutés

### Fonctionnalités PWA

- ✅ **Installable** : L'application peut être installée sur l'écran d'accueil
- ✅ **Mode Standalone** : Masque la barre du navigateur (vraie app native)
- ✅ **Mode Hors-ligne** : Service Worker avec cache intelligent
- ✅ **Thème Cohérent** : Couleur de thème #0a0f1d (Deep Petrol)
- ✅ **Icônes** : Style Glassmorphism avec vèvè de Legba
- ✅ **Permissions Audio** : Microphone configuré pour le mode vocal

---

## 🚀 Compilation via PWABuilder

### Étape 1 : Déployer l'Application Web

Avant d'utiliser PWABuilder, vous devez déployer l'application sur un serveur HTTPS.

#### Options de Déploiement

**Option A : Vercel (Recommandé)**
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Suivre les instructions
```

**Option B : Netlify**
```bash
# Installer Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Déployer
netlify deploy --prod
```

**Option C : GitHub Pages**
```bash
# Installer gh-pages
npm i -g gh-pages

# Build
npm run build

# Déployer
gh-pages -d dist
```

### Étape 2 : Tester la PWA

Avant la compilation, testez que votre PWA fonctionne correctement :

1. **Ouvrir Chrome DevTools**
   - F12 → Onglet "Application"
   - Vérifier : Manifest, Service Worker, Cache

2. **Tester l'installation**
   - Chrome : Icône d'installation dans la barre d'adresse
   - Safari iOS : "Ajouter à l'écran d'accueil"

3. **Tester le mode hors-ligne**
   - DevTools → Network → "Offline"
   - Recharger la page
   - Vérifier que la page offline.html s'affiche

4. **Vérifier le manifest**
   - Lighthouse → PWA
   - Score doit être > 90

### Étape 3 : PWABuilder pour Android (TWA)

#### 3.1 Accéder à PWABuilder

1. Aller sur [https://www.pwabuilder.com/](https://www.pwabuilder.com/)
2. Entrer l'URL de votre application déployée (ex: `https://legba-note.vercel.app`)
3. Cliquer sur "Start"

#### 3.2 Vérifier le Score PWA

PWABuilder va analyser votre application et afficher un score :
- **Manifest** : Doit être > 90
- **Service Worker** : Doit être actif
- **HTTPS** : Obligatoire
- **Icônes** : 192x192 et 512x512

#### 3.3 Générer le Package Android

1. Cliquer sur "Package for stores" → "Android"
2. Sélectionner **Trusted Web Activity (TWA)**
3. Configurer les options :
   ```
   Package Name: com.legba.note
   App Name: Legba Note
   Short Name: Legba
   Launcher Name: Legba
   Background Color: #0a0f1d
   Theme Color: #0a0f1d
   Navigation Color: #0a0f1d
   ```
4. Cliquer sur "Generate Package"
5. Télécharger le fichier `.zip`

#### 3.4 Structure du Package Android

```
legba-note-android.zip
├── app/
│   ├── src/main/
│   │   ├── AndroidManifest.xml
│   │   ├── java/com/legba/note/
│   │   │   └── LauncherActivity.java
│   │   └── res/
│   │       ├── mipmap-xxxhdpi/
│   │       │   └── ic_launcher.png
│   │       └── values/
│   │           └── strings.xml
│   └── build.gradle
├── build.gradle
└── gradle.properties
```

#### 3.5 Compiler avec Android Studio

1. **Extraire le ZIP**
   ```bash
   unzip legba-note-android.zip
   cd legba-note-android
   ```

2. **Ouvrir dans Android Studio**
   - File → Open → Sélectionner le dossier
   - Attendre la synchronisation Gradle

3. **Configurer le Signing**
   - Build → Generate Signed Bundle / APK
   - Créer un keystore :
     ```bash
     keytool -genkey -v -keystore legba-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias legba
     ```
   - Entrer les mots de passe
   - Sélectionner "Android App Bundle"
   - Build → Release

4. **Tester sur Émulateur**
   - Run → Run 'app'
   - Sélectionner un émulateur Android
   - Vérifier le fonctionnement

5. **Générer l'APK/AAB**
   - Build → Build Bundle(s) / APK(s) → Build APK
   - Fichier généré : `app/build/outputs/apk/release/app-release.apk`

#### 3.6 Publier sur Google Play Store

1. **Créer un compte Google Play Developer**
   - [https://play.google.com/console](https://play.google.com/console)
   - Frais unique de 25$

2. **Créer une Nouvelle Application**
   - Nom : Legba Note
   - Langue : Français
   - Type : Application

3. **Préparer les Assets**
   - Icône : 512x512 PNG
   - Screenshots : Minimum 2 (mobile)
   - Feature Graphic : 1024x500
   - Description : Voir `README.md`

4. **Uploader l'AAB**
   - Production → Create new release
   - Uploader `app-release.aab`
   - Remplir les informations
   - Submit for review

---

### Étape 4 : PWABuilder pour iOS

**Note** : PWABuilder ne supporte pas directement iOS. Pour iOS, utilisez une des alternatives suivantes :

#### Option A : Capacitor (Recommandé)

```bash
# Installer Capacitor
npm install @capacitor/core @capacitor/cli

# Initialiser
npx cap init "Legba Note" "com.legba.note"

# Ajouter iOS
npx cap add ios

# Build
npm run build

# Sync
npx cap sync ios

# Ouvrir dans Xcode
npx cap open ios
```

#### Option B : PWA Builder iOS (Via Bubblewrap)

```bash
# Installer Bubblewrap
npm i -g @bubblewrap/cli

# Initialiser
bubblewrap init --manifest=https://legba-note.vercel.app/manifest.json

# Build
bubblewrap build
```

#### Option C : Média360 (Service Payant)

1. Aller sur [https://www.pwabuilder.com/](https://www.pwabuilder.com/)
2. Package for stores → iOS
3. Suivre les instructions
4. Télécharger le projet Xcode

---

## 🔧 Configuration Avancée

### Android - Permissions

Modifier `AndroidManifest.xml` :

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    
    <!-- Permissions Audio -->
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    <uses-permission android:name="android.permission.BLUETOOTH" />
    <uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
    
    <!-- Permissions Stockage -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    
    <!-- Permissions Internet -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:theme="@style/AppTheme">
        
        <activity android:name=".LauncherActivity">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
        
    </application>
</manifest>
```

### Android - assetlinks.json

Pour que TWA fonctionne correctement, créez `assetlinks.json` :

```json
// Fichier à placer sur votre serveur : 
// https://legba-note.vercel.app/.well-known/assetlinks.json

[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.legba.note",
    "sha256_cert_fingerprints": [
      "VOTRE_EMPREINTE_SHA256_ICI"
    ]
  }
}]
```

**Obtenir l'empreinte SHA256** :
```bash
keytool -list -v -keystore legba-key.jks -alias legba
```

### iOS - Info.plist

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <!-- Permissions Audio -->
    <key>NSMicrophoneUsageDescription</key>
    <string>Legba Note a besoin du microphone pour le mode vocal continu</string>
    
    <!-- Permissions Stockage -->
    <key>NSPhotoLibraryUsageDescription</key>
    <string>Legba Note a besoin d'accéder à vos fichiers pour l'importation de documents</string>
    
    <!-- PWA Configuration -->
    <key>WKAppBoundDomains</key>
    <array>
        <string>legba-note.vercel.app</string>
    </array>
</dict>
</plist>
```

---

## 🧪 Tests Avant Publication

### Checklist Android

- [ ] Application installable depuis le navigateur
- [ ] Mode standalone fonctionnel (pas de barre navigateur)
- [ ] Icône affichée correctement
- [ ] Mode hors-ligne fonctionne
- [ ] Permissions microphone demandées
- [ ] Service Worker actif
- [ ] Score Lighthouse > 90
- [ ] Test sur émulateur Android
- [ ] Test sur appareil physique
- [ ] assetlinks.json configuré

### Checklist iOS

- [ ] Application installable via Safari
- [ ] Écran de splash personnalisé
- [ ] Mode standalone fonctionnel
- [ ] Permissions microphone configurées
- [ ] Test sur simulateur iOS
- [ ] Test sur appareil physique
- [ ] Icones correctement dimensionnées

---

## 📊 Performance

### Objectifs de Performance

| Métrique | Objectif | Outil |
|----------|----------|-------|
| First Contentful Paint | < 1.5s | Lighthouse |
| Time to Interactive | < 3s | Lighthouse |
| Service Worker Cache | > 90% | DevTools |
| Lighthouse PWA Score | > 90 | Lighthouse |
| Bundle Size | < 500 KB | Webpack Analyzer |

### Optimisations

1. **Code Splitting**
   ```javascript
   // Vite config
   export default defineConfig({
     build: {
       rollupOptions: {
         output: {
           manualChunks: {
             vendor: ['react', 'react-dom'],
             audio: ['./src/services/audio'],
           }
         }
       }
     }
   })
   ```

2. **Compression**
   ```bash
   # Activer gzip/brotli sur le serveur
   # Vercel/Netlify le font automatiquement
   ```

3. **Cache Strategy**
   - Assets statiques : Cache First
   - API calls : Network First
   - Navigation : Stale While Revalidate

---

## 🐛 Dépannage

### Problème : L'application ne s'installe pas

**Solutions** :
1. Vérifier que le manifest.json est valide
2. Vérifier que le Service Worker est actif
3. Vérifier que HTTPS est activé
4. Vérifier les icônes (192x192 et 512x512)

### Problème : Le mode hors-ligne ne fonctionne pas

**Solutions** :
1. Vérifier que le Service Worker est enregistré
2. Vérifier la console pour les erreurs
3. Tester avec DevTools → Application → Service Workers
4. Vérifier la stratégie de cache dans sw.js

### Problème : Les permissions audio ne sont pas demandées

**Solutions** :
1. Vérifier le code de demande de permissions
2. Vérifier que l'interaction utilisateur a eu lieu
3. Vérifier les permissions dans AndroidManifest.xml / Info.plist
4. Tester sur un appareil physique (pas émulateur)

### Problème : TWA ne fonctionne pas sur Android

**Solutions** :
1. Vérifier assetlinks.json
2. Vérifier le package name
3. Vérifier l'empreinte SHA256
4. Vérifier que l'URL est en HTTPS
5. Tester avec `adb logcat` pour voir les erreurs

---

## 📚 Ressources

### Documentation Officielle

- [PWABuilder Documentation](https://docs.pwabuilder.com/)
- [Trusted Web Activity](https://developer.chrome.com/docs/android/trusted-web-activity/)
- [Web App Manifest](https://developer.mozilla.org/fr/docs/Web/Manifest)
- [Service Worker API](https://developer.mozilla.org/fr/docs/Web/API/Service_Worker_API)

### Outils

- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Audit PWA
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/) - Debugging
- [PWABuilder](https://www.pwabuilder.com/) - Compilation mobile
- [Android Studio](https://developer.android.com/studio) - Développement Android
- [Xcode](https://developer.apple.com/xcode/) - Développement iOS

### Communauté

- [Web.dev](https://web.dev/) - Bonnes pratiques PWA
- [Stack Overflow](https://stackoverflow.com/questions/tagged/progressive-web-apps) - Q&R
- [GitHub Discussions](https://github.com/pwa-builder/PWABuilder/discussions) - Support

---

## 🎯 Prochaines Étapes

### Court Terme

1. ✅ Déployer l'application sur Vercel/Netlify
2. ✅ Tester la PWA avec Lighthouse
3. ✅ Générer le package Android via PWABuilder
4. ✅ Tester sur émulateur Android
5. ✅ Configurer assetlinks.json

### Moyen Terme

1. Publier sur Google Play Store
2. Créer les screenshots et descriptions
3. Configurer les mises à jour automatiques
4. Implémenter les notifications push

### Long Terme

1. Compiler pour iOS via Capacitor
2. Publier sur Apple App Store
3. Implémenter la synchronisation cloud
4. Ajouter les fonctionnalités natives avancées

---

## 📞 Support

Pour toute question sur la compilation mobile :

1. Consulter la documentation PWABuilder
2. Vérifier les logs dans Android Studio / Xcode
3. Tester sur plusieurs appareils
4. Consulter les issues GitHub du projet

---

**Version** : 2.3 - PWA Ready  
**Statut** : ✅ Prêt pour PWABuilder  
**Dernière mise à jour** : 2024

*"Legba, ouvri baryè a pou mwen"* 📱✨
