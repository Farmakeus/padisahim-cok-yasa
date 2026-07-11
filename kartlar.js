// ============================================================
// KART DESTESİ
// Her kartta: konuşan kişi, olay metni ve iki seçenek var.
// Seçeneklerin "etki" alanı dört gücü değiştirir:
//   hazine, ordu, halk, ulema  (+ artırır, - azaltır)
// "minYil"/"maxYil" verilirse kart sadece o aralıkta çıkar.
// ============================================================

const KARTLAR = [
  {
    konusan: "Sadrazam",
    metin: "Devletlü hünkârım, hazine daralıyor. Reayaya yeni vergi salalım mı?",
    a: { yazi: "Vergiyi salın", etki: { hazine: 15, halk: -12 } },
    b: { yazi: "Halkı ezmeyin", etki: { hazine: -8, halk: 8 } },
  },
  {
    konusan: "Yeniçeri Ağası",
    metin: "Kullarınız ulufelerinin artmasını ister. Kazan şimdiden kaynıyor, hünkârım.",
    a: { yazi: "Ulufeleri artır", etki: { hazine: -12, ordu: 12 } },
    b: { yazi: "Kazan devrilsin bakalım", etki: { ordu: -14, hazine: 4 } },
  },
  {
    konusan: "Şeyhülislam",
    metin: "İlim yuvası yeni bir medrese inşası için fermanınızı bekleriz.",
    a: { yazi: "Medreseyi yaptır", etki: { hazine: -10, ulema: 12, halk: 4 } },
    b: { yazi: "Şimdi sırası değil", etki: { ulema: -10 } },
  },
  {
    konusan: "Venedik Elçisi",
    metin: "Cömert dostluğunuz karşılığında tüccarlarımıza ticaret imtiyazı rica ederiz.",
    a: { yazi: "İmtiyazı ver", etki: { hazine: 12, ulema: -6 } },
    b: { yazi: "Reddet", etki: { hazine: -6, ulema: 4 } },
  },
  {
    konusan: "Kaptan-ı Derya",
    metin: "Tersane eskidi, kadırgalar su alıyor. Donanmaya el atmak gerek.",
    a: { yazi: "Donanmayı yenile", etki: { hazine: -14, ordu: 14 }, takip: { id: "donanma_meyvesi", gecikme: 3 } },
    b: { yazi: "Mevcutla idare edin", etki: { ordu: -8 } },
  },
  {
    konusan: "Halktan Biri",
    metin: "Padişahım, kuraklık kapıda. Ambarlar açılsın da bir lokma ekmek bulalım.",
    a: { yazi: "Ambarları aç", etki: { hazine: -10, halk: 14 }, takip: { id: "hasat_haberi", gecikme: 2 } },
    b: { yazi: "Herkes başının çaresine baksın", etki: { halk: -14, ulema: -4 } },
  },
  {
    konusan: "Casus",
    metin: "Vezirlerinizden biri gizlice düşmanla yazışıyor, hünkârım. Mektuplar elimde.",
    a: { yazi: "Boğdurun, malını müsadere edin", etki: { hazine: 8, halk: -6, ulema: -4 } },
    b: { yazi: "Delil sağlam değilse dokunmayın", etki: { ordu: -5, ulema: 4 }, takip: { id: "vezir_akibeti", gecikme: 3 } },
  },
  {
    konusan: "Saray Mimarı",
    metin: "Şehre nakış gibi bir cami çizdim, hünkârım. Ferman sizindir.",
    a: { yazi: "İnşa edilsin", etki: { hazine: -12, ulema: 10, halk: 6 } },
    b: { yazi: "Hazine el vermez", etki: { ulema: -6, halk: -4 } },
  },
  {
    konusan: "Valide Sultan",
    metin: "Arslanım, şehzadeler arasında taht kavgası kokusu alıyorum.",
    a: { yazi: "Sert tedbir al", etki: { ordu: 8, halk: -8, ulema: -6 } },
    b: { yazi: "Kaderine bırak", etki: { ordu: -10, halk: 4 } },
  },
  {
    konusan: "Tüccar",
    metin: "Kervan yolları eşkıya kaynıyor. Muhafız verin ki ticaret can bulsun.",
    a: { yazi: "Yollara muhafız dik", etki: { hazine: -8, halk: 10 } },
    b: { yazi: "Masrafa değmez", etki: { hazine: -6, halk: -8 } },
  },
  {
    konusan: "Kaptan-ı Derya",
    metin: "Korsanlar kıyı köylerini vuruyor. Üzerlerine bir sefer düzenleyelim.",
    a: { yazi: "Sefer düzenle", etki: { hazine: -8, ordu: 10 } },
    b: { yazi: "Denize açılmayın", etki: { ordu: -6, hazine: -6 } },
  },
  {
    konusan: "Şeyhülislam",
    metin: "Kahvehaneler fitne yuvası oldu; millet devlet işlerini konuşuyor. Kapatılsın!",
    a: { yazi: "Kapat", etki: { ulema: 10, halk: -12 } },
    b: { yazi: "Milletin keyfine karışma", etki: { ulema: -10, halk: 8 } },
  },
  {
    konusan: "Defterdar",
    metin: "Akçenin ayarını birazcık düşürsek... Kimse fark etmez, hazine rahatlar.",
    a: { yazi: "Tağşiş yap", etki: { hazine: 14, halk: -10, ordu: -8 } },
    b: { yazi: "Akçenin namusuna dokunma", etki: { hazine: -8, halk: 4 } },
  },
  {
    konusan: "Yabancı Elçi",
    metin: "Güçlü komşunuz haraç talep ediyor. 'Ya altın ya kılıç' diyorlar.",
    a: { yazi: "Altını say", etki: { hazine: -14, halk: -6 } },
    b: { yazi: "Kılıcı seç", etki: { ordu: -12, hazine: -6, ulema: 6, halk: 6 } },
  },
  {
    konusan: "Hekimbaşı",
    metin: "Şehirde veba baş gösterdi. Karantina şart; ama halk homurdanır.",
    a: { yazi: "Karantina ilan et", etki: { hazine: -8, halk: 6, ordu: -4 } },
    b: { yazi: "Dua ile geçer", etki: { ulema: 6, halk: -14 } },
  },
  {
    konusan: "Müneccimbaşı",
    metin: "Yıldızları izlemek için bir rasathane kuralım, hünkârım. İlim şerefi devletindir.",
    a: { yazi: "Rasathaneyi kur", etki: { hazine: -8, ulema: -10, halk: 4 } },
    b: { yazi: "Yıldızlar bizden uzak dursun", etki: { ulema: 8 } },
  },
  {
    konusan: "Valide Sultan",
    metin: "Sultan kızının düğünü görkemli olmalı arslanım. Devletin şanı böyle ister.",
    a: { yazi: "Kırk gün kırk gece şenlik", etki: { hazine: -12, halk: 8 } },
    b: { yazi: "İsraf haramdır", etki: { halk: -6, ulema: 4 } },
  },
  {
    konusan: "Yeniçeri Ağası",
    metin: "Ocağa taze kan lazım. Devşirme için yeni bölgelere çıkalım.",
    a: { yazi: "İzin ver", etki: { ordu: 12, halk: -8 } },
    b: { yazi: "Bu yıl olmaz", etki: { ordu: -8, halk: 6 } },
  },
  {
    konusan: "Sadrazam",
    metin: "Komşu beylik zayıf düştü. Toprakları adeta bize katılmak için yalvarıyor.",
    maxYil: 1600,
    a: { yazi: "Sefere çık", etki: { ordu: 8, hazine: 8, halk: -5, ulema: 4 }, takip: { id: "ilhak_sonucu", gecikme: 2 } },
    b: { yazi: "Sulh içinde kalalım", etki: { halk: 5, ordu: -6 } },
  },
  {
    konusan: "Derviş",
    metin: "Kapıya bir derviş geldi. 'Devletin ömrü adaletledir' diyor, duasını sunuyor.",
    a: { yazi: "Sofraya buyur et", etki: { ulema: 6, halk: 6, hazine: -4 } },
    b: { yazi: "Kapıdan savın", etki: { ulema: -4, halk: -8 } },
  },
  {
    konusan: "Vergi Mültezimi",
    metin: "Vergi toplama işini bana ihale edin, size peşin altın sayayım. Gerisini merak etmeyin.",
    a: { yazi: "Anlaş", etki: { hazine: 12, halk: -10 } },
    b: { yazi: "Reddet ve cezalandır", etki: { ulema: 6, halk: 8, hazine: -4 } },
  },
  {
    konusan: "Sadrazam",
    metin: "Anadolu'da eşkıya türedi; köyler yağmalanıyor, yollar kesiliyor.",
    a: { yazi: "Üzerlerine ordu gönder", etki: { ordu: -8, halk: 8, hazine: -6 } },
    b: { yazi: "Af ilan et", etki: { halk: -8, ordu: -4 } },
  },
  {
    konusan: "Esnaf Kethüdası",
    metin: "Çarşıda fiyatlar ateş pahası. Narh koyun, hünkârım; esnaf da halk da nefes alsın.",
    a: { yazi: "Narh koy", etki: { halk: 10, hazine: -6 } },
    b: { yazi: "Pazara karışma", etki: { halk: -8, hazine: 8 } },
  },
  {
    konusan: "Fransız Elçisi",
    metin: "Kralımız, ortak düşmanlara karşı ittifak teklif ediyor. Dostluğumuz daim olsun.",
    minYil: 1500,
    a: { yazi: "İttifakı kabul et", etki: { ordu: 8, hazine: 6, ulema: -8 } },
    b: { yazi: "Küffar ile ittifak olmaz", etki: { ulema: 6, ordu: -6 } },
  },
  {
    konusan: "Şair",
    metin: "Size bir kaside yazdım hünkârım: 'Cihan serveri, âlem penâhı...' Caizemi beklerim.",
    a: { yazi: "Keseyi uzat", etki: { hazine: -5, halk: 6 } },
    b: { yazi: "Şiir karın doyurmaz", etki: { halk: -5 } },
  },
  {
    konusan: "Kadıasker",
    metin: "Bazı kadılar rüşvetle hüküm satıyor. Adalet yara alırsa devlet de alır.",
    a: { yazi: "Hepsini azlet", etki: { ulema: 8, halk: 8, hazine: -5 } },
    b: { yazi: "Düzen bozulmasın", etki: { ulema: -8, halk: -8 } },
  },
  {
    konusan: "Sadrazam",
    metin: "Bizzat ordunun başında sefere çıkın hünkârım; asker padişahını yanında görsün.",
    a: { yazi: "Sefere çık", etki: { ordu: 12, halk: 5, hazine: -8 }, takip: { id: "sefer_donusu", gecikme: 2 } },
    b: { yazi: "Sarayda işim çok", etki: { ordu: -10, halk: -4 } },
  },
  {
    konusan: "Nişancı",
    metin: "Tımar defterleri karman çorman. Sistemi elden geçirmenin vakti geldi.",
    a: { yazi: "Islah et", etki: { ordu: 10, hazine: -6 } },
    b: { yazi: "Eski hamam eski tas", etki: { ordu: -6 } },
  },
  {
    konusan: "Şeyhülislam",
    metin: "Meyhaneler kapatılsın, içki yasak edilsin! Fetvam hazır, ferman sizden.",
    a: { yazi: "Yasak ferman et", etki: { ulema: 10, halk: -8, hazine: -6 } },
    b: { yazi: "Görmezden gel", etki: { ulema: -10, halk: 6, hazine: 4 } },
  },
  {
    konusan: "Haberci",
    metin: "Payitahtta büyük yangın! Üç mahalle kül oldu, halk sokakta.",
    a: { yazi: "Hazineden yeniden inşa et", etki: { hazine: -12, halk: 10 } },
    b: { yazi: "Herkes kendi evine baksın", etki: { halk: -12 } },
  },
  {
    konusan: "Haberci",
    metin: "Zelzele! Şehirler harap, minareler devrildi, halk meydanlarda geceliyor.",
    a: { yazi: "Yardım kervanları gönder", etki: { hazine: -10, halk: 10, ulema: 4 } },
    b: { yazi: "Devletin işi savaştır", etki: { halk: -12, ulema: -6 } },
  },
  {
    konusan: "Serdar",
    metin: "Seferden zaferle döndük hünkârım! Ganimet nasıl pay edilsin?",
    a: { yazi: "Askere dağıt", etki: { ordu: 12, hazine: 4 } },
    b: { yazi: "Hazineye kaldır", etki: { hazine: 14, ordu: -8 } },
  },
  {
    konusan: "Topçubaşı",
    metin: "Frengistan'dan top döküm ustaları gelmiş. Pahalı adamlar ama maharetli.",
    minYil: 1400,
    a: { yazi: "Ustaları hizmete al", etki: { hazine: -10, ordu: 14 } },
    b: { yazi: "Bizim toplar yeter", etki: { ordu: -10 } },
  },
  {
    konusan: "Bostancıbaşı",
    metin: "Sarayda israf diz boyu, hünkârım. Mutfağın masrafı bir orduyu doyurur.",
    a: { yazi: "Masrafları kıs", etki: { hazine: 10, halk: 4 } },
    b: { yazi: "Devletin şanındandır", etki: { hazine: -10, halk: -4 } },
  },
  {
    konusan: "Ulak",
    metin: "Sınır boyundaki paşa, yetkilerini aşıp kendi adına vergi topluyormuş.",
    a: { yazi: "Azledip sürgün et", etki: { ordu: -6, hazine: 6, halk: 6 } },
    b: { yazi: "Gücü elinde tutsun, sadık kalsın", etki: { ordu: 6, hazine: -6, halk: -6 } },
  },
  {
    konusan: "Reisülküttap",
    metin: "Komşu devlet elçisi huzura kabul bekliyor. Aylardır kapıda oyalanıyor.",
    a: { yazi: "Huzura kabul et", etki: { ulema: -4, hazine: 6 } },
    b: { yazi: "Biraz daha beklesin", etki: { hazine: -5, ordu: 4 } },
  },
  {
    konusan: "Halktan Biri",
    metin: "Mahallede yetimler aç, dullar kimsesiz. Bir imaret açılsa da çorba kaynasa...",
    a: { yazi: "İmareti aç", etki: { hazine: -8, halk: 10, ulema: 6 } },
    b: { yazi: "Vakıflar baksın", etki: { halk: -6 } },
  },
  {
    konusan: "Defterdar",
    metin: "Mısır'dan yıllık vergi gemisi limana yanaştı — ambarına kadar dolu, hünkârım.",
    minYil: 1517,
    a: { yazi: "Hazineye aktar", etki: { hazine: 12 } },
    b: { yazi: "Donanmaya harca", etki: { ordu: 10 } },
  },
  {
    konusan: "Gümrük Emini",
    metin: "Baharat kervanları kapıdan geçip duruyor. Gümrüğü artırsak kimse yolunu değiştirmez.",
    a: { yazi: "Gümrüğü artır", etki: { hazine: 10, halk: -4 } },
    b: { yazi: "Ticarete dokunma", etki: { halk: 4, hazine: -4 } },
  },
  {
    konusan: "Nişancı",
    metin: "Dağınık örfî hükümleri tek kanunnamede derleyelim; kadılar önünü görsün.",
    a: { yazi: "Kanunnameyi derle", etki: { halk: 8, ulema: -6, hazine: -4 } },
    b: { yazi: "Şeriat kâfidir", etki: { ulema: 4, halk: -6 } },
  },
  {
    konusan: "Lala",
    metin: "Şehzade delikanlı oldu, hünkârım. Kılıçla mı yetişsin, kalemle mi?",
    a: { yazi: "Serhatta yetişsin", etki: { ordu: 8, ulema: -4 } },
    b: { yazi: "Enderun'da okusun", etki: { ulema: 6, hazine: -4 } },
  },
  {
    konusan: "Sürre Emini",
    metin: "Hac kervanı yola çıkmak üzere. Haremeyn'e gidecek hediyeler her yıldan cömert olsun mu?",
    a: { yazi: "Cömert olsun", etki: { hazine: -10, ulema: 10, halk: 4 } },
    b: { yazi: "Bu yıl mütevazı gitsin", etki: { ulema: -8, hazine: 4 } },
  },
  {
    konusan: "Yabancı Elçi",
    metin: "Esir mübadelesi öneriyoruz: sizin paşalarınız, bizim kaptanlarımıza karşılık.",
    a: { yazi: "Mübadeleyi kabul et", etki: { ordu: 6, hazine: -6 } },
    b: { yazi: "Esirlerimiz sabretsin", etki: { ordu: -6 } },
  },
  {
    konusan: "Darphane Emini",
    metin: "Yeni sikkeler basılacak. Tuğranız daha heybetli olsun derim; usta pahalı ama iş sanat.",
    a: { yazi: "Sanatına para verilir", etki: { hazine: -6, halk: 6 } },
    b: { yazi: "Eski kalıp iş görür", etki: { hazine: 4 } },
  },
  {
    konusan: "Sadrazam",
    metin: "Frengistan payitahtlarında daimi elçilikler açalım; dünya dönüyor, biz de görelim.",
    minYil: 1650,
    a: { yazi: "Elçilikleri aç", etki: { hazine: -8, ordu: 6, ulema: -6 } },
    b: { yazi: "Frenk'ten öğrenecek şeyimiz yok", etki: { ulema: 4, ordu: -6 } },
  },
  {
    konusan: "Nedim",
    metin: "Lale bahçeleri, helva sohbetleri, sazendeler... Şenlikler yalnız saraya mı kalsın hünkârım?",
    minYil: 1700,
    a: { yazi: "Halk da şenliğe ortak olsun", etki: { hazine: -12, halk: 10 } },
    b: { yazi: "Yalnız saraya", etki: { hazine: -6, halk: -8 } },
  },
  {
    konusan: "Tersane Emini",
    metin: "Frenk gemi mühendisleri hizmet teklif ediyor. Ulema 'küffar tersaneye giremez' diyor.",
    minYil: 1700,
    a: { yazi: "Mühendisleri al", etki: { hazine: -8, ordu: 12, ulema: -6 } },
    b: { yazi: "Kendi ustamız yeter", etki: { ordu: -8 } },
  },
  {
    konusan: "Kadı",
    metin: "Medrese softaları çarşıda taşkınlık ediyor; esnaf bizar, hünkârım.",
    a: { yazi: "Falakaya yatırın", etki: { ulema: -8, halk: 6 } },
    b: { yazi: "Hocalarına havale et", etki: { ulema: 6, halk: -4 } },
  },
  {
    konusan: "Esnaf Kethüdası",
    metin: "Loncalar taşradan gelen zanaatkârları istemiyor: 'Ekmeğimizi bölüyorlar' diyorlar.",
    a: { yazi: "Loncaları koru", etki: { halk: 6, hazine: -6 } },
    b: { yazi: "Çalışmak isteyen çalışır", etki: { hazine: 8, halk: -6 } },
  },
  {
    konusan: "Kadıasker",
    metin: "Bir paşa, fakir bir ailenin tarlasına zorla el koymuş. Dava huzurunuza geldi.",
    a: { yazi: "Paşayı cezalandır", etki: { halk: 10, ordu: -6 } },
    b: { yazi: "Paşanın hatırı vardır", etki: { ordu: 6, halk: -10, ulema: -4 } },
  },
  {
    konusan: "Kapı Ağası",
    metin: "Haremde iki taife birbirine girdi; dedikodu saray duvarlarını aştı, hünkârım.",
    a: { yazi: "Elebaşıları taşra saraylarına gönder", etki: { ulema: 4, halk: 4, hazine: -4 } },
    b: { yazi: "Saray işi sarayda kalır", etki: { ulema: -6, halk: -4 } },
  },
  {
    konusan: "Şehremini",
    metin: "Ramazan geliyor. Minarelere mahya kurulsun, iftar topları gürlesin mi?",
    a: { yazi: "Şehir donansın", etki: { hazine: -6, halk: 8, ulema: 6 } },
    b: { yazi: "Kandil yağı da paradır", etki: { ulema: -6, halk: -4, hazine: 4 } },
  },
  {
    konusan: "Su Nazırı",
    metin: "Kemerler çatladı; mahalle çeşmeleri kurudu kuruyacak.",
    a: { yazi: "Kemerleri onar", etki: { hazine: -10, halk: 10 } },
    b: { yazi: "Sonraya kalsın", etki: { halk: -10 } },
  },
  {
    konusan: "Taşra Valisi",
    metin: "Bir yalancı mehdi türedi; köylüler tarlayı bırakıp peşine düşüyor.",
    a: { yazi: "Üzerine asker gönder", etki: { halk: -8, ulema: 6 } },
    b: { yazi: "İkna heyeti gitsin", etki: { ulema: 4, halk: 4, hazine: -4 } },
  },
  {
    konusan: "Hekimbaşı",
    metin: "Venedik'ten namlı bir hekim getirtmek isterim. Ulema 'saraya küffar giremez' diye homurdanıyor.",
    a: { yazi: "Hekimi getirt", etki: { ulema: -8, halk: 4, hazine: -4 } },
    b: { yazi: "Bizim hekimler yeter", etki: { ulema: 6 } },
  },
  {
    konusan: "Kaptan",
    metin: "Size cihanın haritasını hediye ediyorum hünkârım. Üzerinde yeni ticaret rotaları var.",
    minYil: 1500,
    a: { yazi: "Yeni rotaları dene", etki: { hazine: 10, ordu: -4 } },
    b: { yazi: "Eski yollar emindir", etki: { hazine: -4 } },
  },
  {
    konusan: "Kuyumcubaşı",
    metin: "Taht için murassa bir sorguç işledim: üç yüz elmas, bir o kadar yakut...",
    a: { yazi: "Devletin şanıdır, al", etki: { hazine: -8, halk: 4, ulema: -4 } },
    b: { yazi: "Elmas ordu doyurmaz", etki: { hazine: 4 } },
  },
  {
    konusan: "Sahaf",
    metin: "Frengistan'dan kaçak kitaplar geliyor; gençler el altından okuyor, hünkârım.",
    minYil: 1600,
    a: { yazi: "Göz yum", etki: { halk: 6, ulema: -8 } },
    b: { yazi: "Toplatıp yaktır", etki: { ulema: 8, halk: -6 } },
  },
  {
    konusan: "Defterdar",
    metin: "Kaydı düşmüş vakıf arazileri var. Hazineye devredilse kimin ruhu duyar?",
    a: { yazi: "Hazineye devret", etki: { hazine: 12, ulema: -10 } },
    b: { yazi: "Vakıf malına el sürülmez", etki: { ulema: 6, hazine: -6 } },
  },
  {
    konusan: "Serasker",
    metin: "Avrupa usulü talimli yeni birlikler kuralım. Yeniçeriler kıskanır ama devlet kazanır.",
    minYil: 1750,
    a: { yazi: "Yeni birlikleri kur", etki: { ordu: 10, hazine: -10 } },
    b: { yazi: "Ocağı gücendirme", etki: { ordu: -8 } },
  },
  {
    konusan: "Nazır",
    metin: "Bir Frenk şirketi demiryolu imtiyazı istiyor. Ray döşenir, ticaret canlanır... ama toprak onların hattı olur.",
    minYil: 1850,
    a: { yazi: "İmtiyazı ver", etki: { hazine: 10, halk: 4, ulema: -6 } },
    b: { yazi: "Reddet", etki: { hazine: -6, halk: -4 } },
  },
  {
    konusan: "Matbuat Müdürü",
    metin: "Gazeteler dilini fena sivriltti, hünkârım. Sansür buyurur musunuz?",
    minYil: 1840,
    a: { yazi: "Sansürle", etki: { halk: -10, ulema: 4 } },
    b: { yazi: "Yazsınlar bakalım", etki: { halk: 8, ulema: -6 } },
  },
  {
    konusan: "İskân Memuru",
    metin: "Kafkasya'dan muhacir kafileleri geliyor: yorgun, aç, umutlu. İskân ferman ister.",
    minYil: 1780,
    a: { yazi: "Toprak ver, iskân et", etki: { hazine: -8, halk: 8 } },
    b: { yazi: "Sınırda beklesinler", etki: { halk: -8, ulema: -4 } },
  },
  {
    konusan: "Hekimbaşı",
    metin: "Kolera Galata'yı sardı. Karantina teşkilatı kuralım; tez elden, hünkârım.",
    minYil: 1800,
    a: { yazi: "Teşkilatı kur", etki: { hazine: -8, halk: 8 } },
    b: { yazi: "Masraftan kaçın", etki: { halk: -12 } },
  },
  {
    konusan: "Fener Patriği",
    metin: "Eskiyen kiliselerimizin tamiri için fermanınızı rica ediyorum, hünkârım.",
    a: { yazi: "Ferman ver", etki: { halk: 6, ulema: -6 } },
    b: { yazi: "Reddet", etki: { halk: -6, ulema: 6 } },
  },
  {
    konusan: "Haseki Sultan",
    metin: "Vezirleriniz kızlarını şehzadelere vermek için yarışıyor, hünkârım. Hangi aileyle bağ kuralım?",
    minYil: 1450,
    a: { yazi: "Güçlü paşanın kızı", etki: { ordu: 6, halk: -4 } },
    b: { yazi: "Zengin tüccar ailesi", etki: { hazine: 8, ulema: -4 } },
  },
  {
    konusan: "Darüssaade Ağası",
    metin: "Harem vakıflarının geliri bu yıl bereketli, hünkârım. Haremeyn'e mi gönderelim, saray masrafına mı kalsın?",
    minYil: 1574,
    a: { yazi: "Haremeyn'e gitsin", etki: { ulema: 8, hazine: -4 } },
    b: { yazi: "Saray masrafına kalsın", etki: { hazine: 8, ulema: -6 } },
  },
  {
    konusan: "Ulak",
    metin: "Şehzadelerden biri taşrada asker topluyormuş. Niyeti taht, öyle diyorlar, hünkârım.",
    a: { yazi: "Üzerine ordu gönder", etki: { ordu: -4 }, takip: { id: "sehzade_savasi", gecikme: 2 } },
    b: { yazi: "Affet, payitahta çağır", etki: { halk: 4 }, takip: { id: "sehzade_sarayda", gecikme: 3 } },
  },
  {
    konusan: "Venedik Elçisi",
    metin: "Serenissima'nın kasası dardaymış; büyük bir borç rica ediyorlar. Faiziyle ödeyecekler, söz.",
    a: { yazi: "Borcu ver", etki: { hazine: -12 }, takip: { id: "borc_donusu", gecikme: 3 } },
    b: { yazi: "Devlet tefeci değildir", etki: { ulema: 4 } },
  },
];

