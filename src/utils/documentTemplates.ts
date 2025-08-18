import { DocumentTemplate } from '../types/document';
import { Podcast, Episode } from '../types/podcast';

export const createDocumentFromTemplate = (
  type: string, 
  podcast?: Podcast, 
  episode?: Episode
): DocumentTemplate => {
  const templates = getDocumentTemplates(podcast, episode);
  const template = templates[type];
  if (!template) {
    throw new Error(`Template not found for type: ${type}`);
  }
  return { ...template };
};

const getDocumentTemplates = (
  podcast?: Podcast, 
  episode?: Episode
): Record<string, DocumentTemplate> => {
  // Extract settings for template population
  const podcastName = podcast?.name || 'البودكاست';
  const episodeTitle = episode?.title || 'الحلقة';
  const tone = podcast?.settings.identity.tone || 'ودودة ومهنية';
  const audience = podcast?.settings.identity.audience || 'الجمهور العام';
  const brandVoice = podcast?.settings.identity.brandVoice || 'عربية فصحى معاصرة';
  const hostName = podcast?.settings.identity.hostName || 'المضيف';
  const duration = episode?.settings.duration || 45;
  const contentType = episode?.settings.contentType || 'مقابلة';
  const goals = episode?.settings.goals || ['تقديم محتوى مفيد', 'إشراك الجمهور'];
  const successCriteria = episode?.settings.successCriteria || ['تحقيق تفاعل جيد', 'الحصول على تقييم إيجابي'];

  return {
    concept: {
      type: 'concept',
      title: 'ورقة التصور',
      content: `<h2>${episodeTitle}</h2>
<p>استكشاف وتخطيط محتوى الحلقة وفقاً لرؤية ${podcastName}</p>

<h3>الجمهور المستهدف</h3>
<p>${audience}</p>

<h3>المدة المتوقعة</h3>
<p>${duration} دقيقة</p>

<h3>نوع المحتوى</h3>
<p>${contentType}</p>

<h3>النبرة والأسلوب</h3>
<p>النبرة: ${tone}</p>
<p>اللغة: ${brandVoice}</p>

<h3>أهداف الحلقة</h3>
<ul>
${goals.map(goal => `<li>${goal}</li>`).join('\n')}
</ul>

<h3>معايير النجاح</h3>
<ul>
${successCriteria.map(criteria => `<li>${criteria}</li>`).join('\n')}
</ul>

<h3>الفكرة الرئيسية</h3>
<p>اكتب هنا الفكرة الأساسية للحلقة...</p>

<h3>النقاط المحورية</h3>
<ul>
<li>النقطة الأولى</li>
<li>النقطة الثانية</li>
<li>النقطة الثالثة</li>
</ul>`,
      metadata: {
        duration: `${duration} دقيقة`,
        targetAudience: audience,
        podcastId: podcast?.id,
        episodeId: episode?.id
      }
    },

    preparation: {
      type: 'preparation',
      title: 'ورقة الإعداد',
      content: `<h3>معلومات الحلقة</h3>
<p><strong>اسم البودكاست:</strong> ${podcastName}</p>
<p><strong>عنوان الحلقة:</strong> ${episodeTitle}</p>
<p><strong>المضيف:</strong> ${hostName}</p>
<p><strong>النبرة:</strong> ${tone}</p>
<p><strong>نوع المحتوى:</strong> ${contentType}</p>

<h3>نقاط البحث</h3>
<ul>
<li>بحث الموضوع الرئيسي</li>
<li>جمع الإحصائيات والأرقام</li>
<li>إعداد الأمثلة والقصص</li>
<li>مراجعة المصادر الموثوقة</li>
</ul>

<h3>الضيوف (إن وجد)</h3>
<p><strong>اسم الضيف:</strong> </p>
<p><strong>التخصص:</strong> </p>
<p><strong>المواضيع المطلوب تغطيتها:</strong> </p>

<h3>المعدات والبرامج المطلوبة</h3>
<ul>
<li>ميكروفون عالي الجودة</li>
<li>برنامج تسجيل</li>
<li>سماعات مراقبة</li>
<li>مساحة تسجيل هادئة</li>
</ul>

<h3>الجدول الزمني للإنتاج</h3>
<p><strong>التحضير:</strong> ساعتان</p>
<p><strong>التسجيل:</strong> ${Math.ceil(duration * 1.2)} دقيقة (شامل الوقت الإضافي)</p>
<p><strong>المونتاج:</strong> ساعة واحدة</p>

<h3>قائمة المراجعة</h3>
<ul>
<li>☐ تم إعداد المحتوى</li>
<li>☐ تم تجهيز المعدات</li>
<li>☐ تم التأكد من جودة الصوت</li>
<li>☐ تم تحضير الأسئلة</li>
</ul>`,
      metadata: {
        podcastId: podcast?.id,
        episodeId: episode?.id
      }
    },

    script: {
      type: 'script',
      title: 'ورقة السكربت',
      content: `<h3>المقدمة (5 دقائق)</h3>
<p>مرحباً بكم في ${podcastName}، أنا ${hostName}...</p>
<p>في حلقة اليوم بعنوان "${episodeTitle}"، سنتحدث عن...</p>

<h3>الجزء الأول: العرض الرئيسي (${Math.floor(duration * 0.6)} دقيقة)</h3>
<p><strong>النقطة الأولى:</strong></p>
<p>شرح تفصيلي للنقطة الأولى...</p>

<p><strong>النقطة الثانية:</strong></p>
<p>شرح تفصيلي للنقطة الثانية...</p>

<p><strong>النقطة الثالثة:</strong></p>
<p>شرح تفصيلي للنقطة الثالثة...</p>

${contentType === 'مقابلة' ? `
<h3>أسئلة المقابلة</h3>
<ul>
<li>السؤال الأول: ...</li>
<li>السؤال الثاني: ...</li>
<li>السؤال الثالث: ...</li>
</ul>
` : ''}

<h3>الجزء الثاني: التفاعل والأمثلة (${Math.floor(duration * 0.25)} دقيقة)</h3>
<p>أمثلة عملية وقصص من الواقع...</p>

<h3>الخاتمة (${Math.floor(duration * 0.15)} دقيقة)</h3>
<p>لنلخص ما تحدثنا عنه اليوم...</p>
<p>شكراً لكم للاستماع إلى ${podcastName}، لا تنسوا الاشتراك والتقييم...</p>
<p>نلقاكم في الحلقة القادمة، إلى اللقاء!</p>

<h3>ملاحظات للمضيف</h3>
<ul>
<li>التركيز على النبرة ${tone}</li>
<li>استخدام ${brandVoice} في التعبير</li>
<li>مراعاة طبيعة الجمهور: ${audience}</li>
</ul>`,
      metadata: {
        podcastId: podcast?.id,
        episodeId: episode?.id
      }
    }
  };
};

// Keep the old export for backward compatibility but mark as deprecated
export const documentTemplates: Record<string, DocumentTemplate> = {};
