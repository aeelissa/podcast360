
import React from 'react';
import { ChevronLeft, Home } from 'lucide-react';
import { usePodcast } from '../../contexts/PodcastContext';

const HierarchyBreadcrumb: React.FC = () => {
  const { currentPodcast, currentEpisode } = usePodcast();

  return (
    <div className="flex items-center gap-2 text-sm text-podcast-gray">
      <Home className="w-4 h-4" />
      
      {currentPodcast && (
        <>
          <ChevronLeft className="w-3 h-3" />
          <span className="font-medium text-podcast-blue">{currentPodcast.name}</span>
        </>
      )}
      
      {currentEpisode && (
        <>
          <ChevronLeft className="w-3 h-3" />
          <span className="font-medium">{currentEpisode.title}</span>
        </>
      )}
    </div>
  );
};

export default HierarchyBreadcrumb;
