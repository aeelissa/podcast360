
import React, { useState } from 'react';
import { X, Settings, Radio } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { usePodcast } from '../../contexts/PodcastContext';
import EpisodeConfigTab from '../settings/EpisodeConfigTab';

interface CreateEpisodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateEpisodeModal: React.FC<CreateEpisodeModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { createEpisode, currentPodcast } = usePodcast();

  const handleCreate = async () => {
    if (!title.trim() || !currentPodcast) return;
    
    try {
      setIsCreating(true);
      await createEpisode(title.trim(), description.trim() || undefined);
      handleClose();
    } catch (error) {
      console.error('Error creating episode:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    onClose();
  };

  if (!currentPodcast) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle className="text-xl font-bold text-podcast-blue flex items-center gap-2">
            <Radio className="w-5 h-5" />
            إنشاء حلقة جديدة
          </DialogTitle>
          <p className="text-sm text-podcast-gray mt-1">
            في بودكاست: {currentPodcast.name}
          </p>
        </DialogHeader>

        <Tabs defaultValue="basic" className="mt-4">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="basic" className="text-right">
              المعلومات الأساسية
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-right flex items-center gap-1">
              <Settings className="w-3 h-3" />
              إعدادات الحلقة
            </TabsTrigger>
          </TabsList>

          <div className="max-h-[50vh] overflow-y-auto">
            <TabsContent value="basic" className="space-y-4">
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
                  className="text-right min-h-[100px]"
                  placeholder="وصف مختصر عن محتوى الحلقة وأهدافها"
                />
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <EpisodeConfigTab />
            </TabsContent>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-6">
            <Button variant="outline" onClick={handleClose}>
              إلغاء
            </Button>
            <Button 
              onClick={handleCreate} 
              disabled={!title.trim() || isCreating}
              className="flex items-center gap-2"
            >
              {isCreating ? 'جاري الإنشاء...' : 'إنشاء الحلقة'}
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEpisodeModal;