// ============================================================
// AKIBET KARTLARI — zincirleme olayların dönüşü.
// Bir seçimin "takip" alanı bu kartlardan birini kuyruğa ekler;
// "gecikme" kadar karar sonra kart döner ve "kosul"daki güç o an
// eşiğin üstündeyse "iyi", altındaysa "kotu" yüzüyle açılır.
// ============================================================

const TAKIP_KARTLARI = {
  sefer_donusu: {
    kosul: { guc: "ordu", esik: 55 },
    iyi: {
      akibet: true,
      konusan: "Serdar",
      metin: "Zafer, hünkârım! Sancaklar önde, ganimet arkada döndük. Asker meydanda sizi bekliyor.",
      a: { yazi: "Ganimeti askere dağıt", etki: { ordu: 10, hazine: 4 } },
      b: { yazi: "Hazineye kaldır", etki: { hazine: 14, ordu: -6 } },
    },
    kotu: {
      akibet: true,
      konusan: "Haberci",
      metin: "Kara haber... Ordumuz bozguna uğradı; serdar esir düştü, sancaklar düşman elinde.",
      a: { yazi: "Fidyeyi öde, esirleri kurtar", etki: { hazine: -12, halk: 6, ordu: 4 } },
      b: { yazi: "Bozgunun hesabını sor", etki: { ordu: -8, halk: -6 } },
    },
  },
  ilhak_sonucu: {
    kosul: { guc: "ordu", esik: 50 },
    iyi: {
      akibet: true,
      konusan: "Serdar",
      metin: "Beylik direnmeden katıldı, hünkârım. Beyleri sancak beyi olmak için biat kuyruğunda.",
      a: { yazi: "Biatlarını kabul et", etki: { hazine: 10, ordu: 6, ulema: 4 } },
      b: { yazi: "Toprakları doğrudan yönet", etki: { hazine: 14, halk: -6 } },
    },
    kotu: {
      akibet: true,
      konusan: "Haberci",
      metin: "Beylik umulandan çetin çıktı; dağlarında ordumuz eriyip gidiyor, hünkârım.",
      a: { yazi: "Kuşatmayı sürdür", etki: { ordu: -10, hazine: -8 } },
      b: { yazi: "Utançla geri çekil", etki: { ordu: -6, ulema: -4, halk: -4 } },
    },
  },
  vezir_akibeti: {
    kosul: { guc: "ulema", esik: 45 },
    iyi: {
      akibet: true,
      konusan: "Casus",
      metin: "İzledik, hünkârım: o yazışmalar iftiraymış. Vezir sadık çıktı; iftiracıyı da bulduk.",
      a: { yazi: "İftiracıyı sürgüne yolla", etki: { ulema: 6, ordu: 6 } },
      b: { yazi: "İbret için idam ettir", etki: { ordu: 4, halk: -6 } },
    },
    kotu: {
      akibet: true,
      konusan: "Casus",
      metin: "Vezir bu gece kaçtı, hünkârım — devletin sırlarını da heybesinde götürdü.",
      a: { yazi: "Peşine akıncı sal", etki: { ordu: -6, hazine: -6 } },
      b: { yazi: "Gitsin; kalanları sıkı izlet", etki: { ordu: -4, ulema: -4 } },
    },
  },
  donanma_meyvesi: {
    kosul: { guc: "hazine", esik: 40 },
    iyi: {
      akibet: true,
      konusan: "Kaptan-ı Derya",
      metin: "Yeni kadırgalar ilk seferinde korsan yataklarını dağıttı; ticaret yolları güvende, hünkârım.",
      a: { yazi: "Kaptanları ödüllendir", etki: { hazine: 8, ordu: 6 } },
      b: { yazi: "Hemen yeni sefere yolla", etki: { ordu: 8 } },
    },
    kotu: {
      akibet: true,
      konusan: "Tersane Emini",
      metin: "Akçe yetmedi, hünkârım; yarım kalan gemiler kızakta çürüyor.",
      a: { yazi: "Ne pahasına olursa olsun bitir", etki: { hazine: -10, ordu: 8 } },
      b: { yazi: "Projeyi rafa kaldır", etki: { ordu: -8 } },
    },
  },
  hasat_haberi: {
    kosul: { guc: "halk", esik: 50 },
    iyi: {
      akibet: true,
      konusan: "Halktan Biri",
      metin: "Açtığınız ambarlar can oldu, padişahım; millet tarlasına döndü, hasat bereketli!",
      a: { yazi: "Şükür şenliği kur", etki: { halk: 8, hazine: -4 } },
      b: { yazi: "Fazlayı ambara geri koy", etki: { hazine: 10 } },
    },
    kotu: {
      akibet: true,
      konusan: "Taşra Valisi",
      metin: "Dağıtılan tohumluk da yenmiş, hünkârım; kıtlık sürüyor, köyler boşalıyor.",
      a: { yazi: "Bir kez daha yardım gönder", etki: { hazine: -8, halk: 6 } },
      b: { yazi: "Artık kendi başlarına", etki: { halk: -10 } },
    },
  },
  sehzade_savasi: {
    kosul: { guc: "ordu", esik: 50 },
    iyi: {
      akibet: true,
      konusan: "Serdar",
      metin: "İsyan bastırıldı; şehzade huzurunuza zincirle getirildi, hünkârım. Ferman sizindir.",
      a: { yazi: "Kardeş kanı dökülmesin: Kafes'e", etki: { halk: 4, ulema: 4 } },
      b: { yazi: "Devletin bekası için boğdur", etki: { ordu: 6, halk: -8, ulema: -6 } },
    },
    kotu: {
      akibet: true,
      konusan: "Haberci",
      metin: "Ordunuz şehzadeye yenildi, hünkârım! Anadolu ikiye bölünmüş durumda.",
      a: { yazi: "Yeniden ordu topla", etki: { hazine: -12, ordu: 6 } },
      b: { yazi: "Taht ortaklığı teklif et", etki: { ordu: -8, ulema: -8, halk: -4 } },
    },
  },
  sehzade_sarayda: {
    kosul: { guc: "halk", esik: 50 },
    iyi: {
      akibet: true,
      konusan: "Kapı Ağası",
      metin: "Affınız şehzadeyi yumuşattı, hünkârım; sarayda sadakatle hizmet ediyor.",
      a: { yazi: "Ona bir sancak ver", etki: { ordu: 6, halk: 4 } },
      b: { yazi: "Gözünün önünde tut", etki: { ulema: 4 } },
    },
    kotu: {
      akibet: true,
      konusan: "Kapı Ağası",
      metin: "Şehzade sarayda hizip kuruyor; harem ikiye bölündü, koridorlar fısıltı dolu.",
      a: { yazi: "Sürgüne gönder", etki: { halk: -6, ordu: 4 } },
      b: { yazi: "Hizbini satın al", etki: { hazine: -10 } },
    },
  },
  borc_donusu: {
    kosul: { guc: "ordu", esik: 45 },
    iyi: {
      akibet: true,
      konusan: "Venedik Elçisi",
      metin: "Borcunuz faiziyle ödendi, hünkârım; üstüne dostluk hediyeleri de geldi.",
      a: { yazi: "Parayı hazineye koy", etki: { hazine: 18 } },
      b: { yazi: "Ticaret anlaşmasına çevir", etki: { hazine: 10, ordu: 4 } },
    },
    kotu: {
      akibet: true,
      konusan: "Venedik Elçisi",
      metin: "Hangi borç, hünkârım? Senette imza göremiyoruz... Deniz de bu mevsim çok bulanık.",
      a: { yazi: "Donanmayı Adriyatik'e yolla", etki: { ordu: -8, hazine: 8 } },
      b: { yazi: "Yut ve unut", etki: { hazine: -4, halk: -4 } },
    },
  },
};

