import {initial,change,restore,projects,locations,startPackage} from './domain.mjs';
// Conservative suggestions only. Prices always come from the approved domain catalogue.
export function planFromBrief(text,service,project,contact={}){
 const lower=text.toLowerCase();
 const aliases=[['Birthday reel',/birthday/],['Social reel',/\breels?\b|short.form/],['Music video',/music video/],['Podcast',/podcast/],['Wedding film',/wedding/],['Conference',/conference/],['Interview',/interview/],['Testimonial',/testimonial/],['Documentary',/documentary/],['Product video',/product/],['Property video',/property|real estate/],['Tourism & hospitality film',/tourism|hospitality|hotel/],['Event coverage',/event/],['Monthly content',/retainer|monthly content/],['Livestreaming',/live.?stream/]];
 const choices=projects[service]||projects.Video;
 const detected=aliases.find(([p,re])=>choices.includes(p)&&re.test(lower))?.[0];
 const selected=choices.includes(project)?project:detected;
 if(!selected)return null;
 let s=change(change(initial(),'service',service),'project',selected);
 const indoor=/\bindoor(s)?\b|\bstudio\b/.test(lower),outdoor=/\boutdoor(s)?\b/.test(lower);
 const style=indoor&&outdoor?'Both':outdoor?'Outdoor':'Indoor';
 if(selected==='Social reel'&&service==='Video')s=startPackage('reels',style.toLowerCase());
 s.shootStyle=style;
 for(const location of locations)if(lower.includes(location.toLowerCase()))s.location=location;
 const hours=lower.match(/\b(2|3|4|6|7|8)\s*(?:hours?|hrs?)\b/);if(hours&&s.mode!=='package')s.hours=Number(hours[1]);
 if(/\bfull.day\b/.test(lower)&&s.mode!=='package')s.hours='Full day';
 const date=text.match(/\b(20\d\d-\d\d-\d\d)\b/);if(date)s.date=date[1];
 const cameras=lower.match(/\b([123])\s*cameras?\b/);if(cameras&&s.mode!=='package')s.cameras=Number(cameras[1]);
 const episodes=lower.match(/\b(\d{1,2})\s*episodes?\b/);if(episodes)s.episodes=Math.min(30,Math.max(1,Number(episodes[1])));
 if(/\bsame.day\b/.test(lower))s.extras=['sameDay'];
 return restore({...s,...contact,notes:text,section:'shoot'});
}
export async function readBriefPdf(file){
 if(file.size>8*1024*1024)throw new Error('Choose a PDF smaller than 8 MB.');
 const bytes=new Uint8Array(await file.arrayBuffer());
 if(new TextDecoder().decode(bytes.slice(0,5))!=='%PDF-')throw new Error('Choose a valid PDF file.');
 const pdfjs=await import('./vendor/pdfjs/pdf.mjs');
 pdfjs.GlobalWorkerOptions.workerSrc='/vendor/pdfjs/pdf.worker.mjs';
 let loading,document;
 try{
  loading=pdfjs.getDocument({data:bytes,isEvalSupported:false,useSystemFonts:true});
  document=await loading.promise;
  if(document.numPages>30)throw new Error('Please use a brief of 30 pages or fewer.');
  const pages=[];let length=0;
  for(let i=1;i<=document.numPages;i++){
   const page=await document.getPage(i),content=await page.getTextContent();
   const text=content.items.map(item=>item.str+(item.hasEOL?'\n':' ')).join('').trim();
   pages.push(text);length+=text.length;
   if(length>6000)throw new Error('This PDF contains more than 6,000 characters. Paste a shorter summary instead.');
   page.cleanup();
  }
  const text=pages.join('\n\n').trim();
  if(text.length<10)throw new Error('This PDF has no readable text. Please paste a summary of the scanned brief.');
  return text;
 }catch(error){
  if(error.name==='PasswordException')throw new Error('Please upload an unlocked PDF, or paste its text.');
  if(error.name==='InvalidPDFException')throw new Error('This PDF could not be read. Try another file or paste its text.');
  throw error;
 }finally{if(document)await document.destroy();else if(loading)await loading.destroy()}
}
