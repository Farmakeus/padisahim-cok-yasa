// ============================================================
// FABLE — canlı "Kader Anı" olayları için önden yükleme katmanı.
//
// Sunucudaki /api/olay uç noktasından, oyuncunun O ANKİ durumuna
// özel bir karar kartı ister. Gecikme hissedilmesin diye olay
// ihtiyaçtan birkaç kart önce arka planda hazırlanır (prefetch).
//
// Sunucu kapalıysa ya da anahtar yoksa: sessizce devre dışı kalır,
// oyun eskisi gibi yerel tepki kartlarıyla çalışmaya devam eder.
// ============================================================

const FABLE = {
  aktif: true,      // sunucu ilk hatada kendini kapatır
  hazir: null,      // bekleyen tek olay kartı
  cekiliyor: false, // aynı anda iki istek gitmesin
};

// Oyunun o anki durumundan sunucuya gidecek özeti çıkarır.
function fableDurumOzeti(durum) {
  return {
    yil: durum.yil,
    sultan: sultanBul(durum.yil),
    devir: devirBul(durum.yil),
    hazine: Math.round(durum.hazine),
    ordu: Math.round(durum.ordu),
    halk: Math.round(durum.halk),
    ulema: Math.round(durum.ulema),
    // Son çekilen kartların metinleri — tekrarı önlemek için
    sonMetinler: (durum.sonKartlar || []).map((k) => k.metin).filter(Boolean),
  };
}

// Arka planda bir olay hazırlar (zaten hazır/çekiliyorsa dokunmaz).
async function fablePrefetch(durum) {
  if (!FABLE.aktif || FABLE.hazir || FABLE.cekiliyor) return;
  FABLE.cekiliyor = true;
  try {
    const yanit = await fetch("/api/olay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fableDurumOzeti(durum)),
    });
    if (!yanit.ok) throw new Error("sunucu " + yanit.status);
    const kart = await yanit.json();
    if (kart && kart.metin && kart.a && kart.b) {
      FABLE.hazir = kart;
    }
  } catch (e) {
    // Sunucu yok / anahtar yok / ağ hatası → özelliği kapat, oyunu bozma.
    FABLE.aktif = false;
    console.info("[Fable] canlı olaylar kapalı:", e.message);
  } finally {
    FABLE.cekiliyor = false;
  }
}

// Hazır bir olay varsa alıp tüketir (yoksa null → yerel karta düşülür).
function fableOlayAl() {
  if (!FABLE.hazir) return null;
  const kart = FABLE.hazir;
  FABLE.hazir = null;
  return kart;
}
