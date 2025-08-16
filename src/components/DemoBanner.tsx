
import React, { useState } from 'react';
import { X, Info } from 'lucide-react';

const DemoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-podcast-blue/5 border-b border-podcast-blue/20 px-4 py-3" dir="rtl">
      <div className="flex items-start gap-3">
        <button
          onClick={() => setIsVisible(false)}
          className="text-podcast-blue/60 hover:text-podcast-blue transition-colors p-1 flex-shrink-0"
          title="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-podcast-blue flex-shrink-0" />
            <h3 className="font-bold text-podcast-blue text-sm">مرحبًا بك في واجهة MVP التجريبية لـ Podcast360</h3>
          </div>
          
          <div className="text-sm text-podcast-gray leading-relaxed space-y-1">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-podcast-blue rounded-full mt-2 flex-shrink-0"></span>
              <span>استخدم زر (≡) لفتح/إغلاق لوحة الإعدادات.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-podcast-blue rounded-full mt-2 flex-shrink-0"></span>
              <span>بدّل بين 'معاينة' و'مصدر' لعرض المحتوى أو هيكله.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-podcast-blue rounded-full mt-2 flex-shrink-0"></span>
              <span>اطلع على محادثة AI التجريبية في اليسار.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-podcast-blue rounded-full mt-2 flex-shrink-0"></span>
              <span>كل شيء هنا تجريبي دون حفظ أو اتصال بقاعدة بيانات.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoBanner;
