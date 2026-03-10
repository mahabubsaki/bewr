import React from "react";
import type { DeckblattData } from "../data/defaultData";
import PhotoUpload from "./PhotoUpload";
import { cn } from "../lib/utils";

interface DeckblattPreviewProps {
  data: DeckblattData;
  onPhotoChange: (photo: string) => void;
  scale?: number;
}

const DeckblattPreview: React.FC<DeckblattPreviewProps> = ({ 
  data, 
  onPhotoChange,
}) => {
  const margins = data.margins || { top: 30, bottom: 30, left: 25, right: 20 };

  return (
    <div className="w-full flex justify-center py-8 px-4 sm:px-0 bg-[#525659] min-h-screen overflow-x-auto">
      <div
        className="bg-white shadow-2xl transition-all flex-shrink-0"
        style={{
          width: "210mm",
          minHeight: "297mm",
          paddingTop: `${margins.top}mm`,
          paddingBottom: `${margins.bottom}mm`,
          paddingLeft: `${margins.left}mm`,
          paddingRight: `${margins.right}mm`,
          boxSizing: "border-box",
        }}
      >
        <div className="flex h-full flex-col font-sans text-[#1a1a1a]">
          {/* Header - Matching PDF precisely */}
          <div className="bg-[#f0f0f0] p-[40pt] pb-[24pt] text-center">
            <h1 className="text-[30pt] font-semibold tracking-tight mb-2">
              {data.name || "Ihr Name"}
            </h1>
            <p className="text-[14pt] font-medium text-[#555]">
              {data.position || "Angestrebte Position"}
            </p>
          </div>

          {/* Photo Section */}
          <div className="flex-1 flex items-center justify-center p-[20pt]">
            <div className="w-[230pt] h-[300pt] border-[4pt] border-[#eee] bg-[#fafafa] overflow-hidden">
               {data.photo ? (
                  <img src={data.photo} alt="Foto" className="w-full h-full object-cover" />
               ) : null}
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="bg-[#f0f0f0] p-[24pt] px-[48pt] flex gap-[40pt]">
            {/* Contact */}
            <div className="flex-1">
              <h3 className="text-[11pt] font-bold mb-3 uppercase tracking-wider">
                {data.sectionTitles?.contact || "KONTAKTDATEN"}
              </h3>
              <div className="text-[9.5pt] leading-[1.6] text-[#1a1a1a] space-y-0.5">
                <p>{data.name}</p>
                <p>{data.street}</p>
                <p>{data.city}</p>
                <div className="mt-3">
                  <p>Tel.: {data.phone}</p>
                  <p className="underline decoration-[#3d3d3d] transition-colors">{data.email}</p>
                </div>
              </div>
            </div>

            {/* Attachments */}
            <div className="flex-1">
              <h3 className="text-[11pt] font-bold mb-3 uppercase tracking-wider">
                {data.sectionTitles?.anlagen || "ANLAGEN"}
              </h3>
              <ul className="space-y-0.5">
                {data.anlagen.map((anlage, idx) => (
                  <li key={idx} className="flex items-start text-[9.5pt] text-[#1a1a1a]">
                    <span className="w-3 shrink-0">•</span>
                    <span>{anlage}</span>
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
