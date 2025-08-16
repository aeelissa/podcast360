
import React, { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';

const AIChatPanel = () => {
  const [inputValue, setInputValue] = useState('');
  const [activeToggle, setActiveToggle] = useState<'document' | 'note'>('document');

  const chatMessages = [
    { role: 'user', content: 'مرحبا، أريد إنشاء بودكاست عن التكنولوجيا' },
    { role: 'assistant', content: 'أهلاً بك! سأساعدك في إعداد بودكاست رائع عن التكنولوجيا. دعنا نبدأ بتحديد الموضوع الرئيسي والجمهور المستهدف.' },
    { role: 'user', content: 'أريد التركيز على الذكاء الاصطناعي والتطبيقات العملية' },
    { role: 'assistant', content: 'ممتاز! الذكاء الاصطناعي موضوع شيق جداً. سأساعدك في إعداد المحتوى والسكربت للحلقة.' }
  ];

  const handleSend = () => {
    if (inputValue.trim()) {
      console.log('Sending message:', inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="podcast-panel h-full flex flex-col">
      {/* Header */}
      <div className="podcast-header px-4 py-3 rounded-t-xl">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <h2 className="font-semibold">الدردشة مع الذكاء الاصطناعي</h2>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-3">
          {chatMessages.map((message, index) => (
            <div
              key={index}
              className={`podcast-chat-message ${
                message.role === 'user' 
                  ? 'bg-podcast-blue/10 mr-8' 
                  : 'bg-muted ml-8'
              }`}
            >
              <div className="text-sm font-medium mb-1 text-podcast-gray">
                {message.role === 'user' ? 'أنت' : 'الذكاء الاصطناعي'}
              </div>
              <div className="text-sm leading-relaxed">{message.content}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Toggle Buttons */}
      <div className="px-4 pb-3">
        <div className="podcast-toggle">
          <button
            onClick={() => setActiveToggle('document')}
            className={`px-3 py-1 rounded text-sm transition-all ${
              activeToggle === 'document' 
                ? 'podcast-toggle-active' 
                : 'podcast-toggle-inactive'
            }`}
          >
            تطبيق على الوثيقة
          </button>
          <button
            onClick={() => setActiveToggle('note')}
            className={`px-3 py-1 rounded text-sm transition-all ${
              activeToggle === 'note' 
                ? 'podcast-toggle-active' 
                : 'podcast-toggle-inactive'
            }`}
          >
            حفظ كملاحظة
          </button>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-podcast-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="اكتب رسالتك هنا..."
            className="podcast-input flex-1"
          />
          <button
            onClick={handleSend}
            className="podcast-button p-2"
            disabled={!inputValue.trim()}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatPanel;
