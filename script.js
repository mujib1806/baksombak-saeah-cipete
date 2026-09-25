// ==========================================
// VARIABEL GLOBAL & FIREBASE
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyCBdZEmYbnIUuZ4Weu8vXFMh-EBPWmShNY",
    authDomain: "stockbaksoapp2.firebaseapp.com",
    databaseURL: "https://stockbaksoapp2-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "stockbaksoapp2",
    storageBucket: "stockbaksoapp2.firebasestorage.app",
    messagingSenderId: "762988721032",
    appId: "1:762988721032:web:ece3972d70e1f79803c03d"
};

if (firebaseConfig.apiKey !== "AIzaSyYOUR_API_KEY_HERE") { 
    firebase.initializeApp(firebaseConfig); 
}
const db = (firebase.apps && firebase.apps.length > 0) ? firebase.firestore() : null;

// Variabel Global Penangkap Cabang Aktif
let CABANG_AKTIF = localStorage.getItem('cabangAktif') || 'cipete_utara';

const configSistem = firebase.app().options; 
const aplikasiPendaftaran = firebase.initializeApp(configSistem, "JalurDaftar");

const defaultMasterProduk = [
    { nama: "Bakso Sapi", kategori: "Bakso Malang", modal: 2000, jual: 2500, margin: 500, stokGudang: 0, batasMinimum: 0 },
    { nama: "Tahu", kategori: "Bakso Malang", modal: 2000, jual: 2500, margin: 500, stokGudang: 0, batasMinimum: 0 },
    { nama: "Siomay", kategori: "Bakso Malang", modal: 2000, jual: 2500, margin: 500, stokGudang: 0, batasMinimum: 0 },
    { nama: "Bakso Goreng", kategori: "Bakso Malang", modal: 2000, jual: 2500, margin: 500, stokGudang: 0, batasMinimum: 0 },
    { nama: "Bakwan Isi", kategori: "Bakso Malang", modal: 2000, jual: 2500, margin: 500, stokGudang: 0, batasMinimum: 0 },
    { nama: "Roll Isi", kategori: "Bakso Malang", modal: 2000, jual: 2500, margin: 500, stokGudang: 0, batasMinimum: 0 },
    { nama: "Kerupuk Kaleng Putih", kategori: "Reseller", modal: 1500, jual: 2500, margin: 1000, stokGudang: 20, batasMinimum: 10 },
    { nama: "Kerupuk Kaleng Coklat", kategori: "Reseller", modal: 1500, jual: 2500, margin: 1000, stokGudang: 20, batasMinimum: 10 },
    { nama: "Jeruk Peras", kategori: "Reseller", modal: 2000, jual: 5000, margin: 3000, stokGudang: 20, batasMinimum: 10 },
    { nama: "Mineral Botol", kategori: "Reseller", modal: 2000, jual: 4000, margin: 2000, stokGudang: 24, batasMinimum: 12 },
    { nama: "Tebs Botol", kategori: "Reseller", modal: 2200, jual: 5000, margin: 2800, stokGudang: 24, batasMinimum: 12 },
    { nama: "Teh Botol", kategori: "Reseller", modal: 2000, jual: 5000, margin: 3000, stokGudang: 24, batasMinimum: 12 },
    { nama: "Lontong", kategori: "Reseller", modal: 1500, jual: 4000, margin: 2500, stokGudang: 0, batasMinimum: 0 },
    { nama: "Kacang", kategori: "Reseller", modal: 1500, jual: 2500, margin: 1000, stokGudang: 0, batasMinimum: 0 },
    { nama: "Mie Goreng", kategori: "Reseller", modal: 3000, jual: 6000, margin: 3000, stokGudang: 0, batasMinimum: 0 },
    { nama: "Mie Soto", kategori: "Reseller", modal: 3000, jual: 6000, margin: 3000, stokGudang: 0, batasMinimum: 0 },
    { nama: "Mie Kari", kategori: "Reseller", modal: 3000, jual: 6000, margin: 3000, stokGudang: 0, batasMinimum: 0 },
    { nama: "Fruit Tea Blackcurrent", kategori: "Reseller", modal: 2000, jual: 5000, margin: 3000, stokGudang: 24, batasMinimum: 10 },
    { nama: "Fruit Tea Apel", kategori: "Reseller", modal: 2000, jual: 5000, margin: 3000, stokGudang: 24, batasMinimum: 10 },
    { nama: "Papperbowl", kategori: "Reseller", modal: 1400, jual: 2000, margin: 600, stokGudang: 50, batasMinimum: 20 },
    { nama: "Gelas 16 Oz", kategori: "Reseller", modal: 600, jual: 1000, margin: 400, stokGudang: 50, batasMinimum: 20 },
    { nama: "Makroni", kategori: "Reseller", modal: 1500, jual: 2500, margin: 1000, stokGudang: 0, batasMinimum: 0 },
    { nama: "Makroni Pedes", kategori: "Reseller", modal: 3000, jual: 4000, margin: 1000, stokGudang: 0, batasMinimum: 0 },
    { nama: "Lebihan Bakso", kategori: "Reseller", modal: 2000, jual: 2500, margin: 500, stokGudang: 0, batasMinimum: 0 },
    { nama: "Teh Manis", kategori: "Reseller", modal: 1500, jual: 4000, margin: 2500, stokGudang: 0, batasMinimum: 0 }
];
const defaultKategori = ["Bakso Malang", "Reseller"];

const defaultVendorCatalog = [
    { nama: "Prima Mineral", kemasan: "Botol Pelastik", vol: "600 Ml", isi: "24", rasa: "Original", harga: 38000, qty: "" },
    { nama: "Teh Botol Sosro", kemasan: "Botol Beling", vol: "220 Ml", isi: "24", rasa: "Original", harga: 48000, qty: "" },
    { nama: "Teh Botol Sosro", kemasan: "Carton Pack", vol: "250 Ml", isi: "24", rasa: "Original", harga: 60000, qty: "" },
    { nama: "Teh Botol Sosro", kemasan: "Carton Pack", vol: "250 Ml", isi: "24", rasa: "Less Sugar", harga: 60000, qty: "" },
    { nama: "Fruit Tea", kemasan: "Botol Beling", vol: "235 Ml", isi: "24", rasa: "Blackcurrent", harga: 48000, qty: "" },
    { nama: "Fruit Tea", kemasan: "Carton Pack", vol: "250 Ml", isi: "24", rasa: "Lemon", harga: 60000, qty: "" },
    { nama: "Fruit Tea", kemasan: "Carton Pack", vol: "250 Ml", isi: "24", rasa: "Blackcurrent", harga: 60000, qty: "" },
    { nama: "Fruit Tea", kemasan: "Carton Pack", vol: "250 Ml", isi: "24", rasa: "Apel", harga: 60000, qty: "" },
    { nama: "Country Choice", kemasan: "Carton Pack", vol: "250 Ml", isi: "24", rasa: "Mangga", harga: 105000, qty: "" },
    { nama: "Country Choice", kemasan: "Carton Pack", vol: "250 Ml", isi: "24", rasa: "Jeruk", harga: 105000, qty: "" },
    { nama: "Country Choice", kemasan: "Carton Pack", vol: "250 Ml", isi: "24", rasa: "Jambu", harga: 105000, qty: "" }
];

let masterProduk = defaultMasterProduk;
let daftarKategori = defaultKategori;
let vendorCatalog = defaultVendorCatalog;

let dbStok = {}, dbPengeluaranHarian = [], dbKasMasuk = {}, dbLogKas = [], dbSetoranDapur = {}, dbGajiHarian = {}, dbStatusKunci = {};
let activeKasTab = 'Reseller';
let currentUser = null;
// Array penampung riwayat pergerakan stok
let riwayatStok = [];

// Fungsi untuk mencatat mutasi stok
function catatRiwayatStok(namaProduk, jenisAksi, jumlahPerubahan, sisaStokAkhir) {
    const now = new Date();
    const tglFormat = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    const jamFormat = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
    const waktuStr = `${tglFormat}, ${jamFormat}`;
    
    // FORMAT BARU: Untuk kebutuhan filter rentang tanggal
    const tglIso = now.toISOString().split('T')[0]; 

    let namaUser = "Admin";
    if (typeof currentUser !== 'undefined' && currentUser && currentUser.role) {
        namaUser = currentUser.role;
    }

    const itemBaru = {
        waktu: waktuStr,
        tanggalIso: tglIso, // <--- Data baru disisipkan disini
        produk: namaProduk,
        aksi: jenisAksi, // 'In' atau 'Out'
        perubahan: jenisAksi === 'In' ? `+${jumlahPerubahan}` : `-${jumlahPerubahan}`,
        sisa: sisaStokAkhir,
        oleh: namaUser
    };

    riwayatStok.unshift(itemBaru);
    
    // PERBAIKAN: Perbesar daya tampung riwayat dari 50 menjadi 500 aktivitas terakhir
    if (riwayatStok.length > 500) riwayatStok.pop(); 

    if (typeof db !== 'undefined' && db && typeof CABANG_AKTIF !== 'undefined') {
        db.collection('cabang').doc(CABANG_AKTIF).collection('appData').doc('riwayatStok').set({ list: riwayatStok });
    }

    renderTabelRiwayatStok();
}
// Variabel Global Pengaturan Finansial
let pengaturanCabangAktif = {
    gajiHarian: 50000,
    toleransiLibur: 2,
    gajiBulanan: 1500000,
    pos1: { nama: "Dana Darurat", persen: 20 },
    pos2: { nama: "Tabungan Anak", persen: 40 },
    pos3: { nama: "Laba Bersih", persen: 40 }
};
let listAkunKasir = [];

let hasAlertedTgl = "";
let autoSaveTimeout = null; 
let vendorSaveTimeout = null;
let chartTren = null, chartTopBakso = null, chartTopReseller = null;

// ==========================================
// DETEKSI KONEKSI INTERNET
// ==========================================
window.addEventListener('offline', () => {
    const banner = document.getElementById('offlineBanner');
    banner.style.background = '#dc2626'; banner.innerText = '⚠️ Koneksi Terputus! Perubahan akan disimpan sementara di perangkat.'; banner.style.display = 'block';
    document.getElementById('statusSyncText').innerText = '🔴 OFFLINE'; document.getElementById('statusSyncText').style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
});
window.addEventListener('online', () => {
    const banner = document.getElementById('offlineBanner');
    banner.style.background = '#16a34a'; banner.innerText = '✅ Koneksi Terhubung Kembali! Sinkronisasi data...';
    document.getElementById('statusSyncText').innerText = '🟢 ONLINE'; document.getElementById('statusSyncText').style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    setTimeout(() => { banner.style.display = 'none'; }, 3000);
});

document.addEventListener('DOMContentLoaded', () => {
    if (db) muatDaftarCabangLogin(); 
    
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            let savedUser = localStorage.getItem('baksoUser');
            if (savedUser) { 
                currentUser = JSON.parse(savedUser); 
                bukaLayarAplikasi(); 
            } else {
                const noHp = user.email.split('@')[0];
                db.collection('users').doc(noHp).get().then(doc => {
                    if (doc.exists) {
                        currentUser = doc.data();
                        currentUser.email = user.email;
                    } else {
                        currentUser = { nama: "Kasir", role: "kasir", hp: noHp, email: user.email };
                    }
                    localStorage.setItem('baksoUser', JSON.stringify(currentUser));
                    bukaLayarAplikasi();
                }).catch(err => { console.error("Gagal menarik data user:", err); });
            }
        } else {
            document.getElementById('loginScreen').style.display = 'flex'; 
            document.getElementById('appScreen').style.display = 'none';
            localStorage.removeItem('baksoUser'); 
        }
    });
});

// Fungsi menyimpan pengaturan dari Form HTML
function simpanPengaturanFinansialCabang(e) {
    e.preventDefault();
    if (!db) return;

    // Menghilangkan titik ribuan sebelum disimpan
    const bersihkanAngka = (id) => parseFloat(document.getElementById(id).value.replace(/\./g, '')) || 0;

    const dataBaru = {
        gajiHarian: bersihkanAngka('cfgGajiHarian') || 50000,
        toleransiLibur: bersihkanAngka('cfgToleransiLibur') || 2,
        gajiBulanan: bersihkanAngka('cfgGajiBulanan') || 1500000,
        pos1: {
            nama: document.getElementById('cfgLabelPos1').value.trim() || "Dana Darurat",
            persen: parseFloat(document.getElementById('cfgPersenPos1').value) || 20
        },
        pos2: {
            nama: document.getElementById('cfgLabelPos2').value.trim() || "Tabungan Anak",
            persen: parseFloat(document.getElementById('cfgPersenPos2').value) || 40
        },
        pos3: {
            nama: document.getElementById('cfgLabelPos3').value.trim() || "Laba Bersih",
            persen: parseFloat(document.getElementById('cfgPersenPos3').value) || 40
        }
    };

    db.collection('cabang').doc(CABANG_AKTIF).collection('appData').doc('pengaturanFinansial').set(dataBaru)
    .then(() => {
        pengaturanCabangAktif = dataBaru;
        showToast('✅ Pengaturan Finansial Disimpan!');
        updateKalkulasi();
        if(document.getElementById('viewGajiBulanan').style.display === 'block') renderRekapGajiBulanan();
    });
}

function showToast(message) {
    const toast = document.getElementById('toastNotif');
    toast.innerHTML = message || '✅ Tersimpan!'; toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 2000);
}

// ==========================================
// FUNGSI AKUN & LOGIN
// ==========================================
function cekDanBuatAkunMaster() { console.log("Sistem akun kini diamankan oleh Firebase Auth."); }

function prosesLogin(e) { 
    e.preventDefault(); 
    const cabangDropdown = document.getElementById('inLoginCabang');
    const cabangPilihan = cabangDropdown.value;
    const cabangNamaText = cabangDropdown.options[cabangDropdown.selectedIndex].text;
    
    const noHp = document.getElementById('inLoginHp').value.trim(); 
    const pass = document.getElementById('inLoginPass').value; 
    const btn = document.getElementById('btnLoginBtn'); 

    if (!cabangPilihan) {
        alert("Silakan pilih cabang terlebih dahulu!");
        cabangDropdown.focus();
        return;
    }

    if(!firebase) return; 

    btn.innerText = "MEMERIKSA KUNCI..."; 
    btn.disabled = true; 

    const emailPalsu = noHp + "@bakso.com";

    firebase.auth().signInWithEmailAndPassword(emailPalsu, pass)
    .then((userCredential) => {
        return db.collection('users').doc(noHp).get();
    })
    .then(doc => {
        let dataAkun;
        if (doc.exists) {
            dataAkun = doc.data();
            
            // ===============================================
            // KODE BARU: PENGECEKAN CABANG TUGAS (Tembok Pengaman)
            // ===============================================
            const cabangTugasKaryawan = dataAkun.cabang_tugas || 'cipete_utara'; 
            
            if (dataAkun.role !== 'owner' && dataAkun.role !== 'dapur' && cabangTugasKaryawan !== cabangPilihan) {
                alert(`❌ AKSES DITOLAK!\n\n${dataAkun.nama}, Anda tidak diizinkan masuk ke ${cabangNamaText}.\nAnda hanya ditugaskan di cabang lainnya.`);
                firebase.auth().signOut(); 
                btn.innerText = "MASUK"; 
                btn.disabled = false;
                return; 
            }
            
            currentUser = dataAkun;
            currentUser.email = emailPalsu; 
        } else {
            currentUser = { nama: "Pengguna " + noHp, role: 'kasir', hp: noHp, email: emailPalsu, cabang_tugas: 'cipete_utara' };
        }
        
        // --- JIKA LOLOS PENGECEKAN, LANJUT MASUK APLIKASI ---
        localStorage.setItem('baksoUser', JSON.stringify(currentUser));
        localStorage.setItem('cabangAktif', cabangPilihan);
        localStorage.setItem('namaCabangAktif', cabangNamaText);
        
        CABANG_AKTIF = cabangPilihan;

        // 👉 KODE BARU DITAMBAHKAN DI SINI:

        const headerCabang = document.getElementById('headerNamaCabang');
        if (headerCabang) {
            headerCabang.innerText = cabangNamaText.replace('Cabang ', ''); 
        }

        if (typeof catatAktivitas === "function") {
            catatAktivitas('Akses Akun', `${currentUser.nama} login ke ${cabangNamaText}`);  
        }
        
        bukaLayarAplikasi(); 
        btn.innerText = "MASUK"; 
        btn.disabled = false; 
    })
    .catch(err => { 
        console.error("Error Login:", err);
        alert("Gagal Masuk! Pastikan Nomor HP dan Sandi Anda sudah betul."); 
        btn.innerText = "MASUK"; 
        btn.disabled = false; 
    }); 
}
function bukaLayarAplikasi() {        
    dbStok = {};
    dbPengeluaranHarian = [];
    dbKasMasuk = {};
    dbLogKas = [];
    dbSetoranDapur = {};
    dbGajiHarian = {};
    dbStatusKunci = {};
    masterProduk = [...defaultMasterProduk];

    document.getElementById('loginScreen').style.display = 'none'; 
    document.getElementById('appScreen').style.display = 'block';        
    
    document.getElementById('namaUserAktif').innerText = currentUser.nama;        
    const isOwner = currentUser.role === 'owner'; 
    const isDapur = currentUser.role === 'dapur';        
    document.getElementById('roleUserAktif').innerText = isOwner ? '👑 OWNER' : (isDapur ? '🔪 DAPUR' : '🧑‍🍳 KASIR');        

  // ===============================================
    // KODE BARU: LAMPU LALULINTAS & BANNER CABANG
    // ===============================================
    const savedNamaCabang = localStorage.getItem('namaCabangAktif') || 'Cabang Cipete Utara';
    
    // Sinkronisasi Banner Oranye
    const bannerLabel = document.getElementById('labelCabangBanner');
    if (bannerLabel) bannerLabel.innerText = savedNamaCabang.replace('Cabang ', '');

   // Sinkronisasi Header Lama (Teks di sebelah Logo)
    const headerLama = document.getElementById('headerNamaCabang');
    if (headerLama) headerLama.innerText = savedNamaCabang.replace('Cabang ', '');

    // KODE BARU: Sinkronisasi Semua Kop Surat PDF
    document.querySelectorAll('.teks-cabang-pdf').forEach(el => {
        el.innerText = savedNamaCabang;
    });

    const dropdownPindah = document.getElementById('dropdownPindahCabang');
  if ((isOwner || isDapur) && dropdownPindah) {
        dropdownPindah.style.display = 'block'; 
        if (db) {
            db.collection('daftarCabang').get().then(snap => {
                dropdownPindah.innerHTML = '<option value="">🔄 Pindah Cabang...</option>';
                snap.forEach(doc => {
                    const selected = (doc.id === CABANG_AKTIF) ? 'selected' : '';
                    dropdownPindah.innerHTML += `<option value="${doc.id}" ${selected}>${doc.data().nama}</option>`;
                });
            });
        }
    } else if (dropdownPindah) {
        dropdownPindah.style.display = 'none'; 
    }
    // ===============================================
    document.getElementById('menuSetoran').style.display = 'block';        
    document.getElementById('menuTransfer').style.display = isOwner ? 'block' : 'none';        
    document.getElementById('menuMutasi').style.display = isOwner ? 'block' : 'none';        
    document.getElementById('menuGaji').style.display = isOwner ? 'block' : 'none';      
    // KODE BARU: Memunculkan menu Dashboard Global khusus Owner
    const menuGlobal = document.getElementById('menuDashboardGlobal');
    if (menuGlobal) menuGlobal.style.display = isOwner ? 'block' : 'none';
    document.getElementById('menuDashboard').style.display = (isOwner || isDapur) ? 'block' : 'none';        
    document.getElementById('menuProduk').style.display = isOwner ? 'block' : 'none';        
    document.getElementById('menuPusatKontrol').style.display = isOwner ? 'block' : 'none';  
    document.getElementById('menuRiwayat').style.display = isOwner ? 'block' : 'none';
    document.getElementById('menuCetakBerkala').style.display = (isOwner || isDapur) ? 'block' : 'none';        
    document.getElementById('grupKeuanganTitle').style.display = isOwner ? 'block' : 'none';
    document.getElementById('grupPengaturanTitle').style.display = (isOwner || isDapur) ? 'block' : 'none';
    document.getElementById('menuOrderVendor').style.display = isDapur ? 'none' : 'block';
    document.getElementById('cardAbsensi').style.display = isDapur ? 'none' : 'block';
    document.getElementById('cardKasir').style.display = isDapur ? 'none' : 'block';
    document.getElementById('containerAkumulasiKategori').style.display = (isOwner || isDapur) ? 'grid' : 'none';        

    pilihMenuNav(isOwner || isDapur ? 'dashboard' : 'harian');

    const today = new Date(); 
    document.getElementById('tglOps').valueAsDate = today;        
    document.getElementById('cetakTglAwal').valueAsDate = today; 
    document.getElementById('cetakTglAkhir').valueAsDate = today;        
    document.getElementById('cetakBulan').value = today.toISOString().slice(0, 7);        
    document.getElementById('filterBulanGaji').value = today.toISOString().slice(0, 7);        

    try { 
        inisiatisasiRealtimeListener(); 
    } catch(e) { 
        loadDataTanggalLocal(); 
    }        
}

function prosesLogout() { 
    if(confirm("Anda yakin ingin keluar (Logout) dari aplikasi?")) { 
        if (currentUser) {
            catatAktivitas('Akses Akun', `${currentUser.nama} (${currentUser.role.toUpperCase()}) KELUAR (Logout) dari aplikasi`);
        }
        firebase.auth().signOut().then(() => {
            localStorage.removeItem('baksoUser'); 
            localStorage.removeItem('cabangAktif');
            localStorage.removeItem('namaCabangAktif');
            
            currentUser = null; 
            window.location.reload(); 
        }).catch((error) => {
            console.error("Logout Error:", error);
            alert("Gagal keluar dari sistem. Periksa koneksi internet Anda.");
        });
    } 
}

function bukaModalKelolaAkun() { if (currentUser.role !== 'owner') return; toggleSidebar(); document.getElementById('modalKelolaAkun').classList.add('active'); muatDaftarAkun(); }
function tutupModalKelolaAkun() { document.getElementById('modalKelolaAkun').classList.remove('active'); }

function muatDaftarAkun() { 
    if(!db) return; 
    
    // 1. Memuat daftar akun (Kode lama Anda)
    db.collection('users').get().then(snap => { 
        listAkunKasir = []; 
        const tbody = document.getElementById('tbodyDaftarAkun'); 
        if(!tbody) return;
        tbody.innerHTML = ''; 
        snap.forEach(doc => { 
            const data = doc.data(); 
            listAkunKasir.push(data); 
            const roleBadge = data.role === 'owner' ? '<span style="color:#d97706;font-weight:bold;">👑 Owner</span>' : (data.role === 'dapur' ? '<span style="color:#ef4444;font-weight:bold;">🔪 Dapur</span>' : '🧑‍🍳 Kasir'); 
            const aksiBtn = data.hp === currentUser.hp ? '<i>(Anda)</i>' : `<button onclick="hapusAkunUser('${data.hp}')" class="btn btn-danger" style="padding:4px; font-size:0.6rem; margin:0; width:auto;">Hapus</button>`; 
            tbody.innerHTML += `<tr><td><strong>${data.nama}</strong><br><small style="color:var(--text-muted);">Pass: ${data.password}</small></td><td>${data.hp}</td><td>${roleBadge}</td><td style="text-align:center;">${aksiBtn}</td></tr>`; 
        }); 
    }); 

    // 2. Memuat daftar cabang (KODE BARU YANG DISISIPKAN)
    if (typeof muatDaftarCabangKontrol === 'function') {
        muatDaftarCabangKontrol();
    }
}

// Fungsi baru untuk otomatis menyembunyikan pilihan cabang jika jabatannya Owner
function cekRoleAkunBaru() {
    const role = document.getElementById('inAkunRole').value;
    const bungkusCabang = document.getElementById('bungkusCabangTugas');
    const selectCabang = document.getElementById('inAkunCabangTugas');
    
    if (role === 'owner' || role === 'dapur') {
        bungkusCabang.style.display = 'none';
        selectCabang.removeAttribute('required');
    } else {
        bungkusCabang.style.display = 'block';
        selectCabang.setAttribute('required', 'true');
    }
}

// Fungsi Simpan Akun yang sudah di-update
function simpanAkunBaru(e) { 
    e.preventDefault(); 
    // PERBAIKAN: Menggunakan ID HTML yang sesuai (reg...)
    const nama = document.getElementById('regNama').value.trim(); 
    const hp = document.getElementById('regHp').value.trim(); 
    const password = document.getElementById('regPass').value.trim(); 
    const role = document.getElementById('regRole').value; 
    
    // PERBAIKAN: Mengambil nilai dari regCabangTugas dengan aman
    let cabangTugas = 'semua';
    if (role === 'kasir') {
        const elCabangTugas = document.getElementById('regCabangTugas');
        cabangTugas = elCabangTugas ? elCabangTugas.value : 'cipete_utara';
    }

    if(!db || !aplikasiPendaftaran) {
        alert("Koneksi ke sistem gagal. Pastikan internet stabil.");
        return; 
    }
    if(!hp || !password) {
        alert("Nomor HP dan Password wajib diisi!");
        return;
    }

    const emailPalsu = hp + "@bakso.com"; 
    
    let btnSimpan = e.target.querySelector('button[type="submit"]');
    if(btnSimpan) {
        btnSimpan.disabled = true;
        btnSimpan.innerText = "Menyimpan...";
    }

    aplikasiPendaftaran.auth().createUserWithEmailAndPassword(emailPalsu, password)
    .then((userCredential) => {
        return db.collection('users').doc(hp).set({ 
            nama: nama, 
            hp: hp, 
            role: role, 
            email: emailPalsu,
            cabang_tugas: cabangTugas
        });
    })
    .then(() => { 
        alert(`✅ Akun Karyawan Berhasil Dibuat!\n\nNama: ${nama}\nRole: ${role.toUpperCase()}\nPenugasan: ${cabangTugas === 'semua' ? 'Semua Cabang' : cabangTugas}`); 
        // PERBAIKAN: Mengosongkan form menggunakan ID HTML yang benar
        document.getElementById('regNama').value = ''; 
        document.getElementById('regHp').value = ''; 
        document.getElementById('regPass').value = ''; 
        if(typeof muatDaftarAkun === 'function') muatDaftarAkun(); 
        aplikasiPendaftaran.auth().signOut();
        if(btnSimpan) {
            btnSimpan.disabled = false;
            btnSimpan.innerText = "+ Simpan Akun";
        }
    })
    .catch(err => {
        if (err.code === 'auth/email-already-in-use') {
            alert("Gagal! Nomor HP ini sudah pernah didaftarkan.");
        } else {
            alert("Gagal menambahkan akun: " + err.message);
        }
        if(btnSimpan) {
            btnSimpan.disabled = false;
            btnSimpan.innerText = "+ Simpan Akun";
        }
    }); 
}

function hapusAkunUser(hp) { if(confirm(`PERINGATAN: Hapus akses untuk pengguna dengan No HP ${hp}?`)) { db.collection('users').doc(hp).delete().then(() => { muatDaftarAkun(); }); } }

