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
