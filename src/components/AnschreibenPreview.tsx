import PhotoUpload from "./PhotoUpload";
import type { AnschreibenData } from "../data/defaultData";

interface AnschreibenPreviewProps {
  data: AnschreibenData;
}

export default function AnschreibenPreview({ data }: AnschreibenPreviewProps) {
  const { margins } = data;

  return (
    <div className="w-full flex justify-center py-8 px-4 sm:px-0 bg-[#525659] min-h-screen overflow-x-auto">
      <div
        id="anschreiben-document"
        className="bg-white shadow-2xl transition-all flex-shrink-0"
        style={{
          width: "210mm",
          minHeight: "297mm",
          paddingTop: `${margins?.top ?? 30}mm`,
          paddingBottom: `${margins?.bottom ?? 30}mm`,
          paddingLeft: `${margins?.left ?? 25}mm`,
          paddingRight: `${margins?.right ?? 20}mm`,
          boxSizing: "border-box",
        }}
      >
        <div className="flex h-full flex-col font-sans text-[#1a1a1a] leading-[1.4] text-[10pt]">
          {/* Sender Top (Name/Address) - Matching PDF precisely */}
          <div className="w-full text-right mb-[20pt]">
            <p className="text-[11pt] font-semibold text-[#3d3d3d]">{data.senderName}</p>
            <p>{data.senderStreet}</p>
            <p>{data.senderCity}</p>
          </div>

          {/* Address Row (Recipient + Sender Contact) */}
          <div className="flex justify-between items-start mb-[40pt]">
            <div className="w-[55%] space-y-0.5">
              <p>{data.recipientCompany}</p>
              <p>{data.recipientDepartment}</p>
              <p>{data.recipientStreet}</p>
              <p>{data.recipientCity}</p>
            </div>
            <div className="w-[45%] text-right space-y-0.5">
              <p className="text-[9.5pt]">Telefon: {data.senderPhone}</p>
              <p className="text-[9.5pt]">
                E-Mail: <span className="text-[#3d3d3d]">{data.senderEmail}</span>
              </p>
            </div>
          </div>

          {/* Date */}
          <div className="text-right mb-[24pt] text-[#3d3d3d]">
            {data.date}
          </div>

          {/* Subject */}
          <div className="mb-[20pt]">
            <h2 className="text-[12pt] font-bold text-gray-900">
              {data.subject}
            </h2>
          </div>

          {/* Content */}
          <div className="flex-1">
            <p className="mb-[16pt] text-gray-800">{data.salutation}</p>
            
            <div className="space-y-[10pt]">
              {data.paragraphs.map((para, i) => (
                <p key={i} className="text-justify leading-[1.4]">{para}</p>
              ))}
            </div>
          </div>

          {/* Closing Area */}
          <div className="mt-[16pt]">
            <p className="text-gray-800 mb-[8pt]">{data.closing}</p>
            <p className="font-medium text-gray-900 mb-[8pt]">{data.senderNameClosing}</p>
            
            <div className="mt-2">
              {data.signature ? (
                <img 
                  src={data.signature} 
                  alt="Unterschrift" 
                  className="h-[50pt] w-[160pt] object-contain" 
                />
              ) : (
                <p className="text-[24pt] font-serif italic text-gray-800 leading-none">
                  {data.senderNameClosing}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
