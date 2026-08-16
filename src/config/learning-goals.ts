export interface SubGoalItem {
  id: string;
  titleTr: string;
  titleEn: string;
  category?: string;
}

export interface GoalTrack {
  id: string;
  code: "academic" | "language" | "coding_tech" | "custom_hub" | "general_knowledge";
  titleTr: string;
  titleEn: string;
  descTr: string;
  descEn: string;
  icon: string;
  color: string;
  badgeTr: string;
  badgeEn: string;
  subGoals: SubGoalItem[];
}

// -------------------------------------------------------------
// 1. GRANULAR CURRICULUM ARCHITECTURE (Tek Tek Sınıf & 3 Ana Ders Grubu)
// -------------------------------------------------------------
export interface GranularCountryCurriculum {
  countryCode: "TR" | "US" | "UK" | "DE" | "GLOBAL_IB";
  countryName: string;
  flag: string;
  systemTitle: string;
  grades: string[];
  categories: {
    "Genel Dersler": string[];
    "Seçmeli Dersler": string[];
    "Bölüm / Meslek / Uzmanlık": string[];
  };
}

export const GRANULAR_CURRICULUM_DATA: Record<string, GranularCountryCurriculum> = {
  TR: {
    countryCode: "TR",
    countryName: "Türkiye (MEB)",
    systemTitle: "MEB & ÖSYM Standartları",
    flag: "🇹🇷",
    grades: [
      "1. Sınıf",
      "2. Sınıf",
      "3. Sınıf",
      "4. Sınıf",
      "5. Sınıf",
      "6. Sınıf",
      "7. Sınıf",
      "8. Sınıf (LGS Hazırlık)",
      "9. Sınıf",
      "10. Sınıf",
      "11. Sınıf (YKS Temel)",
      "12. Sınıf (YKS / AYT)",
      "Mezun / Sınava Hazırlık",
      "Üniversite (Lisans/Önlisans)",
    ],
    categories: {
      "Genel Dersler": [
        "Matematik",
        "Geometri",
        "Fizik",
        "Kimya",
        "Biyoloji",
        "Türkçe / Edebiyat",
        "Tarih",
        "Coğrafya",
        "Fen Bilimleri",
        "Sosyal Bilgiler",
        "T.C. İnkılap Tarihi",
      ],
      "Seçmeli Dersler": [
        "Din Kültürü ve Ahlak Bilgisi",
        "Felsefe",
        "Mantık",
        "Sosyoloji",
        "Psikoloji",
        "Astronomi ve Uzay Bilimleri",
        "Medya Okuryazarlığı",
        "Demokrasi ve İnsan Hakları",
        "Sanat Tarihi & Görsel Sanatlar",
        "Müzik & Diksiyon",
      ],
      "Bölüm / Meslek / Uzmanlık": [
        "Bilişim & Yazılım Geliştirme",
        "Yapay Zeka ve Veri Tabanı",
        "Muhasebe, Finans & Ekonomi",
        "Makine, Mekatronik & Elektrik",
        "Sağlık Hizmetleri & Anatomi",
        "Grafik Tasarım & Animasyon",
        "Hukuk & Adalet Temelleri",
        "Girişimcilik ve Pazarlama",
      ],
    },
  },

  US: {
    countryCode: "US",
    countryName: "United States (US)",
    systemTitle: "K-12, AP & Common Core",
    flag: "🇺🇸",
    grades: [
      "1st Grade",
      "2nd Grade",
      "3rd Grade",
      "4th Grade",
      "5th Grade",
      "6th Grade",
      "7th Grade",
      "8th Grade",
      "9th Grade (Freshman)",
      "10th Grade (Sophomore)",
      "11th Grade (Junior / SAT)",
      "12th Grade (Senior / AP)",
      "College / University",
    ],
    categories: {
      "Genel Dersler": [
        "Algebra I & II",
        "Geometry",
        "Pre-Calculus",
        "AP Calculus AB/BC",
        "AP Statistics",
        "Biology / AP Biology",
        "Chemistry / AP Chemistry",
        "Physics 1, 2 & C",
        "US History / AP US History",
        "English Language & Composition",
      ],
      "Seçmeli Dersler": [
        "World History & Geography",
        "AP Human Geography",
        "US Government & Politics",
        "Psychology / AP Psychology",
        "Sociology",
        "Creative Writing & Literature",
        "Environmental Science / AP Env.",
        "Philosophy & Ethics",
      ],
      "Bölüm / Meslek / Uzmanlık": [
        "AP Computer Science A (Java)",
        "AP Computer Science Principles",
        "Macroeconomics & Microeconomics",
        "Business & Financial Accounting",
        "Health Science & Physiology",
        "Engineering Principles & CAD",
        "Digital Media & Web Design",
        "Business Law & Management",
      ],
    },
  },

  UK: {
    countryCode: "UK",
    countryName: "United Kingdom (UK)",
    systemTitle: "National Curriculum & GCSE/A-Levels",
    flag: "🇬🇧",
    grades: [
      "Year 7 (Key Stage 3)",
      "Year 8 (Key Stage 3)",
      "Year 9 (Key Stage 3)",
      "Year 10 (GCSE Year 1)",
      "Year 11 (GCSE Final)",
      "Year 12 (A-Levels / AS)",
      "Year 13 (A-Levels Final)",
      "Higher Education",
    ],
    categories: {
      "Genel Dersler": [
        "GCSE Mathematics",
        "A-Level Pure Mathematics",
        "A-Level Further Mathematics",
        "Biology (GCSE & A-Level)",
        "Chemistry (Organic & Physical)",
        "Physics (Mechanics & Quantum)",
        "English Language & Literature",
      ],
      "Seçmeli Dersler": [
        "History (British & European)",
        "Geography",
        "Psychology",
        "Sociology",
        "Religious Studies & Ethics",
        "Media & Communication Studies",
        "Philosophy",
      ],
      "Bölüm / Meslek / Uzmanlık": [
        "Computer Science & Python",
        "Economics & Econometrics",
        "Business Studies & Accounting",
        "Law & Legal Foundations",
        "Design and Technology",
        "Health & Social Care",
      ],
    },
  },

  DE: {
    countryCode: "DE",
    countryName: "Deutschland (DE)",
    systemTitle: "Gymnasium & Abiturprüfung",
    flag: "🇩🇪",
    grades: [
      "Klasse 5",
      "Klasse 6",
      "Klasse 7",
      "Klasse 8",
      "Klasse 9",
      "Klasse 10",
      "Klasse 11 (Oberstufe)",
      "Klasse 12 (Abitur)",
      "Klasse 13 (Abitur G9)",
      "Universität / Hochschule",
    ],
    categories: {
      "Genel Dersler": [
        "Mathematik (Analysis & Geometrie)",
        "Physik",
        "Chemie",
        "Biologie",
        "Deutsch (Textanalyse & Grammatik)",
        "Geschichte",
        "Geographie / Erdkunde",
      ],
      "Seçmeli Dersler": [
        "Philosophie",
        "Ethik / Religion",
        "Sozialkunde / Politik",
        "Kunst / Musikwissenschaft",
        "Fremdsprachen (Englisch / Französisch)",
        "Psychologie",
      ],
      "Bölüm / Meslek / Uzmanlık": [
        "Informatik & Algorithmen",
        "Wirtschaft und Recht",
        "Betriebswirtschaftslehre (BWL)",
        "Volkswirtschaftslehre (VWL)",
        "Technik & Mechatronik",
        "Gesundheitswissenschaften",
      ],
    },
  },

  GLOBAL_IB: {
    countryCode: "GLOBAL_IB",
    countryName: "Global / IB",
    systemTitle: "International Baccalaureate (MYP & DP)",
    flag: "🌐",
    grades: [
      "MYP Year 4",
      "MYP Year 5",
      "IB Diploma Year 1 (DP 1)",
      "IB Diploma Year 2 (DP 2)",
      "International University Prep",
    ],
    categories: {
      "Genel Dersler": [
        "Mathematics: Analysis & Approaches",
        "Mathematics: Applications & Interp.",
        "Physics (HL/SL)",
        "Chemistry (HL/SL)",
        "Biology (HL/SL)",
        "English A: Language & Literature",
      ],
      "Seçmeli Dersler": [
        "History (HL/SL)",
        "Global Politics (HL/SL)",
        "Psychology (HL/SL)",
        "Philosophy (HL/SL)",
        "Theory of Knowledge (TOK)",
        "Environmental Systems & Societies",
      ],
      "Bölüm / Meslek / Uzmanlık": [
        "Computer Science (HL/SL)",
        "Economics (HL/SL)",
        "Business Management (HL/SL)",
        "Design Technology",
        "Sports & Exercise Health Science",
      ],
    },
  },
};

