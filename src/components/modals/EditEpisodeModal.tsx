
import React, { useState, useEffect } from 'react';
import { X, Settings, Radio } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { usePodcast } from '../../contexts/PodcastContext';
import { CONTENT_TYPE_OPTIONS } from '../../types/settings';

interface EditEpisodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditEpisodeModal: React.FC<EditEpisodeModalProps> = ({ isOpen, onClose }) => {
  const { currentEpisode, currentPodcast, updateEpisode } = usePodcast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goals, setGoals] = useState<string[]>(['']);
  const [successCriteria, setSuccessCriteria] = useState<string[]>(['']);
  const [duration, setDuration] = useState(30);
  const [contentType, setContentType] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Load current episode data when modal opens
  useEffect(() => {
    if (isOpen && currentEpisode) {
      setTitle(currentEpisode.title);
      setDescription(currentEpisode.description || '');
      setGoals(currentEpisode.settings.goals.length > 0 ? currentEpisode.settings.goals : ['']);
      setSuccessCriteria(currentEpisode.settings.successCriteria.length > 0 ? currentEpisode.settings.successCriteria : ['']);
      setDuration(currentEpisode.settings.duration || 30);
      setContentType(currentEpisode.settings.contentType || '');
    }
  }, [isOpen, currentEpisode]);

  const handleGoalChange = (index: number, value: string) => {
    const newGoals = [...goals];
    newGoals[index] = value;
    setGoals(newGoals);
  };

  const addGoal = () => {
    setGoals([...goals, '']);
  };

  const removeGoal = (index: number) => {
    if (goals.length > 1) {
      setGoals(goals.filter((_, i) => i !== index));
    }
  };

  const handleCriteriaChange = (index: number, value: string) => {
    const newCriteria = [...successCriteria];
    newCriteria[index] = value;
    setSuccessCriteria(newCriteria);
  };

  const addCriteria = () => {
    setSuccessCriteria([...successCriteria, '']);
  };

  const removeCriteria = (index: number) => {
    if (successCriteria.length > 1) {
      setSuccessCriteria(successCriteria.filter((_, i) => i !== index));
    }
  };

  const handleUpdate = async () => {
    if (!title.trim() || !currentEpisode || !currentPodcast) return;
    
    try {
      setIsUpdating(true);
      
      const updatedEpisode = {
        ...currentEpisode,
        title: title.trim(),
        description: description.trim() || undefined,
        settings: {
          ...currentEpisode.settings,
          goals: goals.filter(g => g.trim()),
          successCriteria: successCriteria.filter(c => c.trim()),
          duration,
          contentType: contentType || 'مقابلة'
        },
        modifiedAt: new Date().toISOString()
      };

      updateEpisode(updatedEpisode);
      handleClose();
    } catch (error) {
      console.error('Error updating episode:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!currentEpisode || !currentPodcast) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle className="text-xl font-bold text-podcast-blue flex items-center gap-2">
            <Radio className="w-5 h-5" />
            تحرير إعدادات الحلقة
          </DialogTitle>
          <p className="text-sm text-podcast-gray mt-1">
            في بودكاست: {currentPodcast.name}
          </p>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto space-y-6 pr-2">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-bold text-podcast-blue text-right">
              المعلومات الأساسية
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="episodeTitle" className="text-right">عنوان الحلقة *</Label>
              <Input
                id="episodeTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-right"
                placeholder="أدخل عنوان الحلقة"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="episodeDescription" className="text-right">وصف الحلقة</Label>
              <Textarea
                id="episodeDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-right min-h-[80px]"
                placeholder="وصف مختصر عن محتوى الحلقة وأهدافها"
              />
            </div>
          </div>

          {/* Episode Brain Settings */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-podcast-blue text-right flex items-center gap-2">
              <Settings className="w-4 h-4" />
              إعدادات الحلقة (Episode Brain)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-right">نوع المحتوى</Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="اختر نوع المحتوى" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTENT_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option} className="text-right">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-right">المدة المتوقعة (دقيقة)</Label>
                <Input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="text-right"
                  min={5}
                  max={180}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Button type="button" onClick={addGoal} size="sm" variant="outline">
                  إضافة هدف
                </Button>
                <Label className="text-right">أهداف الحلقة</Label>
              </div>
              {goals.map((goal, index) => (
                <div key={index} className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => removeGoal(index)}
                    size="sm"
                    variant="outline"
                    disabled={goals.length === 1}
                  >
                    حذف
                  </Button>
                  <Input
                    value={goal}
                    onChange={(e) => handleGoalChange(index, e.target.value)}
                    className="text-right flex-1"
                    placeholder="مثال: تعريف المستمعين بالموضوع"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Button type="button" onClick={addCriteria} size="sm" variant="outline">
                  إضافة معيار
                </Button>
                <Label className="text-right">معايير النجاح</Label>
              </div>
              {successCriteria.map((criteria, index) => (
                <div key={index} className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => removeCriteria(index)}
                    size="sm"
                    variant="outline"
                    disabled={successCriteria.length === 1}
                  >
                    حذف
                  </Button>
                  <Input
                    value={criteria}
                    onChange={(e) => handleCriteriaChange(index, e.target.value)}
                    className="text-right flex-1"
                    placeholder="مثال: الحصول على تقييم 4.5 نجوم"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-6">
          <Button variant="outline" onClick={handleClose}>
            إلغاء
          </Button>
          <Button 
            onClick={handleUpdate} 
            disabled={!title.trim() || isUpdating}
            className="flex items-center gap-2"
          >
            {isUpdating ? 'جاري التحديث...' : 'حفظ التغييرات'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditEpisodeModal;
