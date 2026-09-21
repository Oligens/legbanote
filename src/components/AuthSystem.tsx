import { useState } from 'react';

type AuthTab = 'register' | 'login' | 'biometric';

export default function AuthSystem() {
  const [activeTab, setActiveTab] = useState<AuthTab>('register');

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="animate-fade-in-up">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentification Locale Sécurisée</h2>
        <p className="text-gray-500 text-sm">Système Zero-Knowledge : aucune donnée ne quitte l'appareil. Pas de Firebase, pas de serveur distant.</p>
      </div>

      {/* Auth Flow Diagram */}
      <div className="bg-white rounded-2xl p-6 border border-sand-dark/15 shadow-sm animate-fade-in-up" style={{animationDelay: '100ms'}}>
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Flux d'Authentification</h3>
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
          {[
            { label: 'Saisie credentials', icon: '👤', color: 'bg-caribbean/10 border-caribbean/20' },
            { label: 'Hash Argon2id', icon: '🔑', color: 'bg-indigo/10 border-indigo/20' },
            { label: 'Comparaison hash', icon: '⚖️', color: 'bg-sun/10 border-sun/20' },
            { label: 'Session locale', icon: '✅', color: 'bg-emerald-50 border-emerald-200' },
            { label: 'Biométrie (opt.)', icon: '👆', color: 'bg-purple-50 border-purple-200' },
          ].map((step, i, arr) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`${step.color} border rounded-xl px-4 py-3 text-center min-w-[120px]`}>
                <span className="text-xl block mb-1">{step.icon}</span>
                <span className="text-[10px] font-medium text-gray-700">{step.label}</span>
              </div>
              {i < arr.length - 1 && (
                <svg className="w-5 h-3 text-gray-300 flex-shrink-0 hidden sm:block" viewBox="0 0 20 12">
                  <path d="M0 6h16m0 0l-3-3m3 3l-3 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 animate-fade-in-up" style={{animationDelay: '200ms'}}>
        {[
          { id: 'register' as AuthTab, label: 'Inscription', icon: '📝' },
          { id: 'login' as AuthTab, label: 'Connexion', icon: '🔓' },
          { id: 'biometric' as AuthTab, label: 'Biométrie', icon: '👆' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-indigo text-white shadow-md shadow-indigo/20'
                : 'bg-white text-gray-500 border border-sand-dark/20 hover:border-indigo/30'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content based on tab */}
      {activeTab === 'register' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up">
          {/* Registration Flow */}
          <div className="bg-white rounded-2xl p-6 border border-sand-dark/15 shadow-sm">
            <h4 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo/10 flex items-center justify-center text-xs">1</span>
              Processus d'Inscription
            </h4>
            <div className="space-y-3">
              {[
                { step: 'Saisie username + mot de passe', detail: 'Validation locale : min 8 car., 1 majuscule, 1 chiffre, 1 spécial' },
                { step: 'Génération du salt unique', detail: '16 bytes aléatoires via crypto.getRandomValues()' },
                { step: 'Hash Argon2id du mot de passe', detail: 'Paramètres : m=65536, t=3, p=4 (résistant GPU/ASIC)' },
                { step: 'Stockage dans SQLite chiffré', detail: 'Table users : (id, username, password_hash, salt, created_at)' },
                { step: 'Création session token locale', detail: 'JWT-like stocké en mémoire uniquement, expiry 24h' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-sand-light/50 rounded-xl">
                  <div className="w-5 h-5 rounded-full bg-indigo/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[9px] font-bold text-indigo">{i + 1}</span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-700">{item.step}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Code Example */}
          <div className="bg-white rounded-2xl border border-sand-dark/15 shadow-sm overflow-hidden">
            <div className="bg-gray-900 px-4 py-2.5 flex items-center justify-between">
              <span className="text-xs text-gray-400 font-mono">auth_service.dart</span>
              <span className="text-[10px] bg-blue-400/20 text-blue-300 px-2 py-0.5 rounded-full">Dart</span>
            </div>
            <div className="p-4 bg-gray-950 overflow-x-auto max-h-[400px] overflow-y-auto">
              <pre className="code-block text-gray-300 whitespace-pre">{`import 'package:argon2/argon2.dart';
import 'package:sqflite/sqflite.dart';
import 'dart:math';

class AuthService {
  final Database _db;
  
  AuthService(this._db);

  /// Inscription d'un nouvel utilisateur
  Future<bool> register({
    required String username,
    required String password,
  }) async {
    // 1. Validation
    if (!_validatePassword(password)) {
      throw AuthException('Mot de passe trop faible');
    }

    // 2. Vérifier unicité du username
    final existing = await _db.query(
      'users',
      where: 'username = ?',
      whereArgs: [username],
    );
    if (existing.isNotEmpty) {
      throw AuthException('Nom déjà utilisé');
    }

    // 3. Génération du salt (16 bytes)
    final salt = _generateSalt();

    // 4. Hash Argon2id
    final hash = await Argon2.hash(
      password: password,
      salt: salt,
      type: Argon2Type.id,  // Argon2id
      memoryCost: 65536,     // 64 MB
      timeCost: 3,           // 3 itérations
      parallelism: 4,        // 4 threads
      hashLength: 32,        // 256 bits
    );

    // 5. Insertion en base
    await _db.insert('users', {
      'username': username,
      'password_hash': hash.toString(),
      'salt': base64Encode(salt),
      'created_at': DateTime.now().toIso8601String(),
    });

    return true;
  }

  /// Connexion : vérification du hash
  Future<SessionToken?> login({
    required String username,
    required String password,
  }) async {
    final users = await _db.query(
      'users',
      where: 'username = ?',
      whereArgs: [username],
      limit: 1,
    );

    if (users.isEmpty) return null;

    final user = users.first;
    final salt = base64Decode(user['salt'] as String);
    final storedHash = user['password_hash'] as String;

    // Hash du mot de passe saisi
    final inputHash = await Argon2.hash(
      password: password,
      salt: salt,
      type: Argon2Type.id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
      hashLength: 32,
    );

    // Comparaison à temps constant
    if (_constantTimeEquals(
      inputHash.toString(), storedHash
    )) {
      return _createSession(user['id'] as int);
    }

    return null;
  }

  /// Salt aléatoire sécurisé
  List<int> _generateSalt() {
    final random = Random.secure();
    return List<int>.generate(16, (_) => random.nextInt(256));
  }

  /// Comparaison à temps constant (anti timing attack)
  bool _constantTimeEquals(String a, String b) {
    if (a.length != b.length) return false;
    int result = 0;
    for (int i = 0; i < a.length; i++) {
      result |= a.codeUnitAt(i) ^ b.codeUnitAt(i);
    }
    return result == 0;
  }
}`}</pre>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'login' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up">
          {/* Login Flow */}
          <div className="bg-white rounded-2xl p-6 border border-sand-dark/15 shadow-sm">
            <h4 className="text-sm font-bold text-gray-700 mb-4">Processus de Connexion</h4>
            <div className="space-y-4">
              <div className="bg-sand-light/50 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">🔒 Vérification des Identifiants</p>
                <ol className="space-y-2 text-xs text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo font-bold">1.</span>
                    Récupérer le hash stocké + salt depuis SQLite
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo font-bold">2.</span>
                    Re-hasher le mot de passe saisi avec le même salt
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo font-bold">3.</span>
                    Comparaison à temps constant (anti timing attack)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo font-bold">4.</span>
                    Création d'un token de session en mémoire
                  </li>
                </ol>
              </div>

              <div className="bg-indigo/5 rounded-xl p-4 border border-indigo/10">
                <p className="text-xs font-semibold text-indigo mb-2">🛡️ Protections Anti-Attaque</p>
                <ul className="space-y-1.5 text-xs text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo"></span>
                    Rate limiting : 5 tentatives max / 15 min
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo"></span>
                    Lockout progressif (1min → 5min → 30min)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo"></span>
                    Comparaison à temps constant
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo"></span>
                    Pas de message d'erreur spécifique (user inexistant vs mauvais mdp)
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Session Management */}
          <div className="bg-white rounded-2xl p-6 border border-sand-dark/15 shadow-sm">
            <h4 className="text-sm font-bold text-gray-700 mb-4">Gestion de Session</h4>
            <div className="space-y-3">
              <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                <pre className="code-block text-gray-300 whitespace-pre text-[11px]">{`class SessionManager {
  String? _sessionToken;
  DateTime? _expiresAt;
  int? _userId;

  /// Créer une session après login réussi
  SessionToken createSession(int userId) {
    _userId = userId;
    _sessionToken = _generateToken();
    _expiresAt = DateTime.now()
        .add(Duration(hours: 24));
    
    return SessionToken(
      token: _sessionToken!,
      userId: userId,
      expiresAt: _expiresAt!,
    );
  }

  /// Vérifier si la session est valide
  bool isValid() {
    if (_sessionToken == null) return false;
    if (DateTime.now().isAfter(_expiresAt!)) {
      logout();
      return false;
    }
    return true;
  }

  /// Déconnexion
  void logout() {
    _sessionToken = null;
    _expiresAt = null;
    _userId = null;
  }

  /// Token aléatoire sécurisé
  String _generateToken() {
    final bytes = List<int>.generate(
      32, (_) => Random.secure().nextInt(256)
    );
    return base64Url.encode(bytes);
  }
}`}</pre>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
                <p className="text-[10px] text-amber-700">
                  <strong>⚠️ Important :</strong> Le token de session est stocké uniquement en mémoire RAM. 
                  Il est perdu à la fermeture de l'app, forçant une re-authentification. 
                  Pas de stockage persistant du token.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'biometric' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up">
          {/* Biometric Flow */}
          <div className="bg-white rounded-2xl p-6 border border-sand-dark/15 shadow-sm">
            <h4 className="text-sm font-bold text-gray-700 mb-4">Authentification Biométrique</h4>
            
            <div className="space-y-4">
              <div className="text-center py-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-indigo/10 flex items-center justify-center animate-breathe">
                  <svg className="w-10 h-10 text-indigo" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 00-2.286 5.397m14.288-9.534A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75c-1.035 0-2.052.098-3.04.289m6.078-.289c-.986-.19-2.003-.289-3.038-.289m0 0v4.5m-4.5-4.5c.986.19 2.003.289 3.038.289m0 0v4.5" />
                  </svg>
                </div>
                <p className="text-xs text-gray-500 mt-3">Empreinte digitale ou Face ID</p>
              </div>

              <div className="space-y-2">
                {[
                  { step: 'Vérification disponibilité biométrie', detail: 'local_auth.canCheckBiometrics' },
                  { step: 'Authentification via Secure Enclave / KeyStore', detail: 'Le template biométrique ne quitte jamais le hardware sécurisé' },
                  { step: 'Déverrouillage de la clé de chiffrement DB', detail: 'La clé SQLCipher est liée à l\'auth biométrique' },
                  { step: 'Accès aux données sans re-saisie du mot de passe', detail: 'Session étendue jusqu\'au timeout configuré' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-sand-light/50 rounded-xl">
                    <div className="w-5 h-5 rounded-full bg-indigo/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[9px] font-bold text-indigo">{i + 1}</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-700">{item.step}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Biometric Code */}
          <div className="bg-white rounded-2xl border border-sand-dark/15 shadow-sm overflow-hidden">
            <div className="bg-gray-900 px-4 py-2.5 flex items-center justify-between">
              <span className="text-xs text-gray-400 font-mono">biometric_service.dart</span>
              <span className="text-[10px] bg-blue-400/20 text-blue-300 px-2 py-0.5 rounded-full">Dart</span>
            </div>
            <div className="p-4 bg-gray-950 overflow-x-auto max-h-[450px] overflow-y-auto">
              <pre className="code-block text-gray-300 whitespace-pre">{`import 'package:local_auth/local_auth.dart';

class BiometricService {
  final LocalAuthentication _auth = 
      LocalAuthentication();

  /// Vérifier si la biométrie est disponible
  Future<BiometricStatus> checkAvailability() async {
    try {
      final isAvailable = await _auth.canCheckBiometrics;
      final isDeviceSupported = 
          await _auth.isDeviceSupported();

      if (!isAvailable || !isDeviceSupported) {
        return BiometricStatus.notAvailable;
      }

      final enrolled = 
          await _auth.getAvailableBiometrics();
      
      if (enrolled.isEmpty) {
        return BiometricStatus.notEnrolled;
      }

      return BiometricStatus.available;
    } catch (e) {
      return BiometricStatus.error;
    }
  }

  /// Authentification biométrique
  Future<bool> authenticate() async {
    try {
      return await _auth.authenticate(
        localizedReason: 
          'Déverrouillez Legba Note',
        options: const AuthenticationOptions(
          stickyAuth: true,
          biometricOnly: false,
          // Fallback vers PIN si biométrie échoue
        ),
      );
    } catch (e) {
      return false;
    }
  }

  /// Lier la biométrie à la clé DB
  Future<void> linkBiometricToDb(
    String dbEncryptionKey
  ) async {
    // Stocker la clé dans le KeyStore/Secure Enclave
    // protégée par l'authentification biométrique
    await _flutterSecureStorage.write(
      key: 'db_encryption_key',
      value: dbEncryptionKey,
      iOptions: IOSOptions(
        accessibility: KeychainAccessibility
            .whenUnlockedThisDeviceOnly,
      ),
      aOptions: AndroidOptions(
        encryptedSharedPreferences: true,
        keyCipherAlias: 'legba_db_key',
      ),
    );
  }

  /// Récupérer la clé DB via biométrie
  Future<String?> getDbKeyViaBiometric() async {
    final authenticated = await authenticate();
    if (!authenticated) return null;
    
    return await _flutterSecureStorage.read(
      key: 'db_encryption_key',
    );
  }
}`}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Security Summary */}
      <div className="bg-gradient-to-r from-red-50 to-indigo/5 rounded-2xl p-6 border border-red-100 animate-fade-in-up" style={{animationDelay: '300ms'}}>
        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
          <span>🛡️</span> Résumé Sécurité Authentification
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { metric: 'Argon2id', detail: 'Hash résistant GPU/ASIC', color: 'text-indigo' },
            { metric: 'Salt 128-bit', detail: 'Unique par utilisateur', color: 'text-caribbean' },
            { metric: 'Temps constant', detail: 'Anti timing attack', color: 'text-sun-dark' },
            { metric: 'Rate limit', detail: '5 tentatives / 15 min', color: 'text-red-500' },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl p-3 text-center border border-sand-dark/10">
              <p className={`text-sm font-bold ${item.color}`}>{item.metric}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
