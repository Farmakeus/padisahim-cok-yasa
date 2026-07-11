// ============================================================
// PORTRELER — konuşan karakterlerin sade çizgi portreleri.
// Osmanlı'da rütbe serpuştan (başlıktan) okunurdu; portreler de
// öyle: aynı gövde, karakteri ele veren başlık ve tek aksesuar.
// Her portre 64x64'lük bir SVG parçasıdır; renk kart türüne göre
// CSS'ten gelir (currentColor).
// ============================================================

// Ortak omuz çizgisi
const PORTRE_GOVDE = '<path d="M12 58 Q18 45 32 45 Q46 45 52 58"/>';

const PORTRELER = {
  // Kavuklu devlet adamı: soğan biçimli yüksek kavuk, sivri sakal
  vezir: `
    <circle cx="32" cy="32" r="9"/>
    <path d="M22 26 Q22 10 32 8 Q42 10 42 26"/>
    <path d="M22 26 Q32 31 42 26"/>
    <path d="M32 8 V23"/>
    <path d="M28 39 Q32 45 36 39"/>`,

  // Geniş sarıklı din bilgini: yatay sarık, yuvarlak dolgun sakal
  ulema: `
    <circle cx="32" cy="33" r="9"/>
    <ellipse cx="32" cy="20" rx="14" ry="7"/>
    <path d="M20 22 Q32 27 44 22"/>
    <path d="M24 36 Q24 48 32 48 Q40 48 40 36"/>`,

  // Börklü yeniçeri: dik keçe börk, arkaya sarkan yatırtma, pala bıyık
  asker: `
    <circle cx="32" cy="33" r="9"/>
    <path d="M23 24 V13 Q23 9 27 9 H37 Q41 9 41 13 V24"/>
    <path d="M41 12 L47 15 V29"/>
    <path d="M25 37 Q28 42 32 38 Q36 42 39 37"/>`,

  // Miğferli serhat gazisi: sivri tolga, yüz siperi, bıyık
  gazi: `
    <circle cx="32" cy="33" r="9"/>
    <path d="M22 26 L32 8 L42 26"/>
    <path d="M21 26 H43"/>
    <path d="M32 26 V33"/>
    <path d="M26 38 Q32 42 38 38"/>`,

  // Denizci: bağlamalı yemeni, yanda uçuşan uç, küpe
  denizci: `
    <circle cx="32" cy="33" r="9"/>
    <path d="M22 25 Q23 14 32 13 Q41 14 42 25"/>
    <path d="M42 22 L49 25 M42 25 L48 30"/>
    <circle cx="41" cy="37" r="1.3" fill="currentColor"/>
    <path d="M26 38 Q32 42 38 38"/>`,

  // Frenk elçisi: geniş kenarlı şapka, fırfırlı yaka, sivri sakalcık
  elci: `
    <circle cx="32" cy="31" r="9"/>
    <path d="M18 20 H46"/>
    <path d="M24 20 Q24 10 32 10 Q40 10 40 20"/>
    <path d="M17 46 q3 -5 6 0 q3 -5 6 0 q3 -5 6 0 q3 -5 6 0 q3 -5 6 0"/>
    <path d="M30 38 Q32 43 34 38"/>`,

  // Hazine kâtibi: ufak kavuk, elinde akçe
  katip: `
    <circle cx="32" cy="33" r="9"/>
    <path d="M24 25 Q24 12 32 11 Q40 12 40 25"/>
    <path d="M24 25 Q32 28 40 25"/>
    <circle cx="46" cy="52" r="5"/>
    <circle cx="46" cy="52" r="1.4" fill="currentColor"/>`,

  // Valide Sultan: hotozlu taç, iki yana dökülen duvak, gerdanlık
  valide: `
    <circle cx="32" cy="30" r="9"/>
    <path d="M24 19 Q32 8 40 19"/>
    <circle cx="32" cy="12" r="1.4" fill="currentColor"/>
    <path d="M22 21 Q19 34 21 46 M42 21 Q45 34 43 46"/>
    <circle cx="28" cy="43" r="1.1" fill="currentColor"/>
    <circle cx="32" cy="44" r="1.1" fill="currentColor"/>
    <circle cx="36" cy="43" r="1.1" fill="currentColor"/>`,

  // Sade halktan biri: takke, tek bıyık çizgisi
  halk: `
    <circle cx="32" cy="33" r="9"/>
    <path d="M23 26 Q23 16 32 15 Q41 16 41 26"/>
    <path d="M23 26 H41"/>
    <path d="M26 38 Q32 42 38 38"/>`,

  // Derviş: uzun keçe sikke, ince uzun sakal
  dervis: `
    <circle cx="32" cy="33" r="9"/>
    <path d="M26 24 L27 6 H37 L38 24"/>
    <path d="M26 24 H38"/>
    <path d="M29 40 Q32 50 35 40"/>`,

  // Casus: kukuleta, gölgede kalan yüz, iki göz
  casus: `
    <path d="M19 46 Q16 13 32 10 Q48 13 45 46"/>
    <path d="M24 36 Q24 21 32 20 Q40 21 40 36"/>
    <circle cx="28.5" cy="30" r="1.5" fill="currentColor"/>
    <circle cx="35.5" cy="30" r="1.5" fill="currentColor"/>`,

  // Mühürdar: kukuleta + göğsünde kapkara mühür
  muhurdar: `
    <path d="M19 46 Q16 13 32 10 Q48 13 45 46"/>
    <path d="M24 36 Q24 21 32 20 Q40 21 40 36"/>
    <circle cx="28.5" cy="30" r="1.5" fill="currentColor"/>
    <circle cx="35.5" cy="30" r="1.5" fill="currentColor"/>
    <circle cx="32" cy="53" r="4.5" fill="currentColor"/>`,

  // Saray görevlisi: öne kıvrık bostancı üsküfü, sakalsız
  saray: `
    <circle cx="32" cy="33" r="9"/>
    <path d="M23 25 Q24 9 33 7 Q44 6 43 14 L40 25"/>
    <path d="M23 25 H40"/>`,

  // Bilgin/sanatkâr: sade tülbent, omzunda tüy kalem
  bilgin: `
    <circle cx="32" cy="33" r="9"/>
    <path d="M23 25 Q25 13 32 12 Q39 13 41 25"/>
    <path d="M23 25 Q32 28 41 25"/>
    <path d="M45 56 L52 40"/>
    <path d="M49 46 L45 47 M50 43 L47 41"/>`,

  // Haberci/ulak: kalpak, çapraz çanta kayışı
  haberci: `
    <circle cx="32" cy="33" r="9"/>
    <path d="M23 24 V13 Q32 8 41 13 V24"/>
    <path d="M20 47 L44 57"/>
    <path d="M26 38 Q32 41 38 38"/>`,

  // Fener Patriği: silindir başlık, göğse inen geniş sakal
  patrik: `
    <circle cx="32" cy="31" r="9"/>
    <path d="M24 21 V9 H40 V21"/>
    <path d="M24 9 H40"/>
    <path d="M24 34 Q24 52 32 52 Q40 52 40 34"/>`,

  // Geç dönem zabiti: kalpak, omuz apoletleri, gür bıyık
  zabit: `
    <circle cx="32" cy="33" r="9"/>
    <path d="M23 23 V13 Q32 9 41 13 V23"/>
    <path d="M14 48 H24 M40 48 H50"/>
    <path d="M25 38 Q32 43 39 38"/>`,

  // Tanzimat efendisi: püsküllü fes, istanbulin ceket yakası
  efendi: `
    <circle cx="32" cy="32" r="9"/>
    <path d="M25 22 Q25 11 32 11 Q39 11 39 22"/>
    <path d="M39 13 L45 19"/>
    <circle cx="45" cy="20" r="1.2" fill="currentColor"/>
    <path d="M26 46 L32 53 L38 46"/>
    <path d="M28 38 Q32 41 36 38"/>`,
};

