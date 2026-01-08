import slugify from 'slugify';


export const generateSlug = (
  text: string, 
  { maxLength = 50 }: { maxLength?: number } = {}
): string => {
  if (!text || typeof text !== 'string') return Date.now().toString();

 
  let slug = slugify(text, {
    lower: true,     
    strict: true,    
    locale: 'en',     
    remove: /[*+~.()'"!:@]/g 
  });


  if (slug.length > maxLength) {
    slug = slug.slice(0, maxLength).replace(/-+$/, '');
  }

  return slug || Date.now().toString();
};