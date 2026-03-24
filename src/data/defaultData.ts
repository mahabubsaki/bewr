export interface Margins {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export interface PersonalField {
    label: string;
    value: string;
}

export interface Skill {
    category: string;
    items: string;
}

export interface PersonalInfo {
    name: string;
    street: string;
    city: string;
    phone: string;
    email: string;
    photo: string;
}

export interface Project {
    period: string;
    title: string;
    url: string;
    githubUrl?: string;
    bullets: string[];
    technologies?: string;
}

export interface Experience {
    period: string;
    company: string;
    url: string;
    role: string;
    bullets: string[];
}

export interface Education {
    period: string;
    institution: string;
    degree: string;
    bullets: string[];
}

export interface Language {
    name: string;
    level: string;
}

export interface LebenslaufData {
    personalInfo: PersonalInfo;
    personalFields: PersonalField[];
    aboutMe: string;
    skills: Skill[];
    projects: Project[];
    experience: Experience[];
    education: Education[];
    languages: Language[];
    hobbys: string;
    signatureCity: string;
    signatureDate: string;
    signature: string;
    sectionTitles?: Record<string, string>;
    languagesLabel?: string;
    margins: Margins;
}

export interface AnschreibenData {
    sender: PersonalInfo;
    recipientCompany: string;
    recipientDepartment: string;
    recipientStreet: string;
    recipientCity: string;
    date: string;
    subject: string;
    salutation: string;
    paragraphs: string[];
    closing: string;
    senderNameClosing: string;
    signature: string;
    fontSize?: number;
    paragraphSpacing?: number;
    margins: Margins;
}

export interface DeckblattData {
    personal: PersonalInfo;
    position: string;
    anlagen: string[];
    sectionTitles?: {
        contact: string;
        anlagen: string;
    };
    margins: Margins;
}

export interface CertificateFile {
    id: string;
    name: string;
    data: string; // base64
    size: number;
}


export const defaultLebenslauf: LebenslaufData = {
    personalInfo: {
        name: "Max Mustermann",
        street: "Musterstraße 1",
        city: "12345 Musterstadt",
        phone: "0123 / 4567890",
        email: "max.mustermann@example.com",
        photo: "",
    },
    personalFields: [
        { label: "Geburtsdatum", value: "01.01.1998 in Musterstadt" },
        { label: "Portfolio", value: "https://portfolio.example.com" },
        { label: "Github", value: "https://github.com/maxmustermann" },
    ],
    aboutMe:
        "Motivierter und lösungsorientierter Entwickler mit Erfahrung in der Webentwicklung und einem starken Interesse an modernen Technologien. Durch verschiedene Projekte konnte ich bereits fundierte Kenntnisse in JavaScript, React und Backend-Technologien sammeln.",
    skills: [
        { category: "Programmiersprachen", items: "JavaScript, TypeScript, Python, Java" },
        { category: "Frontend", items: "HTML, CSS, React, Vue.js, Tailwind CSS" },
        { category: "Backend", items: "Node.js, Express, REST APIs, PostgreSQL" },
        { category: "Tools & Methoden", items: "Git, Docker, agile Softwareentwicklung (Scrum)" },
    ],
    projects: [
        {
            period: "01/2024 – heute",
            title: "E-Commerce Webanwendung",
            url: "https://ecommerce.example.com",
            bullets: [
                "Entwicklung von Frontend und Backend",
                "Integration eines Payment-Providers",
                "Technologien: React, Node.js, MongoDB",
            ],
        },
        {
            period: "05/2023 – 12/2023",
            title: "Task Management Tool",
            url: "https://tasks.example.com",
            bullets: [
                "Entwicklung einer internen Aufgabenverwaltung",
                "Echtzeit-Aktualisierung via WebSockets",
            ],
        },
    ],
    experience: [
        {
            period: "08/2023 – heute",
            company: "Muster IT Solutions GmbH",
            url: "https://www.muster-it.de",
            role: "Junior Webentwickler",
            bullets: [
                "Entwicklung anspruchsvoller Webanwendungen im agilen Team",
                "Optimierung bestehender Code-Basen",
                "Teilnahme an Code-Reviews und Sprint-Plannings",
            ],
        },
        {
            period: "09/2021 - 07/2023",
            company: "Beispiel Agentur",
            url: "https://www.beispiel-agentur.de",
            role: "Werkstudent Softwareentwicklung",
            bullets: [
                "Unterstützung bei der Erstellung von Kunden-Websites",
                "Testing und Bugfixing von Frontend-Komponenten",
            ],
        },
    ],
    education: [
        {
            period: "09/2018 – 07/2021",
            institution: "Muster-Universität",
            degree: "Bachelor of Science Informatik",
            bullets: ["Schwerpunkt: Software Engineering und Datenbanken", "Abschlussnote: 2,1"],
        },
        {
            period: "08/2010 – 06/2018",
            institution: "Städtisches Gymnasium Musterstadt",
            degree: "Abitur",
            bullets: [
                "Leistungskurse: Mathematik, Informatik",
                "Abschlussnote: 1,8",
            ],
        },
    ],
    languages: [
        { name: "Deutsch", level: "Muttersprache" },
        { name: "Englisch", level: "fließend in Wort und Schrift" },
        { name: "Spanisch", level: "Grundkenntnisse" },
    ],
    hobbys: "Lesen und Sport (Fußball und Jogging)",
    signatureCity: "Gazipur",
    signatureDate: "09.03.2026",
    signature: "",
    sectionTitles: {
        personal: "Persönliche Daten",
        skills: "IT-Kenntnisse",
        projects: "Projekte",
        experience: "Berufserfahrung",
        education: "Ausbildung",
        interests: "Kenntnisse und Interessen",
        about: "Über mich",
    },
    languagesLabel: "Fremdsprachen",
    margins: { top: 25, bottom: 20, left: 25, right: 25 },
};

export const defaultAnschreiben: AnschreibenData = {
    sender: {
        name: "Max Mustermann",
        street: "Musterstraße 1",
        city: "12345 Musterstadt",
        phone: "0123 / 4567890",
        email: "max.mustermann@example.com",
        photo: "",
    },
    recipientCompany: "Musterfirma GmbH",
    recipientDepartment: "z.H. Personalabteilung",
    recipientStreet: "Beispielweg 10",
    recipientCity: "54321 Beispieldorf",
    date: "09.03.2026",
    subject: "Bewerbung als Fachinformatiker für Anwendungsentwicklung",
    salutation: "Sehr geehrte Damen und Herren,",
    paragraphs: [
        "mit großem Interesse habe ich Ihre Stellenanzeige auf Ihrem Karriereportal gelesen. Da ich eine neue Herausforderung in einem innovativen Unternehmen suche und mich Ihre Projekte sehr ansprechen, bewerbe ich mich hiermit um die Position.",
        "Hier beschreibe ich, warum ich diese Ausbildung/Position anstrebe und was mich an der Aufgabe fasziniert.",
        "Hier erkläre ich meine Motivation, mich gerade bei Ihrem Unternehmen zu bewerben.",
        "Hier hebe ich meine bisherigen Erfahrungen und Qualifikationen hervor, die mich für diese Stelle besonders geeignet machen.",
        "Hier erläutere ich, welchen konkreten Nutzen ich für Ihr Unternehmen bringen kann.",
        "Sehr gerne würde ich Sie in einem persönlichen Vorstellungsgespräch – auch in Form eines Videotermins (z. B. über Zoom, Microsoft Teams oder ein anderes Online-Meeting-Portal) – von meiner Motivation und meiner Eignung überzeugen. Über eine Einladung freue ich mich daher sehr.",
    ],
    closing: "Mit freundlichen Grüßen",
    senderNameClosing: "Max Mustermann",
    signature: "",
    fontSize: 10,
    paragraphSpacing: 10,
    margins: { top: 30, bottom: 25, left: 25, right: 25 },
};

export const defaultDeckblatt: DeckblattData = {
    personal: {
        name: "Max Mustermann",
        street: "Musterstraße 1",
        city: "12345 Musterstadt",
        phone: "0123 / 4567890",
        email: "max.mustermann@example.com",
        photo: "",
    },
    position: "Bewerbung als Fachinformatiker",
    anlagen: ["Anschreiben", "Lebenslauf", "Zeugnisse"],
    sectionTitles: {
        contact: "Kontaktdaten:",
        anlagen: "Anlagen:",
    },
    margins: { top: 20, bottom: 15, left: 15, right: 15 },
};

// ── FSJ Lebenslauf Defaults ─────────────────────────────────────

export const defaultFsjLebenslauf: LebenslaufData = {
    personalInfo: {
        name: "Mahabub Hossen Saki",
        street: "Shingh Bari Rd, Tongi West",
        city: "1711 Gazipur, Bangladesch",
        phone: "+8801714269744",
        email: "saki007.ph@gmail.com",
        photo: "",
    },
    personalFields: [
        { label: "Geburtsdatum", value: "04.07.2002" },
        { label: "Geburtsort", value: "Gazipur, Bangladesch" },
        { label: "Familienstand", value: "Ledig" },
    ],
    aboutMe:
        "Ich bin ein zuverlässiger und engagierter Mensch mit großer Freude am Umgang mit Menschen. Durch meine Erfahrung im Kundenservice habe ich gelernt, geduldig zuzuhören, verständlich zu erklären und freundlich auf unterschiedliche Bedürfnisse einzugehen. Für ein Freiwilliges Soziales Jahr bringe ich Motivation, Verantwortungsbewusstsein und die Bereitschaft mit, aktiv zu helfen und neue Erfahrungen im sozialen Bereich zu sammeln.",
    skills: [
        { category: "Soziale Kompetenzen", items: "Teamfähigkeit, Zuverlässigkeit, Geduld im Umgang mit Menschen, Kommunikationsfähigkeit, Hilfsbereitschaft" },
    ],
    projects: [],
    experience: [
        {
            period: "12/2021 – 07/2022",
            company: "",
            url: "",
            role: "Nachhilfelehrer (privat)",
            bullets: [
                "Unterstützung von Schülerinnen und Schülern in verschiedenen Fächern (z. B. Englisch und Mathematik)",
                "Geduldige Erklärung von Lerninhalten und Hausaufgaben",
                "Individuelle Betreuung je nach Lernniveau",
                "Förderung von Motivation und Selbstvertrauen",
            ],
        },
    ],
    education: [
        {
            period: "07/2019 – 12/2021",
            institution: "Shahajuddin Sarker Model School and College",
            degree: "Höheres Sekundarschulzertifikat (HSC) – Wissenschaft",
            bullets: ["Note: 4,83 / 5,00 (sehr gut)"],
        },
        {
            period: "01/2017 – 12/2018",
            institution: "Meher Nigar College",
            degree: "Sekundarschulabschluss (SSC)",
            bullets: ["Note: 4,39 / 5,00 (gut)"],
        },
    ],
    languages: [
        { name: "Bengalisch", level: "Muttersprache" },
        { name: "Englisch", level: "fließend in Wort und Schrift" },
        { name: "Deutsch", level: "B1 (derzeit im B2-Kurs)" },
        { name: "Hindi", level: "fließend" },
    ],
    hobbys: "Musik, Fußball, Wandern, Austausch mit Menschen aus verschiedenen Kulturen",
    signatureCity: "Gazipur",
    signatureDate: "",
    signature: "",
    sectionTitles: {
        personal: "Persönliche Daten",
        about: "Profil (Kurzprofil)",
        experience: "Berufserfahrung",
        education: "Schulbildung",
        interests: "Sprachkenntnisse & Interessen",
        skills: "Soziale Kompetenzen",
        projects: "Projekte",
    },
    languagesLabel: "Sprachkenntnisse",
    margins: { top: 25, bottom: 20, left: 25, right: 25 },
};

// ── FSJ Anschreiben Defaults ────────────────────────────────────

export const defaultFsjAnschreiben: AnschreibenData = {
    sender: {
        name: "Max Mustermann",
        street: "Am Stadtrand 12",
        city: "61250 Usingen",
        phone: "0177 123 456 78",
        email: "beispiel@cvmaker.de",
        photo: "",
    },
    recipientCompany: "Kindertagesstätte Sonnenschein",
    recipientDepartment: "z.H. Frau Müller",
    recipientStreet: "Gartenweg 5",
    recipientCity: "61250 Usingen",
    date: "",
    subject: "Bewerbung um ein Freiwilliges Soziales Jahr im Kindergarten",
    salutation: "Sehr geehrte Frau Müller,",
    paragraphs: [
        "Sie suchen ein Teammitglied, das großen Spaß im Umgang mit Kindern hat? Dann bin ich genau die Richtige! Im Rahmen eines FSJ in Ihrem Kindergarten möchte ich Sie als motivierte und zuverlässige Freiwillige mit abwechslungsreichen Aufgaben unterstützen.",
        "Ich interessiere mich besonders für ein FSJ in Ihrem Kindergarten, weil bei Ihnen die Kinder von klein auf kreativ erzogen werden. Das schätze ich sehr, da ich selbst in meiner Freizeit gerne Klavier spiele. Außerdem tanze und zeichne ich gerne.",
        "Daher würde ich meine Fähigkeiten gerne in Ihrem Kindergarten einsetzen, um die Kreativität der Kinder zu unterstützen. Im Alter von 15 Jahren habe ich bereits als Babysitterin gearbeitet und mich zudem als Nachhilfelehrerin engagiert. So kann ich mit Kindern unterschiedlichsten Alters umgehen.",
        "Zudem bringe ich viel Teamgeist, Durchsetzungsvermögen, Kritikfähigkeit und eine offene Art mit. Dies habe ich bereits während meiner langen Zeit als Mitglied im Tanzsportverein unter Beweis gestellt. Ich bin davon überzeugt, dass diese persönlichen Stärken mich bei meiner Arbeit in der Betreuung sehr weiterbringen werden.",
        "Ich wusste schon immer, dass ich ein FSJ machen möchte, um mich sozial mehr zu engagieren. Die Arbeit mit Kindern ist meiner Meinung nach der beste Weg, um die Gesellschaft langfristig positiv zu verändern.",
        "Ab dem 01.09.2023 kann ich Sie in Ihrer Einrichtung unterstützen. Ich freue mich sehr auf eine Einladung zu einem persönlichen Vorstellungsgespräch.",
    ],
    closing: "Mit freundlichen Grüßen",
    senderNameClosing: "Max Mustermann",
    signature: "",
    fontSize: 10,
    paragraphSpacing: 10,
    margins: { top: 30, bottom: 25, left: 25, right: 25 },
};
