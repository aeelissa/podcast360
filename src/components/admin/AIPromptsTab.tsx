
import React, { useState } from 'react';
import { MessageSquare, RotateCcw, Save } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { useAdminConfig } from '../../contexts/AdminConfigContext';
import { DEFAULT_ADMIN_CONFIG } from '../../types/admin';

const AIPromptsTab = () => {
  const { config, updatePrompts } = useAdminConfig();
  const [editingPrompts, setEditingPrompts] = useState(config.aiPrompts);

  const handleSave = () => {
    updatePrompts(editingPrompts);
  };

  const resetPrompt = (promptType: keyof typeof config.aiPrompts) => {
    const defaultValue = DEFAULT_ADMIN_CONFIG.aiPrompts[promptType];
    setEditingPrompts(prev => ({ ...prev, [promptType]: defaultValue }));
  };

  const resetAllPrompts = () => {
    if (confirm('هل تريد إعادة تعيين جميع القوالب إلى القيم الافتراضية؟')) {
      setEditingPrompts(DEFAULT_ADMIN_CONFIG.aiPrompts);
    }
  };

  const promptConfigs = [
    {
      key: 'baseSystemPrompt' as const,
      title: 'التوجيه الأساسي للنظام',
      description: 'التوجيه الأساسي الذي يحدد شخصية وسلوك الذكاء الاصطناعي',
      placeholder: 'أدخل التوجيه الأساسي للنظام...'
    },
    {
      key: 'conceptPrompt' as const,
      title: 'قالب تطوير المفهوم',
      description: 'القالب المستخدم لمساعدة المستخدم في تطوير مفهوم الحلقة',
      placeholder: 'أدخل قالب تطوير المفهوم...'
    },
    {
      key: 'preparationPrompt' as const,
      title: 'قالب التحضير',
      description: 'القالب المستخدم لمساعدة المستخدم في تحضير مواد الحلقة',
      placeholder: 'أدخل قالب التحضير...'
    },
    {
      key: 'scriptPrompt' as const,
      title: 'قالب كتابة السكربت',
      description: 'القالب المستخدم لمساعدة المستخدم في كتابة سكربت الحلقة',
      placeholder: 'أدخل قالب كتابة السكربت...'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-podcast-gold" />
          <div>
            <h3 className="text-lg font-semibold text-right">قوالب الذكاء الاصطناعي</h3>
            <p className="text-sm text-podcast-gray text-right">
              تخصيص القوالب والتوجيهات المستخدمة في الذكاء الاصطناعي
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetAllPrompts}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <RotateCcw className="w-4 h-4 ml-1" />
            إعادة تعيين الكل
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

      <div className="space-y-6">
        {promptConfigs.map(({ key, title, description, placeholder }) => (
          <div key={key} className="p-4 border border-podcast-border rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <Label className="text-right font-medium">{title}</Label>
                <p className="text-sm text-podcast-gray text-right mt-1">{description}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => resetPrompt(key)}
                className="text-podcast-gray hover:text-podcast-gold"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
            
            <Textarea
              value={editingPrompts[key]}
              onChange={(e) => setEditingPrompts(prev => ({ ...prev, [key]: e.target.value }))}
              placeholder={placeholder}
              className="min-h-[120px] text-right"
              dir="rtl"
            />
            
            <div className="mt-2 text-xs text-podcast-gray text-right">
              عدد الأحرف: {editingPrompts[key].length}
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="text-sm text-green-700">
          <p className="font-medium mb-2">نصائح لكتابة القوالب الفعالة:</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>استخدم لغة واضحة ومحددة في التوجيهات</li>
            <li>اذكر السياق والهدف من كل مهمة</li>
            <li>حدد نوع الإخراج المطلوب والتنسيق المفضل</li>
            <li>اشمل أمثلة عملية عندما يكون ذلك مفيداً</li>
            <li>تأكد من توافق التوجيهات مع الثقافة العربية</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AIPromptsTab;