// ==========================================
// FUNGSI FIREBASE REALTIME
// ==========================================
function inisiatisasiRealtimeListener() {
    if (!db) throw new Error("Database Cloud Belum Terhubung!");

    db.collection('cabang').doc(CABANG_AKTIF).collection('statusHarian').onSnapshot(snapshot => { 
        snapshot.forEach(doc => { dbStatusKunci[doc.id] = doc.data().terkunci; }); 
        const tgl = document.getElementById('tglOps').value;
        if(dbStok[tgl]) cekDanTarikDataKemarin(tgl); 
        applyLockUI(); 
    });

    db.collection('cabang').doc(CABANG_AKTIF).collection('appData').doc('masterProduk').onSnapshot(doc => {  
        if (doc.exists && doc.data().list) {  
            masterProduk = doc.data().list;  
        } else {  
            masterProduk = [...defaultMasterProduk];  
            db.collection('cabang').doc(CABANG_AKTIF).collection('appData').doc('masterProduk').set({ list: masterProduk });  
        }  
        
        // Cek apakah user sedang mengetik di input stok
        const activeEl = document.activeElement;
        const isTypingStok = activeEl && (activeEl.classList.contains('input-stok') || activeEl.tagName === 'INPUT');
        
        // Hanya muat ulang jika user TIDAK sedang mengetik
        if (!isTypingStok) {
            loadDataTanggalLocal();  
            renderTabelMasterProduk();  
        }
    });
    db.collection('cabang').doc(CABANG_AKTIF).collection('appData').doc('daftarKategori').onSnapshot(doc => { 
        if (doc.exists) daftarKategori = doc.data().list; 
        else db.collection('cabang').doc(CABANG_AKTIF).collection('appData').doc('daftarKategori').set({ list: defaultKategori }); 
    });

    db.collection('cabang').doc(CABANG_AKTIF).collection('appData').doc('vendorCatalog').onSnapshot(doc => { 
        if (doc.exists && doc.data().list) { vendorCatalog = doc.data().list; } 
        else { db.collection('cabang').doc(CABANG_AKTIF).collection('appData').doc('vendorCatalog').set({ list: defaultVendorCatalog }); vendorCatalog = defaultVendorCatalog; } 
        renderFormOrderVendor(); 
    });

    db.collection('cabang').doc(CABANG_AKTIF).collection('stokHarian').onSnapshot(snapshot => { 
        snapshot.forEach(doc => { dbStok[doc.id] = doc.data().items; }); 
        const tgl = document.getElementById('tglOps').value; 
        if (!document.activeElement || !document.activeElement.classList.contains('input-stok')) { 
            if(!dbStok[tgl]) syncStokDenganMaster(tgl);
            cekDanTarikDataKemarin(tgl);
            renderTabelMatriks(); 
            updateKalkulasi(); 
        } 
    });

    db.collection('cabang').doc(CABANG_AKTIF).collection('kasMasuk').onSnapshot(snapshot => { 
        snapshot.forEach(doc => { dbKasMasuk[doc.id] = doc.data(); }); 
        const tgl = document.getElementById('tglOps').value;
        cekDanTarikDataKemarin(tgl); loadKasMasukUI(); updateKalkulasi(); 
    });

    db.collection('cabang').doc(CABANG_AKTIF).collection('pengeluaranHarian').onSnapshot(snapshot => { 
        dbPengeluaranHarian = []; 
        snapshot.forEach(doc => { dbPengeluaranHarian.push({ id: doc.id, ...doc.data() }); }); 
        renderPengeluaranTables(); updateKalkulasi(); 
    });

    db.collection('cabang').doc(CABANG_AKTIF).collection('gajiHarian').onSnapshot(snapshot => { 
        snapshot.forEach(doc => { dbGajiHarian[doc.id] = doc.data(); }); 
        loadGajiUI(); updateKalkulasi(); 
        if(document.getElementById('viewGajiBulanan').style.display === 'block') renderRekapGajiBulanan(); 
    });

    db.collection('cabang').doc(CABANG_AKTIF).collection('logKas').onSnapshot(snapshot => { 
        dbLogKas = []; 
        snapshot.forEach(doc => { dbLogKas.push({ id: doc.id, ...doc.data() }); }); 
        hitungAkumulasiKasTotal(); 
    });

    db.collection('cabang').doc(CABANG_AKTIF).collection('setoranDapur').onSnapshot(snapshot => { 
        snapshot.forEach(doc => { dbSetoranDapur[doc.id] = doc.data(); }); 
        loadSetoranDapurUI(); renderViewSetoranBakso(); updateKalkulasi(); 
    });
    // Listener untuk memuat data riwayat pergerakan stok secara real-time
    db.collection('cabang').doc(CABANG_AKTIF).collection('appData').doc('riwayatStok').onSnapshot(doc => {
        if (doc.exists && doc.data().list) {
            riwayatStok = doc.data().list;
            renderTabelRiwayatStok();
        } else {
            riwayatStok = [];
            renderTabelRiwayatStok();
        }
    });
    db.collection('cabang').doc(CABANG_AKTIF).collection('appData').doc('pengaturanFinansial').onSnapshot(doc => {
        if (doc.exists) {
            pengaturanCabangAktif = doc.data();
            
            // Perbarui form di layar jika ada
            const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
          if(document.getElementById('cfgGajiHarian')) {
            setVal('cfgGajiHarian', (pengaturanCabangAktif.gajiHarian || 50000).toLocaleString('id-ID'));
            setVal('cfgToleransiLibur', pengaturanCabangAktif.toleransiLibur || 2);
            setVal('cfgGajiBulanan', (pengaturanCabangAktif.gajiBulanan || 1500000).toLocaleString('id-ID'));
              
                if (pengaturanCabangAktif.pos1) { setVal('cfgLabelPos1', pengaturanCabangAktif.pos1.nama); setVal('cfgPersenPos1', pengaturanCabangAktif.pos1.persen); }
                if (pengaturanCabangAktif.pos2) { setVal('cfgLabelPos2', pengaturanCabangAktif.pos2.nama); setVal('cfgPersenPos2', pengaturanCabangAktif.pos2.persen); }
                if (pengaturanCabangAktif.pos3) { setVal('cfgLabelPos3', pengaturanCabangAktif.pos3.nama); setVal('cfgPersenPos3', pengaturanCabangAktif.pos3.persen); }
            }
            
            updateKalkulasi();
            if(document.getElementById('viewGajiBulanan').style.display === 'block') renderRekapGajiBulanan();
        }
    });
}

// ==========================================
// FUNGSI NAVIGASI
// ==========================================
function toggleSidebar() { 
    document.getElementById('sidebar').classList.toggle('active'); 
    document.getElementById('overlay').classList.toggle('active'); 
}

function pilihMenuNav(jenis) {    
    if (typeof toggleSidebar === 'function') toggleSidebar();    

    const isOwner = currentUser && currentUser.role === 'owner';
    const isDapur = currentUser && currentUser.role === 'dapur';

    document.getElementById('viewHarian').style.display = 'none';    
    document.getElementById('viewSetoranBakso').style.display = 'none';    
    document.getElementById('viewRekapTransfer').style.display = 'none';    
    document.getElementById('viewMutasiKas').style.display = 'none';    
    document.getElementById('viewGajiBulanan').style.display = 'none';
    document.getElementById('viewDashboard').style.display = 'none';    
    document.getElementById('viewOrderVendor').style.display = 'none';    
    document.getElementById('viewRiwayatAktivitas').style.display = 'none';
    document.getElementById('layar-produk').style.display = 'none';
    document.getElementById('viewLaporanBerkala').style.display = 'none';    
    
    const viewPusat = document.getElementById('viewPusatKontrol');
    if (viewPusat) viewPusat.style.display = 'none';

    const viewGlobal = document.getElementById('viewDashboardGlobal');
    if (viewGlobal) viewGlobal.style.display = 'none';

    if (document.getElementById('cardAlokasiHarian')) {
        document.getElementById('cardAlokasiHarian').style.display = 'none';
    }

    if (jenis === 'harian') {    
        document.getElementById('viewHarian').style.display = 'block';    
        if (document.getElementById('cardAlokasiHarian')) document.getElementById('cardAlokasiHarian').style.display = isOwner ? 'block' : 'none';
        cekPeringatanStok();
    } else if (jenis === 'setoranBakso') {    
        document.getElementById('viewSetoranBakso').style.display = 'block';   
        if (document.getElementById('cardSetoranDapur')) document.getElementById('cardSetoranDapur').style.display = 'block';
        renderViewSetoranBakso();    
    } else if (jenis === 'rekapTransfer') {    
        document.getElementById('viewRekapTransfer').style.display = 'block';    
        renderViewRekapTransfer();    
    } else if (jenis === 'mutasiKas') {    
        document.getElementById('viewMutasiKas').style.display = 'block';    
        hitungAkumulasiKasTotal();    
    } else if (jenis === 'gajiBulanan') {
        document.getElementById('viewGajiBulanan').style.display = 'block';
        renderRekapGajiBulanan();
    } else if (jenis === 'dashboard') {
        document.getElementById('viewDashboard').style.display = 'block';
        renderDashboardGrafik();
    } else if (jenis === 'dashboardGlobal') {
        if (viewGlobal) viewGlobal.style.display = 'block';
        if (typeof renderDashboardGlobal === 'function') renderDashboardGlobal();
    } else if (jenis === 'orderVendor') {
        document.getElementById('viewOrderVendor').style.display = 'block';
        if (typeof renderFormOrderVendor === 'function') renderFormOrderVendor();
        else if (typeof renderOrderVendor === 'function') renderOrderVendor();
        cekPeringatanStok(); 
    } else if (jenis === 'riwayatAktivitas') {
        document.getElementById('viewRiwayatAktivitas').style.display = 'block';
        muatDataRiwayat();
    } else if (jenis === 'produk') {
        document.getElementById('layar-produk').style.display = 'block';
        if (typeof renderTabelMasterProduk === 'function') renderTabelMasterProduk();
        else if (typeof renderMasterProduk === 'function') renderMasterProduk();
    } else if (jenis === 'laporanBerkala') {
        document.getElementById('viewLaporanBerkala').style.display = 'block';
    } else if (jenis === 'pusatKontrol') {
        if (viewPusat) viewPusat.style.display = 'block';
        if (typeof muatDaftarAkun === 'function') muatDaftarAkun();
        if (typeof renderDaftarCabang === 'function') renderDaftarCabang();
        if (typeof renderDaftarAkun === 'function') renderDaftarAkun();
    }
}


