
import React from 'react';
import { ChatMessage } from '../../types/chat';
import { ProcessedAIResponse } from '../../services/aiResponseProcessor';
import { Copy, ArrowRight, Plus, RotateCcw, FileText } from 'lucide-react';

interface EnhancedMessageDisplayProps {
  message: ChatMessage;
  processedResponse?: ProcessedAIResponse;
  onAction: (actionType: string, content: string) => void;
  onCopy: (content: string) => void;
  onMigrate: (message: ChatMessage) => void;
  isLatest?: boolean;
}

const EnhancedMessageDisplay: React.FC<EnhancedMessageDisplayProps> = ({
  message,
  processedResponse,
  onAction,
  onCopy,
  onMigrate,
  isLatest = false
}) => {
  const getContentTypeIcon = (contentType?: string) => {
    switch (contentType) {
      case 'list': return '📝';
      case 'script': return '🎬';
      case 'outline': return '📋';
      default: return '💬';
    }
  };

  const getContentTypeLabel = (contentType?: string) => {
    switch (contentType) {
      case 'list': return 'قائمة';
      case 'script': return 'سكربت';
      case 'outline': return 'مخطط';
      default: return 'نص';
    }
  };

  return (
    <div
      className={`rounded-xl p-4 ${
        message.role === 'user' 
          ? 'bg-podcast-blue/10 mr-8' 
          : 'bg-gray-50 ml-8 border border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-right">
          <div className="text-sm font-bold text-podcast-gray">
            {message.role === 'user' ? 'المُنتِج' : 'AI'}
          </div>
          
          {/* Content Type Indicator for AI messages */}
          {message.role === 'assistant' && processedResponse && (
            <div className="flex items-center gap-1 text-xs bg-podcast-gold/10 text-podcast-gold-dark px-2 py-1 rounded-full">
              <span>{getContentTypeIcon(processedResponse.contentType)}</span>
              <span>{getContentTypeLabel(processedResponse.contentType)}</span>
            </div>
          )}
          
          {/* Confidence Indicator */}
          {message.role === 'assistant' && processedResponse && (
            <div className="flex items-center gap-1 text-xs text-podcast-gray">
              <div className={`w-2 h-2 rounded-full ${
                processedResponse.confidence > 0.8 ? 'bg-green-400' :
                processedResponse.confidence > 0.6 ? 'bg-yellow-400' : 'bg-red-400'
              }`} />
              <span>{Math.round(processedResponse.confidence * 100)}%</span>
            </div>
          )}
        </div>
        
        {/* Message Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onCopy(message.content)}
            className="p-1 hover:bg-podcast-blue/10 rounded text-podcast-gray hover:text-podcast-blue transition-colors"
            title="نسخ الرسالة"
          >
            <Copy className="w-3 h-3" />
          </button>
          
          <button
            onClick={() => onMigrate(message)}
            className="p-1 hover:bg-podcast-gold/10 rounded text-podcast-gray hover:text-podcast-gold-dark transition-colors"
            title="نقل إلى جلسة أخرى"
          >
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
      
      {/* Message Content */}
      <div className="text-sm leading-relaxed text-right whitespace-pre-line mb-3">
        {processedResponse?.formattedContent || message.content}
      </div>
      
      {/* Enhanced Action Buttons for AI Messages */}
      {message.role === 'assistant' && processedResponse && isLatest && (
        <div className="space-y-3">
          {/* Insertion Strategy Info */}
          <div className="text-xs text-podcast-gray bg-podcast-blue/5 p-2 rounded-lg text-right">
            <div className="flex items-center gap-1 justify-end mb-1">
              <span>استراتيجية الإدراج المقترحة:</span>
              <FileText className="w-3 h-3" />
            </div>
            <div className="font-medium">
              {processedResponse.insertionStrategy.targetLocation} - {
                processedResponse.insertionStrategy.mode === 'cursor' ? 'عند المؤشر' :
                processedResponse.insertionStrategy.mode === 'append' ? 'في النهاية' :
                processedResponse.insertionStrategy.mode === 'section' ? 'في القسم' : 'استبدال'
              }
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 justify-end flex-wrap">
            {processedResponse.suggestedActions.map((action, index) => (
              <button
                key={index}
                onClick={() => onAction(action.type, message.content)}
                className={`px-3 py-2 rounded-full text-sm transition-colors font-medium flex items-center gap-1 ${
                  index === 0 
                    ? 'bg-podcast-blue/10 hover:bg-podcast-blue/20 text-podcast-blue' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
                title={action.description}
              >
                {action.type === 'insert-at-cursor' && <ArrowRight className="w-3 h-3" />}
                {action.type === 'create-new-section' && <Plus className="w-3 h-3" />}
                {action.type === 'replace-selection' && <RotateCcw className="w-3 h-3" />}
                {action.type === 'append-to-section' && <FileText className="w-3 h-3" />}
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedMessageDisplay;
