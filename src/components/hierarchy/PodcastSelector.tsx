
import React from 'react';
import { ChevronDown, Podcast, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { usePodcast } from '../../contexts/PodcastContext';

interface PodcastSelectorProps {
  onCreatePodcast: () => void;
}

const PodcastSelector: React.FC<PodcastSelectorProps> = ({ onCreatePodcast }) => {
  const { currentPodcast, allPodcasts, selectPodcast } = usePodcast();

  return (
    <div className="flex items-center gap-2">
      <Podcast className="w-4 h-4 text-podcast-blue flex-shrink-0" />
      
      <Select 
        value={currentPodcast?.id || ''} 
        onValueChange={selectPodcast}
      >
        <SelectTrigger className="min-w-[180px] text-right">
          <SelectValue placeholder="اختر البودكاست" />
        </SelectTrigger>
        <SelectContent>
          {allPodcasts.map((podcast) => (
            <SelectItem key={podcast.id} value={podcast.id} className="text-right">
              {podcast.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button
        onClick={onCreatePodcast}
        size="sm"
        className="flex items-center gap-1 text-xs"
      >
        <Plus className="w-3 h-3" />
        جديد
      </Button>
    </div>
  );
};

export default PodcastSelector;
