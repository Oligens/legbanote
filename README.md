# Legba Note - Assistant d'Examen IA Vocal & Mains Libres

## 🎯 Concept

**Legba Note** est une application mobile révolutionnaire qui fonctionne **exclusivement en mode conversationnel vocal continu et mains libres**. Aucun bouton à presser pour parler ou écouter - l'application écoute en permanence et répond automatiquement via le casque Bluetooth.

## ✨ Fonctionnalités Principales

### 1. **Conversation Continue (Legba Live)**
- 🎙️ **Écoute permanente en arrière-plan** avec détection intelligente de parole
- 🔄 **Pipeline RAG automatique** : transcription → recherche locale → génération Gemini
- 🔊 **Réponse vocale automatique** via Text-to-Speech
- 📚 **Sources locales citées** : "Basé sur : Droit Constitutionnel - Chapitre 3"

### 2. **Mode Dictée Lente & Répétition**
- 🐌 **Lecture posée** (vitesse ajustable 0.3x - 1.5x)
- 🔁 **Répétition automatique** des phrases (1-4x configurable)
- ⏸️ **Pauses chronométrées** (2-8s) pour prise de notes
- ✍️ **Vérification orthographique guidée** automatique

### 3. **Gestion des Cours**
- 📄 **Import PDF automatique** avec extraction de texte
- ✂️ **Chunking sémantique** (segments 2000-4000 caractères)
- 🔍 **Indexation FTS5** pour recherche rapide (<100ms)
- 📊 **Statistiques de progression**

### 4. **Sécurité & Privacy**
- 🔐 **100% local** : aucune donnée ne quitte l'appareil (sauf requêtes Gemini)
- 🛡️ **SQLCipher** : chiffrement AES-256 de la base de données
- 🔑 **Argon2id** : hachage sécurisé des mots de passe
- 👆 **Biométrie** : Face ID / Empreinte digitale

## 🎨 Design : Glassmorphism Avancé

