
import React, { useState } from 'react';
import { ArrowLeft, Save, Download, Upload, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAdminConfig } from '../contexts/AdminConfigContext';
import APIKeysTab from '../components/admin/APIKeysTab';
import AIPromptsTab from '../components/admin/AIPromptsTab';
import DefaultSettingsTab from '../components/admin/DefaultSettingsTab';
import SystemConfigTab from '../components/admin/SystemConfigTab';

const Admin = () => {
  const { config, resetConfig, exportConfig, importConfig } = useAdminConfig();
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [activeTab, setActiveTab] = useState('api-keys');

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleExport = () => {
    try {
      const configString = exportConfig();
      const blob = new Blob([configString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `podcast360-config-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showMessage('success', 'تم تصدير الإعدادات بنجاح');
    } catch (error) {
      console.error('Export error:', error);
      showMessage('error', 'فشل في تصدير الإعدادات');
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const configString = e.target?.result as string;
        importConfig(configString);
        showMessage('success', 'تم استيراد الإعدادات بنجاح');
      } catch (error) {
        console.error('Import error:', error);
        showMessage('error', 'فشل في استيراد الإعدادات - تأكد من صحة الملف');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleReset = () => {
    if (confirm('هل تريد إعادة تعيين جميع الإعدادات إلى القيم الافتراضية؟ لا يمكن التراجع عن هذا الإجراء.')) {
      resetConfig();
      showMessage('success', 'تم إعادة تعيين جميع الإعدادات');
    }
  };

  return (
    <div className="min-h-screen bg-podcast-bg" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-podcast-border px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-podcast-blue hover:text-podcast-gold transition-colors">
              <ArrowLeft className="w-5 h-5" />
              العودة للرئيسية
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-podcast-blue">لوحة الإدارة</h1>
              <p className="text-sm text-podcast-gray">إدارة إعدادات النظام والذكاء الاصطناعي</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
              id="import-config"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('import-config')?.click()}
              className="text-podcast-blue border-podcast-blue hover:bg-podcast-blue/5"
            >
              <Upload className="w-4 h-4 ml-1" />
              استيراد
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="text-podcast-blue border-podcast-blue hover:bg-podcast-blue/5"
            >
              <Download className="w-4 h-4 ml-1" />
              تصدير
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <RotateCcw className="w-4 h-4 ml-1" />
              إعادة تعيين
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Status Message */}
        {message && (
          <div className={`mb-6 flex items-center gap-2 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.type === 'success' ? 
              <CheckCircle className="w-5 h-5" /> : 
              <AlertCircle className="w-5 h-5" />
            }
            <span>{message.text}</span>
          </div>
        )}

        {/* Configuration Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-podcast-border">
          <Tabs value={activeTab} onValueChange={setActiveTab} dir="rtl">
            <TabsList className="w-full grid grid-cols-4 rounded-t-xl bg-podcast-gold/10">
              <TabsTrigger value="api-keys" className="text-right">
                مفاتيح API
              </TabsTrigger>
              <TabsTrigger value="prompts" className="text-right">
                القوالب والتوجيهات
              </TabsTrigger>
              <TabsTrigger value="defaults" className="text-right">
                الإعدادات الافتراضية
              </TabsTrigger>
              <TabsTrigger value="system" className="text-right">
                إعدادات النظام
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="api-keys" className="mt-0">
                <APIKeysTab />
              </TabsContent>

              <TabsContent value="prompts" className="mt-0">
                <AIPromptsTab />
              </TabsContent>

              <TabsContent value="defaults" className="mt-0">
                <DefaultSettingsTab />
              </TabsContent>

              <TabsContent value="system" className="mt-0">
                <SystemConfigTab />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Config Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-2">معلومات الإعدادات</p>
              <div className="space-y-1">
                <p>إصدار الإعدادات: {config.version}</p>
                <p>آخر تحديث: {new Date(config.lastUpdated).toLocaleString('ar-SA')}</p>
                <p>يتم حفظ جميع التغييرات تلقائياً في متصفحك المحلي</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
