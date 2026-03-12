import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Link,
  Image,
} from "@react-pdf/renderer";
import type { LebenslaufData } from "../data/defaultData";

// Import local Roboto fonts
import RobotoLight from "../assets/font/roboto/Roboto-Light.ttf";
import RobotoRegular from "../assets/font/roboto/Roboto-Regular.ttf";
import RobotoMedium from "../assets/font/roboto/Roboto-Medium.ttf";
import RobotoBold from "../assets/font/roboto/Roboto-Bold.ttf";
// Register Dancing Script from URL (still needed for signature unless user provides local file)
const DANCING_SCRIPT_URL =
  "https://fonts.gstatic.com/s/dancingscript/v8/DK0eTGXiZjN6yA8zAEyM2S5FJMZltoAAwO2fP7iHu2o.ttf";

// Register Roboto font (local TTF files)
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

// Disable hyphenation
Font.registerHyphenationCallback((word) => [word]);

const ACCENT = "#3d3d3d";
const TEXT_LIGHT = "#555";
const LABEL_WIDTH = 145;

const s = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    fontSize: 10,
    lineHeight: 1.25,
    color: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: ACCENT,
    letterSpacing: 1,
  },
  photo: {
    width: 100,
    height: 125,
    objectFit: "cover",
  },
  section: {
    marginBottom: 10,
    break: false,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: ACCENT,
    borderBottomWidth: 2,
    borderBottomColor: "#bbb",
    borderBottomStyle: "solid",
    paddingBottom: 3,
    marginBottom: 8,
  },
  // Table row
  tableRow: {
    flexDirection: "row",
    paddingVertical: 2,
  },
  label: {
    width: LABEL_WIDTH,
    color: TEXT_LIGHT,
    fontSize: 9.5,
    flexShrink: 0,
    paddingRight: 20,
  },
  value: {
    flex: 1,
    fontSize: 10,
  },
  // About
  about: {
    fontSize: 9.5,
    lineHeight: 1.6,
  },
  // Entry (projects, experience, education)
  entry: {
    flexDirection: "row",
    marginBottom: 10,
  },
  entryPeriod: {
    width: LABEL_WIDTH,
    flexShrink: 0,
    fontSize: 9.5,
    color: TEXT_LIGHT,
    paddingRight: 20,
    paddingTop: 1,
  },
  entryDetails: {
    flex: 1,
    fontSize: 10,
  },
  entryTitle: {
    fontWeight: 700,
    fontSize: 10,
  },
  url: {
    fontSize: 9,
    color: TEXT_LIGHT,
  },
  // Bullet list
  bulletItem: {
    flexDirection: "row",
    marginTop: 1,
    paddingLeft: 2,
    marginLeft: -2,
  },
  bulletDot: {
    width: 12,
    fontSize: 11,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
  },
  // Signature
  signature: {
    marginTop: 40,
  },
  sigLocation: {
    fontSize: 10,
    marginBottom: 8,
  },
  sigCity: {
    color: ACCENT,
  },
  sigText: {
    fontFamily: "DancingScript",
    fontSize: 28,
    color: "#1a1a1a",
  },
  sigImage: {
    width: 200,
    height: 60,
    objectFit: "contain",
  },
  link: {
    color: "#1a1a1a",
    textDecoration: "none",
  },
});

const isUrl = (text: string) => /^https?:\/\//.test(text);

const UrlOrText = ({ children }: { children: string }) => {
  if (isUrl(children)) {
    return (
      <Link src={children} style={s.link}>
        {children}
      </Link>
    );
  }
  return <Text>{children}</Text>;
};

const BulletList = ({ items }: { items: string[] }) => (
  <View>
    {items.map((item, i) => (
      <View key={i} style={s.bulletItem} wrap={false}>
        <Text style={s.bulletDot}>•</Text>
        <Text style={s.bulletText}>{item}</Text>
      </View>
    ))}
  </View>
);

interface Props {
  data: LebenslaufData;
  activeSections?: string[];
}