// ==========================================
// FUNGSI FORM ORDER VENDOR
// ==========================================
function renderFormOrderVendor() {
    if (document.activeElement && document.activeElement.tagName === 'INPUT') return; 

    vendorCatalog.sort((a, b) => (a.nama || "").localeCompare(b.nama || ""));

    const tbody = document.getElementById('tbodyOrderVendor');
    if(!tbody) return;
    tbody.innerHTML = '';
    let grandTotal = 0;

    vendorCatalog.forEach((item, index) => {
        const qty = item.qty !== "" ? parseInt(item.qty) : 0;
        const harga = parseInt(item.harga) || 0;
        const total = qty * harga;
        grandTotal += total;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="text-align:center; color:#94a3b8;">${index + 1}</td>
            <td><strong style="font-size:0.85rem;">${item.nama}</strong></td>
            <td>${item.kemasan}</td>
            <td>${item.vol}</td>
            <td style="text-align:center;">${item.isi}</td>
            <td>${item.rasa || '-'}</td>
            <td style="background:#eff6ff;"><input type="number" class="input-stok input-vendor" value="${item.qty}" min="0" placeholder="0" style="width:60px;" oninput="updateItemVendor(${index}, 'qty', this.value)"></td>
            <td style="background:#fefce8;"><input type="text" class="input-stok input-pagi" value="${item.harga ? parseInt(item.harga, 10).toLocaleString('id-ID') : ''}" style="width:80px; text-align:right;" oninput="formatRibuanInput(this); updateItemVendor(${index}, 'harga', this.value.replace(/\./g, ''))"></td>
            <td id="vendor-total-${index}" style="text-align:right; font-weight:800; color:#15803d; background:#f0fdf4;">${formatRupiah(total)}</td>
            <td style="text-align:center;"><button onclick="hapusItemVendor(${index})" class="btn btn-danger" style="padding:4px 8px; font-size:0.6rem; width:auto; margin:0; border-radius:6px;">Hapus</button></td>
        `;
        tbody.appendChild(tr);
    });
    const gtEl = document.getElementById('vendorGrandTotal');
    if(gtEl) gtEl.innerText = formatRupiah(grandTotal);
}

function updateItemVendor(index, field, value) {
    vendorCatalog[index][field] = value;
    const qty = parseInt(vendorCatalog[index].qty) || 0;
    const harga = parseInt(vendorCatalog[index].harga) || 0;
    const totalBaris = qty * harga;

    const tdTotal = document.getElementById(`vendor-total-${index}`);
    if (tdTotal) tdTotal.innerText = formatRupiah(totalBaris);

    let grandTotal = 0;
    vendorCatalog.forEach(item => {
        const q = parseInt(item.qty) || 0;
        const h = parseInt(item.harga) || 0;
        grandTotal += (q * h);
    });
    const gtEl = document.getElementById('vendorGrandTotal');
    if(gtEl) gtEl.innerText = formatRupiah(grandTotal);

    clearTimeout(vendorSaveTimeout);
    vendorSaveTimeout = setTimeout(() => {
        if(db) db.collection('cabang').doc(CABANG_AKTIF).collection('appData').doc('vendorCatalog').set({ list: vendorCatalog }).then(() => showToast('✅ Perubahan Order Tersimpan!'));
    }, 1000);
}

function bukaModalTambahVendor() {
    document.getElementById('inVendorNama').value = ''; document.getElementById('inVendorKemasan').value = ''; document.getElementById('inVendorVol').value = '';
    document.getElementById('inVendorIsi').value = ''; document.getElementById('inVendorRasa').value = ''; document.getElementById('inVendorHarga').value = '';
    document.getElementById('modalTambahVendor').classList.add('active');
}

function tutupModalTambahVendor() { document.getElementById('modalTambahVendor').classList.remove('active'); }

function simpanProdukVendorBaru(e) {
    e.preventDefault();
    const newItem = {
        nama: document.getElementById('inVendorNama').value.trim(),
        kemasan: document.getElementById('inVendorKemasan').value.trim(),
        vol: document.getElementById('inVendorVol').value.trim(),
        isi: document.getElementById('inVendorIsi').value,
        rasa: document.getElementById('inVendorRasa').value.trim(),
        harga: parseInt(document.getElementById('inVendorHarga').value) || 0,
        qty: ""
    };
    vendorCatalog.push(newItem);
    if(db) {
        db.collection('cabang').doc(CABANG_AKTIF).collection('appData').doc('vendorCatalog').set({ list: vendorCatalog }).then(() => { tutupModalTambahVendor(); showToast('✅ Produk Baru Ditambahkan!'); });
    } else {
        tutupModalTambahVendor(); renderFormOrderVendor();
    }
}

function hapusItemVendor(index) {
    if(confirm(`Hapus ${vendorCatalog[index].nama} dari daftar pemesanan vendor?`)) {
        vendorCatalog.splice(index, 1);
        if(db) db.collection('cabang').doc(CABANG_AKTIF).collection('appData').doc('vendorCatalog').set({ list: vendorCatalog });
        renderFormOrderVendor();
    }
}

function kirimWhatsAppOrder() {
    let orderItems = vendorCatalog.filter(item => parseInt(item.qty) > 0);
    if (orderItems.length === 0) { alert("Belum ada qty pesanan yang diisi!"); return; }

    const tglOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const tglKirim = new Date().toLocaleDateString('id-ID', tglOptions);
    const tglFile = new Date().toISOString().split('T')[0];

    // Pengaman elemen Tgl Vendor
    const elTgl = document.getElementById('pdfVendorTgl');
    if (elTgl) elTgl.innerText = 'Tanggal Pesanan: ' + tglKirim;

    const tbody = document.getElementById('pdfTbodyVendor');
    if (tbody) {
        tbody.innerHTML = '';
        let grandTotal = 0;

        orderItems.forEach((item, index) => {
            const qty = parseInt(item.qty); 
            const harga = parseInt(item.harga); 
            const total = qty * harga; 
            grandTotal += total;
            const rasaTxt = item.rasa ? ` - ${item.rasa}` : '';
            const namaLengkap = `${item.nama} (${item.vol}${rasaTxt})`;
            tbody.innerHTML += `<tr><td style="text-align: center;">${index + 1}</td><td><strong>${namaLengkap}</strong></td><td style="text-align: center;">${item.kemasan}</td><td style="text-align: center; font-weight: bold; color: #15803d; font-size: 13px;">${qty}</td><td style="text-align: right;">${formatRupiah(harga)}</td><td style="text-align: right; font-weight: bold; color: #d97706;">${formatRupiah(total)}</td></tr>`;
        });

        const elTotal = document.getElementById('pdfVendorTotal');
        if (elTotal) elTotal.innerText = formatRupiah(grandTotal);
    }

    let inputPemesan = document.getElementById('inputNamaPemesanVendor');
    let namaPemesan = inputPemesan ? inputPemesan.value : "";
    if (!namaPemesan || namaPemesan.trim() === "") {
        namaPemesan = (typeof currentUser !== 'undefined' && currentUser && currentUser.role) ? currentUser.role : "Admin";
        if (inputPemesan) inputPemesan.value = namaPemesan;
    }

    const elPemesanCetak = document.getElementById('pdfNamaPemesanCetak');
    if (elPemesanCetak) elPemesanCetak.innerText = namaPemesan;

    const hariIni = new Date();
    const formatTanggal = hariIni.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const elTglCetak = document.getElementById('pdfTanggalCetakVendor');
    if (elTglCetak) elTglCetak.innerText = formatTanggal;

    const element = document.getElementById('pdfAreaVendor');
    if (!element) {
        alert("Area cetak PDF tidak ditemukan di halaman ini!");
        return;
    }
    element.style.display = 'block';

    html2pdf().set({
        margin: [8, 8, 8, 8], 
        filename: `PO_Vendor_${tglFile}.pdf`, 
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2, 
            useCORS: true,
            letterRendering: true,
            scrollY: 0
        }, 
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
        }, 
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] } 
    }).from(element).output('blob').then(function(pdfBlob) {
        element.style.display = 'none'; 
        // Lanjutkan sisa proses share / download...
        const namaFile = `PO_Vendor_${tglFile}.pdf`;
        const filePdf = new File([pdfBlob], namaFile, { type: 'application/pdf' });
        const resetForm = () => { 
            vendorCatalog.forEach(item => item.qty = ""); 
            if(typeof db !== 'undefined' && db && typeof CABANG_AKTIF !== 'undefined') {
                db.collection('cabang').doc(CABANG_AKTIF).collection('appData').doc('vendorCatalog').set({ list: vendorCatalog }); 
            }
            if(typeof renderFormOrderVendor === 'function') renderFormOrderVendor(); 
        };

        // Cek kemampuan perangkat untuk langsung membagikan file PDF (Share Sheet)
        if (navigator.canShare && navigator.canShare({ files: [filePdf] })) {
            navigator.share({ 
                files: [filePdf], 
                title: 'Purchase Order (PO)', 
                text: `Berikut terlampir dokumen Purchase Order (PO) tanggal ${tglKirim}. Mohon diproses.`
            }).then(() => { 
                resetForm(); 
            }).catch((error) => { 
                console.error('Batal bagikan:', error); 
                if(confirm("Batal membagikan. Tetap ingin mereset/mengosongkan form pemesanan?")) resetForm(); 
            });
        } else {
            // Fallback untuk perangkat/browser yang tidak mendukung direct file sharing
            const urlObj = URL.createObjectURL(pdfBlob);
            const link = document.createElement('a'); 
            link.href = urlObj; 
            link.download = namaFile; 
            link.click(); 
            URL.revokeObjectURL(urlObj);
            if(confirm("File PO PDF telah didownload. Reset/kosongkan form pesanan sekarang?")) resetForm();
        }
    });
}

// ==========================================
// FUNGSI INTI STOK & KALKULASI
// ==========================================
function cekDanTarikDataKemarin(tgl) {
    if (isDataLocked(tgl)) return;
    let dateObj = new Date(tgl); dateObj.setDate(dateObj.getDate() - 1);
    let y = dateObj.getFullYear(); let m = String(dateObj.getMonth() + 1).padStart(2, '0'); let d = String(dateObj.getDate()).padStart(2, '0');
    let tglKemarin = `${y}-${m}-${d}`;
    let isKemarinLocked = dbStatusKunci[tglKemarin] === true;
    let needsUpdateUI = false;

    if (dbStok[tgl]) {
        let isNeedsPullStok = dbStok[tgl].some(p => p.awal === "" || p.awal === null);
        if (isNeedsPullStok && dbStok[tglKemarin] && dbStok[tglKemarin].length > 0) {
            if (isKemarinLocked) {
                dbStok[tgl].forEach((p, idx) => {
                    if (p.awal === "" || p.awal === null) {
                        let pKemarin = dbStok[tglKemarin].find(x => x.nama === p.nama);
                        if (pKemarin) {
                            if (p.kategori === 'Reseller' && pKemarin.sisa !== "" && pKemarin.sisa !== null) { dbStok[tgl][idx].awal = pKemarin.sisa; needsUpdateUI = true; } 
                            else if (p.kategori === 'Bakso Malang' && pKemarin.awal !== "" && pKemarin.awal !== null) { dbStok[tgl][idx].awal = pKemarin.awal; needsUpdateUI = true; }
                        }
                    }
                });
            } else {
                if (hasAlertedTgl !== tgl) { 
                    alert(`⚠️ PERINGATAN: Data tanggal ${tglKemarin} BELUM DIGEMBOK!\n\nSistem tidak bisa menarik otomatis stok sisa & modal laci ke hari ini.\nSilakan mundur ke tanggal ${tglKemarin}, pastikan datanya sudah benar, lalu klik '🔓 BUKA' agar menjadi '🔒 TERKUNCI'.`);
                    hasAlertedTgl = tgl;
                }
            }
        }
    }
    if (isKemarinLocked && dbKasMasuk[tglKemarin]) {
        let kasHariIni = dbKasMasuk[tgl] || { cash: 0, qris: 0, gojek: 0, grab: 0, shopee: 0, petty: 0, modalBesok: 0 };
        let pettyKemarin = dbKasMasuk[tglKemarin].modalBesok || 0;
        if (kasHariIni.petty !== pettyKemarin) { kasHariIni.petty = pettyKemarin; dbKasMasuk[tgl] = kasHariIni; if (db) { db.collection('cabang').doc(CABANG_AKTIF).collection('kasMasuk').doc(tgl).set(kasHariIni); } needsUpdateUI = true; }
    }
    if (needsUpdateUI && document.activeElement && document.activeElement.tagName !== 'INPUT') { renderTabelMatriks(); loadKasMasukUI(); updateKalkulasi(); }
}

function syncStokDenganMaster(tgl) { 
    if (!dbStok[tgl]) { 
        dbStok[tgl] = masterProduk.map(p => ({ ...p, awal: "", tambah: "", kurang: "", sisa: "" })); 
    } else { 
        let currentStok = dbStok[tgl]; 
        let newStokList = []; 
        masterProduk.forEach(mp => { 
            let found = currentStok.find(item => item.nama === mp.nama); 
            if (found) { 
                newStokList.push({ 
                    ...mp, 
                    awal: found.awal !== undefined ? found.awal : "", 
                    tambah: found.tambah !== undefined ? found.tambah : "", 
                    kurang: found.kurang !== undefined ? found.kurang : "", 
                    sisa: found.sisa !== undefined ? found.sisa : "" 
                }); 
            } else { 
                newStokList.push({ ...mp, awal: "", tambah: "", kurang: "", sisa: "" }); 
            } 
        }); 
        dbStok[tgl] = newStokList; 
    } 
}

function simpanStokKeFirebase() { 
    const tgl = document.getElementById('tglOps').value; 
    if(isDataLocked(tgl)) return; 
    if(!db) return; 

    let elemenProfit = document.getElementById('totalProfitBersih').innerText;
    let profitAngka = Number(elemenProfit.replace(/[^0-9,-]+/g,""));
    let profitSiapBagi = Math.max(0, profitAngka);

    db.collection('cabang').doc(CABANG_AKTIF).collection('stokHarian').doc(tgl).set({ 
        items: dbStok[tgl],
        profitBersih: profitSiapBagi,
        danaDarurat: profitSiapBagi * 0.20,
        tabunganAnak: profitSiapBagi * 0.40,
        labaBersih: profitSiapBagi * 0.40
    }, { merge: true }).then(() => { 
        showToast('✅ Stok dan Rekap Profit Tersimpan!'); 
    }); 
}
function updateNilaiStokLokal(idx, tipe, val) {  
    const activeElementId = document.activeElement ? document.activeElement.id : null;
    const tgl = document.getElementById('tglOps').value;  
    if (!dbStok[tgl]) syncStokDenganMaster(tgl);  
    
    const p = dbStok[tgl][idx];
    if (!p) return;

   if (tipe === 'tambah') {
        const valBaru = parseFloat(val) || 0;
        const valLama = parseFloat(p.tambah) || 0;
        const selisih = valBaru - valLama;  
        
        if (selisih !== 0) {
            const masterIdx = masterProduk.findIndex(mp => mp.nama === p.nama);
            if (masterIdx !== -1) {
                // Ambil data lama, jika belum ada set jadi 0
                let keluarSekarang = parseFloat(masterProduk[masterIdx].keluarEtalase) || 0;
                let awalGudang = parseFloat(masterProduk[masterIdx].stokAwalGudang) || 0;
                
                // Tambahkan yang keluar ke etalase
                let keluarBaru = keluarSekarang + selisih;
                if (keluarBaru < 0) keluarBaru = 0; // Cegah minus
                
                let sisaGudangBaru = awalGudang - keluarBaru - (parseFloat(masterProduk[masterIdx].stokRusak) || 0);
                let jenisAksi = selisih > 0 ? 'Out' : 'In';

                // PERBAIKAN UTAMA: Yang diupdate adalah keluarEtalase! AwalGudang tetap utuh.
                masterProduk[masterIdx].keluarEtalase = keluarBaru;
                
                if(db) db.collection('cabang').doc(typeof CABANG_AKTIF !== 'undefined' ? CABANG_AKTIF : 'cipeteutara').collection('appData').doc('masterProduk').set({ list: masterProduk });
                
                if(typeof catatRiwayatStok === 'function') {
                    catatRiwayatStok(p.nama, jenisAksi, Math.abs(selisih), sisaGudangBaru);
                }
            }
        }
        dbStok[tgl][idx].tambah = val;  
    }
    else {
        if (tipe === 'awal') dbStok[tgl][idx].awal = val;  
        if (tipe === 'kurang') dbStok[tgl][idx].kurang = val;  
        if (tipe === 'sisa') dbStok[tgl][idx].sisa = val;  
    }

    const awal = parseFloat(p.awal) || 0;  
    const tambah = parseFloat(p.tambah) || 0;  
    const kurang = parseFloat(p.kurang) || 0;  
    const totalStok = awal + tambah - kurang;  
    const sisa = (p.sisa !== "" && p.sisa !== null) ? parseFloat(p.sisa) : null;  
    let terjual = (sisa !== null && sisa <= totalStok) ? (totalStok - sisa) : 0;  

    const elTotal = document.getElementById('td_total_' + idx);  
    if(elTotal) elTotal.innerText = totalStok;  
    const elTerjual = document.getElementById('td_terjual_' + idx);  
    if(elTerjual) elTerjual.innerText = (sisa !== null) ? terjual : '-';  
    const elTambah = document.getElementById('tambah_' + idx);
    if(elTambah && document.activeElement !== elTambah) {
        elTambah.value = tambah > 0 ? tambah : '';
    }

    if(typeof updateKalkulasi === 'function') updateKalkulasi();  
    
    if(typeof autoSaveTimeout !== 'undefined') clearTimeout(autoSaveTimeout); 
    autoSaveTimeout = setTimeout(() => {  
        if(typeof simpanStokKeFirebase === 'function') simpanStokKeFirebase();  
    }, 1500);  

    if (activeElementId) {
        requestAnimationFrame(() => {
            const elToFocus = document.getElementById(activeElementId);
            if (elToFocus && document.activeElement !== elToFocus) elToFocus.focus();
        });
    }
}
// Fungsi untuk menambah/mengurangi nilai di kolom Tambah harian secara cepat
function ubahStokHarianCepat(idx, tipe, nominalUbah) {
    const tgl = document.getElementById('tglOps').value;
    if (typeof isDataLocked === 'function' && isDataLocked(tgl)) {
        alert("Data hari ini terkunci!");
        return;
    }
    
    if (!dbStok[tgl]) syncStokDenganMaster(tgl);
    const p = dbStok[tgl][idx];
    
    let nilaiLama = parseFloat(p.tambah) || 0;
    let nilaiBaru = Math.max(0, nilaiLama + nominalUbah);
    
    // PERBAIKAN: Set value langsung ke HTML sebelum masuk ke fungsi pengurang gudang
    const inputEl = document.getElementById(`tambah_${idx}`);
    if (inputEl) {
        inputEl.value = nilaiBaru === 0 ? '' : nilaiBaru;
    }
    
    // Panggil fungsi utama
    updateNilaiStokLokal(idx, tipe, nilaiBaru === 0 ? '' : nilaiBaru);
}

function loadDataTanggalLocal() { 
    const tgl = document.getElementById('tglOps').value; syncStokDenganMaster(tgl); cekDanTarikDataKemarin(tgl); 
    renderTabelMatriks(); loadKasMasukUI(); loadSetoranDapurUI(); loadGajiUI(); renderPengeluaranTables(); updateKalkulasi(); renderViewSetoranBakso(); applyLockUI(); 
}

function isDataLocked(tgl) { return dbStatusKunci[tgl] === true; }

function toggleLock() { 
    const tgl = document.getElementById('tglOps').value; 
    const currentlyLocked = isDataLocked(tgl); 
    
    if (currentlyLocked) { 
        if(confirm("Buka gembok data hari ini?")) { 
            setLockStatus(tgl, false); 
        } 
    } else { 
        if(confirm("Kunci data hari ini?")) { 
            // ==========================================
            // PERBAIKAN BUG GAJI HILANG SAAT DIGEMBOK
            // Paksa simpan semua form (Absensi, Kas, Dapur) sebelum dikunci
            // agar nominal default yang tidak diklik tetap masuk ke database.
            // ==========================================
            if (typeof simpanAbsensi === 'function') simpanAbsensi();
            if (typeof simpanKasMasuk === 'function') simpanKasMasuk(false);
            if (typeof simpanSetoranDapurManual === 'function') simpanSetoranDapurManual();
            if (typeof simpanStokKeFirebase === 'function') simpanStokKeFirebase();
            
            // Setelah semua tersimpan, baru gembok ditutup
            setLockStatus(tgl, true); 
        } 
    } 
}
function setLockStatus(tgl, status) { 
    if(db) { 
        db.collection('cabang').doc(CABANG_AKTIF).collection('statusHarian').doc(tgl).set({ terkunci: status }).then(() => {
            const statusStr = status ? "MENKUNCI (LOCK)" : "MEMBUKA (UNLOCK)";
            catatAktivitas('Keamanan Data', `${statusStr} data operasional untuk tanggal ${tgl}`);
        }); 
    } else { 
        dbStatusKunci[tgl] = status; applyLockUI(); 
    } 
}

function applyLockUI() { 
    const tgl = document.getElementById('tglOps').value; const locked = isDataLocked(tgl); const btnToggle = document.getElementById('btnToggleLock'); 
    if(btnToggle) {
        if(locked) { btnToggle.className = 'btn-lock locked'; btnToggle.innerHTML = '🔒 TERKUNCI'; } else { btnToggle.className = 'btn-lock unlock'; btnToggle.innerHTML = '🔓 TERBUKA'; } 
    }
    const isDapur = currentUser && currentUser.role === 'dapur';
    const idsToDisable = ['inCash', 'inQris', 'inGojek', 'inGrab', 'inShopee', 'inPettycash', 'inModalBesok', 'btnSimpanModalBesok', 'ketKeluarHarian', 'nominalKeluarHarian', 'btnSubmitPengeluaran', 'inAbsenUtama', 'inAbsenTambahan', 'inBmCash', 'inBmKetPengeluaran', 'inBmPengeluaran', 'inTehTerjual']; 
    idsToDisable.forEach(id => { 
        const el = document.getElementById(id); 
        if(el) { 
            if (isDapur && (id.includes('inBm') || id.includes('btnSimpan') || id.includes('inAbsen'))) { 
                el.disabled = true; 
            } else { 
                el.disabled = locked; 
            } 
        } 
    }); 

    if (document.activeElement && document.activeElement.tagName !== 'INPUT') { 
        renderTabelMatriks(); 
        renderPengeluaranTables(); 
    }
}

function simpanAbsensi() { 
    const tgl = document.getElementById('tglOps').value; 
    if(isDataLocked(tgl)) return; 
    
    const utama = document.getElementById('inAbsenUtama').value === 'ya'; 
    const tambahan = parseInt(document.getElementById('inAbsenTambahan').value) || 0; 
    
    // Tarik nominal dinamis dari pengaturan cabang (default 50000 jika kosong)
    const nominalGaji = pengaturanCabangAktif.gajiHarian || 50000;
    const nominal = (utama ? nominalGaji : 0) + (tambahan * nominalGaji); 
    
    const data = { utama, tambahan, nominal }; 
    
    if(db) { 
        db.collection('cabang').doc(CABANG_AKTIF).collection('gajiHarian').doc(tgl).set(data).then(() => { 
            showToast('✅ Absensi & Gaji Tersimpan!'); 
        }); 
    } else { 
        dbGajiHarian[tgl] = data; updateKalkulasi(); loadGajiUI(); 
    } 
}
function loadGajiUI() { 
    const tgl = document.getElementById('tglOps').value; 
    const d = dbGajiHarian[tgl] || { utama: true, tambahan: 0, nominal: 0 }; 
    const locked = isDataLocked(tgl); 
    const nominalGaji = pengaturanCabangAktif.gajiHarian || 50000; 

    // Jika belum digembok, paksa hitung pakai setting terbaru
    let hitungNominal = d.nominal; 
    if (!locked) { 
        hitungNominal = (d.utama ? nominalGaji : 0) + ((parseInt(d.tambahan) || 0) * nominalGaji); 
    } 

    const elUtama = document.getElementById('inAbsenUtama'); 
    const elTambahan = document.getElementById('inAbsenTambahan'); 
    const elTotal = document.getElementById('txtTotalGajiHarian'); 

    if(elUtama) elUtama.value = d.utama ? 'ya' : 'tidak'; 
    if(elTambahan) elTambahan.value = d.tambahan || 0; 
    if(elTotal) elTotal.innerText = formatRupiah(hitungNominal); 
}

function renderTabelMatriks() {
    const tgl = document.getElementById('tglOps').value; 
    const locked = isDataLocked(tgl); 

    const thead = document.getElementById('theadMatriks');
    if(thead) thead.innerHTML = `<tr><th>No</th><th style="text-align:left;">Produk & Kategori</th><th style="background:#fef9c3; color:#854d0e;">☀️ Awal</th><th style="background:#dcfce7; color:#166534;">➕ Tambah</th><th style="background:#fee2e2; color:#991b1b;">➖ Kurang</th><th style="background:#f1f5f9; color:#0f172a;">📦 Total</th><th style="background:#e2e8f0; color:#334155;">🌙 Sisa</th><th>Terjual</th><th>Aksi</th></tr>`;

    const tbody = document.getElementById('tbodyMatriks'); 
    if(!tbody) return;
    tbody.innerHTML = '';
    let counter = 1;

    (dbStok[tgl] || []).forEach((p, idx) => {
        if (currentUser && currentUser.role === 'dapur' && p.kategori !== 'Bakso Malang') return;
        if (p.nama.toLowerCase() === 'teh manis') return; 

        const awal = (p.awal !== "" && p.awal !== null) ? parseFloat(p.awal) : 0; 
        const tambah = (p.tambah !== "" && p.tambah !== null && p.tambah !== undefined) ? parseFloat(p.tambah) : 0; 
        const kurang = (p.kurang !== "" && p.kurang !== null && p.kurang !== undefined) ? parseFloat(p.kurang) : 0; 
        const totalStok = awal + tambah - kurang; 
        const sisa = (p.sisa !== "" && p.sisa !== null) ? parseFloat(p.sisa) : null; 
        let terjual = (sisa !== null && sisa <= totalStok) ? (totalStok - sisa) : 0; 

        let classRow = p.kategori.toLowerCase().includes('bakso') ? 'row-bakso' : 'row-reseller'; 
        let badgeHTML = p.kategori.toLowerCase().includes('bakso') ? `<div class="badge-kategori badge-bakso">🍲 Bakso</div>` : `<div class="badge-kategori badge-reseller">🥤 Reseller</div>`; 
        const actionHTML = locked ? '<span style="font-size:0.8rem;color:#94a3b8;">🔒</span>' : `<button onclick="hapusProduk(${idx})" class="btn btn-danger" style="padding:4px 8px; font-size:0.65rem; width:auto; margin:0; border-radius:6px;">Hapus</button>`;

        const tr = document.createElement('tr'); 
        tr.className = classRow;

        tr.innerHTML = `
            <td style="text-align:center; font-weight:700; color:#94a3b8;">${counter++}</td>
            <td><div style="font-weight:700; color:var(--text-main); font-size:0.8rem;">${p.nama}</div>${badgeHTML}</td>
            <td style="text-align:center;"><input type="number" class="input-stok input-pagi" id="pagi_${idx}" value="${p.awal}" min="0" oninput="updateNilaiStokLokal(${idx}, 'awal', this.value)" ${locked ? 'disabled' : ''}></td>
            <td style="text-align:center;">     <div style="display:flex; align-items:center; justify-content:center; gap:2px;">         <input type="number" class="input-stok input-tambah" style="width:40px;" id="tambah_${idx}" value="${p.tambah || ''}" min="0" oninput="updateNilaiStokLokal(${idx}, 'tambah', this.value)" ${locked ? 'disabled' : ''}>         ${!locked ? `         <div style="display:flex; flex-direction:column; gap:1px;">             <button type="button" onclick="ubahStokHarianCepat(${idx}, 'tambah', 1)" style="background:#dcfce7; color:#166534; border:1px solid #86efac; border-radius:2px; font-size:0.55rem; padding:0 3px; cursor:pointer;" title="Tambah 1 Pcs">➕</button>             <button type="button" onclick="ubahStokHarianCepat(${idx}, 'tambah', -1)" style="background:#fee2e2; color:#991b1b; border:1px solid #fca5a5; border-radius:2px; font-size:0.55rem; padding:0 3px; cursor:pointer;" title="Kurangi 1 Pcs">➖</button>         </div>` : ''}     </div> </td>
            <td style="text-align:center;"><input type="number" class="input-stok input-kurang" style="width:45px;" id="kurang_${idx}" value="${p.kurang || ''}" min="0" oninput="updateNilaiStokLokal(${idx}, 'kurang', this.value)" ${locked ? 'disabled' : ''}></td>
            <td id="td_total_${idx}" style="text-align:center; font-weight:800; font-size:0.95rem; color:#0f172a; background:#f8fafc;">${totalStok}</td>
            <td style="text-align:center;"><input type="number" class="input-stok input-malam" id="malam_${idx}" value="${p.sisa}" min="0" oninput="updateNilaiStokLokal(${idx}, 'sisa', this.value)" ${locked ? 'disabled' : ''}></td>
            <td id="td_terjual_${idx}" style="text-align:center; font-weight:800; font-size:0.95rem; color:#0284c7;">${sisa !== null ? terjual : '-'}</td>
            <td style="text-align:center;">${actionHTML}</td>
        `;
        tbody.appendChild(tr);
    });
}

function updateTehManisLokal() { 
    const tgl = document.getElementById('tglOps').value; if(isDataLocked(tgl)) return;
    let idxTeh = dbStok[tgl].findIndex(p => p.nama.toLowerCase() === 'teh manis'); 
    if (idxTeh !== -1) { 
        const val = document.getElementById('inTehTerjual').value;
        dbStok[tgl][idxTeh].awal = val; 
        dbStok[tgl][idxTeh].sisa = val ? "0" : ""; 
        updateKalkulasi(); 
        clearTimeout(autoSaveTimeout); autoSaveTimeout = setTimeout(() => { simpanStokKeFirebase(); }, 1000); 
    } 
}

function formatRibuanInput(el) {
    let angka = el.value.replace(/[^0-9]/g, '');
    if(angka) { el.value = parseInt(angka, 10).toLocaleString('id-ID'); }
    else { el.value = ''; }
}

function simpanKasMasuk(isAutoTrigger = false) { 
    const tgl = document.getElementById('tglOps').value; 
    if(isDataLocked(tgl)) return; 

    const bersih = (id) => {
        const el = document.getElementById(id);
        if(!el) return 0;
        return parseFloat(el.value.replace(/\./g, '')) || 0;
    };

    const kasData = { 
        cash: bersih('inCash'), qris: bersih('inQris'), gojek: bersih('inGojek'), 
        grab: bersih('inGrab'), shopee: bersih('inShopee'), petty: bersih('inPettycash'), 
        modalBesok: bersih('inModalBesok') 
    }; 
    dbKasMasuk[tgl] = kasData;
    updateKalkulasi();
    
    if(db) { 
        db.collection('cabang').doc(CABANG_AKTIF).collection('kasMasuk').doc(tgl).set(kasData)
        .then(() => { 
            if(isAutoTrigger) { showToast('✅ Tersimpan otomatis!'); } 
        }); 
    }
}

function simpanModalBesokManual() { 
    const tgl = document.getElementById('tglOps').value; 
    if(isDataLocked(tgl)) { alert("Data hari ini terkunci. Buka gembok dulu!"); return; } 

    simpanKasMasuk(false); 

    const modalVal = document.getElementById('inModalBesok').value;
    catatAktivitas('Modal Laci', `Menyimpan modal laci besok sebesar Rp ${modalVal} untuk tanggal ${tgl}`);

    showToast('✅ Modal Besok Sukses Disimpan!'); 
}

function loadKasMasukUI() { 
    const kas = dbKasMasuk[document.getElementById('tglOps').value] || { cash: 0, qris: 0, gojek: 0, grab: 0, shopee: 0, petty: 0, modalBesok: 0 }; 
    const formatTitik = (num) => num ? num.toLocaleString('id-ID') : '0';
    const setVal = (id, val) => { const el = document.getElementById(id); if(el) el.value = formatTitik(val); };
    setVal('inCash', kas.cash);
    setVal('inQris', kas.qris);
    setVal('inGojek', kas.gojek);
    setVal('inGrab', kas.grab);
    setVal('inShopee', kas.shopee);
    setVal('inPettycash', kas.petty);
    setVal('inModalBesok', kas.modalBesok || 0);
}

function tambahPengeluaranHarian(e) { 
    e.preventDefault(); const tgl = document.getElementById('tglOps').value; if(isDataLocked(tgl)) return; 
    const ket = document.getElementById('ketKeluarHarian').value; 
    const nominal = parseFloat(document.getElementById('nominalKeluarHarian').value.replace(/\./g, '')) || 0; 

    if(db) { 
        db.collection('cabang').doc(CABANG_AKTIF).collection('pengeluaranHarian').add({ tgl, ket, nominal }).then(() => { 
            catatAktivitas('Pengeluaran Harian', `Menambah pengeluaran "${ket}" sebesar Rp ${nominal.toLocaleString('id-ID')} untuk tanggal ${tgl}`);
            showToast('🛒 Pengeluaran Ditambah!'); 
        }); 
    } 
    else { 
        dbPengeluaranHarian.push({ id: null, tgl, ket, nominal }); renderPengeluaranTables(); updateKalkulasi(); 
    } 
    document.getElementById('ketKeluarHarian').value = ''; document.getElementById('nominalKeluarHarian').value = ''; 
}

function hapusPengeluaranHarian(docId, idxLokal) { 
    if(isDataLocked(document.getElementById('tglOps').value)) return; 
    if (!confirm("Yakin ingin menghapus?")) return; 

    if (db && docId !== 'null') {
        db.collection('cabang').doc(CABANG_AKTIF).collection('pengeluaranHarian').doc(docId).get().then(doc => {
            if(doc.exists) {
                let ketItem = doc.data().ket;
                let nominalItem = doc.data().nominal;
                catatAktivitas('Hapus Pengeluaran', `Menghapus pengeluaran "${ketItem}" sebesar Rp ${nominalItem.toLocaleString('id-ID')}`);
            }
        });
        db.collection('cabang').doc(CABANG_AKTIF).collection('pengeluaranHarian').doc(docId).delete();
    } else { 
        const itemDihapus = dbPengeluaranHarian[idxLokal];
        catatAktivitas('Hapus Pengeluaran', `Menghapus pengeluaran "${itemDihapus?.ket || 'Lokal'}"`);
        dbPengeluaranHarian.splice(idxLokal, 1); 
        renderPengeluaranTables(); 
        updateKalkulasi(); 
    } 
}

function renderPengeluaranTables() { 
    const tgl = document.getElementById('tglOps').value; const locked = isDataLocked(tgl); const tbodyHarian = document.getElementById('tabelPengeluaranHarian'); if(!tbodyHarian) return; tbodyHarian.innerHTML = ''; dbPengeluaranHarian.forEach((p, idx) => { if(p.tgl === tgl) { const actionHTML = locked ? '🔒' : `<button onclick="hapusPengeluaranHarian('${p.id}', ${idx})" class="btn btn-danger" style="padding:4px 8px; font-size:0.65rem; width:auto; margin:0; border-radius:6px;">🗑️</button>`; const tr = document.createElement('tr'); tr.innerHTML = `<td>${p.tgl}</td><td style="font-weight:600;">${p.ket}</td><td style="color:#dc2626; font-weight:700;">${formatRupiah(p.nominal)}</td><td style="text-align:center;">${actionHTML}</td>`; tbodyHarian.appendChild(tr); } }); 
}

function loadSetoranDapurUI() { 
    const tgl = document.getElementById('tglOps').value; const d = dbSetoranDapur[tgl] || { cash: 0, ket: '', pengeluaran: 0 }; 
    const formatTitik = (num) => num ? num.toLocaleString('id-ID') : '0';
    const setVal = (id, val) => { const el = document.getElementById(id); if(el) el.value = val; };
    setVal('inBmCash', formatTitik(d.cash)); 
    setVal('inBmKetPengeluaran', d.ket); 
    setVal('inBmPengeluaran', formatTitik(d.pengeluaran)); 
}

function simpanSetoranDapurManual() { 
    const tgl = document.getElementById('tglOps').value; 
    if(isDataLocked(tgl)) return; 
    
    const bersih = (id) => { const el = document.getElementById(id); return el ? parseFloat(el.value.replace(/\./g, '')) || 0 : 0; };
    const data = { cash: bersih('inBmCash'), ket: document.getElementById('inBmKetPengeluaran') ? document.getElementById('inBmKetPengeluaran').value : '', pengeluaran: bersih('inBmPengeluaran') }; 
    
    if(db) { 
        db.collection('cabang').doc(CABANG_AKTIF).collection('setoranDapur').doc(tgl).set(data).then(() => { 
            showToast('✅ Data Dapur Tersimpan!'); 
        }); 
    } else { 
        dbSetoranDapur[tgl] = data; updateKalkulasi(); renderViewSetoranBakso(); 
    } 
}

// ==========================================
// SENSOR PERINGATAN GUDANG & ETALASE
// ==========================================
function cekPeringatanStok() {
    const tgl = document.getElementById('tglOps').value;
    const items = dbStok[tgl] || [];
    
    let htmlWarningRefill = "";
    let htmlWarningOrder = "";
    
    items.forEach(p => {
        if (p.kategori === "Bakso Malang" || p.nama.toLowerCase() === 'teh manis') return; 
        
        const mProd = masterProduk.find(mp => mp.nama === p.nama) || {};
        const stokGudang = parseFloat(mProd.stokGudang) || 0;
        const batasMin = parseFloat(mProd.batasMinimum) || 10;
        
        const awal = parseFloat(p.awal) || 0;
        const tambah = parseFloat(p.tambah) || 0;
        const kurang = parseFloat(p.kurang) || 0;
        const stokEtalase = awal + tambah - kurang; 
        
        if (stokEtalase <= 3 && stokGudang > 0) {
            htmlWarningRefill += `<div style="margin-bottom:2px;">▪️ <strong>${p.nama}</strong> di etalase sisa ${stokEtalase} pcs. Ambil dari gudang! (Gudang: ${stokGudang})</div>`;
        }
        
        const totalKeseluruhan = stokEtalase + stokGudang;
        if (totalKeseluruhan <= batasMin) {
            htmlWarningOrder += `<div style="margin-bottom:2px;">▪️ <strong>${p.nama}</strong> sisa ${totalKeseluruhan} pcs (Batas Min: ${batasMin}). Waktunya order supplier!</div>`;
        }
    });
    
    const bannerRefill = document.getElementById('bannerWarningRefill');
    const textRefill = document.getElementById('textWarningRefill');
    if (htmlWarningRefill !== "") {
        if (textRefill) textRefill.innerHTML = htmlWarningRefill;
        if (bannerRefill) bannerRefill.style.display = 'block';
    } else if (bannerRefill) {
        bannerRefill.style.display = 'none';
    }
    
    const bannerOrder = document.getElementById('bannerWarningGudang');
    const textOrder = document.getElementById('textWarningGudang');
    if (htmlWarningOrder !== "") {
        if (textOrder) textOrder.innerHTML = htmlWarningOrder;
        if (bannerOrder) bannerOrder.style.display = 'block';
    } else if (bannerOrder) {
        bannerOrder.style.display = 'none';
    }
}

function updateKalkulasi() {
    const tgl = document.getElementById('tglOps').value; 
    const items = dbStok[tgl] || [];
    let omsetPenjualan = 0, profitBakso = 0, profitReseller = 0, katData = {}; 
    
    daftarKategori.forEach(k => { katData[k] = { omset: 0, modal: 0, profit: 0 }; });
    
    let idxTeh = items.findIndex(p => p.nama.toLowerCase() === 'teh manis');
    if(idxTeh !== -1) { 
        let pTeh = items[idxTeh]; 
        let elInput = document.getElementById('inTehTerjual');
        let elInfo = document.getElementById('infoTehTerjual');
        if(elInput && document.activeElement.id !== 'inTehTerjual') { elInput.value = pTeh.awal; } 
        let terjualTeh = parseFloat(pTeh.awal) || 0; 
        if(elInfo) { elInfo.innerText = `Nominal Omset: ${formatRupiah(terjualTeh * pTeh.jual)}`; } 
    }
    
    items.forEach(p => {  
        const awal = parseFloat(p.awal) || 0;  
        const tambah = parseFloat(p.tambah) || 0;  
        const kurang = parseFloat(p.kurang) || 0;  
        const totalStok = awal + tambah - kurang;  
        const sisa = (p.sisa !== "" && p.sisa !== null) ? parseFloat(p.sisa) : null;  
        
        if (sisa !== null && sisa <= totalStok) {  
            const terjual = totalStok - sisa;  
            const omset = terjual * p.jual;  
            let modal = terjual * p.modal;  
            let profit = terjual * p.margin;  
            
            // 👉 PERLAKUAN KHUSUS LEBIHAN BAKSO:
            // Lebihan bakso murni sebagai omset penambah uang laci, 
            // tidak menghasilkan profit usaha dan modalnya dipisahkan dari modal reseller
            const isLebihanBakso = p.nama.toLowerCase().includes('lebihan bakso');
            if (isLebihanBakso) {
                profit = 0;
                modal = 0; // Agar tidak masuk ke hitungan modal reseller di akumulasi kategori
            }
            
            omsetPenjualan += omset;  
            
            if (!katData[p.kategori]) katData[p.kategori] = { omset: 0, modal: 0, profit: 0 };  
            katData[p.kategori].omset += omset;  
            katData[p.kategori].modal += modal;  
            katData[p.kategori].profit += profit;  
            
            if (p.kategori === 'Bakso Malang') {
                profitBakso += profit;  
            } else {  
                if (!isLebihanBakso) {
                    profitReseller += profit;  
                }
            }  
        }  
    });
    
    const containerAkumulasi = document.getElementById('containerAkumulasiKategori'); 
    if(containerAkumulasi) {
        containerAkumulasi.innerHTML = '';
        Object.keys(katData).forEach(kat => { 
            if (currentUser && currentUser.role === 'dapur' && kat !== 'Bakso Malang') return; 
            const d = katData[kat]; 
            let boxStyle = kat.toLowerCase().includes('bakso') ? "background: #fff7ed; border: 1px solid #fdba74;" : "background: #f0f9ff; border: 1px solid #7dd3fc;"; 
            let titleColor = kat.toLowerCase().includes('bakso') ? "#ea580c" : "#0284c7"; 
            const div = document.createElement('div'); 
            div.style.cssText = `${boxStyle} padding: 12px; border-radius: 12px;`; 
            div.innerHTML = `<h4 style="color: ${titleColor}; margin-bottom: 8px; font-size: 0.85rem; font-weight:800; text-transform:uppercase;">📌 Akumulasi ${kat}</h4><div style="font-size: 0.75rem; display: flex; justify-content: space-between; margin-bottom: 4px; color:#475569;"><span>Omset:</span><strong style="color:var(--text-main);">${formatRupiah(d.omset)}</strong></div><div style="font-size: 0.75rem; display: flex; justify-content: space-between; margin-bottom: 4px; color:#475569;"><span>Modal:</span><strong style="color: #d97706;">${formatRupiah(d.modal)}</strong></div><div style="font-size: 0.8rem; display: flex; justify-content: space-between; border-top: 1px dashed ${titleColor}; padding-top: 6px; margin-top:6px;"><span style="font-weight:700;">Profit:</span><strong style="color: #16a34a;">${formatRupiah(d.profit)}</strong></div>`; 
            containerAkumulasi.appendChild(div); 
        });
    }

    const kas = dbKasMasuk[tgl] || { cash: 0, qris: 0, gojek: 0, grab: 0, shopee: 0, petty: 0, modalBesok: 0 }; 
    const dataSetoran = dbSetoranDapur[tgl] || { cash: 0, ket: '', pengeluaran: 0 }; 

    const dataGaji = dbGajiHarian[tgl] || { utama: true, tambahan: 0, nominal: 0 }; 
    const locked = isDataLocked(tgl); 
    const nominalGajiSetting = pengaturanCabangAktif.gajiHarian || 50000; 

    // Jika belum digembok, paksa hitung pakai setting terbaru
    let gajiHarianNominal = dataGaji.nominal; 
    if (!locked) { 
        gajiHarianNominal = (dataGaji.utama ? nominalGajiSetting : 0) + ((parseInt(dataGaji.tambahan) || 0) * nominalGajiSetting); 
    } 

    const totalUangSeharusnya = omsetPenjualan + (kas.petty || 0); 
    const totalPengeluaranHarian = dbPengeluaranHarian.filter(p => p.tgl === tgl).reduce((acc, curr) => acc + curr.nominal, 0); 
    const pengeluaranDapur = dataSetoran.pengeluaran || 0; 
    const totalStrukPengeluaran = totalPengeluaranHarian + pengeluaranDapur;

    const totalUangFisikDigital = (kas.cash || 0) + (kas.qris || 0) + (kas.gojek || 0) + (kas.grab || 0) + (kas.shopee || 0);
    const totalAktualUang = totalUangFisikDigital + totalStrukPengeluaran;
    const selisih = totalAktualUang - totalUangSeharusnya;
    
    const setTxt = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
    setTxt('txtUangSeharusnya', formatRupiah(totalUangSeharusnya)); 
    setTxt('txtDetailMasuk', formatRupiah(totalUangFisikDigital)); 
    setTxt('txtDetailKeluar', formatRupiah(totalStrukPengeluaran)); 
    setTxt('txtAktualUang', formatRupiah(totalAktualUang)); 
    
    const elSelisih = document.getElementById('txtSelisih');
    if (elSelisih) {
        if (selisih < 0) { elSelisih.innerText = "- " + formatRupiah(Math.abs(selisih)); elSelisih.style.color = "#dc2626"; } 
        else if (selisih > 0) { elSelisih.innerText = "+ " + formatRupiah(selisih); elSelisih.style.color = "#16a34a"; } 
        else { elSelisih.innerText = "Rp 0 (Pas)"; elSelisih.style.color = "#0f172a"; }
    }

    let estimasiTeh = Math.abs(selisih) / 4000; const boxEstimasi = document.getElementById('boxEstimasiEsTeh');
    if (boxEstimasi) {
        if (selisih > 0) { boxEstimasi.innerHTML = `<span style="color:#16a34a;">🥤 Uang berlebih. Coba cek, apakah ada sekitar <strong>${estimasiTeh.toLocaleString('id-ID', {maximumFractionDigits: 1})} cup</strong> Es Teh laku tapi lupa dicatat stoknya?</span>`; } 
        else if (selisih < 0) { boxEstimasi.innerHTML = `<span style="color:#dc2626;">⚠️ Uang kurang bayar/hilang. Stok dicatat laku, tapi uangnya kurang setara dengan <strong>${estimasiTeh.toLocaleString('id-ID', {maximumFractionDigits: 1})} cup</strong> Es Teh.</span>`; } 
        else { boxEstimasi.innerHTML = `<span style="color:#64748b;">✅ Tidak ada selisih. Kerja kasir hari ini sempurna!</span>`; }
    }

    setTxt('profitBakso', formatRupiah(profitBakso)); 
    setTxt('profitReseller', formatRupiah(profitReseller)); 
    let totalProfitKotor = 0; Object.values(katData).forEach(d => totalProfitKotor += d.profit); 
    setTxt('totalProfitGros', formatRupiah(totalProfitKotor)); 
    setTxt('txtProfitPotongGaji', formatRupiah(gajiHarianNominal)); 
    setTxt('txtProfitPotongHarian', formatRupiah(totalPengeluaranHarian)); 
    
    let totalProfitBersih = totalProfitKotor - gajiHarianNominal - totalPengeluaranHarian; 
    let profitAlokasiBasis = Math.max(0, totalProfitBersih);
    
    setTxt('totalProfitBersih', formatRupiah(totalProfitBersih)); 
    let p1 = (pengaturanCabangAktif.pos1?.persen || 20) / 100;
    let p2 = (pengaturanCabangAktif.pos2?.persen || 40) / 100;
    let p3 = (pengaturanCabangAktif.pos3?.persen || 40) / 100;
    const n1 = pengaturanCabangAktif.pos1?.nama || "Dana Darurat";
    const n2 = pengaturanCabangAktif.pos2?.nama || "Tabungan Anak";
    const n3 = pengaturanCabangAktif.pos3?.nama || "Laba Bersih";

    const p1Num = pengaturanCabangAktif.pos1?.persen || 20;
    const p2Num = pengaturanCabangAktif.pos2?.persen || 40;
    const p3Num = pengaturanCabangAktif.pos3?.persen || 40;

    setTxt('lblPos1', `${n1}(${p1Num}%)`);
    setTxt('lblPos2', `${n2}(${p2Num}%)`);
    setTxt('lblPos3', `${n3}(${p3Num}%)`);
    
    setTxt('allocDarurat', formatRupiah(profitAlokasiBasis * p1)); 
    setTxt('allocAnak', formatRupiah(profitAlokasiBasis * p2)); 
    setTxt('allocLabaBersih', formatRupiah(profitAlokasiBasis * p3));

    hitungAkumulasiKasTotal(); renderViewRekapTransfer(); 
    cekPeringatanStok();

    if (currentUser && (currentUser.role === 'owner' || currentUser.role === 'dapur')) { 
        if(document.getElementById('viewDashboard') && document.getElementById('viewDashboard').style.display === 'block') renderDashboardGrafik(); 
    }
}
function formatRupiah(angka) { 
    return "Rp " + new Intl.NumberFormat('id-ID').format(angka || 0); 
}

function renderViewSetoranBakso() {
    const tgl = document.getElementById('tglOps').value; 
    const items = dbStok[tgl] || []; 
    const tbody = document.getElementById('tbodyBaksoSetoran'); 
    if(!tbody) return; 
    tbody.innerHTML = ''; 

    // Cek apakah yang login adalah Owner atau Dapur
    const isOwnerOrDapur = currentUser && (currentUser.role === 'owner' || currentUser.role === 'dapur');

    // Sesuaikan Header Tabel secara dinamis agar bersih untuk Kasir
    const thead = tbody.parentElement.querySelector('thead');
    if (thead) {
        if (isOwnerOrDapur) {
            thead.innerHTML = `<tr>
                <th style="text-align:center;">No</th>
                <th>Varian Produk</th>
                <th style="text-align:center;">Awal</th>
                <th style="text-align:center;">Tambah</th>
                <th style="text-align:center;">Kurang</th>
                <th style="text-align:center;">Total</th>
                <th style="text-align:center;">Laku</th>
                <th style="text-align:center;">Sisa</th>
                <th style="text-align:right;">Modal</th>
                <th style="text-align:right;">Jual</th>
                <th style="text-align:right;">Omset</th>
                <th style="text-align:right;">Profit</th>
            </tr>`;
        } else {
            // Tampilan khusus Kasir (Tanpa kolom Modal, Jual, Omset, Profit)
            thead.innerHTML = `<tr>
                <th style="text-align:center;">No</th>
                <th>Varian Produk</th>
                <th style="text-align:center;">Awal</th>
                <th style="text-align:center;">Tambah</th>
                <th style="text-align:center;">Kurang</th>
                <th style="text-align:center;">Total</th>
                <th style="text-align:center;">Laku</th>
                <th style="text-align:center;">Sisa</th>
            </tr>`;
        }
    }

    let no = 1, totalPorsi = 0, totalOmset = 0, totalModal = 0, totalKeuntungan = 0; 
    let sumAwal = 0, sumTambah = 0, sumKurang = 0, sumTotalStok = 0, sumSisa = 0; 

    items.filter(p => p.kategori === 'Bakso Malang').forEach(p => { 
        const awal = parseFloat(p.awal) || 0; 
        const tambah = parseFloat(p.tambah) || 0; 
        const kurang = parseFloat(p.kurang) || 0; 
        const totalStok = awal + tambah - kurang; 
        const sisa = (p.sisa !== "" && p.sisa !== null) ? parseFloat(p.sisa) : null; 
        const terjual = (sisa !== null && sisa <= totalStok) ? (totalStok - sisa) : 0; 
        const valSisa = sisa !== null ? sisa : 0; 
        const omset = terjual * p.jual; 
        const modal = terjual * p.modal; 
        const profit = terjual * p.margin; 

        totalPorsi += terjual; 
        totalOmset += omset; 
        totalModal += modal; 
        totalKeuntungan += profit; 
        sumAwal += awal; 
        sumTambah += tambah; 
        sumKurang += kurang; 
        sumTotalStok += totalStok; 
        sumSisa += valSisa; 

        const tr = document.createElement('tr'); 
        
        // Render baris data: Jika Kasir, hentikan sampai kolom 'Sisa'. Jika Owner/Dapur, lanjutkan sampai 'Profit'.
        if (isOwnerOrDapur) {
            tr.innerHTML = `<td style="text-align:center;">${no++}</td><td style="font-weight:700;">${p.nama}</td><td style="text-align:center; background:#fff7ed;">${awal}</td><td style="text-align:center; background:#dcfce7; color:#166534;">${tambah > 0 ? tambah : '-'}</td><td style="text-align:center; background:#fee2e2; color:#991b1b;">${kurang > 0 ? kurang : '-'}</td><td style="text-align:center; background:#f1f5f9; font-weight:800; color:#0f172a;">${totalStok}</td><td style="text-align:center; font-weight:800; color:#0f172a; background:#eef2ff;">${sisa !== null ? terjual : 0}</td><td style="text-align:center; color:#dc2626; font-weight:800; background:#fef2f2;">${sisa !== null ? valSisa : '-'}</td><td style="text-align:right;">${formatRupiah(p.modal)}</td><td style="text-align:right;">${formatRupiah(p.jual)}</td><td style="font-weight:600; text-align:right;">${formatRupiah(omset)}</td><td style="color:#16a34a; font-weight:800; text-align:right;">${formatRupiah(profit)}</td>`;
        } else {
            tr.innerHTML = `<td style="text-align:center;">${no++}</td><td style="font-weight:700;">${p.nama}</td><td style="text-align:center; background:#fff7ed;">${awal}</td><td style="text-align:center; background:#dcfce7; color:#166534;">${tambah > 0 ? tambah : '-'}</td><td style="text-align:center; background:#fee2e2; color:#991b1b;">${kurang > 0 ? kurang : '-'}</td><td style="text-align:center; background:#f1f5f9; font-weight:800; color:#0f172a;">${totalStok}</td><td style="text-align:center; font-weight:800; color:#0f172a; background:#eef2ff;">${sisa !== null ? terjual : 0}</td><td style="text-align:center; color:#dc2626; font-weight:800; background:#fef2f2;">${sisa !== null ? valSisa : '-'}</td>`;
        }
        tbody.appendChild(tr); 
    });

    if (sumTotalStok > 0 || totalPorsi > 0) { 
        const trTotal = document.createElement('tr'); 
        trTotal.style.cssText = "background:#fed7aa; font-weight:800; font-size:0.85rem; border-top: 2px solid #ea580c;"; 
        
        if (isOwnerOrDapur) {
            trTotal.innerHTML = `<td colspan="2" style="text-align:center;">TOTAL QTY</td><td style="text-align:center;">${sumAwal}</td><td style="text-align:center; color:#166534;">${sumTambah}</td><td style="text-align:center; color:#991b1b;">${sumKurang}</td><td style="text-align:center; color:#0f172a;">${sumTotalStok}</td><td style="text-align:center; color:#0f172a;">${totalPorsi}</td><td style="text-align:center; color:#b91c1c;">${sumSisa}</td><td colspan="4" style="background:#f8fafc;"></td>`;
        } else {
            trTotal.innerHTML = `<td colspan="2" style="text-align:center;">TOTAL QTY</td><td style="text-align:center;">${sumAwal}</td><td style="text-align:center; color:#166534;">${sumTambah}</td><td style="text-align:center; color:#991b1b;">${sumKurang}</td><td style="text-align:center; color:#0f172a;">${sumTotalStok}</td><td style="text-align:center; color:#0f172a;">${totalPorsi}</td><td style="text-align:center; color:#b91c1c;">${sumSisa}</td>`;
        }
        tbody.appendChild(trTotal); 
    }
    
    const setTxt = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
    setTxt('bmModalAwal', formatRupiah(totalModal)); 
    const dataSetoran = dbSetoranDapur[tgl] || { cash: 0, ket: '', pengeluaran: 0 }; 
    setTxt('bmCashDisplay', formatRupiah(dataSetoran.cash)); 
    setTxt('bmKetPengeluaranDisplay', dataSetoran.ket || '-'); 
    setTxt('bmPengeluaranDisplay', formatRupiah(dataSetoran.pengeluaran)); 
    const hitungTF = Math.max(0, totalModal - dataSetoran.cash - dataSetoran.pengeluaran); 
    setTxt('bmTFDisplay', formatRupiah(hitungTF)); 
    setTxt('bmSetoranFiks', formatRupiah(Math.max(0, totalModal - dataSetoran.pengeluaran))); 
    setTxt('bmPorsiTerjual', `${totalPorsi} pcs`); 
    setTxt('bmTotalOmset', formatRupiah(totalOmset)); 
    setTxt('bmTotalUntung', formatRupiah(totalKeuntungan));
}

function renderViewRekapTransfer() {
    const tgl = document.getElementById('tglOps').value; 
    const items = dbStok[tgl] || []; 
    let totalModalBakso = 0, omsetLebihanBakso = 0, modalReseller = 0, profitKotor = 0;
    
    items.forEach(p => { 
        const awal = parseFloat(p.awal) || 0; 
        const tambah = parseFloat(p.tambah) || 0; 
        const kurang = parseFloat(p.kurang) || 0; 
        const totalStok = awal + tambah - kurang; 
        const sisa = (p.sisa !== "" && p.sisa !== null) ? parseFloat(p.sisa) : null; 
        if (sisa !== null && sisa <= totalStok) { 
            const terjual = totalStok - sisa; 
            profitKotor += (terjual * p.margin); 
            if (p.kategori === 'Bakso Malang') totalModalBakso += (terjual * p.modal); 
            else if (p.kategori === 'Reseller') { 
                if (p.nama.toLowerCase().includes('lebihan bakso')) omsetLebihanBakso += (terjual * p.jual); 
                else modalReseller += (terjual * p.modal); 
            } 
        } 
    });
    
    const dataSetoran = dbSetoranDapur[tgl] || { cash: 0, pengeluaran: 0 }; 
    const setoranTfBakso = Math.max(0, totalModalBakso - dataSetoran.cash - dataSetoran.pengeluaran); 
    
    // Tarik Gaji Harian Dinamis
    const nominalHarian = pengaturanCabangAktif.gajiHarian || 50000;
    const gajiInfo = dbGajiHarian[tgl] || { nominal: nominalHarian }; 
    const totalPengeluaranHarian = dbPengeluaranHarian.filter(p => p.tgl === tgl).reduce((acc, curr) => acc + curr.nominal, 0); 
    const profitBersih = profitKotor - (gajiInfo.nominal || 0) - totalPengeluaranHarian; 
    const alokasiBasis = Math.max(0, profitBersih); 
    
    // Hitungan Persentase Dinamis
    let p1Num = (pengaturanCabangAktif.pos1?.persen || 20) / 100;
    let p2Num = (pengaturanCabangAktif.pos2?.persen || 40) / 100;
    let p3Num = (pengaturanCabangAktif.pos3?.persen || 40) / 100;

    const danaDarurat = alokasiBasis * p1Num; 
    const tabAnak = alokasiBasis * p2Num;
    const labaBersih = alokasiBasis * p3Num; 
    
    const totalA = setoranTfBakso + modalReseller + omsetLebihanBakso + danaDarurat + labaBersih + tabAnak;
    
    const setTxt = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
    
    // Update Label Teks Dinamis HTML
    setTxt('lblRtPos1', (pengaturanCabangAktif.pos1?.nama || "Dana Darurat") + ":");
    setTxt('lblRtPos2', (pengaturanCabangAktif.pos2?.nama || "Tabungan Anak") + ":");
    setTxt('lblRtPos3', (pengaturanCabangAktif.pos3?.nama || "Laba Bersih") + ":");

    setTxt('rtTfBakso', formatRupiah(setoranTfBakso)); 
    setTxt('rtKasReseller', formatRupiah(modalReseller)); 
    setTxt('rtKasPlastik', formatRupiah(omsetLebihanBakso)); 
    setTxt('rtKasDarurat', formatRupiah(danaDarurat)); 
    setTxt('rtKasAnak', formatRupiah(tabAnak)); 
    setTxt('rtKasLaba', formatRupiah(labaBersih)); 
    setTxt('rtTotalA', formatRupiah(totalA));
    
    const kas = dbKasMasuk[tgl] || { qris: 0, gojek: 0, grab: 0, shopee: 0, modalBesok: 0 }; 
    const totalB = (kas.qris||0) + (kas.gojek||0) + (kas.grab||0) + (kas.shopee||0) + (kas.modalBesok||0);
    
    setTxt('rtQris', formatRupiah(kas.qris)); 
    setTxt('rtGojek', formatRupiah(kas.gojek)); 
    setTxt('rtGrab', formatRupiah(kas.grab)); 
    setTxt('rtShopee', formatRupiah(kas.shopee)); 
    setTxt('rtModalBesok', formatRupiah(kas.modalBesok)); 
    setTxt('rtTotalB', formatRupiah(totalB));
    
    const sisaSetor = totalA - totalB; 
    const finalBox = document.getElementById('rtFinalBox'), finalValue = document.getElementById('rtFinalValue'), finalKet = document.getElementById('rtFinalKet');
    
    if (finalBox && finalValue && finalKet) {
        if (sisaSetor > 0) { 
            finalBox.style.background = '#fff1f2'; finalBox.style.border = '2px solid #fda4af'; finalValue.style.color = '#be123c'; 
            finalValue.innerText = formatRupiah(sisaSetor); finalKet.style.color = '#9f1239'; finalKet.innerText = "⚠️ Anda WAJIB MENGAMBIL uang fisik dari laci kasir sebesar nilai di atas untuk disetor tunai via ATM/Bank."; 
        } else if (sisaSetor === 0) { 
            finalBox.style.background = '#f0fdf4'; finalBox.style.border = '2px solid #86efac'; finalValue.style.color = '#15803d'; 
            finalValue.innerText = formatRupiah(0); finalKet.style.color = '#166534'; finalKet.innerText = "✅ PAS! Uang tagihan hari ini persis menutupi semua uang digital & uang tertahan."; 
        } else { 
            finalBox.style.background = '#eff6ff'; finalBox.style.border = '2px solid #93c5fd'; finalValue.style.color = '#1d4ed8'; 
            finalValue.innerText = `+ ${formatRupiah(Math.abs(sisaSetor))}`; finalKet.style.color = '#1e3a8a'; finalKet.innerText = "✨ SURPLUS DIGITAL! Tagihan tertutup sepenuhnya. Angka di atas adalah sisa uang lebih di saldo digital Anda."; 
        }
    }
}

function renderRekapGajiBulanan() {
    const bln = document.getElementById('filterBulanGaji').value; 
    if(!bln) return;

    let totalHadirUtama = 0; 
    let totalLiburUtama = 0; 
    let totalGajiUtamaDiambil = 0; 
    let totalGajiTambahanDiambil = 0; 
    const validDates = Object.keys(dbStok).filter(tgl => tgl.startsWith(bln)).sort();

    // 1. Tarik variabel pengaturan cabang dari database
    const nominalHarian = pengaturanCabangAktif.gajiHarian || 50000;
    const toleransi = pengaturanCabangAktif.toleransiLibur || 2;
    const gajiPokok = pengaturanCabangAktif.gajiBulanan || 1500000;

    validDates.forEach(tgl => { 
        const dataGaji = dbGajiHarian[tgl] || { utama: true, tambahan: 0, nominal: nominalHarian }; 
        const uangHarian = dataGaji.nominal || nominalHarian; 

        if (dataGaji.utama === true) { 
            totalHadirUtama++; 
            totalGajiUtamaDiambil += uangHarian; 
        } else { 
            totalLiburUtama++; 
        } 
        totalGajiTambahanDiambil += (dataGaji.tambahan * uangHarian); 
    });

    let potongan = 0; 
    // 2. Hitung potongan jika libur melebihi batas toleransi yang diset Owner
    if (totalLiburUtama > toleransi) { 
        potongan = (totalLiburUtama - toleransi) * nominalHarian; 
    } 
    const gajiBersihTF = gajiPokok - potongan;
    
    const setTxt = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
    setTxt('gbHariKerja', `${totalHadirUtama} Hari Masuk`); 
    setTxt('gbHariLibur', `${totalLiburUtama} Hari`); 
    setTxt('gbPotonganLibur', formatRupiah(potongan)); 
    setTxt('gbGajiUtamaTF', formatRupiah(gajiBersihTF)); 
    setTxt('gbUangHarianUtama', formatRupiah(totalGajiUtamaDiambil)); 
    setTxt('gbUangHarianTambahan', formatRupiah(totalGajiTambahanDiambil)); 
    setTxt('gbTotalHarianLaci', formatRupiah(totalGajiUtamaDiambil + totalGajiTambahanDiambil));
    setTxt('lblGajiPokokBulanan', formatRupiah(gajiPokok));
}
function hitungAkumulasiKasTotal() {  
    let kasReseller = 0, kasPlastik = 0, kasDarurat = 0, kasLaba = 0, kasAnak = 0;  
    const validDates = Object.keys(dbStok).filter(tgl => tgl.match(/^\d{4}-\d{2}-\d{2}$/)).sort();  

    let p1 = (pengaturanCabangAktif.pos1?.persen || 20) / 100;
    let p2 = (pengaturanCabangAktif.pos2?.persen || 40) / 100;
    let p3 = (pengaturanCabangAktif.pos3?.persen || 40) / 100;

    let n1 = pengaturanCabangAktif.pos1?.nama || "Dana Darurat";
    let n2 = pengaturanCabangAktif.pos2?.nama || "Tabungan Anak";
    let n3 = pengaturanCabangAktif.pos3?.nama || "Laba Bersih";

    validDates.forEach(tgl => {  
        let pKotor = 0, omsetLebihan = 0, modalReseller = 0;  
        dbStok[tgl].forEach(p => {  
            const awal = parseFloat(p.awal) || 0;  
            const tambah = parseFloat(p.tambah) || 0;  
            const kurang = parseFloat(p.kurang) || 0;  
            const totalStok = awal + tambah - kurang;  
            const sisa = (p.sisa !== "" && p.sisa !== null) ? parseFloat(p.sisa) : null;  

            if (sisa !== null && sisa <= totalStok) {  
                const terjual = totalStok - sisa;  
                pKotor += (terjual * p.margin);  
                if (p.kategori === 'Reseller') {  
                    if (p.nama.toLowerCase().includes('lebihan bakso')) {  
                        omsetLebihan += (terjual * p.jual);  
                    } else {  
                        modalReseller += (terjual * p.modal);  
                    }  
                }  
            }  
        });  

        const pengeluaranHarianBulan = dbPengeluaranHarian.filter(p => p.tgl === tgl).reduce((acc, curr) => acc + curr.nominal, 0);  
        const nominalGaji = pengaturanCabangAktif.gajiHarian || 50000; 
        const gajiHarian = dbGajiHarian[tgl] ? dbGajiHarian[tgl].nominal : nominalGaji;
        const pBersih = pKotor - gajiHarian - pengeluaranHarianBulan;  
        const basis = Math.max(0, pBersih);  

        kasReseller += modalReseller;  
        kasPlastik += omsetLebihan;  
        kasDarurat += (basis * p1);  
        kasLaba += (basis * p3);      
        kasAnak += (basis * p2);      
    });  

    dbLogKas.forEach(l => {  
        const n = l.tipe === 'masuk' ? l.nominal : -l.nominal;  
        if (l.jenis === 'Reseller') kasReseller += n;  
        else if (l.jenis === 'Plastik') kasPlastik += n;  
        else if (l.jenis === n1 || l.jenis === 'Dana Darurat') kasDarurat += n;  
        else if (l.jenis === n3 || l.jenis === 'Laba Bersih') kasLaba += n;  
        else if (l.jenis === n2 || l.jenis === 'Tabungan Anak') kasAnak += n;  
    });  

    const setTxt = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
    setTxt('sbKasReseller', formatRupiah(kasReseller));  
    setTxt('sbKasPlastik', formatRupiah(kasPlastik));  
    setTxt('sbKasDarurat', formatRupiah(kasDarurat));  
    setTxt('sbKasLaba', formatRupiah(kasLaba));  
    setTxt('sbKasAnak', formatRupiah(kasAnak));  

    // Update Label Judul Kartu Atas Secara Dinamis sesuai Pos Cabang Aktif
    setTxt('lblCardPos1', n1);
    setTxt('lblCardPos3', n3);
    setTxt('lblCardPos2', n2);

    // Update Teks pada Tombol Tab secara Dinamis
    const elTab1 = document.getElementById('btnTabPos1'); if(elTab1) elTab1.innerText = `🛡️ ${n1}`;
    const elTab3 = document.getElementById('btnTabPos3'); if(elTab3) elTab3.innerText = `💵 ${n3}`;
    const elTab2 = document.getElementById('btnTabPos2'); if(elTab2) elTab2.innerText = `👶 ${n2}`;

    if (typeof activeKasTab !== 'undefined') renderMutasiTabKas(activeKasTab);  
}

function gantiTabKas(jenis, el) { 
    activeKasTab = jenis; 
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active')); 
    if(el) el.classList.add('active'); 
    renderMutasiTabKas(jenis); 
}

function gantiTabKasDinamis(posKey, el) {
    const namaPos = pengaturanCabangAktif[posKey]?.nama || posKey;
    gantiTabKas(namaPos, el);
}

function bukaModalKasDinamis(posKey, tipe) {
    const namaPos = pengaturanCabangAktif[posKey]?.nama || posKey;
    bukaModalKas(namaPos, tipe);
}

function renderMutasiTabKas(jenis) {  
    const elNama = document.getElementById('txtNamaTabKas');
    if(elNama) elNama.innerText = `Kas ${jenis}`;  
    const tbody = document.getElementById('tbodyMutasiKas');  
    if(!tbody) return;
    tbody.innerHTML = '';  
    let mutasiList = [];  
    const validDates = Object.keys(dbStok).filter(tgl => tgl.match(/^\d{4}-\d{2}-\d{2}$/)).sort();  

    let p1Num = pengaturanCabangAktif.pos1?.persen || 20;
    let p2Num = pengaturanCabangAktif.pos2?.persen || 40;
    let p3Num = pengaturanCabangAktif.pos3?.persen || 40;

    let p1 = p1Num / 100;
    let p2 = p2Num / 100;
    let p3 = p3Num / 100;

    let n1 = pengaturanCabangAktif.pos1?.nama || "Dana Darurat";
    let n2 = pengaturanCabangAktif.pos2?.nama || "Tabungan Anak";
    let n3 = pengaturanCabangAktif.pos3?.nama || "Laba Bersih";

    validDates.forEach(tgl => {  
        let pKotor = 0, modalR = 0, omsetL = 0;  
        dbStok[tgl].forEach(p => {  
            const awal = parseFloat(p.awal) || 0;  
            const tambah = parseFloat(p.tambah) || 0;  
            const kurang = parseFloat(p.kurang) || 0;  
            const totalStok = awal + tambah - kurang;  
            const sisa = (p.sisa !== "" && p.sisa !== null) ? parseFloat(p.sisa) : null;  

            if (sisa !== null && sisa <= totalStok) {  
                const terjual = totalStok - sisa;  
                pKotor += (terjual * p.margin);  
                if (p.kategori === 'Reseller') {  
                    if (p.nama.toLowerCase().includes('lebihan bakso')) omsetL += (terjual * p.jual);  
                    else modalR += (terjual * p.modal);  
                }  
            }  
        });  

        const pengeluaranHarianBulan = dbPengeluaranHarian.filter(p => p.tgl === tgl).reduce((acc, curr) => acc + curr.nominal, 0);  
        const nominalGaji = pengaturanCabangAktif.gajiHarian || 50000; 
        const gajiHarian = dbGajiHarian[tgl] ? dbGajiHarian[tgl].nominal : nominalGaji;
        const pB = Math.max(0, pKotor - gajiHarian - pengeluaranHarianBulan);  

        if (jenis === 'Reseller' && modalR > 0) {
            mutasiList.push({ id: null, tgl, tipe: 'masuk', ket: 'Masuk: Modal Reseller', nominal: modalR, auto: true });  
        } else if (jenis === 'Plastik' && omsetL > 0) {
            mutasiList.push({ id: null, tgl, tipe: 'masuk', ket: 'Masuk: Jual Plastik', nominal: omsetL, auto: true });  
        } else if ((jenis === n1 || jenis === 'Dana Darurat') && pB > 0) {
            mutasiList.push({ id: null, tgl, tipe: 'masuk', ket: `Masuk: Profit ${n1} (${p1Num}%)`, nominal: pB * p1, auto: true });  
        } else if ((jenis === n3 || jenis === 'Laba Bersih') && pB > 0) {
            mutasiList.push({ id: null, tgl, tipe: 'masuk', ket: `Masuk: Profit ${n3} (${p3Num}%)`, nominal: pB * p3, auto: true });  
        } else if ((jenis === n2 || jenis === 'Tabungan Anak') && pB > 0) {
            mutasiList.push({ id: null, tgl, tipe: 'masuk', ket: `Masuk: Profit ${n2} (${p2Num}%)`, nominal: pB * p2, auto: true });  
        }
    });  

    dbLogKas.forEach(l => {  
        if (l.jenis === jenis || (jenis === n1 && l.jenis === 'Dana Darurat') || (jenis === n3 && l.jenis === 'Laba Bersih') || (jenis === n2 && l.jenis === 'Tabungan Anak')) {
            mutasiList.push({ ...l, auto: false });  
        }
    });  

    mutasiList.sort((a, b) => a.tgl.localeCompare(b.tgl));  
    let saldoTotal = 0;  

    const filterBulan = document.getElementById('inputFilterBulan') ? document.getElementById('inputFilterBulan').value : '';  

    mutasiList.forEach(m => {  
        saldoTotal += (m.tipe === 'masuk' ? m.nominal : -m.nominal);  
        m.saldoSaatIni = saldoTotal;  
    });  

    mutasiList.forEach(m => {  
        if (filterBulan && !m.tgl.startsWith(filterBulan)) {
            return;  
        }
        const tr = document.createElement('tr');  
        tr.innerHTML = `<td>${m.tgl}</td><td><span style="color:${m.tipe==='masuk'?'#16a34a':'#dc2626'}; font-weight:800; font-size:0.65rem;">${m.tipe==='masuk'?'🟢 IN':'🔴 OUT'}</span></td><td style="font-weight:600;">${m.ket}</td><td style="font-weight:800; text-align:right;">${formatRupiah(m.nominal)}</td><td style="font-weight:800; color:#2563eb; text-align:right;">${formatRupiah(m.saldoSaatIni)}</td><td style="text-align:center;">${!m.auto ? `<button onclick="hapusMutasiKas('${m.id}')" class="btn btn-danger" style="padding:4px; font-size:0.6rem;">Del</button>` : `<small style="font-weight:bold; color:#64748b;">Auto</small>`}</td>`;  
        tbody.prepend(tr);  
    });  

    const elTotalKas = document.getElementById('txtTotalTabKas');
    if(elTotalKas) elTotalKas.innerText = formatRupiah(saldoTotal);  
}
function hapusMutasiKas(docId) { 
    if(db && confirm("Hapus transaksi kas ini?")) {
        db.collection('cabang').doc(CABANG_AKTIF).collection('logKas').doc(docId).delete(); 
    }
}

// ==========================================
// FUNGSI MASTER PRODUK & GUDANG
// ==========================================
function bukaModalKelolaProduk() { 
    const select = document.getElementById('selectKategoriProduk'); 
    if(select && typeof daftarKategori !== 'undefined') {
        select.innerHTML=''; 
        daftarKategori.forEach(k => { select.innerHTML += `<option value="${k}">${k}</option>` }); 
    }
    
    // SAFE CHECK: Hanya ubah value JIKA elemennya ditemukan di HTML
    if(document.getElementById('editIndexProduk')) document.getElementById('editIndexProduk').value = "-1"; 
    if(document.getElementById('inputNamaProduk')) document.getElementById('inputNamaProduk').value = ""; 
    if(document.getElementById('inputModalProduk')) document.getElementById('inputModalProduk').value = ""; 
    if(document.getElementById('inputJualProduk')) document.getElementById('inputJualProduk').value = ""; 
    if(document.getElementById('inputMarginProduk')) document.getElementById('inputMarginProduk').value = ""; 
    if(document.getElementById('inputStokGudang')) document.getElementById('inputStokGudang').value = "0"; 
    if(document.getElementById('inputBatasMinimum')) document.getElementById('inputBatasMinimum').value = "10"; 
    
    if(document.getElementById('btnSimpanProduk')) document.getElementById('btnSimpanProduk').innerText = "Simpan"; 
    
    renderTabelMasterProduk(); 
    
    if(document.getElementById('modalKelolaProduk')) {
        document.getElementById('modalKelolaProduk').classList.add('active'); 
    }
}

function tutupModalKelolaProduk() { document.getElementById('modalKelolaProduk').classList.remove('active'); }

function tambahKategoriBaruPrompt() { const k=prompt("Nama Kategori Baru:"); if(k&&k.trim()){ daftarKategori.push(k.trim()); if(db)db.collection('cabang').doc(CABANG_AKTIF).collection('appData').doc('daftarKategori').set({list:daftarKategori}); bukaModalKelolaProduk(); } }

function hitungMarginForm() { document.getElementById('inputMarginProduk').value=Math.max(0,(parseFloat(document.getElementById('inputJualProduk').value)||0)-(parseFloat(document.getElementById('inputModalProduk').value)||0)); }
// ==========================================
// 1. FUNGSI CERDAS: MENGHITUNG TOTAL BARANG KELUAR KE ETALASE
// ==========================================
function hitungTotalStokKeluar(namaProduk) {
    let totalKeluar = 0;
    // Menyapu semua data harian yang ada di dbStok
    if (typeof dbStok !== 'undefined' && dbStok !== null) {
        Object.keys(dbStok).forEach(tgl => {
            let dataHariIni = dbStok[tgl];
            if (Array.isArray(dataHariIni)) {
                let item = dataHariIni.find(p => p.nama === namaProduk);
                // Jika produk ditemukan, ambil angka dari kolom "Tambah"
                if (item && item.tambah) {
                    totalKeluar += parseFloat(item.tambah) || 0;
                }
            }
        });
    }
    return totalKeluar;
}

// ==========================================
// 2. SIMPAN / EDIT PRODUK BARU
// ==========================================
function simpanProdukBaru(e) { 
    e.preventDefault(); 
    
    // Fungsi bantu pengaman agar tidak error jika input tidak ada di HTML
    const getVal = (id) => document.getElementById(id) ? document.getElementById(id).value : "";
    const getNum = (id) => {
        const el = document.getElementById(id);
        return el && el.value ? parseFloat(el.value) : 0;
    };

    const p = {
        nama: getVal('inputNamaProduk').trim(), 
        kategori: getVal('selectKategoriProduk'), 
        modal: getNum('inputModalProduk'), 
        jual: getNum('inputJualProduk'), 
        margin: 0,
        stokAwalGudang: getNum('inputStokGudang'),
        keluarEtalase: 0, // <--- TAMBAHKAN BARIS INI
        stokRusak: getNum('inputStokRusak'),
        minGudang: getNum('inputMinGudang'),
        minEtalase: getNum('inputMinEtalase')
    };
    p.margin = p.jual - p.modal; 

    const elEdit = document.getElementById('editIndexProduk');
    const idx = elEdit && elEdit.value ? parseInt(elEdit.value) : -1; 
    const aksiTeks = idx >= 0 ? `Mengubah/Edit produk "${p.nama}"` : `Menambahkan produk baru "${p.nama}"`;

    if(idx >= 0) {
        masterProduk[idx] = p; 
    } else {
        masterProduk.push(p);
        if (p.stokAwalGudang > 0 && typeof catatRiwayatStok === 'function') {
            catatRiwayatStok(p.nama, 'In', p.stokAwalGudang, p.stokAwalGudang);
        }
    } 
    
    if(typeof catatAktivitas === 'function') catatAktivitas('Master Produk', aksiTeks);

    if(typeof db !== 'undefined' && db !== null) {
        db.collection('cabang').doc(typeof CABANG_AKTIF !== 'undefined' ? CABANG_AKTIF : 'cipeteutara')
          .collection('appData').doc('masterProduk').set({ list: masterProduk })
        .then(() => { 
            if(typeof tutupModalKelolaProduk === 'function') tutupModalKelolaProduk(); 
            if(typeof showToast === 'function') showToast("✅ Produk Berhasil Disimpan!"); 
            renderTabelMasterProduk();
        }).catch(err => {
            console.error("Gagal simpan:", err);
        }); 
    } else { 
        if(typeof tutupModalKelolaProduk === 'function') tutupModalKelolaProduk(); 
        if(typeof showToast === 'function') showToast("✅ Lokal OK"); 
        renderTabelMasterProduk();
    } 
}
// ==========================================
// 3. EDIT PRODUK (MENGISI FORM)
// ==========================================
function editProdukMaster(i) { 
    const select = document.getElementById('selectKategoriProduk'); 
    if(select) {
        select.innerHTML = ''; 
        if(typeof daftarKategori !== 'undefined') {
            daftarKategori.forEach(k => { select.innerHTML += `<option value="${k}">${k}</option>` });
        }
    }
    
    const p = masterProduk[i]; 
    document.getElementById('editIndexProduk').value = i; 
    document.getElementById('inputNamaProduk').value = p.nama; 
    document.getElementById('selectKategoriProduk').value = p.kategori; 
    document.getElementById('inputModalProduk').value = p.modal || 0; 
    document.getElementById('inputJualProduk').value = p.jual || 0; 
    
    document.getElementById('inputStokGudang').value = p.stokAwalGudang || 0;
    document.getElementById('inputStokRusak').value = p.stokRusak || 0;
    document.getElementById('inputMinGudang').value = p.minGudang || 10;
    document.getElementById('inputMinEtalase').value = p.minEtalase || 5;
    
    if(typeof hitungMarginForm === 'function') hitungMarginForm(); 
    document.getElementById('btnSimpanProduk').innerText = "Update Produk"; 
    document.getElementById('modalKelolaProduk').classList.add('active');
}
// ==========================================
// 1. RENDER TABEL MASTER PRODUK (VERSI INLINE EDITING)
// ==========================================
function renderTabelMasterProduk() {
    const tbody = document.getElementById('tbodyMasterProduk');
    if (!tbody) return;
    
    const tableEl = tbody.parentElement;
    
    // A. Buat Tombol Simpan Masal di atas tabel (jika belum ada)
    let btnContainer = document.getElementById('containerBtnSimpanMasal');
    if (!btnContainer) {
        btnContainer = document.createElement('div');
        btnContainer.id = 'containerBtnSimpanMasal';
        btnContainer.style.cssText = 'margin-bottom: 15px; display: flex; justify-content: flex-end;';
        btnContainer.innerHTML = `<button onclick="simpanMutasiGudangMasal()" style="background:#16a34a; color:white; padding:10px 20px; font-weight:bold; border:none; border-radius:8px; cursor:pointer; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">💾 Simpan Perubahan Stok Masal</button>`;
        tableEl.parentNode.insertBefore(btnContainer, tableEl);
    } else {
        // Pastikan tombol aktif kembali saat tabel di-render ulang
        const btn = btnContainer.querySelector('button');
        if (btn) { btn.innerText = "💾 Simpan Perubahan Stok Masal"; btn.disabled = false; }
    }

    // B. Ubah Judul Kolom (Header) agar sesuai dengan kolom input baru
    const theadEl = tableEl.querySelector('thead');
    if (theadEl) {
        theadEl.innerHTML = `
            <tr style="font-size: 0.85rem;">
                <th>No</th>
                <th>Nama Produk</th>
                <th>Kategori</th>
                <th>Modal</th>
                <th>Jual</th>
                <th style="background:#dcfce7; color:#166534;" title="Total Modal/Kulakan Awal">Awal Gudang</th>
                <th style="background:#22c55e; color:white;" title="Isi jumlah barang yang baru dibeli hari ini">[+] Masuk Baru</th>
                <th style="background:#fef2f2; color:#991b1b;" title="Total Barang Keluar ke Etalase Depan">Ke Etalase</th>
                <th style="background:#fef2f2; color:#991b1b;" title="Total Barang Rusak/Expired">Total Rusak</th>
                <th style="background:#ef4444; color:white;" title="Isi jumlah barang yang rusak hari ini">[+] Rusak Baru</th>
                <th style="background:#e0f2fe; color:#0369a1;">Sisa Gudang Aktual</th>
                <th>Aksi</th>
            </tr>
        `;
    }

    tbody.innerHTML = '';

    // C. Looping Data
    masterProduk.forEach((p, index) => {
        const awalGudang = parseFloat(p.stokAwalGudang) || 0;
        const keluarEtalase = parseFloat(p.keluarEtalase) || 0;
        const rusakTotal = parseFloat(p.stokRusak) || 0;
        const sisaGudangAsli = awalGudang - keluarEtalase - rusakTotal;
        
        const isBakso = p.kategori.toLowerCase().includes('bakso malang');

        // Jika Bakso Malang, cetak '-' (dikunci). Jika Reseller, cetak angkanya.
        const cetakAwal = isBakso ? '-' : awalGudang;
        const cetakKeluar = isBakso ? '-' : keluarEtalase;
        const cetakRusakTotal = isBakso ? '-' : rusakTotal;
        
        // Kotak Input Interaktif (Dinonaktifkan jika Bakso Malang)
        const inputMasuk = isBakso ? `<span style="color:#94a3b8;">-</span>` : `<input type="number" id="inputMasuk_${index}" style="width:60px; padding:4px; text-align:center; border:2px solid #22c55e; border-radius:6px; font-weight:bold; color:#166534;" min="0" placeholder="0" oninput="hitungSisaGudangRealtime(${index})">`;
        
        const inputRusakBaru = isBakso ? `<span style="color:#94a3b8;">-</span>` : `<input type="number" id="inputRusak_${index}" style="width:60px; padding:4px; text-align:center; border:2px solid #ef4444; border-radius:6px; font-weight:bold; color:#991b1b;" min="0" placeholder="0" oninput="hitungSisaGudangRealtime(${index})">`;
        
        const cetakSisa = isBakso ? '-' : `<span id="sisaRealtime_${index}">${sisaGudangAsli}</span>`;

        tbody.innerHTML += `
            <tr>
                <td style="color:#6d28d9; font-weight:bold;">${index + 1}</td>
                <td style="color:#6d28d9; font-weight:bold;">${p.nama}</td>
                <td><span style="background:#e0e7ff; color:#4f46e5; padding:2px 8px; border-radius:12px; font-size:0.7rem; font-weight:bold;">${p.kategori}</span></td>
                <td style="color:#6d28d9; font-weight:bold;">${p.modal}</td>
                <td style="color:#6d28d9; font-weight:bold;">${p.jual}</td>
                
                <td style="color:#16a34a; font-weight:900; background:#f0fdf4; text-align:center;">${cetakAwal}</td>
                <td style="background:#dcfce7; text-align:center;">${inputMasuk}</td>
                
                <td style="color:#dc2626; font-weight:900; background:#fef2f2; text-align:center;">${cetakKeluar}</td>
                
                <td style="color:#dc2626; font-weight:900; background:#fef2f2; text-align:center;">${cetakRusakTotal}</td>
                <td style="background:#fee2e2; text-align:center;">${inputRusakBaru}</td>
                
                <td style="color:#0284c7; font-weight:900; font-size:1.1rem; background:#f0f9ff; text-align:center;">${cetakSisa}</td>
                
                <td>
                    <button onclick="editProdukMaster(${index})" style="background:none; border:none; cursor:pointer;" title="Edit Detail">✏️</button>
                    <button onclick="hapusProdukMaster(${index})" style="background:none; border:none; cursor:pointer;" title="Hapus Produk">🗑️</button>
                </td>
            </tr>
        `;
    });
}

// ==========================================
// 2. LOGIKA HITUNG REAL-TIME SAAT DIKETIK
// ==========================================
function hitungSisaGudangRealtime(index) {
    const p = masterProduk[index];
    if (p.kategori.toLowerCase().includes('bakso malang')) return;

    const awalGudang = parseFloat(p.stokAwalGudang) || 0;
    const keluarEtalase = parseFloat(p.keluarEtalase) || 0;
    const rusakTotal = parseFloat(p.stokRusak) || 0;

    const inputMasukEl = document.getElementById(`inputMasuk_${index}`);
    const inputRusakEl = document.getElementById(`inputRusak_${index}`);
    
    const masukBaru = parseFloat(inputMasukEl.value) || 0;
    const rusakBaru = parseFloat(inputRusakEl.value) || 0;

    // Sisa Aktual = (Awal + Masuk Baru) - Keluar - (Rusak Lama + Rusak Baru)
    const sisaBaru = (awalGudang + masukBaru) - keluarEtalase - (rusakTotal + rusakBaru);
    
    const elSisa = document.getElementById(`sisaRealtime_${index}`);
    if (elSisa) {
        elSisa.innerText = sisaBaru;
        // Beri warna hijau jika ada perubahan, biru jika kosong
        if (masukBaru > 0 || rusakBaru > 0) {
            elSisa.style.color = "#16a34a"; 
        } else {
            elSisa.style.color = "#0369a1";
        }
    }
}
// ==========================================
// 3. EKSEKUSI SIMPAN MUTASI MASAL KE FIREBASE
// ==========================================
function simpanMutasiGudangMasal() {
    let adaPerubahan = false;
    let daftarRiwayatBaru = []; // Menampung log untuk dikirim ke riwayat

    masterProduk.forEach((p, index) => {
        const inputMasukEl = document.getElementById(`inputMasuk_${index}`);
        const inputRusakEl = document.getElementById(`inputRusak_${index}`);
        if (!inputMasukEl || !inputRusakEl) return;

        const masukBaru = parseFloat(inputMasukEl.value) || 0;
        const rusakBaru = parseFloat(inputRusakEl.value) || 0;

        if (masukBaru > 0 || rusakBaru > 0) {
            adaPerubahan = true;
            
            // Proses Penambahan Stok
            if (masukBaru > 0) {
                p.stokAwalGudang = (parseFloat(p.stokAwalGudang) || 0) + masukBaru;
                daftarRiwayatBaru.push({ 
                    nama: p.nama, 
                    aksi: 'In', 
                    jumlah: masukBaru, 
                    sisaAkhir: (p.stokAwalGudang - (p.keluarEtalase || 0) - (p.stokRusak || 0)) 
                });
            }
            
            // Proses Penambahan Barang Rusak
            if (rusakBaru > 0) {
                p.stokRusak = (parseFloat(p.stokRusak) || 0) + rusakBaru;
                daftarRiwayatBaru.push({ 
                    nama: p.nama, 
                    aksi: 'Out', // Tercatat sebagai barang keluar/hilang
                    jumlah: rusakBaru, 
                    sisaAkhir: (p.stokAwalGudang - (p.keluarEtalase || 0) - p.stokRusak) 
                });
            }
        }
    });

    if (!adaPerubahan) {
        alert("Peringatan: Belum ada angka [+] Masuk atau [+] Rusak yang diisi di tabel.");
        return;
    }

    if (confirm("Simpan semua perubahan stok ke database?")) {
        const btn = document.querySelector('#containerBtnSimpanMasal button');
        if(btn) { btn.innerText = "⏳ Sedang Menyimpan..."; btn.disabled = true; }

        if (typeof db !== 'undefined' && db !== null) {
            db.collection('cabang').doc(CABANG_AKTIF).collection('appData').doc('masterProduk').set({ list: masterProduk })
            .then(() => {
                // Tembakkan log ke halaman "Riwayat Stok" satu per satu
                if (typeof catatRiwayatStok === 'function') {
                    daftarRiwayatBaru.forEach(log => {
                        catatRiwayatStok(log.nama, log.aksi, log.jumlah, log.sisaAkhir);
                    });
                }
                if (typeof catatAktivitas === 'function') {
                    catatAktivitas("Master Produk", `Mutasi masal sukses: ${daftarRiwayatBaru.length} pergerakan barang dicatat.`);
                }
                if(typeof showToast === 'function') showToast("✅ Stok Baru Berhasil Masuk!");
                renderTabelMasterProduk(); // Kosongkan form kembali setelah sukses
            })
            .catch(err => {
                alert("Gagal menyimpan ke server: " + err);
                if(btn) { btn.innerText = "💾 Simpan Perubahan Stok Masal"; btn.disabled = false; }
            });
        } else {
            renderTabelMasterProduk();
            alert("✅ Data tersimpan (Mode Lokal).");
        }
    }
}

// ==========================================
// FUNGSI KOREKSI / SESUAIKAN STOK FISIK AKTUAL DENGAN RIWAYAT OTOMATIS
// ==========================================
function bukaModalKoreksiStok(i) {
    const p = masterProduk[i];
    if (!p) return;

    let inputBaru = prompt(`⚙️ KOREKSI STOK FISIK: ${p.nama}\n\nMasukkan jumlah SISA STOK GUDANG yang aktual/riil saat ini di gudang:`, p.stokAwalGudang - (p.stokKeluar || 0) - (p.stokRusak || 0));
    
    if (inputBaru === null) return; // Batal
    let stokFisikAktual = parseInt(inputBaru);
    
    if (isNaN(stokFisikAktual) || stokFisikAktual < 0) {
        alert("Masukkan angka yang valid!");
        return;
    }

    let stokLama = (parseFloat(p.stokAwalGudang) || 0) - (parseFloat(p.stokKeluar) || 0) - (parseFloat(p.stokRusak) || 0);
    let selisih = stokFisikAktual - stokLama;

    if (selisih === 0) {
        alert("Stok sudah sesuai, tidak ada perubahan.");
        return;
    }

    // Penyesuaian: Kita sesuaikan "Stok Awal Gudang" agar hasil akhirnya pas dengan fisik aktual
    p.stokAwalGudang = (parseFloat(p.stokAwalGudang) || 0) + selisih;

    // Simpan ke database
    if(db) {
        db.collection('cabang').doc(CABANG_AKTIF).collection('appData').doc('masterProduk').set({ list: masterProduk })
        .then(() => { 
            renderTabelMasterProduk(); 
            showToast("✅ Stok Berhasil Dikoreksi!");
        }); 
    } else { 
        renderTabelMasterProduk(); 
        showToast("✅ Stok Berhasil Dikoreksi (Lokal)!"); 
    }

    // Catat otomatis ke Riwayat Pergerakan Stok
    const jenisAksi = selisih > 0 ? 'In' : 'Out';
    const teksPerubahan = `${selisih > 0 ? '+' : ''}${selisih} Pcs (Koreksi Opname Fisik)`;
    
    if (typeof catatRiwayatStok === 'function') {
        catatRiwayatStok(p.nama, jenisAksi, Math.abs(selisih), stokFisikAktual);
    }
    catatAktivitas('Master Produk', `Koreksi stok fisik "${p.nama}" menjadi ${stokFisikAktual} Pcs`);
}
// ==========================================
// 5. FUNGSI RENDER RIWAYAT STOK (YANG SEMPAT HILANG)
// ==========================================
function renderTabelRiwayatStok() {
    const tbody = document.getElementById('tbodyRiwayatStok');
    if (!tbody) return;
    
    // 1. Munculkan Kotak Filter di atas Tabel secara otomatis
    let filterContainer = document.getElementById('containerFilterRiwayat');
    if (!filterContainer) {
        const tableEl = tbody.parentElement;
        filterContainer = document.createElement('div');
        filterContainer.id = 'containerFilterRiwayat';
        filterContainer.style.cssText = 'display:flex; gap:10px; margin-bottom:15px; flex-wrap:wrap; align-items:center; background:#f8fafc; padding:10px; border-radius:8px; border:1px solid #e2e8f0;';
        
        // PERBAIKAN: Menghapus auto-trigger dan menambahkan Tombol Cari warna biru
        filterContainer.innerHTML = `
            <strong style="color:#475569; font-size:0.85rem;">Filter:</strong>
            <input type="text" id="filterRiwayatNama" placeholder="🔍 Cari Nama Produk..." style="padding:8px; border-radius:6px; border:1px solid #cbd5e1; flex:1; min-width:150px;">
            <input type="date" id="filterRiwayatMulai" style="padding:8px; border-radius:6px; border:1px solid #cbd5e1;">
            <span style="color:#64748b; font-size:0.85rem;">s/d</span>
            <input type="date" id="filterRiwayatAkhir" style="padding:8px; border-radius:6px; border:1px solid #cbd5e1;">
            
            <button onclick="terapkanFilterRiwayat()" style="background:#0284c7; color:white; padding:8px 15px; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">🔍 Cari</button>
            <button onclick="resetFilterRiwayat()" style="background:#ef4444; color:white; padding:8px 15px; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">Reset</button>
        `;
        tableEl.parentNode.insertBefore(filterContainer, tableEl);
    }

    // 2. Lempar ke fungsi filter untuk menggambar isi tabelnya
    terapkanFilterRiwayat(); 
}

function terapkanFilterRiwayat() {
    const tbody = document.getElementById('tbodyRiwayatStok');
    if (!tbody) return;
    tbody.innerHTML = '';

    // Tarik kata kunci dari kotak pencarian
    const cariNama = (document.getElementById('filterRiwayatNama')?.value || '').toLowerCase();
    const tglMulai = document.getElementById('filterRiwayatMulai')?.value || '';
    const tglAkhir = document.getElementById('filterRiwayatAkhir')?.value || '';

    if (typeof riwayatStok === 'undefined' || !riwayatStok || riwayatStok.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#94a3b8; padding:12px;">Belum ada riwayat pergerakan stok.</td></tr>`;
        return;
    }

    // ==========================================
    // PROSES PENYARINGAN DATA (FILTER LOGIC)
    // ==========================================
    const dataFiltered = riwayatStok.filter(item => {
        let matchNama = true;
        let matchTanggal = true;

        if (cariNama) {
            matchNama = item.produk.toLowerCase().includes(cariNama);
        }
        
        // Pengecekan rentang tanggal (Hanya untuk data baru yang sudah punya tanggalIso)
        if (item.tanggalIso) {
            if (tglMulai && tglAkhir) {
                matchTanggal = (item.tanggalIso >= tglMulai && item.tanggalIso <= tglAkhir);
            } else if (tglMulai) {
                matchTanggal = (item.tanggalIso >= tglMulai);
            } else if (tglAkhir) {
                matchTanggal = (item.tanggalIso <= tglAkhir);
            }
        }

        return matchNama && matchTanggal;
    });

    if (dataFiltered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#ef4444; padding:15px; font-weight:bold;">Pencarian tidak ditemukan. Coba ganti tanggal atau nama produk.</td></tr>`;
        return;
    }

    // ==========================================
    // GAMBAR TABEL HASIL PENCARIAN
    // ==========================================
    dataFiltered.forEach((item, index) => {
        const isIn = item.aksi === 'In';
        const badgeStyle = isIn 
            ? 'background: #f0fdf4; color: #16a34a; padding: 2px 8px; border-radius: 4px; font-weight: bold;' 
            : 'background: #fef2f2; color: #dc2626; padding: 2px 8px; border-radius: 4px; font-weight: bold;';
        
        const warnaPerubahan = isIn ? 'color: #16a34a; font-weight: bold;' : 'color: #dc2626; font-weight: bold;';

        tbody.innerHTML += `
            <tr>
                <td style="text-align:center; color:#94a3b8; padding: 6px;">${index + 1}</td>
                <td style="padding: 6px;">${item.waktu}</td>
                <td style="padding: 6px;"><strong>${item.produk}</strong></td>
                <td style="text-align:center; padding: 6px;"><span style="${badgeStyle}">${item.aksi}</span></td>
                <td style="text-align:center; padding: 6px; ${warnaPerubahan}">${item.perubahan}</td>
                <td style="text-align:center; padding: 6px; font-weight:bold; color:#0284c7;">${item.sisa}</td>
                <td style="padding: 6px;">${item.oleh}</td>
            </tr>
        `;
    });
}

// Tombol sapu bersih kolom pencarian
function resetFilterRiwayat() {
    if(document.getElementById('filterRiwayatNama')) document.getElementById('filterRiwayatNama').value = '';
    if(document.getElementById('filterRiwayatMulai')) document.getElementById('filterRiwayatMulai').value = '';
    if(document.getElementById('filterRiwayatAkhir')) document.getElementById('filterRiwayatAkhir').value = '';
    terapkanFilterRiwayat();
}

// ==========================================
// 6. FUNGSI HAPUS PRODUK (YANG SEMPAT HILANG)
// ==========================================
function hapusProdukMaster(i) { 
    if(confirm("Hapus produk ini dari Master Produk?")) { 
        const namaProd = masterProduk[i]?.nama || 'Produk';
        masterProduk.splice(i, 1); 
        catatAktivitas('Master Produk', `Menghapus produk "${namaProd}" dari daftar Master Produk`);
        if(db) {
            db.collection('cabang').doc(CABANG_AKTIF).collection('appData').doc('masterProduk').set({ list: masterProduk })
            .then(() => {
                renderTabelMasterProduk();
            });
        } else {
            renderTabelMasterProduk(); 
        }
    } 
}

function hapusProduk(i) { if(isDataLocked(document.getElementById('tglOps').value)) return; if(confirm("Sembunyikan produk ini dari daftar hari ini?")) { const tgl = document.getElementById('tglOps').value; dbStok[tgl].splice(i,1); if(db) db.collection('cabang').doc(CABANG_AKTIF).collection('stokHarian').doc(tgl).set({items: dbStok[tgl]}); renderTabelMatriks(); updateKalkulasi(); } }

function bukaModalKas(jenis, tipe) { 
    document.getElementById('modalJenisKas').value = jenis; 
    document.getElementById('modalTipeTx').value = tipe; 
    document.getElementById('modalKasJudul').innerText = `⚡ Kas ${jenis}`; 
    document.getElementById('modalNominalTx').value = ""; 
    document.getElementById('modalKetTx').value = ""; 
    document.getElementById('modalKas').classList.add('active'); 
}

function tutupModalKas() { document.getElementById('modalKas').classList.remove('active'); }

function prosesTransaksiKas(e) { 
    e.preventDefault(); 
    if(!db) return; 
    db.collection('cabang').doc(CABANG_AKTIF).collection('logKas').add({ 
        tgl: document.getElementById('tglOps').value, 
        jenis: document.getElementById('modalJenisKas').value, 
        tipe: document.getElementById('modalTipeTx').value, 
        nominal: parseFloat(document.getElementById('modalNominalTx').value)||0, 
        ket: document.getElementById('modalKetTx').value 
    }).then(tutupModalKas); 
}

function bukaModalFeedback() { document.getElementById('modalFeedback').classList.add('active'); }
function tutupModalFeedback() { document.getElementById('modalFeedback').classList.remove('active'); document.getElementById('fbDeskripsi').value = ''; }
function kirimFeedback(e) { e.preventDefault(); if(!db) { alert("Sistem Offline. Tidak bisa mengirim laporan."); return; } const jenis = document.getElementById('fbJenis').value; const deskripsi = document.getElementById('fbDeskripsi').value; const btn = document.getElementById('btnKirimFeedback'); btn.innerText = "Mengirim..."; btn.disabled = true; db.collection('laporanBugs').add({ waktu: new Date().toISOString(), user: currentUser ? currentUser.nama : 'Unknown', hp: currentUser ? currentUser.hp : '-', jenis: jenis, deskripsi: deskripsi }).then(() => { showToast('✅ Laporan Terkirim! Terima kasih atas masukannya.'); tutupModalFeedback(); }).catch(err => { alert("Gagal mengirim: " + err.message); }).finally(() => { btn.innerText = "Kirim Laporan"; btn.disabled = false; }); }

// ==========================================
// FITUR FILTER GRAFIK RESELLER
// ==========================================
window.produkResellerDisembunyikan = window.produkResellerDisembunyikan || []; 

function bukaFilterReseller() {
    document.getElementById('modalFilterReseller').style.display = 'flex';
    const container = document.getElementById('listCheckboxReseller');
    if(!container) return;
    container.innerHTML = '';

    if(!window.listProdukResellerAktif || window.listProdukResellerAktif.length === 0) {
        container.innerHTML = '<div style="font-size:0.8rem; color:#64748b;">Tidak ada data reseller di periode ini.</div>';
        return;
    }

    window.listProdukResellerAktif.forEach(nama => {
        const isDisembunyikan = window.produkResellerDisembunyikan.includes(nama);
        const isChecked = isDisembunyikan ? '' : 'checked'; 

        container.innerHTML += `
            <label style="display:flex; align-items:center; gap:8px; padding:8px 0; border-bottom:1px solid #f1f5f9; cursor:pointer; font-size:0.85rem; color:#334155;">
                <input type="checkbox" class="cb-reseller-item" data-nama="${nama.replace(/"/g, '&quot;')}" ${isChecked} style="width:16px; height:16px;">
                ${nama}
            </label>
        `;
    });
}

function tutupFilterReseller() {
    document.getElementById('modalFilterReseller').style.display = 'none';
}

function terapkanFilterReseller() {
    window.produkResellerDisembunyikan = []; 
    const container = document.getElementById('listCheckboxReseller');
    if(!container) return;
    const checkboxes = container.querySelectorAll('.cb-reseller-item');
    
    checkboxes.forEach(cb => {
        if(!cb.checked) {
            window.produkResellerDisembunyikan.push(cb.getAttribute('data-nama')); 
        }
    });
    
    tutupFilterReseller();
    renderDashboardGrafik(); 
}

// ==========================================
// FUNGSI DASHBOARD GRAFIK CHART.JS
// ==========================================
function renderDashboardGrafik() {
    const isDapur = currentUser && currentUser.role === 'dapur';
    if (isDapur) { 
        document.querySelectorAll('.summary-box').forEach(box => { 
            const text = box.innerText.toUpperCase(); 
            if (text.includes('BEBAN & PENGELUARAN') || text.includes('PROFIT BERSIH') || text.includes('RANKING RESELLER') || text.includes('TOP 5 RESELLER') || text.includes('TREN OMSET')) { 
                box.style.display = 'none'; 
            } 
        }); 
    } else { 
        document.querySelectorAll('.summary-box').forEach(box => { box.style.display = 'block'; }); 
    }

    const allDates = Object.keys(dbStok).filter(tgl => tgl.match(/^\d{4}-\d{2}-\d{2}$/)).sort(); 
    const periodeEl = document.getElementById('filterDashboardPeriode');
    const periode = periodeEl ? periodeEl.value : '7';
    let targetDates = [];

    if (periode === '7') { targetDates = allDates.slice(-7); } 
    else if (periode === '30') { targetDates = allDates.slice(-30); } 
    else if (periode === 'bulan_ini') {
        const today = new Date();
        const y = today.getFullYear();
        const m = String(today.getMonth() + 1).padStart(2, '0');
        targetDates = allDates.filter(d => d.startsWith(`${y}-${m}`));
    } 
    else if (periode === 'bulan_lalu') {
        const today = new Date();
        let y = today.getFullYear(); let m = today.getMonth(); 
        if (m === 0) { y--; m = 12; }
        targetDates = allDates.filter(d => d.startsWith(`${y}-${String(m).padStart(2, '0')}`));
    } 
    else { targetDates = allDates; }

    const setTxt = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
    if(targetDates.length === 0) {
        setTxt('dashTotalOmset', "Rp 0");
        setTxt('dashOmsetBakso', "Rp 0");
        setTxt('dashOmsetReseller', "Rp 0");
        setTxt('dashTotalProfit', "Rp 0");
        setTxt('dashTotalBeban', "Rp 0");
        setTxt('dashBebanGaji', "Rp 0");
        setTxt('dashBebanDapur', "Rp 0");
        setTxt('dashBebanLaci', "Rp 0");
        if(chartTren) chartTren.destroy();
        if(chartTopBakso) chartTopBakso.destroy();
        if(chartTopReseller) chartTopReseller.destroy();
        return;
    }

    let totalOmsetBakso = 0, totalOmsetReseller = 0, totalProfit = 0; 
    let totalGaji = 0, totalDapur = 0, totalLaci = 0; 
    let labelsTren = [], dataBakso = [], dataReseller = [], dataProfitLine = []; 
    let produkBakso = {}, produkReseller = {};

    targetDates.forEach(tgl => { 
        labelsTren.push(tgl.slice(-2) + '/' + tgl.slice(5,7)); 
        let harianOmsetBakso = 0, harianOmsetReseller = 0, harianProfitKotor = 0; 
        let items = dbStok[tgl] || []; 
        items.forEach(p => { 
            const awal = parseFloat(p.awal) || 0; 
            const tambah = parseFloat(p.tambah) || 0; 
            const kurang = parseFloat(p.kurang) || 0; 
            const totalStok = awal + tambah - kurang; 
            const sisa = (p.sisa !== "" && p.sisa !== null) ? parseFloat(p.sisa) : null; 
            if(sisa !== null && sisa <= totalStok) { 
                const laku = totalStok - sisa; 
                const omset = laku * p.jual; 
                const profit = laku * p.margin; 
                harianProfitKotor += profit; 
                if(p.kategori === 'Bakso Malang') { 
                    harianOmsetBakso += omset; 
                    if(laku > 0) produkBakso[p.nama] = (produkBakso[p.nama] || 0) + laku; 
                } else { 
                    harianOmsetReseller += omset; 
                    if(laku > 0) produkReseller[p.nama] = (produkReseller[p.nama] || 0) + laku; 
                } 
            } 
        }); 
        const dGaji = (dbGajiHarian[tgl] || {nominal:0}).nominal; 
        const dLaci = dbPengeluaranHarian.filter(p => p.tgl === tgl).reduce((acc, curr) => acc + curr.nominal, 0); 
        const dDapur = (dbSetoranDapur[tgl] || {pengeluaran:0}).pengeluaran || 0; 
        const profitBersih = Math.max(0, harianProfitKotor - dGaji - dLaci); 

        totalOmsetBakso += harianOmsetBakso; totalOmsetReseller += harianOmsetReseller; 
        totalProfit += profitBersih; totalGaji += dGaji; totalDapur += dDapur; totalLaci += dLaci; 

        dataBakso.push(harianOmsetBakso); dataReseller.push(harianOmsetReseller); dataProfitLine.push(profitBersih); 
    });

    setTxt('dashTotalOmset', formatRupiah(totalOmsetBakso + totalOmsetReseller)); 
    setTxt('dashOmsetBakso', formatRupiah(totalOmsetBakso)); 
    setTxt('dashOmsetReseller', formatRupiah(totalOmsetReseller)); 
    setTxt('dashTotalProfit', formatRupiah(totalProfit)); 
    setTxt('dashTotalBeban', formatRupiah(totalGaji + totalDapur + totalLaci)); 
    setTxt('dashBebanGaji', formatRupiah(totalGaji)); 
    setTxt('dashBebanDapur', formatRupiah(totalDapur)); 
    setTxt('dashBebanLaci', formatRupiah(totalLaci));

    if (typeof ChartDataLabels !== 'undefined') Chart.register(ChartDataLabels); 
    const formatSingkatan = function(value) { 
        if (value === 0 || !value) return ''; 
        if (value >= 1000000) { let j = value / 1000000; return (j % 1 === 0 ? j : j.toFixed(1).replace('.', ',')) + ' Jt'; } 
        else if (value >= 1000) { let rb = value / 1000; return (rb % 1 === 0 ? rb : rb.toFixed(1).replace('.', ',')) + ' Rb'; } 
        return value.toString(); 
    };

    if(chartTren) chartTren.destroy(); 
    const trenEl = document.getElementById('chartTren');
    if (trenEl) {
        const ctxTren = trenEl.getContext('2d'); 
        chartTren = new Chart(ctxTren, { 
            type: 'bar', 
            data: { labels: labelsTren, datasets: [ { type: 'line', label: 'Profit Bersih', data: dataProfitLine, borderColor: '#16a34a', backgroundColor: '#16a34a', borderWidth: 2.5, tension: 0.3, pointRadius: 4, datalabels: { align: 'top', anchor: 'end', color: '#15803d', font: { weight: 'bold', size: 10 }, formatter: formatSingkatan } }, { type: 'bar', label: 'Omset Reseller', data: dataReseller, backgroundColor: '#3b82f6', datalabels: { color: '#ffffff', font: { weight: 'bold', size: 9 }, formatter: formatSingkatan } }, { type: 'bar', label: 'Omset Bakso', data: dataBakso, backgroundColor: '#ea580c', datalabels: { color: '#ffffff', font: { weight: 'bold', size: 9 }, formatter: formatSingkatan } } ] }, 
            options: { responsive: true, maintainAspectRatio: false, layout: { padding: { top: 20 } }, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: {size: 10} } }, datalabels: { display: true } }, scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, beginAtZero: true, display: false } } } 
        });
    }

   const sortSliceTop5 = (dict) => Object.keys(dict).map(k => ({nama: k, qty: dict[k]})).sort((a,b) => b.qty - a.qty).slice(0, 5); 
    const topBakso = sortSliceTop5(produkBakso); 

    window.listProdukResellerAktif = Object.keys(produkReseller).sort(); 
    let resellerDifilter = Object.keys(produkReseller)
        .filter(nama => !(window.produkResellerDisembunyikan || []).includes(nama))
        .map(nama => ({nama: nama, qty: produkReseller[nama]}))
        .sort((a,b) => b.qty - a.qty)
        .slice(0, 10); // KODE BARU: Membatasi maksimal TOP 10 Reseller

    const optHorizontalBar = { 
        indexAxis: 'y', 
        responsive: true, 
        maintainAspectRatio: false, 
        layout: { padding: { right: 45 } }, // KODE BARU: Jarak kanan dilebarkan agar teks tidak terpotong
        plugins: { 
            legend: { display: false }, 
            datalabels: { 
                align: 'right', 
                anchor: 'end', 
                color: '#334155', 
                font: { weight: 'bold', size: 9 }, 
                formatter: (val) => val + ' pcs' 
            } 
        }, 
        scales: { 
            x: { 
                beginAtZero: true, 
                display: false,
                grace: '15%' // KODE BARU: Memberi ruang napas di ujung grafik
            }, 
            y: { 
                grid: { display: false }, 
                ticks: { autoSkip: false, font: { size: 9 } } 
            } 
        } 
    };

    if(chartTopBakso) chartTopBakso.destroy(); 
    const baksoEl = document.getElementById('chartTopBakso');
    if (baksoEl) {
        const ctxBakso = baksoEl.getContext('2d'); 
        chartTopBakso = new Chart(ctxBakso, { type: 'bar', data: { labels: topBakso.map(x => x.nama), datasets: [{ data: topBakso.map(x => x.qty), backgroundColor: '#fdba74', borderRadius: 3, maxBarThickness: 15 }] }, options: optHorizontalBar });
    }

    if(chartTopReseller) chartTopReseller.destroy(); 
    const oldCanvasReseller = document.getElementById('chartTopReseller');
    if (oldCanvasReseller) {
        const parentReseller = oldCanvasReseller.parentNode;
        oldCanvasReseller.remove();
        
        const newCanvasReseller = document.createElement('canvas');
        newCanvasReseller.id = 'chartTopReseller';
        const tinggiDibutuhkan = Math.max(150, resellerDifilter.length * 25); 
        newCanvasReseller.style.height = tinggiDibutuhkan + 'px';
        parentReseller.appendChild(newCanvasReseller);

        const ctxReseller = newCanvasReseller.getContext('2d'); 
        chartTopReseller = new Chart(ctxReseller, { 
            type: 'bar', 
            data: { labels: resellerDifilter.map(x => x.nama), datasets: [{ data: resellerDifilter.map(x => x.qty), backgroundColor: '#93c5fd', borderRadius: 3, maxBarThickness: 15 }] }, 
            options: optHorizontalBar 
        }); 
    }
}

