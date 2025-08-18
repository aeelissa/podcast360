
import React, { useState, useEffect } from 'react';
import { X, Settings, Podcast } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { usePodcast } from '../../contexts/PodcastContext';
import { TONE_OPTIONS, STYLE_OPTIONS, BRAND_VOICE_OPTIONS } from '../../types/settings';

interface EditPodcastModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditPodcastModal: React.FC<EditPodcastModalProps> = ({ isOpen, onClose }) => {
  const { currentPodcast, updatePodcast } = usePodcast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tone, setTone] = useState('');
  const [style, setStyle] = useState<string[]>([]);
  const [audience, setAudience] = useState('');
  const [brandVoice, setBrandVoice] = useState('');
  const [hostName, setHostName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Load current podcast data when modal opens
  useEffect(() => {
    if (isOpen && currentPodcast) {
      setName(currentPodcast.name);
      setDescription(currentPodcast.description || '');
      setTone(currentPodcast.settings.identity.tone || '');
      setStyle(currentPodcast.settings.identity.style || []);
      setAudience(currentPodcast.settings.identity.audience || '');
      setBrandVoice(currentPodcast.settings.identity.brandVoice || '');
      setHostName(currentPodcast.settings.identity.hostName || '');
    }
  }, [isOpen, currentPodcast]);

  const handleStyleToggle = (styleOption: string) => {
    setStyle(prev => 
      prev.includes(styleOption) 
        ? prev.filter(s => s !== styleOption)
        : [...prev, styleOption]
    );
  };

  const handleUpdate = async () => {
    if (!name.trim() || !currentPodcast) return;
    
    try {
      setIsUpdating(true);
      
      const updatedPodcast = {
        ...currentPodcast,
        name: name.trim(),
        description: description.trim(),
        settings: {
          ...currentPodcast.settings,
          identity: {
            ...currentPodcast.settings.identity,
            tone: tone || 'ودودة ومهنية',
            style: style.length > 0 ? style : ['تفاعلي'],
            audience: audience || 'الجمهور العام',
            brandVoice: brandVoice || 'عربية فصحى معاصرة',
            hostName: hostName || '',
            showName: name.trim()
          }
        },
        modifiedAt: new Date().toISOString()
      };

      updatePodcast(updatedPodcast);
      handleClose();
    } catch (error) {
      console.error('Error updating podcast:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!currentPodcast) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle className="text-xl font-bold text-podcast-blue flex items-center gap-2">
            <Podcast className="w-5 h-5" />
            تحرير إعدادات البودكاست
          </DialogTitle>
          <p className="text-sm text-podcast-gray mt-1">
            تعديل معلومات وإعدادات البودكاست
          </p>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto space-y-6 pr-2">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-bold text-podcast-blue text-right flex items-center gap-2">
              المعلومات الأساسية
            </h3>
            
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
                className="text-right min-h-[80px]"
                placeholder="وصف مختصر عن البودكاست وأهدافه"
              />
            </div>
          </div>

          {/* Podcast Brain Settings */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-podcast-blue text-right flex items-center gap-2">
              <Settings className="w-4 h-4" />
              إعدادات البودكاست (Podcast Brain)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-right">نبرة البودكاست</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="اختر النبرة" />
                  </SelectTrigger>
                  <SelectContent>
                    {TONE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option} className="text-right">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-right">لغة العلامة التجارية</Label>
                <Select value={brandVoice} onValueChange={setBrandVoice}>
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="اختر لغة العلامة" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRAND_VOICE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option} className="text-right">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-right">الجمهور المستهدف</Label>
                <Input
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="text-right"
                  placeholder="مثال: المهتمين بالتكنولوجيا"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-right">اسم المضيف (اختياري)</Label>
                <Input
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                  className="text-right"
                  placeholder="اسم مقدم البودكاست"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-right">أسلوب التقديم</Label>
              <div className="flex flex-wrap gap-2 justify-end">
                {STYLE_OPTIONS.map((styleOption) => (
                  <button
                    key={styleOption}
                    type="button"
                    onClick={() => handleStyleToggle(styleOption)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      style.includes(styleOption)
                        ? 'bg-podcast-blue text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {styleOption}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-6">
          <Button variant="outline" onClick={handleClose}>
            إلغاء
          </Button>
          <Button 
            onClick={handleUpdate} 
            disabled={!name.trim() || isUpdating}
            className="flex items-center gap-2"
          >
            {isUpdating ? 'جاري التحديث...' : 'حفظ التغييرات'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPodcastModal;
