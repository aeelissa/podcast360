
import React, { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';

const AIChatPanel = () => {
  const [inputValue, setInputValue] = useState('');
  const [activeToggle, setActiveToggle] = useState<'document' | 'note'>('document');

  const chatMessages = [
    { role: 'user', content: 'ساعدني بإضافة محور عن التسويق للحلقة.' },
    { role: 'assistant', content: 'ممتاز! أقترح محورًا بعنوان: \'التسويق الرقمي للبودكاست\'. هل تريد إضافته مباشرة إلى ورقة التصور؟' }
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

  const handlePillButtonClick = (action: string) => {
    console.log(`Clicked: ${action}`);
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
            <div key={index}>
              <div
                className={`podcast-chat-message ${
                  message.role === 'user' 
                    ? 'bg-podcast-blue/10 mr-8' 
                    : 'bg-muted ml-8'
                }`}
              >
                <div className="text-sm font-medium mb-1 text-podcast-gray">
                  {message.role === 'user' ? 'المُنتِج' : 'AI'}
                </div>
                <div className="text-sm leading-relaxed">{message.content}</div>
              </div>
              
              {/* Pill buttons after AI message */}
              {message.role === 'assistant' && index === chatMessages.length - 1 && (
                <div className="flex gap-2 mt-3 mr-8">
                  <button
                    onClick={() => handlePillButtonClick('تطبيق على الوثيقة')}
                    className="bg-podcast-blue/10 hover:bg-podcast-blue/20 text-podcast-blue px-3 py-1 rounded-full text-sm transition-colors"
                  >
                    تطبيق على الوثيقة
                  </button>
                  <button
                    onClick={() => handlePillButtonClick('حفظ كملاحظة')}
                    className="bg-podcast-gold/10 hover:bg-podcast-gold/20 text-podcast-gold-dark px-3 py-1 rounded-full text-sm transition-colors"
                  >
                    حفظ كملاحظة
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Toggle Above Input */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-4 justify-center text-sm">
          <button
            onClick={() => setActiveToggle('document')}
            className="flex items-center gap-2 text-podcast-gray hover:text-podcast-blue transition-colors"
          >
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              activeToggle === 'document' 
                ? 'border-podcast-blue bg-podcast-blue' 
                : 'border-podcast-gray'
            }`}>
              {activeToggle === 'document' && (
                <div className="w-2 h-2 rounded-full bg-white"></div>
              )}
            </div>
            تطبيق على الوثيقة
          </button>
          
          <button
            onClick={() => setActiveToggle('note')}
            className="flex items-center gap-2 text-podcast-gray hover:text-podcast-blue transition-colors"
          >
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              activeToggle === 'note' 
                ? 'border-podcast-blue bg-podcast-blue' 
                : 'border-podcast-gray'
            }`}>
              {activeToggle === 'note' && (
                <div className="w-2 h-2 rounded-full bg-white"></div>
              )}
            </div>
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