// ==========================================
// FUNGSI CETAK PDF
// ==========================================
function bukaModalCetakPeriode(jenis) { toggleSidebar(); document.getElementById('jenisCetakPeriode').value = jenis; if(jenis === 'mingguan') { document.getElementById('modalCetakJudul').innerText = "📊 Cetak Rekap Mingguan"; document.getElementById('formCetakMingguan').style.display = 'block'; document.getElementById('formCetakBulanan').style.display = 'none'; } else { document.getElementById('modalCetakJudul').innerText = "📈 Cetak Rekap Bulanan"; document.getElementById('formCetakMingguan').style.display = 'none'; document.getElementById('formCetakBulanan').style.display = 'block'; } document.getElementById('modalCetakPeriode').classList.add('active'); }
function tutupModalCetakPeriode() { document.getElementById('modalCetakPeriode').classList.remove('active'); }
function bukaModalGabungan() {
    if (typeof toggleSidebar === 'function') toggleSidebar(); 
    document.getElementById('modalCetakPeriode').classList.add('active');
    gantiTampilanModalLaporan(); 
}

function gantiTampilanModalLaporan() {
    const jenis = document.getElementById('jenisCetakPeriode').value;
    if(jenis === 'mingguan') {
        document.getElementById('formCetakMingguan').style.display = 'block';
        document.getElementById('formCetakBulanan').style.display = 'none';
    } else {
        document.getElementById('formCetakMingguan').style.display = 'none';
        document.getElementById('formCetakBulanan').style.display = 'block';
    }
}

