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
            const cabangTugasKaryawan = dataAkun.cabang_tugas || 'cipete_utara'; // Default ke cipete jika akun lama belum punya cabang_tugas
            
            // Jika bukan owner, dan cabang pilihannya TIDAK SAMA dengan cabang tugasnya
            if (dataAkun.role !== 'owner' && cabangTugasKaryawan !== cabangPilihan) {
                alert(`❌ AKSES DITOLAK!\n\n${dataAkun.nama}, Anda tidak diizinkan masuk ke ${cabangNamaText}.\nAnda hanya ditugaskan di cabang lainnya.`);
                firebase.auth().signOut(); // Paksa logout
                btn.innerText = "MASUK"; 
                btn.disabled = false;
                return; // Hentikan proses login
            }
            
            currentUser = dataAkun;
            currentUser.email = emailPalsu; 
        } else {
            // Fallback darurat jika data hilang
            currentUser = { nama: "Pengguna " + noHp, role: 'kasir', hp: noHp, email: emailPalsu, cabang_tugas: 'cipete_utara' };
        }
        
        // --- JIKA LOLOS PENGECEKAN, LANJUT MASUK APLIKASI ---
        localStorage.setItem('baksoUser', JSON.stringify(currentUser));
        localStorage.setItem('cabangAktif', cabangPilihan);
        localStorage.setItem('namaCabangAktif', cabangNamaText);
        
        CABANG_AKTIF = cabangPilihan;

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

    // Sinkronisasi Header Lama (Teks di sebelah Logo) agar tidak bentrok
    const headerLama = document.getElementById('headerNamaCabang');
    if (headerLama) headerLama.innerText = savedNamaCabang.replace('Cabang ', '');

    const dropdownPindah = document.getElementById('dropdownPindahCabang');
    if (isOwner && dropdownPindah) {
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
    document.getElementById('menuSetoran').style.display = (isOwner || isDapur) ? 'block' : 'none';        
    document.getElementById('menuTransfer').style.display = isOwner ? 'block' : 'none';        
    document.getElementById('menuMutasi').style.display = isOwner ? 'block' : 'none';        
    document.getElementById('menuGaji').style.display = isOwner ? 'block' : 'none';        
    document.getElementById('menuDashboard').style.display = (isOwner || isDapur) ? 'block' : 'none';        
    document.getElementById('menuProduk').style.display = isOwner ? 'block' : 'none';        
    document.getElementById('menuPusatKontrol').style.display = isOwner ? 'block' : 'none';  
    document.getElementById('menuRiwayat').style.display = isOwner ? 'block' : 'none';
    document.getElementById('menuCetakBerkala').style.display = (isOwner || isDapur) ? 'block' : 'none';        
    document.getElementById('grupKeuanganTitle').style.display = isOwner ? 'block' : 'none';
    document.getElementById('grupPengaturanTitle').style.display = (isOwner || isDapur) ? 'block' : 'none';

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
    
    if (role === 'owner') {
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
    const nama = document.getElementById('inAkunNama').value.trim(); 
    const hp = document.getElementById('inAkunHp').value.trim(); 
    const password = document.getElementById('inAkunPass').value.trim(); 
    const role = document.getElementById('inAkunRole').value; 
    
    // KODE BARU: Ambil cabang penugasan (Jika owner, otomatis ber-value 'semua')
    const cabangTugas = (role === 'owner') ? 'semua' : document.getElementById('inAkunCabangTugas').value;

    if(!db || !aplikasiPendaftaran) {
        alert("Koneksi ke sistem gagal. Pastikan internet stabil.");
        return; 
    }
    if(!hp || !password) {
        alert("Nomor HP dan Password wajib diisi!");
        return;
    }

    const emailPalsu = hp + "@bakso.com";
    
    btnSimpan = e.target.querySelector('button[type="submit"]');
    btnSimpan.disabled = true;
    btnSimpan.innerText = "Menyimpan...";

    aplikasiPendaftaran.auth().createUserWithEmailAndPassword(emailPalsu, password)
    .then((userCredential) => {
        // KODE BARU: Memasukkan field 'cabang_tugas' ke dalam database user
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
        document.getElementById('inAkunNama').value = ''; 
        document.getElementById('inAkunHp').value = ''; 
        document.getElementById('inAkunPass').value = ''; 
        if(typeof muatDaftarAkun === 'function') muatDaftarAkun(); 
        aplikasiPendaftaran.auth().signOut();
        btnSimpan.disabled = false;
        btnSimpan.innerText = "+ Simpan Akun";
    })
    .catch(err => {
        if (err.code === 'auth/email-already-in-use') {
            alert("Gagal! Nomor HP ini sudah pernah didaftarkan.");
        } else {
            alert("Gagal menambahkan akun: " + err.message);
        }
        btnSimpan.disabled = false;
        btnSimpan.innerText = "+ Simpan Akun";
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
        loadDataTanggalLocal(); 
        renderTabelMasterProduk(); 
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
}

// ==========================================
// FUNGSI NAVIGASI
// ==========================================
function toggleSidebar() { document.getElementById('sidebar').classList.toggle('active'); document.getElementById('overlay').classList.toggle('active'); }

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

    if (document.getElementById('cardSetoranDapur')) {
        document.getElementById('cardSetoranDapur').style.display = 'none';
    }
    if (document.getElementById('cardAlokasiHarian')) {
        document.getElementById('cardAlokasiHarian').style.display = 'none';
    }

    if (jenis === 'harian') {    
        document.getElementById('viewHarian').style.display = 'block';    
        if (document.getElementById('cardSetoranDapur')) document.getElementById('cardSetoranDapur').style.display = isDapur ? 'none' : 'block';
        if (document.getElementById('cardAlokasiHarian')) document.getElementById('cardAlokasiHarian').style.display = isOwner ? 'block' : 'none';
        cekPeringatanStok();
    } else if (jenis === 'setoranBakso') {    
        document.getElementById('viewSetoranBakso').style.display = 'block';    
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
    } else if (jenis === 'orderVendor') {
        document.getElementById('viewOrderVendor').style.display = 'block';
        renderFormOrderVendor();
        cekPeringatanStok(); 
    } else if (jenis === 'riwayatAktivitas') {
        document.getElementById('viewRiwayatAktivitas').style.display = 'block';
        muatDataRiwayat();
    } else if (jenis === 'produk') {
        document.getElementById('layar-produk').style.display = 'block';
        if (typeof renderTabelMasterProduk === 'function') renderTabelMasterProduk();
    } else if (jenis === 'laporanBerkala') {
        document.getElementById('viewLaporanBerkala').style.display = 'block';
    } else if (jenis === 'pusatKontrol') {
        if (viewPusat) viewPusat.style.display = 'block';
        if (typeof muatDaftarAkun === 'function') muatDaftarAkun();
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
            <td style="background:#fefce8;"><input type="number" class="input-stok input-pagi" value="${item.harga}" min="0" style="width:80px; text-align:right;" oninput="updateItemVendor(${index}, 'harga', this.value)"></td>
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

    document.getElementById('pdfVendorTgl').innerText = 'Tanggal Pesanan: ' + tglKirim;
    const tbody = document.getElementById('pdfTbodyVendor');
    tbody.innerHTML = '';
    let grandTotal = 0;

    orderItems.forEach((item, index) => {
        const qty = parseInt(item.qty); const harga = parseInt(item.harga); const total = qty * harga; grandTotal += total;
        const rasaTxt = item.rasa ? ` - ${item.rasa}` : '';
        const namaLengkap = `${item.nama} (${item.vol}${rasaTxt})`;
        tbody.innerHTML += `<tr><td style="text-align: center;">${index + 1}</td><td><strong>${namaLengkap}</strong></td><td style="text-align: center;">${item.kemasan}</td><td style="text-align: center; font-weight: bold; color: #15803d; font-size: 13px;">${qty}</td><td style="text-align: right;">${formatRupiah(harga)}</td><td style="text-align: right; font-weight: bold; color: #d97706;">${formatRupiah(total)}</td></tr>`;
    });

    document.getElementById('pdfVendorTotal').innerText = formatRupiah(grandTotal);

    let namaPemesan = document.getElementById('inputNamaPemesanVendor').value;
    if (!namaPemesan || namaPemesan.trim() === "") {
        namaPemesan = (typeof currentUser !== 'undefined' && currentUser && currentUser.role) ? currentUser.role : "Admin";
        document.getElementById('inputNamaPemesanVendor').value = namaPemesan;
    }
    if (document.getElementById('pdfNamaPemesanCetak')) document.getElementById('pdfNamaPemesanCetak').innerText = namaPemesan;
    const hariIni = new Date();
    const formatTanggal = hariIni.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    if (document.getElementById('pdfTanggalCetakVendor')) document.getElementById('pdfTanggalCetakVendor').innerText = formatTanggal;

    const element = document.getElementById('pdfAreaVendor');
    element.style.display = 'block';

    html2pdf().set({
        margin: 5, filename: `PO_Vendor_${tglFile}.pdf`, html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }, pagebreak: { mode: ['avoid-all', 'css', 'legacy'] } 
    }).from(element).output('blob').then(function(pdfBlob) {
        element.style.display = 'none'; 
        const namaFile = `PO_Vendor_${tglFile}.pdf`;
        const filePdf = new File([pdfBlob], namaFile, { type: 'application/pdf' });
        const resetForm = () => { vendorCatalog.forEach(item => item.qty = ""); if(db) db.collection('cabang').doc(CABANG_AKTIF).collection('appData').doc('vendorCatalog').set({ list: vendorCatalog }); renderFormOrderVendor(); };

        if (navigator.canShare && navigator.canShare({ files: [filePdf] })) {
            navigator.share({ files: [filePdf], title: 'Purchase Order (PO)', text: `Berikut terlampir dokumen Purchase Order (PO) tanggal ${tglKirim}. Mohon diproses.`
            }).then(() => { resetForm(); }).catch((error) => { console.error('Batal bagikan:', error); if(confirm("Batal membagikan. Tetap ingin mereset/mengosongkan form pemesanan?")) resetForm(); });
        } else {
            const urlObj = URL.createObjectURL(pdfBlob);
            const link = document.createElement('a'); link.href = urlObj; link.download = namaFile; link.click(); URL.revokeObjectURL(urlObj);
            if(confirm("File PO telah didownload. Reset/kosongkan form pesanan sekarang?")) resetForm();
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
    const tgl = document.getElementById('tglOps').value; 
    if (!dbStok[tgl]) syncStokDenganMaster(tgl); 
    
    const p = dbStok[tgl][idx];
    
    if (tipe === 'tambah') {
        const valBaru = parseFloat(val) || 0;
        const valLama = parseFloat(p.tambah) || 0;
        const selisih = valBaru - valLama; 
        
        if (selisih !== 0) {
            const masterIdx = masterProduk.findIndex(mp => mp.nama === p.nama);
            if (masterIdx !== -1) {
                let stokGudangSekarang = parseFloat(masterProduk[masterIdx].stokGudang) || 0;
                masterProduk[masterIdx].stokGudang = Math.max(0, stokGudangSekarang - selisih);
                if(db) db.collection('cabang').doc(CABANG_AKTIF).collection('appData').doc('masterProduk').set({ list: masterProduk });
            }
        }
        dbStok[tgl][idx].tambah = valBaru;
    } else {
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

    updateKalkulasi(); 
    clearTimeout(autoSaveTimeout); autoSaveTimeout = setTimeout(() => { simpanStokKeFirebase(); }, 1000); 
}

function loadDataTanggalLocal() { 
    const tgl = document.getElementById('tglOps').value; syncStokDenganMaster(tgl); cekDanTarikDataKemarin(tgl); 
    renderTabelMatriks(); loadKasMasukUI(); loadSetoranDapurUI(); loadGajiUI(); renderPengeluaranTables(); updateKalkulasi(); renderViewSetoranBakso(); applyLockUI(); 
}

function isDataLocked(tgl) { return dbStatusKunci[tgl] === true; }

function toggleLock() { const tgl = document.getElementById('tglOps').value; const currentlyLocked = isDataLocked(tgl); if (currentlyLocked) { if(confirm("Buka gembok data hari ini?")) { setLockStatus(tgl, false); } } else { if(confirm("Kunci data hari ini?")) { setLockStatus(tgl, true); } } }

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
    const nominal = (utama ? 50000 : 0) + (tambahan * 50000); 
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
    const d = dbGajiHarian[tgl] || { utama: true, tambahan: 0, nominal: 50000 }; 
    const elUtama = document.getElementById('inAbsenUtama');
    const elTambahan = document.getElementById('inAbsenTambahan');
    const elTotal = document.getElementById('txtTotalGajiHarian');
    if(elUtama) elUtama.value = d.utama ? 'ya' : 'tidak'; 
    if(elTambahan) elTambahan.value = d.tambahan; 
    if(elTotal) elTotal.innerText = formatRupiah(d.nominal); 
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
            <td style="text-align:center;"><input type="number" class="input-stok input-tambah" style="width:45px;" id="tambah_${idx}" value="${p.tambah || ''}" min="0" oninput="updateNilaiStokLokal(${idx}, 'tambah', this.value)" ${locked ? 'disabled' : ''}></td>
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
    const tgl = document.getElementById('tglOps').value; const items = dbStok[tgl] || [];
    let omsetPenjualan = 0, profitBakso = 0, profitReseller = 0, katData = {}; daftarKategori.forEach(k => { katData[k] = { omset: 0, modal: 0, profit: 0 }; });
    let idxTeh = items.findIndex(p => p.nama.toLowerCase() === 'teh manis');
    if(idxTeh !== -1) { 
        let pTeh = items[idxTeh]; 
        let elInput = document.getElementById('inTehTerjual');
        let elInfo = document.getElementById('infoTehTerjual');
        if(elInput && document.activeElement.id !== 'inTehTerjual') { elInput.value = pTeh.awal; } 
        let terjualTeh = parseFloat(pTeh.awal) || 0; 
        if(elInfo) { elInfo.innerText = `Nominal Omset: ${formatRupiah(terjualTeh * pTeh.jual)}`; } 
    }
    items.forEach(p => { const awal = parseFloat(p.awal) || 0; const tambah = parseFloat(p.tambah) || 0; const kurang = parseFloat(p.kurang) || 0; const totalStok = awal + tambah - kurang; const sisa = (p.sisa !== "" && p.sisa !== null) ? parseFloat(p.sisa) : null; if (sisa !== null && sisa <= totalStok) { const terjual = totalStok - sisa; const omset = terjual * p.jual; const modal = terjual * p.modal; const profit = terjual * p.margin; omsetPenjualan += omset; if (!katData[p.kategori]) katData[p.kategori] = { omset: 0, modal: 0, profit: 0 }; katData[p.kategori].omset += omset; katData[p.kategori].modal += modal; katData[p.kategori].profit += profit; if (p.kategori === 'Bakso Malang') profitBakso += profit; else profitReseller += profit; } });
    
    const containerAkumulasi = document.getElementById('containerAkumulasiKategori'); 
    if(containerAkumulasi) {
        containerAkumulasi.innerHTML = '';
        Object.keys(katData).forEach(kat => { if (currentUser && currentUser.role === 'dapur' && kat !== 'Bakso Malang') return; const d = katData[kat]; let boxStyle = kat.toLowerCase().includes('bakso') ? "background: #fff7ed; border: 1px solid #fdba74;" : "background: #f0f9ff; border: 1px solid #7dd3fc;"; let titleColor = kat.toLowerCase().includes('bakso') ? "#ea580c" : "#0284c7"; const div = document.createElement('div'); div.style.cssText = `${boxStyle} padding: 12px; border-radius: 12px;`; div.innerHTML = `<h4 style="color: ${titleColor}; margin-bottom: 8px; font-size: 0.85rem; font-weight:800; text-transform:uppercase;">📌 Akumulasi ${kat}</h4><div style="font-size: 0.75rem; display: flex; justify-content: space-between; margin-bottom: 4px; color:#475569;"><span>Omset:</span><strong style="color:var(--text-main);">${formatRupiah(d.omset)}</strong></div><div style="font-size: 0.75rem; display: flex; justify-content: space-between; margin-bottom: 4px; color:#475569;"><span>Modal:</span><strong style="color: #d97706;">${formatRupiah(d.modal)}</strong></div><div style="font-size: 0.8rem; display: flex; justify-content: space-between; border-top: 1px dashed ${titleColor}; padding-top: 6px; margin-top:6px;"><span style="font-weight:700;">Profit:</span><strong style="color: #16a34a;">${formatRupiah(d.profit)}</strong></div>`; containerAkumulasi.appendChild(div); });
    }

    const kas = dbKasMasuk[tgl] || { cash: 0, qris: 0, gojek: 0, grab: 0, shopee: 0, petty: 0, modalBesok: 0 }; const dataSetoran = dbSetoranDapur[tgl] || { cash: 0, ket: '', pengeluaran: 0 }; const dataGaji = dbGajiHarian[tgl] || { utama: true, tambahan: 0, nominal: 50000 };
    const totalUangSeharusnya = omsetPenjualan + (kas.petty || 0); const gajiHarianNominal = dataGaji.nominal; const totalPengeluaranHarian = dbPengeluaranHarian.filter(p => p.tgl === tgl).reduce((acc, curr) => acc + curr.nominal, 0); const pengeluaranDapur = dataSetoran.pengeluaran || 0; const totalStrukPengeluaran = totalPengeluaranHarian + pengeluaranDapur; const totalUangFisikDigital = (kas.cash || 0) + (kas.qris || 0) + (kas.gojek || 0) + (kas.grab || 0) + (kas.shopee || 0); const totalAktualUang = totalUangFisikDigital + totalStrukPengeluaran; const selisih = totalAktualUang - totalUangSeharusnya;

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
    setTxt('allocDarurat', formatRupiah(profitAlokasiBasis * 0.20)); 
    setTxt('allocAnak', formatRupiah(profitAlokasiBasis * 0.40)); 
    setTxt('allocLabaBersih', formatRupiah(profitAlokasiBasis * 0.40));

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
    const tgl = document.getElementById('tglOps').value; const items = dbStok[tgl] || []; const tbody = document.getElementById('tbodyBaksoSetoran'); if(!tbody) return; tbody.innerHTML = ''; let no = 1, totalPorsi = 0, totalOmset = 0, totalModal = 0, totalKeuntungan = 0; let sumAwal = 0, sumTambah = 0, sumKurang = 0, sumTotalStok = 0, sumSisa = 0; 
    items.filter(p => p.kategori === 'Bakso Malang').forEach(p => { const awal = parseFloat(p.awal) || 0; const tambah = parseFloat(p.tambah) || 0; const kurang = parseFloat(p.kurang) || 0; const totalStok = awal + tambah - kurang; const sisa = (p.sisa !== "" && p.sisa !== null) ? parseFloat(p.sisa) : null; const terjual = (sisa !== null && sisa <= totalStok) ? (totalStok - sisa) : 0; const valSisa = sisa !== null ? sisa : 0; const omset = terjual * p.jual; const modal = terjual * p.modal; const profit = terjual * p.margin; totalPorsi += terjual; totalOmset += omset; totalModal += modal; totalKeuntungan += profit; sumAwal += awal; sumTambah += tambah; sumKurang += kurang; sumTotalStok += totalStok; sumSisa += valSisa; const tr = document.createElement('tr'); tr.innerHTML = `<td style="text-align:center;">${no++}</td><td style="font-weight:700;">${p.nama}</td><td style="text-align:center; background:#fff7ed;">${awal}</td><td style="text-align:center; background:#dcfce7; color:#166534;">${tambah > 0 ? tambah : '-'}</td><td style="text-align:center; background:#fee2e2; color:#991b1b;">${kurang > 0 ? kurang : '-'}</td><td style="text-align:center; background:#f1f5f9; font-weight:800; color:#0f172a;">${totalStok}</td><td style="text-align:center; font-weight:800; color:#0f172a; background:#eef2ff;">${sisa !== null ? terjual : 0}</td><td style="text-align:center; color:#dc2626; font-weight:800; background:#fef2f2;">${sisa !== null ? valSisa : '-'}</td><td style="text-align:right;">${formatRupiah(p.modal)}</td><td style="text-align:right;">${formatRupiah(p.jual)}</td><td style="font-weight:600; text-align:right;">${formatRupiah(omset)}</td><td style="color:#16a34a; font-weight:800; text-align:right;">${formatRupiah(profit)}</td>`; tbody.appendChild(tr); });
    if (sumTotalStok > 0 || totalPorsi > 0) { const trTotal = document.createElement('tr'); trTotal.style.cssText = "background:#fed7aa; font-weight:800; font-size:0.85rem; border-top: 2px solid #ea580c;"; trTotal.innerHTML = `<td colspan="2" style="text-align:center;">TOTAL QTY</td><td style="text-align:center;">${sumAwal}</td><td style="text-align:center; color:#166534;">${sumTambah}</td><td style="text-align:center; color:#991b1b;">${sumKurang}</td><td style="text-align:center; color:#0f172a;">${sumTotalStok}</td><td style="text-align:center; color:#0f172a;">${totalPorsi}</td><td style="text-align:center; color:#b91c1c;">${sumSisa}</td><td colspan="4" style="background:#f8fafc;"></td>`; tbody.appendChild(trTotal); }
    
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
    const tgl = document.getElementById('tglOps').value; const items = dbStok[tgl] || []; let totalModalBakso = 0, omsetLebihanBakso = 0, modalReseller = 0, profitKotor = 0;
    items.forEach(p => { const awal = parseFloat(p.awal) || 0; const tambah = parseFloat(p.tambah) || 0; const kurang = parseFloat(p.kurang) || 0; const totalStok = awal + tambah - kurang; const sisa = (p.sisa !== "" && p.sisa !== null) ? parseFloat(p.sisa) : null; if (sisa !== null && sisa <= totalStok) { const terjual = totalStok - sisa; profitKotor += (terjual * p.margin); if (p.kategori === 'Bakso Malang') totalModalBakso += (terjual * p.modal); else if (p.kategori === 'Reseller') { if (p.nama.toLowerCase().includes('lebihan bakso')) omsetLebihanBakso += (terjual * p.jual); else modalReseller += (terjual * p.modal); } } });
    const dataSetoran = dbSetoranDapur[tgl] || { cash: 0, pengeluaran: 0 }; const setoranTfBakso = Math.max(0, totalModalBakso - dataSetoran.cash - dataSetoran.pengeluaran); const gajiInfo = dbGajiHarian[tgl] || { nominal: 50000 }; const totalPengeluaranHarian = dbPengeluaranHarian.filter(p => p.tgl === tgl).reduce((acc, curr) => acc + curr.nominal, 0); const profitBersih = profitKotor - (gajiInfo.nominal || 0) - totalPengeluaranHarian; const alokasiBasis = Math.max(0, profitBersih); const danaDarurat = alokasiBasis * 0.20, labaBersih = alokasiBasis * 0.40, tabAnak = alokasiBasis * 0.40; const totalA = setoranTfBakso + modalReseller + omsetLebihanBakso + danaDarurat + labaBersih + tabAnak;
    
    const setTxt = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
    setTxt('rtTfBakso', formatRupiah(setoranTfBakso)); setTxt('rtKasReseller', formatRupiah(modalReseller)); setTxt('rtKasPlastik', formatRupiah(omsetLebihanBakso)); setTxt('rtKasDarurat', formatRupiah(danaDarurat)); setTxt('rtKasLaba', formatRupiah(labaBersih)); setTxt('rtKasAnak', formatRupiah(tabAnak)); setTxt('rtTotalA', formatRupiah(totalA));
    const kas = dbKasMasuk[tgl] || { qris: 0, gojek: 0, grab: 0, shopee: 0, modalBesok: 0 }; const totalB = (kas.qris||0) + (kas.gojek||0) + (kas.grab||0) + (kas.shopee||0) + (kas.modalBesok||0);
    setTxt('rtQris', formatRupiah(kas.qris)); setTxt('rtGojek', formatRupiah(kas.gojek)); setTxt('rtGrab', formatRupiah(kas.grab)); setTxt('rtShopee', formatRupiah(kas.shopee)); setTxt('rtModalBesok', formatRupiah(kas.modalBesok)); setTxt('rtTotalB', formatRupiah(totalB));
    
    const sisaSetor = totalA - totalB; const finalBox = document.getElementById('rtFinalBox'), finalValue = document.getElementById('rtFinalValue'), finalKet = document.getElementById('rtFinalKet');
    if (finalBox && finalValue && finalKet) {
        if (sisaSetor > 0) { finalBox.style.background = '#fff1f2'; finalBox.style.border = '2px solid #fda4af'; finalValue.style.color = '#be123c'; finalValue.innerText = formatRupiah(sisaSetor); finalKet.style.color = '#9f1239'; finalKet.innerText = "⚠️ Anda WAJIB MENGAMBIL uang fisik dari laci kasir sebesar nilai di atas untuk disetor tunai via ATM/Bank."; } else if (sisaSetor === 0) { finalBox.style.background = '#f0fdf4'; finalBox.style.border = '2px solid #86efac'; finalValue.style.color = '#15803d'; finalValue.innerText = formatRupiah(0); finalKet.style.color = '#166534'; finalKet.innerText = "✅ PAS! Uang tagihan hari ini persis menutupi semua uang digital & uang tertahan."; } else { finalBox.style.background = '#eff6ff'; finalBox.style.border = '2px solid #93c5fd'; finalValue.style.color = '#1d4ed8'; finalValue.innerText = `+ ${formatRupiah(Math.abs(sisaSetor))}`; finalKet.style.color = '#1e3a8a'; finalKet.innerText = "✨ SURPLUS DIGITAL! Tagihan tertutup sepenuhnya. Angka di atas adalah sisa uang lebih di saldo digital Anda."; }
    }
}

function renderRekapGajiBulanan() {
    const bln = document.getElementById('filterBulanGaji').value; if(!bln) return;
    let totalHadirUtama = 0; let totalLiburUtama = 0; let totalGajiUtamaDiambil = 0; let totalGajiTambahanDiambil = 0; const validDates = Object.keys(dbStok).filter(tgl => tgl.startsWith(bln)).sort();
    validDates.forEach(tgl => { const dataGaji = dbGajiHarian[tgl] || { utama: true, tambahan: 0, nominal: 50000 }; if (dataGaji.utama === true) { totalHadirUtama++; totalGajiUtamaDiambil += 50000; } else { totalLiburUtama++; } totalGajiTambahanDiambil += (dataGaji.tambahan * 50000); });
    let potongan = 0; if (totalLiburUtama > 2) { potongan = (totalLiburUtama - 2) * 50000; } const gajiPokok = 1500000; const gajiBersihTF = gajiPokok - potongan;
    
    const setTxt = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
    setTxt('gbHariKerja', `${totalHadirUtama} Hari Masuk`); setTxt('gbHariLibur', `${totalLiburUtama} Hari`); setTxt('gbPotonganLibur', formatRupiah(potongan)); setTxt('gbGajiUtamaTF', formatRupiah(gajiBersihTF)); setTxt('gbUangHarianUtama', formatRupiah(totalGajiUtamaDiambil)); setTxt('gbUangHarianTambahan', formatRupiah(totalGajiTambahanDiambil)); setTxt('gbTotalHarianLaci', formatRupiah(totalGajiUtamaDiambil + totalGajiTambahanDiambil));
}

function hitungAkumulasiKasTotal() { 
    let kasReseller = 0, kasPlastik = 0, kasDarurat = 0, kasLaba = 0, kasAnak = 0; 
    const validDates = Object.keys(dbStok).filter(tgl => tgl.match(/^\d{4}-\d{2}-\d{2}$/)).sort(); 

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
        const gajiHarian = dbGajiHarian[tgl] ? dbGajiHarian[tgl].nominal : 50000;
        const pBersih = pKotor - gajiHarian - pengeluaranHarianBulan; 
        const basis = Math.max(0, pBersih); 

        kasReseller += modalReseller; 
        kasPlastik += omsetLebihan; 
        kasDarurat += (basis * 0.20); 
        kasLaba += (basis * 0.40); 
        kasAnak += (basis * 0.40); 
    }); 

    dbLogKas.forEach(l => { 
        const n = l.tipe === 'masuk' ? l.nominal : -l.nominal; 
        if (l.jenis === 'Reseller') kasReseller += n; 
        else if (l.jenis === 'Plastik') kasPlastik += n; 
        else if (l.jenis === 'Dana Darurat') kasDarurat += n; 
        else if (l.jenis === 'Laba Bersih') kasLaba += n; 
        else if (l.jenis === 'Tabungan Anak') kasAnak += n; 
    }); 

    const setTxt = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
    setTxt('sbKasReseller', formatRupiah(kasReseller)); 
    setTxt('sbKasPlastik', formatRupiah(kasPlastik)); 
    setTxt('sbKasDarurat', formatRupiah(kasDarurat)); 
    setTxt('sbKasLaba', formatRupiah(kasLaba)); 
    setTxt('sbKasAnak', formatRupiah(kasAnak)); 

    if (typeof activeKasTab !== 'undefined') renderMutasiTabKas(activeKasTab); 
}

function gantiTabKas(jenis, el) { activeKasTab = jenis; document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active')); if(el) el.classList.add('active'); renderMutasiTabKas(jenis); }

function renderMutasiTabKas(jenis) { 
    const elNama = document.getElementById('txtNamaTabKas');
    if(elNama) elNama.innerText = `Kas ${jenis}`; 
    const tbody = document.getElementById('tbodyMutasiKas'); 
    if(!tbody) return;
    tbody.innerHTML = ''; 
    let mutasiList = []; 
    const validDates = Object.keys(dbStok).filter(tgl => tgl.match(/^\d{4}-\d{2}-\d{2}$/)).sort(); 

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
        const gajiHarian = dbGajiHarian[tgl] ? dbGajiHarian[tgl].nominal : 50000;
        const pB = Math.max(0, pKotor - gajiHarian - pengeluaranHarianBulan); 

        if (jenis === 'Reseller' && modalR > 0) mutasiList.push({ id: null, tgl, tipe: 'masuk', ket: 'Masuk: Modal Reseller', nominal: modalR, auto: true }); 
        else if (jenis === 'Plastik' && omsetL > 0) mutasiList.push({ id: null, tgl, tipe: 'masuk', ket: 'Masuk: Jual Plastik', nominal: omsetL, auto: true }); 
        else if (jenis === 'Dana Darurat' && pB > 0) mutasiList.push({ id: null, tgl, tipe: 'masuk', ket: 'Masuk: Profit (20%)', nominal: pB * 0.20, auto: true }); 
        else if (jenis === 'Laba Bersih' && pB > 0) mutasiList.push({ id: null, tgl, tipe: 'masuk', ket: 'Masuk: Profit (40%)', nominal: pB * 0.40, auto: true }); 
        else if (jenis === 'Tabungan Anak' && pB > 0) mutasiList.push({ id: null, tgl, tipe: 'masuk', ket: 'Masuk: Profit (40%)', nominal: pB * 0.40, auto: true }); 
    }); 

    dbLogKas.forEach(l => { 
        if (l.jenis === jenis) mutasiList.push({ ...l, auto: false }); 
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
    const select=document.getElementById('selectKategoriProduk'); 
    if(select) {
        select.innerHTML=''; daftarKategori.forEach(k=>{select.innerHTML+=`<option value="${k}">${k}</option>`}); 
    }
    document.getElementById('editIndexProduk').value="-1"; 
    document.getElementById('inputNamaProduk').value=""; 
    document.getElementById('inputModalProduk').value=""; 
    document.getElementById('inputJualProduk').value=""; 
    document.getElementById('inputMarginProduk').value=""; 
    document.getElementById('inputStokGudang').value="0"; 
    document.getElementById('inputBatasMinimum').value="10"; 
    
    document.getElementById('btnSimpanProduk').innerText="Simpan"; 
    renderTabelMasterProduk(); 
    document.getElementById('modalKelolaProduk').classList.add('active'); 
}

function tutupModalKelolaProduk() { document.getElementById('modalKelolaProduk').classList.remove('active'); }

function tambahKategoriBaruPrompt() { const k=prompt("Nama Kategori Baru:"); if(k&&k.trim()){ daftarKategori.push(k.trim()); if(db)db.collection('cabang').doc(CABANG_AKTIF).collection('appData').doc('daftarKategori').set({list:daftarKategori}); bukaModalKelolaProduk(); } }

function hitungMarginForm() { document.getElementById('inputMarginProduk').value=Math.max(0,(parseFloat(document.getElementById('inputJualProduk').value)||0)-(parseFloat(document.getElementById('inputModalProduk').value)||0)); }

function simpanProdukBaru(e) { 
    e.preventDefault(); 
    const p = {
        nama: document.getElementById('inputNamaProduk').value.trim(), 
        kategori: document.getElementById('selectKategoriProduk').value, 
        modal: parseFloat(document.getElementById('inputModalProduk').value) || 0, 
        jual: parseFloat(document.getElementById('inputJualProduk').value) || 0, 
        margin: 0,
        stokGudang: parseFloat(document.getElementById('inputStokGudang').value) || 0,
        batasMinimum: parseFloat(document.getElementById('inputBatasMinimum').value) || 10
    }; 
    p.margin = p.jual - p.modal; 

    const idx = parseInt(document.getElementById('editIndexProduk').value); 
    const aksiTeks = idx >= 0 ? `Mengubah/Edit produk "${p.nama}" (Jual: Rp ${p.jual.toLocaleString('id-ID')})` : `Menambahkan produk baru "${p.nama}"`;

    if(idx >= 0) masterProduk[idx] = p; 
    else masterProduk.push(p); 
    catatAktivitas('Master Produk', aksiTeks);

    if(db) {
        db.collection('cabang').doc(CABANG_AKTIF).collection('appData').doc('masterProduk').set({ list: masterProduk })
        .then(() => { 
            bukaModalKelolaProduk(); 
            alert("Berhasil disimpan!"); 
        }); 
    } else { 
        bukaModalKelolaProduk(); 
        alert("Lokal OK"); 
    } 
}

function renderTabelMasterProduk() { 
    const t = document.getElementById('tbodyMasterProduk'); 
    if(!t) return;
    t.innerHTML = ''; 
    masterProduk.forEach((p, i) => { 
        const gudang = parseFloat(p.stokGudang) || 0;
        const batas = parseFloat(p.batasMinimum) || 0;
        
        let warnaBatas = (batas > 0 && gudang <= batas) 
            ? 'color: #dc2626; font-weight: bold; background: #fef2f2;' 
            : 'color: #64748b; background: #f8fafc; font-weight: 600;';  

        t.innerHTML += `<tr>
            <td style="text-align:center;">${i+1}</td>
            <td><strong>${p.nama}</strong><br><small>${p.kategori}</small></td>
            <td style="text-align:right;">${p.modal}</td>
            <td style="text-align:right;">${p.jual}</td>
            <td style="text-align:center; font-weight:bold; color:#0284c7; background:#f0f9ff; font-size:1rem;">${gudang}</td>
            <td style="text-align:center; font-size:0.95rem; ${warnaBatas}">${batas}</td>
            <td style="text-align:center;">
                <button onclick="editProdukMaster(${i})" style="border:none; background:transparent; font-size:1.2rem; cursor:pointer;" title="Edit">✏️</button>
                <button onclick="hapusProdukMaster(${i})" style="border:none; background:transparent; font-size:1.2rem; cursor:pointer;" title="Hapus">🗑️</button>
            </td>
        </tr>`; 
    }); 
}

function editProdukMaster(i) { 
    const select = document.getElementById('selectKategoriProduk'); 
    if(select) {
        select.innerHTML = ''; 
        daftarKategori.forEach(k => { select.innerHTML += `<option value="${k}">${k}</option>` });
    }
    
    const p = masterProduk[i]; 
    document.getElementById('editIndexProduk').value = i; 
    document.getElementById('inputNamaProduk').value = p.nama; 
    document.getElementById('selectKategoriProduk').value = p.kategori; 
    document.getElementById('inputModalProduk').value = p.modal; 
    document.getElementById('inputJualProduk').value = p.jual; 
    
    document.getElementById('inputStokGudang').value = p.stokGudang || 0;
    document.getElementById('inputBatasMinimum').value = p.batasMinimum || 10;
    
    hitungMarginForm(); 
    document.getElementById('btnSimpanProduk').innerText = "Update"; 
    document.getElementById('modalKelolaProduk').classList.add('active');
}

function hapusProdukMaster(i) { 
    if(confirm("Hapus produk dari master?")) { 
        const namaProd = masterProduk[i]?.nama || 'Produk';
        masterProduk.splice(i, 1); 
        catatAktivitas('Master Produk', `Menghapus produk "${namaProd}" dari daftar Master Produk`);
        if(db) db.collection('cabang').doc(CABANG_AKTIF).collection('appData').doc('masterProduk').set({ list: masterProduk }); 
        renderTabelMasterProduk(); 
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
        .sort((a,b) => b.qty - a.qty);

    const optHorizontalBar = { 
        indexAxis: 'y', 
        responsive: true, 
        maintainAspectRatio: false, 
        layout: { padding: { right: 30 } }, 
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
            x: { beginAtZero: true, display: false }, 
            y: { 
                grid: { display: false }, 
                ticks: { 
                    autoSkip: false, 
                    font: { size: 9 } 
                } 
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
    element.style.display = 'block'; 

    html2pdf().set({ 
        margin: 15, 
        filename: `Slip_Gaji_${bln}.pdf`, 
        image: { type: 'jpeg', quality: 0.98 }, 
        html2canvas: { scale: 2 }, 
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }, 
        pagebreak: { mode: 'avoid-all' } 
    }).output('blob').then(function(pdfBlob) { 
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
    });
}

// ==========================================
// FUNGSI CSV & LAINNYA
// ==========================================
function downloadTemplatePagi() { const tgl = document.getElementById('tglOps').value; let csv = 'Kategori;Nama Produk;Stok Awal;Tambah;Kurang;Stok Sisa\n'; (dbStok[tgl] || masterProduk).forEach(p => { csv += `${p.kategori};${p.nama};${p.awal || 0};${p.tambah || 0};${p.kurang || 0};${p.sisa || ""}\n`; }); const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' })); link.download = `Stok_Harian_${tgl}.csv`; link.click(); }
function importStokPagi(event) { if(isDataLocked(document.getElementById('tglOps').value)) { alert("Data terkunci! Silakan buka gembok terlebih dahulu."); return; } const file = event.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = function(e) { const tgl = document.getElementById('tglOps').value; if (!dbStok[tgl]) syncStokDenganMaster(tgl); e.target.result.split('\n').forEach((line, index) => { if (index === 0 || !line.trim()) return; const cols = line.split(';'); if (cols.length >= 3) { const idx = dbStok[tgl].findIndex(p => p.nama.toLowerCase() === cols[1].trim().toLowerCase()); if (idx !== -1) { dbStok[tgl][idx].awal = cols[2].trim(); if (cols[3]) dbStok[tgl][idx].tambah = cols[3].trim(); if (cols[4]) dbStok[tgl][idx].kurang = cols[4].trim(); if (cols[5]) dbStok[tgl][idx].sisa = cols[5].trim(); } } }); if(db) db.collection('cabang').doc(CABANG_AKTIF).collection('stokHarian').doc(tgl).set({ items: dbStok[tgl] }).then(() => { renderTabelMatriks(); updateKalkulasi(); alert('✅ Import OK'); }); else { renderTabelMatriks(); updateKalkulasi(); alert('✅ Import Lokal OK'); } }; reader.readAsText(file); }

function bagikanAplikasi() {
    if (navigator.share) {
        navigator.share({
            title: "Aplikasi Kasir Bakso Mbak Sae'ah",
            text: "Ini link untuk mengakses Aplikasi Kasir Bakso Malang Mbak Sae'ah Cab. Cipete. Silakan buka dan simpan di HP kamu ya!",
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

    const konfigurasiPDF = {
        margin:     0.5,
        filename:   `Laporan_Cabang_Cipete_${periode}.pdf`,
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

    let teksWA = `*📊 LAPORAN BAKSO MBAK SAE'AH CAB. CIPETE* 📊\n`;
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
    const selectCabangTugas = document.getElementById('inAkunCabangTugas'); // KODE BARU
    
    if(!tbody) return;
    
    db.collection('daftarCabang').onSnapshot(snap => {
        tbody.innerHTML = '';
        if (selectCabangTugas) selectCabangTugas.innerHTML = ''; // KODE BARU: Kosongkan dulu agar tidak ganda
        
        snap.forEach(doc => {
            const data = doc.data();
            const btnHapus = (data.id === 'cipete_utara') ? 
                `<span style="color:#94a3b8; font-size:0.75rem; font-style:italic;">Pusat (Patokan)</span>` : 
                `<button onclick="hapusCabang('${data.id}', '${data.nama}')" style="background:#ef4444; color:#fff; border:none; padding:4px 8px; border-radius:4px; font-size:0.7rem; cursor:pointer;">Hapus</button>`;
                
            // 1. Mengisi Tabel Kelola Cabang
            tbody.innerHTML += `
                <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 8px;"><strong>${data.nama}</strong></td>
                    <td style="padding: 8px; text-align: right;">${btnHapus}</td>
                </tr>
            `;
            
            // 2. KODE BARU: Mengisi Dropdown Cabang Tugas di Form Tambah Akun
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
