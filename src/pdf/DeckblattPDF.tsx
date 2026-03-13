import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type { DeckblattData } from "../data/defaultData";
import {
  DEFAULT_EDITOR_FONT_SETTINGS,
  type DocumentFontId,
} from "../lib/fontConfig";
import { getPdfDocumentFontFamily, registerPdfFonts } from "./pdfFonts";

registerPdfFonts();

const s = StyleSheet.create({
  page: {
    fontSize: 10,
    color: "#1a1a1a",
  },
  header: {
    backgroundColor: "#f0f0f0",
    paddingTop: 40,
    paddingBottom: 24,
    paddingHorizontal: 40,
    textAlign: "center",
  },
  name: {
    fontSize: 30,
    fontWeight: 600,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  position: {
    fontSize: 14,
    fontWeight: 500,
    color: "#555",
  },
  photoSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
  photo: {
    width: 230,
    height: 300,
    objectFit: "cover",
    borderWidth: 4,
    borderColor: "#eee",
  },
  bottom: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 24,
    paddingHorizontal: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 40,
  },
  bottomSection: {
    flex: 1,
  },
  bottomTitle: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 12,
  },
  contactText: {
    fontSize: 9.5,
    lineHeight: 1.6,
  },
  contactGap: {
    marginTop: 12,
  },
  email: {
    color: "#3d3d3d",
  },
  anlagenItem: {
    flexDirection: "row",
    marginBottom: 2,
  },
  anlagenBullet: {
    width: 12,
    fontSize: 11,
  },
  anlagenText: {
    fontSize: 9.5,
  },
});

interface Props {
  data: DeckblattData;
  fontId?: DocumentFontId;
}

const DeckblattPDF = ({
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
      {/* Header */}
      <View style={s.header}>
        <Text style={s.name}>{data.personal.name}</Text>
        <Text style={s.position}>{data.position}</Text>
      </View>

      {/* Photo */}
      <View style={s.photoSection}>
        {data.personal.photo ? (
          <Image src={data.personal.photo} style={s.photo} />
        ) : (
          <View
            style={{
              width: 230,
              height: 300,
              backgroundColor: "#fafafa",
              borderWidth: 4,
              borderColor: "#eee",
            }}
          />
        )}
      </View>

      {/* Bottom */}
      <View style={s.bottom}>
        <View style={s.bottomSection}>
          <Text style={s.bottomTitle}>
            {data.sectionTitles?.contact || "Kontaktdaten"}
          </Text>
          <Text style={s.contactText}>{data.personal.name}</Text>
          <Text style={s.contactText}>
            {data.personal.street}, {data.personal.city}
          </Text>
          <View style={s.contactGap} />
          <Text style={s.contactText}>Tel.: {data.personal.phone}</Text>
          <Text style={[s.contactText, s.email]}>{data.personal.email}</Text>
        </View>
        <View style={s.bottomSection}>
          <Text style={s.bottomTitle}>
            {data.sectionTitles?.anlagen || "Anlagen"}
          </Text>
          {data.anlagen.map((item, i) => (
            <View key={i} style={s.anlagenItem}>
              <Text style={s.anlagenBullet}>•</Text>
              <Text style={s.anlagenText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>
      </Page>
    </Document>
  );
};

export default DeckblattPDF;