function eksekusiCetakPeriode() { 
    if (typeof html2pdf === 'undefined') return; 
    tutupModalCetakPeriode(); 

    const jenis = document.getElementById('jenisCetakPeriode').value; 
    let validKeys = []; 
    let judulKet = ""; 

    if (jenis === 'mingguan') { 
        const start = document.getElementById('cetakTglAwal').value; 
        const end = document.getElementById('cetakTglAkhir').value; 
        if(!start || !end) return; 
        Object.keys(dbStok).forEach(tgl => { 
            if(tgl >= start && tgl <= end) validKeys.push(tgl); 
        }); 
        judulKet = `Periode: ${start} s/d ${end}`; 
    } else { 
        const bln = document.getElementById('cetakBulan').value; 
        if(!bln) return; 
        Object.keys(dbStok).forEach(tgl => { 
            if(tgl.startsWith(bln)) validKeys.push(tgl); 
        }); 
        judulKet = `Periode: Bulan ${bln}`; 
    } 

    let omsetBakso = 0, omsetReseller = 0, modalTotal = 0, profitKotorTotal = 0, pengeluaranTotal = 0, gajiTotal = 0, pengeluaranHarianSaja = 0; 
    let rekapProduk = masterProduk.map(p => ({ ...p, totalTerjual: 0, totalOmset: 0, totalProfit: 0 })); 

    validKeys.forEach(tgl => { 
        dbStok[tgl].forEach((p, idx) => { 
            const awal = parseFloat(p.awal) || 0; 
            const tambah = parseFloat(p.tambah) || 0; 
            const kurang = parseFloat(p.kurang) || 0; 
            const totalStok = awal + tambah - kurang; 
            const sisa = (p.sisa !== "" && p.sisa !== null) ? parseFloat(p.sisa) : null; 
            if (sisa !== null && sisa <= totalStok) { 
                const terjual = totalStok - sisa; 
                if(rekapProduk[idx]) { 
                    rekapProduk[idx].totalTerjual += terjual; 
                    rekapProduk[idx].totalOmset += (terjual * p.jual); 
                    rekapProduk[idx].totalProfit += (terjual * p.margin); 
                } 
                modalTotal += (terjual * p.modal); 
                profitKotorTotal += (terjual * p.margin); 
                if (p.kategori === 'Bakso Malang') omsetBakso += (terjual * p.jual); 
                else omsetReseller += (terjual * p.jual); 
            } 
        }); 
        dbPengeluaranHarian.forEach(p => { 
            if (p.tgl === tgl) pengeluaranHarianSaja += p.nominal; 
        }); 
        const dataSetoran = dbSetoranDapur[tgl] || { pengeluaran: 0 }; 
        pengeluaranTotal += (dataSetoran.pengeluaran || 0); 
        gajiTotal += (dbGajiHarian[tgl]?.nominal || 0); 
    }); 

    const profitBersihTotal = profitKotorTotal - gajiTotal - pengeluaranHarianSaja; 
    const basisAlokasiPdf = Math.max(0, profitBersihTotal); 

    const setTxt = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
    setTxt('pdfJudulPeriode', jenis === 'mingguan' ? 'LAPORAN MINGGUAN' : 'LAPORAN BULANAN'); 
    setTxt('pdfTglPeriode', judulKet); 
    setTxt('pdfOmsetBakso', formatRupiah(omsetBakso)); 
    setTxt('pdfOmsetReseller', formatRupiah(omsetReseller)); 
    setTxt('pdfTotalOmset', formatRupiah(omsetBakso + omsetReseller)); 
    setTxt('pdfTotalModal', formatRupiah(modalTotal)); 
    setTxt('pdfTotalPengeluaran', formatRupiah(pengeluaranTotal + pengeluaranHarianSaja)); 
    setTxt('pdfTotalProfitKotor', formatRupiah(profitKotorTotal)); 
    setTxt('pdfTotalGaji', formatRupiah(gajiTotal)); 
    setTxt('pdfTotalPengeluaranHarian', formatRupiah(pengeluaranHarianSaja)); 
    setTxt('pdfTotalProfitBersih', formatRupiah(profitBersihTotal)); 
    setTxt('pdfAllocDarurat', formatRupiah(basisAlokasiPdf * 0.20)); 
    setTxt('pdfAllocAnak', formatRupiah(basisAlokasiPdf * 0.40)); 
    setTxt('pdfAllocLabaBersih', formatRupiah(basisAlokasiPdf * 0.40)); 

    const pdfTbody = document.getElementById('pdfTbodyProdukPeriode'); 
    if(pdfTbody) {
        pdfTbody.innerHTML = ''; 
        rekapProduk.filter(p => p.totalTerjual > 0).forEach(p => { 
            pdfTbody.innerHTML += `<tr><td>${p.kategori}</td><td><strong>${p.nama}</strong></td><td style="text-align:center;">${p.totalTerjual}</td><td style="text-align:right;">${formatRupiah(p.totalOmset)}</td><td style="text-align:right;">${formatRupiah(p.totalProfit)}</td></tr>`; 
        }); 
    }

    const element = document.getElementById('pdfAreaPeriode'); 
    if(!element) return;
    element.style.display = 'block'; 

    html2pdf().set({ 
        margin: 5, 
        filename: `Rekap_${jenis}.pdf`, 
        html2canvas: { scale: 2 }, 
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } 
    }).from(element).output('blob').then(function(pdfBlob) { 
        element.style.display = 'none'; 

        const namaFile = `Rekap_${jenis}.pdf`;
        const filePdf = new File([pdfBlob], namaFile, { type: 'application/pdf' });
        const labelJenis = jenis === 'mingguan' ? 'Mingguan' : 'Bulanan';

        if (navigator.canShare && navigator.canShare({ files: [filePdf] })) {
            navigator.share({
                files: [filePdf],
                title: `Laporan ${labelJenis}`,
                text: `Berikut terlampir dokumen Laporan ${labelJenis} (${judulKet}).`
            }).catch(console.error);
        } else {
            const urlObj = URL.createObjectURL(pdfBlob);
            const link = document.createElement('a'); link.href = urlObj; link.download = namaFile; link.click(); URL.revokeObjectURL(urlObj);
        }
    });
}

