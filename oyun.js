// ============================================================
// PADİŞAHIM ÇOK YAŞA — oyun mantığı
// Dört güç (hazine, ordu, halk, ulema) 0-100 arasında tutulur.
// Herhangi biri 0'a düşerse ya da 100'e vurursa saltanat biter.
// 1922'ye kadar dayanmak oyunu tamamlamaktır.
// ============================================================

// --- Tarihî sabitler ---

// Gerçek padişahlar ve tahta çıkış yılları (sadeleştirilmiş liste)
const SULTANLAR = [
  [1299, "Osman Gazi"], [1326, "Orhan Gazi"], [1362, "I. Murad"],
  [1389, "Yıldırım Bayezid"], [1402, "Fetret Devri"], [1413, "Çelebi Mehmed"],
  [1421, "II. Murad"], [1451, "Fatih Sultan Mehmed"], [1481, "II. Bayezid"],
  [1512, "Yavuz Sultan Selim"], [1520, "Kanuni Sultan Süleyman"], [1566, "II. Selim"],
  [1574, "III. Murad"], [1595, "III. Mehmed"], [1603, "I. Ahmed"],
  [1617, "I. Mustafa"], [1618, "Genç Osman"], [1622, "I. Mustafa"],
  [1623, "IV. Murad"], [1640, "Sultan İbrahim"], [1648, "Avcı Mehmed"],
  [1687, "II. Süleyman"], [1691, "II. Ahmed"], [1695, "II. Mustafa"],
  [1703, "III. Ahmed"], [1730, "I. Mahmud"], [1754, "III. Osman"],
  [1757, "III. Mustafa"], [1774, "I. Abdülhamid"], [1789, "III. Selim"],
  [1807, "IV. Mustafa"], [1808, "II. Mahmud"], [1839, "Abdülmecid"],
  [1861, "Abdülaziz"], [1876, "II. Abdülhamid"], [1909, "Mehmed Reşad"],
  [1918, "VI. Mehmed Vahdeddin"],
];

const DEVIRLER = [
  [1299, "Kuruluş Devri"], [1453, "Yükselme Devri"], [1579, "Duraklama Devri"],
  [1699, "Gerileme Devri"], [1792, "Dağılma Devri"],
];

const BASLANGIC_YILI = 1299;
const BITIS_YILI = 1922;

// Oyun sonu metinleri: her gücün hem tükenmesi hem taşması sonu getirir
const SONLAR = {
  hazine_dip: {
    baslik: "Hazine Kurudu",
    metin: "Kasalarda akçe kalmadı. Ulufesini alamayan yeniçeriler kazan kaldırdı; sarayın kapıları omuz darbeleriyle açıldı. Tahttan indirildiniz.",
  },
  hazine_tepe: {
    baslik: "Altına Boğuldunuz",
    metin: "Altın dağları gözleri kör etti. Saray sefahat söylentileriyle çalkalanırken 'devlet malını har vurup harman savuruyor' fetvasıyla hal edildiniz.",
  },
  ordu_dip: {
    baslik: "Ordu Dağıldı",
    metin: "Sancak altında toplanacak asker kalmadı. Sınır boyları savunmasız; düşman orduları payitahta yürüdü. Devlet-i Aliyye düştü.",
  },
  ordu_tepe: {
    baslik: "Askerî Darbe",
    metin: "Ordu her şeyin üstünde bir güç haline geldi. Bir gece yarısı, en güvendiğiniz paşalar sizi tahttan indirip Kafes'e kapattı.",
  },
  halk_dip: {
    baslik: "Büyük İsyan",
    metin: "Bıçak kemiğe dayandı. İsyan ateşi sokakları sardı, saray kapısına dayanan kalabalık yeni bir padişah istedi. İstediler de...",
  },
  halk_tepe: {
    baslik: "Halkın Evliyası",
    metin: "Halkın gözünde yarı evliya oldunuz; adınıza türküler yakıldı. Nüfuzunuzdan ürken saray erkânı, kahvenize 'çare' koydurdu.",
  },
  ulema_dip: {
    baslik: "Hal Fetvası",
    metin: "Şeyhülislam fetvayı verdi: 'Din ü devlete zararı dokunan padişahın hal'i caizdir.' Fetva okunurken yeniçeriler çoktan kapıdaydı.",
  },
  ulema_tepe: {
    baslik: "Gölge Sultan",
    metin: "Devlet medreseye döndü; her ferman fetvaya takılır oldu. Gerçek iktidar şeyhülislamın eline geçti — siz sarayda bir gölgesiniz artık.",
  },
  zafer: {
    baslik: "623 Yıllık Destan",
    metin: "1 Kasım 1922 — Saltanat kaldırıldı. Söğüt'te bir obadan üç kıtaya uzanan altı asırlık hanedanın son halkası oldunuz. Oyunu tamamladınız!",
  },
};