// ============================================================
// TARİHÎ OLAYLAR — her biri bir kez, tarihi geldiğinde çıkar.
// ============================================================

const TARIHI_KARTLAR = [
  {
    id: "koyunhisar",
    yil: 1302,
    konusan: "Alp Gazi",
    metin: "Bizans tekfurları birleşip üzerimize geliyor, Beyim! Koyunhisar önlerinde karşılaşabiliriz.",
    a: { yazi: "Karşılarına çık", etki: { ordu: 10, ulema: 6, hazine: -4 } },
    b: { yazi: "Dağlara çekil", etki: { ordu: -8, halk: -6 } },
  },
  {
    id: "rumeli",
    yil: 1352,
    konusan: "Süleyman Paşa",
    metin: "Gelibolu'ya sallarla geçip Rumeli'de köprübaşı tutabiliriz. Avrupa kapısı aralık, Beyim.",
    a: { yazi: "Rumeli'ye geç", etki: { ordu: 10, hazine: 8, ulema: 6 } },
    b: { yazi: "Anadolu'da kalalım", etki: { ordu: -8, ulema: -6 } },
  },
  {
    id: "ankara",
    yil: 1402,
    konusan: "Sadrazam",
    metin: "Timur, ordusu ve savaş filleriyle Anadolu'ya girdi. Gönderdiği mektup hakaret dolu, hünkârım.",
    a: { yazi: "Ankara ovasında karşıla", etki: { ordu: -18, hazine: -10, halk: -8 } },
    b: { yazi: "Boyun eğ, haraç öde", etki: { hazine: -16, ulema: -10, halk: -8 } },
  },
  {
    id: "istanbul",
    yil: 1453,
    konusan: "Akşemseddin",
    metin: "Konstantiniyye... Hadiste müjdelenen fetih sizi bekliyor, hünkârım. Ordu hazır, toplar döküldü.",
    a: { yazi: "Surları kuşat", etki: { hazine: -8 }, kampanya: "istanbul" },
    b: { yazi: "Bu iş bize büyük", etki: { ordu: -12, ulema: -14, halk: -8 } },
  },
  {
    id: "halifelik",
    yil: 1517,
    konusan: "Sadrazam",
    metin: "Mısır fethedildi! Hilafet ve Kutsal Emanetler size intikal ediyor, hünkârım.",
    a: { yazi: "Hilafeti üstlen", etki: { ulema: 16, halk: 8, hazine: 10 } },
    b: { yazi: "Mısır'da kalsın", etki: { ulema: -12 } },
  },
  {
    id: "viyana1",
    yil: 1529,
    konusan: "Serdar",
    metin: "Ordu Viyana surları önünde. Lakin kış yaklaşıyor ve ağır toplar çamura saplandı, hünkârım.",
    a: { yazi: "Kuşatmayı sürdür", etki: { hazine: -8 }, kampanya: "viyana" },
    b: { yazi: "Baharda dönmek üzere çekil", etki: { ordu: -4, halk: -4 } },
  },
  {
    id: "hurrem_nikah",
    yil: 1534,
    konusan: "Hürrem Sultan",
    metin: "Hünkârım, cariyeniz olarak değil, nikâhlı eşiniz olarak yanınızda durmak isterim. Asırlardır hiçbir padişah bunu yapmadı, biliyorum. Siz hiçbir padişaha benzemezsiniz ki.",
    a: { yazi: "Nikâhla al, düğün kurulsun", etki: { hazine: -8, ulema: -8, halk: 8 } },
    b: { yazi: "Gelenek bozulmaz", etki: { halk: -4, ulema: 6 } },
  },
  {
    id: "ibrahim_pasa",
    yil: 1536,
    konusan: "Hürrem Sultan",
    metin: "Makbul İbrahim'e artık 'Serasker Sultan' diyorlar, hünkârım. Bir kul kendine 'sultan' dedirtiyorsa, tahta gölgesi düşmüş demektir...",
    a: { yazi: "Boğdur, malını müsadere et", etki: { hazine: 10, ordu: -8, ulema: -4 } },
    b: { yazi: "Sadrazamıma güvenirim", etki: { ordu: 6, ulema: 4 } },
  },
  {
    id: "preveze",
    yil: 1538,
    konusan: "Barbaros Hayreddin Paşa",
    metin: "Haçlı donanması Preveze önünde toplandı; sayıca üstünler. Ama rüzgâr bizden yana, hünkârım.",
    a: { yazi: "Hücum emri ver", etki: { ordu: 12, ulema: 6, hazine: 6 } },
    b: { yazi: "Riske girme, çekil", etki: { ordu: -10, ulema: -6 } },
  },
  {
    id: "mihrimah_camii",
    yil: 1548,
    konusan: "Mihrimah Sultan",
    metin: "Hünkârım, Üsküdar'a kendi kesemden bir cami yaptırmak istiyorum. Mimar Sinan çizimleri hazırladı bile — bir sözünüze bakar.",
    a: { yazi: "İzin ver, hayra vesile olsun", etki: { ulema: 8, halk: 6 } },
    b: { yazi: "Şimdi sırası değil", etki: { ulema: -4, halk: -4 } },
  },
  {
    id: "sehzade_mustafa",
    yil: 1553,
    konusan: "Rüstem Paşa",
    metin: "Şehzade Mustafa askerin gözdesi, hünkârım; yeniçeriler ona şimdiden 'genç padişah' diyor. Sefer yolunda otağınıza çağırın... gerisini fermanınız bilir.",
    a: { yazi: "Otağda boğdur", etki: { ordu: -10, halk: -10, ulema: -6 } },
    b: { yazi: "Evlat katline girmem", etki: { halk: 6, ulema: 4 }, takip: { id: "sehzade_savasi", gecikme: 3 } },
  },
  {
    id: "inebahti",
    yil: 1571,
    konusan: "Kaptan-ı Derya",
    metin: "Donanma İnebahtı'da yandı, hünkârım. Ama unutmayın: bu devletin tersaneleri kışın boş durmaz.",
    a: { yazi: "Altı ayda yeni donanma yap", etki: { hazine: -15, ordu: 12 } },
    b: { yazi: "Denizleri kaderine bırak", etki: { ordu: -15, halk: -6 } },
  },
  {
    id: "safiye_org",
    yil: 1599,
    konusan: "Safiye Sultan",
    metin: "İngiltere Kraliçesi Elizabeth'ten nameler ve hediyeler geldi, arslanım: bana murassa bir araba, size çalar bir org! Karşılığında tüccarlarına imtiyaz umuyorlar.",
    a: { yazi: "İmtiyazı ver, dostluk kurulsun", etki: { hazine: 10, ulema: -6 } },
    b: { yazi: "Hediyeler kalsın, imtiyaz olmaz", etki: { hazine: 4, ulema: 4 } },
  },
  {
    id: "sultanahmet",
    yil: 1609,
    konusan: "Sedefkâr Mehmed Ağa",
    metin: "Adınıza öyle bir cami çizdim ki, hünkârım: altı minare! Kimileri 'Kâbe ile yarışılmaz' diye söyleniyor.",
    a: { yazi: "İnşa edilsin", etki: { hazine: -14, ulema: 10, halk: 8 } },
    b: { yazi: "Bu israfa ferman veremem", etki: { ulema: -8 } },
  },
  {
    id: "kosem_naibe",
    yil: 1623,
    konusan: "Kösem Sultan",
    metin: "Oğlum henüz on bir yaşında tahta oturdu. Devleti perde ardından ben çekip çeviririm — divana kafes arkasından katılırım, kimse yadırgamasın.",
    a: { yazi: "Valide naibe olsun", etki: { hazine: 6, halk: 4, ulema: -6 } },
    b: { yazi: "Vezirler yönetsin", etki: { ordu: -6, hazine: -6 } },
  },
  {
    id: "kosem_turhan",
    yil: 1651,
    konusan: "Turhan Sultan",
    metin: "Büyük Valide, torununun tahtı için beni hiçe sayıyor; ocak ağaları onun adamı. Sarayda iki güneş olmaz, hünkârım — birimiz gölgeye çekilmeli.",
    a: { yazi: "Turhan'ın yanında dur", etki: { ordu: -8, hazine: 6, halk: 4 } },
    b: { yazi: "Kösem'in tecrübesine yaslan", etki: { ordu: 6, halk: -6, hazine: -6 } },
  },
  {
    id: "koprulu",
    yil: 1656,
    konusan: "Turhan Sultan",
    metin: "Devlet çöküyor: Girit'te savaş, hazinede delik, kapıda isyan. İhtiyar Köprülü Mehmed tam yetki istiyor. Verirsem kendi gücümden vazgeçmiş olurum... ama devlet kurtulur belki.",
    a: { yazi: "Köprülü'ye tam yetki ver", etki: { ordu: 10, hazine: 8, halk: -4, ulema: 4 } },
    b: { yazi: "Gücü sarayda tut", etki: { ordu: -8, hazine: -8 } },
  },
  {
    id: "viyana2",
    yil: 1683,
    konusan: "Merzifonlu Kara Mustafa Paşa",
    metin: "Viyana bu kez düşecek, hünkârım! Bana tam yetki verin, kızıl elmayı getireyim.",
    a: { yazi: "Yetkiyi ver, kuşatsın", etki: { ordu: -16, hazine: -12, halk: -8 } },
    b: { yazi: "Bu kuşatmaya izin verme", etki: { ordu: -5, ulema: -4 } },
  },
  {
    id: "matbaa",
    yil: 1727,
    konusan: "İbrahim Müteferrika",
    metin: "Matbaa ile kitaplar çoğalır, ilim yayılır hünkârım. Hattatlar ayaklandı ama fetva da hazır.",
    a: { yazi: "Matbaaya izin ver", etki: { halk: 10, ulema: -8, hazine: -4 } },
    b: { yazi: "Yasakla gitsin", etki: { ulema: 8, halk: -8 } },
  },
  {
    id: "patrona",
    yil: 1730,
    konusan: "Haberci",
    metin: "Patrona Halil adında bir tellak ayaklandı! Kalabalık, Lale Devri'nin köşklerini yakıyor; sadrazamın kellesini istiyorlar.",
    a: { yazi: "İsyancılarla pazarlık et", etki: { halk: 6, ordu: -6, hazine: -6 } },
    b: { yazi: "Kanla bastır", etki: { halk: -12, ordu: -6 } },
  },
  {
    id: "vakaihayriye",
    yil: 1826,
    konusan: "Sadrazam",
    metin: "Yeniçeri Ocağı çürüdü: talimsiz, isyancı, başına buyruk. Kaldırmak kanlı olur ama şart, hünkârım.",
    a: { yazi: "Ocağı kaldır", etki: { ordu: 12, hazine: -10, halk: 6, ulema: 4 } },
    b: { yazi: "Ocağa dokunma", etki: { ordu: -14 } },
  },
  {
    id: "tanzimat",
    yil: 1839,
    konusan: "Mustafa Reşid Paşa",
    metin: "Gülhane'de fermanı okuyalım: can, mal ve namus güvencesi — hangi dinden olursa olsun herkese.",
    a: { yazi: "Fermanı ilan et", etki: { halk: 12, ulema: -10, hazine: -6 } },
    b: { yazi: "Eski düzen sürsün", etki: { halk: -10, ordu: -6 } },
  },
  {
    id: "dysborc",
    yil: 1854,
    konusan: "Defterdar",
    metin: "Savaş masrafları altından kalkılır gibi değil. İngiliz ve Fransız bankerler borç vermeye pek hevesli.",
    a: { yazi: "Borcu al", etki: { hazine: 16, ulema: -6, halk: -4 } },
    b: { yazi: "Kemerleri sık", etki: { hazine: -12, halk: -6 } },
  },
  {
    id: "suveys",
    yil: 1869,
    konusan: "Hariciye Nazırı",
    metin: "Süveyş Kanalı açılıyor; dünya ticareti yön değiştirecek. Törene davetliyiz, hünkârım.",
    a: { yazi: "Katıl, yeni rotalara yatırım yap", etki: { hazine: 8, ulema: -4 } },
    b: { yazi: "Frenk şenliğine gitmem", etki: { hazine: -8 } },
  },
  {
    id: "mesrutiyet",
    yil: 1876,
    konusan: "Mithat Paşa",
    metin: "Kanun-i Esasi hazır, hünkârım. Meclis açılsın; millet kendi sözünü kendi söylesin.",
    a: { yazi: "Meşrutiyeti ilan et", etki: { halk: 12, ulema: -8 } },
    b: { yazi: "Meclisi reddet", etki: { halk: -12, ordu: -6 } },
  },
  {
    id: "balkan",
    yil: 1912,
    konusan: "Harbiye Nazırı",
    metin: "Balkan devletleri aleyhimize ittifak kurdu. Ordu ise siyasete bölünmüş vaziyette, hünkârım.",
    a: { yazi: "Savaş", etki: { ordu: -14, halk: -8, hazine: -10 } },
    b: { yazi: "Toprak verip barış iste", etki: { halk: -12, ordu: -4, hazine: -4 } },
  },
  {
    id: "cihanharbi",
    yil: 1914,
    konusan: "Enver Paşa",
    metin: "Almanya ile ittifak fırsatı, hünkârım! İki zırhlı gemi hediye bile geldi.",
    a: { yazi: "Harbe gir", etki: { ordu: -12, hazine: -12, halk: -10 } },
    b: { yazi: "Tarafsız kalmaya çalış", etki: { hazine: 6, halk: 6, ordu: -6 } },
  },
];

