
import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, X } from 'lucide-react';
import { usePodcastSettings } from '../../contexts/PodcastSettingsContext';
import { CONTENT_TYPE_OPTIONS } from '../../types/settings';

const EpisodeConfigTab = () => {
  const { settings, updateEpisode } = usePodcastSettings();
  const [newGoal, setNewGoal] = useState('');
  const [newCriteria, setNewCriteria] = useState('');

  const addGoal = () => {
    if (newGoal.trim()) {
      updateEpisode({ goals: [...settings.episode.goals, newGoal.trim()] });
      setNewGoal('');
    }
  };

  const removeGoal = (index: number) => {
    updateEpisode({ goals: settings.episode.goals.filter((_, i) => i !== index) });
  };

  const addCriteria = () => {
    if (newCriteria.trim()) {
      updateEpisode({ successCriteria: [...settings.episode.successCriteria, newCriteria.trim()] });
      setNewCriteria('');
    }
  };

  const removeCriteria = (index: number) => {
    updateEpisode({ successCriteria: settings.episode.successCriteria.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="space-y-2">
        <Label className="text-right">نوع المحتوى</Label>
        <Select value={settings.episode.contentType} onValueChange={(contentType) => updateEpisode({ contentType })}>
          <SelectTrigger className="text-right">
            <SelectValue placeholder="اختر نوع المحتوى" />
          </SelectTrigger>
          <SelectContent>
            {CONTENT_TYPE_OPTIONS.map((type) => (
              <SelectItem key={type} value={type} className="text-right">
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration" className="text-right">المدة المتوقعة (دقيقة)</Label>
        <Input
          id="duration"
          type="number"
          min="1"
          max="300"
          value={settings.episode.duration}
          onChange={(e) => updateEpisode({ duration: parseInt(e.target.value) || 45 })}
          className="text-right"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-right">أهداف الحلقة</Label>
        <div className="space-y-2">
          {settings.episode.goals.map((goal, index) => (
            <div key={index} className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeGoal(index)}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
              <div className="flex-1 text-sm bg-gray-50 rounded-lg px-3 py-2 text-right">
                {goal}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Button onClick={addGoal} size="sm" className="shrink-0">
            <Plus className="w-4 h-4" />
          </Button>
          <Input
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addGoal()}
            placeholder="أضف هدف جديد للحلقة"
            className="text-right"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-right">معايير النجاح</Label>
        <div className="space-y-2">
          {settings.episode.successCriteria.map((criteria, index) => (
            <div key={index} className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeCriteria(index)}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
              <div className="flex-1 text-sm bg-gray-50 rounded-lg px-3 py-2 text-right">
                {criteria}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Button onClick={addCriteria} size="sm" className="shrink-0">
            <Plus className="w-4 h-4" />
          </Button>
          <Input
            value={newCriteria}
            onChange={(e) => setNewCriteria(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCriteria()}
            placeholder="أضف معيار نجاح جديد"
            className="text-right"
          />
        </div>
      </div>
    </div>
  );
};

export default EpisodeConfigTab;