// localStorage her ortamda bulunmayabilir (gizli sekme, paylaşım sayfası,
// kısıtlı iframe). Yoksa oturum boyunca hafızada tutan bir yedek devreye
// girer: oyun aynen çalışır, kayıtlar yalnızca sayfa kapanınca gider.
const DEPO = (function () {
  try {
    localStorage.setItem("depoDeneme", "1");
    localStorage.removeItem("depoDeneme");
    return localStorage;
  } catch (hata) {
    const bellek = {};
    return {
      getItem: (anahtar) => (anahtar in bellek ? bellek[anahtar] : null),
      setItem: (anahtar, deger) => { bellek[anahtar] = String(deger); },
    };
  }
})();

// Saltanat kayıtları için mezar taşı metinleri (SONLAR anahtarlarıyla eş)
const MEZAR_METINLERI = {
  hazine_dip: "hazinesi kurudu",
  hazine_tepe: "altına boğuldu",
  ordu_dip: "ordusu dağıldı",
  ordu_tepe: "paşaları darbe yaptı",
  halk_dip: "halkı ayaklandı",
  halk_tepe: "halk fazla sevdi",
  ulema_dip: "fetvayla hal edildi",
  ulema_tepe: "ulemanın gölgesinde kaldı",
  zafer: "623 yılı şanla tamamladı",
};

// --- Saltanat Kayıtları (oyunlar arası hanedan tarihi) ---
// Her oyunun sonu bir satır olarak saklanır: yıl, süre, devir, akıbet.

function saltanatlariYukle() {
  try {
    const s = JSON.parse(DEPO.getItem("saltanatDefteri"));
    if (Array.isArray(s)) return s;
  } catch (hata) { /* bozuk kayıt: boş listeyle başla */ }
  return [];
}

function saltanatlariKaydet() {
  DEPO.setItem("saltanatDefteri", JSON.stringify(saltanatlar));
}

let saltanatlar = saltanatlariYukle();

// --- Kara Mühür Defteri (oyunlar arası kalıcı hikâye durumu) ---
// Ölüm defteri yakmaz: görülen bölümler ve hikâyenin kaldığı yer
// localStorage'da saklanır, sonraki padişah avı devralır.

function defterYukle() {
  try {
    const d = JSON.parse(DEPO.getItem("karaMuhurDefter"));
    if (d && Array.isArray(d.gorulen) && Array.isArray(d.bitisler)) {
      // Eski/bozuk bir anahtar kalmışsa hikâyeyi baştan başlat
      if (d.siradaki && !HIKAYE_KARTLARI[d.siradaki]) d.siradaki = HIKAYE_BASLANGIC;
      // Keşif bilgisi (yıl/padişah) sonradan eklendi: eski defterlerde yoksa boş başlat
      if (!d.kesifler || typeof d.kesifler !== "object") d.kesifler = {};
      return d;
    }
  } catch (hata) { /* bozuk kayıt: temiz defterle başla */ }
  return { siradaki: HIKAYE_BASLANGIC, gorulen: [], bitisler: [], kesifler: {} };
}

