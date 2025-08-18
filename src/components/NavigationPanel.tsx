
import React, { useState } from 'react';
import { Settings, FileText, Users, Mic, Headphones, Globe, CheckCircle, MessageSquare, Download, X, Plus, Upload, File, Edit, Radio, Podcast } from 'lucide-react';
import { usePodcast } from '../contexts/PodcastContext';
import HierarchyBreadcrumb from './hierarchy/HierarchyBreadcrumb';
import CreatePodcastModal from './modals/CreatePodcastModal';
import CreateEpisodeModal from './modals/CreateEpisodeModal';
import EditPodcastModal from './modals/EditPodcastModal';
import EditEpisodeModal from './modals/EditEpisodeModal';

interface NavigationPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

const NavigationPanel: React.FC<NavigationPanelProps> = ({ isVisible, onClose }) => {
  const { currentPodcast, currentEpisode, needsOnboarding } = usePodcast();
  const [showCreatePodcast, setShowCreatePodcast] = useState(false);
  const [showCreateEpisode, setShowCreateEpisode] = useState(false);
  const [showEditPodcast, setShowEditPodcast] = useState(false);
  const [showEditEpisode, setShowEditEpisode] = useState(false);

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
    <>
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
            {/* Enhanced Management Section */}
            <div className="p-4 border-b border-podcast-border">
              <h3 className="font-bold text-podcast-gray mb-3 text-sm text-right">إدارة البودكاست</h3>
              
              {needsOnboarding ? (
                <div className="bg-podcast-blue/5 border border-podcast-blue/10 rounded-lg p-3 mb-3">
                  <p className="text-xs text-podcast-gray text-right leading-relaxed mb-2">
                    ابدأ بإنشاء بودكاست جديد مع إعداداته
                  </p>
                  <button
                    onClick={() => setShowCreatePodcast(true)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-podcast-blue text-white hover:bg-podcast-blue/90 transition-colors text-right font-medium justify-center"
                  >
                    <Plus className="w-3 h-3" />
                    إنشاء بودكاست جديد
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <HierarchyBreadcrumb />
                  
                  {/* Current Podcast Management */}
                  {currentPodcast ? (
                    <div className="bg-podcast-blue/5 border border-podcast-blue/10 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setShowEditPodcast(true)}
                            className="text-xs text-podcast-blue hover:text-podcast-blue/80 transition-colors p-1"
                            title="تحرير إعدادات البودكاست"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setShowCreatePodcast(true)}
                            className="text-xs text-podcast-blue hover:text-podcast-blue/80 transition-colors p-1"
                            title="إنشاء بودكاست جديد"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-podcast-blue">{currentPodcast.name}</span>
                          <Podcast className="w-3 h-3 text-podcast-blue" />
                        </div>
                      </div>
                      <p className="text-xs text-podcast-gray text-right">
                        {currentPodcast.description || 'لا يوجد وصف'}
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowCreatePodcast(true)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-podcast-blue text-white hover:bg-podcast-blue/90 transition-colors text-right font-medium justify-center"
                    >
                      <Plus className="w-3 h-3" />
                      إنشاء بودكاست جديد
                    </button>
                  )}

                  {/* Current Episode Management */}
                  {currentPodcast && (
                    currentEpisode ? (
                      <div className="bg-podcast-gold/10 border border-podcast-gold/20 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setShowEditEpisode(true)}
                              className="text-xs text-podcast-gold-dark hover:text-podcast-gold-dark/80 transition-colors p-1"
                              title="تحرير إعدادات الحلقة"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => setShowCreateEpisode(true)}
                              className="text-xs text-podcast-gold-dark hover:text-podcast-gold-dark/80 transition-colors p-1"
                              title="إنشاء حلقة جديدة"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-podcast-gold-dark">{currentEpisode.title}</span>
                            <Radio className="w-3 h-3 text-podcast-gold-dark" />
                          </div>
                        </div>
                        <p className="text-xs text-podcast-gray text-right">
                          {currentEpisode.description || 'لا يوجد وصف'}
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowCreateEpisode(true)}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-podcast-gold text-white hover:bg-podcast-gold/90 transition-colors text-right font-medium justify-center"
                      >
                        <Plus className="w-3 h-3" />
                        إنشاء حلقة جديدة
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Knowledge Base Section */}
            {currentPodcast && (
              <div className="p-4 border-b border-podcast-border">
                <div className="flex items-center gap-2 mb-3 justify-end">
                  <button className="text-xs text-podcast-blue hover:text-podcast-blue/80 transition-colors flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    رفع ملف
                  </button>
                  <h3 className="font-bold text-podcast-gray text-sm">قاعدة المعرفة</h3>
                </div>
                
                {currentPodcast.knowledgeBase.length > 0 ? (
                  <div className="space-y-2">
                    {currentPodcast.knowledgeBase.slice(0, 3).map((file) => (
                      <div key={file.id} className="flex items-center gap-2 bg-podcast-blue/5 border border-podcast-blue/10 rounded-lg p-2">
                        <File className="w-3 h-3 text-podcast-blue flex-shrink-0" />
                        <span className="text-xs text-podcast-gray truncate flex-1">{file.name}</span>
                      </div>
                    ))}
                    <div className="text-xs text-podcast-gray text-right">
                      {currentPodcast.knowledgeBase.length}/5 ملفات مرفوعة
                    </div>
                  </div>
                ) : (
                  <div className="bg-podcast-blue/5 border border-podcast-blue/10 rounded-lg p-3">
                    <p className="text-xs text-podcast-gray text-right leading-relaxed">
                      لم يتم رفع أي ملفات بعد
                    </p>
                  </div>
                )}
              </div>
            )}

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
                <h4 className="font-bold text-podcast-blue mb-1 text-sm text-right">
                  {currentPodcast?.name || 'Podcast360'} - MVP
                </h4>
                <p className="text-xs text-podcast-gray text-right leading-relaxed">
                  {currentEpisode ? `الحلقة: ${currentEpisode.title}` : 'مشروع تجريبي لمنصة البودكاست'}
                </p>
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

      {/* Modals */}
      <CreatePodcastModal 
        isOpen={showCreatePodcast} 
        onClose={() => setShowCreatePodcast(false)} 
      />
      <CreateEpisodeModal 
        isOpen={showCreateEpisode} 
        onClose={() => setShowCreateEpisode(false)} 
      />
      <EditPodcastModal 
        isOpen={showEditPodcast} 
        onClose={() => setShowEditPodcast(false)} 
      />
      <EditEpisodeModal 
        isOpen={showEditEpisode} 
        onClose={() => setShowEditEpisode(false)} 
      />
    </>
  );
};

export default NavigationPanel;
