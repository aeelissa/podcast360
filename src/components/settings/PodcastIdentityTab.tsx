
import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { usePodcastSettings } from '../../contexts/PodcastSettingsContext';
import { TONE_OPTIONS, STYLE_OPTIONS, BRAND_VOICE_OPTIONS } from '../../types/settings';

const PodcastIdentityTab = () => {
  const { settings, updateIdentity } = usePodcastSettings();

  const handleStyleChange = (style: string, checked: boolean) => {
    const currentStyles = settings.identity.style;
    if (checked) {
      updateIdentity({ style: [...currentStyles, style] });
    } else {
      updateIdentity({ style: currentStyles.filter(s => s !== style) });
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="space-y-2">
        <Label htmlFor="showName" className="text-right">اسم البودكاست</Label>
        <Input
          id="showName"
          value={settings.identity.showName}
          onChange={(e) => updateIdentity({ showName: e.target.value })}
          className="text-right"
          placeholder="أدخل اسم البودكاست"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="hostName" className="text-right">اسم المضيف (اختياري)</Label>
        <Input
          id="hostName"
          value={settings.identity.hostName || ''}
          onChange={(e) => updateIdentity({ hostName: e.target.value })}
          className="text-right"
          placeholder="أدخل اسم المضيف"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-right">نبرة البودكاست</Label>
        <Select value={settings.identity.tone} onValueChange={(tone) => updateIdentity({ tone })}>
          <SelectTrigger className="text-right">
            <SelectValue placeholder="اختر النبرة" />
          </SelectTrigger>
          <SelectContent>
            {TONE_OPTIONS.map((tone) => (
              <SelectItem key={tone} value={tone} className="text-right">
                {tone}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-right">أسلوب التقديم</Label>
        <div className="grid grid-cols-2 gap-3">
          {STYLE_OPTIONS.map((style) => (
            <div key={style} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id={style}
                checked={settings.identity.style.includes(style)}
                onCheckedChange={(checked) => handleStyleChange(style, !!checked)}
              />
              <Label htmlFor={style} className="text-sm font-medium">
                {style}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="audience" className="text-right">الجمهور المستهدف</Label>
        <Textarea
          id="audience"
          value={settings.identity.audience}
          onChange={(e) => updateIdentity({ audience: e.target.value })}
          className="text-right min-h-[80px]"
          placeholder="اوصف الجمهور المستهدف للبودكاست"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-right">لغة العلامة التجارية</Label>
        <Select value={settings.identity.brandVoice} onValueChange={(brandVoice) => updateIdentity({ brandVoice })}>
          <SelectTrigger className="text-right">
            <SelectValue placeholder="اختر لغة العلامة التجارية" />
          </SelectTrigger>
          <SelectContent>
            {BRAND_VOICE_OPTIONS.map((voice) => (
              <SelectItem key={voice} value={voice} className="text-right">
                {voice}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PodcastIdentityTab;