function defterKaydet() {
  DEPO.setItem("karaMuhurDefter", JSON.stringify(defter));
}

let defter = defterYukle();
let defterDonus = "baslangic-ekrani"; // defterden geri dönülecek ekran

// --- Oyun durumu ---

let durum = null; // oyunuBaslat() içinde kurulur

function oyunuBaslat() {
  if (durum) clearTimeout(durum.tepkiZamanlayici); // önceki oyundan sayaç kalmasın
  durum = {
    hazine: 50, ordu: 50, halk: 50, ulema: 50,
    yil: BASLANGIC_YILI,
    kararSayisi: 0,
    gorulenTarihi: new Set(), // gösterilen tarihî kartların id'leri
    sonKartlar: [],           // aynı kartın peş peşe gelmesini önler
    gorulenSultanlar: new Set([sultanBul(BASLANGIC_YILI)]),
    aktifKart: null,
    bekleyenler: [], // kuyruktaki akıbet kartları: {id, kalan karar sayısı}
    kampanya: null,  // süren sefer: {id, adim, basari} — sefer boyunca yıl donar
    // Kara Mühür hikâyesi — kaldığı yer defterden okunur (defter.siradaki)
    hikayeSayac: 0,    // son hikâye kartından bu yana geçen karar
    hikayeGorulen: 0,  // bu oyunda kaç bölüm görüldü
    hikayeBitis: null, // bu oyunda varılan son (HIKAYE_SONUCLARI anahtarı)
    // Ani olaylar (süreli tepki kartları)
    tepkiSayac: 0,             // son ani olaydan bu yana çekilen kart
    gorulenTepki: new Set(),   // bu oyunda çıkmış tepki kartları
    tepkiZamanlayici: null,    // süre dolunca gecikme cezasını işletir
  };
  ekranSec("oyun-ekrani");
  kartGoster(kartCek());
  arayuzuGuncelle();
}

// --- Yardımcılar ---

function rastgele(dizi) {
  return dizi[Math.floor(Math.random() * dizi.length)];
}

function sultanBul(yil) {
  let ad = SULTANLAR[0][1];
  for (const [baslangic, isim] of SULTANLAR) {
    if (yil >= baslangic) ad = isim;
  }
  return ad;
}

function devirBul(yil) {
  let ad = DEVIRLER[0][1];
  for (const [baslangic, isim] of DEVIRLER) {
    if (yil >= baslangic) ad = isim;
  }
  return ad;
}

// --- Kart seçimi ---

