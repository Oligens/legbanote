import { useState } from 'react';

interface Route {
  method: 'GET' | 'POST' | 'DELETE' | 'PUT';
  path: string;
  description: string;
  params?: { name: string; type: string; required: boolean; description: string }[];
  response: string;
  controller: string;
}

const routes: Route[] = [
  {
    method: 'POST',
    path: '/auth/register',
    description: 'Enregistrement d\'un nouvel utilisateur local avec hash Argon2id',
    controller: 'AuthController',
    params: [
      { name: 'username', type: 'string', required: true, description: 'Nom d\'utilisateur unique' },
      { name: 'password', type: 'string', required: true, description: 'Mot de passe (min 8 car.)' },
    ],
    response: '{ success: bool, userId: int, sessionToken: string }',
  },
  {
    method: 'POST',
    path: '/auth/login',
    description: 'Vérification des identifiants locaux et création de session',
    controller: 'AuthController',
    params: [
      { name: 'username', type: 'string', required: true, description: 'Nom d\'utilisateur' },
      { name: 'password', type: 'string', required: true, description: 'Mot de passe' },
    ],
    response: '{ success: bool, sessionToken?: string, error?: string }',
  },
  {
    method: 'POST',
    path: '/auth/biometric',
    description: 'Authentification biométrique (empreinte/Face ID) via local_auth',
    controller: 'AuthController',
    params: [],
    response: '{ success: bool, sessionToken?: string }',
  },
  {
    method: 'POST',
    path: '/auth/logout',
    description: 'Déstruction de la session en cours (token en mémoire)',
    controller: 'AuthController',
    params: [],
    response: '{ success: bool }',
  },
  {
    method: 'GET',
    path: '/courses',
    description: 'Récupération de tous les cours de l\'utilisateur connecté',
    controller: 'CourseController',
    params: [
      { name: 'category', type: 'string?', required: false, description: 'Filtrer par catégorie' },
      { name: 'sort', type: 'string', required: false, description: 'Tri (created_at, title)' },
    ],
    response: '{ courses: CourseRecord[] }',
  },
  {
    method: 'POST',
    path: '/courses',
    description: 'Création d\'un nouveau cours (métadonnées uniquement)',
    controller: 'CourseController',
    params: [
      { name: 'title', type: 'string', required: true, description: 'Titre du cours' },
      { name: 'description', type: 'string?', required: false, description: 'Description' },
      { name: 'category', type: 'string', required: false, description: 'Catégorie' },
      { name: 'icon', type: 'string', required: false, description: 'Emoji icône' },
      { name: 'color', type: 'string', required: false, description: 'Couleur hex carte' },
    ],
    response: '{ success: bool, courseId: int }',
  },
  {
    method: 'DELETE',
    path: '/courses/:id',
    description: 'Suppression en cascade : cours + documents + chunks + fichiers PDF',
    controller: 'CourseController',
    params: [
      { name: 'id', type: 'int', required: true, description: 'ID du cours (URL param)' },
    ],
    response: '{ success: bool, deletedChunks: int, deletedFiles: int }',
  },
  {
    method: 'POST',
    path: '/documents/upload',
    description: 'Import PDF : stockage physique, extraction texte, chunking, indexation FTS5',
    controller: 'DocumentController',
    params: [
      { name: 'filePath', type: 'string', required: true, description: 'Chemin source du PDF' },
      { name: 'courseId', type: 'int', required: true, description: 'ID du cours cible' },
    ],
    response: '{ success: bool, documentId: int, chunksCreated: int }',
  },
  {
    method: 'GET',
    path: '/documents/:courseId',
    description: 'Liste des documents associés à un cours',
    controller: 'DocumentController',
    params: [
      { name: 'courseId', type: 'int', required: true, description: 'ID du cours (URL param)' },
    ],
    response: '{ documents: DocumentRecord[] }',
  },
  {
    method: 'POST',
    path: '/rag/query',
    description: 'Route principale RAG : recherche locale FTS5 + appel Gemini Pro',
    controller: 'RagController',
    params: [
      { name: 'question', type: 'string', required: true, description: 'Question (transcrite ou tapée)' },
      { name: 'courseFilter', type: 'int[]?', required: false, description: 'Filtrer par cours' },
      { name: 'topK', type: 'int', required: false, description: 'Nombre de chunks (défaut: 3)' },
    ],
    response: '{ answer: string, sources: Source[], tokensUsed: int, latencyMs: int }',
  },
  {
    method: 'GET',
    path: '/history',
    description: 'Historique des questions/réponses avec pagination',
    controller: 'HistoryController',
    params: [
      { name: 'limit', type: 'int', required: false, description: 'Nombre de résultats (défaut: 20)' },
      { name: 'offset', type: 'int', required: false, description: 'Décalage pagination' },
      { name: 'saved', type: 'bool?', required: false, description: 'Filtrer favoris' },
    ],
    response: '{ history: HistoryRecord[], total: int }',
  },
  {
    method: 'PUT',
    path: '/history/:id/save',
    description: 'Marquer/démarquer une entrée d\'historique comme favori',
    controller: 'HistoryController',
    params: [
      { name: 'id', type: 'int', required: true, description: 'ID de l\'entrée (URL param)' },
      { name: 'isSaved', type: 'bool', required: true, description: 'État favori' },
    ],
    response: '{ success: bool }',
  },
  {
    method: 'DELETE',
    path: '/history/:id',
    description: 'Supprimer une entrée de l\'historique',
    controller: 'HistoryController',
    params: [
      { name: 'id', type: 'int', required: true, description: 'ID de l\'entrée (URL param)' },
    ],
    response: '{ success: bool }',
  },
];

