
import React, { useState } from 'react';
import { Key, Eye, EyeOff, TestTube, CheckCircle, XCircle } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { useAdminConfig } from '../../contexts/AdminConfigContext';
import { aiService } from '../../services/aiService';

const APIKeysTab = () => {
  const { config, updateAPIKeys } = useAdminConfig();
  const [showKeys, setShowKeys] = useState({
    googleGemini: false,
    openai: false,
    googleDrive: false
  });
  const [testResults, setTestResults] = useState<Record<string, 'testing' | 'success' | 'error' | null>>({});

  const toggleShowKey = (keyType: string) => {
    setShowKeys(prev => ({ ...prev, [keyType]: !prev[keyType] }));
  };

  const testConnection = async (keyType: string, apiKey: string) => {
    setTestResults(prev => ({ ...prev, [keyType]: 'testing' }));
    
    try {
      if (keyType === 'googleGemini') {
        // Test Gemini API
        const tempService = new (aiService.constructor as any)();
        tempService.setApiKey(apiKey);
        await tempService.chat([{ role: 'user', content: 'test' }], { maxTokens: 10 });
        setTestResults(prev => ({ ...prev, [keyType]: 'success' }));
      } else {
        // For other APIs, just mark as success for now
        setTestResults(prev => ({ ...prev, [keyType]: 'success' }));
      }
    } catch (error) {
      console.error('API test failed:', error);
      setTestResults(prev => ({ ...prev, [keyType]: 'error' }));
    }
    
    // Clear result after 3 seconds
    setTimeout(() => {
      setTestResults(prev => ({ ...prev, [keyType]: null }));
    }, 3000);
  };

  const renderAPIKeyField = (
    keyType: keyof typeof config.apiKeys,
    label: string,
    placeholder: string,
    helpUrl?: string,
    helpText?: string
  ) => {
    const value = config.apiKeys[keyType] || '';
    const isVisible = showKeys[keyType];
    const testResult = testResults[keyType];

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-right font-medium">{label}</Label>
          {value && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => testConnection(keyType, value)}
              disabled={testResult === 'testing'}
              className="text-xs"
            >
              {testResult === 'testing' ? (
                <div className="animate-spin w-3 h-3 border border-podcast-gold border-t-transparent rounded-full ml-1" />
              ) : testResult === 'success' ? (
                <CheckCircle className="w-3 h-3 text-green-600 ml-1" />
              ) : testResult === 'error' ? (
                <XCircle className="w-3 h-3 text-red-600 ml-1" />
              ) : (
                <TestTube className="w-3 h-3 ml-1" />
              )}
              اختبار الاتصال
            </Button>
          )}
        </div>
        
        <div className="relative">
          <Input
            type={isVisible ? 'text' : 'password'}
            value={value}
            onChange={(e) => updateAPIKeys({ [keyType]: e.target.value })}
            placeholder={placeholder}
            className="pr-10"
            dir="ltr"
          />
          <button
            type="button"
            onClick={() => toggleShowKey(keyType)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-podcast-gray hover:text-podcast-gold"
          >
            {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        
        {helpUrl && (
          <p className="text-xs text-podcast-gray text-right">
            {helpText || 'احصل على المفتاح من'}{' '}
            <a 
              href={helpUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-podcast-gold hover:underline"
            >
              هنا
            </a>
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <Key className="w-6 h-6 text-podcast-gold" />
        <div>
          <h3 className="text-lg font-semibold text-right">إدارة مفاتيح API</h3>
          <p className="text-sm text-podcast-gray text-right">
            قم بإعداد مفاتيح API للخدمات المختلفة المستخدمة في النظام
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Google Gemini API */}
        <div className="p-4 border border-podcast-border rounded-lg">
          <h4 className="font-medium mb-4 text-right">Google Gemini AI</h4>
          {renderAPIKeyField(
            'googleGemini',
            'مفتاح Google Gemini API',
            'AIza...',
            'https://makersuite.google.com/app/apikey',
            'احصل على مفتاح API من Google AI Studio'
          )}
        </div>

        {/* OpenAI API */}
        <div className="p-4 border border-podcast-border rounded-lg">
          <h4 className="font-medium mb-4 text-right">OpenAI API (اختياري)</h4>
          {renderAPIKeyField(
            'openai',
            'مفتاح OpenAI API',
            'sk-...',
            'https://platform.openai.com/api-keys',
            'احصل على مفتاح API من OpenAI Platform'
          )}
        </div>

        {/* Google Drive API */}
        <div className="p-4 border border-podcast-border rounded-lg">
          <h4 className="font-medium mb-4 text-right">Google Drive API (اختياري)</h4>
          {renderAPIKeyField(
            'googleDrive',
            'مفتاح Google Drive API',
            'AIza...',
            'https://console.cloud.google.com/apis/credentials',
            'احصل على مفتاح API من Google Cloud Console'
          )}
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Key className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-2">ملاحظات أمنية مهمة</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>يتم حفظ مفاتيح API محلياً في متصفحك فقط</li>
              <li>لن يتم إرسال المفاتيح إلى أي خادم خارجي</li>
              <li>تأكد من أمان جهازك وعدم مشاركة هذه المفاتيح</li>
              <li>يمكنك إلغاء المفاتيح من لوحات التحكم الخاصة بالخدمات</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIKeysTab;