function kartCek() {
  // Süren sefer her şeyin önüne geçer: sıradaki sefer kartı gelir,
  // kartlar bitince gidişata göre zafer ya da hezimet kartı açılır
  if (durum.kampanya) {
    const sefer = KAMPANYALAR[durum.kampanya.id];
    if (durum.kampanya.adim < sefer.kartlar.length) {
      return sefer.kartlar[durum.kampanya.adim];
    }
    const sonuc = durum.kampanya.basari >= sefer.esik ? sefer.zafer : sefer.hezimet;
    durum.kampanya = null;
    return sonuc;
  }

  // Önce vakti gelmiş tarihî olay var mı bak
  const vaktiGelen = TARIHI_KARTLAR.find(
    (k) => !durum.gorulenTarihi.has(k.id) && durum.yil >= k.yil
  );
  if (vaktiGelen) {
    durum.gorulenTarihi.add(vaktiGelen.id);
    durum.hikayeSayac++;
    return vaktiGelen;
  }

  // Vakti gelen akıbet kartı: kuyruktakiler tarihî olaydan sonra,
  // her şeyden önce döner. Koşuldaki güç eşiği aşıyorsa iyi yüz açılır.
  const akibetSirasi = durum.bekleyenler.findIndex((b) => b.kalan <= 0);
  if (akibetSirasi !== -1) {
    const takip = TAKIP_KARTLARI[durum.bekleyenler[akibetSirasi].id];
    durum.bekleyenler.splice(akibetSirasi, 1);
    durum.hikayeSayac++;
    return durum[takip.kosul.guc] >= takip.kosul.esik ? takip.iyi : takip.kotu;
  }

  // Sonra hikâye: her oyunda ilk bölüm 3, sonrakiler 5 kararda bir.
  // Hikâye defterin kaldığı yerden (önceki oyunlardan) devam eder.
  const esik = durum.hikayeGorulen === 0 ? 3 : 5;
  if (defter.siradaki && durum.hikayeSayac >= esik) {
    durum.hikayeSayac = 0;
    durum.hikayeGorulen++;
    if (!defter.gorulen.includes(defter.siradaki)) {
      defter.gorulen.push(defter.siradaki);
      // Vakayiname kaydı: sır ilk kez hangi yılda, kimin devrinde keşfedildi?
      // (Hikâye baştan sarılıp yeniden oynansa da ilk keşif tarihi korunur.)
      defter.kesifler[defter.siradaki] = { yil: durum.yil, sultan: sultanBul(durum.yil) };
      defterKaydet();
    }
    return HIKAYE_KARTLARI[defter.siradaki];
  }

  // Ani olay: en az 6 kart arayla, %20 ihtimalle araya girer.
  // Her kart bir oyunda en fazla bir kez çıkar.
  if (durum.tepkiSayac >= 6 && Math.random() < 0.2) {
    const havuz = TEPKI_KARTLARI.filter(
      (k) => !durum.gorulenTepki.has(k) && (!k.minYil || durum.yil >= k.minYil)
    );
    if (havuz.length) {
      const kart = rastgele(havuz);
      durum.gorulenTepki.add(kart);
      durum.tepkiSayac = 0;
      durum.hikayeSayac++;
      return kart;
    }
  }

  // Yoksa yıl aralığına uyan, yakın zamanda çıkmamış bir genel kart seç
  const uygunlar = KARTLAR.filter(
    (k) =>
      (!k.minYil || durum.yil >= k.minYil) &&
      (!k.maxYil || durum.yil <= k.maxYil) &&
      !durum.sonKartlar.includes(k)
  );
  const kart = rastgele(uygunlar.length ? uygunlar : KARTLAR);
  durum.sonKartlar.push(kart);
  if (durum.sonKartlar.length > 8) durum.sonKartlar.shift();
  durum.hikayeSayac++;
  durum.tepkiSayac++;
  return kart;
}

// --- Tur döngüsü ---

