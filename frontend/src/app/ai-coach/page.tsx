'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/hooks/useAuth';

export default function AiCoachPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await apiClient.aiChat(input, language);
      const aiMessage = { role: 'assistant', content: response.data.message };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = language === 'ar' 
    ? [
        'كيف أخسر 10 كيلو؟',
        'أنشئ برنامج تضخيم 5 أيام',
        'أفضل تمارين للظهر؟',
        'كيف أزيد البروتين؟',
      ]
    : [
        'How to lose 10kg?',
        'Create a 5-day muscle gain program',
        'Best back exercises?',
        'How to increase protein intake?',
      ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Elite Fitness AI Coach 🤖</h1>
          <p className="text-gray-400">Your personal AI fitness trainer</p>
        </div>

        {/* Language Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setLanguage('en')}
            className={`px-4 py-2 rounded-lg transition ${
              language === 'en'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('ar')}
            className={`px-4 py-2 rounded-lg transition ${
              language === 'ar'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            العربية
          </button>
        </div>

        {/* Chat Area */}
        <div className="card mb-6 h-96 overflow-y-auto flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-5xl mb-4">💬</div>
              <p className="text-gray-400 text-center">
                {language === 'ar'
                  ? 'ابدأ محادثتك مع مدربك الذكي'
                  : 'Start a conversation with your AI coach'}
              </p>
            </div>
          ) : (
            <div className="flex-1 space-y-4 p-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-purple-500/30 border border-purple-500/60'
                        : 'bg-gray-700/30 border border-gray-600/60'
                    }`}
                  >
                    <p className="text-white text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-700/30 border border-gray-600/60 px-4 py-2 rounded-lg">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Suggested Questions */}
        {messages.length === 0 && (
          <div className="mb-6">
            <p className="text-gray-400 mb-3 text-sm">
              {language === 'ar' ? 'أسئلة مقترحة:' : 'Suggested questions:'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {suggestedQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(question);
                    handleSendMessage({
                      preventDefault: () => {},
                    } as React.FormEvent);
                  }}
                  className="card hover:border-purple-500 text-left text-sm"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={language === 'ar' ? 'اكتب سؤالك...' : 'Ask a question...'}
            className="input-field flex-1"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-primary py-3 px-6 disabled:opacity-50"
          >
            {language === 'ar' ? 'إرسال' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}
