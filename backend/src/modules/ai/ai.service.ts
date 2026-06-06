import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(private prisma: PrismaService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async chat(userId: string, message: string, language: string = 'en') {
    try {
      // Get user profile for context
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
      });

      // Build system prompt
      const systemPrompt = this.buildSystemPrompt(user, language);

      // Get recent chat history for context
      const chatHistory = await this.prisma.chatHistory.findMany({
        where: { userId, language },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });

      // Build messages for OpenAI
      const messages = [
        ...chatHistory.reverse().map((chat) => ({
          role: chat.role as 'user' | 'assistant',
          content: chat.content,
        })),
        { role: 'user' as const, content: message },
      ];

      // Call OpenAI API
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const aiMessage =
        response.choices[0].message.content || 'Unable to process request';

      // Save chat history
      const conversationId = chatHistory[0]?.['conversationId'] || userId;

      await Promise.all([
        this.prisma.chatHistory.create({
          data: {
            userId,
            role: 'user',
            content: message,
            language,
            conversationId,
          },
        }),
        this.prisma.chatHistory.create({
          data: {
            userId,
            role: 'assistant',
            content: aiMessage,
            language,
            conversationId,
          },
        }),
      ]);

      return {
        message: aiMessage,
        conversationId,
      };
    } catch (error) {
      console.error('AI Chat Error:', error);
      throw new Error('Failed to process AI request');
    }
  }

  private buildSystemPrompt(user: any, language: string): string {
    const lang = language === 'ar' ? 'Arabic' : 'English';

    const systemPrompt =
      language === 'ar'
        ? `أنت مدرب لياقة بدنية متخصص وذكي. اسمك Elite Fitness Coach.
        
بيانات المستخدم:
- الاسم: ${user.fullName}
- الهدف: ${user.profile?.fitnessGoal}
- الوزن: ${user.profile?.weight} كجم
- الطول: ${user.profile?.height} سم
- مستوى النشاط: ${user.profile?.activityLevel}

تعليمات:
1. رد باللغة العربية فقط
2. قدم نصائح شخصية بناءً على بيانات المستخدم
3. كن صديقياً ومحفزاً
4. قدم نصائح عملية وقابلة للتنفيذ
5. إذا طلب المستخدم خطة تمرين أو تغذية، قدم تفاصيل محددة`
        : `You are a professional and intelligent fitness coach. Your name is Elite Fitness Coach.

User Data:
- Name: ${user.fullName}
- Goal: ${user.profile?.fitnessGoal}
- Weight: ${user.profile?.weight} kg
- Height: ${user.profile?.height} cm
- Activity Level: ${user.profile?.activityLevel}

Instructions:
1. Respond in English only
2. Provide personalized advice based on user data
3. Be friendly and motivating
4. Give practical and actionable tips
5. If asked for workout or nutrition plans, provide specific details`;

    return systemPrompt;
  }

  async generateWorkoutPlan(userId: string, goal: string, days: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true },
      });

      const prompt = `Generate a ${days}-day workout plan for someone with these goals:
- Primary Goal: ${goal}
- Weight: ${user.profile?.weight} kg
- Height: ${user.profile?.height} cm
- Activity Level: ${user.profile?.activityLevel}

Format as JSON with exercises, sets, reps, and rest periods.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional fitness coach. Respond with valid JSON only.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      return JSON.parse(
        response.choices[0].message.content || '{}',
      );
    } catch (error) {
      console.error('Workout Plan Generation Error:', error);
      throw new Error('Failed to generate workout plan');
    }
  }

  async analyzeProgress(userId: string) {
    try {
      // Get user's recent data
      const progressData = await this.prisma.progressTracking.findMany({
        where: { userId },
        orderBy: { recordedAt: 'desc' },
        take: 30,
      });

      const workoutLogs = await this.prisma.exerciseLog.findMany({
        where: { userId },
        orderBy: { loggedAt: 'desc' },
        take: 20,
      });

      const prompt = `Analyze this fitness progress data and provide insights:
Progress Records: ${JSON.stringify(progressData)}
Workout Logs: ${JSON.stringify(workoutLogs)}

Provide a summary of:
1. Progress made
2. Areas to improve
3. Recommendations
4. Motivation`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a fitness analyst. Provide detailed progress analysis.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });

      return {
        analysis: response.choices[0].message.content,
      };
    } catch (error) {
      console.error('Progress Analysis Error:', error);
      throw new Error('Failed to analyze progress');
    }
  }
}