function secimYap(secim) {
  // secim: aktif kartın "a"sı, "b"si ya da süre dolunca "gecikme"si
  clearTimeout(durum.tepkiZamanlayici); // ani olay sayacı varsa durdur

  for (const [guc, deger] of Object.entries(secim.etki)) {
    durum[guc] += deger;
  }
  durum.kararSayisi++;

  // Kuyruktaki akıbetler yaklaşır; bu seçim yeni bir akıbet ekliyorsa
  // kuyruğa girer (aynı akıbet zaten bekliyorsa yenilenmez)
  for (const bekleyen of durum.bekleyenler) bekleyen.kalan--;
  if (secim.takip && !durum.bekleyenler.some((b) => b.id === secim.takip.id)) {
    durum.bekleyenler.push({ id: secim.takip.id, kalan: secim.takip.gecikme });
  }

  // Sefer başlatan seçim ordugâhı kurar (gidişat 50'den başlar)
  if (secim.kampanya) {
    durum.kampanya = { id: secim.kampanya, adim: 0, basari: 50 };
  }

  // Sefer kartındaysak gidişatı oynat ve sonraki karta geç
  if (durum.aktifKart.sefer && durum.kampanya) {
    durum.kampanya.basari = Math.max(0, Math.min(100, durum.kampanya.basari + (secim.ilerleme || 0)));
    durum.kampanya.adim++;
  }

  // Hikâye kartıysa zinciri ilerlet ve deftere işle
  if (durum.aktifKart.hikaye) {
    defter.siradaki = secim.sonraki || null;
    if (secim.bitis) {
      durum.hikayeBitis = secim.bitis;
      if (!defter.bitisler.includes(secim.bitis)) defter.bitisler.push(secim.bitis);
    }
    defterKaydet();
  }

  // Ölüm kontrolü (0'ın altı ya da 100'ün üstü = son)
  const son = sonKontrol();
  if (son) return oyunuBitir(son);

  // Görüntü için 0-100 aralığına sabitle
  for (const guc of ["hazine", "ordu", "halk", "ulema"]) {
    durum[guc] = Math.max(1, Math.min(99, durum[guc]));
  }

  // Sefer sırasında yıl donar: kuşatma haftalarla ölçülür, yıllarla değil.
  // (Sefer kartları ve seferi başlatan seçim yıl ilerletmez.)
  if (!durum.aktifKart.sefer && !secim.kampanya) {
    yilIlerle();
    if (durum.yil >= BITIS_YILI) return oyunuBitir("zafer");
  }

  kartGoster(kartCek());
  arayuzuGuncelle();
}

function sonKontrol() {
  for (const guc of ["hazine", "ordu", "halk", "ulema"]) {
    if (durum[guc] <= 0) return guc + "_dip";
    if (durum[guc] >= 100) return guc + "_tepe";
  }
  return null;
}

function yilIlerle() {
  // Her karar 3-8 yıl sürer
  let adim = 3 + Math.floor(Math.random() * 6);

  // Sıradaki tarihî olayı atlamamak için tam yılında yakala
  const siradaki = TARIHI_KARTLAR
    .filter((k) => !durum.gorulenTarihi.has(k.id) && k.yil > durum.yil)
    .sort((x, y) => x.yil - y.yil)[0];
  if (siradaki && durum.yil + adim >= siradaki.yil) {
    adim = siradaki.yil - durum.yil;
  }

  const eskiSultan = sultanBul(durum.yil);
  durum.yil += adim;
  const yeniSultan = sultanBul(durum.yil);

  if (yeniSultan !== eskiSultan) {
    durum.gorulenSultanlar.add(yeniSultan);
    sultanBildir(yeniSultan);
  }
}

// --- Oyun sonu ---

function oyunuBitir(sonAnahtari) {
  clearTimeout(durum.tepkiZamanlayici); // ani olay sayacı kalmasın
  const son = SONLAR[sonAnahtari];
  const bitisYili = Math.min(durum.yil, BITIS_YILI);
  const gecenYil = bitisYili - BASLANGIC_YILI;

  // Saltanatı hanedan tarihine işle (en eski kayıt 50'yi aşınca düşer)
  saltanatlar.push({
    yil: bitisYili,
    sure: gecenYil,
    sultan: sultanBul(bitisYili),
    son: sonAnahtari,
  });
  if (saltanatlar.length > 50) saltanatlar.shift();
  saltanatlariKaydet();

  document.getElementById("son-baslik").textContent = son.baslik;
  document.getElementById("son-metin").textContent = son.metin;

  // Rekoru sakla (localStorage tarayıcıda kalıcıdır)
  const eskiRekor = Number(DEPO.getItem("padisahRekor") || 0);
  const yeniRekorMu = gecenYil > eskiRekor;
  if (yeniRekorMu) DEPO.setItem("padisahRekor", String(gecenYil));

  // Kara Mühür'ün akıbeti: bitmişse sonucu, başlamışsa yarım kaldığını yaz
  let hikayeSatiri = "";
  if (durum.hikayeBitis) {
    hikayeSatiri = `<div class="hikaye-akibet">${HIKAYE_SONUCLARI[durum.hikayeBitis]}</div>`;
  } else if (durum.hikayeGorulen > 0) {
    hikayeSatiri = `<div class="hikaye-akibet">${HIKAYE_SONUCLARI.yarim}</div>`;
  }

  document.getElementById("son-ozet").innerHTML = `
    <div><span>${gecenYil}</span> yıl hüküm sürüldü (${BASLANGIC_YILI}–${Math.min(durum.yil, BITIS_YILI)})</div>
    <div><span>${durum.gorulenSultanlar.size}</span> padişah tahta çıktı</div>
    <div><span>${durum.kararSayisi}</span> karar verildi</div>
    ${hikayeSatiri}
    ${yeniRekorMu ? "<div class='yeni-rekor'>Yeni rekor!</div>" : `<div>Rekorunuz: <span>${Math.max(eskiRekor, gecenYil)}</span> yıl</div>`}
  `;
  defterButonlariGuncelle();
  ekranSec("son-ekrani");
}

