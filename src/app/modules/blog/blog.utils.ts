import slugify from 'slugify';

/**
 * স্ট্রিংকে SEO-friendly স্লাগে রূপান্তর করার ফাংশন
 */
export const generateSlug = (
  text: string, 
  { maxLength = 50 }: { maxLength?: number } = {}
): string => {
  if (!text || typeof text !== 'string') return Date.now().toString();

  // ১. slugify ব্যবহার করে ক্লিন করা
  let slug = slugify(text, {
    lower: true,      // সব ছোট হাতের অক্ষর
    strict: true,     // স্পেশাল ক্যারেক্টার রিমুভ করবে
    locale: 'en',     // ইংলিশ রুলস ফলো করবে
    remove: /[*+~.()'"!:@]/g 
  });

  // ২. maxLength অনুযায়ী ছোট করা
  if (slug.length > maxLength) {
    slug = slug.slice(0, maxLength).replace(/-+$/, '');
  }

  return slug || Date.now().toString();
};