// ============================================================
// ANİ OLAYLAR — süreli tepki kartları.
// "sure" saniye cinsinden karar süresidir; dolarsa "gecikme"
// etkisi uygulanır. Metinler kısa: okunup karar verilebilmeli.
// ============================================================

const TEPKI_KARTLARI = [
  {
    tepki: true, sure: 4,
    konusan: "Silahtar",
    metin: "Perdenin ardında hançer parıltısı — suikastçı!",
    a: { yazi: "Kılıcını çek, atıl", etki: { ordu: 8, halk: 6 } },
    b: { yazi: "Geri çekil, muhafız çağır", etki: { ordu: 4 } },
    gecikme: { etki: { halk: -8, ordu: -6 } },
  },
  {
    tepki: true, sure: 4,
    konusan: "Muhafız",
    metin: "Cuma selamlığında bir adam kalabalıktan fırladı, size koşuyor!",
    a: { yazi: "Yakalatıp uzaklaştır", etki: { ordu: 4, halk: -4 } },
    b: { yazi: "Durdurun ama dinleyin", etki: { halk: 8, ordu: -4 } },
    gecikme: { etki: { ordu: -4, halk: -6 } },
  },
  {
    tepki: true, sure: 5,
    konusan: "Doğancıbaşı",
    metin: "Av sırasında yaralı ayı çalılıktan üstünüze geliyor!",
    a: { yazi: "Mızrakla karşıla", etki: { ordu: 6, halk: 4 } },
    b: { yazi: "Atını mahmuzla, uzaklaş", etki: { ordu: -4 } },
    gecikme: { etki: { halk: -6, ordu: -6 } },
  },
  {
    tepki: true, sure: 5,
    konusan: "Hazinedar",
    metin: "Yıldırım düştü — alevler hazine dairesine ilerliyor!",
    a: { yazi: "Sandıkları taşıtın", etki: { hazine: 4 } },
    b: { yazi: "Önce arşiv odasını kurtarın", etki: { ulema: 6, hazine: -8 } },
    gecikme: { etki: { hazine: -12 } },
  },
  {
    tepki: true, sure: 6,
    konusan: "Aşçıbaşı",
    metin: "Mutfakta yangın! Rüzgâr alevleri kışlalara sürüklüyor!",
    a: { yazi: "Barut deposunu boşalttır", etki: { ordu: 6, hazine: -6 } },
    b: { yazi: "Su zinciri kurdur", etki: { halk: 6, hazine: -4 } },
    gecikme: { etki: { ordu: -8, halk: -6 } },
  },
  {
    tepki: true, sure: 6,
    konusan: "Zaptiye",
    metin: "Ekmek kuyruğunda izdiham — kalabalık fırınları yağmalamak üzere!",
    a: { yazi: "Ambarları derhal aç", etki: { hazine: -6, halk: 8 } },
    b: { yazi: "Zaptiyeyle dağıt", etki: { ordu: 4, halk: -8 } },
    gecikme: { etki: { halk: -10 } },
  },
  {
    tepki: true, sure: 6,
    konusan: "Liman Reisi",
    metin: "Donanma gösterisinde bir kadırga yan yattı — yüzlerce kişi denizde!",
    a: { yazi: "Bütün kayıklar denize", etki: { halk: 8, hazine: -4 } },
    b: { yazi: "Önce leventleri kurtarın", etki: { ordu: 6, halk: -6 } },
    gecikme: { etki: { halk: -8, ordu: -4 } },
  },
  {
    tepki: true, sure: 7,
    konusan: "Teşrifatçı",
    metin: "Elçi, divanın ortasında hediyenizi yere bıraktı. Herkes cevabınızı bekliyor.",
    a: { yazi: "Zindana attır", etki: { ordu: 6, hazine: -6 } },
    b: { yazi: "Tek bakışla küçümse, devam et", etki: { halk: 6, ulema: 4 } },
    gecikme: { etki: { halk: -6, ordu: -6 } },
  },
];

