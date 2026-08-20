// Single source of truth: all website content comes from this one file.
// JavaScript module (not JSON) – so multiline template literals (backticks)
// can be used in "text" fields. Consumed by build.js via require().
module.exports = {
  practice: {
    name: "die Mühlbachpraxis",
    tagline: "Gemeinschaftspraxis",
    logo: "images/logo.jpg",
    intro: "Herzlich willkommen in unserer Gemeinschaftspraxis am Mühlbach! Bei uns erwartet Sie ein erfahrenes Team mit individuellen Schwerpunkten – von Traditioneller Chinesischer Medizin über Psychotherapie und Klinische Psychologie bis zu Qi Gong & Yoga. Ganzheitlich an Ihrer Seite.",
    address: {
      street: "Schwartzstraße 7/7",
      city: "2500 Baden",
      country: "Österreich"
    }
  },
  sections: [
    { id: "aerztinnen", title: "Ärztinnen", file: "aerztinnen.html", description: "Traditionelle Chinesische Medizin und westliche Medizin – Akupunktur, chinesische Arzneimitteltherapie und ganzheitliche Frauengesundheit." },
    { id: "psychotherapie", title: "Psychotherapie", file: "psychotherapie.html", description: "Personzentrierte und existenzanalytische Psychotherapie für Erwachsene, Jugendliche und Kinder." },
    { id: "klinische-psychologie", title: "Klinische Psychologie", file: "klinische-psychologie.html", description: "Klinische und gesundheitspsychologische Begleitung, Beratung und Diagnostik – einfühlsam und auf Augenhöhe." },
    { id: "gruppenkurse", title: "Gruppenkurse", file: "gruppenkurse.html", description: "Qi Gong und Meridian Yoga – sanftes Entspannungstraining für Gesundheit, Beweglichkeit und innere Ruhe." }
  ],
  therapists: [
    {
      section: "aerztinnen",
      logo: "images/tcm-chen-logo.png",
      "page-title": "TCM Chen",
      "page-subtitle": "Praxis für Chinesische Medizin",
      "practitioner-name": "Dr. Heidrun Chen",
      "practitioner-portrait": "images/portrait-heidrun-chen.jpg",
      subtitle: "Traditionelle Chinesische Medizin",
      text: "Ärztin für Allgemeinmedizin mit jahrzehntelanger Erfahrung in Akupunktur, chinesischer Arzneimitteltherapie und ganzheitlicher Diagnostik – Traditionelle Chinesische Medizin kombiniert mit westlicher Medizin.",
      email: "praxis@tcm-chen.com",
      phone: "+43 699 817 24 716",
      url: "https://tcm-chen.at"
    },
    {
      section: "aerztinnen",
      logo: "images/drschoendorfer-logo.svg",
      "page-title": "Dr. Yasmin Schöndorfer",
      "page-subtitle": "TCM – Frauengesundheit",
      "practitioner-name": "Dr. Yasmin Schöndorfer",
      "practitioner-portrait": "images/portait-yasmin-schondorfer.jpg",
      subtitle: "TCM & Frauengesundheit",
      text: "Ganzheitliche Frauengesundheit mit Traditioneller Chinesischer Medizin und westlicher Medizin: Kinderwunsch, IVF-Begleitung, Zyklusbeschwerden, Schwangerschaft und Menopause.",
      email: "tcm@drschoendorfer.at",
      phone: "+43 680 15 44 743",
      url: "https://drschoendorfer.at"
    },
    {
      section: "psychotherapie",
      logo: "images/schmoelzer-logo.jpg",
      "page-title": "Psychotherapie Schmölzer",
      "page-subtitle": "Personzentrierte Psychotherapie",
      "practitioner-name": "Dr. Nina Schmölzer",
      "practitioner-portrait": "images/portrait-nina-schmoelzer.jpg",
      subtitle: "Personzentrierte Psychotherapie, humanistisch, nach Carl R. Rogers ",
      text: "Personzentrierte Psychotherapie nach Carl R. Rogers – humanistisch und einfühlsam. Psychotherapeutin und Ärztin für Allgemeinmedizin mit langjähriger psychiatrischer Erfahrung. Auch online oder in Bewegung an der frischen Luft möglich.",
      email: "praxis.schmoelzer@gmail.com",
      phone: "+43 660 11 888 70",
      url: "https://www.praxis-ninaschmoelzer.at"
    },
    {
      section: "psychotherapie",
      logo: "",
      "page-title": "Claudia Matzka",
      "page-subtitle": "Psychotherapie",
      "practitioner-name": "Mag. Claudia Matzka",
      "practitioner-portrait": "images/portrait-claudia-matzka.jpg",
      subtitle: "Klinische Psychologin, Gesundheitspsychologin, Psychotherapeutin (Existenzanalyse), Kinder, Jugendliche, Erwachsene",
      text: `
**Schwerpunkte:**  
Kinderpsychosomatik allgemein, Essstörungen, Schwerpunkt Anorexie, Jugendliche Krisen, Depressionen, Angststörungen, Pubertäre Krisen, Eltern- und Familiengespräche

Psychosomatik im Erwachsenenalter  
Erwachsene nach ICD-11-Kriterien  
Psychoonkologie

Zusammenarbeit im Geundheitsbereich

Eigene Interessen: Meine Familie, Menschen, Tiere, Natur, Kulturen, Humor
`,
      email: "praxis.matzka@gmail.com",
      phone: "+43 699 115 41 445",
      url: ""
    },
    {
      section: "klinische-psychologie",
      logo: "images/kerstin-rojko-vetter-logo.png",
      "page-title": "Kerstin Rojko-Vetter",
      "page-subtitle": "Klinische Psychologin",
      "practitioner-name": "Mag. Kerstin Rojko-Vetter",
      "practitioner-portrait": "images/portrait-kerstin-rojko-vetter.jpg",
      subtitle: "Klinische & Gesundheitspsychologie",
      text: "Klinische und gesundheitspsychologische Begleitung bei psychischen Belastungen, emotionalen Krisen und gesundheitlichen Herausforderungen – mit besonderen Angeboten wie Geburtsnachsorgegespräch, Begleitung von Sternenkind-Eltern und HypnoBirthing.",
      email: "info@erlebnis-geburt.at",
      phone: "+43 650 220 69 76",
      url: "https://www.erlebnis-geburt.at"
    },
    {
      section: "klinische-psychologie",
      logo: "images/zoechling-logo.png",
      "page-title": "Petra Zöchling",
      "page-subtitle": "Klinische- und Gesundheitspsychologin",
      "practitioner-name": "Mag. Petra Zöchling",
      "practitioner-portrait": "images/portrait-petra-zoechling.jpg",
      subtitle: "Klinische & Gesundheitspsychologie, Klinisch-Psychologische Diagnostik",
      text: "Klinische und gesundheitspsychologische Beratung und Behandlung bei psychologischen Fragestellungen – von Krisenbewältigung bis zur aktiven Reflexion der momentanen Lebenssituation, mit Begegnung auf Augenhöhe, Empathie und Wertschätzung.",
      email: "mail@psychologie-zoechling.at",
      phone: "+43 677 61 44 13 64",
      url: "https://www.psychologie-zoechling.at"
    },
    {
      section: "gruppenkurse",
      logo: "images/tcm-chen-logo.png",
      "page-title": "TCM Chen",
      "page-subtitle": "Praxis für Chinesische Medizin",
      "practitioner-name": "Dr. Heidrun Chen",
      "practitioner-portrait": "images/portrait-heidrun-chen.jpg",
      subtitle: "Qi Gong",
      text: "Angeboten werden Medizinisches Qi Gong, Duft Qi Gong und Die 6 Heilenden Laute. Qi Gong ist eine sanfte Bewegungs- und Entspannungsmethode, die Körper, Geist und Seele in Einklang bringt.",
      email: "praxis@tcm-chen.com",
      phone: "+43 699 817 24 716",
      url: "https://tcm-chen.at"
    },
    {
      section: "gruppenkurse",
      logo: "",
      "page-title": "Andrea Hofmann",
      "page-subtitle": "Qi Gong & Yoga",
      "practitioner-name": "Andrea Hofmann",
      "practitioner-portrait": "images/portrait-andrea-hofmann.jpg",
      subtitle: "Qi Gong & Meridian Yoga",
      text: "Wudang Qi Gong und Meridian Yoga (Makko-Ho nach Shizuto Masunaga) – sanftes Entspannungstraining für Gesundheit, Beweglichkeit und den Fluss der Meridian-Energie. Die Übungen sind für jeden geeignet und werden mit Aufwärmübungen, Mobilisation der Gelenke und einer abschließenden Meditation abgerundet. Jeden Donnerstag in Baden bei Wien.",
      email: "andrea.hofmann@joando.at",
      phone: "+43 676 966 17 07",
      url: "https://www.joando.at/ENSTSPANNUNG/"
    },
    {
      section: "gruppenkurse",
      logo: "",
      "page-title": "Nicole Frank",
      "page-subtitle": "Yoga mit Nicole Frank",
      "practitioner-name": "Nicole Frank",
      "practitioner-portrait": "images/portrait-nicole-frank.jpg",
      subtitle: "Sozialpädagogin, Yogalehrerin, Angehende Psychotherapeutin",
      text: `
**Dientags von 18.30 - 20 Uhr**, für Anfänger und Fortgeschrittene.

Präsent, kraftvoll und entspannt im Alltag sein.
Mithilfe unterschiedlicher Techniken (Körperliche Haltungen und Bewegungsabläufe, Atem-, Wahrnehmungs-, Aufmerksamkeits- und Achtsamkeitsübungen) aus verschiedenen Yogastilen inspiriert bringen wir Balance in unser System. Durch bewussten Umgang mit der Atmung in Kombination mit achtsamen Bewegungen kann der Geist im Hier und Jetzt zur Ruhe kommen. Der Körper wird gekräftigt, gedehnt und mobilisiert.
Eine *unverbindliche Schnuppereinheit um 10 €* ist nach Anmeldung jederzeit möglich.

**Die regulären Preise für den Gruppenunterricht:**

10er-Block: 170 €  
5er-Block: 100 €  
Einzeleinheit: 22 €  
      `,
      email: "niki.frank@gmx.at",
      phone: "+43 664 5342667",
      url: ""
    }
  ]
};