function generatePDFHarian() { 
    if (typeof html2pdf === 'undefined') return; 

    const tgl = document.getElementById('tglOps').value; 
    const isOwner = currentUser && currentUser.role === 'owner'; 

    document.getElementById('pdfHrTitleProfit').style.display = isOwner ? 'block' : 'none'; 
    document.getElementById('pdfHrBoxProfit').style.display = isOwner ? 'block' : 'none'; 

    const pdfTHead = document.getElementById('pdfTHeadHarianBarang'); 
    pdfTHead.innerHTML = `<tr><th>Produk</th><th style="text-align:center;">Laku</th><th style="text-align:right;">Omset</th>${isOwner ? '<th style="text-align:right;">Profit</th>' : ''}</tr>`; 

    const kas = dbKasMasuk[tgl] || { cash: 0, qris: 0, gojek: 0, grab: 0, shopee: 0, petty: 0 }; 
    const totalMasuk = (kas.cash||0)+(kas.qris||0)+(kas.gojek||0)+(kas.grab||0)+(kas.shopee||0)+(kas.petty||0); 

    let totalKeluar = 0, txtKeluar = ""; 
    dbPengeluaranHarian.filter(p => p.tgl === tgl).forEach(p => { 
        totalKeluar += p.nominal; 
        txtKeluar += `<div class="pdf-row"><span>${p.ket}</span><span>${formatRupiah(p.nominal)}</span></div>`; 
    }); 

    const dataSetoran = dbSetoranDapur[tgl] || { cash: 0, ket: '', pengeluaran: 0 }; 
    if(dataSetoran.pengeluaran > 0) { 
        totalKeluar += dataSetoran.pengeluaran; 
        txtKeluar += `<div class="pdf-row"><span>${dataSetoran.ket || 'Keluar Dapur'} (Dapur)</span><span>${formatRupiah(dataSetoran.pengeluaran)}</span></div>`; 
    } 

    const setTxt = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
    setTxt('pdfHariTgl', `Tanggal: ${tgl}`); 
    setTxt('pdfHrCash', formatRupiah(kas.cash)); 
    setTxt('pdfHrQris', formatRupiah(kas.qris)); 
    setTxt('pdfHrGojek', formatRupiah(kas.gojek)); 
    setTxt('pdfHrGrab', formatRupiah(kas.grab)); 
    setTxt('pdfHrShopee', formatRupiah(kas.shopee)); 
    setTxt('pdfHrPetty', formatRupiah(kas.petty)); 
    setTxt('pdfHrTotalMasuk', formatRupiah(totalMasuk)); 
    const elListKeluar = document.getElementById('pdfHrListPengeluaran');
    if(elListKeluar) elListKeluar.innerHTML = txtKeluar || "<small>Tidak ada pengeluaran harian</small>"; 
    setTxt('pdfHrTotalKeluar', formatRupiah(totalKeluar)); 

    let profitKotor = 0; 
    const pdfTbody = document.getElementById('pdfTbodyHarianBarang'); 
    pdfTbody.innerHTML = ''; 
    (dbStok[tgl] || []).forEach(p => { 
        const awal = parseFloat(p.awal) || 0; 
        const tambah = parseFloat(p.tambah) || 0; 
        const kurang = parseFloat(p.kurang) || 0; 
        const totalStok = awal + tambah - kurang; 
        const sisa = (p.sisa !== "" && p.sisa !== null) ? parseFloat(p.sisa) : null; 
        if (sisa !== null && sisa <= totalStok) { 
            const laku = totalStok - sisa; 
            if(laku > 0) { 
                const o = laku * p.jual; 
                const pr = laku * p.margin; 
                profitKotor += pr; 
                pdfTbody.innerHTML += `<tr><td><strong>${p.nama}</strong><br><small style="color:#64748b;">${p.kategori}</small></td><td style="text-align:center;">${laku}</td><td style="text-align:right;">${formatRupiah(o)}</td>${isOwner ? `<td style="text-align:right;">${formatRupiah(pr)}</td>` : ''}</tr>`; 
            } 
        } 
    }); 

    const pengeluaranHarianSaja = dbPengeluaranHarian.filter(p => p.tgl === tgl).reduce((acc, curr) => acc + curr.nominal, 0); 
    const gaji = (dbGajiHarian[tgl] || {nominal: 0}).nominal; 
    const profitBersih = profitKotor - gaji - pengeluaranHarianSaja; 
    const basis = Math.max(0, profitBersih); 

    setTxt('pdfHrKotor', formatRupiah(profitKotor)); 
    setTxt('pdfHrGaji', formatRupiah(gaji)); 
    setTxt('pdfHrPengeluaranHarian', formatRupiah(pengeluaranHarianSaja)); 
    setTxt('pdfHrBersih', formatRupiah(profitBersih)); 
    setTxt('pdfHrDarurat', formatRupiah(basis * 0.20)); 
    setTxt('pdfHrAnak', formatRupiah(basis * 0.40)); 
    setTxt('pdfHrLaba', formatRupiah(basis * 0.40)); 

    let namaKasirInput = document.getElementById('inputNamaKasirHarian');
    let namaKasir = namaKasirInput ? namaKasirInput.value : '';
    if (!namaKasir || namaKasir.trim() === "") {
        namaKasir = (typeof currentUser !== 'undefined' && currentUser && currentUser.role) ? currentUser.role : "Admin";
        if(namaKasirInput) namaKasirInput.value = namaKasir;
    }

    setTxt('pdfNamaPembuatHarianCetak', namaKasir);
    const hariIni = new Date();
    const formatTanggal = hariIni.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    setTxt('pdfTanggalCetakHarian', formatTanggal);

    const element = document.getElementById('pdfAreaHarian'); 
    if(!element) return;
    element.style.display = 'block'; 

    html2pdf().set({ 
        margin: 5, 
        filename: `Kasir_Harian_${tgl}.pdf`, 
        html2canvas: { scale: 2 }, 
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] } 
    }).from(element).save().then(() => { 
        element.style.display = 'none'; 
    }); 
}