// ============================================================
// KARA MÜHÜR — ana hikâye zinciri
// Osmanlı'dan da eski bir gizli cemiyet, asırlar boyunca
// hanedanın gölgesinde iş çevirir. Hikâye kartları belirli
// aralıklarla araya girer; her seçim "sonraki" alanıyla bir
// sonraki bölümü belirler. "bitis" alanı hikâyenin nasıl
// sonuçlandığını kaydeder (oyun sonu ekranında görünür).
// ============================================================

const HIKAYE_BASLANGIC = "muhur1";

const HIKAYE_KARTLARI = {
  muhur1: {
    hikaye: true,
    bolum: "Kara Mühür — I",
    konusan: "Casus",
    metin: "Can çekişen bir ulak bu mektubu bıraktı, hünkârım. Üzerinde kara balmumundan bir mühür: yılan sarılı bir anahtar. Son nefesinde 'Onlar... Osmanlı'dan eskidir' diye fısıldadı.",
    a: { yazi: "İzi sessizce sürdür", etki: { hazine: -5 }, sonraki: "muhur2" },
    b: { yazi: "Hurafeye ayıracak vaktim yok", etki: { halk: 4 }, sonraki: "muhur2" },
  },
  muhur2: {
    hikaye: true,
    bolum: "Kara Mühür — II",
    konusan: "Kapı Ağası",
    metin: "O mührü yine gördük: bu kez sadrazamınızın mühürdarının çekmecesinde. Adam dün gece sırra kadem bastı, hünkârım.",
    a: { yazi: "Sadrazamı sorguya çek", etki: { ordu: -4, hazine: -4 }, sonraki: "muhur3" },
    b: { yazi: "Belli etme, izlet", etki: { hazine: -6 }, sonraki: "muhur3" },
  },
  muhur3: {
    hikaye: true,
    bolum: "Kara Mühür — III",
    konusan: "Haberci",
    metin: "Kayıp mühürdarın cesedi Haliç'te bulundu. Avucuna bir harita kazınmış: payitahtın altında, damar damar yayılan dehlizler...",
    a: { yazi: "Dehlizleri arattır", etki: { ordu: -5, halk: -4 }, sonraki: "muhur4" },
    b: { yazi: "Bütün girişleri mühürlet", etki: { hazine: -8 }, sonraki: "muhur4" },
  },
  muhur4: {
    hikaye: true,
    bolum: "Kara Mühür — IV",
    konusan: "Şeyhülislam",
    metin: "Bu sabah minberlerde sahte bir fetva okundu: sizi gizli küfürle itham ediyor. Kâğıdın dibinde o kara mühür duruyor, hünkârım.",
    a: { yazi: "Minbere çık, alenen yalanla", etki: { ulema: 6, halk: -6 }, sonraki: "muhur5" },
    b: { yazi: "Okuyan vaizleri sustur", etki: { ulema: -8 }, sonraki: "muhur5" },
  },
  muhur5: {
    hikaye: true,
    bolum: "Kara Mühür — V",
    konusan: "Yeniçeri Ağası",
    metin: "Ocakta bir zabit, kara mühürlü bir kese altınla yakalandı. 'Kazanı kaldırtacaklardı' diyor ama kimin emriyle, söylemiyor.",
    a: { yazi: "Konuşana dek sorgula", etki: { ordu: -6 }, sonraki: "muhur6" },
    b: { yazi: "Serbest bırak, peşine casus tak", etki: { hazine: 6, ordu: -4 }, sonraki: "muhur6" },
  },
  muhur6: {
    hikaye: true,
    bolum: "Kara Mühür — VI",
    konusan: "Mühürdar",
    metin: "Gece yarısı, yatak odanızda bir gölge: 'Korkma. Biz Selçuklu'dan da eskiyiz; devletler bizim bahçemizde birer mevsimdir. Bize katıl, mevsimin uzasın. Reddet... kışı erken getiririz.'",
    a: { yazi: "Pakta gir", etki: { hazine: 10, ulema: -6 }, sonraki: "muhur7pakt" },
    b: { yazi: "Muhafızları çağır", etki: { ordu: 4, halk: -4 }, sonraki: "muhur7av" },
  },
  muhur7pakt: {
    hikaye: true,
    bolum: "Kara Mühür — VII",
    konusan: "Mühürdar",
    metin: "Cemiyet sözünü tuttu: düşmanlarınız birer birer sustu, kasalarınız doldu. Şimdi karşılığını istiyorlar: şehzadenizin hocalarını bundan böyle onlar seçecek.",
    a: { yazi: "Kabul et", etki: { ordu: 6, hazine: 6, ulema: -10 }, sonraki: "muhur8pakt" },
    b: { yazi: "Bu kadarı fazla — sözümden dönüyorum", etki: { ordu: -8, hazine: -8 }, sonraki: "muhur8av" },
  },
  muhur7av: {
    hikaye: true,
    bolum: "Kara Mühür — VII",
    konusan: "Casus",
    metin: "Localarını tek tek buluyoruz: Galata'da bir sahaf, Konya'da bir kervansaray, Selanik'te bir değirmen... Hepsinin dehlizi aynı yere iniyor: Yerebatan'ın altına.",
    a: { yazi: "Baskını bizzat yönet", etki: { ordu: 6, halk: 4, hazine: -6 }, sonraki: "muhur8av" },
    b: { yazi: "Sarnıcı suya boğun", etki: { ordu: 4, halk: -6, ulema: -4 }, sonraki: "muhur8av" },
  },
  muhur8pakt: {
    hikaye: true,
    bolum: "Kara Mühür — VIII",
    konusan: "Mühürdar",
    metin: "Artık fermanlarınızı önce biz okuyoruz; tuğranızın yanında bizim mührümüz de var. Rahat uyuyun hünkârım — devletiniz emin ellerde. Bizim ellerimizde.",
    a: { yazi: "Böyle sürsün; huzur da saltanattır", etki: { hazine: 8, ordu: 8, halk: -6 }, bitis: "kukla" },
    b: { yazi: "Yeter! Cemiyete savaş açıyorum", etki: { hazine: -10, ordu: -8, ulema: 8 }, sonraki: "muhur9" },
  },
  muhur8av: {
    hikaye: true,
    bolum: "Kara Mühür — VIII",
    konusan: "Sadrazam",
    metin: "Dehlizden çıkanlara bakın: yüz yıllık defterler. İçinde sadrazam isimleri, sahte fetvalar, boğdurulan şehzadeler... Ve yarın için düşülmüş tek satır: 'Büyük Usta payitahta iniyor.'",
    a: { yazi: "Tuzak kur, bekle", etki: { hazine: -6 }, sonraki: "muhur9" },
    b: { yazi: "Şehri kapat, kapı kapı ara", etki: { halk: -10, ordu: -4 }, sonraki: "muhur9" },
  },
  muhur9: {
    hikaye: true,
    bolum: "Kara Mühür — Son",
    konusan: "Mühürdar",
    metin: "Onu Ayasofya'nın mahzeninde kıstırdınız. Yaşlı adam gülümsüyor: 'Beni öldürürsen yerime iki usta doğar. Mührü kırarsan her şey biter. Ama emin misin? Bu mühür, senin hanedanını ayakta tutan kadim sözleşmedir.'",
    a: { yazi: "Mührü kır", etki: { hazine: 10, ordu: 10, halk: 10, ulema: 10 }, bitis: "kirildi" },
    b: { yazi: "Ustayı öldür, mührü sakla", etki: { hazine: 8, ordu: 6, ulema: -8 }, bitis: "sende" },
  },
};

