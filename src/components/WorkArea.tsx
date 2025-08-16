import React, { useState } from 'react';
import { FileText, Settings, Eye, Code, Copy, Languages, Clock } from 'lucide-react';

interface TabData {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: any;
}

const WorkArea = () => {
  const [activeTab, setActiveTab] = useState('concept');
  const [viewMode, setViewMode] = useState<'preview' | 'source'>('preview');
  const [isEasternNumerals, setIsEasternNumerals] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const tabs: TabData[] = [
    {
      id: 'concept',
      title: 'ورقة التصور',
      icon: <FileText className="w-4 h-4" />,
      content: {
        title: 'الذكاء الاصطناعي في حياتنا اليومية',
        description: 'استكشاف التطبيقات العملية للذكاء الاصطناعي وتأثيرها على المجتمع',
        targetAudience: 'المهتمون بالتكنولوجيا والمطورون',
        duration: '45 دقيقة',
        objectives: [
          'فهم أساسيات الذكاء الاصطناعي',
          'استعراض التطبيقات العملية',
          'مناقشة التحديات والفرص'
        ]
      }
    },
    {
      id: 'preparation',
      title: 'ورقة الإعداد',
      icon: <Settings className="w-4 h-4" />,
      content: {
        researchPoints: [
          'إحصائيات حديثة عن استخدام الذكاء الاصطناعي',
          'قصص نجاح من الشركات المحلية',
          'تحديات الخصوصية والأمان'
        ],
        guests: [
          {
            name: 'د. أحمد محمد',
            role: 'خبير الذكاء الاصطناعي',
            topics: ['التعلم الآلي', 'معالجة اللغات الطبيعية']
          }
        ],
        equipment: ['ميكروفون عالي الجودة', 'برنامج تسجيل', 'سماعات مراقبة'],
        timeline: '2 ساعة إعداد + 1 ساعة تسجيل + 1 ساعة مونتاج'
      }
    },
    {
      id: 'script',
      title: 'ورقة السكربت',
      icon: <Code className="w-4 h-4" />,
      content: {
        intro: 'مرحباً بكم في بودكاست التكنولوجيا، أنا مضيفكم...',
        sections: [
          {
            title: 'المقدمة',
            duration: '5 دقائق',
            content: 'ترحيب بالمستمعين وتقديم موضوع الحلقة'
          },
          {
            title: 'الجزء الأول: ما هو الذكاء الاصطناعي؟',
            duration: '15 دقيقة',
            content: 'شرح المفاهيم الأساسية بطريقة مبسطة'
          },
          {
            title: 'الجزء الثاني: التطبيقات العملية',
            duration: '20 دقيقة',
            content: 'أمثلة من الواقع وقصص نجاح'
          }
        ],
        outro: 'شكراً لكم للاستماع، لا تنسوا الاشتراك...'
      }
    }
  ];

  const currentTab = tabs.find(tab => tab.id === activeTab);

  // Function to convert Western numerals to Eastern Arabic numerals
  const convertToEasternNumerals = (text: string) => {
    if (!isEasternNumerals) return text;
    
    const westernToEastern = {
      '0': '٠',
      '1': '١',
      '2': '٢',
      '3': '٣',
      '4': '٤',
      '5': '٥',
      '6': '٦',
      '7': '٧',
      '8': '٨',
      '9': '٩'
    };
    
    return text.replace(/[0-9]/g, (digit) => westernToEastern[digit as keyof typeof westernToEastern] || digit);
  };

  // Function to copy JSON to clipboard
  const copyToClipboard = async () => {
    if (currentTab) {
      try {
        await navigator.clipboard.writeText(JSON.stringify(currentTab.content, null, 2));
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
  };

  const renderPreview = (content: any) => {
    if (activeTab === 'concept') {
      return (
        <div className="space-y-6">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-podcast-blue mb-3 leading-tight text-right">
              {convertToEasternNumerals(content.title)}
            </h3>
            <p className="text-podcast-gray leading-relaxed text-right text-lg">
              {convertToEasternNumerals(content.description)}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h4 className="font-bold mb-2 text-podcast-blue text-right">الجمهور المستهدف</h4>
              <p className="text-sm text-podcast-gray text-right leading-relaxed">
                {convertToEasternNumerals(content.targetAudience)}
              </p>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h4 className="font-bold mb-2 text-podcast-blue text-right">المدة المتوقعة</h4>
              <p className="text-sm text-podcast-gray text-right leading-relaxed">
                {convertToEasternNumerals(content.duration)}
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold mb-4 text-podcast-blue text-right">الأهداف</h4>
            <ul className="space-y-3">
              {content.objectives.map((objective: string, index: number) => (
                <li key={index} className="flex items-start gap-3 text-sm text-right">
                  <span className="w-2 h-2 bg-podcast-blue rounded-full mt-2 flex-shrink-0"></span>
                  <span className="leading-relaxed">{convertToEasternNumerals(objective)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    if (activeTab === 'preparation') {
      return (
        <div className="space-y-6">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold mb-4 text-podcast-blue text-right">نقاط البحث</h4>
            <ul className="space-y-3">
              {content.researchPoints.map((point: string, index: number) => (
                <li key={index} className="flex items-start gap-3 text-sm text-right">
                  <span className="w-2 h-2 bg-podcast-gold rounded-full mt-2 flex-shrink-0"></span>
                  <span className="leading-relaxed">{convertToEasternNumerals(point)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold mb-4 text-podcast-blue text-right">الضيوف</h4>
            {content.guests.map((guest: any, index: number) => (
              <div key={index} className="border-r-4 border-podcast-blue pr-4 mb-4">
                <p className="font-bold text-right">{convertToEasternNumerals(guest.name)}</p>
                <p className="text-sm text-podcast-gray mb-2 text-right leading-relaxed">
                  {convertToEasternNumerals(guest.role)}
                </p>
                <div className="flex flex-wrap gap-2 justify-end">
                  {guest.topics.map((topic: string, topicIndex: number) => (
                    <span
                      key={topicIndex}
                      className="bg-podcast-blue/10 text-podcast-blue px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {convertToEasternNumerals(topic)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h4 className="font-bold mb-3 text-podcast-blue text-right">المعدات المطلوبة</h4>
              <ul className="space-y-2 text-sm text-right">
                {content.equipment.map((item: string, index: number) => (
                  <li key={index} className="leading-relaxed">• {convertToEasternNumerals(item)}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h4 className="font-bold mb-2 text-podcast-blue text-right">الجدول الزمني</h4>
              <p className="text-sm text-podcast-gray text-right leading-relaxed">
                {convertToEasternNumerals(content.timeline)}
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'script') {
      return (
        <div className="space-y-6">
          {/* Episode Duration Estimate Chip */}
          <div className="flex justify-center mb-4">
            <div className="bg-podcast-gold/10 border border-podcast-gold/30 text-podcast-gold-dark px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{convertToEasternNumerals('تقدير مدة الحلقة: ≈ 30 دقيقة')}</span>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold mb-4 text-podcast-blue text-right">المقدمة</h4>
            <p className="text-sm leading-relaxed bg-white p-4 rounded-lg border text-right">
              {convertToEasternNumerals(content.intro)}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-podcast-blue text-right">أقسام الحلقة</h4>
            {content.sections.map((section: any, index: number) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <div className="flex justify-between items-start mb-3 flex-row-reverse">
                  <h5 className="font-bold text-podcast-blue text-right">
                    {convertToEasternNumerals(section.title)}
                  </h5>
                  <span className="text-xs bg-podcast-gold/20 text-podcast-gold-dark px-3 py-1 rounded-full font-medium">
                    {convertToEasternNumerals(section.duration)}
                  </span>
                </div>
                <p className="text-sm text-podcast-gray text-right leading-relaxed">
                  {convertToEasternNumerals(section.content)}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h4 className="font-bold mb-4 text-podcast-blue text-right">الخاتمة</h4>
            <p className="text-sm leading-relaxed bg-white p-4 rounded-lg border text-right">
              {convertToEasternNumerals(content.outro)}
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderSource = (content: any) => {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 font-mono text-sm overflow-auto">
        <pre className="text-right">{convertToEasternNumerals(JSON.stringify(content, null, 2))}</pre>
      </div>
    );
  };

  return (
    <div className="podcast-panel h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="border-b border-podcast-border">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap font-medium ${
                activeTab === tab.id
                  ? 'border-podcast-blue text-podcast-blue bg-podcast-blue/5 font-bold'
                  : 'border-transparent text-podcast-gray hover:text-podcast-blue hover:bg-podcast-blue/5'
              }`}
            >
              {tab.icon}
              <span>{convertToEasternNumerals(tab.title)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* View Mode Toggle and Controls */}
      <div className="p-4 border-b border-podcast-border">
        <div className="flex justify-between items-center">
          {/* Language Toggle */}
          <button
            onClick={() => setIsEasternNumerals(!isEasternNumerals)}
            className="bg-gray-100 hover:bg-gray-200 border border-gray-200 px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 font-medium text-podcast-gray hover:text-podcast-blue"
          >
            <Languages className="w-3 h-3" />
            <span>تبديل اللغة</span>
          </button>

          <div className="flex items-center gap-4">
            {/* Copy JSON Button (only in source mode) */}
            {viewMode === 'source' && (
              <button
                onClick={copyToClipboard}
                className={`px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 font-medium ${
                  copySuccess 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-gray-100 hover:bg-gray-200 border border-gray-200 text-podcast-gray hover:text-podcast-blue'
                }`}
              >
                <Copy className="w-3 h-3" />
                <span>{copySuccess ? 'تم النسخ!' : 'نسخ JSON'}</span>
              </button>
            )}

            {/* View Mode Toggle */}
            <div className="bg-gray-100 border border-gray-200 rounded-lg p-1 flex gap-1">
              <button
                onClick={() => setViewMode('preview')}
                className={`px-4 py-2 rounded text-sm transition-all flex items-center gap-2 font-medium ${
                  viewMode === 'preview' 
                    ? 'bg-podcast-blue text-white shadow-sm font-bold' 
                    : 'text-podcast-gray hover:bg-white cursor-pointer'
                }`}
              >
                <Eye className="w-3 h-3" />
                معاينة
              </button>
              <button
                onClick={() => setViewMode('source')}
                className={`px-4 py-2 rounded text-sm transition-all flex items-center gap-2 font-medium ${
                  viewMode === 'source' 
                    ? 'bg-podcast-blue text-white shadow-sm font-bold' 
                    : 'text-podcast-gray hover:bg-white cursor-pointer'
                }`}
              >
                <Code className="w-3 h-3" />
                مصدر
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area with scroll shadows */}
      <div className="flex-1 overflow-hidden relative">
        <div className="h-full overflow-y-auto p-6 scroll-smooth">
          {currentTab && (
            viewMode === 'preview' 
              ? renderPreview(currentTab.content)
              : renderSource(currentTab.content)
          )}
        </div>
        {/* Scroll shadows */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

export default WorkArea;