function generatePDFBaksoHarian() { 
    if (typeof html2pdf === 'undefined') return; 

    const tgl = document.getElementById('tglOps').value; 
    const items = dbStok[tgl] || []; 
    let no = 1; 
    let sumAwal = 0, sumTambah = 0, sumKurang = 0, sumTotalStok = 0, sumLaku = 0, sumSisa = 0, sumSetoran = 0, sumProfit = 0; 

    const tbody = document.getElementById('pdfTbodyBaksoHarian'); 
    if(!tbody) return;
    tbody.innerHTML = ''; 

    items.filter(p => p.kategori === 'Bakso Malang').forEach(p => { 
        const awal = parseFloat(p.awal) || 0; 
        const tambah = parseFloat(p.tambah) || 0; 
        const kurang = parseFloat(p.kurang) || 0; 
        const totalStok = awal + tambah - kurang; 
        const sisa = (p.sisa !== "" && p.sisa !== null) ? parseFloat(p.sisa) : null; 
        const terjual = (sisa !== null && sisa <= totalStok) ? (totalStok - sisa) : 0; 
        const valSisa = sisa !== null ? sisa : 0; 

        if (totalStok > 0 || terjual > 0) { 
            const modalTotalItem = terjual * p.modal; 
            const profitTotalItem = terjual * p.margin; 
            sumAwal += awal; sumTambah += tambah; sumKurang += kurang; sumTotalStok += totalStok; sumLaku += terjual; sumSisa += valSisa; sumSetoran += modalTotalItem; sumProfit += profitTotalItem; 

            tbody.innerHTML += `<tr><td style="text-align:center;">${no++}</td><td><strong>${p.nama}</strong></td><td style="text-align:center;">${awal}</td><td style="text-align:center; color:#166534;">${tambah > 0 ? tambah : '-'}</td><td style="text-align:center; color:#991b1b;">${kurang > 0 ? kurang : '-'}</td><td style="text-align:center; font-weight:bold;">${totalStok}</td><td style="text-align:center; font-weight:bold; color:#0f172a;">${terjual}</td><td style="text-align:center; color:#dc2626; font-weight:bold;">${valSisa}</td><td style="text-align:right;">${formatRupiah(p.modal)}</td><td style="text-align:right; font-weight:bold; color:#d97706;">${formatRupiah(modalTotalItem)}</td><td style="text-align:right; font-weight:bold; color:#16a34a;">${formatRupiah(profitTotalItem)}</td></tr>`; 
        } 
    }); 

    if (sumTotalStok === 0 && sumLaku === 0) { 
        alert("Belum ada data stok awal atau terjual untuk dicetak."); 
        return; 
    } 

    tbody.innerHTML += `<tr style="background:#fed7aa; font-weight:800; font-size:0.9rem; border-top: 2px solid #ea580c;"><td colspan="2" style="text-align:center;">TOTAL QTY</td><td style="text-align:center;">${sumAwal}</td><td style="text-align:center; color:#166534;">${sumTambah}</td><td style="text-align:center; color:#991b1b;">${sumKurang}</td><td style="text-align:center; color:#0f172a;">${sumTotalStok}</td><td style="text-align:center; color:#0f172a;">${sumLaku}</td><td style="text-align:center; color:#b91c1c;">${sumSisa}</td><td></td><td style="text-align:right; color:#b45309;">${formatRupiah(sumSetoran)}</td><td style="text-align:right; color:#15803d;">${formatRupiah(sumProfit)}</td></tr>`; 

    const dataSetoran = dbSetoranDapur[tgl] || { cash: 0, ket: '-', pengeluaran: 0 }; 
    const setTxt = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
    setTxt('pdfBaksoTgl', `Tanggal Setoran: ${tgl}`); 
    setTxt('pdfBaksoModal', formatRupiah(sumSetoran)); 
    setTxt('pdfBaksoCash', formatRupiah(dataSetoran.cash)); 
    setTxt('pdfBaksoKetKeluar', dataSetoran.ket || '-'); 
    setTxt('pdfBaksoKeluar', formatRupiah(dataSetoran.pengeluaran)); 
    setTxt('pdfBaksoTF', formatRupiah(Math.max(0, sumSetoran - dataSetoran.cash - dataSetoran.pengeluaran))); 
    setTxt('pdfBaksoTotalSetor', formatRupiah(Math.max(0, sumSetoran - dataSetoran.pengeluaran))); 

    let namaKasirInput = document.getElementById('inputNamaKasirBakso');
    let namaKasir = namaKasirInput ? namaKasirInput.value : '';
    if (!namaKasir || namaKasir.trim() === "") {
        namaKasir = (typeof currentUser !== 'undefined' && currentUser && currentUser.role) ? currentUser.role : "Admin";
        if(namaKasirInput) namaKasirInput.value = namaKasir;
    }
    setTxt('pdfNamaPembuatBaksoCetak', namaKasir);

    const hariIni = new Date();
    const formatTanggal = hariIni.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    setTxt('pdfTanggalCetakBakso', formatTanggal);

    const element = document.getElementById('pdfAreaBakso'); 
    if(!element) return;
    element.style.display = 'block'; 

    html2pdf().set({ 
        margin: 5, 
        filename: `Setoran_Bakso_${tgl}.pdf`, 
        html2canvas: { scale: 2 }, 
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] } 
    }).from(element).output('blob').then(function(pdfBlob) { 
        element.style.display = 'none';

        const namaFile = `Setoran_Bakso_${tgl}.pdf`;
        const filePdf = new File([pdfBlob], namaFile, { type: 'application/pdf' });

        if (navigator.canShare && navigator.canShare({ files: [filePdf] })) {
            navigator.share({
                files: [filePdf],
                title: 'Laporan Setoran',
                text: `Berikut Laporan Setoran Bakso Malang tanggal ${tgl}.`
            }).catch((error) => { console.error('Batal membagikan:', error); });
        } else {
            const urlObj = URL.createObjectURL(pdfBlob);
            const link = document.createElement('a'); link.href = urlObj; link.download = namaFile; link.click(); URL.revokeObjectURL(urlObj);
        }
    });
}

function generatePDFTransfer() { 
    if (typeof html2pdf === 'undefined') return; 

    const tgl = document.getElementById('tglOps').value;
    const setTxt = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
    setTxt('pdfStrukTgl', 'Tanggal: ' + tgl); 
    setTxt('stTfBakso', document.getElementById('rtTfBakso').innerText); 
    setTxt('stKasReseller', document.getElementById('rtKasReseller').innerText); 
    setTxt('stKasPlastik', document.getElementById('rtKasPlastik').innerText); 
    setTxt('stDarurat', document.getElementById('rtKasDarurat').innerText); 
    setTxt('stLaba', document.getElementById('rtKasLaba').innerText); 
    setTxt('stAnak', document.getElementById('rtKasAnak').innerText); 
    setTxt('stTotalA', document.getElementById('rtTotalA').innerText); 
    setTxt('stQris', document.getElementById('rtQris').innerText); 
    setTxt('stGojek', document.getElementById('rtGojek').innerText); 
    setTxt('stGrab', document.getElementById('rtGrab').innerText); 
    setTxt('stShopee', document.getElementById('rtShopee').innerText); 
    setTxt('stModalBesok', document.getElementById('rtModalBesok').innerText); 
    setTxt('stTotalB', document.getElementById('rtTotalB').innerText); 

    const valStruk = document.getElementById('rtFinalValue').innerText; 
    setTxt('stFinalValue', valStruk); 
    const boxStatus = document.getElementById('boxStatusSetor'); 

    if (boxStatus) {
        if (valStruk.includes('+')) { 
            setTxt('stFinalKet', "SURPLUS DIGITAL (TIDAK SETOR FISIK)"); 
            document.getElementById('stFinalValue').style.color = "#1d4ed8"; 
            boxStatus.style.borderColor = "#93c5fd"; 
            boxStatus.style.background = "#eff6ff"; 
        } else if (valStruk === "Rp 0") { 
            setTxt('stFinalKet', "PAS (TIDAK SETOR FISIK)"); 
            document.getElementById('stFinalValue').style.color = "#15803d"; 
            boxStatus.style.borderColor = "#86efac"; 
            boxStatus.style.background = "#f0fdf4"; 
        } else { 
            setTxt('stFinalKet', "WAJIB SETOR TUNAI KE BANK"); 
            document.getElementById('stFinalValue').style.color = "#be123c"; 
            boxStatus.style.borderColor = "#fda4af"; 
            boxStatus.style.background = "#fff1f2"; 
        } 
    }

    const element = document.getElementById('pdfAreaTransfer'); 
    if(!element) return;
    element.style.display = 'block'; 

    html2pdf().set({ 
        margin: 5, 
        filename: `Laporan_Transfer_${tgl}.pdf`, 
        html2canvas: { scale: 2 }, 
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } 
    }).output('blob').then(function(pdfBlob) { 
        element.style.display = 'none'; 

        const namaFile = `Laporan_Transfer_${tgl}.pdf`;
        const filePdf = new File([pdfBlob], namaFile, { type: 'application/pdf' });

        if (navigator.canShare && navigator.canShare({ files: [filePdf] })) {
            navigator.share({
                files: [filePdf],
                title: 'Laporan Rekap Transfer',
                text: `Berikut Laporan Rekap Transfer tanggal ${tgl}.`
            }).catch(console.error);
        } else {
            const urlObj = URL.createObjectURL(pdfBlob);
            const link = document.createElement('a'); link.href = urlObj; link.download = namaFile; link.click(); URL.revokeObjectURL(urlObj);
        }
    });
}

function generatePDFSlipGaji() { 
    if (typeof html2pdf === 'undefined') return; 

    const bln = document.getElementById('filterBulanGaji').value; 
    if(!bln) { alert("Pilih bulan terlebih dahulu!"); return; } 

    const today = new Date(); 
    const options = { day: 'numeric', month: 'long', year: 'numeric' }; 
    const tglCetak = today.toLocaleDateString('id-ID', options); 

    const setTxt = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
    setTxt('pdfSgBulan', `Periode: Bulan ${bln}`); 
    setTxt('pdfSgHadir', document.getElementById('gbHariKerja').innerText); 
    setTxt('pdfSgLibur', document.getElementById('gbHariLibur').innerText); 
    setTxt('pdfSgUangLaci', document.getElementById('gbUangHarianUtama').innerText); 
    setTxt('pdfSgPotongan', document.getElementById('gbPotonganLibur').innerText); 
    setTxt('pdfSgTotalTF', document.getElementById('gbGajiUtamaTF').innerText); 
    setTxt('pdfSgTglCetak', tglCetak); 

    const element = document.getElementById('pdfAreaSlipGaji'); 
    if(!element) return;
    
    // 1. Munculkan area tersembunyi HANYA untuk difoto oleh sistem
    element.style.display = 'block'; 

    html2pdf().set({ 
        margin: 15, 
        filename: `Slip_Gaji_${bln}.pdf`, 
        image: { type: 'jpeg', quality: 0.98 }, 
        html2canvas: { scale: 2 }, 
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }, 
        pagebreak: { mode: 'avoid-all' } 
    })
    .from(element) // <--- INI BIANG KEROKNYA KEMARIN HILANG! (Titik target cetaknya)
    .output('blob')
    .then(function(pdfBlob) { 
        // 2. Setelah berhasil difoto, segera SEMBUNYIKAN lagi agar tidak bocor
        element.style.display = 'none'; 

        const namaFile = `Slip_Gaji_${bln}.pdf`;
        const filePdf = new File([pdfBlob], namaFile, { type: 'application/pdf' });

        if (navigator.canShare && navigator.canShare({ files: [filePdf] })) {
            navigator.share({
                files: [filePdf],
                title: 'Slip Gaji Karyawan',
                text: `Berikut terlampir Slip Gaji untuk periode bulan ${bln}.`
            }).catch(console.error);
        } else {
            const urlObj = URL.createObjectURL(pdfBlob);
            const link = document.createElement('a'); link.href = urlObj; link.download = namaFile; link.click(); URL.revokeObjectURL(urlObj);
        }
    })
    .catch(function(error) {
        // 3. JAGA-JAGA JIKA ERROR: Tetap wajib disembunyikan agar layout tidak hancur
        element.style.display = 'none';
        console.error("Gagal membuat PDF: ", error);
        alert("Terjadi kesalahan saat memproses PDF.");
    });
}

// ==========================================
// FUNGSI CSV & LAINNYA
// ==========================================
function downloadTemplatePagi() { const tgl = document.getElementById('tglOps').value; let csv = 'Kategori;Nama Produk;Stok Awal;Tambah;Kurang;Stok Sisa\n'; (dbStok[tgl] || masterProduk).forEach(p => { csv += `${p.kategori};${p.nama};${p.awal || 0};${p.tambah || 0};${p.kurang || 0};${p.sisa || ""}\n`; }); const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' })); link.download = `Stok_Harian_${tgl}.csv`; link.click(); }
function importStokPagi(event) { if(isDataLocked(document.getElementById('tglOps').value)) { alert("Data terkunci! Silakan buka gembok terlebih dahulu."); return; } const file = event.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = function(e) { const tgl = document.getElementById('tglOps').value; if (!dbStok[tgl]) syncStokDenganMaster(tgl); e.target.result.split('\n').forEach((line, index) => { if (index === 0 || !line.trim()) return; const cols = line.split(';'); if (cols.length >= 3) { const idx = dbStok[tgl].findIndex(p => p.nama.toLowerCase() === cols[1].trim().toLowerCase()); if (idx !== -1) { dbStok[tgl][idx].awal = cols[2].trim(); if (cols[3]) dbStok[tgl][idx].tambah = cols[3].trim(); if (cols[4]) dbStok[tgl][idx].kurang = cols[4].trim(); if (cols[5]) dbStok[tgl][idx].sisa = cols[5].trim(); } } }); if(db) db.collection('cabang').doc(CABANG_AKTIF).collection('stokHarian').doc(tgl).set({ items: dbStok[tgl] }).then(() => { renderTabelMatriks(); updateKalkulasi(); alert('✅ Import OK'); }); else { renderTabelMatriks(); updateKalkulasi(); alert('✅ Import Lokal OK'); } }; reader.readAsText(file); }

function bagikanAplikasi() {
    const namaCabangShare = localStorage.getItem('namaCabangAktif') || 'Cabang Pusat';
    if (navigator.share) {
        navigator.share({
            title: `Aplikasi Kasir Bakso Mbak Sae'ah ${namaCabangShare}`,
            text: `Ini link untuk mengakses Aplikasi Kasir Bakso Malang Mbak Sae'ah ${namaCabangShare}. Silakan buka dan simpan di HP kamu ya!`,
            url: window.location.href
        }).then(() => { showToast('✅ Berhasil membuka menu bagikan!'); }).catch(err => { console.log('Gagal membagikan', err); });
    } else {
        const dummy = document.createElement('input'); document.body.appendChild(dummy); dummy.value = window.location.href; dummy.select(); document.execCommand('copy'); document.body.removeChild(dummy); alert('🔗 Link aplikasi berhasil disalin (dicopy)!\n\nSilakan paste (tempel) di WhatsApp atau chat lainnya.');
    }
}

function catatAktivitas(aksi, detail) {
    if(!db) return;
    const namaUser = currentUser ? currentUser.nama : "Sistem";
    const waktuWIB = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    
    db.collection('cabang').doc(CABANG_AKTIF).collection('logAktivitas').add({ 
        waktu: waktuWIB, user: namaUser, keterangan: `[${aksi}] ${detail}`, timestamp: firebase.firestore.FieldValue.serverTimestamp() 
    }).catch(err => console.error("Gagal mencatat log:", err));
}

function muatDataRiwayat() {
    if(!db) return;
    
    db.collection('cabang').doc(CABANG_AKTIF).collection('logAktivitas').orderBy('timestamp', 'desc').limit(50).get().then(snapshot => {
        let html = '';
        if(snapshot.empty) { 
            html = `<tr><td colspan="3" style="text-align: center; padding: 20px; color: #64748b;">Belum ada riwayat aktivitas tercatat.</td></tr>`; 
        } else {
            snapshot.forEach(doc => {
                const d = doc.data();
                html += `<tr style="border-bottom: 1px solid #f1f5f9;">
                    <td style="padding: 10px 12px; color: #64748b; background: #ffffff; position: sticky; left: 0; z-index: 5;">${d.waktu || '-'}</td>
                    <td style="padding: 10px 12px; font-weight: 600; color: #0f172a; background: #ffffff; position: sticky; left: 95px; z-index: 5; box-shadow: 4px 0 5px -2px rgba(0,0,0,0.08);">${d.user || 'Sistem'}</td>
                    <td style="padding: 10px 12px; color: #334155; white-space: normal; word-break: break-word;">${d.keterangan || '-'}</td>
                </tr>`;
            });
        }
        const elBody = document.getElementById('tabelRiwayatBody');
        if(elBody) elBody.innerHTML = html;
    }).catch(err => {
        const elBody = document.getElementById('tabelRiwayatBody');
        if(elBody) elBody.innerHTML = `<tr><td colspan="3" style="text-align: center; padding: 20px; color: #ef4444;">Gagal memuat data riwayat.</td></tr>`;
    });
}

function toggleDropdown(idGrup) {
    const el = document.getElementById(idGrup);
    if (el) {
        if (el.style.display === "none" || el.style.display === "") el.style.display = "block";
        else el.style.display = "none";
    }
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('PWA Siap!'))
            .catch(err => console.log('PWA Gagal:', err));
    });
}

function hitungOtomatis(elemen) {
    let nilai = elemen.value;
    if (nilai.includes('+') || nilai.includes('-') || nilai.includes('=')) {
        try {
            let bersih = nilai.replace(/=/g, '').replace(/\./g, '').replace(/ /g, '');
            if (/^[0-9+\-*/]+$/.test(bersih)) {
                elemen.value = eval(bersih); 
            }
        } catch(e) {
            console.log("Format rumus salah");
        }
    }
    if (typeof formatRibuanInput === 'function') {
        formatRibuanInput(elemen);
    }
}

function inputKasirPintar(elemen) {
    let nilai = elemen.value;
    if (nilai.includes('+') || nilai.includes('-') || nilai.includes('=')) { return; }
    if (typeof formatRibuanInput === 'function') { formatRibuanInput(elemen); }
}

function exportProdukKeExcel() {
    let dataTarget = null;
    if (typeof masterProduk !== 'undefined' && Array.isArray(masterProduk) && masterProduk.length > 0) {
        dataTarget = masterProduk;
    }

    if (!dataTarget || dataTarget.length === 0) {
        alert("Sistem tidak menemukan data produk untuk di-export!");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "No;Nama Produk;Kategori;Harga Modal (HPP);Harga Jual;Margin (Rp);Stok Gudang\n";

    dataTarget.forEach((p, index) => {
        let namaVal = p.nama || '-';
        let katVal = p.kategori || '-';
        let modalVal = p.modal || 0;
        let jualVal = p.jual || 0;
        let marginVal = jualVal - modalVal;
        let gudangVal = p.stokGudang || 0;

        let namaFormat = `"${String(namaVal).replace(/"/g, '""')}"`;
        let katFormat = `"${String(katVal).replace(/"/g, '""')}"`;

        csvContent += `${index + 1};${namaFormat};${katFormat};${modalVal};${jualVal};${marginVal};${gudangVal}\n`;
    });

    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Master_Produk_Bakso_Saeah_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function cetakPDFProduk() { window.print(); }

const urlParams = new URLSearchParams(window.location.search);
const isDeveloper = urlParams.get('mode') === 'bos' || window.location.hostname === 'localhost';

if (!isDeveloper) {
    document.addEventListener('contextmenu', function(e) { e.preventDefault(); });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'F12' || 
           (e.ctrlKey && e.shiftKey && e.key === 'I') || 
           (e.ctrlKey && e.shiftKey && e.key === 'J') || 
           (e.ctrlKey && e.key === 'U')) {
            e.preventDefault();
        }
    });
}

function prosesTampilLaporanBerkala() {
    const tglMulai = document.getElementById('filterBerkalaMulai').value;
    const tglAkhir = document.getElementById('filterBerkalaAkhir').value;

    if (!tglMulai || !tglAkhir) { alert('Mohon pilih Tanggal Mulai dan Tanggal Akhir terlebih dahulu!'); return; }
    if (tglMulai > tglAkhir) { alert('Tanggal Mulai tidak boleh lebih besar dari Tanggal Akhir!'); return; }

    document.getElementById('teksPeriodeLaporan').innerText = `Periode: ${tglMulai} s/d ${tglAkhir}`;
    let validKeys = [];
    Object.keys(dbStok).forEach(tgl => { if(tgl >= tglMulai && tgl <= tglAkhir) validKeys.push(tgl); });

    let omsetTotal = 0, pengeluaranTotal = 0, profitKotorTotal = 0, gajiTotal = 0, pengeluaranHarianSaja = 0;
    let rekapProduk = masterProduk.map(p => ({ ...p, totalTerjual: 0, totalOmset: 0, totalProfit: 0 }));

    validKeys.forEach(tgl => {
        (dbStok[tgl] || []).forEach((p, idx) => {
            const awal = parseFloat(p.awal) || 0;
            const tambah = parseFloat(p.tambah) || 0;
            const kurang = parseFloat(p.kurang) || 0;
            const totalStok = awal + tambah - kurang;
            const sisa = (p.sisa !== "" && p.sisa !== null) ? parseFloat(p.sisa) : null;

            if (sisa !== null && sisa <= totalStok) {
                const terjual = totalStok - sisa;
                if(rekapProduk[idx]) {
                    rekapProduk[idx].totalTerjual += terjual;
                    rekapProduk[idx].totalOmset += (terjual * p.jual);
                    rekapProduk[idx].totalProfit += (terjual * p.margin);
                }
                omsetTotal += (terjual * p.jual);
                profitKotorTotal += (terjual * p.margin);
            }
        });

        dbPengeluaranHarian.forEach(p => { if (p.tgl === tgl) pengeluaranHarianSaja += p.nominal; });
        const dataSetoran = dbSetoranDapur[tgl] || { pengeluaran: 0 };
        pengeluaranTotal += (dataSetoran.pengeluaran || 0);
        gajiTotal += (dbGajiHarian[tgl]?.nominal || 0);
    });

    const totalSemuaPengeluaran = pengeluaranHarianSaja + pengeluaranTotal + gajiTotal; 
    const profitBersihTotal = profitKotorTotal - gajiTotal - pengeluaranHarianSaja;

    const setTxt = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
    setTxt('teksOmsetLaporan', formatRupiah(omsetTotal));
    setTxt('teksPengeluaranLaporan', formatRupiah(totalSemuaPengeluaran));
    setTxt('teksProfitLaporan', formatRupiah(profitBersihTotal));

    const tbody = document.getElementById('tabelLaporanBerkala');
    if(!tbody) return;
    tbody.innerHTML = '';
    let adaData = false;
    rekapProduk.filter(p => p.totalTerjual > 0).forEach(p => {
        adaData = true;
        tbody.innerHTML += `<tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;"><strong>${p.nama}</strong><br><small style="color: #6b7280;">${p.kategori}</small></td><td style="padding: 10px; text-align: center; border-bottom: 1px solid #e5e7eb;">${p.totalTerjual}</td><td style="padding: 10px; text-align: right; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #059669;">${formatRupiah(p.totalOmset)}</td></tr>`;
    });

    if (!adaData) {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; padding: 20px; color: #ef4444; font-style: italic;">Tidak ada data penjualan yang tersimpan pada rentang tanggal tersebut.</td></tr>`;
    }
}

function cetakPDFBerkala() {
    const elemen = document.getElementById('areaCetakLaporan');
    const periode = document.getElementById('teksPeriodeLaporan').innerText.replace('Periode: ', '').replace(' s/d ', '_');

    let namaKasirInput = document.getElementById('inputNamaPembuatLaporan');
    let namaKasir = namaKasirInput ? namaKasirInput.value : '';
    if (!namaKasir || namaKasir.trim() === "") {
        namaKasir = "Admin";
        if(namaKasirInput) namaKasirInput.value = namaKasir;
    }
    const elPembuat = document.getElementById('pdfNamaPembuatCetak');
    if(elPembuat) elPembuat.innerText = namaKasir;

    const hariIni = new Date();
    const formatTanggal = hariIni.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const elTglCetak = document.getElementById('pdfTanggalCetakLaporan');
    if(elTglCetak) elTglCetak.innerText = formatTanggal;

   const namaCabangFile = (localStorage.getItem('namaCabangAktif') || CABANG_AKTIF).replace(/ /g, '_');
    const konfigurasiPDF = {
        margin:     0.5,
        filename:   `Laporan_${namaCabangFile}_${periode}.pdf`, // <-- Nama file kini dinamis
        image:      { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:      { unit: 'in', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] } 
    };
    html2pdf().set(konfigurasiPDF).from(elemen).save();
}

function bagikanWABerkala() {
    const periode = document.getElementById('teksPeriodeLaporan').innerText;
    const omset = document.getElementById('teksOmsetLaporan').innerText;
    const pengeluaran = document.getElementById('teksPengeluaranLaporan').innerText;
    const profit = document.getElementById('teksProfitLaporan').innerText;

    // Ambil nama cabang aktif
    const namaCabangWA = localStorage.getItem('namaCabangAktif') || 'Cabang Pusat';

    let teksWA = `*📊 LAPORAN BAKSO MBAK SAE'AH ${namaCabangWA.toUpperCase()}* 📊\n`;
    teksWA += `${periode}\n\n`;
    teksWA += `🟢 *Total Omset:* ${omset}\n`;
    teksWA += `🔴 *Pengeluaran:* ${pengeluaran}\n`;
    teksWA += `🔵 *Profit Bersih:* ${profit}\n\n`;
    teksWA += `_Rincian penjualan produk selengkapnya dapat dilihat pada lampiran PDF atau sistem Web._`;

    const urlWA = `https://wa.me/?text=${encodeURIComponent(teksWA)}`;
    window.open(urlWA, '_blank');
}

// Memuat daftar cabang ke halaman login secara otomatis dari Firebase
function muatDaftarCabangLogin() {
    if(!db) return;
    const select = document.getElementById('inLoginCabang');
    if(!select) return;
    
    db.collection('daftarCabang').onSnapshot(snap => {
        if (snap.empty) {
            db.collection('daftarCabang').doc('cipete_utara').set({ id: 'cipete_utara', nama: 'Cabang Cipete Utara' });
            return;
        }
        
        select.innerHTML = '<option value="" disabled selected>-- Pilih Cabang --</option>';
        snap.forEach(doc => {
            select.innerHTML += `<option value="${doc.id}">${doc.data().nama}</option>`;
        });
    });
}

function buatCabangBaru() {
    if (currentUser.role !== 'owner') return;

    const namaCabang = prompt("Masukkan nama cabang baru (Contoh: Cabang Blok M):");
    if(namaCabang && namaCabang.trim()) {
        const idCabang = namaCabang.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
        if(db) {
            db.collection('daftarCabang').doc(idCabang).set({ id: idCabang, nama: namaCabang.trim() }).then(() => {
                alert(`✅ Cabang "${namaCabang.trim()}" berhasil dibuat!\n\nSistem akan mengeluarkan Anda (Logout) untuk membersihkan memori. Silakan login kembali ke cabang yang baru.`);
                localStorage.removeItem('baksoUser'); 
                localStorage.removeItem('cabangAktif');
                window.location.reload();
            });
        }
    }
}

