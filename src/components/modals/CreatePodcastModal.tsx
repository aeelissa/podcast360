
import React, { useState } from 'react';
import { X, Settings, Podcast, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { usePodcast } from '../../contexts/PodcastContext';
import { useAdminConfig } from '../../contexts/AdminConfigContext';
import { TONE_OPTIONS, STYLE_OPTIONS, BRAND_VOICE_OPTIONS } from '../../types/settings';
import { KnowledgeFile } from '../../types/podcast';
import { fileStorage } from '../../utils/fileStorage';
import FileUploadZone from '../knowledge/FileUploadZone';

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
  const [uploadedFiles, setUploadedFiles] = useState<KnowledgeFile[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  
  const { createPodcast } = usePodcast();
  const { config } = useAdminConfig();

  // Initialize with admin default settings
  React.useEffect(() => {
    if (config.defaultPodcast && isOpen) {
      setTone(config.defaultPodcast.identity.tone);
      setStyle(config.defaultPodcast.identity.style);
      setAudience(config.defaultPodcast.identity.audience);
      setBrandVoice(config.defaultPodcast.identity.brandVoice);
      setHostName(config.defaultPodcast.identity.hostName || '');
    }
  }, [config.defaultPodcast, isOpen]);

  const handleStyleToggle = (styleOption: string) => {
    setStyle(prev => 
      prev.includes(styleOption) 
        ? prev.filter(s => s !== styleOption)
        : [...prev, styleOption]
    );
  };

  const handleFileUpload = async (file: File) => {
    try {
      const tempPodcastId = `temp_${Date.now()}`;
      const result = await fileStorage.processFile(file, tempPodcastId);
      
      if (result.success && result.extractedText) {
        const knowledgeFile: KnowledgeFile = {
          id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type: file.type as 'pdf' | 'doc' | 'docx',
          size: file.size,
          content: await fileStorage.fileToBase64(file),
          extractedText: result.extractedText,
          uploadedAt: new Date().toISOString(),
          podcastId: tempPodcastId
        };
        
        setUploadedFiles(prev => [...prev, knowledgeFile]);
      }
    } catch (error) {
      console.error('File upload error:', error);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    
    try {
      setIsCreating(true);
      
      // Create podcast with integrated brain settings
      const podcastSettings = {
        identity: {
          tone: tone || config.defaultPodcast.identity.tone,
          style: style.length > 0 ? style : config.defaultPodcast.identity.style,
          audience: audience || config.defaultPodcast.identity.audience,
          brandVoice: brandVoice || config.defaultPodcast.identity.brandVoice,
          hostName: hostName || config.defaultPodcast.identity.hostName,
          showName: name
        },
        advanced: {
          autoSave: true,
          aiSuggestions: true,
          exportFormat: 'docx'
        }
      };

      const podcast = await createPodcast(name.trim(), description.trim(), podcastSettings);
      
      // Save uploaded files to the created podcast
      for (const file of uploadedFiles) {
        const updatedFile = { ...file, podcastId: podcast.id };
        fileStorage.saveKnowledgeFile(updatedFile);
      }

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
    setUploadedFiles([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden" dir="rtl">
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

          {/* Knowledge Base Documents */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-bold text-podcast-blue text-right flex items-center gap-2">
              <Upload className="w-4 h-4" />
              مستندات قاعدة المعرفة (مستوى البودكاست)
            </h3>
            <p className="text-sm text-podcast-gray text-right">
              ارفع المستندات التي ستكون متاحة لجميع حلقات هذا البودكاست
            </p>
            
            <FileUploadZone
              onFileUploaded={(chatFile) => {
                // Convert ChatUploadedFile to KnowledgeFile
                const knowledgeFile: KnowledgeFile = {
                  id: chatFile.id,
                  name: chatFile.name,
                  type: chatFile.type as 'pdf' | 'doc' | 'docx',
                  size: chatFile.size,
                  content: chatFile.content,
                  extractedText: chatFile.extractedText,
                  uploadedAt: chatFile.uploadedAt,
                  podcastId: 'temp'
                };
                setUploadedFiles(prev => [...prev, knowledgeFile]);
              }}
              sessionId="podcast-creation"
            />
            
            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-right">الملفات المرفوعة:</h4>
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <span className="text-sm">{file.name}</span>
                  </div>
                ))}
              </div>
            )}
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
