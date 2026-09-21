# 🎓 Legba Note - Application Mobile d'Assistance Étudiante

> **Assistant vocal intelligent pour étudiants haïtiens** - Conversation continue, importation universelle, 100% local

![Legba Note](https://img.shields.io/badge/Version-2.0-blue)
![Flutter](https://img.shields.io/badge/Flutter-3.0+-02569B)
![SQLite](https://img.shields.io/badge/SQLite-FTS5-003B57)
![License](https://img.shields.io/badge/License-Proprietary-red)

---

## 🌟 Vue d'Ensemble

**Legba Note** est une application mobile révolutionnaire qui transforme votre smartphone en assistant d'étude vocal intelligent. Inspirée de **Papa Legba**, le gardien des carrefours dans la tradition vodou haïtienne, cette application ouvre les portes du savoir grâce à l'IA.

### 🎯 Fonctionnalités Principales

✅ **Conversation Vocale Continue** - Parlez librement, l'IA écoute et répond automatiquement  
✅ **Importation Universelle** - PDF, Word, Excel, Images OCR, Archives, tous formats supportés  
✅ **Mode Dictée Lente** - Répétition automatique avec pauses pour prise de notes  
✅ **100% Local** - Vos données restent sur votre appareil (sauf API Gemini)  
✅ **Casque Bluetooth** - Fonctionnement mains libres complet  
✅ **Recherche Intelligente** - FTS5 SQLite avec ranking BM25  

---

## 🚀 Démarrage Rapide

### Prérequis

```bash
Node.js 18+
npm ou yarn
```

### Installation

```bash
# Cloner le repository
git clone https://github.com/yourusername/legba-note.git
cd legba-note

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

---

## 📱 Navigation de l'Application

### 1. **Authentification** 🏠
- Écran de connexion glassmorphique
- Simulation d'authentification locale
- Cliquez sur n'importe quel bouton pour entrer

### 2. **Legba Live** 💬
- **Orbe lumineux animé** qui réagit aux états
- Conversation vocale continue (simulation)
- Pipeline RAG complet : Écoute → Transcription → Recherche → Gemini → TTS
- Affichage des sources locales

### 3. **Cours** 📚
- Liste des cours avec cartes glassmorphiques
- Bouton "+" pour importation de documents
- Statistiques de progression

### 4. **Vocal** 🎙️
- Configuration du mode dictée lente
- Vitesse de lecture (0.3x - 1.5x)
- Nombre de répétitions (1-4x)
- Durée des pauses (2-8s)
- Vérification orthographique

### 5. **Audio Fix** 🔧 **[NOUVEAU]**
- **Démonstration du pipeline audio corrigé**
- Logs en temps réel
- Forçage du routage Bluetooth
- Test du TTS vers casque

### 6. **Import** 📦 **[NOUVEAU]**
- **Démonstration de l'importation universelle**
- Support de tous les formats
- Pipeline d'extraction visuel
- OCR local pour images

---

## 🔧 Corrections Critiques (v2.1)

### 🐛 Bug #1 : Conflits de Routage Audio (RÉSOLU)

**Problème** : Le son ne sortait pas dans le casque Bluetooth/filaire, restant bloqué sur le haut-parleur interne ou un périphérique fantôme.

**Causes racines** :
- Faux positif Bluetooth (cache système d'anciennes connexions)
- Conflit entre profils filaire/sans-fil
- Flags de session audio basculant par défaut vers le haut-parleur

**Solution** :
```dart
// Configuration avec détection automatique
await _audioSession.configure(const AudioSessionConfiguration(
  avAudioSessionCategory: AVAudioSessionCategory.playAndRecord,
  avAudioSessionCategoryOptions: 
      AVAudioSessionCategoryOptions.allowBluetooth |
      AVAudioSessionCategoryOptions.allowBluetoothA2DP |
      AVAudioSessionCategoryOptions.defaultToSpeaker,
  androidAudioMode: AndroidAudioMode.inCommunication,
  androidAutomaticHeadsetDetection: true, // 🎯 CRITIQUE
));

// Détection dynamique du périphérique actif
await _updateActiveDevice();

// Forçage du routage avant chaque lecture TTS
await _forceRoutingToActiveDevice();
```

**Tester** : Navigation → "Device" → Cliquez sur Bluetooth/Filaire/Speaker

**Documentation complète** : [AUDIO_ROUTING_FIX.md](./AUDIO_ROUTING_FIX.md)

### 📦 Bug #2 : Importation Limitée

**Problème** : Seuls les PDF étaient supportés

**Solution** : Service `UniversalDocumentImporter` avec support de :
- PDF, Word (.docx), Excel (.xlsx), CSV
- Images (OCR Google ML Kit)
- Archives (.zip, .tar)
- Texte (.txt, .md)

**Tester** : Navigation → "Import" → Cliquez sur différents formats

---

## 🏗️ Architecture Technique

### Stack Technologique

```
Frontend : React + TypeScript + Tailwind CSS
Backend (simulé) : Dart/Flutter services
Base de données : SQLite + FTS5 + SQLCipher
API IA : Gemini Pro
Audio : Speech-to-Text + Text-to-Speech natif
OCR : Google ML Kit (local)
```

### Pipeline RAG Local

```
1. Écoute continue (micro/casque Bluetooth)
   ↓
2. Détection de fin de phrase (VAD)
   ↓
3. Transcription audio → texte (STT natif)
   ↓
4. Recherche FTS5 dans SQLite (<100ms)
   ↓
5. Sélection top-3 chunks pertinents (BM25)
   ↓
6. Construction prompt contextuel
   ↓
7. Appel API Gemini Pro
   ↓
8. Réception réponse
   ↓
9. TTS forcé vers casque Bluetooth
   ↓
10. Mode dictée lente + répétition
```

### Schéma de Base de Données

```sql
-- Tables principales
users (id, username, password_hash, salt, biometric_enabled)
courses (id, user_id, title, category, icon, total_chapters, total_chunks)
documents (id, course_id, file_name, file_path, file_size, mime_type)
chunks (id, document_id, chunk_text, chunk_index, page_number, chapter_title)
chunks_fts (FTS5 virtual table pour recherche plein texte)
history (id, user_id, question, answer, source_chunks, timestamp)
```

---

## 🎨 Design : Glassmorphism Avancé

### Palette de Couleurs

- **Fond** : Dégradé Deep Petrol → Navy Blue (#0A1929 → #0D2137)
- **Accent principal** : Cyan Néon (#00FFFF)
- **Accent secondaire** : Or Métallique (#FFD700)
- **Verre** : Semi-transparent (8-15% opacité) avec backdrop-blur

### Éléments Visuels

- **Orbe lumineux** : Réagit en temps réel aux états (écoute, réflexion, réponse)
- **Cartes glassmorphiques** : Bordures subtiles cyan/or
- **Animations fluides** : float, pulse-glow, shimmer
- **Effets de lumière** : Halos cyan et gold en arrière-plan

---

## 📊 Performance

| Opération | Temps Cible | RAM |
|-----------|-------------|-----|
| Recherche FTS5 | < 50ms | ~5 Mo |
| Insertion 100 chunks | < 500ms | ~20 Mo |
| Extraction PDF (50p) | < 3s | ~80 Mo |
| Appel Gemini API | 2-5s | ~10 Mo |
| TTS réponse | < 1s | ~15 Mo |
| OCR Image | < 2s | ~50 Mo |

**Optimisé pour 8 Go RAM** : Chunks limités à 3 en mémoire, streaming PDF, cache intelligent

---

## 🔒 Sécurité & Privacy

### Données au Repos
- ✅ SQLCipher AES-256
- ✅ Clé dans Secure Enclave/KeyStore
- ✅ Hash Argon2id (m=65536, t=3, p=4)
- ✅ Salt unique 16 bytes par utilisateur

### Données en Transit
- ✅ HTTPS/TLS 1.3 pour Gemini API
- ✅ API key dans Secure Storage
- ✅ Seul le prompt sort de l'appareil
- ✅ OCR 100% local (pas de cloud)

### Authentification
- ✅ Comparaison à temps constant
- ✅ Rate limiting (5 tentatives/15min)
- ✅ Biométrie (Face ID / Empreinte)
- ✅ Session en mémoire uniquement

---

## 📁 Structure du Projet

```
legba-note/
├── src/
│   ├── components/
│   │   ├── AuthScreen.tsx              # Écran de connexion
│   │   ├── LibraryScreen.tsx           # Bibliothèque de cours
│   │   ├── LegbaLiveScreen.tsx         # Conversation vocale
│   │   ├── VoiceSettingsScreen.tsx     # Configuration vocale
│   │   ├── LiveOrb.tsx                 # Orbe lumineux animé
│   │   ├── AudioPipelineDemo.tsx       # Démo pipeline audio
│   │   └── UniversalImportDemo.tsx     # Démo importation
│   ├── code_samples/
│   │   ├── continuous_audio_service.dart    # Service audio corrigé
│   │   └── universal_import_service.dart    # Service importation
│   ├── App.tsx                         # Navigation principale
│   └── index.css                       # Styles glassmorphiques
├── CORRECTIONS.md                      # Documentation des bugs
├── README.md                           # Ce fichier
└── package.json                        # Dépendances
```

---

## 🎓 Cas d'Usage

### Étudiant en Droit
1. Importe ses cours de Droit Constitutionnel (PDF + images de notes manuscrites)
2. Active le mode dictée lente (0.5x, 2 répétitions)
3. Pose des questions vocalement en marchant
4. Legba répond dans le casque avec citations des sources
5. Répétition automatique pour mémorisation

### Révision avant Examen
1. Importe tous les documents (Word, Excel, PDF)
2. Pose une question : "Quels sont les principes du droit constitutionnel ?"
3. Legba recherche dans tous les cours importés
4. Répond vocalement avec sources citées
5. Mode dictée pour prise de notes

### Prise de Notes en Cours
1. Casque Bluetooth connecté
2. Legba écoute en continu
3. L'étudiant pose des questions à voix basse
4. Legba répond dans l'oreille avec explications
5. Sources citées pour vérification

---

## 🛠️ Développement

### Commands

```bash
# Développement
npm run dev

# Build production
npm run build

# Preview build
npm run preview

# Linting
npm run lint
```

### Technologies

- **React 18** : UI framework
- **TypeScript** : Type safety
- **Tailwind CSS** : Styling glassmorphique
- **Vite** : Build tool ultra-rapide
- **Framer Motion** : Animations fluides

---

## 📝 Documentation Complète

- **[CORRECTIONS.md](./CORRECTIONS.md)** : Détails des bugs corrigés et solutions
- **[README.md](./README.md)** : Ce fichier (guide principal)
- **Code source** : Commentaires détaillés dans chaque fichier

---

## 🎯 Roadmap

### Version 2.1 (Prochaine)
- [ ] Intégration Flutter native
- [ ] Synchronisation cloud optionnelle (chiffrée)
- [ ] Génération de quiz automatiques
- [ ] Support multi-langues (créole haïtien)

### Version 3.0
- [ ] Mode collaboration (partage de cours)
- [ ] Reconnaissance d'écriture manuscrite
- [ ] Embeddings vectoriels locaux
- [ ] Export PDF des conversations

---

## 🤝 Contribution

Ce projet est actuellement en **mode démo/prototype**. Pour une version production Flutter/React Native native, contactez l'équipe de développement.

---

## 📄 Licence

**Propriétaire** - Legba Note © 2024  
Tous droits réservés.

---

## 🙏 Remerciements

Conçu avec passion pour les étudiants haïtiens et francophones.

> *"Legba, ouvri baryè a pou mwen"*  
> "Legba, ouvre la barrière pour moi"

**Gardien de votre savoir** - Legba, messager de la connaissance.

---

## 📞 Support

Pour toute question ou problème :
- Consultez **[CORRECTIONS.md](./CORRECTIONS.md)** pour les bugs connus
- Vérifiez la configuration AudioSession pour les problèmes de son
- Testez l'importation avec différents formats de fichiers

---

**Développé avec ❤️ pour l'éducation**  
**Version 2.0 - Corrections Critiques**  
**Dernière mise à jour : 2024**
