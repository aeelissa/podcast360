
import React, { useState } from 'react';
import { FileText, Settings, Eye, Code } from 'lucide-react';

interface TabData {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: any;
}

const WorkArea = () => {
  const [activeTab, setActiveTab] = useState('concept');
  const [viewMode, setViewMode] = useState<'preview' | 'source'>('preview');

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

  const renderPreview = (content: any) => {
    if (activeTab === 'concept') {
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-podcast-blue mb-2">{content.title}</h3>
            <p className="text-podcast-gray leading-relaxed">{content.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="podcast-panel p-4">
              <h4 className="font-semibold mb-2">الجمهور المستهدف</h4>
              <p className="text-sm text-podcast-gray">{content.targetAudience}</p>
            </div>
            
            <div className="podcast-panel p-4">
              <h4 className="font-semibold mb-2">المدة المتوقعة</h4>
              <p className="text-sm text-podcast-gray">{content.duration}</p>
            </div>
          </div>
          
          <div className="podcast-panel p-4">
            <h4 className="font-semibold mb-3">الأهداف</h4>
            <ul className="space-y-2">
              {content.objectives.map((objective: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="w-2 h-2 bg-podcast-blue rounded-full mt-2 flex-shrink-0"></span>
                  <span>{objective}</span>
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
          <div className="podcast-panel p-4">
            <h4 className="font-semibold mb-3">نقاط البحث</h4>
            <ul className="space-y-2">
              {content.researchPoints.map((point: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="w-2 h-2 bg-podcast-gold rounded-full mt-2 flex-shrink-0"></span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="podcast-panel p-4">
            <h4 className="font-semibold mb-3">الضيوف</h4>
            {content.guests.map((guest: any, index: number) => (
              <div key={index} className="border-r-4 border-podcast-blue pr-3 mb-3">
                <p className="font-medium">{guest.name}</p>
                <p className="text-sm text-podcast-gray mb-1">{guest.role}</p>
                <div className="flex flex-wrap gap-1">
                  {guest.topics.map((topic: string, topicIndex: number) => (
                    <span
                      key={topicIndex}
                      className="bg-podcast-blue/10 text-podcast-blue px-2 py-1 rounded text-xs"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="podcast-panel p-4">
              <h4 className="font-semibold mb-3">المعدات المطلوبة</h4>
              <ul className="space-y-1 text-sm">
                {content.equipment.map((item: string, index: number) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
            
            <div className="podcast-panel p-4">
              <h4 className="font-semibold mb-2">الجدول الزمني</h4>
              <p className="text-sm text-podcast-gray">{content.timeline}</p>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'script') {
      return (
        <div className="space-y-6">
          <div className="podcast-panel p-4">
            <h4 className="font-semibold mb-3">المقدمة</h4>
            <p className="text-sm leading-relaxed bg-gray-50 p-3 rounded">{content.intro}</p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">أقسام الحلقة</h4>
            {content.sections.map((section: any, index: number) => (
              <div key={index} className="podcast-panel p-4">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-podcast-blue">{section.title}</h5>
                  <span className="text-xs bg-podcast-gold/20 text-podcast-gold-dark px-2 py-1 rounded">
                    {section.duration}
                  </span>
                </div>
                <p className="text-sm text-podcast-gray">{section.content}</p>
              </div>
            ))}
          </div>

          <div className="podcast-panel p-4">
            <h4 className="font-semibold mb-3">الخاتمة</h4>
            <p className="text-sm leading-relaxed bg-gray-50 p-3 rounded">{content.outro}</p>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderSource = (content: any) => {
    return (
      <div className="podcast-source-view">
        <pre>{JSON.stringify(content, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div className="podcast-panel h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="border-b border-podcast-border">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-podcast-blue text-podcast-blue bg-podcast-blue/5'
                  : 'border-transparent text-podcast-gray hover:text-podcast-blue hover:bg-podcast-blue/5'
              }`}
            >
              {tab.icon}
              <span className="font-medium">{tab.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="p-4 border-b border-podcast-border">
        <div className="podcast-toggle w-fit">
          <button
            onClick={() => setViewMode('preview')}
            className={`px-3 py-1 rounded text-sm transition-all flex items-center gap-1 ${
              viewMode === 'preview' 
                ? 'podcast-toggle-active' 
                : 'podcast-toggle-inactive'
            }`}
          >
            <Eye className="w-3 h-3" />
            معاينة
          </button>
          <button
            onClick={() => setViewMode('source')}
            className={`px-3 py-1 rounded text-sm transition-all flex items-center gap-1 ${
              viewMode === 'source' 
                ? 'podcast-toggle-active' 
                : 'podcast-toggle-inactive'
            }`}
          >
            <Code className="w-3 h-3" />
            مصدر
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {currentTab && (
          viewMode === 'preview' 
            ? renderPreview(currentTab.content)
            : renderSource(currentTab.content)
        )}
      </div>
    </div>
  );
};

export default WorkArea;