// --- Arayüz ---

function ekranSec(id) {
  for (const ekran of document.querySelectorAll(".ekran")) {
    ekran.classList.toggle("gizli", ekran.id !== id);
  }
}

function kartGoster(kart) {
  durum.aktifKart = kart;
  const kutu = document.getElementById("kart");

  // Konuşanın portresi (serpuşundan tanınır)
  document.getElementById("kart-portre").innerHTML = portreSvg(kart.konusan);

  // Hikâye kartlarında bölüm adı, ani olay ve akıbetlerde uyarı öne eklenir
  document.getElementById("kart-konusan").textContent =
    kart.bolum ? kart.bolum + " • " + kart.konusan
    : kart.tepki ? "Ani Olay • " + kart.konusan
    : kart.akibet ? "Akıbet • " + kart.konusan
    : kart.konusan;
  document.getElementById("kart-metin").textContent = kart.metin;
  document.getElementById("secim-a").textContent = kart.a.yazi;
  document.getElementById("secim-b").textContent = kart.b.yazi;

  // Tarihî olay, sefer, hikâye ve ani olay kartlarını görsel olarak ayır
  kutu.classList.toggle("tarihi", (Boolean(kart.id) || Boolean(kart.sefer)) && !kart.hikaye);
  kutu.classList.toggle("hikaye", Boolean(kart.hikaye));
  kutu.classList.toggle("tepki", Boolean(kart.tepki));

  // Ani olaylarda süre çubuğu erir; dolarsa gecikme cezası işler
  const cubuk = document.getElementById("tepki-cubugu");
  if (kart.tepki) {
    const dolgu = cubuk.querySelector(".tepki-dolgu");
    cubuk.classList.remove("gizli");
    dolgu.style.transition = "none";
    dolgu.style.width = "100%";
    void dolgu.offsetWidth; // yeni genişlik hemen uygulansın
    dolgu.style.transition = "width " + kart.sure + "s linear";
    dolgu.style.width = "0%";
    durum.tepkiZamanlayici = setTimeout(() => {
      // Önce ceza işler; bildirim en son gelir ki araya girebilecek
      // "yeni padişah" duyurusunun altında kaybolmasın
      secimYap(durum.aktifKart.gecikme);
      bildirim("Karar veremediniz — tereddüdün bedeli oldu.");
    }, kart.sure * 1000);
  } else {
    cubuk.classList.add("gizli");
  }

  // Giriş animasyonunu yeniden tetikle
  kutu.classList.remove("giris");
  void kutu.offsetWidth; // tarayıcıya "yeniden çiz" dedirtir
  kutu.classList.add("giris");
}

