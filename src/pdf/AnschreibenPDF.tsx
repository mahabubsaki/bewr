import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type { AnschreibenData } from "../data/defaultData";
import {
  DEFAULT_EDITOR_FONT_SETTINGS,
  type DocumentFontId,
} from "../lib/fontConfig";
import { getPdfDocumentFontFamily, registerPdfFonts } from "./pdfFonts";

registerPdfFonts();

const ACCENT = "#3d3d3d";

const s = StyleSheet.create({
  page: {
    fontSize: 10,
    lineHeight: 1.4,
    color: "#1a1a1a",
  },
  senderTop: {
    width: "100%",
    textAlign: "right",
    marginBottom: 20,
    lineHeight: 1,
  },
  addressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 40,
  },
  senderName: {
    fontSize: 11,
    fontWeight: 600,
    color: ACCENT,
  },
  senderContact: {
    fontSize: 9.5,
  },
  email: {
    color: ACCENT,
  },
  recipient: {
    width: "55%",
    lineHeight: 1,
  },
  senderBottom: {
    width: "45%",
    textAlign: "right",
    lineHeight: 1,
  },
  date: {
    textAlign: "right",
    marginBottom: 24,
    color: ACCENT,
  },
  subject: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 20,
  },
  salutation: {
    marginBottom: 16,
  },
  paragraph: {
    marginBottom: 10,
    textAlign: "justify",
    lineHeight: 1,
  },
  closing: {
    marginBottom: 8,
  },
  senderClosing: {
    fontWeight: 500,
    marginBottom: 8,
  },
  sigText: {
    fontFamily: "DancingScript",
    fontSize: 24,
    color: "#1a1a1a",
  },
  sigImage: {
    width: 160,
    height: 50,
    objectFit: "contain",
  },
});

interface Props {
  data: AnschreibenData;
  fontId?: DocumentFontId;
}

const AnschreibenPDF = ({
  data,
  fontId = DEFAULT_EDITOR_FONT_SETTINGS.fontId,
}: Props) => {
  const documentFontFamily = getPdfDocumentFontFamily(fontId);

  return (
    <Document>
      <Page
        size="A4"
        style={{
          ...s.page,
          fontFamily: documentFontFamily,
          paddingTop: `${data.margins.top}mm`,
          paddingBottom: `${data.margins.bottom}mm`,
          paddingLeft: `${data.margins.left}mm`,
          paddingRight: `${data.margins.right}mm`,
        }}
      >
      {/* Sender Top (Name/Address) */}
      <View style={s.senderTop}>
        <Text style={s.senderName}>{data.sender.name}</Text>
        <Text>
          {data.sender.street}, {data.sender.city}
        </Text>
      </View>

      {/* Address Row (Recipient + Sender Contact) */}
      <View style={s.addressRow}>
        <View style={s.recipient}>
          <Text>{data.recipientCompany}</Text>
          <Text>{data.recipientDepartment}</Text>
          <Text>{data.recipientStreet}</Text>
          <Text>{data.recipientCity}</Text>
        </View>
        <View style={s.senderBottom}>
          <Text style={s.senderContact}>Telefon: {data.sender.phone}</Text>
          <Text style={s.senderContact}>
            E-Mail: <Text style={s.email}>{data.sender.email}</Text>
          </Text>
        </View>
      </View>

      {/* Date */}
      <Text style={s.date}>{data.date}</Text>

      {/* Subject */}
      <Text style={s.subject}>Betreff: {data.subject}</Text>

      {/* Salutation */}
      <Text style={s.salutation}>{data.salutation}</Text>

      {/* Body */}
      {data.paragraphs.map((para, i) => (
        <Text key={i} style={s.paragraph}>
          {para}
        </Text>
      ))}

      {/* Closing */}
      <Text style={s.closing}>{data.closing}</Text>
      <Text style={s.senderClosing}>{data.senderNameClosing}</Text>

      {/* Signature */}
      {data.signature ? (
        <Image src={data.signature} style={s.sigImage} />
      ) : (
        <Text style={s.sigText}>{data.senderNameClosing}</Text>
      )}
      </Page>
    </Document>
  );
};

export default AnschreibenPDF;
