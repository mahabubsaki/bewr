import type { AnschreibenData } from "../data/defaultData";
import { getBrowserDocumentFontFamily, type DocumentFontId } from "../lib/fontConfig";

interface AnschreibenPreviewProps {
  data: AnschreibenData;
  fontId: DocumentFontId;
}

export default function AnschreibenPreview({ data, fontId }: AnschreibenPreviewProps) {
  if (!data?.sender) {
    return (
      <div className="w-full flex justify-center items-start h-100 pt-4 sm:pt-8 bg-transparent overflow-visible">
        <div className="bg-white shadow-2xl w-[210mm] h-[297mm] flex items-center justify-center text-slate-400">
          Initialisierung...
        </div>
      </div>
    );
  }
  const { margins } = data;
  const baseFontSize = data.fontSize ?? 10;
  const fontScale = baseFontSize / 10;
  const scalePt = (value: number) => `${value * fontScale}pt`;
  const paragraphSpacing = data.paragraphSpacing ?? 10;

  return (
    <div className="w-full flex justify-center items-start h-100 pt-4 sm:pt-8 bg-transparent overflow-visible">
      <div
        id="anschreiben-document"
        className="bg-white shadow-2xl transition-all shrink-0 origin-top scale-[0.32] xs:scale-[0.42] sm:scale-[0.55] md:scale-[0.7] lg:scale-[0.85] xl:scale-[0.95] 2xl:scale-100 mb-32"
        style={{
          width: "210mm",
          minHeight: "297mm",
          height: "auto",
          paddingTop: `${margins?.top ?? 30}mm`,
          paddingBottom: `${margins?.bottom ?? 30}mm`,
          paddingLeft: `${margins?.left ?? 25}mm`,
          paddingRight: `${margins?.right ?? 20}mm`,
          boxSizing: "border-box",
        }}
      >
        <div
          className="flex h-full flex-col text-[#1a1a1a] leading-[1.4]"
          style={{ fontFamily: getBrowserDocumentFontFamily(fontId), fontSize: scalePt(10) }}
        >
          {/* Sender Top (Name/Address) - Matching PDF precisely */}
          <div className="w-full text-right mb-[20pt]">
            <p className="font-semibold text-[#3d3d3d]" style={{ fontSize: scalePt(11) }}>
              {data.sender.name}
            </p>
            <p>{data.sender.street}</p>
            <p>{data.sender.city}</p>
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
              <p style={{ fontSize: scalePt(9.5) }}>Telefon: {data.sender.phone}</p>
              <p style={{ fontSize: scalePt(9.5) }}>
                E-Mail:{" "}
                <span className="text-[#3d3d3d]">{data.sender.email}</span>
              </p>
            </div>
          </div>

          {/* Date */}
          <div className="text-right mb-8 text-[#3d3d3d]">{data.date}</div>

          {/* Subject */}
          <div className="mb-[20pt]">
            <h2 className="font-bold text-gray-900" style={{ fontSize: scalePt(12) }}>
              Betreff: {data.subject}
            </h2>
          </div>

          {/* Content */}
          <div className="flex-1">
            <p className="mb-[16pt] text-gray-800">{data.salutation}</p>

            <div>
              {data.paragraphs.map((para, i) => (
                <p
                  key={i}
                  className="text-justify leading-[1.4]"
                  style={{ marginBottom: i === data.paragraphs.length - 1 ? 0 : `${paragraphSpacing}pt` }}
                >
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* Closing Area */}
          <div className="mt-[16pt]">
            <p className="text-gray-800 mb-[8pt]">{data.closing}</p>
            <p className="font-medium text-gray-900 mb-[8pt]">
              {data.senderNameClosing}
            </p>

            <div className="mt-2">
              {data.signature ? (
                <img
                  src={data.signature}
                  alt="Unterschrift"
                  className="h-[50pt] w-[160pt] object-contain"
                />
              ) : (
                <p
                  className="font-serif italic text-gray-800 leading-none"
                  style={{ fontSize: scalePt(24) }}
                >
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