// -------------------------------------------------------------
// 2. LANGUAGE LEARNING (GLOBAL / CEFR LEVELS A1 - C2)
// -------------------------------------------------------------
export interface LanguageTarget {
  id: string;
  name: string;
  flag: string;
  levels: { id: string; code: string; label: string; desc: string }[];
}

export const LANGUAGE_TARGETS: LanguageTarget[] = [
  {
    id: "english",
    name: "İngilizce (English)",
    flag: "🇬🇧",
    levels: [
      { id: "en_a1", code: "A1", label: "Başlangıç (Beginner)", desc: "Temel kelimeler ve basit cümleler" },
      { id: "en_a2", code: "A2", label: "Temel (Elementary)", desc: "Günlük diyaloglar ve temel zamanlar" },
      { id: "en_b1", code: "B1", label: "Orta (Intermediate)", desc: "Akıcı seyahat ve okul İngilizcesi" },
      { id: "en_b2", code: "B2", label: "İleri Orta (Upper Int.)", desc: "Haberler, tartışmalar ve IELTS 6.0" },
      { id: "en_c1", code: "C1", label: "İleri (Advanced)", desc: "Akademik makaleler ve IELTS 7.5+" },
      { id: "en_c2", code: "C2", label: "Yetkin (Mastery)", desc: "Ana dil seviyesi" },
    ],
  },
  {
    id: "german",
    name: "Almanca (Deutsch)",
    flag: "🇩🇪",
    levels: [
      { id: "de_a1", code: "A1", label: "A1 - Start Deutsch 1", desc: "Temel tanışma ve günlük ifadeler" },
      { id: "de_a2", code: "A2", label: "A2 - Temel İletişim", desc: "Günlük rutinler ve basit gramer" },
      { id: "de_b1", code: "B1", label: "B1 - Goethe Zertifikat B1", desc: "Bağımsız dil kullanımı & vize seviyesi" },
      { id: "de_b2", code: "B2", label: "B2 - İleri Almanca & İş", desc: "Mesleki Almanca ve akıcı konuşma" },
      { id: "de_c1", code: "C1", label: "C1 - TestDaF / Üniversite", desc: "Almanya üniversite akademik seviye" },
      { id: "de_c2", code: "C2", label: "C2 - GDS Büyük Dil Diploması", desc: "Kusursuz akademik hakimiyet" },
    ],
  },
  {
    id: "spanish",
    name: "İspanyolca (Español)",
    flag: "🇪🇸",
    levels: [
      { id: "es_a1", code: "A1", label: "A1 - Acceso", desc: "Temel kelimeler ve tanışma" },
      { id: "es_a2", code: "A2", label: "A2 - Plataforma", desc: "Günlük diyaloglar ve geçmiş zaman" },
      { id: "es_b1", code: "B1", label: "B1 - Umbral", desc: "Seyahat ve akıcı sokak İspanyolcası" },
      { id: "es_b2", code: "B2", label: "B2 - Avanzado (DELE B2)", desc: "Akıcı tartışma ve iş İspanyolcası" },
      { id: "es_c1", code: "C1", label: "C1 - Dominio Operativo", desc: "Kültürel ve akademik tam hakimiyet" },
      { id: "es_c2", code: "C2", label: "C2 - Maestría", desc: "Ana dil yetkinliği" },
    ],
  },
  {
    id: "french",
    name: "Fransızca (Français)",
    flag: "🇫🇷",
    levels: [
      { id: "fr_a1", code: "A1", label: "A1 - DELF A1", desc: "Temel Fransızca ve telaffuz" },
      { id: "fr_a2", code: "A2", label: "A2 - DELF A2", desc: "Temel konuşma ve günlük yaşam" },
      { id: "fr_b1", code: "B1", label: "B1 - DELF B1", desc: "Seyahat ve kendini ifade etme" },
      { id: "fr_b2", code: "B2", label: "B2 - DELF B2", desc: "Üniversite & profesyonel Fransızca" },
      { id: "fr_c1", code: "C1", label: "C1 - DALF C1", desc: "Akademik seviye ve serbest makale" },
      { id: "fr_c2", code: "C2", label: "C2 - DALF C2", desc: "Kusursuz edebi hakimiyet" },
    ],
  },
];

