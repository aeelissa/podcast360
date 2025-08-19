
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
    <div className="flex items-center gap-2 justify-end">
      <Button
        onClick={onCreatePodcast}
        size="sm"
        variant="outline"
        className="flex items-center gap-1 text-xs h-7 px-2"
      >
        <Plus className="w-3 h-3" />
        جديد
      </Button>
      
      <Select 
        value={currentPodcast?.id || ''} 
        onValueChange={selectPodcast}
      >
        <SelectTrigger className="min-w-[140px] h-7 text-xs bg-white border-podcast-blue/20">
          <div className="flex items-center gap-1">
            <SelectValue placeholder="اختر البودكاست" />
            <Podcast className="w-3 h-3 text-podcast-blue flex-shrink-0" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white border border-podcast-border shadow-lg z-50">
          {allPodcasts.map((podcast) => (
            <SelectItem key={podcast.id} value={podcast.id} className="text-right text-xs">
              {podcast.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PodcastSelector;
