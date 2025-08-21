import React, { useState } from 'react';
import { Settings, Users, Book, ChevronDown, ChevronRight, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { usePodcast } from '../contexts/PodcastContext';
import PodcastSelector from './hierarchy/PodcastSelector';
import EpisodeSelector from './hierarchy/EpisodeSelector';
import CreatePodcastModal from './modals/CreatePodcastModal';
import EditPodcastModal from './modals/EditPodcastModal';
import CreateEpisodeModal from './modals/CreateEpisodeModal';
import EditEpisodeModal from './modals/EditEpisodeModal';
import KnowledgeBasePanel from './knowledge/KnowledgeBasePanel';

const NavigationPanel = () => {
  const { currentPodcast, currentEpisode } = usePodcast();
  const [activeView, setActiveView] = useState<'navigation' | 'knowledge'>('navigation');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['podcasts']));
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Modal states
  const [showCreatePodcast, setShowCreatePodcast] = useState(false);
  const [showEditPodcast, setShowEditPodcast] = useState(false);
  const [showCreateEpisode, setShowCreateEpisode] = useState(false);
  const [showEditEpisode, setShowEditEpisode] = useState(false);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const renderNavigationContent = () => (
    <div className="arabic-content" dir="rtl">
      {/* Podcast Management Section */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('podcasts')}
          className="w-full flex items-center justify-between p-3 text-right hover:bg-podcast-gold/10 rounded-lg transition-colors arabic-text"
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {!isMinimized && <span className="font-medium">إدارة البودكاست</span>}
          </div>
          {!isMinimized && (expandedSections.has('podcasts') ? 
            <ChevronDown className="w-4 h-4" /> : 
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {expandedSections.has('podcasts') && !isMinimized && (
          <div className="space-y-3 pr-6">
            <PodcastSelector
              onCreatePodcast={() => setShowCreatePodcast(true)}
            />
            
            {currentPodcast && (
              <EpisodeSelector
                onCreateEpisode={() => setShowCreateEpisode(true)}
              />
            )}
          </div>
        )}
      </div>

      {/* Current Context Display */}
      {(currentPodcast || currentEpisode) && !isMinimized && (
        <div className="border border-podcast-border rounded-lg p-3 bg-podcast-gold/5 arabic-content">
          <h4 className="font-medium text-sm mb-2 text-right">السياق الحالي</h4>
          {currentPodcast && (
            <p className="text-xs text-podcast-gray text-right mb-1">
              البودكاست: {currentPodcast.name}
            </p>
          )}
          {currentEpisode && (
            <p className="text-xs text-podcast-gray text-right">
              الحلقة: {currentEpisode.title}
            </p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className={`podcast-panel h-full flex flex-col transition-all duration-300 ${
        isMinimized ? 'w-16' : 'w-full'
      }`}>
        {/* Enhanced Header with View Switcher */}
        <div className="podcast-header px-4 py-3 rounded-t-xl flex-shrink-0">
          <div className="flex items-center justify-between mb-3 arabic-content">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
                title={isMinimized ? "توسيع" : "تصغير"}
              >
                {isMinimized ? <ChevronRightIcon className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
              {!isMinimized && <h2 className="font-bold text-right">لوحة التنقل</h2>}
            </div>
          </div>
          
          {/* View Switcher */}
          {!isMinimized && (
            <div className="flex gap-1 bg-white/20 rounded-lg p-1">
              <button
                onClick={() => setActiveView('navigation')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs transition-colors arabic-text ${
                  activeView === 'navigation'
                    ? 'bg-white text-podcast-gold-dark shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Users className="w-4 h-4" />
                التنقل
              </button>
              <button
                onClick={() => setActiveView('knowledge')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs transition-colors arabic-text ${
                  activeView === 'knowledge'
                    ? 'bg-white text-podcast-gold-dark shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Book className="w-4 h-4" />
                المعرفة
              </button>
            </div>
          )}

          {/* Minimized view switcher */}
          {isMinimized && (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setActiveView('navigation')}
                className={`p-2 rounded-md transition-colors ${
                  activeView === 'navigation'
                    ? 'bg-white text-podcast-gold-dark shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                title="التنقل"
              >
                <Users className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveView('knowledge')}
                className={`p-2 rounded-md transition-colors ${
                  activeView === 'knowledge'
                    ? 'bg-white text-podcast-gold-dark shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
                title="المعرفة"
              >
                <Book className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Content Based on Active View */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {activeView === 'navigation' && (
            <div className="h-full overflow-y-auto p-4 space-y-4">
              {renderNavigationContent()}
            </div>
          )}
          
          {activeView === 'knowledge' && <KnowledgeBasePanel />}
        </div>
      </div>

      {/* Modals */}
      <CreatePodcastModal
        isOpen={showCreatePodcast}
        onClose={() => setShowCreatePodcast(false)}
      />
      
      <EditPodcastModal
        isOpen={showEditPodcast}
        onClose={() => setShowEditPodcast(false)}
      />
      
      <CreateEpisodeModal
        isOpen={showCreateEpisode}
        onClose={() => setShowCreateEpisode(false)}
      />
      
      <EditEpisodeModal
        isOpen={showEditEpisode}
        onClose={() => setShowEditEpisode(false)}
      />
    </>
  );
};

export default NavigationPanel;