const LebenslaufPDF = ({ data, activeSections }: Props) => {
  const show = (id: string) => !activeSections || activeSections.includes(id);

  return (
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
        wrap
      >
        {/* Header */}
        <View style={s.header} fixed={false}>
          <Text style={s.title}>Lebenslauf</Text>
          {data.personalInfo.photo ? (
            <Image src={data.personalInfo.photo} style={s.photo} />
          ) : (
            <View style={[s.photo, { backgroundColor: "#ffffff" }]} />
          )}
        </View>

        {/* Persönliche Daten */}
        {show("personal") && (
          <View style={s.section} wrap={false}>
            <Text style={s.sectionTitle}>
              {data.sectionTitles?.personal || "Persönliche Daten"}
            </Text>
            <View style={s.tableRow} wrap={false}>
              <Text style={s.label}>Name</Text>
              <Text style={s.value}>{data.personalInfo.name}</Text>
            </View>
            <View style={s.tableRow} wrap={false}>
              <Text style={s.label}>Adresse</Text>
              <View style={s.value}>
                <Text>{data.personalInfo.street}</Text>
                <Text>{data.personalInfo.city}</Text>
              </View>
            </View>
            <View style={s.tableRow} wrap={false}>
              <Text style={s.label}>Telefon</Text>
              <Text style={s.value}>{data.personalInfo.phone}</Text>
            </View>
            <View style={s.tableRow} wrap={false}>
              <Text style={s.label}>E-Mail</Text>
              <Text style={s.value}>{data.personalInfo.email}</Text>
            </View>
            {(data.personalFields || []).map((field, i) => (
              <View key={i} style={s.tableRow} wrap={false}>
                <Text style={s.label}>{field.label}</Text>
                <Text style={s.value}>
                  <UrlOrText>{field.value}</UrlOrText>
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Über mich */}
        {show("about") && (
          <View style={s.section} wrap={false}>
            <Text style={s.sectionTitle}>
              {data.sectionTitles?.about || "Über mich"}
            </Text>
            <Text style={s.about}>{data.aboutMe}</Text>
          </View>
        )}

        {/* IT-Kenntnisse */}
        {show("skills") && (
          <View style={s.section} wrap={false}>
            <Text style={s.sectionTitle}>
              {data.sectionTitles?.skills || "IT-Kenntnisse"}
            </Text>
            {data.skills.map((skill, i) => (
              <View key={i} style={s.tableRow} wrap={false}>
                <Text style={s.label}>{skill.category}</Text>
                <Text style={s.value}>{skill.items}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Projekte */}
        {show("projects") && (
          <View style={s.section}>
            <View wrap={false}>
              <Text style={s.sectionTitle}>
                {data.sectionTitles?.projects || "Projekte"}
              </Text>
              {data.projects.length > 0 && (
                <View style={s.entry} wrap={false}>
                  <Text style={s.entryPeriod}>{data.projects[0].period}</Text>
                  <View style={s.entryDetails}>
                    <Text style={s.entryTitle}>{data.projects[0].title}</Text>
                    <Link src={data.projects[0].url} style={s.url}>
                      {data.projects[0].url}
                    </Link>
                    <BulletList items={data.projects[0].bullets} />
                  </View>
                </View>
              )}
            </View>
            {data.projects.slice(1).map((p, i) => (
              <View key={i} style={s.entry} wrap={false}>
                <Text style={s.entryPeriod}>{p.period}</Text>
                <View style={s.entryDetails}>
                  <Text style={s.entryTitle}>{p.title}</Text>
                  <Link src={p.url} style={s.url}>
                    {p.url}
                  </Link>
                  <BulletList items={p.bullets} />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Berufserfahrung */}
        {show("experience") && (
          <View style={s.section}>
            <View wrap={false}>
              <Text style={s.sectionTitle}>
                {data.sectionTitles?.experience || "Berufserfahrung"}
              </Text>
              {data.experience.length > 0 && (
                <View style={s.entry} wrap={false}>
                  <Text style={s.entryPeriod}>{data.experience[0].period}</Text>
                  <View style={s.entryDetails}>
                    <Text>
                      <Text style={s.entryTitle}>
                        {data.experience[0].company}
                      </Text>{" "}
                      <Link src={data.experience[0].url} style={s.url}>
                        ({data.experience[0].url})
                      </Link>
                    </Text>
                    <Text>{data.experience[0].role}</Text>
                    <BulletList items={data.experience[0].bullets} />
                  </View>
                </View>
              )}
            </View>
            {data.experience.slice(1).map((e, i) => (
              <View key={i} style={s.entry} wrap={false}>
                <Text style={s.entryPeriod}>{e.period}</Text>
                <View style={s.entryDetails}>
                  <Text>
                    <Text style={s.entryTitle}>{e.company}</Text>{" "}
                    <Link src={e.url} style={s.url}>
                      ({e.url})
                    </Link>
                  </Text>
                  <Text>{e.role}</Text>
                  <BulletList items={e.bullets} />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Ausbildung */}
        {show("education") && (
          <View style={s.section}>
            <View wrap={false}>
              <Text style={s.sectionTitle}>
                {data.sectionTitles?.education || "Ausbildung"}
              </Text>
              {data.education.length > 0 && (
                <View style={s.entry} wrap={false}>
                  <Text style={s.entryPeriod}>{data.education[0].period}</Text>
                  <View style={s.entryDetails}>
                    <Text style={s.entryTitle}>
                      {data.education[0].institution}
                    </Text>
                    <Text>{data.education[0].degree}</Text>
                    <BulletList items={data.education[0].bullets} />
                  </View>
                </View>
              )}
            </View>
            {data.education.slice(1).map((e, i) => (
              <View key={i} style={s.entry} wrap={false}>
                <Text style={s.entryPeriod}>{e.period}</Text>
                <View style={s.entryDetails}>
                  <Text style={s.entryTitle}>{e.institution}</Text>
                  <Text>{e.degree}</Text>
                  <BulletList items={e.bullets} />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Kenntnisse und Interessen */}
        {show("interests") && (
          <View style={s.section} wrap={false}>
            <Text style={s.sectionTitle}>
              {data.sectionTitles?.interests || "Kenntnisse und Interessen"}
            </Text>
            <View style={s.tableRow} wrap={false}>
              <Text style={s.label}>
                {data.languagesLabel || "Fremdsprachen"}
              </Text>
              <View style={s.value}>
                {data.languages.map((lang, i) => (
                  <Text key={i}>
                    {lang.name} ({lang.level})
                  </Text>
                ))}
              </View>
            </View>
            <View style={s.tableRow} wrap={false}>
              <Text style={s.label}>Hobbys</Text>
              <Text style={s.value}>{data.hobbys}</Text>
            </View>
          </View>
        )}

        {/* Signature */}
        <View style={s.signature} wrap={false}>
          <Text style={s.sigLocation}>
            <Text style={s.sigCity}>
              {data.signatureCity || data.personalInfo.city}
            </Text>
            <Text>, den {data.signatureDate}</Text>
          </Text>
          {data.signature ? (
            <Image src={data.signature} style={s.sigImage} />
          ) : (
            <Text style={s.sigText}>
              {data.personalInfo.name || "Unterschrift"}
            </Text>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default LebenslaufPDF;
