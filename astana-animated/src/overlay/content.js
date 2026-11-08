// On-screen text (Kazakh only) and statistics for «Даладан — елордаға дейін».
// Sources and notes: SOURCES.md

export const TEXT = {
  kicker: 'АНИМАЦИЯЛЫҚ ДЕРЕКТІ ФИЛЬМ',
  title: 'АСТАНА',
  subtitle: 'ДАЛАДАН — ЕЛОРДАҒА ДЕЙІН',
  reconstruction: 'ТАРИХИ РЕКОНСТРУКЦИЯ',
  newCapital: 'ЖАҢА ЕЛОРДА',
  fastGrowth: 'ҚАРҚЫНДЫ ДАМУ',
  economyChips: ['САУДА', 'ҚҰРЫЛЫС', 'ҚЫЗМЕТ', 'КӨЛІК', 'КӘСІПКЕРЛІК'],
  final1: 'АСТАНА — ҚАЗАҚСТАННЫҢ ЖҮРЕГІ',
  final2: 'БОЛАШАҚ ОСЫ ЖЕРДЕ ҚАЛЫПТАСАДЫ',
};

export const HISTORY = [
  { year: '1830', text: 'Ақмола бекінісі' },
  { year: '1862', text: 'Қала мәртебесі' },
  { year: '1961', text: 'Целиноград' },
  { year: '1997', text: 'Қазақстанның елордасы' },
  { year: '1998', text: 'Астана атауы' },
];

export const STATS = {
  population: {
    value: 1700385,
    unit: 'АДАМ',
    chip2017: '2017 · 1 МИЛЛИОН',
    date: '2026 ЖЫЛҒЫ 1 ҚЫРКҮЙЕКТЕГІ ДЕРЕК',
    source: 'Дереккөз: ҚР Ұлттық статистика бюросы',
  },
  grp: { value: '18,9', unit: 'ТРИЛЛИОН ₸', label: '2025 ЖЫЛҒЫ ЖАЛПЫ ӨҢІРЛІК ӨНІМ', source: 'Дереккөз: ҚР Ұлттық статистика бюросы (алдын ала деректер)' },
  budget: {
    value: '1,647', unit: 'ТРИЛЛИОН ₸', label: '2025 ЖЫЛҒА БЕКІТІЛГЕН БЮДЖЕТ КІРІСІ',
    note: 'Бағыттар мысал ретінде көрсетілген — үлестері емес',
    sectors: ['Мектептер', 'Ауруханалар', 'Жолдар', 'Қоғамдық көлік', 'Саябақтар', 'Инфрақұрылым'],
  },
  tourists: { value: 1604825, unit: 'КЕЛУШІ', year: '2025 ЖЫЛ', source: 'Дереккөз: Астана қаласының әкімдігі · келу саны' },
  foreign: { value: 380301, label: 'ШЕТЕЛДІК ТУРИСТ' },
};

export const LANDMARKS = ['БӘЙТЕРЕК', 'ХАН ШАТЫР', 'АСТАНА ОПЕРА', 'ӘЗІРЕТ СҰЛТАН МЕШІТІ', 'ЕСІЛ ЖАҒАЛАУЫ'];

// Simple line icons (24×24 viewBox) for the budget infographic
export const ICONS = [
  // school
  '<path d="M3 10 12 4l9 6"/><path d="M5 10v9h14v-9"/><path d="M10 19v-5h4v5"/><path d="M12 4V2h3"/>',
  // hospital
  '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M12 9v7M8.5 12.5h7"/>',
  // road
  '<path d="M8 3 5 21M16 3l3 18"/><path d="M12 4v3M12 10.5v3M12 17v3"/>',
  // public transport
  '<rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14"/><circle cx="8.5" cy="14" r="1"/><circle cx="15.5" cy="14" r="1"/><path d="M8 17l-2 4M16 17l2 4"/>',
  // park
  '<circle cx="12" cy="9" r="5"/><path d="M12 14v7M8 21h8"/>',
  // infrastructure (crane)
  '<path d="M6 21V4h2v17"/><path d="M6 6h14M8 4l12 2"/><path d="M18 6v5"/><rect x="16.5" y="11" width="3" height="2.5"/><path d="M3 21h8"/>',
];
