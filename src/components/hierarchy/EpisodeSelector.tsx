
import React from 'react';
import { Radio, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { usePodcast } from '../../contexts/PodcastContext';

interface EpisodeSelectorProps {
  onCreateEpisode: () => void;
}

const EpisodeSelector: React.FC<EpisodeSelectorProps> = ({ onCreateEpisode }) => {
  const { currentEpisode, episodesForCurrentPodcast, selectEpisode, currentPodcast } = usePodcast();

  if (!currentPodcast) {
    return (
      <div className="flex items-center gap-2 text-podcast-gray justify-end">
        <span className="text-xs">اختر بودكاست أولاً</span>
        <Radio className="w-3 h-3" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 justify-end">
      <Button
        onClick={onCreateEpisode}
        size="sm"
        variant="outline"
        className="flex items-center gap-1 text-xs h-7 px-2"
        disabled={!currentPodcast}
      >
        <Plus className="w-3 h-3" />
        حلقة جديدة
      </Button>
      
      <Select 
        value={currentEpisode?.id || ''} 
        onValueChange={selectEpisode}
      >
        <SelectTrigger className="min-w-[140px] h-7 text-xs bg-white border-podcast-gold/30">
          <div className="flex items-center gap-1">
            <SelectValue placeholder="اختر الحلقة" />
            <Radio className="w-3 h-3 text-podcast-gold-dark flex-shrink-0" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white border border-podcast-border shadow-lg z-50">
          {episodesForCurrentPodcast.map((episode) => (
            <SelectItem key={episode.id} value={episode.id} className="text-right text-xs">
              {episode.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default EpisodeSelector;