// -------------------------------------------------------------
// 3. CODING & SOFTWARE DEVELOPMENT (GLOBAL / LANGUAGE & LEVEL)
// -------------------------------------------------------------
export interface CodingLanguage {
  id: string;
  name: string;
  icon: string;
  levels: { id: string; label: string; desc: string; focusTopics: string[] }[];
}

export const CODING_LANGUAGES: CodingLanguage[] = [
  {
    id: "python",
    name: "Python",
    icon: "🐍",
    levels: [
      { id: "py_beg", label: "Başlangıç (Beginner)", desc: "Sözdizimi, değişkenler, döngüler ve fonksiyonlar", focusTopics: ["Syntax", "Loops", "Lists & Dicts", "Functions"] },
      { id: "py_mid", label: "Orta (Intermediate / OOP)", desc: "OOP sınıflar, dosya I/O, list comprehensions", focusTopics: ["OOP", "File I/O", "List Comprehensions", "Error Handling"] },
      { id: "py_adv", label: "İleri (Advanced / Algorithms & AI)", desc: "Veri yapıları, LeetCode, Pandas/Numpy, API", focusTopics: ["DSA / LeetCode", "FastAPI / Flask", "Data Science & AI", "Decorators & Generators"] },
    ],
  },
  {
    id: "javascript_ts",
    name: "JavaScript & TypeScript",
    icon: "⚡",
    levels: [
      { id: "js_beg", label: "Başlangıç (Beginner / DOM)", desc: "JS temelleri, DOM manipülasyonu, ES6 metodları", focusTopics: ["ES6 Syntax", "DOM Events", "Array Methods (map/filter)", "Functions"] },
      { id: "js_mid", label: "Orta (Intermediate / React & Async)", desc: "Promises, Async/Await, React Hooks, TypeScript", focusTopics: ["Async/Await", "React Hooks", "TypeScript Interfaces", "REST APIs"] },
      { id: "js_adv", label: "İleri (Advanced / Next.js & Systems)", desc: "Next.js SSR/App Router, Node.js mimarisi, test", focusTopics: ["Next.js SSR/SSG", "Node Architecture", "State Machines", "Performance"] },
    ],
  },
  {
    id: "cpp_c",
    name: "C++ & C",
    icon: "⚙️",
    levels: [
      { id: "cpp_beg", label: "Başlangıç (Beginner / Memory)", desc: "Pointers, bellek mantığı, döngüler ve tipler", focusTopics: ["Pointers & Memory", "Variables & Types", "Control Flow", "Functions"] },
      { id: "cpp_mid", label: "Orta (Intermediate / OOP & STL)", desc: "Sınıflar, kalıtım, vectors, maps, dynamic allocation", focusTopics: ["Classes & Inheritance", "STL Containers", "Dynamic Allocation", "Templates"] },
      { id: "cpp_adv", label: "İleri (Advanced / Competitive DSA)", desc: "Olimpiyat soruları, LeetCode Hard, karmaşıklık", focusTopics: ["Competitive Programming", "Graph Algorithms", "Memory Optimization", "Concurrency"] },
    ],
  },
  {
    id: "java",
    name: "Java",
    icon: "☕",
    levels: [
      { id: "java_beg", label: "Başlangıç (Beginner / Syntax)", desc: "Java syntax, sınıflar, nesneler, arrayler", focusTopics: ["Syntax", "Classes & Objects", "Arrays", "Methods"] },
      { id: "java_mid", label: "Orta (Intermediate / Collections)", desc: "Collections, Streams API, Spring temelleri", focusTopics: ["Collections Framework", "Streams API", "Exceptions", "Spring Boot Basics"] },
      { id: "java_adv", label: "İleri (Advanced / Enterprise & Concurrency)", desc: "Mikroservisler, multithreading, JPA/Hibernate", focusTopics: ["Design Patterns", "Microservices", "Multithreading", "Spring Security"] },
    ],
  },
  {
    id: "golang",
    name: "Go (Golang)",
    icon: "🐹",
    levels: [
      { id: "go_beg", label: "Başlangıç (Beginner)", desc: "Structs, slices, maps, pointers ve temel sözdizimi", focusTopics: ["Structs", "Slices & Maps", "Pointers", "Interfaces"] },
      { id: "go_adv", label: "İleri (Advanced / High Scale)", desc: "Goroutines & Channels, high-load backend, gRPC", focusTopics: ["Goroutines & Channels", "High-Performance APIs", "gRPC", "Dockerization"] },
    ],
  },
];

