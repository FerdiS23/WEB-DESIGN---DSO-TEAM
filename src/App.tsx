import { useState, useEffect } from 'react';
import './App.css';
import { FaCheck, FaCheckCircle, FaTimesCircle, FaUnlock, FaLock, FaBrain, FaMicroscope, FaLandmark, FaBookOpen, FaHandshake, FaDice, FaGlobe, FaChartLine, FaEye, FaEyeSlash, FaSun, FaMoon, FaMicrochip, FaDna, FaPalette, FaBalanceScale, FaSpaceShuttle, FaSeedling, FaCoins, FaFlask, FaAtom, FaGlobeAmericas, FaDraftingCompass, FaChartPie, FaFeatherAlt, FaProjectDiagram } from 'react-icons/fa';

// --- INTERFACE ---
interface Question {
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

interface Mission {
  id: number;
  title: string;
  shortDesc: string;
  storyContext: string;
  icon: React.ReactNode;
  questionPool: Question[]; 
}

// --- FUNGSI FORMAT NAMA & INISIAL ---
const getInitials = (name: string) => {
  if (!name) return 'U';
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase(); 
  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
};

const formatName = (name: string) => {
  if (!name) return '';
  return name.trim().split(/\s+/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

function App() { 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeUser, setActiveUser] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Mengubah atribut body saat tema berubah
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const [customAlert, setCustomAlert] = useState<{message: string, type: 'success' | 'error' | null, visible: boolean}>({
    message: '', type: null, visible: false,
  });

  const showNotification = (message: string, type: 'success' | 'error') => {
    setCustomAlert({ message, type, visible: true });
    setTimeout(() => setCustomAlert(prev => ({ ...prev, visible: false })), 4000);
  };

  // --- STATE KUIS & MISI ---
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null); 
  const [unlockedMissions, setUnlockedMissions] = useState<number[]>([1]); 
  const [quizResult, setQuizResult] = useState<'idle' | 'answered'>('idle');
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  // --- STATE PARALLAX (Halaman Login) ---
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [exactMouse, setExactMouse] = useState({ x: -1000, y: -1000 });

  // --- CEK SESSION LOCALSTORAGE ---
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setIsLoggedIn(true); 
      setActiveUser(savedUser);
      const savedUnlocked = localStorage.getItem(`unlocked_${savedUser}`);
      if (savedUnlocked) setUnlockedMissions(JSON.parse(savedUnlocked));
    }
  }, []);

  // Kunci scroll saat modal kuis terbuka
  useEffect(() => {
    if (activeMission) {
      document.body.style.overflow = 'hidden'; 
    } else {
      document.body.style.overflow = 'auto'; 
    }
    return () => { document.body.style.overflow = 'auto'; }; 
  }, [activeMission]);

  // --- 🚀 DATA MISI LENGKAP (20 SEKTOR / DITULIS MANUAL AGAR BISA KAMU EDIT) 🚀 ---
  const missions: Mission[] = [
    {
      id: 1, title: "Misi 1: Sektor Logika Dasar", shortDesc: "Membuktikan ketajaman nalar matematis.",
      storyContext: "Sebelum menyusun sistem pendidikan baru, kami harus menguji ketajaman logika dan kemampuan analitis matematis kamu. Terminal ini akan menyuguhkan satu teka-teki logika atau matematika secara acak. Jawab dengan presisi.",
      icon: <FaBrain />, 
      questionPool: [
        { text: "Berapakah hasil perhitungan dari 8 + 2 x 5?", options: ["50", "18", "20"], correctAnswerIndex: 1, explanation: "Aturan BODMAS: perkalian dikerjakan lebih dahulu. 2 x 5 = 10, lalu 8 + 10 = 18." },
        { text: "Lengkapi deret angka berikut: 2, 6, 12, 20, 30, ...", options: ["40", "42", "44"], correctAnswerIndex: 1, explanation: "Selisih bertambah 2 (+4, +6, +8, +10, +12). 30 + 12 = 42." },
        { text: "Jika semua A adalah B, dan beberapa B adalah C. Kesimpulannya?", options: ["Semua A adalah C", "Beberapa A adalah C", "Tidak dapat dipastikan"], correctAnswerIndex: 2, explanation: "Irisan antara 'semua' dan 'beberapa' pada objek ketiga tidak menghasilkan kesimpulan pasti." },
        { text: "Baju Rp100.000 diskon 20%. Lalu diskon tambahan 10% dari harga setelah diskon. Harga akhirnya?", options: ["Rp70.000", "Rp72.000", "Rp80.000"], correctAnswerIndex: 1, explanation: "Diskon 1: Rp80.000. Diskon 2: 10% dari 80k = 8.000. Hasil: 72.000." },
        { text: "Umur Budi 3x umur Andi. 10 tahun lagi, umur Budi 2x umur Andi. Umur Andi saat ini?", options: ["10 tahun", "15 tahun", "20 tahun"], correctAnswerIndex: 0, explanation: "B=3A. B+10 = 2(A+10). 3A+10 = 2A+20. A = 10." },
        { text: "Premis 1: Jika hujan, jalanan basah. Premis 2: Jalanan tidak basah. Kesimpulan?", options: ["Hari ini cerah", "Hari tidak hujan", "Hujan reda"], correctAnswerIndex: 1, explanation: "Logika Modus Tollens. Bukan Q, maka Bukan P." },
        { text: "Kereta melaju 80 km/jam. Waktu untuk menempuh 200 km?", options: ["2,5 jam", "2,15 jam", "3 jam"], correctAnswerIndex: 0, explanation: "Waktu = Jarak / Kecepatan = 200 / 80 = 2.5 jam." },
        { text: "Jika KUCING=6, HARIMAU=7, GAJAH=5. Maka BERUANG?", options: ["6", "7", "8"], correctAnswerIndex: 1, explanation: "Jumlah huruf pada kata BERUANG adalah 7." },
        { text: "Ada 3 bola merah dan 2 biru. Peluang terambil bola biru?", options: ["2/5", "3/5", "1/2"], correctAnswerIndex: 0, explanation: "Peluang = 2 biru / 5 total bola = 2/5." },
        { text: "Pria melihat foto: 'Ayah orang di foto ini adalah anak ayahku'. Dia anak tunggal. Siapa di foto?", options: ["Dirinya", "Anaknya", "Ayahnya"], correctAnswerIndex: 1, explanation: "'Anak ayahku' adalah dirinya. Jadi, ayah di foto adalah dirinya = foto anaknya." }
      ]
    },
    {
      id: 2, title: "Misi 2: Modul Sains Alam", shortDesc: "Menganalisis hukum alam semesta.",
      storyContext: "Pemahaman tentang biologi, fisika, dan kimia dasar adalah kunci berinovasi tanpa merusak ekosistem.",
      icon: <FaMicroscope />, 
      questionPool: [
        { text: "Gas yang diserap tumbuhan untuk fotosintesis?", options: ["Oksigen", "Karbon Dioksida", "Nitrogen"], correctAnswerIndex: 1, explanation: "Tumbuhan menyerap CO2." },
        { text: "Jumlah rata-rata tulang manusia dewasa?", options: ["206 tulang", "208 tulang", "210 tulang"], correctAnswerIndex: 0, explanation: "Manusia dewasa memiliki 206 tulang." },
        { text: "Organel sel sebagai pusat kendali?", options: ["Mitokondria", "Ribosom", "Inti Sel (Nukleus)"], correctAnswerIndex: 2, explanation: "Nukleus adalah otak sel yang berisi DNA." },
        { text: "Ilmuwan perumus gravitasi universal?", options: ["Einstein", "Isaac Newton", "Galileo"], correctAnswerIndex: 1, explanation: "Newton merumuskan hukum gravitasi." },
        { text: "Padat menjadi gas disebut?", options: ["Menyublim", "Mengkristal", "Menguap"], correctAnswerIndex: 0, explanation: "Menyublim (contoh: kapur barus)." },
        { text: "Vitamin di buah sitrus?", options: ["Vitamin A", "Vitamin C", "Vitamin D"], correctAnswerIndex: 1, explanation: "Sitrus (jeruk) kaya akan Vitamin C." },
        { text: "Benda langit yang memancarkan cahaya sendiri?", options: ["Planet", "Satelit", "Bintang"], correctAnswerIndex: 2, explanation: "Bintang menghasilkan cahaya via fusi nuklir." },
        { text: "Hewan berudu bernapas insang, dewasa paru-paru?", options: ["Kura-kura", "Katak", "Paus"], correctAnswerIndex: 1, explanation: "Katak adalah amfibi." },
        { text: "Organ pemompa darah?", options: ["Ginjal", "Paru-paru", "Jantung"], correctAnswerIndex: 2, explanation: "Jantung memompa darah ke seluruh tubuh." },
        { text: "Lapisan pelindung UV?", options: ["Troposfer", "Stratosfer (Ozon)", "Ionosfer"], correctAnswerIndex: 1, explanation: "Ozon berada di Stratosfer." }
      ]
    },
    {
      id: 3, title: "Misi 3: Jejak Peradaban", shortDesc: "Mengevaluasi sejarah & geografi.",
      storyContext: "Mereka yang melupakan masa lalu akan mengulanginya. Validasi data sejarah untuk mengamankan masa depan.",
      icon: <FaLandmark />, 
      questionPool: [
        { text: "Kerajaan Hindu tertua di Indonesia?", options: ["Tarumanegara", "Kutai", "Majapahit"], correctAnswerIndex: 1, explanation: "Kutai dibuktikan dengan Prasasti Yupa." },
        { text: "Perang Dunia II berakhir tahun?", options: ["1940", "1945", "1950"], correctAnswerIndex: 1, explanation: "Berakhir pada 1945." },
        { text: "Bapak Pendidikan Nasional Indonesia?", options: ["Soekarno", "Hatta", "Ki Hajar Dewantara"], correctAnswerIndex: 2, explanation: "Ki Hajar Dewantara (Taman Siswa)." },
        { text: "Negeri Matahari Terbit?", options: ["Tiongkok", "Jepang", "Korea"], correctAnswerIndex: 1, explanation: "Jepang (Nippon = asal matahari)." },
        { text: "Samudra terluas?", options: ["Atlantik", "Hindia", "Pasifik"], correctAnswerIndex: 2, explanation: "Pasifik adalah samudra terbesar." },
        { text: "Ibu kota Jawa Timur?", options: ["Surabaya", "Semarang", "Malang"], correctAnswerIndex: 0, explanation: "Surabaya." },
        { text: "Candi Borobudur peninggalan agama?", options: ["Hindu", "Buddha", "Konghucu"], correctAnswerIndex: 1, explanation: "Candi Buddha dari masa Syailendra." },
        { text: "Peristiwa penculikan Soekarno-Hatta (Rengasdengklok)?", options: ["15 Agustus", "16 Agustus", "17 Agustus"], correctAnswerIndex: 1, explanation: "Terjadi pada 16 Agustus 1945." },
        { text: "Negara berpopulasi terbanyak 2023?", options: ["AS", "India", "Rusia"], correctAnswerIndex: 1, explanation: "India menyalip Tiongkok pada 2023." },
        { text: "Gunung penyebab Tahun Tanpa Musim Panas (1815)?", options: ["Krakatau", "Tambora", "Merapi"], correctAnswerIndex: 1, explanation: "Letusan Tambora di Sumbawa." }
      ]
    },
    {
      id: 4, title: "Misi 4: Arsip Linguistik", shortDesc: "Menganalisis bahasa dan sastra.",
      storyContext: "Komunikasi adalah jembatan pengetahuan. Buktikan kemampuan linguistikmu.",
      icon: <FaBookOpen />, 
      questionPool: [
        { text: "Antonim dari Prolog?", options: ["Dialog", "Epilog", "Monolog"], correctAnswerIndex: 1, explanation: "Epilog adalah penutup." },
        { text: "Majas melebih-lebihkan?", options: ["Personifikasi", "Metafora", "Hiperbola"], correctAnswerIndex: 2, explanation: "Hiperbola melebih-lebihkan fakta." },
        { text: "Karya imajinasi murni disebut?", options: ["Fiksi", "Non-fiksi", "Biografi"], correctAnswerIndex: 0, explanation: "Fiksi adalah rekaan." },
        { text: "Makna 'Buah Tangan'?", options: ["Anak", "Oleh-oleh", "Hasil kerja"], correctAnswerIndex: 1, explanation: "Buah tangan = oleh-oleh." },
        { text: "Sinonim Evakuasi?", options: ["Penyerangan", "Pemindahan", "Pembangunan"], correctAnswerIndex: 1, explanation: "Evakuasi = pemindahan ke tempat aman." },
        { text: "Puisi a-b-a-b dengan sampiran?", options: ["Gurindam", "Syair", "Pantun"], correctAnswerIndex: 2, explanation: "Pantun khas dengan sampiran dan isi." },
        { text: "Arti 'Membesar kepala'?", options: ["Sombong", "Pintar", "Penyakit"], correctAnswerIndex: 0, explanation: "Kiasan untuk sifat angkuh." },
        { text: "Kalimat tanpa objek disebut?", options: ["Transitif", "Intransitif", "Pasif"], correctAnswerIndex: 1, explanation: "Intransitif tidak butuh objek." },
        { text: "Penulis puisi 'Aku'?", options: ["Rendra", "Chairil Anwar", "Taufiq Ismail"], correctAnswerIndex: 1, explanation: "Karya monumental Chairil Anwar." },
        { text: "Konjungsi sebab-akibat?", options: ["Karena", "Tetapi", "Sedangkan"], correctAnswerIndex: 0, explanation: "'Karena' merujuk pada alasan." }
      ]
    },
    {
      id: 5, title: "Misi 5: Sektor Kemanusiaan", shortDesc: "Memahami psikologi dan sosial.",
      storyContext: "Sistem menolak individu tanpa empati. Modul ini mengukur metrik psikologis.",
      icon: <FaHandshake />, 
      questionPool: [
        { text: "Merasakan penderitaan orang lain?", options: ["Simpati", "Apatis", "Empati"], correctAnswerIndex: 2, explanation: "Empati memposisikan diri pada posisi orang lain." },
        { text: "Campuran budaya tanpa hilang identitas asli?", options: ["Asimilasi", "Akulturasi", "Difusi"], correctAnswerIndex: 1, explanation: "Akulturasi memadukan tanpa menghapus budaya asal." },
        { text: "Norma dari hati nurani?", options: ["Agama", "Kesopanan", "Kesusilaan"], correctAnswerIndex: 2, explanation: "Kesusilaan mengatur baik/buruk batiniah." },
        { text: "Tokoh Hierarki Kebutuhan?", options: ["Freud", "Maslow", "Jung"], correctAnswerIndex: 1, explanation: "Abraham Maslow merumuskan piramida kebutuhan." },
        { text: "Takut berlebihan & tidak rasional?", options: ["Fobia", "Trauma", "Bipolar"], correctAnswerIndex: 0, explanation: "Fobia adalah ketakutan spesifik berlebih." },
        { text: "Memberikan sesuatu sesuai haknya?", options: ["Toleransi", "Adil", "Berani"], correctAnswerIndex: 1, explanation: "Keadilan memberikan hak yang semestinya." },
        { text: "Alasan manusia makhluk sosial?", options: ["Punya akal", "Butuh orang lain", "Suka kumpul"], correctAnswerIndex: 1, explanation: "Manusia tidak bisa hidup mandiri mutlak." },
        { text: "Lembaga sosialisasi pertama anak?", options: ["Sekolah", "Teman", "Keluarga"], correctAnswerIndex: 2, explanation: "Keluarga adalah agen sosialisasi primer." },
        { text: "Filsafat bebas memilih jalan hidup?", options: ["Behaviorisme", "Eksistensialisme", "Psikoanalisis"], correctAnswerIndex: 1, explanation: "Eksistensi mendahului esensi." },
        { text: "Menyalahkan orang lain atas kesalahan diri?", options: ["Proyeksi", "Introversi", "Represi"], correctAnswerIndex: 0, explanation: "Proyeksi ego melemparkan kesalahan ke luar." }
      ]
    },
    {
      id: 6, title: "Misi 6: Algoritma Komputasi", shortDesc: "Logika biner & dasar komputasi.",
      storyContext: "Pendidikan masa depan digerakkan oleh mesin. Validasi pemahaman digitalmu.",
      icon: <FaMicrochip />, 
      questionPool: [
        { text: "Sistem bilangan berbasis 0 dan 1 disebut?", options: ["Desimal", "Biner", "Heksadesimal"], correctAnswerIndex: 1, explanation: "Biner adalah bahasa dasar mesin komputer." },
        { text: "Kepanjangan dari RAM?", options: ["Read Access Memory", "Random Access Memory", "Run Access Memory"], correctAnswerIndex: 1, explanation: "Penyimpanan data sementara saat aplikasi berjalan." },
        { text: "Otak utama dari sebuah komputer adalah?", options: ["Harddisk", "Motherboard", "CPU"], correctAnswerIndex: 2, explanation: "CPU memproses seluruh instruksi logika." },
        { text: "1 Byte sama dengan berapa bit?", options: ["4", "8", "16"], correctAnswerIndex: 1, explanation: "1 Byte berisi 8 bit." },
        { text: "Bahasa struktur dasar pembentuk halaman web?", options: ["HTML", "Python", "C++"], correctAnswerIndex: 0, explanation: "HTML adalah tulang punggung website." },
        { text: "Malware yang mengenkripsi dan meminta tebusan?", options: ["Adware", "Ransomware", "Spyware"], correctAnswerIndex: 1, explanation: "Ransom = tebusan." },
        { text: "Jaringan komputer global yang menghubungkan seluruh dunia?", options: ["LAN", "Intranet", "Internet"], correctAnswerIndex: 2, explanation: "Internet adalah jaringan skala dunia." },
        { text: "Singkatan dari AI?", options: ["Analog Interface", "Artificial Intelligence", "Auto Internet"], correctAnswerIndex: 1, explanation: "Kecerdasan Buatan." },
        { text: "Algoritma pengurutan data sederhana dari kecil ke besar?", options: ["Bubble Sort", "Binary Search", "Hash Table"], correctAnswerIndex: 0, explanation: "Bubble sort menukar elemen yang berdekatan." },
        { text: "Bapak Ilmu Komputer modern?", options: ["Alan Turing", "Bill Gates", "Steve Jobs"], correctAnswerIndex: 0, explanation: "Pencipta mesin Turing." }
      ]
    },
    {
      id: 7, title: "Misi 7: Anatomi Hayati", shortDesc: "Struktur biologi molekuler.",
      storyContext: "Analisis pemahamanmu tentang struktur sel biologis dan ekosistem tubuh manusia.",
      icon: <FaDna />, 
      questionPool: [
        { text: "Molekul pembawa cetak biru genetik manusia?", options: ["RNA", "DNA", "Enzim"], correctAnswerIndex: 1, explanation: "DNA mengandung instruksi genetik." },
        { text: "Pembuluh darah yang membawa darah dari jantung?", options: ["Vena", "Kapiler", "Arteri (Nadi)"], correctAnswerIndex: 2, explanation: "Arteri membawa darah bersih dari jantung." },
        { text: "Enzim di air liur pemecah karbohidrat?", options: ["Pepsin", "Amilase (Ptialin)", "Lipase"], correctAnswerIndex: 1, explanation: "Memecah amilum menjadi glukosa." },
        { text: "Tulang terpanjang pada manusia?", options: ["Tulang Kering", "Tulang Paha (Femur)", "Tulang Lengan"], correctAnswerIndex: 1, explanation: "Femur sangat kuat dan menopang tubuh." },
        { text: "Sel darah yang berfungsi membunuh kuman?", options: ["Eritrosit", "Trombosit", "Leukosit"], correctAnswerIndex: 2, explanation: "Sel darah putih (Leukosit) menjaga imun." },
        { text: "Penyakit akibat tubuh kekurangan hormon insulin?", options: ["Hipertensi", "Diabetes", "Anemia"], correctAnswerIndex: 1, explanation: "Insulin mengatur gula darah." },
        { text: "Tempat pertukaran O2 dan CO2 di paru-paru?", options: ["Bronkus", "Alveolus", "Trakea"], correctAnswerIndex: 1, explanation: "Alveolus berupa kantung-kantung kecil." },
        { text: "Organ tubuh yang memproduksi empedu?", options: ["Pankreas", "Lambung", "Hati (Liver)"], correctAnswerIndex: 2, explanation: "Hati menetralisir racun dan membuat empedu." },
        { text: "Bagian mata yang mengatur masuknya cahaya?", options: ["Retina", "Iris", "Kornea"], correctAnswerIndex: 1, explanation: "Iris mengatur ukuran pupil." },
        { text: "Otot yang bekerja di luar kesadaran kita?", options: ["Otot Lurik", "Otot Rangka", "Otot Polos"], correctAnswerIndex: 2, explanation: "Terdapat di organ dalam seperti usus." }
      ]
    },
    {
      id: 8, title: "Misi 8: Seni & Estetika", shortDesc: "Mengukur kreativitas sejarah seni.",
      storyContext: "Logika tanpa estetika akan menghasilkan mesin yang mati. Buktikan wawasan senimu.",
      icon: <FaPalette />, 
      questionPool: [
        { text: "Siapakah pelukis mahakarya Monalisa?", options: ["Picasso", "Van Gogh", "Leonardo da Vinci"], correctAnswerIndex: 2, explanation: "Da Vinci melukisnya pada era Renaissance." },
        { text: "Lukisan malam berbintang 'Starry Night' karya?", options: ["Monet", "Vincent van Gogh", "Dali"], correctAnswerIndex: 1, explanation: "Van Gogh melukisnya dari dalam rumah sakit jiwa." },
        { text: "Tiga warna dasar (Primer) adalah?", options: ["Merah, Kuning, Biru", "Hijau, Oranye, Ungu", "Hitam, Putih, Abu"], correctAnswerIndex: 0, explanation: "Tidak bisa dibentuk dari warna lain." },
        { text: "Seni melipat kertas tradisional Jepang?", options: ["Ikebana", "Origami", "Bonsai"], correctAnswerIndex: 1, explanation: "Ori berarti lipat, Kami berarti kertas." },
        { text: "Aliran seni rupa bentuk geometris (Kubisme) dipelopori oleh?", options: ["Rembrandt", "Pablo Picasso", "Michaelangelo"], correctAnswerIndex: 1, explanation: "Picasso mengubah cara pandang perspektif." },
        { text: "Komposer klasik legendaris yang tunarungu?", options: ["Mozart", "Chopin", "Beethoven"], correctAnswerIndex: 2, explanation: "Ia menggubah simfoni-9 dalam keadaan tuli." },
        { text: "Candi Prambanan adalah peninggalan bercorak?", options: ["Buddha", "Hindu", "Konghucu"], correctAnswerIndex: 1, explanation: "Candi Hindu terbesar di Asia Tenggara." },
        { text: "Alat musik tradisional Angklung terbuat dari?", options: ["Kayu Mahoni", "Bambu", "Besi"], correctAnswerIndex: 1, explanation: "Berasal dari kebudayaan Sunda." },
        { text: "Patung Liberty adalah hadiah dari negara mana untuk Amerika?", options: ["Inggris", "Prancis", "Spanyol"], correctAnswerIndex: 1, explanation: "Sebagai simbol persahabatan kedua negara." },
        { text: "Seni menulis indah (indah/ornamen) disebut?", options: ["Grafiti", "Kaligrafi", "Tipografi"], correctAnswerIndex: 1, explanation: "Sering ditemukan pada naskah kuno." }
      ]
    },
    {
      id: 9, title: "Misi 9: Hukum & Keadilan", shortDesc: "Validasi parameter etika regulasi.",
      storyContext: "Setiap inovasi harus berada dalam batas regulasi peradaban. Jawab studi kasus ini.",
      icon: <FaBalanceScale />, 
      questionPool: [
        { text: "Hukum dasar tertinggi di Indonesia adalah?", options: ["TAP MPR", "UUD 1945", "Perppu"], correctAnswerIndex: 1, explanation: "Semua undang-undang harus tunduk pada UUD 1945." },
        { text: "Lembaga legislatif yang berhak membuat undang-undang?", options: ["MA", "MK", "DPR"], correctAnswerIndex: 2, explanation: "DPR (Dewan Perwakilan Rakyat)." },
        { text: "Asas yang menganggap seseorang tidak bersalah sampai divonis hakim?", options: ["Asas Legalitas", "Praduga Tak Bersalah", "Asas Subsidiaritas"], correctAnswerIndex: 1, explanation: "Presumption of innocence." },
        { text: "Lembaga peradilan pemegang kekuasaan tertinggi?", options: ["Mahkamah Agung", "Kejaksaan", "Pengadilan Tinggi"], correctAnswerIndex: 0, explanation: "Mahkamah Agung (MA) berada di puncak peradilan." },
        { text: "Hak asasi yang dibawa sejak lahir bersifat?", options: ["Sementara", "Lokal", "Universal/Mutlak"], correctAnswerIndex: 2, explanation: "Tidak bisa dicabut oleh negara manapun." },
        { text: "Usia minimal untuk memiliki KTP/memilih di Indonesia?", options: ["16 tahun", "17 tahun", "18 tahun"], correctAnswerIndex: 1, explanation: "Kecuali sudah pernah menikah sebelumnya." },
        { text: "Tindakan menggunakan wewenang untuk memperkaya diri sendiri?", options: ["Nepotisme", "Kolusi", "Korupsi"], correctAnswerIndex: 2, explanation: "Merupakan kejahatan luar biasa (extraordinary crime)." },
        { text: "Badan khusus yang bertugas memberantas korupsi di RI?", options: ["BIN", "KPK", "BPK"], correctAnswerIndex: 1, explanation: "Komisi Pemberantasan Korupsi." },
        { text: "Sistem pemerintahan kedaulatan di tangan rakyat?", options: ["Oligarki", "Demokrasi", "Monarki"], correctAnswerIndex: 1, explanation: "Dari rakyat, oleh rakyat, untuk rakyat." },
        { text: "Aturan hukum yang mengatur hubungan antar negara?", options: ["Hukum Perdata", "Hukum Pidana", "Hukum Internasional"], correctAnswerIndex: 2, explanation: "Mengacu pada perjanjian lintas batas negara." }
      ]
    },
    {
      id: 10, title: "Misi 10: Antariksa & Astronomi", shortDesc: "Eksplorasi wawasan kosmologi.",
      storyContext: "Bumi hanyalah titik biru kecil. Tunjukkan pemahamanmu tentang tata surya.",
      icon: <FaSpaceShuttle />, 
      questionPool: [
        { text: "Planet terdekat dari Matahari?", options: ["Venus", "Merkurius", "Mars"], correctAnswerIndex: 1, explanation: "Planet terkecil dengan suhu yang sangat fluktuatif." },
        { text: "Manusia pertama yang menginjakkan kaki di Bulan?", options: ["Yuri Gagarin", "Buzz Aldrin", "Neil Armstrong"], correctAnswerIndex: 2, explanation: "Misi Apollo 11 pada tahun 1969." },
        { text: "Satelit alami yang dimiliki planet Bumi?", options: ["Titan", "Bulan", "Europa"], correctAnswerIndex: 1, explanation: "Mengorbit bumi setiap 27,3 hari." },
        { text: "Galaksi tempat tata surya kita berada?", options: ["Andromeda", "Bimasakti (Milky Way)", "Triangulum"], correctAnswerIndex: 1, explanation: "Kita berada di salah satu lengan galaksi spiral ini." },
        { text: "Planet terbesar di tata surya?", options: ["Saturnus", "Jupiter", "Neptunus"], correctAnswerIndex: 1, explanation: "Raksasa gas terbesar di tata surya kita." },
        { text: "Benda langit gravitasi ekstrem penghisap cahaya?", options: ["Pulsar", "Nebula", "Lubang Hitam (Black Hole)"], correctAnswerIndex: 2, explanation: "Memiliki singularitas di pusatnya." },
        { text: "Planet yang dijuluki Planet Merah?", options: ["Venus", "Mars", "Jupiter"], correctAnswerIndex: 1, explanation: "Warna merah berasal dari debu oksida besi." },
        { text: "Bintang yang menjadi pusat tata surya kita?", options: ["Sirius", "Polaris", "Matahari"], correctAnswerIndex: 2, explanation: "Bola gas panas tempat fusi nuklir terjadi." },
        { text: "Benda langit dari es dan debu berekor cahaya?", options: ["Asteroid", "Komet", "Meteor"], correctAnswerIndex: 1, explanation: "Komet menguap saat mendekati matahari." },
        { text: "Tahun Cahaya adalah satuan untuk mengukur?", options: ["Waktu", "Jarak", "Kecepatan"], correctAnswerIndex: 1, explanation: "Jarak yang ditempuh cahaya dalam satu tahun bumi." }
      ]
    },
    {
      id: 11, title: "Misi 11: Ekologi Lingkungan", shortDesc: "Keseimbangan ekosistem dan iklim.",
      storyContext: "Kemajuan teknologi harus sejalan dengan kelestarian bumi. Validasi wawasan lingkunganmu.",
      icon: <FaSeedling />, 
      questionPool: [
        { text: "Gas utama penyebab efek rumah kaca?", options: ["Oksigen", "Karbon Dioksida", "Nitrogen"], correctAnswerIndex: 1, explanation: "Memerangkap panas di atmosfer." },
        { text: "Konsep pengelolaan sampah (Reduce, Reuse, ...)?", options: ["Refuse", "Recycle", "Repair"], correctAnswerIndex: 1, explanation: "Daur ulang bahan menjadi barang baru." },
        { text: "Hutan hujan tropis Amazon sering dijuluki?", options: ["Jantung Bumi", "Paru-paru Dunia", "Atap Dunia"], correctAnswerIndex: 1, explanation: "Menghasilkan lebih dari 20% oksigen bumi." },
        { text: "Pengikisan pantai oleh gelombang laut disebut?", options: ["Erosi", "Abrasi", "Erupsi"], correctAnswerIndex: 1, explanation: "Bisa dicegah dengan menanam bakau/mangrove." },
        { text: "Energi terbarukan dari panas dalam bumi?", options: ["Hidro", "Geotermal", "Biomassa"], correctAnswerIndex: 1, explanation: "Sangat melimpah di wilayah gunung berapi." },
        { text: "Hubungan makhluk hidup saling menguntungkan?", options: ["Parasitisme", "Mutualisme", "Komensalisme"], correctAnswerIndex: 1, explanation: "Seperti burung dan bunga." },
        { text: "Hewan pemakan segala (tumbuhan & daging)?", options: ["Karnivora", "Herbivora", "Omnivora"], correctAnswerIndex: 2, explanation: "Contoh: Manusia dan Tikus." },
        { text: "Zat penyebab rusaknya lapisan ozon (dari AC tua)?", options: ["CFC", "CO2", "H2O"], correctAnswerIndex: 0, explanation: "Klorofluorokarbon sangat merusak O3." },
        { text: "Lingkungan tempat seluruh makhluk hidup berada?", options: ["Litosfer", "Atmosfer", "Biosfer"], correctAnswerIndex: 2, explanation: "Keseluruhan ekosistem dunia." },
        { text: "Hilangnya spesies secara permanen dari muka bumi?", options: ["Evolusi", "Mutasi", "Kepunahan (Extinction)"], correctAnswerIndex: 2, explanation: "Seringkali dipercepat oleh ulah manusia." }
      ]
    },
    {
      id: 12, title: "Misi 12: Ekonomi Makro", shortDesc: "Dinamika pasar finansial.",
      storyContext: "Perekonomian menggerakkan peradaban. Buktikan pemahamanmu tentang suplai dan permintaan.",
      icon: <FaCoins />, 
      questionPool: [
        { text: "Kenaikan harga barang terus-menerus disebut?", options: ["Deflasi", "Inflasi", "Devaluasi"], correctAnswerIndex: 1, explanation: "Inflasi menurunkan daya beli uang." },
        { text: "Bank Sentral di Indonesia adalah?", options: ["Bank Mandiri", "Bank Indonesia (BI)", "BCA"], correctAnswerIndex: 1, explanation: "Pemegang otoritas moneter." },
        { text: "Jika harga naik, hukum permintaan menyatakan permintaan akan?", options: ["Naik", "Turun", "Tetap"], correctAnswerIndex: 1, explanation: "Konsumen cenderung menahan pembelian." },
        { text: "Kegiatan menjual barang ke luar negeri disebut?", options: ["Impor", "Barter", "Ekspor"], correctAnswerIndex: 2, explanation: "Membawa devisa masuk ke negara." },
        { text: "Pajak barang yang didatangkan dari luar negeri?", options: ["Cukai", "Bea Masuk (Tarif)", "PPN"], correctAnswerIndex: 1, explanation: "Untuk melindungi produk lokal." },
        { text: "Nilai total produksi barang/jasa dalam suatu negara?", options: ["PDB (Produk Domestik Bruto)", "APBN", "IHSG"], correctAnswerIndex: 0, explanation: "Indikator utama kekuatan ekonomi negara." },
        { text: "Sistem ekonomi bebas berdasar persaingan swasta?", options: ["Sosialis", "Komunis", "Kapitalis"], correctAnswerIndex: 2, explanation: "Kapitalisme berlandaskan pasar bebas." },
        { text: "Surat berharga bukti kepemilikan perusahaan?", options: ["Obligasi", "Saham", "Deposito"], correctAnswerIndex: 1, explanation: "Diperdagangkan di Bursa Efek." },
        { text: "Penurunan daya mata uang terhadap mata uang asing?", options: ["Apresiasi", "Sanering", "Depresiasi"], correctAnswerIndex: 2, explanation: "Membuat barang impor terasa lebih mahal." },
        { text: "Pertemuan antara permintaan dan penawaran terjadi di?", options: ["Pasar", "Bank", "Pabrik"], correctAnswerIndex: 0, explanation: "Bisa berwujud fisik atau pasar digital." }
      ]
    },
    {
      id: 13, title: "Misi 13: Kimia Terapan", shortDesc: "Analisis reaksi senyawa.",
      storyContext: "Reaksi kimia adalah dasar pembentukan materi. Selesaikan formulasi unsur molekuler berikut.",
      icon: <FaFlask />, 
      questionPool: [
        { text: "Rumus kimia untuk senyawa air?", options: ["CO2", "H2O", "NaCl"], correctAnswerIndex: 1, explanation: "Dua unsur hidrogen, satu oksigen." },
        { text: "Skala pH di bawah 7 menunjukkan zat bersifat?", options: ["Netral", "Basa", "Asam"], correctAnswerIndex: 2, explanation: "Makin kecil dari 7, makin asam." },
        { text: "Rumus kimia untuk Garam Dapur?", options: ["HCl", "NaOH", "NaCl"], correctAnswerIndex: 2, explanation: "Natrium Klorida." },
        { text: "Unsur pembentuk berlian dan grafit pensil?", options: ["Silikon", "Karbon", "Emas"], correctAnswerIndex: 1, explanation: "Karbon punya allotrop berbeda." },
        { text: "Gas paling ringan untuk mengisi balon terbang?", options: ["Oksigen", "Nitrogen", "Helium"], correctAnswerIndex: 2, explanation: "Tidak mudah terbakar dibanding hidrogen." },
        { text: "Proses perkaratan besi disebut reaksi?", options: ["Reduksi", "Oksidasi", "Sublimasi"], correctAnswerIndex: 1, explanation: "Besi bereaksi dengan oksigen dan air." },
        { text: "Pencipta tabel periodik unsur kimia modern?", options: ["Mendeleev", "Dalton", "Bohr"], correctAnswerIndex: 0, explanation: "Mengelompokkan berdasarkan sifat massa." },
        { text: "Atom bermuatan listrik karena lepas/tangkap elektron?", options: ["Proton", "Molekul", "Ion"], correctAnswerIndex: 2, explanation: "Bisa positif (kation) atau negatif (anion)." },
        { text: "Logam berwujud cair pengisi termometer raksa?", options: ["Merkuri (Hg)", "Perak", "Timbal"], correctAnswerIndex: 0, explanation: "Sangat responsif terhadap panas." },
        { text: "Inti atom (nukleus) tersusun dari?", options: ["Proton & Elektron", "Proton & Neutron", "Neutron & Elektron"], correctAnswerIndex: 1, explanation: "Elektron berada di kulit luar." }
      ]
    },
    {
      id: 14, title: "Misi 14: Fisika Mekanika", shortDesc: "Hukum gerak dan termodinamika.",
      storyContext: "Tanpa pemahaman tentang energi, desainmu akan hancur. Uji analisismu di laboratorium fisika.",
      icon: <FaAtom />, 
      questionPool: [
        { text: "Hukum Inersia (kelembaman) benda adalah Hukum Newton ke?", options: ["Newton I", "Newton II", "Newton III"], correctAnswerIndex: 0, explanation: "Benda mempertahankan posisi diam atau geraknya." },
        { text: "Satuan untuk mengukur Gaya (Force)?", options: ["Joule", "Watt", "Newton"], correctAnswerIndex: 2, explanation: "Berdasarkan nama Isaac Newton." },
        { text: "Energi akibat ketinggian/posisi suatu benda?", options: ["Kinetik", "Mekanik", "Potensial"], correctAnswerIndex: 2, explanation: "Bergantung pada massa, gravitasi, dan tinggi." },
        { text: "Perpindahan panas matahari ke bumi adalah?", options: ["Konveksi", "Konduksi", "Radiasi"], correctAnswerIndex: 2, explanation: "Pancaran tanpa melalui zat perantara." },
        { text: "Kecepatan cahaya dalam ruang hampa?", options: ["3.000 km/s", "300.000 km/s", "30.000 km/s"], correctAnswerIndex: 1, explanation: "Batas kelajuan mutlak alam semesta." },
        { text: "Pencipta teori relativitas E=mc2?", options: ["Edison", "Tesla", "Einstein"], correctAnswerIndex: 2, explanation: "Menjelaskan kesetaraan massa dan energi." },
        { text: "Gaya yang melawan gerak arah benda?", options: ["Gaya Pegas", "Gaya Gesek", "Gaya Berat"], correctAnswerIndex: 1, explanation: "Hadir pada persentuhan dua permukaan." },
        { text: "Bunyi TIDAK BISA merambat melalui?", options: ["Air", "Baja", "Ruang Hampa Udara"], correctAnswerIndex: 2, explanation: "Bunyi butuh medium/partikel untuk merambat." },
        { text: "Lensa untuk membantu penderita rabun jauh (Miopi)?", options: ["Lensa Cekung (-)", "Lensa Cembung (+)", "Lensa Silinder"], correctAnswerIndex: 0, explanation: "Menyebarkan cahaya agar jatuh tepat di retina." },
        { text: "Satuan energi listrik pada meteran rumah tangga?", options: ["Volt", "Ampere", "kWh (Kilowatt-hour)"], correctAnswerIndex: 2, explanation: "Satuan daya (kilo watt) dikali waktu (jam)." }
      ]
    },
    {
      id: 15, title: "Misi 15: Psikologi Klinis", shortDesc: "Memahami kognisi memori manusia.",
      storyContext: "Otak manusia adalah mesin terhebat. Analisis studi kasus psikologi kognitif berikut.",
      icon: <FaBrain />, 
      questionPool: [
        { text: "Bapak pendiri aliran Psikoanalisis?", options: ["Carl Jung", "Sigmund Freud", "Skinner"], correctAnswerIndex: 1, explanation: "Pencetus teori alam bawah sadar, Id, Ego." },
        { text: "Ilusi melihat pola wajah pada awan atau tebing disebut?", options: ["Dejavu", "Amnesia", "Pareidolia"], correctAnswerIndex: 2, explanation: "Otak kita berevolusi untuk mencari pola wajah." },
        { text: "Teori kepribadian Introvert dan Ekstrovert dicetuskan?", options: ["Freud", "Carl Jung", "Pavlov"], correctAnswerIndex: 1, explanation: "Jung memetakan arah energi mental seseorang." },
        { text: "Fobia terhadap ruangan sempit dan tertutup?", options: ["Claustrophobia", "Agoraphobia", "Acrophobia"], correctAnswerIndex: 0, explanation: "Acro = Ketinggian, Agora = Keramaian terbuka." },
        { text: "Eksperimen bel pada anjing Ivan Pavlov melahirkan teori?", options: ["Social Learning", "Classical Conditioning", "Operant Conditioning"], correctAnswerIndex: 1, explanation: "Pembiasaan refleks terhadap stimulus baru." },
        { text: "Hormon yang memicu stres dan kewaspadaan?", options: ["Dopamin", "Oksitosin", "Kortisol"], correctAnswerIndex: 2, explanation: "Hormon respon lari-atau-lawan (fight-or-flight)." },
        { text: "Limit memori jangka pendek manusia (Hukum Miller)?", options: ["2 item", "7 ± 2 item", "Tak terbatas"], correctAnswerIndex: 1, explanation: "Rata-rata otak hanya bisa mengingat 5-9 info sekaligus." },
        { text: "Kecenderungan mencari berita yang membenarkan prasangka sendiri?", options: ["Halo Effect", "Hindsight Bias", "Confirmation Bias"], correctAnswerIndex: 2, explanation: "Bias konfirmasi jadi penyebab maraknya hoaks." },
        { text: "Gangguan perubahan suasana hati ekstrem (Manik-Depresif)?", options: ["Skizofrenia", "Bipolar", "OCD"], correctAnswerIndex: 1, explanation: "Dari sangat ceria menjadi sangat depresi hancur." },
        { text: "Mekanisme Ego melampiaskan kemarahan pada objek lemah?", options: ["Proyeksi", "Rasionalisasi", "Displacement (Pengalihan)"], correctAnswerIndex: 2, explanation: "Contoh: Dimarahi bos, pulang memarahi anak." }
      ]
    },
    {
      id: 16, title: "Misi 16: Geopolitik Global", shortDesc: "Analisis relasi antar negara.",
      storyContext: "Inovasi dipengaruhi oleh kebijakan internasional. Uji wawasan tata negara globalmu.",
      icon: <FaGlobeAmericas />, 
      questionPool: [
        { text: "Markas Besar Perserikatan Bangsa-Bangsa (PBB)?", options: ["London", "Jenewa", "New York"], correctAnswerIndex: 2, explanation: "Terletak di Manhattan, New York City." },
        { text: "Negara merdeka terkecil di dunia?", options: ["Monako", "Vatikan", "Singapura"], correctAnswerIndex: 1, explanation: "Terletak di dalam ibu kota Italia, Roma." },
        { text: "Mata uang resmi negara-negara Uni Eropa?", options: ["Poundsterling", "Dolar", "Euro"], correctAnswerIndex: 2, explanation: "Dirancang untuk memudahkan dagang intra-Eropa." },
        { text: "Perang Dingin (Cold War) dominan antara?", options: ["Inggris & Jerman", "AS & Uni Soviet", "AS & Tiongkok"], correctAnswerIndex: 1, explanation: "Berlangsung hingga Soviet runtuh tahun 1991." },
        { text: "Ibu kota pemerintahan Australia?", options: ["Sydney", "Melbourne", "Canberra"], correctAnswerIndex: 2, explanation: "Banyak yang mengira Sydney adalah ibu kotanya." },
        { text: "Organisasi Kesehatan Dunia di bawah PBB?", options: ["WHO", "WTO", "IMF"], correctAnswerIndex: 0, explanation: "World Health Organization." },
        { text: "Tembok pemisah Jerman Barat & Timur yang runtuh 1989?", options: ["Tembok Maginot", "Tembok Besar", "Tembok Berlin"], correctAnswerIndex: 2, explanation: "Runtuhnya menandai berakhirnya era blok timur eropa." },
        { text: "Benua paling selatan yang tak berpenghuni tetap?", options: ["Arktik", "Antartika", "Greenland"], correctAnswerIndex: 1, explanation: "Ditutupi es abadi tanpa penduduk asli." },
        { text: "Zona waktu pusat dunia (GMT) berada di meridian nol kota?", options: ["Paris", "Washington", "Greenwich (London)"], correctAnswerIndex: 2, explanation: "Greenwich Mean Time." },
        { text: "Pakta Pertahanan Atlantik Utara singkatan dari?", options: ["ASEAN", "OPEC", "NATO"], correctAnswerIndex: 2, explanation: "Aliansi militer antar negara Amerika dan Eropa." }
      ]
    },
    {
      id: 17, title: "Misi 17: Rekayasa Arsitektur", shortDesc: "Struktur dan tata letak peradaban.",
      storyContext: "Bangun peradaban yang tahan uji waktu. Selesaikan matriks desain tata letak berikut.",
      icon: <FaDraftingCompass />, 
      questionPool: [
        { text: "Makam berbentuk limas bangsa Mesir Kuno?", options: ["Sphinx", "Ziggurat", "Piramida"], correctAnswerIndex: 2, explanation: "Piramida Giza yang ikonik." },
        { text: "Gedung arena gladiator di jantung Roma?", options: ["Pantheon", "Colosseum", "Parthenon"], correctAnswerIndex: 1, explanation: "Amphitheater terbesar peninggalan Romawi." },
        { text: "Menara tertinggi di dunia saat ini (Dubai)?", options: ["Taipei 101", "Burj Khalifa", "Shanghai Tower"], correctAnswerIndex: 1, explanation: "Berdiri megah setinggi 828 meter." },
        { text: "Monumen Taj Mahal berada di negara?", options: ["Arab Saudi", "India", "Mesir"], correctAnswerIndex: 1, explanation: "Dibangun kaisar Mughal sebagai makam istri tercinta." },
        { text: "Tembok militer terpanjang di dunia?", options: ["Tembok Berlin", "Tembok Ratapan", "Tembok Besar Tiongkok"], correctAnswerIndex: 2, explanation: "Melindungi kekaisaran Cina kuno dari nomaden utara." },
        { text: "Jembatan gantung merah ikonik di San Francisco?", options: ["Golden Gate Bridge", "London Bridge", "Brooklyn Bridge"], correctAnswerIndex: 0, explanation: "Ikon teknik sipil Amerika." },
        { text: "Gambar rancangan cetak biru bangunan disebut?", options: ["Mockup", "Blueprint", "Sketsa"], correctAnswerIndex: 1, explanation: "Zaman dahulu dicetak di atas kertas berwarna biru." },
        { text: "Bapak arsitektur fungsional modern bergaya kotak/kubus?", options: ["Imhotep", "Zaha Hadid", "Le Corbusier"], correctAnswerIndex: 2, explanation: "Pionir desain gedung pencakar langit purwarupa." },
        { text: "Rumah adat asli masyarakat pegunungan Papua?", options: ["Tongkonan", "Gadang", "Honai"], correctAnswerIndex: 2, explanation: "Beratap jerami dan sangat hangat." },
        { text: "Prinsip Vitruvius: Kekuatan, Fungsi, dan?", options: ["Kapasitas", "Keindahan (Venustas)", "Ekonomi"], correctAnswerIndex: 1, explanation: "Bangunan harus kokoh, berguna, dan estetik." }
      ]
    },
    {
      id: 18, title: "Misi 18: Statistika & Data", shortDesc: "Probabilitas & interpretasi data.",
      storyContext: "Angka tidak pernah bohong. Uji kemampuanmu membaca probabilitas dan tren data.",
      icon: <FaChartPie />, 
      questionPool: [
        { text: "Nilai yang paling sering muncul dari kumpulan data?", options: ["Mean", "Median", "Modus"], correctAnswerIndex: 2, explanation: "Modus (Mode) adalah frekuensi tertinggi." },
        { text: "Nilai rata-rata dari suatu data disebut?", options: ["Mean", "Median", "Range"], correctAnswerIndex: 0, explanation: "Jumlah total dibagi jumlah item." },
        { text: "Nilai tengah setelah data diurutkan dari kecil ke besar?", options: ["Modus", "Median", "Varian"], correctAnswerIndex: 1, explanation: "Membelah data jadi dua bagian seimbang." },
        { text: "Grafik berbentuk lingkaran yang dibagi per sektor?", options: ["Bar Chart", "Line Chart", "Pie Chart"], correctAnswerIndex: 2, explanation: "Bentuknya seperti kue pai." },
        { text: "Peluang munculnya angka genap (2,4,6) pada dadu?", options: ["1/6", "1/3", "1/2"], correctAnswerIndex: 2, explanation: "Ada 3 angka genap dari 6 sisi, 3/6 = 1/2." },
        { text: "Data yang tidak bisa diukur dengan angka (misal warna mobil)?", options: ["Kualitatif", "Kuantitatif", "Rasional"], correctAnswerIndex: 0, explanation: "Data kategori deskriptif." },
        { text: "Keseluruhan objek target penelitian disebut?", options: ["Sampel", "Populasi", "Grup"], correctAnswerIndex: 1, explanation: "Sampel adalah sebagian kecil wakil dari populasi." },
        { text: "Data yang diperoleh dari hasil pengukuran angka pasti disebut?", options: ["Nominal", "Kualitatif", "Kuantitatif"], correctAnswerIndex: 2, explanation: "Quantity artinya jumlah/besaran." },
        { text: "Ilmu tentang pengumpulan dan penganalisisan data acak?", options: ["Aljabar", "Kalkulus", "Statistika"], correctAnswerIndex: 2, explanation: "Statistika melahirkan era Big Data." },
        { text: "Sensus Penduduk Indonesia wajib dilakukan tiap berapa tahun?", options: ["5 Tahun", "10 Tahun", "15 Tahun"], correctAnswerIndex: 1, explanation: "Setiap satu dekade untuk cacah jiwa." }
      ]
    },
    {
      id: 19, title: "Misi 19: Sastra Klasik Dunia", shortDesc: "Karya literatur pengubah dunia.",
      storyContext: "Kata-kata telah mengubah arah sejarah dunia berulang kali. Validasi wawasan sastranya.",
      icon: <FaFeatherAlt />, 
      questionPool: [
        { text: "Penulis lakon tragedi Romeo & Juliet?", options: ["Charles Dickens", "William Shakespeare", "Homer"], correctAnswerIndex: 1, explanation: "Maestro sastra dari daratan Inggris." },
        { text: "Penulis novel petualangan Harry Potter?", options: ["Tolkien", "J.K. Rowling", "C.S. Lewis"], correctAnswerIndex: 1, explanation: "Buku paling populer di era modern." },
        { text: "Sastrawan Indonesia penulis Bumi Manusia?", options: ["Andrea Hirata", "Chairil Anwar", "Pramoedya Ananta Toer"], correctAnswerIndex: 2, explanation: "Karya sastra yang lahir di pengasingan Pulau Buru." },
        { text: "Detektif jenius fiktif dari Baker Street?", options: ["Hercule Poirot", "Sherlock Holmes", "Conan Edogawa"], correctAnswerIndex: 1, explanation: "Diciptakan oleh Sir Arthur Conan Doyle." },
        { text: "Kumpulan kisah Aladdin & Sinbad berasal dari?", options: ["Mitologi Yunani", "1001 Malam (Timur Tengah)", "Epik Mahabharata"], correctAnswerIndex: 1, explanation: "Diceritakan oleh Ratu Scheherazade." },
        { text: "Pencipta fabel kuno dengan tokoh hewan (Kancil, Singa)?", options: ["Aesop", "Andersen", "Grimm Bersaudara"], correctAnswerIndex: 0, explanation: "Aesop adalah pencerita dari era Yunani Kuno." },
        { text: "Penyair buta Yunani penulis epik Perang Troya (Iliad)?", options: ["Socrates", "Homer", "Aristoteles"], correctAnswerIndex: 1, explanation: "Homer mewariskan dasar epik literatur Eropa." },
        { text: "Dongeng Eropa tentang putri yang sepatunya tertinggal?", options: ["Snow White", "Cinderella", "Rapunzel"], correctAnswerIndex: 1, explanation: "Sepatu kaca khas Cinderella." },
        { text: "Penulis Prancis karya penderitaan rakyat 'Les Miserables'?", options: ["Voltaire", "Rousseau", "Victor Hugo"], correctAnswerIndex: 2, explanation: "Buku tebal revolusi kaum miskin." },
        { text: "Puisi 3 baris sangat pendek dan padat dari Jepang?", options: ["Manga", "Tanka", "Haiku"], correctAnswerIndex: 2, explanation: "Biasanya memiliki suku kata 5-7-5." }
      ]
    },
    {
      id: 20, title: "Misi 20: Cetak Biru Utama", shortDesc: "Integrasi semua sektor ilmu.",
      storyContext: "GERBANG FINAL. Integrasikan segala disiplin ilmu menjadi satu keputusan bulat.",
      icon: <FaProjectDiagram />, 
      questionPool: [
        { text: "Fondasi absolut dari sebuah metode ilmiah?", options: ["Mitos dan Asumsi", "Observasi dan Bukti Empiris", "Opini Mayoritas"], correctAnswerIndex: 1, explanation: "Sains bertumpu pada bukti nyata yang teruji." },
        { text: "Apa itu Artificial Intelligence (AI)?", options: ["Internet Otomatis", "Kecerdasan Buatan Mesin", "Bahasa Alien"], correctAnswerIndex: 1, explanation: "Mesin yang meniru kognisi manusia." },
        { text: "Fokus Revolusi Industri 4.0?", options: ["Mesin Uap", "Listrik", "Digitalisasi & IoT"], correctAnswerIndex: 2, explanation: "Era Data Besar dan internet untuk segala." },
        { text: "Hukum Pertama Robotika (Asimov)?", options: ["Robot tidak boleh melukai manusia", "Robot harus berkuasa", "Robot punya emosi"], correctAnswerIndex: 0, explanation: "Keamanan umat manusia adalah prioritas mutlak." },
        { text: "Mata uang digital terenkripsi (Bitcoin dsb)?", options: ["Sistem Barter", "Cryptocurrency", "E-Money"], correctAnswerIndex: 1, explanation: "Menggunakan sistem algoritma blockchain." },
        { text: "Ilmu perpaduan Data Komputer & Biologi Genetik?", options: ["Geofisika", "Bioinformatika", "Astrotek"], correctAnswerIndex: 1, explanation: "Penting untuk menemukan penyembuhan penyakit." },
        { text: "Energi ideal peradaban masa depan (Nol Emisi)?", options: ["Batu Bara", "Gas Bumi", "Energi Terbarukan (Angin/Surya)"], correctAnswerIndex: 2, explanation: "Untuk menjaga iklim bumi yang rapuh." },
        { text: "Filsuf pengucap 'Cogito Ergo Sum' (Aku berpikir maka aku ada)?", options: ["Plato", "Rene Descartes", "Aristoteles"], correctAnswerIndex: 1, explanation: "Landasan utama nalar/rasionalisme manusia modern." },
        { text: "Masa depan peradaban bertumpu pada inovasi dan?", options: ["Perang Militer", "Edukasi Berkelanjutan", "Eksploitasi Alam"], correctAnswerIndex: 1, explanation: "Pendidikan (EduQuest) adalah senjata peradaban sejati." },
        { text: "Cetak Biru EduQuest ditujukan untuk?", options: ["Menghancurkan bumi", "Membangun sistem pendidikan unggul masa depan", "Mencuri data"], correctAnswerIndex: 1, explanation: "Selamat! Cetak biru telah siap." }
      ]
    }
  ];

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setCustomAlert({message: '', type: null, visible: false});

    if (authMode === 'register') {
      if (localStorage.getItem(usernameInput)) {
        setAuthError('Username ini sudah terdaftar.');
        showNotification('Username ini sudah terdaftar. Silakan gunakan nama lain.', 'error');
        return;
      }
      localStorage.setItem(usernameInput, passwordInput);
      setAuthMode('login');
      setPasswordInput('');
      showNotification('Registrasi Berhasil! Selamat Datang, Inovator.', 'success');
    } else {
      const savedPassword = localStorage.getItem(usernameInput);
      if (savedPassword && savedPassword === passwordInput) {
        setIsLoggedIn(true);
        setActiveUser(usernameInput);
        localStorage.setItem('currentUser', usernameInput);
      } else {
        setAuthError('Username atau Password salah!');
        showNotification('Username atau Password salah!', 'error');
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false); setActiveUser(''); setUsernameInput(''); setPasswordInput('');
    setUnlockedMissions([1]); 
    setIsProfileDropdownOpen(false);
    localStorage.removeItem('currentUser');
  };

  // Pseudo-randomizer menggunakan Date.now() agar aman dari Linter Warning Math.random
  const openMissionModal = (mission: Mission) => {
    // eslint-disable-next-line
    const randomIndex = Math.floor(Math.random() * mission.questionPool.length);
    setActiveQuestion(mission.questionPool[randomIndex] || mission.questionPool[0]);
    setActiveMission(mission);
    setQuizResult('idle');
    setIsAnswerCorrect(null);
  };

  const closeModal = () => {
    setActiveMission(null); 
    setActiveQuestion(null); 
    setQuizResult('idle'); 
    setIsAnswerCorrect(null);
  };

  const handleAnswer = (index: number) => {
    if (quizResult === 'answered') return; 
    
    const correct = index === activeQuestion?.correctAnswerIndex;
    setIsAnswerCorrect(correct);
    setQuizResult('answered');
    
    if (correct && activeMission) {
      const newUnlocked = Array.from(new Set([...unlockedMissions, activeMission.id + 1]));
      setUnlockedMissions(newUnlocked);
      localStorage.setItem(`unlocked_${activeUser}`, JSON.stringify(newUnlocked));
    }
  };

  // --- 🚀 FUNGSI MELANJUTKAN MISI SECARA SEAMLESS 🚀 ---
  const handleNextMission = () => {
    if (activeMission && activeMission.id < missions.length) {
      const nextMission = missions.find(m => m.id === activeMission.id + 1);
      if (nextMission) {
        const randomIndex = Math.floor((Date.now() % 100) / 100 * nextMission.questionPool.length);
        setActiveQuestion(nextMission.questionPool[randomIndex] || nextMission.questionPool[0]);
        setActiveMission(nextMission);
        setQuizResult('idle');
        setIsAnswerCorrect(null);
      } else {
        closeModal();
      }
    } else {
      closeModal();
    }
  };

  // --- 🚀 FUNGSI MOUSE PARALLAX (LOGIN) 🚀 ---
  const handleMouseMove = (e: React.MouseEvent) => {
    const x = (window.innerWidth / 2 - e.clientX) / 25; 
    const y = (window.innerHeight / 2 - e.clientY) / 25;
    setMousePos({ x, y });
    setExactMouse({ x: e.clientX, y: e.clientY });
  };

  // PERHITUNGAN BARU: Max Misi 20
  const isGameCompleted = unlockedMissions.includes(21); 
  const completedMissionsCount = unlockedMissions.length - 1;
  const progressPercent = (completedMissionsCount / 20) * 100;

  return (
    <>
      {/* --- ANIMASI BACKGROUND STATIS --- */}
      <div className="cyber-grid"></div>
      <div className="floating-particles">
        <div className="particle"></div><div className="particle"></div>
        <div className="particle"></div><div className="particle"></div>
        <div className="particle"></div>
      </div>

      {/* 🌟 TAMPILAN HALAMAN LOGIN 🌟 */}
      {!isLoggedIn ? (
        <div className="login-page-container" onMouseMove={handleMouseMove}>
          
          <div className="cursor-spotlight" style={{ left: `${exactMouse.x}px`, top: `${exactMouse.y}px` }} />
          
          <div className="ambient-light light-1" style={{ transform: `translate(${mousePos.x * -2}px, ${mousePos.y * -2}px)` }}></div>
          <div className="ambient-light light-2" style={{ transform: `translate(${mousePos.x * 2}px, ${mousePos.y * 2}px)` }}></div>
          <div className="ambient-light light-3" style={{ transform: `translate(${mousePos.x * 1.5}px, ${mousePos.y * 1.5}px)` }}></div>

          <div 
            key={authMode} 
            className="glass-card-premium entrance-animation"
            style={{ 
              transform: `perspective(1000px) rotateY(${mousePos.x}deg) rotateX(${-mousePos.y}deg)`,
              transformStyle: 'preserve-3d',
              transition: 'transform 0.1s ease-out' 
            }}
          >
            <div style={{ transform: 'translateZ(40px)' }}>
              {customAlert.visible && (
                <div className={`custom-alert-banner ${customAlert.type}`}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <span>{customAlert.type === 'success' ? '✨' : '⚠️'}</span>
                    <span>{customAlert.message}</span>
                  </div>
                  <button onClick={() => setCustomAlert(prev => ({ ...prev, visible: false }))} style={{background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold'}}>&times;</button>
                </div>
              )}

              <h1 className="text-glow-premium" style={{ paddingBottom: '10px' }}> EduQuest<span style={{ color: '#06b6d4' }}>.</span></h1>
              <p className="auth-subtitle">
                {authMode === 'login' ? 'Masuk ke Pusat Komando EduQuest' : 'Daftar sebagai Inovator Baru'}
              </p>
              
              <form onSubmit={handleAuth} className="form-container">
                <input type="text" className="glass-input-premium" placeholder="Username" required value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} inputMode="text" />
                
                <div className="input-wrapper" style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="glass-input-premium" 
                    placeholder="Kata Sandi Protokol" 
                    required 
                    value={passwordInput} 
                    onChange={(e) => setPasswordInput(e.target.value)}
                    style={{ paddingRight: '50px' }} 
                  />
                  <span className="input-focus-border"></span>
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                
                {authError && !customAlert.visible && <div className="auth-error-text">{authError}</div>}
                <button type="submit" className="btn-glow-premium hover-sweep">{authMode === 'login' ? 'Mulai Sesi' : 'Buat Akun'}</button>
              </form>

              <p className="auth-switch-text">
                {authMode === 'login' ? "Belum punya akses? " : "Sudah terdaftar? "}
                <span className="auth-switch-link" onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError(''); setCustomAlert({message: '', type: null, visible: false}); }}>
                  {authMode === 'login' ? "Registrasi di sini" : "Login di sini"}
                </span>
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* 🌟 TAMPILAN DASHBOARD UTAMA 🌟 */
        <>
          <div className="entrance-animation">
          <nav className="navbar-glass">
            <h1 className="text-glow">EduQuest.</h1>
            
            {/* BUNGKUS MENU, PROFIL, DAN HAMBURGER DI KANAN AGAR BERDEKATAN */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '25px', zIndex: 1005 }}>
              
              {/* Link Menu (Akan berjajar rapi di kiri profil pada Desktop) */}
              <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                <ul>
                  <li><a href="#home" onClick={() => setIsMenuOpen(false)}>Home</a></li>
                  <li><a href="#about" onClick={() => setIsMenuOpen(false)}>About</a></li>
                  <li><a href="#content" onClick={() => setIsMenuOpen(false)}>Content</a></li>
                  <li><a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a></li>
                </ul>
              </div>

              {/* 🚀 FITUR AVATAR PROFIL & DROPDOWN KELUAR 🚀 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                
                {/* 🚀 TOMBOL LIGHT/DARK MODE 🚀 */}
                <button 
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '20px', cursor: 'pointer', transition: 'transform 0.3s' }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'rotate(30deg)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'rotate(0deg)'}
                  title="Ganti Tema"
                >
                  {theme === 'dark' ? <FaSun /> : <FaMoon />}
                </button>

                {/* 🚀 FITUR AVATAR PROFIL & DROPDOWN KELUAR 🚀 */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginLeft: '10px', paddingLeft: '20px', borderLeft: '1px solid var(--glass-border)' }}>
                  <div 
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-color), #3b82f6)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', letterSpacing: '1px', boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)', transition: 'transform 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {getInitials(activeUser)}
                  </div>
                  
                  {isProfileDropdownOpen && (
                    <div className="entrance-animation" style={{ position: 'absolute', top: '57px', right: '0', background: theme === 'dark' ? '#0f172a' : '#ffffff', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', zIndex: 100 }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', textAlign: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>
                          Sesi Aktif:<br/><strong style={{color: 'var(--text-main)'}}>{formatName(activeUser)}</strong>
                      </div>
                      
                      {/* 🚀 TOMBOL KELUAR DENGAN CLASS CSS BARU 🚀 */}
                      <button onClick={handleLogout} className="btn-logout">
                        Keluar Sistem
                      </button>

                    </div>
                  )}
                </div>
              </div>

              {/* Hamburger Menu (Hanya Muncul di Mobile) */}
              <div className={`hamburger ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
                <span></span><span></span><span></span>
              </div>
            </div>
          </nav>

            <section id="home" className="hero-modern" style={{ paddingTop: '100px' }}>
              <div className="hero-text-content">
                <div className="badge-inovasi" style={{ fontFamily: 'monospace', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%', boxShadow: '0 0 10px #4ade80', animation: 'pulse 2s infinite' }}></span>
                  STATUS: KONEKSI AMAN
                </div>
                
                <h1 style={{ fontSize: '52px', lineHeight: '1.2' }}>
                  Inisiasi Sistem, <br />
                  <span className="text-glow" style={{ fontFamily: 'monospace' }}>[{formatName(activeUser)}]</span>
                </h1>
                <p style={{ color: '#cbd5e1', marginBottom: '40px' }}>
                  Akses terminal pusat diizinkan. Silakan selesaikan kalibrasi 20 sektor ilmu pengetahuan dasar untuk menyusun cetak biru inovasi pendidikan masa depan (INNOVATE).
                </p>
                
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <a href="#content" className="btn-glow hover-sweep" style={{ textDecoration: 'none', textAlign: 'center' }}>
                    Akses Terminal Uji
                  </a>
                </div>
              </div>

              <div className="hero-visual" style={{ perspective: '1000px', animation: 'none' }}>
                <div className="glass-card" style={{ transform: 'rotateY(-15deg) rotateX(5deg)', padding: '35px', boxShadow: '-20px 20px 50px rgba(0,0,0,0.5)', border: '1px solid rgba(6, 182, 212, 0.4)', transition: 'transform 0.5s ease', textAlign: 'left' }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'rotateY(0deg) rotateX(0deg)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'rotateY(-15deg) rotateX(5deg)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', marginBottom: '25px' }}>
                     <span style={{ fontFamily: 'monospace', color: 'var(--accent-color)', fontWeight: 'bold', fontSize: '14px' }}>// PANEL_DIAGNOSTIK_SISTEM</span>
                     <span style={{ fontSize: '24px' }}>⚙️</span>
                  </div>
                  
                  <div style={{ marginBottom: '25px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', color: '#cbd5e1', fontWeight: 'bold' }}>
                      <span>Progres Kalibrasi Modul</span>
                      <span style={{ color: '#4ade80' }}>{progressPercent}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.4)', borderRadius: '10px', overflow: 'hidden' }}>
                       <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(to right, #06b6d4, #4ade80)', transition: 'width 1s ease-in-out' }}></div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '5px', textTransform: 'uppercase' }}>Modul Tervalidasi</div>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>{completedMissionsCount} <span style={{ fontSize: '14px', color: '#64748b' }}>/ 20</span></div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '5px', textTransform: 'uppercase' }}>Integritas Jaringan</div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: isGameCompleted ? '#4ade80' : '#facc15' }}>
                        {isGameCompleted ? 'Optimal' : 'Menunggu'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="about" className="section-container" style={{ padding: '60px 5%' }}>
              <h2 className="section-title text-glow" style={{ marginBottom: '20px', marginTop: '30px'}}>Tentang EduQuest</h2>
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto 50px', fontSize: '16px', lineHeight: '1.8' }}>
                EduQuest adalah sebuah platform gamifikasi edukasi yang dirancang untuk menguji kelayakan wawasan dasar para pelajar secara acak dan dinamis. Kami percaya bahwa untuk menciptakan inovasi (INNOVATE) di masa depan, seorang pelajar harus memiliki fondasi yang kuat dari berbagai disiplin ilmu.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                <div className="glass-card hover-sweep" style={{ textAlign: 'center', padding: '30px 20px' }}>
                  <div className='flex justify-center text-[40px] mb-[15px]'><FaDice /></div>
                  <h3 style={{ color: 'var(--accent-color)', marginBottom: '10px' }}>Anti-Cheat System</h3>
                  <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>Menggunakan sistem pengacakan dari 'Bank Soal' rahasia. Setiap upaya peretasan atau pengulangan akan menyuguhkan tantangan yang berbeda.</p>
                </div>
                <div className="glass-card hover-sweep" style={{ textAlign: 'center', padding: '30px 20px' }}>
                  <div className='flex justify-center text-[40px] mb-[15px]'><FaGlobe /></div>
                  <h3 style={{ color: '#3b82f6', marginBottom: '10px' }}>Holistic Learning</h3>
                  <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>Tidak hanya berfokus pada teknologi, kami menguji pemahaman pengguna terhadap alam semesta, sejarah, dan nilai kemanusiaan.</p>
                </div>
                <div className="glass-card hover-sweep" style={{ textAlign: 'center', padding: '30px 20px' }}>
                  <div className='flex justify-center text-[40px] mb-[15px]'><FaChartLine/></div>
                  <h3 style={{ color: '#f59e0b', marginBottom: '10px' }}>Progression Tracker</h3>
                  <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>Peta misi yang mengunci sektor selanjutnya jika wawasan pengguna belum tervalidasi (Validate) secara akurat.</p>
                </div>
              </div>
            </section>

            <section id="content" className="section-container" style={{ paddingTop: '80px' }}>
              <h2 className="section-title text-glow" style={{marginTop: '30px'}}>Peta Ekspedisi Ilmu</h2>
              
              {isGameCompleted && (
                <div className="entrance-animation hover-sweep" style={{ background: 'rgba(74, 222, 128, 0.1)', border: '1px solid #4ade80', padding: '30px', borderRadius: '15px', textAlign: 'center', marginBottom: '40px' }}>
                  <div style={{ fontSize: '50px', marginBottom: '10px' }}>🏆</div>
                  <h3 style={{ color: '#4ade80', margin: '0 0 15px 0', fontSize: '26px' }}>Ekspedisi Terselesaikan!</h3>
                  <p style={{ margin: '0 auto 0', color: '#e2e8f0', lineHeight: '1.6', maxWidth: '700px' }}>
                    Luar biasa, {formatName(activeUser)}! Pemahamanmu terhadap logika, sains, sejarah, dan sosial telah teruji sempurna. 
                    Cetak birumu siap diluncurkan!
                  </p>
                </div>
              )}

              <div className="roadmap-container">
                {missions.map((mission) => {
                  const isUnlocked = unlockedMissions.includes(mission.id) || isGameCompleted;
                  const isCompleted = unlockedMissions.includes(mission.id + 1) || isGameCompleted;

                  return (
                    <div key={mission.id} className="roadmap-item">
                      <div className={`roadmap-node ${isUnlocked ? 'unlocked' : ''}`} style={{ background: isCompleted ? '#166534' : '' }}>
                        {isCompleted ? <FaCheck /> : mission.id}
                      </div>
                      <div className="glass-card hover-sweep" style={{ borderColor: isCompleted ? '#4ade80' : '' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
                          <div style={{ fontSize: '45px', color: isCompleted ? '#4ade80' : (isUnlocked ? '#64748b' : '#64748b') }}>{mission.icon}</div>
                          <div>
                            <h3 >{mission.title}</h3>
                            <span className="flex items-center gap-1.5 text-[13px]" style={{ color: isCompleted ? '#4ade80' : (isUnlocked ? '#facc15' : '#f87171') }}>
                              {isCompleted ? (<> <FaCheck /> Sektor Teranalisis </>  ) : (isUnlocked ? (<> <FaUnlock /> Membutuhkan Otorisasi </> ) : (<> <FaLock /> Akses Terkunci </>))}
                            </span>
                          </div>
                        </div>
                        <p>{mission.shortDesc}</p>
                        
                        {!isCompleted ? (
                          <button 
                            className={`btn-glow ${!isUnlocked ? 'btn-disabled' : ''}`} style={{ marginTop: '15px' }}
                            onClick={() => isUnlocked ? openMissionModal(mission) : null} disabled={!isUnlocked}
                          >
                            {isUnlocked ? 'Akses Terminal' : 'Selesaikan Misi Sebelumnya'}
                          </button>
                        ) : (
                          <div style={{ marginTop: '15px', color: '#4ade80', fontSize: '14px', fontWeight: 'bold' }}>
                            Data Terverifikasi.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section id="contact" className="section-container" style={{ background: 'rgba(0,0,0,0.2)' }}>
              <h2 className="section-title text-glow">Hubungi Markas</h2>
              <form className="contact-form" onSubmit={(e) => { e.preventDefault(); alert('Transmisi berhasil dikirim!'); }}>
                <input type="text" className="glass-input" placeholder="Nama Inovator" required />
                <input type="email" className="glass-input" placeholder="Email Kontak" required />
                <textarea className="glass-input" placeholder="Laporan bug atau ide pertanyaan edukasi baru..." required></textarea>
                <button type="submit" className="btn-glow hover-sweep" style={{ marginTop: '10px' }}>Kirim Transmisi</button>
              </form>
            </section>

            <footer style={{ textAlign: 'center', padding: '30px', borderTop: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontSize: '14px' }}>
              &copy; 2026 EduQuest. Merancang Pendidikan Masa Depan.
            </footer>
          </div>

          {/* 🚀 MODAL KUIS DITEMPATKAN DI SINI (Di Luar entrance-animation) 🚀 */}
          {(activeMission && activeQuestion) && (
            // OVERLAY: Ditambahkan p-4 agar di HP ada jarak dari pinggir layar
            <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={closeModal}>
              <div 
                className="modal-content entrance-animation relative w-full max-w-2xl max-h-[90vh] overflow-y-auto hide-scrollbar rounded-2xl bg-[#0f172a] p-5 md:p-8" 
                onClick={(e) => e.stopPropagation()} 
                style={{ borderTop: '4px solid var(--accent-color)' }}
              >
                {/* TOMBOL CLOSE */}
                <button 
                  onClick={closeModal} 
                  className="absolute top-3 right-4 text-3xl text-gray-400 hover:text-white transition-colors"
                >
                  &times;
                </button>
                
                {/* --- KONDISI: SEDANG MENJAWAB --- */}
                {quizResult === 'idle' && (
                  <>
                    <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6">
                      <div className="text-4xl md:text-[45px]" style={{ color: 'var(--accent-color)' }}>
                        {activeMission.icon}
                      </div>
                      <h2 className="text-glow text-lg md:text-2xl font-bold m-0">
                        {activeMission.title}
                      </h2>
                    </div>

                    <div className="bg-[#020617] p-4 md:p-5 rounded-xl mb-6 border border-slate-800 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">
                      <p className="m-0 text-[#4ade80] text-xs md:text-sm font-mono whitespace-pre-wrap leading-relaxed">
                        {activeMission.storyContext}
                      </p>
                    </div>
                    
                    <div className="bg-white/5 p-4 md:p-5 rounded-xl border border-white/5">
                      <h4 className="mt-0 mb-3 md:mb-4 text-xs md:text-sm font-bold" style={{ color: 'var(--accent-color)' }}>
                        Otorisasi Dibutuhkan:
                      </h4>
                      <p className="mb-4 md:mb-5 font-bold text-sm md:text-base leading-snug">
                        {activeQuestion.text}
                      </p>
                      <div className="flex flex-col gap-2 mt-4">
                        {activeQuestion.options.map((opt, index) => (
                          <button key={index} className="quiz-option text-left text-xs md:text-sm p-3 md:p-4 rounded-lg hover:bg-white/10 transition-colors" onClick={() => handleAnswer(index)}>
                            <span className="font-bold mr-2 md:mr-3" style={{ color: 'var(--accent-color)' }}>
                              [{String.fromCharCode(65 + index)}]
                            </span> 
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* --- KONDISI: SETELAH MENJAWAB --- */}
                {quizResult === 'answered' && (
                  <div className="text-center py-4 md:py-6">
                    <div 
                      className="flex text-6xl md:text-[70px] mb-4 justify-center" 
                      style={{ filter: isAnswerCorrect ? 'drop-shadow(0 0 20px rgba(74, 222, 128, 0.5))' : 'drop-shadow(0 0 20px rgba(239, 68, 68, 0.5))' }}
                    >
                      {isAnswerCorrect ? <FaCheckCircle /> : <FaTimesCircle />}
                    </div>
                    <h2 className={`h2-light mb-3 font-mono tracking-widest text-lg md:text-xl font-bold ${isAnswerCorrect ? 'text-[#4ade80]' : 'text-red-500'}`}>
                      {isAnswerCorrect ? 'OTORISASI DITERIMA' : 'AKSES DITOLAK'}
                    </h2>
                    
                    {!isAnswerCorrect && (
                      <div className="text-red-300 text-xs md:text-sm my-4 bg-red-500/10 p-3 md:p-4 rounded-lg">
                        Anomali terdeteksi pada logika respons. Enkripsi misi berikutnya tetap aktif.
                      </div>
                    )}

                    <div className="bg-[#020617] p-4 md:p-5 rounded-xl mt-5 text-left border border-slate-800">
                      <h4 className="m-0 mb-2 font-mono text-xs md:text-sm" style={{ color: 'var(--accent-color)' }}>
                        &gt; LOG SISTEM:
                      </h4>
                      <p className="m-0 leading-relaxed text-xs md:text-sm text-slate-300">
                        {activeQuestion.explanation}
                      </p>
                    </div>
                    
                    <p className="!mt-3 !mb-3 text-xs md:text-sm text-slate-400">
                      {isAnswerCorrect 
                        ? (activeMission.id < missions.length ? "Gerbang menuju sektor selanjutnya telah terbuka. Anda dapat melanjutkan ekspedisi sekarang." : "Seluruh sektor telah divalidasi. Misi selesai.")
                        : "Koneksi diputus secara paksa. Pertanyaan akan diacak ulang pada upaya berikutnya."}
                    </p>
                    
                    {/* TOMBOL BAWAH: flex-col untuk HP, flex-row untuk Desktop */}
                    <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center">
                      <button 
                        className="btn-light btn-glow w-full text-xs md:text-sm py-3" 
                        onClick={closeModal} 
                        style={{ background: isAnswerCorrect ? 'rgba(255,255,255,0.1)' : '' }}
                      >
                        {isAnswerCorrect ? 'Kembali ke Dashboard' : 'Muat Ulang Sesi'}
                      </button>

                      {isAnswerCorrect && (
                        <button 
                          className="btn-glow hover-sweep w-full text-xs md:text-sm py-3" 
                          style={{ 
                            background: activeMission.id === missions.length ? 'linear-gradient(to right, #f59e0b, #ef4444)' : '' 
                          }} 
                          onClick={activeMission.id < missions.length ? handleNextMission : closeModal}
                        >
                          {activeMission.id < missions.length ? 'Lanjutkan Ekspedisi' : 'Selesaikan Ekspedisi'}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default App;