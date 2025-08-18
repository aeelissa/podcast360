
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
      <div className="flex items-center gap-2 text-podcast-gray">
        <Radio className="w-4 h-4" />
        <span className="text-sm">اختر بودكاست أولاً</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Radio className="w-4 h-4 text-podcast-blue flex-shrink-0" />
      
      <Select 
        value={currentEpisode?.id || ''} 
        onValueChange={selectEpisode}
      >
        <SelectTrigger className="min-w-[180px] text-right">
          <SelectValue placeholder="اختر الحلقة" />
        </SelectTrigger>
        <SelectContent>
          {episodesForCurrentPodcast.map((episode) => (
            <SelectItem key={episode.id} value={episode.id} className="text-right">
              {episode.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button
        onClick={onCreateEpisode}
        size="sm"
        className="flex items-center gap-1 text-xs"
        disabled={!currentPodcast}
      >
        <Plus className="w-3 h-3" />
        حلقة جديدة
      </Button>
    </div>
  );
};

export default EpisodeSelector;
