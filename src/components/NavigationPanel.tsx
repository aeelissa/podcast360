
import React from 'react';
import { Settings, FileText, Users, Mic, Headphones, Globe, CheckCircle, MessageSquare, Download, X, Edit3 } from 'lucide-react';
import { usePodcastSettings } from '../contexts/PodcastSettingsContext';
import PodcastSettingsPanel from './PodcastSettingsPanel';

interface NavigationPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

const NavigationPanel: React.FC<NavigationPanelProps> = ({ isVisible, onClose }) => {
  const { settings } = usePodcastSettings();

  const navigationItems = [
    { icon: <FileText className="w-4 h-4" />, label: 'المشاريع', active: true },
    { icon: <Mic className="w-4 h-4" />, label: 'التسجيلات', active: false },
    { icon: <Users className="w-4 h-4" />, label: 'الفريق', active: false },
    { icon: <Headphones className="w-4 h-4" />, label: 'المكتبة الصوتية', active: false },
  ];

  const settingsItems = [
    { icon: <Settings className="w-4 h-4" />, label: 'الإعدادات العامة' },
    { icon: <Globe className="w-4 h-4" />, label: 'اللغة والمنطقة' },
    { icon: <Mic className="w-4 h-4" />, label: 'إعدادات الصوت' },
  ];

  const podcastBrainData = [
    { label: 'نبرة', value: settings.identity.tone },
    { label: 'أسلوب', value: settings.identity.style.join(' و ') },
    { label: 'جمهور', value: settings.identity.audience },
    { label: 'لغة العلامة', value: settings.identity.brandVoice },
  ];

  if (!isVisible) return null;

  return (
    <div className="podcast-panel h-full flex flex-col animate-slide-in-left">
      {/* Header */}
      <div className="podcast-header px-4 py-3 rounded-t-xl flex justify-between items-center flex-shrink-0">
        <h2 className="font-bold text-right">التنقل والإعدادات</h2>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div className="h-full overflow-y-auto scroll-smooth">
          {/* Navigation Section */}
          <div className="p-4 border-b border-podcast-border">
            <h3 className="font-bold text-podcast-gray mb-3 text-sm text-right">التنقل</h3>
            <div className="space-y-1">
              {navigationItems.map((item, index) => (
                <button
                  key={index}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all text-right font-medium ${
                    item.active
                      ? 'bg-podcast-blue text-white'
                      : 'text-podcast-gray hover:bg-podcast-blue/10 hover:text-podcast-blue'
                  }`}
                >
                  <span className="mr-auto">{item.label}</span>
                  {item.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Settings Section */}
          <div className="p-4 border-b border-podcast-border">
            <h3 className="font-bold text-podcast-gray mb-3 text-sm text-right">الإعدادات</h3>
            <div className="space-y-1">
              {settingsItems.map((item, index) => (
                <button
                  key={index}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-podcast-gray hover:bg-podcast-blue/10 hover:text-podcast-blue transition-all text-right font-medium"
                >
                  <span className="mr-auto">{item.label}</span>
                  {item.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Podcast Brain Section */}
          <div className="p-4 border-b border-podcast-border">
            <div className="flex items-center gap-2 mb-3 justify-end">
              <PodcastSettingsPanel 
                trigger={
                  <button className="text-xs text-podcast-blue hover:text-podcast-blue/80 transition-colors flex items-center gap-1">
                    <Edit3 className="w-3 h-3" />
                    تحرير
                  </button>
                }
              />
              <h3 className="font-bold text-podcast-gray text-sm">Podcast Brain</h3>
            </div>
            <div className="space-y-2">
              {podcastBrainData.map((item, index) => (
                <div key={index} className="bg-podcast-blue/5 border border-podcast-blue/10 rounded-lg p-3">
                  <div className="text-xs font-bold text-podcast-blue mb-1 text-right">{item.label}</div>
                  <div className="text-xs text-podcast-gray text-right leading-relaxed">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Episode Brain Section */}
          <div className="p-4 border-b border-podcast-border">
            <div className="flex items-center gap-2 mb-3 justify-end">
              <PodcastSettingsPanel 
                trigger={
                  <button className="text-xs text-podcast-blue hover:text-podcast-blue/80 transition-colors flex items-center gap-1">
                    <Edit3 className="w-3 h-3" />
                    تحرير
                  </button>
                }
              />
              <h3 className="font-bold text-podcast-gray text-sm">Episode Brain</h3>
            </div>
            
            {/* Episode Goals */}
            <div className="mb-4">
              <h4 className="text-xs font-bold text-podcast-blue mb-2 text-right">أهداف الحلقة</h4>
              <div className="space-y-2">
                {settings.episode.goals.map((goal, index) => (
                  <div key={index} className="flex items-start gap-2 text-right">
                    <span className="text-xs text-podcast-gray leading-relaxed">{goal}</span>
                    <div className="w-1.5 h-1.5 bg-podcast-blue rounded-full mt-1.5 flex-shrink-0"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Success Criteria */}
            <div>
              <h4 className="text-xs font-bold text-podcast-blue mb-2 text-right">معايير النجاح</h4>
              <div className="space-y-2">
                {settings.episode.successCriteria.map((criteria, index) => (
                  <div key={index} className="flex items-start gap-2 text-right">
                    <span className="text-xs text-podcast-gray leading-relaxed">{criteria}</span>
                    <div className="w-1.5 h-1.5 bg-podcast-gold rounded-full mt-1.5 flex-shrink-0"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Work Status Section */}
          <div className="p-4 border-b border-podcast-border">
            <h3 className="font-bold text-podcast-gray mb-3 text-sm text-right">حالة العمل</h3>
            <div className="flex justify-end">
              <div className="inline-flex items-center gap-2 bg-podcast-gold/20 text-podcast-gold-dark px-3 py-1 rounded-full text-xs font-bold">
                مسودة
                <div className="w-2 h-2 bg-podcast-gold rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="p-4 border-b border-podcast-border">
            <div className="space-y-2">
              <button
                disabled
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-podcast-gray/50 bg-podcast-gray/10 cursor-not-allowed text-right font-medium"
              >
                <span className="mr-auto">اعتماد المدير</span>
                <CheckCircle className="w-4 h-4" />
              </button>
              <button
                disabled
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-podcast-gray/50 bg-podcast-gray/10 cursor-not-allowed text-right font-medium"
              >
                <span className="mr-auto">تعليق المدير</span>
                <MessageSquare className="w-4 h-4" />
              </button>
              <button
                disabled
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-podcast-gray/50 bg-podcast-gray/10 cursor-not-allowed text-right font-medium"
              >
                <span className="mr-auto">تصدير</span>
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4">
            <div className="bg-podcast-blue/5 border border-podcast-blue/10 rounded-lg p-4">
              <h4 className="font-bold text-podcast-blue mb-1 text-sm text-right">{settings.identity.showName} - MVP</h4>
              <p className="text-xs text-podcast-gray text-right leading-relaxed">مشروع تجريبي لمنصة البودكاست</p>
              <div className="mt-3 flex items-center gap-2 justify-end">
                <span className="text-xs text-podcast-gray">متصل</span>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll shadows */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

export default NavigationPanel;
