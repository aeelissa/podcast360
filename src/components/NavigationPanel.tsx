
import React from 'react';
import { Settings, FileText, Users, Mic, Headphones, Globe, CheckCircle, MessageSquare, Download } from 'lucide-react';

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

  const podcastBrainData = [
    { label: 'نبرة', value: 'ودودة ومهنية' },
    { label: 'أسلوب', value: 'تفاعلي وتعليمي' },
    { label: 'جمهور', value: 'المهتمين بالتكنولوجيا' },
    { label: 'لغة العلامة', value: 'عربية فصحى معاصرة' },
  ];

  const episodeGoals = [
    'تعريف المستمعين بالذكاء الاصطناعي',
    'شرح فوائد التكنولوجيا الحديثة',
    'تقديم نصائح عملية للاستخدام'
  ];

  const successCriteria = [
    'زيادة المشاركة بنسبة 25%',
    'الحصول على تقييم 4.5 نجوم أو أكثر',
    'تحقيق 1000 استماع في الأسبوع الأول'
  ];

  if (!isVisible) return null;

  return (
    <div className="podcast-panel h-full flex flex-col animate-slide-in-left overflow-y-auto">
      {/* Header */}
      <div className="podcast-header px-4 py-3 rounded-t-xl flex justify-between items-center flex-shrink-0">
        <h2 className="font-semibold">التنقل والإعدادات</h2>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
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
        <div className="p-4 border-b border-podcast-border">
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

        {/* Podcast Brain Section */}
        <div className="p-4 border-b border-podcast-border">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-medium text-podcast-gray text-sm">Podcast Brain</h3>
            <span className="text-xs text-podcast-gray/60">(اقرأ فقط)</span>
          </div>
          <div className="space-y-2">
            {podcastBrainData.map((item, index) => (
              <div key={index} className="bg-podcast-blue/5 rounded-lg p-2">
                <div className="text-xs font-medium text-podcast-blue mb-1">{item.label}</div>
                <div className="text-xs text-podcast-gray">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Episode Brain Section */}
        <div className="p-4 border-b border-podcast-border">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-medium text-podcast-gray text-sm">Episode Brain</h3>
            <span className="text-xs text-podcast-gray/60">(اقرأ فقط)</span>
          </div>
          
          {/* Episode Goals */}
          <div className="mb-4">
            <h4 className="text-xs font-medium text-podcast-blue mb-2">أهداف الحلقة</h4>
            <div className="space-y-1">
              {episodeGoals.map((goal, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-podcast-blue rounded-full mt-1.5 flex-shrink-0"></div>
                  <span className="text-xs text-podcast-gray">{goal}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Success Criteria */}
          <div>
            <h4 className="text-xs font-medium text-podcast-blue mb-2">معايير النجاح</h4>
            <div className="space-y-1">
              {successCriteria.map((criteria, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-podcast-gold rounded-full mt-1.5 flex-shrink-0"></div>
                  <span className="text-xs text-podcast-gray">{criteria}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Work Status Section */}
        <div className="p-4 border-b border-podcast-border">
          <h3 className="font-medium text-podcast-gray mb-3 text-sm">حالة العمل</h3>
          <div className="inline-flex items-center gap-2 bg-podcast-gold/20 text-podcast-gold-dark px-3 py-1 rounded-full text-xs font-medium">
            <div className="w-2 h-2 bg-podcast-gold rounded-full"></div>
            مسودة
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="p-4">
          <div className="space-y-2">
            <button
              disabled
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-podcast-gray/50 bg-podcast-gray/10 cursor-not-allowed"
            >
              <CheckCircle className="w-4 h-4" />
              <span>اعتماد المدير</span>
            </button>
            <button
              disabled
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-podcast-gray/50 bg-podcast-gray/10 cursor-not-allowed"
            >
              <MessageSquare className="w-4 h-4" />
              <span>تعليق المدير</span>
            </button>
            <button
              disabled
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-podcast-gray/50 bg-podcast-gray/10 cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span>تصدير</span>
            </button>
          </div>
        </div>
      </div>

      {/* Project Info Section */}
      <div className="mt-auto p-4 border-t border-podcast-border flex-shrink-0">
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