function muatDaftarCabangKontrol() {
    if(!db) return;
    const tbody = document.getElementById('tbodyDaftarCabang');
    const selectCabangTugas = document.getElementById('regCabangTugas'); // PERBAIKAN DI SINI
    
    db.collection('daftarCabang').onSnapshot(snap => {
        if (tbody) tbody.innerHTML = '';
        if (selectCabangTugas) selectCabangTugas.innerHTML = ''; // Kosongkan dulu agar tidak ganda
        
        snap.forEach(doc => {
            const data = doc.data();
            const btnHapus = (data.id === 'cipete_utara') ? 
                `<span style="color:#94a3b8; font-size:0.75rem; font-style:italic;">Pusat (Patokan)</span>` : 
                `<button onclick="hapusCabang('${data.id}', '${data.nama}')" style="background:#ef4444; color:#fff; border:none; padding:4px 8px; border-radius:4px; font-size:0.7rem; cursor:pointer;">Hapus</button>`;
                
            // 1. Mengisi Tabel Kelola Cabang
            if (tbody) {
                tbody.innerHTML += `
                    <tr style="border-bottom: 1px solid #e5e7eb;">
                        <td style="padding: 8px;"><strong>${data.nama}</strong></td>
                        <td style="padding: 8px; text-align: right;">${btnHapus}</td>
                    </tr>
                `;
            }
            
            // 2. Mengisi Dropdown Cabang Tugas di Form Tambah Akun
            if (selectCabangTugas) {
                selectCabangTugas.innerHTML += `<option value="${data.id}">${data.nama}</option>`;
            }
        });
    });
}
function hapusCabang(idCabang, namaCabang) {
    if(confirm(`⚠️ PERINGATAN!\n\nYakin ingin menghapus "${namaCabang}"?\nCabang ini akan hilang permanen dari menu login.`)) {
        if(db) {
            db.collection('daftarCabang').doc(idCabang).delete().then(() => {
                alert(`✅ ${namaCabang} telah dihapus.`);
                if (CABANG_AKTIF === idCabang) {
                    localStorage.removeItem('baksoUser');
                    window.location.reload();
                }
            });
        }
    }
}
// ==========================================
// KODE BARU: FUNGSI OWNER PINDAH CABANG INSTAN
// ==========================================
function ownerPindahCabang(idCabangBaru) {
    if (!idCabangBaru || idCabangBaru === CABANG_AKTIF) return;
    
    // Cari nama cabang dari pilihan dropdown
    const dropdown = document.getElementById('dropdownPindahCabang');
    const namaCabangBaru = dropdown.options[dropdown.selectedIndex].text;

    if (confirm(`Pindah ke ${namaCabangBaru}?`)) {
        // Putar Lampu Lalulintas (Ubah ingatan lokal)
        localStorage.setItem('cabangAktif', idCabangBaru);
        localStorage.setItem('namaCabangAktif', namaCabangBaru);
        
        // Catat di log aktivitas
        if(typeof catatAktivitas === 'function'){
            catatAktivitas('Pindah Cabang', `${currentUser.nama} pindah pantauan ke ${namaCabangBaru}`);
        }
        
        // Refresh layar agar Firebase memuat data cabang baru dengan bersih
        window.location.reload();
    } else {
        // Kembalikan pilihan jika owner batal (klik cancel)
        dropdown.value = CABANG_AKTIF;
    }
}
// Tambahkan variabel global ini di area atas script.js jika belum ada
let chartGlobalInstance = null;
let chartTop10GlobalInstance = null;
let chartTrenGlobalInstance = null; // Variabel baru untuk grafik tren

// Fungsi baru untuk menampilkan/menyembunyikan kalender manual
function cekFilterKustomGlobal() {
    const ddl = document.getElementById('filterGlobalPeriode').value;
    const areaKustom = document.getElementById('areaFilterKustomGlobal');
    if (ddl === 'kustom') {
        areaKustom.style.display = 'flex'; // Munculkan input tanggal
    } else {
        areaKustom.style.display = 'none'; // Sembunyikan
        renderDashboardGlobal(); // Langsung proses datanya
    }
}

async function renderDashboardGlobal() {
    const filterPeriode = document.getElementById('filterGlobalPeriode').value;
    const filterKategori = document.getElementById('filterGlobalKategori').value;
    const inputKecualikan = document.getElementById('filterGlobalKecualikan');
    const kataPengecualian = inputKecualikan ? inputKecualikan.value.toLowerCase() : "";

    let strAwal = "";
    let strAkhir = "";

    const formatTgl = (d) => {
        let bln = '' + (d.getMonth() + 1), hr = '' + d.getDate(), thn = d.getFullYear();
        if (bln.length < 2) bln = '0' + bln;
        if (hr.length < 2) hr = '0' + hr;
        return [thn, bln, hr].join('-');
    };

    if (filterPeriode === 'kustom') {
        const inputMulai = document.getElementById('tglMulaiGlobal').value;
        const inputSelesai = document.getElementById('tglAkhirGlobal').value;
        
        if (!inputMulai || !inputSelesai) {
            alert("Silakan isi Tanggal Mulai dan Tanggal Akhir terlebih dahulu!");
            return; 
        }
        if (inputMulai > inputSelesai) {
            alert("Tanggal Mulai tidak boleh melewati Tanggal Akhir!");
            return;
        }
        strAwal = inputMulai;
        strAkhir = inputSelesai;
    } else {
        let tglAkhir = new Date(); 
        let tglAwal = new Date();
        
        if (filterPeriode === '7') {
            tglAwal.setDate(tglAkhir.getDate() - 6);
        } else if (filterPeriode === '30') {
            tglAwal.setDate(tglAkhir.getDate() - 29);
        } else if (filterPeriode === 'bulan_ini') {
            tglAwal = new Date(tglAkhir.getFullYear(), tglAkhir.getMonth(), 1);
        } else if (filterPeriode === 'bulan_lalu') {
            tglAwal = new Date(tglAkhir.getFullYear(), tglAkhir.getMonth() - 1, 1);
            tglAkhir = new Date(tglAkhir.getFullYear(), tglAkhir.getMonth(), 0); 
        }
        
        strAwal = formatTgl(tglAwal);
        strAkhir = formatTgl(tglAkhir);
    }

    let totalOmsetGlobal = 0, totalProfitGlobal = 0;
    let totalOmsetBakso = 0, totalOmsetReseller = 0;
    let profitCipete = 0, profitBlokM = 0;
    let totalPengeluaranGlobal = 0;
    let pengeluaranCipete = 0, pengeluaranBlokM = 0;

    let omsetBaksoPerCabang = {};
    let omsetResellerPerCabang = {};
    let rekapProdukGlobal = {};
    let rekapTrenHarian = {}; // Perekam data tren per hari

    const daftarCabang = ['cipete_utara', 'blok_m']; 

    for (const idCabang of daftarCabang) {
        omsetBaksoPerCabang[idCabang] = 0;
        omsetResellerPerCabang[idCabang] = 0;

        try {
            const stokRef = db.collection('cabang').doc(idCabang).collection('stokHarian');
            const snapStok = await stokRef.where(firebase.firestore.FieldPath.documentId(), '>=', strAwal)
                                          .where(firebase.firestore.FieldPath.documentId(), '<=', strAkhir).get();

            snapStok.forEach(doc => {
                const tglDoc = doc.id;
                if (!rekapTrenHarian[tglDoc]) rekapTrenHarian[tglDoc] = 0;

                const data = doc.data();
                if (data.items && Array.isArray(data.items)) {
                    data.items.forEach(item => {
                        if (filterKategori !== 'semua' && item.kategori !== filterKategori) return;

                        const awal = parseInt(item.awal) || 0;
                        const tambah = parseInt(item.tambah) || 0;
                        const kurang = parseInt(item.kurang) || 0;
                        const sisa = parseInt(item.sisa) || 0;
                        const hargaJual = parseInt(item.jual) || 0;
                        const margin = parseInt(item.margin) || 0;

                        let stokTerjual = 0;
                        if (item.sisa !== "" && item.sisa !== undefined) {
                            stokTerjual = (awal + tambah) - (sisa + kurang);
                        }

                        if (stokTerjual > 0) {
                            const subtotal = stokTerjual * hargaJual;
                            const profitTotal = stokTerjual * margin;
                            
                            totalOmsetGlobal += subtotal;
                            totalProfitGlobal += profitTotal;

                            if (idCabang === 'cipete_utara') profitCipete += profitTotal;
                            if (idCabang === 'blok_m') profitBlokM += profitTotal;

                            if (item.kategori === 'Bakso Malang') {
                                totalOmsetBakso += subtotal;
                                omsetBaksoPerCabang[idCabang] += subtotal;
                            } else if (item.kategori === 'Reseller') {
                                totalOmsetReseller += subtotal;
                                omsetResellerPerCabang[idCabang] += subtotal;
                            }

                            const namaProduk = item.nama;
                            if (!rekapProdukGlobal[namaProduk]) rekapProdukGlobal[namaProduk] = 0;
                            rekapProdukGlobal[namaProduk] += stokTerjual;
                            
                            // Masukkan ke rekap harian
                            rekapTrenHarian[tglDoc] += subtotal;
                        }
                    });
                }
            });

            const pengeluaranRef = db.collection('cabang').doc(idCabang).collection('pengeluaranHarian');
            const snapPengeluaran = await pengeluaranRef.where('tgl', '>=', strAwal).where('tgl', '<=', strAkhir).get();
            snapPengeluaran.forEach(doc => {
                const nom = parseInt(doc.data().nominal) || 0;
                totalPengeluaranGlobal += nom;
                if (idCabang === 'cipete_utara') pengeluaranCipete += nom;
                if (idCabang === 'blok_m') pengeluaranBlokM += nom;
            });

            const setoranRef = db.collection('cabang').doc(idCabang).collection('setoranDapur');
            const snapSetoran = await setoranRef.where(firebase.firestore.FieldPath.documentId(), '>=', strAwal)
                                                .where(firebase.firestore.FieldPath.documentId(), '<=', strAkhir).get();
            snapSetoran.forEach(doc => {
                const pengDapur = parseInt(doc.data().pengeluaran) || 0;
                totalPengeluaranGlobal += pengDapur;
                if (idCabang === 'cipete_utara') pengeluaranCipete += pengDapur;
                if (idCabang === 'blok_m') pengeluaranBlokM += pengDapur;
            });

        } catch (error) {
            console.error("Gagal menarik data: " + idCabang, error);
        }
    }

    const listKecuali = kataPengecualian.split(',').map(s => s.trim()).filter(s => s);
    let arrayProduk = Object.keys(rekapProdukGlobal).map(nama => {
        return { nama: nama, terjual: rekapProdukGlobal[nama] };
    });
    if (listKecuali.length > 0) {
        arrayProduk = arrayProduk.filter(p => !listKecuali.some(kecuali => p.nama.toLowerCase().includes(kecuali)));
    }
    arrayProduk.sort((a, b) => b.terjual - a.terjual);
    let top10Produk = arrayProduk.slice(0, 10);

    // Siapkan Data Tren
    const labelsTren = Object.keys(rekapTrenHarian).sort();
    const dataTren = labelsTren.map(tgl => rekapTrenHarian[tgl]);

    let labaBersihGlobal = totalProfitGlobal - totalPengeluaranGlobal;

    // Tampilkan Angka
    document.getElementById('globalTotalOmset').innerText = 'Rp ' + totalOmsetGlobal.toLocaleString('id-ID');
    document.getElementById('globalTotalProfit').innerText = 'Rp ' + totalProfitGlobal.toLocaleString('id-ID');
    if (document.getElementById('globalOmsetBakso')) document.getElementById('globalOmsetBakso').innerText = 'Rp ' + totalOmsetBakso.toLocaleString('id-ID');
    if (document.getElementById('globalOmsetReseller')) document.getElementById('globalOmsetReseller').innerText = 'Rp ' + totalOmsetReseller.toLocaleString('id-ID');
    if (document.getElementById('globalProfitCipete')) document.getElementById('globalProfitCipete').innerText = 'Rp ' + profitCipete.toLocaleString('id-ID');
    if (document.getElementById('globalProfitBlokM')) document.getElementById('globalProfitBlokM').innerText = 'Rp ' + profitBlokM.toLocaleString('id-ID');
    
    if (document.getElementById('globalTotalPengeluaran')) document.getElementById('globalTotalPengeluaran').innerText = 'Rp ' + totalPengeluaranGlobal.toLocaleString('id-ID');
    if (document.getElementById('globalPengeluaranCipete')) document.getElementById('globalPengeluaranCipete').innerText = 'Rp ' + pengeluaranCipete.toLocaleString('id-ID');
    if (document.getElementById('globalPengeluaranBlokM')) document.getElementById('globalPengeluaranBlokM').innerText = 'Rp ' + pengeluaranBlokM.toLocaleString('id-ID');
    if (document.getElementById('globalLabaBersih')) document.getElementById('globalLabaBersih').innerText = 'Rp ' + labaBersihGlobal.toLocaleString('id-ID');

    // Render Grafik
    if (typeof gambarGrafikGlobal === 'function') gambarGrafikGlobal(daftarCabang, omsetBaksoPerCabang, omsetResellerPerCabang);
    if (typeof gambarGrafikTop10Global === 'function') gambarGrafikTop10Global(top10Produk);
    if (typeof gambarGrafikTrenGlobal === 'function') gambarGrafikTrenGlobal(labelsTren, dataTren);
}

// ================= FUNGSI GRAFIK ================= 

function gambarGrafikGlobal(labelsCabang, dataBakso, dataReseller) {
    const ctx = document.getElementById('chartGlobalCabang');
    if (!ctx) return;
    if (chartGlobalInstance) chartGlobalInstance.destroy();

    const labels = labelsCabang.map(id => id.split('_').map(kata => kata.charAt(0).toUpperCase() + kata.slice(1)).join(' '));
    const angkaBakso = Object.values(dataBakso);
    const angkaReseller = Object.values(dataReseller);

    chartGlobalInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                { label: 'Bakso (Rp)', data: angkaBakso, backgroundColor: '#f97316', maxBarThickness: 80 },
                { label: 'Reseller (Rp)', data: angkaReseller, backgroundColor: '#3b82f6', maxBarThickness: 80 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: {
                x: { stacked: true },
                y: { stacked: true, beginAtZero: true, ticks: { callback: function(value) { return value.toLocaleString('id-ID'); } } }
            },
            plugins: {
                datalabels: { formatter: function(value) { return value === 0 ? '' : value.toLocaleString('id-ID'); }, color: '#ffffff', font: { size: 10, weight: 'bold' } }
            }
        }
    });
}

function gambarGrafikTop10Global(dataTop10) {
    const ctx = document.getElementById('chartTop10Global');
    if (!ctx) return;
    if (chartTop10GlobalInstance) chartTop10GlobalInstance.destroy();

    const labels = dataTop10.map(d => d.nama);
    const dataAngka = dataTop10.map(d => d.terjual);

    chartTop10GlobalInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{ label: 'Terjual (Porsi)', data: dataAngka, backgroundColor: '#10b981', borderRadius: 4 }]
        },
        options: {
            indexAxis: 'y', responsive: true, maintainAspectRatio: false,
            scales: { x: { beginAtZero: true } },
            plugins: {
                datalabels: { formatter: function(value) { return value === 0 ? '' : value.toLocaleString('id-ID'); }, color: '#fff', font: { size: 10, weight: 'bold' } }
            }
        }
    });
}

function gambarGrafikTrenGlobal(labelsTren, dataTren) {
    const ctx = document.getElementById('chartTrenGlobal');
    if (!ctx) return;
    if (chartTrenGlobalInstance) chartTrenGlobalInstance.destroy();

    // Ubah format tanggal YYYY-MM-DD jadi lebih ringkas (DD/MM)
    const labelRingkas = labelsTren.map(tgl => {
        const parts = tgl.split('-');
        return parts.length === 3 ? `${parts[2]}/${parts[1]}` : tgl;
    });

    chartTrenGlobalInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labelRingkas,
            datasets: [{
                label: 'Omset Global (Rp)',
                data: dataTren,
                borderColor: '#6366f1', // Indigo
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                borderWidth: 3,
                pointBackgroundColor: '#4f46e5',
                pointRadius: 4,
                fill: true,
                tension: 0.3 // Garis sedikit melengkung halus
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { callback: function(value) { return value.toLocaleString('id-ID'); } }
                }
            },
            plugins: {
                datalabels: { display: false } // Matikan angka di dalam chart agar garis tidak tertutup teks
            }
        }
    });
}
// ==========================================
// FITUR MUTASI STOK BAKSO MALANG LINTAS CABANG
// ==========================================

// 1. Membuka Modal Mutasi dan Meload Produk Khusus Kategori "Bakso Malang"
function bukaModalMutasiStok() {
    const modal = document.getElementById('modalMutasiStok');
    if (!modal) return;
    
    modal.classList.add('active');
    
    // Set default pilihan ke "Kirim"
    document.getElementById('mutasiJenis').value = 'keluar';
    gantiPilihanMutasi();
    
    // Muat daftar cabang mitra ke dropdown target
    muatDropdownCabangMitra();
    
    // Muat produk khusus kategori Bakso Malang ke dalam tabel modal
    muatTabelModalMutasi();
}

function tutupModalMutasiStok() {
    const modal = document.getElementById('modalMutasiStok');
    if (modal) modal.classList.remove('active');
}

// Mengubah teks label target tergantung jenis mutasi (Kirim / Terima)
function gantiPilihanMutasi() {
    const jenis = document.getElementById('mutasiJenis').value;
    const label = document.getElementById('labelCabangMitra');
    if (jenis === 'keluar') {
        label.innerText = 'Cabang Tujuan:';
    } else {
        label.innerText = 'Cabang Asal (Pengirim):';
    }
}

// Mengisi dropdown cabang mitra secara akurat (Menyaring agar cabang sendiri tidak ikut muncul)
async function muatDropdownCabangMitra() {
    const selectTarget = document.getElementById('mutasiCabangTarget');
    if (!selectTarget) return;
    
    selectTarget.innerHTML = '<option value="">Memuat cabang...</option>';
    
    // Ambil nama cabang yang sedang aktif dari banner layar
    let labelBanner = document.getElementById('labelCabangBanner');
    let teksBannerAktif = labelBanner ? labelBanner.innerText.trim().toLowerCase() : '';
    
    try {
        let db = firebase.firestore();
        let snapshot = await db.collection('cabang').get();
        
        selectTarget.innerHTML = '';
        let adaCabang = false;
        
        snapshot.forEach(doc => {
            let namaDokumen = doc.id; // Contoh: 'blok_m', 'cipete_utara', dll.
            let namaBersih = namaDokumen.replace(/[_]/g, ' ').toLowerCase();
            let aktifBersih = teksBannerAktif.replace(/[_]/g, ' ').toLowerCase();
            
            // Masukkan ke dropdown HANYA JIKA BUKAN cabang yang sedang aktif login
            if (namaDokumen && !namaBersih.includes(aktifBersih) && !aktifBersih.includes(namaBersih)) {
                adaCabang = true;
                let opt = document.createElement('option');
                opt.value = namaDokumen; // Nilai value persis id dokumen Firestore (cth: 'blok_m')
                opt.innerText = namaDokumen.replace(/_/g, ' ').toUpperCase(); // Tampilan rapi (cth: 'BLOK M')
                selectTarget.appendChild(opt);
            }
        });
        
        if (!adaCabang) {
            isiDropdownCabangCadangan(selectTarget, teksBannerAktif);
        }
    } catch (e) {
        console.log("Menggunakan dropdown cadangan:", e);
        isiDropdownCabangCadangan(selectTarget, teksBannerAktif);
    }
}

function isiDropdownCabangCadangan(selectTarget, aktifSkrg) {
    selectTarget.innerHTML = '';
    // Daftar cadangan ID dokumen Firestore Anda
    let daftarCabangDefault = ['blok_m', 'cipete_utara']; 
    
    daftarCabangDefault.forEach(namaDokumen => {
        let namaBersih = namaDokumen.replace(/[_]/g, ' ').toLowerCase();
        let aktifBersih = aktifSkrg.replace(/[_]/g, ' ').toLowerCase();
        
        if (!namaBersih.includes(aktifBersih) && !aktifBersih.includes(namaBersih)) {
            let opt = document.createElement('option');
            opt.value = namaDokumen;
            opt.innerText = namaDokumen.replace(/_/g, ' ').toUpperCase();
            selectTarget.appendChild(opt);
        }
    });
}
// Menampilkan produk khusus kategori "Bakso Malang"
function muatTabelModalMutasi() {
    const tbody = document.getElementById('tbodyTabelMutasiStok');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    // Kita buat pencarian data produk yang lebih fleksibel menyesuaikan berbagai kemungkinan nama variabel di script.js Anda
    let listProduk = [];
    if (typeof produkStore !== 'undefined' && Array.isArray(produkStore)) {
        listProduk = produkStore;
    } else if (typeof daftarProduk !== 'undefined' && Array.isArray(daftarProduk)) {
        listProduk = daftarProduk;
    } else if (typeof masterProduk !== 'undefined' && Array.isArray(masterProduk)) {
        listProduk = masterProduk;
    } else if (typeof dataProduk !== 'undefined' && Array.isArray(dataProduk)) {
        listProduk = dataProduk;
    } else {
        // Jika disimpan di localStorage atau variabel global lain
        try {
            listProduk = JSON.parse(localStorage.getItem('daftarProduk')) || [];
        } catch(e) { listProduk = []; }
    }
    
    let adaBakso = false;
    
    listProduk.forEach((prod, index) => {
        // Cek kategori secara fleksibel (bisa berupa properti kategori, kateg, atau category)
        let kategori = prod.kategori || prod.kateg || prod.category || '';
        
        // Memeriksa apakah mengandung kata "bakso malang" (tidak case-sensitive)
        if (kategori.toLowerCase().includes('bakso malang')) {
            adaBakso = true;
            let namaProd = prod.nama || prod.name || prod.namaProduk || 'Produk';
            
            // AMBIL STOK DARI STOK AWAL (PAGI)
            let stokSkrg = 0;
            if (typeof stokHariIni !== 'undefined' && stokHariIni[index]) {
                // Diambil dari properti stok awal/pagi hari
                stokSkrg = stokHariIni[index].pagi || stokHariIni[index].awal || 0;
            } else {
                // Cadangan membaca langsung dari input kolom pagi di tabel harian yang sedang aktif di layar
                let inputPagi = document.getElementById(`pagi_${index}`);
                if (inputPagi) {
                    stokSkrg = parseInt(inputPagi.value) || 0;
                }
            }
            
            let tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="padding: 8px; font-weight: bold; color: #1e293b;">${namaProd}</td>
                <td style="padding: 8px; text-align: center; font-weight: bold; color: #475569;">${stokSkrg} Pcs</td>
                <td style="padding: 6px; text-align: center;">
                    <input type="number" class="input-pcs-mutasi" data-index="${index}" data-nama="${namaProd}" value="0" min="0" style="width: 70px; padding: 4px; text-align: center; font-weight: bold; border: 1px solid #0284c7; border-radius: 4px;">
                </td>
            `;
            tbody.appendChild(tr);
        }
    });
    
    if (!adaBakso) {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; padding: 20px; color: #94a3b8;">Produk Kategori "Bakso Malang" belum terdeteksi. Pastikan penulisan kategori di Master Produk persis "Bakso Malang".</td></tr>`;
    }
}
// 2. Proses Simpan & Sinkronisasi Lintas Cabang (Anti-Undefined)
async function prosesSimpanMutasiStok() {
    let jenisMutasi = document.getElementById('mutasiJenis').value; // 'keluar' atau 'masuk'
    let selectTarget = document.getElementById('mutasiCabangTarget');
    let cabangMitra = selectTarget.value;
    
    if (!cabangMitra) {
        alert('Pilih cabang tujuan/asal terlebih dahulu!');
        return;
    }
    
    let inputPcsElements = document.querySelectorAll('.input-pcs-mutasi');
    let adaMutasi = false;
    let detailMutasiList = [];
    
    inputPcsElements.forEach(input => {
        let val = parseInt(input.value) || 0;
        if (val > 0) {
            adaMutasi = true;
            detailMutasiList.push({
                indexProd: parseInt(input.getAttribute('data-index')),
                namaProduk: input.getAttribute('data-nama').trim().toLowerCase(),
                jumlah: val
            });
        }
    });
    
    if (!adaMutasi) {
        alert('Minimal masukkan jumlah (Pcs) lebih dari 0 untuk salah satu produk!');
        return;
    }
    
    if (!confirm(`Konfirmasi: Anda akan ${jenisMutasi === 'keluar' ? 'mengirim' : 'menerima'} mutasi Bakso Malang ${jenisMutasi === 'keluar' ? 'ke' : 'dari'} cabang ${cabangMitra.toUpperCase()}. Lanjutkan?`)) {
        return;
    }
    
    try {
        let labelBanner = document.getElementById('labelCabangBanner');
        let teksBanner = labelBanner ? labelBanner.innerText.trim().toLowerCase() : '';
        
        if (!teksBanner || teksBanner === 'memuat...') {
            throw new Error('Nama cabang aktif tidak terdeteksi dari banner.');
        }
        
        let tglOpsInput = document.getElementById('tglOps');
        let tanggalHariIni = tglOpsInput ? tglOpsInput.value : new Date().toISOString().split('T')[0];
        
        let db = firebase.firestore();
        
        function formatIdCabang(nama) {
            return nama.replace(/[\s-]/g, '_').toLowerCase();
        }
        
        let idCabangSendiri = formatIdCabang(teksBanner);
        let idCabangMitra = formatIdCabang(cabangMitra);
        
        let docRefSendiri = db.collection('cabang').doc(idCabangSendiri).collection('stokHarian').doc(tanggalHariIni);
        let docRefMitra = db.collection('cabang').doc(idCabangMitra).collection('stokHarian').doc(tanggalHariIni);
        
        let [docSnapSendiri, docSnapMitra] = await Promise.all([
            docRefSendiri.get(),
            docRefMitra.get()
        ]);
        
        // Pastikan item terstandarisasi dengan masterProduk dan tidak ada nilai undefined
        function bersihkanItemStok(snapshotData) {
            if (snapshotData && snapshotData.items && Array.isArray(snapshotData.items)) {
                return snapshotData.items.map(p => ({
                    ...p,
                    awal: p.awal !== undefined && p.awal !== null ? p.awal : "",
                    tambah: p.tambah !== undefined && p.tambah !== null ? p.tambah : "",
                    kurang: p.kurang !== undefined && p.kurang !== null ? p.kurang : "",
                    sisa: p.sisa !== undefined && p.sisa !== null ? p.sisa : ""
                }));
            }
            return masterProduk.map(mp => ({ ...mp, awal: "", tambah: "", kurang: "", sisa: "" }));
        }
        
        let dataSendiriItems = bersihkanItemStok(docSnapSendiri.exists ? docSnapSendiri.data() : null);
        let dataMitraItems = bersihkanItemStok(docSnapMitra.exists ? docSnapMitra.data() : null);
        
        detailMutasiList.forEach(item => {
            let idx = item.indexProd;
            let qty = item.jumlah;
            
            if (dataSendiriItems[idx]) {
                let currKurang = parseFloat(dataSendiriItems[idx].kurang) || 0;
                let currTambah = parseFloat(dataSendiriItems[idx].tambah) || 0;
                
                if (jenisMutasi === 'keluar') {
                    dataSendiriItems[idx].kurang = currKurang + qty;
                } else {
                    dataSendiriItems[idx].tambah = currTambah + qty;
                }
            }
            
            if (dataMitraItems[idx]) {
                let currKurangMitra = parseFloat(dataMitraItems[idx].kurang) || 0;
                let currTambahMitra = parseFloat(dataMitraItems[idx].tambah) || 0;
                
                if (jenisMutasi === 'keluar') {
                    dataMitraItems[idx].tambah = currTambahMitra + qty;
                } else {
                    dataMitraItems[idx].kurang = currKurangMitra + qty;
                }
            }
        });
        
        await Promise.all([
            docRefSendiri.set({ items: dataSendiriItems }, { merge: true }),
            docRefMitra.set({ items: dataMitraItems }, { merge: true })
        ]);
        
        alert('✅ Mutasi stok berhasil disinkronkan ke tabel harian antar cabang!');
        tutupModalMutasiStok();
        
        if (typeof loadDataTanggalLocal === 'function') {
            loadDataTanggalLocal();
        } else {
            window.location.reload();
        }
        
    } catch (error) {
        console.error("Gagal melakukan mutasi stok:", error);
        alert('❌ Terjadi kesalahan saat sinkronisasi: ' + error.message);
    }
}