### Palette de Couleurs
- **Fond** : Dégradé Deep Petrol → Navy Blue (#0A1929 → #0D2137 → #132F4C)
- **Accent principal** : Cyan Néon (#00FFFF)
- **Accent secondaire** : Or Métallique (#FFD700)
- **Verre** : Semi-transparent (8-15% opacité) avec backdrop-blur

### Éléments Visuels
- **Orbe lumineux animé** : réagit en temps réel aux états (écoute, réflexion, réponse)
- **Cartes glassmorphiques** : bordures subtiles cyan/or
- **Animations fluides** : float, pulse-glow, shimmer
- **Effets de lumière ambiante** : halos cyan et gold en arrière-plan

## 🏗️ Architecture Technique

### Stack Technologique
```
Frontend : Flutter / React Native
Backend Local : SQLite + SQLCipher + FTS5
Audio : Speech-to-Text natif + Text-to-Speech natif
API IA : Gemini Pro (seul appel externe)
Stockage : Application Documents Directory (sécurisé)
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
5. Sélection top-3 chunks pertinents
   ↓
6. Construction prompt contextuel
   ↓
7. Appel API Gemini Pro
   ↓
8. Réception réponse
   ↓
9. Text-to-Speech automatique (TTS natif)
   ↓
10. Routage vers casque Bluetooth
```

### Schéma de Base de Données
```sql
-- Tables principales
users (id, username, password_hash, salt, biometric_enabled)
courses (id, user_id, title, category, icon, total_chapters, total_chunks)
documents (id, course_id, file_name, file_path, file_size, page_count)
chunks (id, document_id, chunk_text, chunk_index, page_number, chapter_title)
chunks_fts (FTS5 virtual table pour recherche plein texte)
history (id, user_id, question, answer, source_chunks, timestamp)
```

### Contraintes Matérielles (8 Go RAM)
- **SQLite FTS5** : recherche légère sans vector DB
- **Chunks limités** : max 3 en mémoire simultanément
- **Streaming** : lecture page par page des PDF
- **Cache intelligent** : 50 dernières réponses
- **Optimisation audio** : buffer circulaire 2 Mo

## 📱 Espaces de l'Application

### 1. Authentification
- Connexion/inscription 100% locale
- Déverrouillage biométrique
- Design glassmorphique avec cartes flottantes

### 2. Bibliothèque (Cours)
- Cartes de cours interactives
- Bouton "+" pour import PDF
- Statistiques de progression
- Accès rapide à Legba Live

### 3. Legba Live (Cœur de l'app)
- **Orbe lumineux central** qui réagit aux états
- Transcription en temps réel
- Affichage des sources locales
- Historique récent
- **AUCUN BOUTON** - tout est automatique

### 4. Configuration Vocale
- Mode dictée lente (toggle)
- Vitesse de lecture (slider 0.3x - 1.5x)
- Routage Bluetooth (toggle)
- Vérification orthographique (toggle)
- Nombre de répétitions (1-4x)
- Durée de pause (2-8s)

## 🎯 États de l'Orbe (Legba Live)

| État | Couleur | Animation | Signification |
|------|---------|-----------|---------------|
| **Idle** | Cyan transparent | Pulse lent | En attente |
| **Listening** | Cyan vif | Pulse rapide | Écoute active |
| **Processing** | Or métallique | Rotation | Recherche dans les cours |
| **Speaking** | Vert émeraude | Pulse | Réponse vocale |
| **Dictation** | Or vif | Pulse intense | Mode dictée lente |

## 🔒 Modèle de Sécurité

### Données au Repos
- ✅ SQLCipher AES-256
- ✅ Clé dans Secure Enclave/KeyStore
- ✅ Hash Argon2id (m=65536, t=3, p=4)
- ✅ Salt unique 16 bytes par utilisateur

### Données en Transit
- ✅ HTTPS/TLS 1.3 pour Gemini API
- ✅ API key dans Secure Storage
- ✅ Seul le prompt sort de l'appareil
- ✅ Pas de logs de données sensibles

### Authentification
- ✅ Comparaison à temps constant
- ✅ Rate limiting (5 tentatives/15min)
- ✅ Lockout progressif
- ✅ Biométrie via local_auth
- ✅ Session en mémoire uniquement

## 🚀 Installation & Développement

### Prérequis
```bash
Flutter 3.x ou React Native 0.72+
SQLite avec extension FTS5
SQLCipher pour chiffrement
```

### Packages Principaux
```yaml
# Flutter
sqflite_sqlcipher: ^2.3.0
google_generative_ai: ^0.4.0
speech_to_text: ^6.6.0
flutter_tts: ^3.8.0
local_auth: ^2.1.0
pdfx: ^2.5.0
path_provider: ^2.1.0
flutter_secure_storage: ^9.0.0
```

### Structure du Projet
```
lib/
├── main.dart
├── app.dart
├── screens/
│   ├── auth_screen.dart
│   ├── library_screen.dart
│   ├── legba_live_screen.dart
│   └── voice_settings_screen.dart
├── components/
│   ├── live_orb.dart
│   ├── legba_icon.dart
│   └── glass_card.dart
├── services/
│   ├── database_service.dart
│   ├── rag_service.dart
│   ├── speech_service.dart
│   ├── document_service.dart
│   └── auth_service.dart
├── models/
│   ├── course.dart
│   ├── document.dart
│   ├── chunk.dart
│   └── history_entry.dart
└── utils/
    ├── chunking.dart
    ├── fts_search.dart
    └── audio_router.dart
```

## 🎓 Cas d'Usage

### Étudiant en Droit
1. Ouvre l'application → écoute automatique activée
2. Pose la question : "Quels sont les principes du droit constitutionnel ?"
3. Legba recherche dans ses cours de Droit Constitutionnel
4. Répond vocalement via le casque : "Les principes fondamentaux incluent..."
5. Répète 2 fois avec pauses pour prise de notes
6. Vérifie l'orthographe des termes techniques

### Révision avant Examen
1. Importe tous les PDF de cours
2. Active le mode dictée lente (0.5x)
3. Pose des questions orales en marchant
4. Legba répond avec citations des sources
5. Répétition automatique pour mémorisation

### Prise de Notes en Cours
1. Casque Bluetooth connecté
2. Legba écoute le professeur
3. L'étudiant pose des questions à voix basse
4. Legba répond dans l'oreille avec explications
5. Sources citées pour vérification

## 📊 Performance

| Opération | Temps Cible | RAM |
|-----------|-------------|-----|
| Recherche FTS5 | < 50ms | ~5 Mo |
| Insertion 100 chunks | < 500ms | ~20 Mo |
| Extraction PDF (50p) | < 3s | ~80 Mo |
| Appel Gemini API | 2-5s | ~10 Mo |
| TTS réponse | < 1s | ~15 Mo |

## 🔮 Futures Améliorations

- [ ] Embeddings vectoriels locaux (si RAM suffisante)
- [ ] Multi-langues (anglais, créole haïtien)
- [ ] Synchronisation cloud optionnelle (chiffrée)
- [ ] Génération de quiz automatiques
- [ ] Mode collaboration (partage de cours)
- [ ] Reconnaissance d'écriture manuscrite

## 📝 Licence

Propriétaire - Legba Note © 2024

## 🙏 Remerciements

Conçu avec passion pour les étudiants haïtiens et francophones.
"Gardien de votre savoir" - Legba, messager de la connaissance.

---

**Développé par** : Expert Lead Full-Stack Mobile Engineer & UI/UX Designer
**Stack** : Flutter / React Native / SQLite / Gemini Pro
**Design** : Glassmorphism avancé avec orbe lumineux interactif