// Oyun sonu ekranında hikâyenin akıbeti bu metinlerle özetlenir
const HIKAYE_SONUCLARI = {
  kirildi: "Kara Mühür kırıldı; kadim cemiyet tarihe karıştı.",
  sende: "Büyük Usta öldü ama mühür sarayda saklı — kim bilir şimdi hangi elde?",
  kukla: "Saltanat onların gölgesinde sürdü; fermanlarda hep iki mühür vardı.",
  yarim: "Kara Mühür defteri halefinize kaldı — av, kaldığı yerden sürecek.",
};

// Defterde görünen son adları
const HIKAYE_SON_ADLARI = {
  kirildi: "Mühür Kırıldı",
  sende: "Mühür Sarayda",
  kukla: "Kukla Saltanat",
};

// ============================================================
// KARA MÜHÜR DEFTERİ — oyunlar arası kalıcı kayıtlar.
// Görülen her bölüm deftere bir arşiv notu düşer; defter
// localStorage'da saklanır, ölüm defteri yakmaz.
// ============================================================

const DEFTER_KAYITLARI = {
  muhur1: "Yılan sarılı anahtar mührü ilk kez görüldü. Ulak son nefesinde 'Osmanlı'dan eskiler' dedi.",
  muhur2: "Mühür sarayın göbeğinde çıktı: sadrazamın mühürdarı bir gecede sırra kadem bastı.",
  muhur3: "Haliç'ten çıkan cesedin avucunda, payitahtın altındaki dehlizlerin haritası kazılıydı.",
  muhur4: "Minberlerde kara mühürlü sahte fetva okundu; hedef doğrudan tahttı.",
  muhur5: "Ocağa sızmışlar: kazanı kaldırtacak zabitin koynundan kara mühürlü kese çıktı.",
  muhur6: "Mühürdar bizzat göründü. Teklifi kısa ve netti: katıl, ya da kışa hazırlan.",
  muhur7pakt: "Paktın bedeli açıklandı: şehzadenin hocalarını bundan böyle cemiyet seçecek.",
  muhur7av: "Localar tek tek düştü: sahaf, kervansaray, değirmen... Bütün dehlizler Yerebatan'a iniyor.",
  muhur8pakt: "Fermanlarda artık iki mühür var. Devlet 'emin ellerde'.",
  muhur8av: "Dehlizden yüz yıllık defterler çıktı. Son satır: 'Büyük Usta payitahta iniyor.'",
  muhur9: "Ayasofya'nın mahzeninde Büyük Usta ile son yüzleşme.",
};

