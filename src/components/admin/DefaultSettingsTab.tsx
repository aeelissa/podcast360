
import React, { useState } from 'react';
import { Settings, Save, RotateCcw } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useAdminConfig } from '../../contexts/AdminConfigContext';
import { TONE_OPTIONS, STYLE_OPTIONS, BRAND_VOICE_OPTIONS, CONTENT_TYPE_OPTIONS } from '../../types/settings';
import { DEFAULT_ADMIN_CONFIG } from '../../types/admin';

const DefaultSettingsTab = () => {
  const { config, updateDefaults } = useAdminConfig();
  const [editingDefaults, setEditingDefaults] = useState(config.defaultPodcast);

  const handleSave = () => {
    updateDefaults(editingDefaults);
  };

  const resetToDefaults = () => {
    if (confirm('هل تريد إعادة تعيين الإعدادات الافتراضية؟')) {
      setEditingDefaults(DEFAULT_ADMIN_CONFIG.defaultPodcast);
    }
  };

  const updateIdentity = (updates: Partial<typeof editingDefaults.identity>) => {
    setEditingDefaults(prev => ({
      ...prev,
      identity: { ...prev.identity, ...updates }
    }));
  };

  const updateEpisode = (updates: Partial<typeof editingDefaults.episode>) => {
    setEditingDefaults(prev => ({
      ...prev,
      episode: { ...prev.episode, ...updates }
    }));
  };

  const updateAdvanced = (updates: Partial<typeof editingDefaults.advanced>) => {
    setEditingDefaults(prev => ({
      ...prev,
      advanced: { ...prev.advanced, ...updates }
    }));
  };

  const handleStyleChange = (style: string, checked: boolean) => {
    const currentStyles = editingDefaults.identity.style;
    if (checked) {
      updateIdentity({ style: [...currentStyles, style] });
    } else {
      updateIdentity({ style: currentStyles.filter(s => s !== style) });
    }
  };

  const updateArrayField = (
    field: 'goals' | 'successCriteria',
    value: string
  ) => {
    const items = value.split('\n').filter(item => item.trim());
    updateEpisode({ [field]: items });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-podcast-gold" />
          <div>
            <h3 className="text-lg font-semibold text-right">الإعدادات الافتراضية</h3>
            <p className="text-sm text-podcast-gray text-right">
              تحديد الإعدادات الافتراضية للبودكاست والحلقات الجديدة
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefaults}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <RotateCcw className="w-4 h-4 ml-1" />
            إعادة تعيين
          </Button>
          <Button
            onClick={handleSave}
            size="sm"
            className="bg-podcast-gold hover:bg-podcast-gold-dark text-white"
          >
            <Save className="w-4 h-4 ml-1" />
            حفظ التغييرات
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Identity Settings */}
        <div className="p-4 border border-podcast-border rounded-lg">
          <h4 className="font-medium mb-4 text-right">هوية البودكاست الافتراضية</h4>
          <div className="space-y-4">
            <div>
              <Label className="text-right">اسم البودكاست الافتراضي</Label>
              <Input
                value={editingDefaults.identity.showName}
                onChange={(e) => updateIdentity({ showName: e.target.value })}
                className="text-right"
              />
            </div>

            <div>
              <Label className="text-right">النبرة الافتراضية</Label>
              <Select 
                value={editingDefaults.identity.tone} 
                onValueChange={(tone) => updateIdentity({ tone })}
              >
                <SelectTrigger className="text-right">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONE_OPTIONS.map(tone => (
                    <SelectItem key={tone} value={tone} className="text-right">
                      {tone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-right">أسلوب التقديم الافتراضي</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {STYLE_OPTIONS.map(style => (
                  <div key={style} className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      checked={editingDefaults.identity.style.includes(style)}
                      onCheckedChange={(checked) => handleStyleChange(style, !!checked)}
                    />
                    <Label className="text-sm">{style}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-right">الجمهور المستهدف الافتراضي</Label>
              <Textarea
                value={editingDefaults.identity.audience}
                onChange={(e) => updateIdentity({ audience: e.target.value })}
                className="text-right"
              />
            </div>

            <div>
              <Label className="text-right">لغة العلامة التجارية الافتراضية</Label>
              <Select 
                value={editingDefaults.identity.brandVoice} 
                onValueChange={(brandVoice) => updateIdentity({ brandVoice })}
              >
                <SelectTrigger className="text-right">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BRAND_VOICE_OPTIONS.map(voice => (
                    <SelectItem key={voice} value={voice} className="text-right">
                      {voice}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Episode Settings */}
        <div className="p-4 border border-podcast-border rounded-lg">
          <h4 className="font-medium mb-4 text-right">إعدادات الحلقة الافتراضية</h4>
          <div className="space-y-4">
            <div>
              <Label className="text-right">الأهداف الافتراضية (سطر واحد لكل هدف)</Label>
              <Textarea
                value={editingDefaults.episode.goals.join('\n')}
                onChange={(e) => updateArrayField('goals', e.target.value)}
                className="text-right"
                placeholder="هدف واحد في كل سطر"
              />
            </div>

            <div>
              <Label className="text-right">معايير النجاح الافتراضية (سطر واحد لكل معيار)</Label>
              <Textarea
                value={editingDefaults.episode.successCriteria.join('\n')}
                onChange={(e) => updateArrayField('successCriteria', e.target.value)}
                className="text-right"
                placeholder="معيار واحد في كل سطر"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-right">المدة الافتراضية (بالدقائق)</Label>
                <Input
                  type="number"
                  value={editingDefaults.episode.duration}
                  onChange={(e) => updateEpisode({ duration: parseInt(e.target.value) || 30 })}
                  className="text-right"
                />
              </div>

              <div>
                <Label className="text-right">نوع المحتوى الافتراضي</Label>
                <Select 
                  value={editingDefaults.episode.contentType} 
                  onValueChange={(contentType) => updateEpisode({ contentType })}
                >
                  <SelectTrigger className="text-right">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTENT_TYPE_OPTIONS.map(type => (
                      <SelectItem key={type} value={type} className="text-right">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="p-4 border border-podcast-border rounded-lg">
          <h4 className="font-medium mb-4 text-right">الإعدادات المتقدمة الافتراضية</h4>
          <div className="space-y-4">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                checked={editingDefaults.advanced.autoSave}
                onCheckedChange={(checked) => updateAdvanced({ autoSave: !!checked })}
              />
              <Label>تفعيل الحفظ التلقائي افتراضياً</Label>
            </div>

            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                checked={editingDefaults.advanced.aiSuggestions}
                onCheckedChange={(checked) => updateAdvanced({ aiSuggestions: !!checked })}
              />
              <Label>تفعيل اقتراحات الذكاء الاصطناعي افتراضياً</Label>
            </div>

            <div>
              <Label className="text-right">تنسيق التصدير الافتراضي</Label>
              <Select 
                value={editingDefaults.advanced.exportFormat} 
                onValueChange={(exportFormat) => updateAdvanced({ exportFormat })}
              >
                <SelectTrigger className="text-right">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="docx" className="text-right">Word Document (.docx)</SelectItem>
                  <SelectItem value="pdf" className="text-right">PDF (.pdf)</SelectItem>
                  <SelectItem value="txt" className="text-right">نص عادي (.txt)</SelectItem>
                  <SelectItem value="md" className="text-right">Markdown (.md)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultSettingsTab;
