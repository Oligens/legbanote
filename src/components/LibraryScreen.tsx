import { Screen } from '../App';
import LegbaIcon from './LegbaIcon';

interface LibraryScreenProps {
  onNavigate: (screen: Screen) => void;
}

const courses = [
  {
    id: 1,
    title: 'Économie Globale',
    chapters: 12,
    icon: '📊',
    color: 'bg-caribbean',
    lightColor: 'bg-caribbean/10',
    textColor: 'text-caribbean',
  },
  {
    id: 2,
    title: 'Droit Constitutionnel',
    chapters: 8,
    icon: '⚖️',
    color: 'bg-sun',
    lightColor: 'bg-sun/10',
    textColor: 'text-sun-dark',
  },
  {
    id: 3,
    title: 'Histoire d\'Haïti',
    chapters: 15,
    icon: '🏛️',
    color: 'bg-indigo',
    lightColor: 'bg-indigo/10',
    textColor: 'text-indigo',
  },
  {
    id: 4,
    title: 'Philosophie Moderne',
    chapters: 6,
    icon: '🧠',
    color: 'bg-emerald-500',
    lightColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-600',
  },
  {
    id: 5,
    title: 'Mathématiques',
    chapters: 10,
    icon: '📐',
    color: 'bg-rose-500',
    lightColor: 'bg-rose-500/10',
    textColor: 'text-rose-600',
  },
];

export default function LibraryScreen({ onNavigate }: LibraryScreenProps) {
  return (
    <div className="h-full overflow-y-auto bg-sand-light pb-4">
      {/* Header */}
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <LegbaIcon className="w-7 h-7" color="#3D1E6D" />
            <h1 className="text-lg font-bold text-indigo-dark">Legba Note</h1>
          </div>
          <div className="w-8 h-8 rounded-full bg-indigo/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-indigo" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        </div>

        {/* Search Bar */}
        <button
          onClick={() => onNavigate('conversation')}
          className="w-full bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-sm border border-sand-dark/20 hover:shadow-md transition-shadow"
        >
          <svg className="w-5 h-5 text-indigo" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-sm text-gray-400 italic">Interroger ma connaissance...</span>
          <div className="ml-auto flex items-center gap-1.5 bg-indigo/10 px-2.5 py-1 rounded-full">
            <svg className="w-3 h-3 text-indigo" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
            <span className="text-[10px] font-medium text-indigo">IA</span>
          </div>
        </button>
      </div>

      {/* Section: Mes Cours Actuels */}
      <div className="px-5 mt-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700">Mes Cours Actuels</h2>
          <span className="text-xs text-caribbean font-medium">{courses.length} cours</span>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-2 gap-3">
          {courses.map((course, index) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-sand-dark/10 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-10 h-10 ${course.lightColor} rounded-xl flex items-center justify-center text-xl mb-3`}>
                {course.icon}
              </div>
              <h3 className="text-xs font-semibold text-gray-800 mb-1 line-clamp-2">{course.title}</h3>
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-[10px] text-gray-400">{course.chapters} chapitres</span>
              </div>
              <div className={`mt-2 h-1 rounded-full ${course.color} opacity-60`} style={{width: `${Math.min(course.chapters * 7, 100)}%`}}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-5 mt-5">
        <div className="bg-gradient-to-r from-indigo to-indigo-light rounded-2xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs opacity-80">Progression cette semaine</p>
              <p className="text-2xl font-bold mt-1">73%</p>
              <p className="text-[10px] opacity-70 mt-0.5">+12% vs semaine dernière</p>
            </div>
            <div className="w-14 h-14 rounded-full border-3 border-white/30 flex items-center justify-center">
              <LegbaIcon className="w-8 h-8" color="white" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-5 mt-5 mb-2">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Activité Récente</h2>
        <div className="space-y-2">
          {[
            { text: 'Question sur le PIB mondial', time: 'Il y a 2h', type: 'question' },
            { text: 'Chapitre 4 ajouté - Droit', time: 'Hier', type: 'upload' },
            { text: 'Session de révision - Philo', time: 'Hier', type: 'review' },
          ].map((activity, i) => (
            <div key={i} className="flex items-center gap-3 bg-white rounded-xl px-3 py-2.5 border border-sand-dark/10">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                activity.type === 'question' ? 'bg-indigo/10' : 
                activity.type === 'upload' ? 'bg-caribbean/10' : 'bg-sun/10'
              }`}>
                {activity.type === 'question' && (
                  <svg className="w-4 h-4 text-indigo" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {activity.type === 'upload' && (
                  <svg className="w-4 h-4 text-caribbean" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                )}
                {activity.type === 'review' && (
                  <svg className="w-4 h-4 text-sun-dark" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-700 truncate">{activity.text}</p>
                <p className="text-[10px] text-gray-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Add Button */}
      <button className="fixed bottom-24 right-6 md:right-auto md:left-[calc(50%+170px)] w-14 h-14 bg-gradient-to-br from-sun to-sun-dark rounded-full shadow-lg shadow-sun/30 flex items-center justify-center hover:scale-110 transition-transform duration-300 z-50">
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
