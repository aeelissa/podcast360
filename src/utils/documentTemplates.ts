
import { DocumentTemplate } from '../types/document';

export const documentTemplates: Record<string, DocumentTemplate> = {
  concept: {
    type: 'concept',
    title: 'ورقة التصور',
    content: `<h2>الذكاء الاصطناعي في حياتنا اليومية</h2>
<p>استكشاف التطبيقات العملية للذكاء الاصطناعي وتأثيرها على المجتمع</p>

<h3>الجمهور المستهدف</h3>
<p>المهتمون بالتكنولوجيا والمطورون</p>

<h3>المدة المتوقعة</h3>
<p>45 دقيقة</p>

<h3>الأهداف</h3>
<ul>
<li>فهم أساسيات الذكاء الاصطناعي</li>
<li>استعراض التطبيقات العملية</li>
<li>مناقشة التحديات والفرص</li>
</ul>`,
    metadata: {
      duration: '45 دقيقة',
      targetAudience: 'المهتمون بالتكنولوجيا والمطورون'
    }
  },

  preparation: {
    type: 'preparation',
    title: 'ورقة الإعداد',
    content: `<h3>نقاط البحث</h3>
<ul>
<li>إحصائيات حديثة عن استخدام الذكاء الاصطناعي</li>
<li>قصص نجاح من الشركات المحلية</li>
<li>تحديات الخصوصية والأمان</li>
</ul>

<h3>الضيوف</h3>
<p><strong>د. أحمد محمد</strong> - خبير الذكاء الاصطناعي</p>
<p>المواضيع: التعلم الآلي، معالجة اللغات الطبيعية</p>

<h3>المعدات المطلوبة</h3>
<ul>
<li>ميكروفون عالي الجودة</li>
<li>برنامج تسجيل</li>
<li>سماعات مراقبة</li>
</ul>

<h3>الجدول الزمني</h3>
<p>2 ساعة إعداد + 1 ساعة تسجيل + 1 ساعة مونتاج</p>`
  },

  script: {
    type: 'script',
    title: 'ورقة السكربت',
    content: `<h3>المقدمة</h3>
<p>مرحباً بكم في بودكاست التكنولوجيا، أنا مضيفكم...</p>

<h3>الجزء الأول: ما هو الذكاء الاصطناعي؟ (15 دقيقة)</h3>
<p>شرح المفاهيم الأساسية بطريقة مبسطة</p>

<h3>الجزء الثاني: التطبيقات العملية (20 دقيقة)</h3>
<p>أمثلة من الواقع وقصص نجاح</p>

<h3>الخاتمة</h3>
<p>شكراً لكم للاستماع، لا تنسوا الاشتراك...</p>`
  }
};

export const createDocumentFromTemplate = (type: string): DocumentTemplate => {
  const template = documentTemplates[type];
  if (!template) {
    throw new Error(`Template not found for type: ${type}`);
  }
  return { ...template };
};