export default function ApiRoutes() {
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);
  const [filterController, setFilterController] = useState<string>('all');

  const controllers = ['all', ...new Set(routes.map(r => r.controller))];
  const filteredRoutes = filterController === 'all' 
    ? routes 
    : routes.filter(r => r.controller === filterController);

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-emerald-500';
      case 'POST': return 'bg-blue-500';
      case 'DELETE': return 'bg-red-500';
      case 'PUT': return 'bg-amber-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="animate-fade-in-up">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Routes API Locales</h2>
        <p className="text-gray-500 text-sm">Routeur interne modulaire — 13 endpoints couvrant l'ensemble des fonctionnalités</p>
      </div>

      {/* Architecture Router */}
      <div className="bg-white rounded-2xl p-6 border border-sand-dark/15 shadow-sm animate-fade-in-up" style={{animationDelay: '100ms'}}>
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Architecture du Routeur</h3>
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex flex-col items-center gap-3">
            <div className="bg-indigo text-white rounded-xl px-6 py-3 text-center">
              <p className="text-xs font-bold">AppRouter (Entry Point)</p>
              <p className="text-[10px] opacity-70">Dispatch vers les contrôleurs</p>
            </div>
            <svg className="w-4 h-6 text-gray-300" viewBox="0 0 16 24">
              <path d="M8 0v20m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </svg>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 w-full">
              {['Auth', 'Course', 'Document', 'RAG', 'History'].map((ctrl) => (
                <div key={ctrl} className="bg-white rounded-lg px-3 py-2 text-center border border-sand-dark/10 shadow-sm">
                  <p className="text-[10px] font-bold text-indigo">{ctrl}Controller</p>
                </div>
              ))}
            </div>
            <svg className="w-4 h-6 text-gray-300" viewBox="0 0 16 24">
              <path d="M8 0v20m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </svg>
            <div className="bg-sun/10 rounded-xl px-6 py-3 text-center border border-sun/20 w-full">
              <p className="text-xs font-bold text-sun-dark">Service Layer (SQLite + FTS5 + File System)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap animate-fade-in-up" style={{animationDelay: '200ms'}}>
        <span className="text-xs text-gray-500">Filtrer :</span>
        {controllers.map((ctrl) => (
          <button
            key={ctrl}
            onClick={() => setFilterController(ctrl)}
            className={`text-[10px] px-3 py-1.5 rounded-full font-medium transition-all ${
              filterController === ctrl
                ? 'bg-indigo text-white'
                : 'bg-white text-gray-500 border border-sand-dark/20 hover:border-indigo/30'
            }`}
          >
            {ctrl === 'all' ? 'Tous' : ctrl.replace('Controller', '')}
          </button>
        ))}
      </div>

      {/* Routes List */}
      <div className="space-y-2 animate-fade-in-up" style={{animationDelay: '300ms'}}>
        {filteredRoutes.map((route, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-sand-dark/15 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <button
              onClick={() => setSelectedRoute(selectedRoute === i ? null : i)}
              className="w-full text-left px-4 py-3 flex items-center gap-3"
            >
              <span className={`${getMethodColor(route.method)} text-white text-[10px] font-bold px-2 py-0.5 rounded min-w-[45px] text-center`}>
                {route.method}
              </span>
              <span className="text-xs font-mono text-gray-700 flex-1">{route.path}</span>
              <span className="text-[10px] text-gray-400 hidden sm:block">{route.controller}</span>
              <svg className={`w-4 h-4 text-gray-300 transition-transform ${selectedRoute === i ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {selectedRoute === i && (
              <div className="px-4 pb-4 pt-1 border-t border-sand-dark/10 animate-slide-in">
                <p className="text-xs text-gray-600 mb-3">{route.description}</p>
                
                {route.params && route.params.length > 0 && (
                  <div className="mb-3">
                    <p className="text-[10px] font-semibold text-gray-500 mb-1.5">Paramètres :</p>
                    <div className="space-y-1">
                      {route.params.map((param, j) => (
                        <div key={j} className="flex items-center gap-2 text-[10px]">
                          <span className="font-mono text-indigo bg-indigo/5 px-1.5 py-0.5 rounded">{param.name}</span>
                          <span className="text-gray-400">{param.type}</span>
                          {param.required && <span className="text-red-400 text-[8px]">required</span>}
                          <span className="text-gray-500 ml-auto">{param.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-[10px] font-semibold text-gray-500 mb-1">Réponse :</p>
                  <div className="bg-gray-900 rounded-lg px-3 py-2 overflow-x-auto">
                    <code className="code-block text-green-300 text-[10px]">{route.response}</code>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Router Implementation */}
      <div className="bg-white rounded-2xl border border-sand-dark/15 shadow-sm overflow-hidden animate-fade-in-up" style={{animationDelay: '400ms'}}>
        <div className="bg-gray-900 px-4 py-2.5 flex items-center justify-between">
          <span className="text-xs text-gray-400 font-mono">app_router.dart</span>
          <span className="text-[10px] bg-blue-400/20 text-blue-300 px-2 py-0.5 rounded-full">Dart</span>
        </div>
        <div className="p-4 bg-gray-950 overflow-x-auto max-h-[400px] overflow-y-auto">
          <pre className="code-block text-gray-300 whitespace-pre">{`/// Routeur interne de l'application
/// Dispatche les requêtes vers les contrôleurs appropriés
class AppRouter {
  late final AuthController _authController;
  late final CourseController _courseController;
  late final DocumentController _documentController;
  late final RagController _ragController;
  late final HistoryController _historyController;

  AppRouter(Database db, GeminiClient gemini) {
    _authController = AuthController(db);
    _courseController = CourseController(db);
    _documentController = DocumentController(db);
    _ragController = RagController(db, gemini);
    _historyController = HistoryController(db);
  }

  /// Dispatch principal
  Future<RouteResponse> handle(RouteRequest request) async {
    // Vérification auth (sauf pour /auth/*)
    if (!request.path.startsWith('/auth/') && 
        !_authController.isAuthenticated()) {
      return RouteResponse.unauthorized();
    }

    // Routing
    switch (request.method) {
      // Auth
      case RouteMethod.POST when request.path == '/auth/register':
        return await _authController.register(request.body);
      case RouteMethod.POST when request.path == '/auth/login':
        return await _authController.login(request.body);
      case RouteMethod.POST when request.path == '/auth/biometric':
        return await _authController.biometricLogin();
      case RouteMethod.POST when request.path == '/auth/logout':
        return _authController.logout();

      // Courses
      case RouteMethod.GET when request.path == '/courses':
        return await _courseController.getAll(request.query);
      case RouteMethod.POST when request.path == '/courses':
        return await _courseController.create(request.body);
      case RouteMethod.DELETE when request.path.startsWith('/courses/'):
        final id = _extractId(request.path);
        return await _courseController.delete(id);

      // Documents
      case RouteMethod.POST when request.path == '/documents/upload':
        return await _documentController.upload(request.body);
      case RouteMethod.GET when request.path.startsWith('/documents/'):
        final courseId = _extractId(request.path);
        return await _documentController.getByCourse(courseId);

      // RAG (Route principale)
      case RouteMethod.POST when request.path == '/rag/query':
        return await _ragController.query(request.body);

      // History
      case RouteMethod.GET when request.path == '/history':
        return await _historyController.getAll(request.query);
      case RouteMethod.PUT when request.path.contains('/save'):
        final id = _extractId(request.path);
        return await _historyController.toggleSave(id, request.body);
      case RouteMethod.DELETE when request.path.startsWith('/history/'):
        final id = _extractId(request.path);
        return await _historyController.delete(id);

      default:
        return RouteResponse.notFound();
    }
  }
}`}</pre>
        </div>
      </div>
    </div>
  );
}
