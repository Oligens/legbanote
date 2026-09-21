import LegbaIcon from './LegbaIcon';

export default function BackendOverview() {
  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="animate-fade-in-up">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Vue d'Ensemble du Backend Local</h2>
        <p className="text-gray-500 text-sm">Infrastructure 100% embarquée, zéro serveur tiers, données chiffrées localement</p>
      </div>

      {/* Architecture Principle Banner */}
      <div className="bg-gradient-to-r from-indigo/5 via-caribbean/5 to-sun/5 rounded-2xl p-6 border border-indigo/10 animate-fade-in-up" style={{animationDelay: '100ms'}}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo/10 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">🔒</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-indigo-dark mb-1">Principe Fondamental : Privacy by Design</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Toutes les données de l'utilisateur (documents, cours, questions/réponses, profil) restent 
              <strong className="text-indigo"> exclusivement sur l'appareil</strong>. Seul le prompt final 
              construit localement est envoyé à l'API Gemini pour génération. Aucun document, aucun extrait, 
              aucune donnée personnelle ne quitte le téléphone.
            </p>
          </div>
        </div>
      </div>

      {/* System Architecture Diagram */}
      <div className="bg-white rounded-2xl p-6 border border-sand-dark/15 shadow-sm animate-fade-in-up" style={{animationDelay: '200ms'}}>
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-6">Architecture Système Complète</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Local Stack */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-indigo"></div>
              <span className="text-xs font-bold text-indigo uppercase tracking-wider">Stack 100% Local</span>
            </div>

            {[
              {
                layer: 'Couche Présentation',
                items: ['Flutter / React Native', 'UI Components', 'Speech-to-Text (natif)', 'Text-to-Speech (natif)'],
                color: 'border-caribbean/30 bg-caribbean/5',
                dotColor: 'bg-caribbean',
              },
              {
                layer: 'Contrôleurs / Services',
                items: ['AuthController', 'CourseController', 'DocumentController', 'RagController', 'HistoryController'],
                color: 'border-indigo/30 bg-indigo/5',
                dotColor: 'bg-indigo',
              },
              {
                layer: 'Couche Données Sécurisée',
                items: ['SQLCipher (chiffré)', 'FTS5 (recherche plein texte)', 'File System (documents)', 'Secure Storage (clés)'],
                color: 'border-sun/30 bg-sun/5',
                dotColor: 'bg-sun',
              },
              {
                layer: 'Sécurité',
                items: ['Argon2 (hash mdp)', 'Biométrie (local_auth)', 'Chiffrement AES-256', 'Isolation répertoire app'],
                color: 'border-red-200 bg-red-50/50',
                dotColor: 'bg-red-400',
              },
            ].map((block, i) => (
              <div key={i} className={`rounded-xl p-4 border-2 ${block.color}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${block.dotColor}`}></div>
                  <span className="text-xs font-semibold text-gray-700">{block.layer}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {block.items.map((item, j) => (
                    <span key={j} className="text-[10px] bg-white/80 px-2 py-1 rounded-md text-gray-600 border border-gray-100">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right: Data Flow */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Flux de Données</span>
            </div>

            {/* Flow diagram */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="space-y-3">
                {[
                  { step: '1', label: 'Utilisateur pose une question (voix/texte)', icon: '🎙️', local: true },
                  { step: '2', label: 'STT natif → texte transcrit', icon: '📝', local: true },
                  { step: '3', label: 'Recherche FTS5 dans SQLite local', icon: '🔍', local: true },
                  { step: '4', label: 'Sélection top-3 chunks pertinents', icon: '📋', local: true },
                  { step: '5', label: 'Construction du prompt contextuel', icon: '🧩', local: true },
                  { step: '6', label: 'Envoi à Gemini API (seul appel externe)', icon: '🤖', local: false },
                  { step: '7', label: 'Réception réponse + affichage + TTS', icon: '🔊', local: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      item.local ? 'bg-indigo/10 text-indigo' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {item.step}
                    </div>
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-xs text-gray-600 flex-1">{item.label}</span>
                    {!item.local && (
                      <span className="text-[9px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-full">Cloud</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Key metrics */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-indigo/5 rounded-xl p-3 text-center border border-indigo/10">
                <p className="text-lg font-bold text-indigo">0</p>
                <p className="text-[9px] text-gray-500">Serveur tiers</p>
              </div>
              <div className="bg-caribbean/5 rounded-xl p-3 text-center border border-caribbean/10">
                <p className="text-lg font-bold text-caribbean">&lt;100ms</p>
                <p className="text-[9px] text-gray-500">Recherche locale</p>
              </div>
              <div className="bg-sun/5 rounded-xl p-3 text-center border border-sun/10">
                <p className="text-lg font-bold text-sun-dark">AES-256</p>
                <p className="text-[9px] text-gray-500">Chiffrement</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Module Map */}
      <div className="bg-white rounded-2xl p-6 border border-sand-dark/15 shadow-sm animate-fade-in-up" style={{animationDelay: '300ms'}}>
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Cartographie des Modules</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { name: 'Auth', icon: '🔐', color: 'bg-red-50 border-red-200', desc: 'Login local + biométrie' },
            { name: 'Courses', icon: '📚', color: 'bg-caribbean/5 border-caribbean/20', desc: 'Gestion des cours' },
            { name: 'Documents', icon: '📄', color: 'bg-sun/5 border-sun/20', desc: 'Upload & parsing PDF' },
            { name: 'Chunks', icon: '✂️', color: 'bg-indigo/5 border-indigo/20', desc: 'Segmentation & index' },
            { name: 'RAG', icon: '🤖', color: 'bg-emerald-50 border-emerald-200', desc: 'Pipeline recherche+IA' },
            { name: 'History', icon: '📜', color: 'bg-purple-50 border-purple-200', desc: 'Historique Q&R' },
          ].map((mod, i) => (
            <div key={i} className={`${mod.color} border rounded-xl p-3 text-center hover:shadow-md transition-shadow`}>
              <span className="text-2xl block mb-1">{mod.icon}</span>
              <p className="text-xs font-bold text-gray-700">{mod.name}</p>
              <p className="text-[9px] text-gray-500 mt-0.5">{mod.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack Table */}
      <div className="bg-white rounded-2xl p-6 border border-sand-dark/15 shadow-sm animate-fade-in-up" style={{animationDelay: '400ms'}}>
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Stack Technique Détaillé</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b-2 border-sand-dark/20">
                <th className="text-left py-2 px-3 text-gray-500 font-semibold">Composant</th>
                <th className="text-left py-2 px-3 text-gray-500 font-semibold">Technologie</th>
                <th className="text-left py-2 px-3 text-gray-500 font-semibold">Rôle</th>
                <th className="text-left py-2 px-3 text-gray-500 font-semibold">Local/Cloud</th>
              </tr>
            </thead>
            <tbody>
              {[
                { comp: 'Framework', tech: 'Flutter 3.x / React Native', role: 'UI cross-platform', loc: '📱 Local' },
                { comp: 'Base de données', tech: 'SQLite + SQLCipher', role: 'Stockage chiffré', loc: '🔒 Local' },
                { comp: 'Recherche texte', tech: 'FTS5 (Full Text Search)', role: 'Recherche rapide <100ms', loc: '🔒 Local' },
                { comp: 'Hash mots de passe', tech: 'Argon2id', role: 'Sécurité credentials', loc: '🔒 Local' },
                { comp: 'Biométrie', tech: 'local_auth', role: 'Empreinte/Face ID', loc: '🔒 Local' },
                { comp: 'Parsing PDF', tech: 'pdfx / flutter_pdf_text', role: 'Extraction texte', loc: '🔒 Local' },
                { comp: 'Stockage fichiers', tech: 'path_provider', role: 'Répertoire sécurisé', loc: '🔒 Local' },
                { comp: 'Speech-to-Text', tech: 'speech_to_text', role: 'Transcription vocale', loc: '📱 Local (OS)' },
                { comp: 'Text-to-Speech', tech: 'flutter_tts', role: 'Lecture vocale', loc: '📱 Local (OS)' },
                { comp: 'API IA', tech: 'Gemini Pro', role: 'Génération réponses', loc: '☁️ Cloud' },
                { comp: 'Chiffrement DB', tech: 'SQLCipher', role: 'AES-256 at rest', loc: '🔒 Local' },
                { comp: 'Stockage clés', tech: 'flutter_secure_storage', role: 'API key sécurisée', loc: '🔒 Local' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-sand-dark/10 hover:bg-sand-light/50">
                  <td className="py-2.5 px-3 font-medium text-gray-700">{row.comp}</td>
                  <td className="py-2.5 px-3 text-indigo font-mono text-[11px]">{row.tech}</td>
                  <td className="py-2.5 px-3 text-gray-500">{row.role}</td>
                  <td className="py-2.5 px-3">{row.loc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Zero Trust Diagram */}
      <div className="bg-gradient-to-br from-indigo-dark to-indigo rounded-2xl p-6 text-white animate-fade-in-up" style={{animationDelay: '500ms'}}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <LegbaIcon className="w-6 h-6" color="white" />
          </div>
          <div>
            <h3 className="text-base font-bold">Modèle Zero Trust</h3>
            <p className="text-xs text-white/60">Aucune confiance implicite, tout est vérifié localement</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: 'Données au repos', desc: 'SQLCipher AES-256, clés dans Secure Enclave/KeyStore', icon: '🔐' },
            { title: 'Données en transit', desc: 'Seul le prompt Gemini sort, via HTTPS/TLS 1.3', icon: '🛡️' },
            { title: 'Accès applicatif', desc: 'Auth locale + biométrie, session timeout auto', icon: '👆' },
          ].map((item, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10">
              <span className="text-xl mb-2 block">{item.icon}</span>
              <p className="text-sm font-semibold mb-1">{item.title}</p>
              <p className="text-xs text-white/60">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
