import React from "react";
import type { DeckblattData } from "../data/defaultData";

interface DeckblattPreviewProps {
  data: DeckblattData;
  scale?: number;
}

const DeckblattPreview: React.FC<DeckblattPreviewProps> = ({ 
  data, 
}) => {
  return (
    <div className="w-full flex justify-center h-[400px] items-start pt-4 sm:pt-8 bg-transparent overflow-visible">
      <div
        id="deckblatt-document"
        className="bg-white shadow-2xl transition-all origin-top scale-[0.32] xs:scale-[0.42] sm:scale-[0.55] md:scale-[0.7] lg:scale-[0.85] xl:scale-[0.95] 2xl:scale-100 flex-shrink-0 cursor-default select-none relative group mb-32"
        style={{
          width: "210mm",
          minHeight: "297mm",
          height: "auto",
          boxSizing: "border-box",
          backgroundColor: "#fff",
        }}
      >
        <div className="flex h-full flex-col font-sans text-[#1a1a1a] leading-normal antialiased">
          {/* Top Bar - Header matching PDF */}
          <div className="bg-[#f2f2f2] pt-[55pt] pb-[35pt] px-[50pt] text-center border-b border-black/5">
            <h1 className="text-[38pt] font-black tracking-tight text-[#111] uppercase mb-1 leading-none">
              {data.name || "BEWERBUNG"}
            </h1>
            <div className="h-1.5 w-28 bg-primary mx-auto mb-7 mt-4 rounded-full shadow-[0_2px_10px_-2px_rgba(var(--primary),0.4)]" />
            <p className="text-[18pt] font-medium text-[#444] tracking-tight italic">
              {data.position || "als Senior Frontend Developer"}
            </p>
          </div>

          {/* Photo Section - Centered Focus */}
          <div className="flex-1 flex items-center justify-center py-[45pt] px-[50pt] bg-white">
            <div className="relative">
              {/* Refined shadow layers for depth */}
              <div className="absolute -inset-6 bg-primary/10 rounded-[20pt] blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-700" />
              <div className="relative w-[230pt] h-[300pt] border-[1pt] border-slate-200 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] bg-[#fcfcfc] overflow-hidden flex items-center justify-center ring-[8pt] ring-white">
                 {data.photo ? (
                    <img src={data.photo} alt="Foto" className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700" />
                 ) : (
                   <div className="flex flex-col items-center justify-center text-slate-300">
                     <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mb-5 border-2 border-dashed border-slate-200">
                       <span className="text-4xl font-extrabold">+</span>
                     </div>
                     <p className="text-[10pt] font-black uppercase tracking-[0.25em] opacity-40">Add Portrait</p>
                   </div>
                 )}
              </div>
            </div>
          </div>

          {/* Bottom Grid Section - Premium Footer */}
          <div className="bg-[#f1f1f1] py-[40pt] px-[60pt] flex flex-row items-stretch gap-[70pt] min-h-[170pt] border-t border-black/5">
            {/* Contact Data Column */}
            <div className="flex-1 flex flex-col justify-start">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-6 w-1 bg-primary rounded-full" />
                <h3 className="text-[13pt] font-black uppercase tracking-[0.2em] text-[#222]">
                  {data.sectionTitles?.contact || "Kontaktdaten"}
                </h3>
              </div>
              <div className="text-[11pt] leading-relaxed text-[#333] space-y-2 font-medium">
                <p className="text-[12pt] font-black mb-1.5 text-black">{data.name}</p>
                <div className="h-px w-14 bg-black/10 my-4" />
                <p className="flex items-center gap-2">{data.street}</p>
                <p>{data.city}</p>
                <div className="pt-3">
                  <p className="opacity-40 text-[9pt] font-black uppercase tracking-widest mb-1.5">Kontakt</p>
                  <p className="font-semibold">{data.phone}</p>
                  <p className="text-primary font-bold">{data.email}</p>
                </div>
              </div>
            </div>

            {/* Attachments Section Column */}
            <div className="flex-1 flex flex-col justify-start">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-6 w-1 bg-primary rounded-full" />
                <h3 className="text-[13pt] font-black uppercase tracking-[0.2em] text-[#222]">
                  {data.sectionTitles?.anlagen || "Inhalt / Anlagen"}
                </h3>
              </div>
              <ul className="space-y-3">
                {data.anlagen.map((anlage, idx) => (
                  <li key={idx} className="flex items-start text-[10.5pt] text-[#333] leading-tight font-medium">
                    <span className="mr-3 text-primary font-black mt-1 select-none text-[8pt]">●</span>
                    <span className="flex-1">{anlage}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeckblattPreview;