// Main Goals config
export const LEARNING_TRACKS: GoalTrack[] = [
  {
    id: "academic",
    code: "academic",
    titleTr: "Akademik & Sınavlar",
    titleEn: "Academic & Exams",
    descTr: "Türkiye MEB, US K-12, UK GCSE/A-Level, Almanya Abitur ve Global IB müfredatları",
    descEn: "Clean curriculum for Turkey, US, UK, Germany, and Global IB",
    icon: "GraduationCap",
    color: "emerald",
    badgeTr: "Bölgesel Sınavlar",
    badgeEn: "Regional Exams",
    subGoals: [
      { id: "tr_meb", titleTr: "Türkiye (1. - 12. Sınıf & YKS)", titleEn: "Turkey (Grades 1-12 & YKS)" },
      { id: "us_k12_ap", titleTr: "USA (Grade 1 - 12 & AP)", titleEn: "USA (Grade 1 - 12 & AP)" },
      { id: "uk_gcse_a", titleTr: "UK (Year 7 - 13 & GCSE/A-Levels)", titleEn: "UK (Year 7 - 13 & GCSE/A-Levels)" },
      { id: "de_abitur", titleTr: "Deutschland (Klasse 5 - 13 & Abitur)", titleEn: "Germany (Klasse 5 - 13 & Abitur)" },
      { id: "ib_global", titleTr: "Global / IB (MYP & DP 1-2)", titleEn: "Global / IB (MYP & DP 1-2)" },
    ],
  },
  {
    id: "language",
    code: "language",
    titleTr: "Dil Öğrenimi (A1 - C2)",
    titleEn: "Language Acquisition (A1 - C2)",
    descTr: "Ülkeden bağımsız seviye bazlı dil pratiği (İngilizce, Almanca, İspanyolca, Fransızca)",
    descEn: "Country-independent language mastery from Beginner (A1) to Mastery (C2)",
    icon: "Languages",
    color: "sky",
    badgeTr: "A1 - C2 Seviyeleri",
    badgeEn: "A1 - C2 Levels",
    subGoals: [
      { id: "english_general", titleTr: "İngilizce (A1 - C2 & IELTS)", titleEn: "English (A1 - C2 & IELTS)" },
      { id: "german_goethe", titleTr: "Almanca (A1 - C2 & Goethe)", titleEn: "German (A1 - C2 & Goethe)" },
      { id: "spanish_dele", titleTr: "İspanyolca (A1 - C2 & DELE)", titleEn: "Spanish (A1 - C2 & DELE)" },
      { id: "french_dalf", titleTr: "Fransızca (A1 - C2 & DALF)", titleEn: "French (A1 - C2 & DALF)" },
    ],
  },
  {
    id: "coding_tech",
    code: "coding_tech",
    titleTr: "Yazılım & Kodlama",
    titleEn: "Coding & Software",
    descTr: "Python, JavaScript, C++, Java ve Go dillerinde seviyenize özel alıştırmalar",
    descEn: "Global software development tracks by programming language and developer skill level",
    icon: "Code",
    color: "amber",
    badgeTr: "Kod & Algoritma",
    badgeEn: "Tech & Code",
    subGoals: [
      { id: "python", titleTr: "Python (Beginner - LeetCode/AI)", titleEn: "Python (Beginner - LeetCode/AI)" },
      { id: "javascript_ts", titleTr: "JavaScript & TypeScript (React/Next)", titleEn: "JavaScript & TypeScript (React/Next)" },
      { id: "cpp_c", titleTr: "C++ & C (Memory / Competitive DSA)", titleEn: "C++ & C (Memory / Competitive DSA)" },
      { id: "java", titleTr: "Java (OOP / Enterprise Backend)", titleEn: "Java (OOP / Enterprise Backend)" },
      { id: "golang", titleTr: "Go (Golang & Concurrency)", titleEn: "Go & Concurrency" },
    ],
  },
  {
    id: "custom_hub",
    code: "custom_hub",
    titleTr: "Custom Study Hub",
    titleEn: "Custom Study Hub",
    descTr: "Kullanıcının özel kaydettiği PDF, ders notu, transkript ve YouTube kütüphane setleri",
    descEn: "Personalized study library with custom saved PDFs, YouTube URLs, notes and topics",
    icon: "Layers",
    color: "purple",
    badgeTr: "Özel Kütüphane",
    badgeEn: "Personalized Library",
    subGoals: [
      { id: "pdf_upload", titleTr: "PDF Ders Notu Kütüphanesi", titleEn: "PDF Lecture Notes Library" },
      { id: "youtube_link", titleTr: "YouTube Dersi & Altyazı Setleri", titleEn: "YouTube Lecture & Subtitle Sets" },
      { id: "free_text", titleTr: "Transkript & Serbest Metinler", titleEn: "Transcripts & Free Text" },
      { id: "custom_topic", titleTr: "Özel Konu Başlıkları", titleEn: "Custom Topics Library" },
    ],
  },
];

export const DAILY_STUDY_TARGETS = [
  { id: "casual", minutes: 15, titleTr: "Hafif Tempo (Günde 15 dk)", titleEn: "Casual (15 min/day)", descTr: "Günde 1 video quiz veya 5 soru", descEn: "1 quiz or 5 questions daily" },
  { id: "regular", minutes: 30, titleTr: "Düzenli Seans (Günde 30 dk)", titleEn: "Regular (30 min/day)", descTr: "2 quiz + 1 canlı düello", descEn: "2 quizzes + 1 live battle" },
  { id: "intensive", minutes: 45, titleTr: "Sınav & Hızlanma (Günde 45 dk)", titleEn: "Intensive (45 min/day)", descTr: "3 quiz + zayıf konu pekiştirmesi", descEn: "3 quizzes + weak topic drill" },
  { id: "mastery", minutes: 60, titleTr: "Tam Odak & Kamp (Günde 60+ dk)", titleEn: "Mastery Camp (60+ min/day)", descTr: "Sınav ve derece hedefleyenler için", descEn: "For competitive exam & rank seekers" },
];