function arayuzuGuncelle() {
  document.getElementById("yil-goster").textContent = durum.yil;
  document.getElementById("devir-goster").textContent = devirBul(durum.yil);
  document.getElementById("sultan-goster").textContent = sultanBul(durum.yil);

  // Sefer paneli: sefer sürerken gidişat çubuğu ve aşama sayacı görünür
  const panel = document.getElementById("kampanya-panel");
  if (durum.kampanya) {
    const sefer = KAMPANYALAR[durum.kampanya.id];
    panel.classList.remove("gizli");
    document.getElementById("kampanya-ad").textContent = sefer.ad;
    document.getElementById("kampanya-adim").textContent =
      Math.min(durum.kampanya.adim + 1, sefer.kartlar.length) + " / " + sefer.kartlar.length;
    document.getElementById("kampanya-dolgu").style.width = durum.kampanya.basari + "%";
  } else {
    panel.classList.add("gizli");
  }

  for (const guc of ["hazine", "ordu", "halk", "ulema"]) {
    const stat = document.getElementById("stat-" + guc);
    stat.querySelector(".dolgu").style.width = durum[guc] + "%";
    // 20'nin altı ya da 80'in üstü tehlikeli bölgedir
    stat.classList.toggle("tehlike", durum[guc] <= 20 || durum[guc] >= 80);
  }
}

function bildirim(metin) {
  const kutu = document.getElementById("sultan-bildirim");
  kutu.textContent = metin;
  kutu.classList.remove("gizli", "goster");
  void kutu.offsetWidth;
  kutu.classList.add("goster");
}

function sultanBildir(isim) {
  bildirim("Tahta yeni padişah çıktı: " + isim);
}

// --- Defter ekranı ---

function defterButonlariGuncelle() {
  // Hikâye kaydı ya da saltanat kaydı varsa defter görünür
  const varMi = defter.gorulen.length > 0 || saltanatlar.length > 0;
  for (const id of ["defter-btn", "son-defter-btn"]) {
    const btn = document.getElementById(id);
    btn.classList.toggle("gizli", !varMi);
    btn.textContent = `Kara Mühür Defteri (${defter.gorulen.length + saltanatlar.length} kayıt)`;
  }
}

function defterAc(donusEkrani) {
  defterDonus = donusEkrani;
  defterCiz();
  ekranSec("defter-ekrani");
}

function defterCiz() {
  // Bölüm kayıtları: görülenler arşiv notuyla, kalanlar kilitli satırla
  const liste = document.getElementById("defter-liste");
  liste.innerHTML = Object.keys(HIKAYE_KARTLARI).map((anahtar) => {
    if (defter.gorulen.includes(anahtar)) {
      const kart = HIKAYE_KARTLARI[anahtar];
      // Vakayiname satırı: keşif yılı ve devrin padişahı
      // ("yılında/devrinde" kalıbı her yıl ve isimle uyumlu; Fetret Devri özel)
      const kesif = defter.kesifler[anahtar];
      const kesifSatiri = kesif
        ? `<span class="defter-kesif">${kesif.yil} yılında, ${
            kesif.sultan === "Fetret Devri" ? "Fetret Devri'nde" : kesif.sultan + " devrinde"
          } keşfedildi.</span>`
        : "";
      return `<div class="defter-kayit"><span class="defter-bolum">${kart.bolum}</span>${DEFTER_KAYITLARI[anahtar]}${kesifSatiri}</div>`;
    }
    return `<div class="defter-kayit kilitli">— çözülmemiş sır —</div>`;
  }).join("");

  // Toplanan sonlar (üçü de görülebilir: yeniden oynamaya davet)
  const sonlar = document.getElementById("defter-sonlar");
  sonlar.innerHTML = Object.keys(HIKAYE_SON_ADLARI).map((anahtar) =>
    defter.bitisler.includes(anahtar)
      ? `<div class="defter-son"><span class="defter-bolum">${HIKAYE_SON_ADLARI[anahtar]}</span>${HIKAYE_SONUCLARI[anahtar]}</div>`
      : `<div class="defter-son kilitli">— görülmemiş son —</div>`
  ).join("");

  // Saltanat kayıtları: hanedanın mezar taşları, en yenisi üstte
  const kayitlar = document.getElementById("defter-saltanatlar");
  kayitlar.innerHTML = saltanatlar.length
    ? saltanatlar.slice().reverse().map((s) => {
        const devir = s.sultan === "Fetret Devri" ? "Fetret Devri'nde" : s.sultan + " devrinde";
        return `<div class="defter-saltanat"><span>${s.yil}</span> — ${s.sure} yıl sürdü; ${devir} ${MEZAR_METINLERI[s.son]}.</div>`;
      }).join("")
    : `<div class="defter-saltanat kilitli">— henüz saltanat kaydı yok —</div>`;

  // Hikâye bittiyse baştan sarma seçeneği görünür
  document.getElementById("defter-sar").classList.toggle("gizli", defter.siradaki !== null);
}

