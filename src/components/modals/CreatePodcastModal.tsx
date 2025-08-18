
import React, { useState } from 'react';
import { X, Settings, Podcast } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { usePodcast } from '../../contexts/PodcastContext';
import { TONE_OPTIONS, STYLE_OPTIONS, BRAND_VOICE_OPTIONS } from '../../types/settings';

interface CreatePodcastModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePodcastModal: React.FC<CreatePodcastModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tone, setTone] = useState('');
  const [style, setStyle] = useState<string[]>([]);
  const [audience, setAudience] = useState('');
  const [brandVoice, setBrandVoice] = useState('');
  const [hostName, setHostName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { createPodcast } = usePodcast();

  const handleStyleToggle = (styleOption: string) => {
    setStyle(prev => 
      prev.includes(styleOption) 
        ? prev.filter(s => s !== styleOption)
        : [...prev, styleOption]
    );
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    
    try {
      setIsCreating(true);
      
      // Create podcast with integrated brain settings
      const podcastSettings = {
        identity: {
          tone: tone || 'ودودة ومهنية',
          style: style.length > 0 ? style : ['تفاعلي'],
          audience: audience || 'الجمهور العام',
          brandVoice: brandVoice || 'عربية فصحى معاصرة',
          hostName: hostName || '',
          showName: name // Add showName to settings
        },
        advanced: {
          autoSave: true,
          aiSuggestions: true,
          exportFormat: 'docx'
        }
      };

      await createPodcast(name.trim(), description.trim(), podcastSettings);
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
    setTone('');
    setStyle([]);
    setAudience('');
    setBrandVoice('');
    setHostName('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle className="text-xl font-bold text-podcast-blue flex items-center gap-2">
            <Podcast className="w-5 h-5" />
            إنشاء بودكاست جديد
          </DialogTitle>
          <p className="text-sm text-podcast-gray mt-1">
            املأ المعلومات الأساسية وإعدادات البودكاست
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
            onClick={handleCreate} 
            disabled={!name.trim() || isCreating}
            className="flex items-center gap-2"
          >
            {isCreating ? 'جاري الإنشاء...' : 'إنشاء البودكاست'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePodcastModal;
