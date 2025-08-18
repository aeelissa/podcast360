
import React, { useState } from 'react';
import { X, Settings, Podcast } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { usePodcast } from '../../contexts/PodcastContext';
import PodcastIdentityTab from '../settings/PodcastIdentityTab';

interface CreatePodcastModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePodcastModal: React.FC<CreatePodcastModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { createPodcast } = usePodcast();

  const handleCreate = async () => {
    if (!name.trim()) return;
    
    try {
      setIsCreating(true);
      await createPodcast(name.trim(), description.trim());
      handleClose();
    } catch (error) {
      console.error('Error creating podcast:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle className="text-xl font-bold text-podcast-blue flex items-center gap-2">
            <Podcast className="w-5 h-5" />
            إنشاء بودكاست جديد
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="mt-4">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="basic" className="text-right">
              المعلومات الأساسية
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-right flex items-center gap-1">
              <Settings className="w-3 h-3" />
              الإعدادات
            </TabsTrigger>
          </TabsList>

          <div className="max-h-[50vh] overflow-y-auto">
            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="podcastName" className="text-right">اسم البودكاست *</Label>
                <Input
                  id="podcastName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-right"
                  placeholder="أدخل اسم البودكاست"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="podcastDescription" className="text-right">وصف البودكاست</Label>
                <Textarea
                  id="podcastDescription"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="text-right min-h-[100px]"
                  placeholder="وصف مختصر عن البودكاست وأهدافه"
                />
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <PodcastIdentityTab />
            </TabsContent>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-6">
            <Button variant="outline" onClick={handleClose}>
              إلغاء
            </Button>
            <Button 
              onClick={handleCreate} 
              disabled={!name.trim() || isCreating}
              className="flex items-center gap-2"
            >
              {isCreating ? 'جاري الإنشاء...' : 'إنشاء البودكاست'}
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePodcastModal;