// Seçim düğmesinin üzerine gelince hangi güçlerin etkileneceğini
// (yönünü söylemeden) küçük bir noktayla belli et — merak baki kalsın
function etkiIpucu(secimAnahtari, goster) {
  if (!durum || !durum.aktifKart) return;
  const etki = durum.aktifKart[secimAnahtari].etki;
  for (const guc of ["hazine", "ordu", "halk", "ulema"]) {
    document.getElementById("stat-" + guc)
      .classList.toggle("etkilenecek", goster && guc in etki);
  }
}

// --- Olay bağlama ---

document.getElementById("basla-btn").addEventListener("click", oyunuBaslat);
document.getElementById("tekrar-btn").addEventListener("click", oyunuBaslat);

// Defter düğmeleri
document.getElementById("defter-btn").addEventListener("click", () => defterAc("baslangic-ekrani"));
document.getElementById("son-defter-btn").addEventListener("click", () => defterAc("son-ekrani"));
document.getElementById("defter-geri").addEventListener("click", () => ekranSec(defterDonus));

// Hikâye bittiyse baştan oynatılabilir (kayıtlar ve sonlar defterde kalır)
document.getElementById("defter-sar").addEventListener("click", () => {
  defter.siradaki = HIKAYE_BASLANGIC;
  defterKaydet();
  defterCiz();
});

// Defteri yakmak her şeyi siler: hikâye kayıtları, sonlar, keşif
// tarihleri, hikâyenin yeri ve saltanat kayıtları
document.getElementById("defter-yak").addEventListener("click", () => {
  defter = { siradaki: HIKAYE_BASLANGIC, gorulen: [], bitisler: [], kesifler: {} };
  defterKaydet();
  saltanatlar = [];
  saltanatlariKaydet();
  defterButonlariGuncelle();
  ekranSec(defterDonus);
});

document.getElementById("secim-a").addEventListener("click", () => secimYap(durum.aktifKart.a));
document.getElementById("secim-b").addEventListener("click", () => secimYap(durum.aktifKart.b));

for (const [id, anahtar] of [["secim-a", "a"], ["secim-b", "b"]]) {
  const btn = document.getElementById(id);
  btn.addEventListener("mouseenter", () => etkiIpucu(anahtar, true));
  btn.addEventListener("mouseleave", () => etkiIpucu(anahtar, false));
}

document.addEventListener("keydown", (e) => {
  const oyunda = !document.getElementById("oyun-ekrani").classList.contains("gizli");
  if (!oyunda || !durum || !durum.aktifKart) return;
  if (e.key === "ArrowLeft") secimYap(durum.aktifKart.a);
  if (e.key === "ArrowRight") secimYap(durum.aktifKart.b);
});

// Açılışta rekor varsa göster, defter düğmelerini hazırla
(function acilis() {
  const rekor = DEPO.getItem("padisahRekor");
  if (rekor) {
    const satir = document.getElementById("rekor-satiri");
    satir.textContent = "En uzun saltanatınız: " + rekor + " yıl";
    satir.classList.remove("gizli");
  }
  defterButonlariGuncelle();
})();
