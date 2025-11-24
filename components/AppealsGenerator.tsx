'use client';
import { Card } from './Card';
// We intentionally avoid importing from the `file-saver` package here.  
// When building this project with TypeScript, Vercel complained that there were no 
// type declarations for `file-saver`.  To work around that without bringing in 
// additional dev dependencies or custom type definitions, we implement a small
// helper that replicates the `saveAs` functionality.  See
// https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL for details.
/**
 * Trigger a browser download of a Blob by creating a temporary link and
 * programmatically clicking it.  After the download starts, the object URL
 * is revoked to free up resources.  This mirrors the behaviour of the
 * `saveAs` function from the `file-saver` library.
 *
 * @param blob The Blob to save
 * @param filename The desired name of the downloaded file
 */
function saveBlobAs(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  try {
    link.click();
  } finally {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
import { Document, Packer, Paragraph, TextRun } from 'docx';

function toDocx(content:string){
  const doc = new Document({ sections: [{ properties: {}, children: content.split('\n').map(line => new Paragraph({ children: [new TextRun(line)] })) }] });
  return Packer.toBlob(doc);
}

const templates = {
  pmb: `Re: PMB Appeal\n\nDear Scheme,\n\nThis is an appeal in terms of the PMB regulations. The claim(s) listed are True PMB based on ICD-10/DSP/emergency/hospital checks. Please pay in full or provide a lawful reason.\n\nRegards,\n`,
  dsp: `Re: DSP Access Appeal\n\nDear Scheme,\n\nMember complied with DSP use or presented in emergency/hospital. Please remove non-DSP penalties and settle.\n\nRegards,\n`,
  emergency: `Re: Emergency PMB Appeal\n\nDear Scheme,\n\nThe case qualifies as emergency under PMB regulations. Please pay in full.\n\nRegards,\n`
};

export function AppealsGenerator(){
  const build = async (key: keyof typeof templates) => {
    const blob = await toDocx(templates[key]);
    // Use the helper above instead of `saveAs` from file‑saver.  This avoids
    // runtime dependencies that lack TypeScript type declarations.
    saveBlobAs(blob, `${key}-appeal.docx`);
  };
  return (
    <Card>
      <div className="font-medium mb-2">Appeals Generator</div>
      <div className="flex gap-3">
        <button className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10" onClick={()=> build('pmb')}>PMB Appeal (DOCX)</button>
        <button className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10" onClick={()=> build('dsp')}>DSP Appeal (DOCX)</button>
        <button className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10" onClick={()=> build('emergency')}>Emergency Appeal (DOCX)</button>
      </div>
      <div className="text-xs text-white/60 mt-2">These are templates; paste your account specifics, attach Evidence Pack, and send.</div>
    </Card>
  );
}