// ============================================================
// SEFERLER — çok kartlı yönetilen harekâtlar.
// Bir seçimin "kampanya" alanı seferi başlatır; sefer boyunca
// yalnızca sefer kartları gelir ve yıl ilerlemez. Her seçim
// "ilerleme" kadar gidişat puanını oynatır (başlangıç 50).
// Son kartın ardından gidişat "esik"i aşıyorsa zafer, aşmıyorsa
// hezimet kartı açılır. Sefer kartları "sefer: true" taşır.
// ============================================================

const KAMPANYALAR = {
  istanbul: {
    ad: "İstanbul Kuşatması",
    cubukAd: "Kuşatmanın Gidişatı",
    esik: 72,
    kartlar: [
      {
        sefer: true,
        konusan: "Topçubaşı",
        metin: "Macar usta Urban, surları yıkacak dev bir top dökebilirim diyor. İstediği ücret dudak uçuklatıyor.",
        a: { yazi: "Ne istiyorsa verin", etki: { hazine: -10 }, ilerleme: 10 },
        b: { yazi: "Kendi ustalarımız döksün", etki: { hazine: -4 }, ilerleme: 3 },
      },
      {
        sefer: true,
        konusan: "Topçubaşı",
        metin: "Şahi topları surları dövüyor ama namlular ısınıyor; çatlama riski var. Gece de ateş edelim mi?",
        a: { yazi: "Gece gündüz dövün", etki: { ordu: -6 }, ilerleme: 8 },
        b: { yazi: "Ölçülü ateşle namluları koru", etki: {}, ilerleme: 3 },
      },
      {
        sefer: true,
        konusan: "Kaptan-ı Derya",
        metin: "Haliç'in ağzı zincirle kapalı; donanma içeri giremiyor, hünkârım.",
        a: { yazi: "Gemileri karadan yürütün!", etki: { hazine: -8 }, ilerleme: 12 },
        b: { yazi: "Zinciri zorlayın", etki: { ordu: -6 }, ilerleme: 2 },
      },
      {
        sefer: true,
        konusan: "Kaptan-ı Derya",
        metin: "Ceneviz'den yardım gemileri şehre yaklaşıyor: erzak ve asker taşıyorlar.",
        a: { yazi: "Donanmayı üstlerine sal", etki: { ordu: -5 }, ilerleme: 6 },
        b: { yazi: "Bırak girsinler, sur önemli", etki: {}, ilerleme: -8 },
      },
      {
        sefer: true,
        konusan: "Lağımcıbaşı",
        metin: "Sur altına tünel kazıyoruz ama düşman karşı tünellerle bizi suda boğuyor, hünkârım.",
        a: { yazi: "Tünel savaşını sürdür", etki: { ordu: -4 }, ilerleme: 6 },
        b: { yazi: "Lağımları kapatın", etki: { ordu: 2 }, ilerleme: -3 },
      },
      {
        sefer: true,
        konusan: "Akşemseddin",
        metin: "Kuşatma uzadıkça orduda fısıltı çoğalıyor. Müjde, hünkârım: Eyyûb el-Ensarî'nin kabrini bulduk.",
        a: { yazi: "Kabri ordu önünde ziyaret et", etki: { ulema: 8 }, ilerleme: 6 },
        b: { yazi: "Fısıltıları sustur", etki: { ordu: -4 }, ilerleme: 2 },
      },
      {
        sefer: true,
        konusan: "Sadrazam",
        metin: "Kuşatmayı kaldıralım hünkârım; Avrupa birleşmeden dönelim. Bu surlar nice orduyu yuttu.",
        a: { yazi: "Ya ben şehri alırım ya şehir beni", etki: { ordu: -4 }, ilerleme: 6 },
        b: { yazi: "Ordunun yarısını geri yolla", etki: { hazine: 4 }, ilerleme: -10 },
      },
      {
        sefer: true,
        konusan: "Bizans Elçisi",
        metin: "İmparator teklif sunuyor: kuşatmayı kaldırın, size her yıl haraç ödensin.",
        a: { yazi: "Reddet: şehri isterim", etki: { hazine: -4 }, ilerleme: 5 },
        b: { yazi: "Pazarlığı uzat, vakit kazan", etki: { hazine: 6 }, ilerleme: -5 },
      },
      {
        sefer: true,
        konusan: "Serdar",
        metin: "Surlarda gedikler açıldı ama savunucular her gece yeniden örüyor, hünkârım.",
        a: { yazi: "Gedikleri gece de dövün", etki: { ordu: -5 }, ilerleme: 7 },
        b: { yazi: "Askeri son hücuma saklayın", etki: { ordu: 6 }, ilerleme: -3 },
      },
      {
        sefer: true,
        konusan: "Yeniçeri Ağası",
        metin: "Asker hazır, gedikler açık, ay hilal... Ya şimdi ya hiç, hünkârım.",
        a: { yazi: "Umumi hücum!", etki: { ordu: -8 }, ilerleme: 8 },
        b: { yazi: "Bir hafta daha bekleyin", etki: { ordu: 4 }, ilerleme: -6 },
      },
    ],
    zafer: {
      akibet: true,
      konusan: "Akşemseddin",
      metin: "Fetih müyesser oldu, hünkârım! Konstantiniyye düştü — çağ kapandı, çağ açıldı. Şehir fermanınızı bekliyor.",
      a: { yazi: "Şehri imar et, Ayasofya cami olsun", etki: { ulema: 14, halk: 12, hazine: -8 } },
      b: { yazi: "Orduya üç gün yağma izni ver", etki: { ordu: 12, hazine: 12, halk: -8, ulema: -4 } },
    },
    hezimet: {
      akibet: true,
      konusan: "Sadrazam",
      metin: "Kuşatma kalktı, hünkârım... Ordu bitkin, hazine yorgun; surlar bir kez daha dimdik ayakta.",
      a: { yazi: "Yeniden hazırlanacağız, ilan et", etki: { hazine: -8, ordu: 4, halk: -6 } },
      b: { yazi: "Ricatın vebalini vezirlere yükle", etki: { ulema: -8, halk: -6, ordu: -4 } },
    },
  },

  viyana: {
    ad: "Viyana Kuşatması",
    cubukAd: "Kuşatmanın Gidişatı",
    esik: 78,
    kartlar: [
      {
        sefer: true,
        konusan: "Topçubaşı",
        metin: "Yollar çamur deryası; ağır kuşatma topları günler gerimizde kaldı, hünkârım.",
        a: { yazi: "Topları bekle", etki: { ordu: -4 }, ilerleme: 8 },
        b: { yazi: "Eldeki hafif toplarla başla", etki: { ordu: 2 }, ilerleme: -6 },
      },
      {
        sefer: true,
        konusan: "Yeniçeri Ağası",
        metin: "Asker 'kış kapıda, İstanbul uzak' diye homurdanıyor, hünkârım.",
        a: { yazi: "Kışlık ve ganimet vaat et", etki: { hazine: -10 }, ilerleme: 8 },
        b: { yazi: "Disiplinle sustur", etki: { ordu: -6 }, ilerleme: 2 },
      },
      {
        sefer: true,
        konusan: "Lağımcıbaşı",
        metin: "Bu surlar Konstantiniyye gibi değil: ince ve eski. Lağımla çökertebiliriz.",
        a: { yazi: "Lağımcıları çalıştır", etki: { ordu: -4 }, ilerleme: 10 },
        b: { yazi: "Merdivenle hücum dene", etki: { ordu: -8 }, ilerleme: 4 },
      },
      {
        sefer: true,
        konusan: "Akıncı Beyi",
        metin: "Alman prensliklerinden yardım ordusu toplanıyormuş; akıncılarım yollarını biliyor.",
        a: { yazi: "Kuşatmayı hızlandır", etki: { ordu: -6 }, ilerleme: 8 },
        b: { yazi: "Yardım ordusunu karşılamaya çık", etki: { ordu: 4 }, ilerleme: -8 },
      },
      {
        sefer: true,
        konusan: "Defterdar",
        metin: "Erzak azalıyor, hünkârım; ekim geldi, tepelerde kar var.",
        a: { yazi: "Tayınları yarıya indir", etki: { ordu: -6 }, ilerleme: 6 },
        b: { yazi: "Dönüş erzakını şimdiden ayır", etki: {}, ilerleme: -6 },
      },
      {
        sefer: true,
        konusan: "Serdar",
        metin: "Son fırsat, hünkârım: ya her şeyi tek hücuma yatırırız ya da ordu kar altında kalır.",
        a: { yazi: "Umumi hücum!", etki: { ordu: -10 }, ilerleme: 10 },
        b: { yazi: "Düzenli ricata başla", etki: { ordu: 6 }, ilerleme: -14 },
      },
    ],
    zafer: {
      akibet: true,
      konusan: "Serdar",
      metin: "Viyana düştü, hünkârım! Kızıl elma avucunuzda — Frengistan'ın kalbinde sancağımız dalgalanıyor.",
      a: { yazi: "Kışı Viyana'da geçir, şehri elde tut", etki: { hazine: 14, halk: 8, ulema: 8, ordu: -8 } },
      b: { yazi: "Yağmala ve zaferle dön", etki: { hazine: 16, ordu: 8, ulema: -6 } },
    },
    hezimet: {
      akibet: true,
      konusan: "Serdar",
      metin: "Kar altında ricat, hünkârım... Ağır toplar çamura gömüldü; Viyana önlerinde bir hayal bıraktık.",
      a: { yazi: "Ricatı düzenle, orduyu koru", etki: { ordu: -6, halk: -4 } },
      b: { yazi: "Ağırlıkları bırak, hızlı dön", etki: { ordu: -4, hazine: -10 } },
    },
  },
};
