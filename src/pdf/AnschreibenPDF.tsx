import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import type { AnschreibenData } from "../data/defaultData";

// Import local Roboto fonts
import RobotoLight from "../assets/font/roboto/Roboto-Light.ttf";
import RobotoRegular from "../assets/font/roboto/Roboto-Regular.ttf";
import RobotoMedium from "../assets/font/roboto/Roboto-Medium.ttf";
import RobotoBold from "../assets/font/roboto/Roboto-Bold.ttf";

// Register Dancing Script from URL (still needed for signature unless user provides local file)
const DANCING_SCRIPT_URL =
  "https://fonts.gstatic.com/s/dancingscript/v8/DK0eTGXiZjN6yA8zAEyM2S5FJMZltoAAwO2fP7iHu2o.ttf";

// Register Roboto font
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: RobotoLight,
      fontWeight: 300,
    },
    {
      src: RobotoRegular,
      fontWeight: 400,
    },
    {
      src: RobotoMedium,
      fontWeight: 500,
    },
    {
      src: RobotoBold,
      fontWeight: 700,
    },
  ],
});

// Register Dancing Script for signature
Font.register({
  family: "DancingScript",
  src: DANCING_SCRIPT_URL,
});

const ACCENT = "#3d3d3d";

const s = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
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
}

const AnschreibenPDF = ({ data }: Props) => (
  <Document>
    <Page
      size="A4"
      style={{
        ...s.page,
        paddingTop: `${data.margins.top}mm`,
        paddingBottom: `${data.margins.bottom}mm`,
        paddingLeft: `${data.margins.left}mm`,
        paddingRight: `${data.margins.right}mm`,
      }}
    >
      {/* Sender Top (Name/Address) */}
      <View style={s.senderTop}>
        <Text style={s.senderName}>{data.senderName}</Text>
        <Text>{data.senderStreet}</Text>
        <Text>{data.senderCity}</Text>
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
          <Text style={s.senderContact}>Telefon: {data.senderPhone}</Text>
          <Text style={s.senderContact}>
            E-Mail: <Text style={s.email}>{data.senderEmail}</Text>
          </Text>
        </View>
      </View>

      {/* Date */}
      <Text style={s.date}>{data.date}</Text>

      {/* Subject */}
      <Text style={s.subject}>{data.subject}</Text>

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

export default AnschreibenPDF;
