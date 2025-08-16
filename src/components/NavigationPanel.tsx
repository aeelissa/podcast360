
import React from 'react';
import { Settings, FileText, Users, Mic, Headphones, Globe } from 'lucide-react';

interface NavigationPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

const NavigationPanel: React.FC<NavigationPanelProps> = ({ isVisible, onClose }) => {
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

  if (!isVisible) return null;

  return (
    <div className="podcast-panel h-full flex flex-col animate-slide-in-left">
      {/* Header */}
      <div className="podcast-header px-4 py-3 rounded-t-xl flex justify-between items-center">
        <h2 className="font-semibold">التنقل والإعدادات</h2>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Navigation Section */}
      <div className="p-4 border-b border-podcast-border">
        <h3 className="font-medium text-podcast-gray mb-3 text-sm">التنقل</h3>
        <div className="space-y-1">
          {navigationItems.map((item, index) => (
            <button
              key={index}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                item.active
                  ? 'bg-podcast-blue text-white'
                  : 'text-podcast-gray hover:bg-podcast-blue/10 hover:text-podcast-blue'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Settings Section */}
      <div className="p-4">
        <h3 className="font-medium text-podcast-gray mb-3 text-sm">الإعدادات</h3>
        <div className="space-y-1">
          {settingsItems.map((item, index) => (
            <button
              key={index}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-podcast-gray hover:bg-podcast-blue/10 hover:text-podcast-blue transition-all"
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Project Info Section */}
      <div className="mt-auto p-4 border-t border-podcast-border">
        <div className="bg-podcast-blue/5 rounded-lg p-3">
          <h4 className="font-medium text-podcast-blue mb-1 text-sm">Podcast360 - MVP</h4>
          <p className="text-xs text-podcast-gray">مشروع تجريبي لمنصة البودكاست</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-podcast-gray">متصل</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationPanel;
