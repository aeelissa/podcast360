
import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Save, AlertCircle } from 'lucide-react';
import { aiService } from '../../services/aiService';

const APIKeyManager: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    // Load existing API key from localStorage
    const savedKey = localStorage.getItem('podcast360_ai_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setMessage({ type: 'error', text: 'يرجى إدخال مفتاح API صالح' });
      return;
    }

    setIsSaving(true);
    try {
      // Save to localStorage
      localStorage.setItem('podcast360_ai_api_key', apiKey);
      
      // Update AI service
      aiService.setApiKey(apiKey);
      
      setMessage({ type: 'success', text: 'تم حفظ مفتاح API بنجاح' });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving API key:', error);
      setMessage({ type: 'error', text: 'فشل في حفظ مفتاح API' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSaving) {
      handleSave();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Key className="w-5 h-5 text-podcast-gold" />
        <h3 className="font-medium text-right">إعدادات مفتاح API</h3>
      </div>

      {/* API Key Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-right">
          مفتاح Google Gemini API
        </label>
        <div className="relative">
          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="AIza..."
            className="podcast-input w-full pr-10"
            dir="ltr"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-podcast-gray hover:text-podcast-gold"
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-xs text-podcast-gray text-right">
          احصل على مفتاح API من{' '}
          <a 
            href="https://makersuite.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-podcast-gold hover:underline"
          >
            Google AI Studio
          </a>
        </p>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSaving || !apiKey.trim()}
        className="podcast-button w-full flex items-center justify-center gap-2"
      >
        {isSaving ? (
          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        {isSaving ? 'جاري الحفظ...' : 'حفظ المفتاح'}
      </button>

      {/* Message */}
      {message && (
        <div className={`flex items-start gap-2 p-3 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="text-sm">{message.text}</span>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">ملاحظة أمنية</p>
            <p>يتم حفظ مفتاح API محلياً في متصفحك فقط ولن يتم إرساله إلى أي خادم خارجي.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIKeyManager;