// Her konuşan karakter bir arketipe bağlanır
const KONUSAN_PORTRE = {
  // Kavuklu devlet adamları
  "Sadrazam": "vezir", "Nişancı": "vezir", "Reisülküttap": "vezir",
  "Taşra Valisi": "vezir", "Şehremini": "vezir", "Su Nazırı": "vezir",
  "Merzifonlu Kara Mustafa Paşa": "vezir",
  // Ulema
  "Şeyhülislam": "ulema", "Kadı": "ulema", "Kadıasker": "ulema", "Sürre Emini": "ulema",
  // Yeniçeri ve kapıkulu askerleri
  "Yeniçeri Ağası": "asker", "Serasker": "asker", "Muhafız": "asker",
  "Zaptiye": "asker", "Silahtar": "asker", "Topçubaşı": "asker",
  "Lağımcıbaşı": "asker",
  // Serhat gazileri ve serdarlar
  "Alp Gazi": "gazi", "Süleyman Paşa": "gazi", "Serdar": "gazi",
  "Akıncı Beyi": "gazi",
  // Denizciler
  "Kaptan-ı Derya": "denizci", "Kaptan": "denizci", "Liman Reisi": "denizci",
  "Tersane Emini": "denizci", "Barbaros Hayreddin Paşa": "denizci",
  // Yabancı elçiler
  "Venedik Elçisi": "elci", "Fransız Elçisi": "elci", "Yabancı Elçi": "elci",
  "Bizans Elçisi": "elci",
  // Hazine ve kalem ehli
  "Defterdar": "katip", "Darphane Emini": "katip", "Gümrük Emini": "katip",
  "Vergi Mültezimi": "katip", "Hazinedar": "katip", "Kuyumcubaşı": "katip",
  // Harem
  "Valide Sultan": "valide",
  // Halk
  "Halktan Biri": "halk", "Tüccar": "halk", "Esnaf Kethüdası": "halk",
  // Dervişler
  "Derviş": "dervis", "Akşemseddin": "dervis",
  // Gölgeler
  "Casus": "casus", "Mühürdar": "muhurdar",
  // Saray görevlileri
  "Kapı Ağası": "saray", "Teşrifatçı": "saray", "Bostancıbaşı": "saray",
  "Aşçıbaşı": "saray", "Nedim": "saray", "Doğancıbaşı": "saray",
  // Bilginler ve sanatkârlar
  "Saray Mimarı": "bilgin", "Müneccimbaşı": "bilgin", "Şair": "bilgin",
  "Hekimbaşı": "bilgin", "Sahaf": "bilgin", "İbrahim Müteferrika": "bilgin",
  "Sedefkâr Mehmed Ağa": "bilgin", "Lala": "bilgin",
  // Haberciler
  "Haberci": "haberci", "Ulak": "haberci",
  // Ruhban
  "Fener Patriği": "patrik",
  // Geç dönem zabitleri
  "Enver Paşa": "zabit", "Harbiye Nazırı": "zabit",
  // Tanzimat efendileri
  "Mustafa Reşid Paşa": "efendi", "Mithat Paşa": "efendi", "Nazır": "efendi",
  "Matbuat Müdürü": "efendi", "Hariciye Nazırı": "efendi", "İskân Memuru": "efendi",
};

function portreSvg(konusan) {
  const tip = KONUSAN_PORTRE[konusan] || "halk";
  return `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.4"
    stroke-linecap="round" stroke-linejoin="round">${PORTRELER[tip]}${PORTRE_GOVDE}</svg>`;
}
