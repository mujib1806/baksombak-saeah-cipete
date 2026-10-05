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
let CABANG_AKTIF = localStorage.getItem('cabangAktif');
if (!CABANG_AKTIF) {
    alert("⚠️ PERHATIAN: Cabang belum dipilih!\n\nSistem tidak mendeteksi nama cabang di memori. Mohon kembali ke halaman 'Pilih Cabang' agar data tidak tumpang tindih.");
    CABANG_AKTIF = 'cabang_belum_dipilih'; 
}

const configSistem = firebase.app().options; 
const aplikasiPendaftaran = firebase.initializeApp(configSistem, "JalurDaftar");
const defaultMasterProduk = []; 
const defaultKategori = ["Bakso Malang", "Reseller"];
const defaultVendorCatalog = [];
let masterProduk = defaultMasterProduk;
let daftarKategori = defaultKategori;
let vendorCatalog = defaultVendorCatalog;
let dbStok = {}, dbPengeluaranHarian = [], dbKasMasuk = {}, dbLogKas = [], dbSetoranDapur = {}, dbGajiHarian = {}, dbStatusKunci = {};
let activeKasTab = 'Reseller';
let currentUser = null;
let riwayatStok = [];
function catatRiwayatStok(namaProduk, jenisAksi, jumlahPerubahan, sisaStokAkhir) {
    const now = new Date();
    const tglFormat = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    const jamFormat = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
    const waktuStr = `${tglFormat}, ${jamFormat}`;
    const tglIso = now.toISOString().split('T')[0]; 
    let namaUser = "Admin";
    if (typeof currentUser !== 'undefined' && currentUser && currentUser.role) {
        namaUser = currentUser.role;}
    const itemBaru = {
        waktu: waktuStr,
        tanggalIso: tglIso,
        produk: namaProduk,
        aksi: jenisAksi, 
        perubahan: jenisAksi === 'In' ? `+${jumlahPerubahan}` : `-${jumlahPerubahan}`,
        sisa: sisaStokAkhir,
        oleh: namaUser};
    riwayatStok.unshift(itemBaru);
    if (riwayatStok.length > 500) riwayatStok.pop(); 
    if (typeof db !== 'undefined' && db && typeof CABANG_AKTIF !== 'undefined') {
        db.collection('cabang').doc(CABANG_AKTIF).collection('appData').doc('riwayatStok').set({ list: riwayatStok }); }

    renderTabelRiwayatStok();
}
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
function simpanPengaturanFinansialCabang(e) {
    e.preventDefault();
    if (!db) return;
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
    const savedNamaCabang = localStorage.getItem('namaCabangAktif') || 'Cabang Cipete Utara';
    const bannerLabel = document.getElementById('labelCabangBanner');
    if (bannerLabel) bannerLabel.innerText = savedNamaCabang.replace('Cabang ', '');
    const headerLama = document.getElementById('headerNamaCabang');
    if (headerLama) headerLama.innerText = savedNamaCabang.replace('Cabang ', '');
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
    document.getElementById('menuSetoran').style.display = 'block';        
    document.getElementById('menuTransfer').style.display = isOwner ? 'block' : 'none';        
    document.getElementById('menuMutasi').style.display = isOwner ? 'block' : 'none';        
    document.getElementById('menuGaji').style.display = isOwner ? 'block' : 'none';      
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
    if (typeof muatDaftarCabangKontrol === 'function') {
        muatDaftarCabangKontrol();
    }
}
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
function simpanAkunBaru(e) { 
    e.preventDefault(); 
    const nama = document.getElementById('regNama').value.trim(); 
    const hp = document.getElementById('regHp').value.trim(); 
    const password = document.getElementById('regPass').value.trim(); 
    const role = document.getElementById('regRole').value; 
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

    // LISTENER MASTER PRODUK (DIPERBAIKI)
    db.collection('cabang').doc(CABANG_AKTIF).collection('appData').doc('masterProduk').onSnapshot(doc => {  
        if (doc.exists && doc.data().list) {  
            masterProduk = doc.data().list;  
            window.masterProduk = doc.data().list;
        } else {  
            masterProduk = [...defaultMasterProduk];  
            window.masterProduk = [...defaultMasterProduk];
            db.collection('cabang').doc(CABANG_AKTIF).collection('appData').doc('masterProduk').set({ list: masterProduk });  
        }  
        
        const activeEl = document.activeElement;
        const isTypingStok = activeEl && (activeEl.classList.contains('input-stok') || activeEl.tagName === 'INPUT');
        
        if (!isTypingStok) {
            const tgl = document.getElementById('tglOps') ? document.getElementById('tglOps').value : '';
            if (tgl) {
                syncStokDenganMaster(tgl);
            }
            renderTabelMasterProduk();  
            renderTabelMatriks();
            updateKalkulasi();
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

    // LISTENER STOK HARIAN (DIPERBAIKI AGAR TIDAK MENGHAPUS PRODUK BARU)
    db.collection('cabang').doc(CABANG_AKTIF).collection('stokHarian').onSnapshot(snapshot => { 
        snapshot.forEach(doc => { dbStok[doc.id] = doc.data().items; }); 
        const tgl = document.getElementById('tglOps') ? document.getElementById('tglOps').value : ''; 
        if (tgl && (!document.activeElement || !document.activeElement.classList.contains('input-stok'))) { 
            syncStokDenganMaster(tgl);
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

    // 1. Kumpulkan semua ID halaman ke dalam satu wadah
    const daftarView = [
        'viewHarian', 'viewSetoranBakso', 'viewRekapTransfer', 'viewMutasiKas', 
        'viewGajiBulanan', 'viewDashboard', 'viewOrderVendor', 'viewRiwayatAktivitas', 
        'viewProduk', 'viewLaporanBerkala', 'viewPusatKontrol', 'viewDashboardGlobal',
        'cardAlokasiHarian'
    ];

    // 2. Sembunyikan semuanya dengan AMAN
    daftarView.forEach(id => {
        const elemen = document.getElementById(id);
        if (elemen) {
            elemen.style.display = 'none';
        }
    });

    // 3. Tampilkan halaman yang dipilih dengan AMAN
    if (jenis === 'harian') {    
        const view = document.getElementById('viewHarian');
        if (view) view.style.display = 'block';    
        
        const cardAlokasi = document.getElementById('cardAlokasiHarian');
        if (cardAlokasi) cardAlokasi.style.display = isOwner ? 'block' : 'none';
        
        if (typeof cekPeringatanStok === 'function') cekPeringatanStok();
        
    } else if (jenis === 'setoranBakso') {    
        const view = document.getElementById('viewSetoranBakso');
        if (view) view.style.display = 'block';   
        
        const cardDapur = document.getElementById('cardSetoranDapur');
        if (cardDapur) cardDapur.style.display = 'block';
        
        if (typeof renderViewSetoranBakso === 'function') renderViewSetoranBakso();    
        
    } else if (jenis === 'rekapTransfer') {    
        const view = document.getElementById('viewRekapTransfer');
        if (view) view.style.display = 'block';    
        if (typeof renderViewRekapTransfer === 'function') renderViewRekapTransfer();    
        
    } else if (jenis === 'mutasiKas') {    
        const view = document.getElementById('viewMutasiKas');
        if (view) view.style.display = 'block';    
        if (typeof hitungAkumulasiKasTotal === 'function') hitungAkumulasiKasTotal();    
        
    } else if (jenis === 'gajiBulanan') {
        const view = document.getElementById('viewGajiBulanan');
        if (view) view.style.display = 'block';
        if (typeof renderRekapGajiBulanan === 'function') renderRekapGajiBulanan();
        
    } else if (jenis === 'dashboard') {
        const view = document.getElementById('viewDashboard');
        if (view) view.style.display = 'block';
        if (typeof renderDashboardGrafik === 'function') renderDashboardGrafik();
        
    } else if (jenis === 'dashboardGlobal') {
        const view = document.getElementById('viewDashboardGlobal');
        if (view) view.style.display = 'block';
        if (typeof renderDashboardGlobal === 'function') renderDashboardGlobal();
        
    } else if (jenis === 'orderVendor') {
        const view = document.getElementById('viewOrderVendor');
        if (view) view.style.display = 'block';
        
        if (typeof renderFormOrderVendor === 'function') renderFormOrderVendor();
        else if (typeof renderOrderVendor === 'function') renderOrderVendor();
        
        if (typeof cekPeringatanStok === 'function') cekPeringatanStok(); 
        
    } else if (jenis === 'riwayatAktivitas') {
        const view = document.getElementById('viewRiwayatAktivitas');
        if (view) view.style.display = 'block';
        if (typeof muatDataRiwayat === 'function') muatDataRiwayat();
        
    } else if (jenis === 'produk') {
        const view = document.getElementById('viewProduk');
        if (view) view.style.display = 'block';
        
        // Ambil data terbaru dari Firebase lalu render tabel
        if (typeof db !== 'undefined' && db !== null && typeof CABANG_AKTIF !== 'undefined') {
            db.collection('cabang').doc(CABANG_AKTIF).collection('appData').doc('masterProduk').get()
            .then((doc) => {
                if (doc.exists && doc.data().list) {
                    window.masterProduk = doc.data().list;
                } else {
                    window.masterProduk = [];
                }
                if (typeof renderTabelMasterProduk === 'function') renderTabelMasterProduk();
            }).catch(err => {
                console.error("Gagal load master produk:", err);
                if (typeof renderTabelMasterProduk === 'function') renderTabelMasterProduk();
            });
        } else {
            if (typeof renderTabelMasterProduk === 'function') renderTabelMasterProduk();
        }
        
    } else if (jenis === 'laporanBerkala') {
        const view = document.getElementById('viewLaporanBerkala');
        if (view) view.style.display = 'block';
        
    } else if (jenis === 'pusatKontrol') {
        const view = document.getElementById('viewPusatKontrol');
        if (view) view.style.display = 'block';
        
        if (typeof muatDaftarAkun === 'function') muatDaftarAkun();
        if (typeof renderDaftarCabang === 'function') renderDaftarCabang();
        if (typeof renderDaftarAkun === 'function') renderDaftarAkun();
    }
}
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
// FUNGSI INTI STOK & KALKULASI (ENTRY HARIAN)
// ==========================================
function cekDanTarikDataKemarin(tgl) {
    if (isDataLocked(tgl)) return;
    
    let dateObj = new Date(tgl); 
    dateObj.setDate(dateObj.getDate() - 1);
    let y = dateObj.getFullYear(); 
    let m = String(dateObj.getMonth() + 1).padStart(2, '0'); 
    let d = String(dateObj.getDate()).padStart(2, '0');
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
                            // 👉 PERBARUAN: Baik Reseller maupun Bakso Malang, 
                            // Stok Awal Hari Ini = Stok Sisa Hari Kemarin
                            if ((p.kategori === 'Reseller' || p.kategori === 'Bakso Malang') && pKemarin.sisa !== "" && pKemarin.sisa !== null) { 
                                dbStok[tgl][idx].awal = pKemarin.sisa; 
                                needsUpdateUI = true; 
                            }
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

    // Penarikan Modal Laci / Petty Cash dari modalBesok kemarin
    if (isKemarinLocked && dbKasMasuk[tglKemarin]) {
        let kasHariIni = dbKasMasuk[tgl] || { cash: 0, qris: 0, gojek: 0, grab: 0, shopee: 0, petty: 0, modalBesok: 0 };
        let pettyKemarin = dbKasMasuk[tglKemarin].modalBesok || 0;
        
        if (kasHariIni.petty !== pettyKemarin) { 
            kasHariIni.petty = pettyKemarin; 
            dbKasMasuk[tgl] = kasHariIni; 
            if (db) { 
                db.collection('cabang').doc(CABANG_AKTIF).collection('kasMasuk').doc(tgl).set(kasHariIni); 
            } 
            needsUpdateUI = true; 
        }
    }

    // Auto-update UI jika tidak ada input yang sedang diketik oleh user
    if (needsUpdateUI && document.activeElement && document.activeElement.tagName !== 'INPUT') { 
        renderTabelMatriks(); 
        loadKasMasukUI(); 
        updateKalkulasi(); 
    }
}
function syncStokDenganMaster(tgl) { 
    if (!masterProduk || !Array.isArray(masterProduk)) return;

    // Jika data stok tanggal ini belum ada di memori lokal, buat baru berdasarkan Master Produk
    if (!dbStok[tgl]) { 
        dbStok[tgl] = masterProduk.map(mp => ({
            nama: mp.nama,
            kategori: mp.kategori,
            modal: mp.modal || 0,
            jual: mp.jual || 0,
            margin: mp.margin || 0,
            awal: "",
            tambah: "",
            kurang: "",
            sisa: ""
        })); 
    } else { 
        // Jika sudah ada data stok harian, selaraskan dengan Master Produk TANPA menghapus data isian
        let currentStok = dbStok[tgl]; 
        let newStokList = []; 
        
        masterProduk.forEach(mp => { 
            let found = currentStok.find(item => item.nama === mp.nama); 
            if (found) { 
                // Pertahankan seluruh nilai isian stok yang sudah diinput oleh user
                newStokList.push({ 
                    ...found,
                    nama: mp.nama,
                    kategori: mp.kategori,
                    modal: mp.modal || 0,
                    jual: mp.jual || 0,
                    margin: mp.margin || 0,
                    awal: (found.awal !== undefined && found.awal !== null) ? found.awal : "", 
                    tambah: (found.tambah !== undefined && found.tambah !== null) ? found.tambah : "", 
                    kurang: (found.kurang !== undefined && found.kurang !== null) ? found.kurang : "", 
                    sisa: (found.sisa !== undefined && found.sisa !== null) ? found.sisa : "" 
                }); 
            } else { 
                // Jika ada item baru di Master Produk, tambahkan dengan isian kosong
                newStokList.push({ 
                    nama: mp.nama,
                    kategori: mp.kategori,
                    modal: mp.modal || 0,
                    jual: mp.jual || 0,
                    margin: mp.margin || 0,
                    awal: "", 
                    tambah: "", 
                    kurang: "", 
                    sisa: "" 
                }); 
            } 
        }); 
        dbStok[tgl] = newStokList; 
    }
    // Catatan: Penulisan otomatis ke Firebase secara paksa dihilangkan dari sini 
    // agar tidak menimpa data input harian kasir yang sedang berjalan.
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
// ==========================================
// FUNGSI UPDATE STOK HARIAN (LOKAL MURNI - TIPE CEPAT & TANPA LAG)
// ==========================================
function updateNilaiStokLokal(idx, tipe, val) {   
    const tgl = document.getElementById('tglOps').value;   
    if (!dbStok[tgl]) syncStokDenganMaster(tgl);   
    
    const p = dbStok[tgl][idx];
    if (!p) return;

    // 1. Simpan nilai ke memori lokal dbStok
    if (tipe === 'tambah') dbStok[tgl][idx].tambah = val; 
    else if (tipe === 'awal') dbStok[tgl][idx].awal = val;   
    else if (tipe === 'kurang') dbStok[tgl][idx].kurang = val;   
    else if (tipe === 'sisa') dbStok[tgl][idx].sisa = val;   

    // 2. Hitung matematika lokal (Total & Terjual)
    const awal = parseFloat(p.awal) || 0;   
    const tambah = parseFloat(p.tambah) || 0;   
    const kurang = parseFloat(p.kurang) || 0;   
    const totalStok = awal + tambah - kurang;   
    const sisa = (p.sisa !== "" && p.sisa !== null) ? parseFloat(p.sisa) : null;   
    let terjual = (sisa !== null && sisa <= totalStok) ? (totalStok - sisa) : 0;   

    // 3. Update tampilan teks di sel tabel saja (Tanpa re-render tabel)
    const elTotal = document.getElementById('td_total_' + idx);   
    if (elTotal) elTotal.innerText = totalStok;   
    const elTerjual = document.getElementById('td_terjual_' + idx);   
    if (elTerjual) elTerjual.innerText = (sisa !== null) ? terjual : '-';   

    // 4. Hitung kalkulasi kas secara ringan (jika ada)
    if (typeof updateKalkulasi === 'function') updateKalkulasi();   

    // 👉 BERSIH: Tidak ada koneksi Firebase & log riwayat saat mengetik!
}

// ==========================================
// FUNGSI BARU: SIMPAN STOK HARIAN MASAL KE FIREBASE (KLIK TOMBOL)
// ==========================================
async function simpanStokHarianMasal() {
    const tgl = document.getElementById('tglOps').value;
    if (typeof isDataLocked === 'function' && isDataLocked(tgl)) {
        alert("Data hari ini terkunci! Buka gembok terlebih dahulu.");
        return;
    }

    if (!confirm(`Simpan seluruh perubahan stok harian untuk tanggal ${tgl}?`)) return;

    const btn = document.getElementById('btnSimpanStokHarianMasal');
    if (btn) {
        btn.innerText = "⏳ Menyimpan...";
        btn.disabled = true;
        btn.style.backgroundColor = "#eab308"; // Kuning loading
    }

    try {
        // 1. Sinkronkan pemotongan stok gudang ke Master Produk untuk items yang bertambah
        let janjiRiwayat = [];
        if (dbStok[tgl] && Array.isArray(dbStok[tgl])) {
            dbStok[tgl].forEach(p => {
                const tambahVal = parseFloat(p.tambah) || 0;
                if (tambahVal > 0) {
                    const masterIdx = masterProduk.findIndex(mp => mp.nama === p.nama);
                    if (masterIdx !== -1) {
                        let keluarSekarang = parseFloat(masterProduk[masterIdx].keluarEtalase) || 0;
                        let awalGudang = parseFloat(masterProduk[masterIdx].stokAwalGudang) || 0;
                        
                        // Hitung keluar etalase baru
                        masterProduk[masterIdx].keluarEtalase = keluarSekarang + tambahVal;
                        let sisaGudangBaru = awalGudang - masterProduk[masterIdx].keluarEtalase - (parseFloat(masterProduk[masterIdx].stokRusak) || 0);

                        if (typeof catatRiwayatStok === 'function') {
                            janjiRiwayat.push(catatRiwayatStok(p.nama, 'Out', tambahVal, sisaGudangBaru));
                        }
                    }
                }
            });
        }

        // 2. Simpan Master Produk ke Firebase
        if (typeof db !== 'undefined' && db && typeof CABANG_AKTIF !== 'undefined') {
            await db.collection('cabang').doc(CABANG_AKTIF).collection('appData').doc('masterProduk').set({ list: masterProduk });
            
            // Simpan Data Stok Harian
            if (typeof simpanStokKeFirebase === 'function') {
                await simpanStokKeFirebase();
            }
        }

        // 3. Jalankan pencatatan riwayat paralel
        if (janjiRiwayat.length > 0) {
            await Promise.all(janjiRiwayat);
        }

        // 4. Update indikator tombol kembali hijau terang instan
        if (btn) {
            btn.innerText = "✅ Stok Harian Tersimpan";
            btn.style.backgroundColor = "#16a34a"; // Hijau terang
            btn.disabled = false;
        }

        if (typeof showToast === 'function') showToast("✅ Stok Harian & Gudang Berhasil Disimpan!");
        if (typeof hitungAkumulasiKasTotal === 'function') hitungAkumulasiKasTotal();

    } catch (err) {
        alert("Gagal menyimpan stok harian: " + err);
        if (btn) {
            btn.innerText = "💾 Simpan Stok Harian";
            btn.style.backgroundColor = "#16a34a";
            btn.disabled = false;
        }
    }
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

    const isOwnerOrDapur = currentUser && (currentUser.role === 'owner' || currentUser.role === 'dapur');

    // 👉 1. Menyembunyikan kolom tabel Modal, Jual, Omset, Profit
    document.querySelectorAll('.kolom-sensitif').forEach(el => {
        el.style.display = isOwnerOrDapur ? '' : 'none';
    });

    // 👉 2. Menyembunyikan kotak "Laporan Setoran Ke Dapur" khusus Kasir
    const sectionLaporan = document.getElementById('sectionLaporanSetoran');
    if (sectionLaporan) {
        sectionLaporan.style.display = isOwnerOrDapur ? 'block' : 'none';
    }

    // Sesuaikan Header Tabel secara dinamis agar bersih untuk Kasir
    const thead = tbody.parentElement.querySelector('thead');
    if (thead) {
        if (isOwnerOrDapur) {
            thead.innerHTML = `<tr>
                <th style="text-align:center;">No</th>
                <th>Varian Produk</th>
                <th style="text-align:center; width:55px;">Awal</th>
                <th style="text-align:center; width:55px;">Tambah</th>
                <th style="text-align:center; width:55px;">Kurang</th>
                <th style="text-align:center; width:55px;">Total</th>
                <th style="text-align:center; width:55px;">Laku</th>
                <th style="text-align:center; width:55px;">Sisa</th>
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
                <th style="text-align:center; width:55px;">Awal</th>
                <th style="text-align:center; width:55px;">Tambah</th>
                <th style="text-align:center; width:55px;">Kurang</th>
                <th style="text-align:center; width:55px;">Total</th>
                <th style="text-align:center; width:55px;">Laku</th>
                <th style="text-align:center; width:55px;">Sisa</th>
            </tr>`;
        }
    }

    let no = 1, totalPorsi = 0, totalOmset = 0, totalModal = 0, totalKeuntungan = 0; 
    let sumAwal = 0, sumTambah = 0, sumKurang = 0, sumTotalStok = 0, sumSisa = 0; 

    // Variable kunci lebar seragam 55px
    const styleColSama = "text-align:center; width:55px; min-width:55px; max-width:55px;";

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
        
        // Render baris data dengan ukuran sel seragam 55px
        if (isOwnerOrDapur) {
            tr.innerHTML = `
                <td style="text-align:center;">${no++}</td>
                <td style="font-weight:700;">${p.nama}</td>
                <td style="${styleColSama} background:#fff7ed; font-weight:600;">${awal}</td>
                <td style="${styleColSama} background:#dcfce7; color:#166534;">${tambah > 0 ? tambah : '-'}</td>
                <td style="${styleColSama} background:#fee2e2; color:#991b1b;">${kurang > 0 ? kurang : '-'}</td>
                <td style="${styleColSama} background:#f1f5f9; font-weight:800; color:#0f172a;">${totalStok}</td>
                <td style="${styleColSama} font-weight:800; color:#0f172a; background:#eef2ff;">${sisa !== null ? terjual : 0}</td>
                <td style="${styleColSama} color:#dc2626; font-weight:800; background:#fef2f2;">${sisa !== null ? valSisa : '-'}</td>
                <td style="text-align:right;">${typeof formatRupiah === 'function' ? formatRupiah(p.modal) : p.modal}</td>
                <td style="text-align:right;">${typeof formatRupiah === 'function' ? formatRupiah(p.jual) : p.jual}</td>
                <td style="font-weight:600; text-align:right;">${typeof formatRupiah === 'function' ? formatRupiah(omset) : omset}</td>
                <td style="color:#16a34a; font-weight:800; text-align:right;">${typeof formatRupiah === 'function' ? formatRupiah(profit) : profit}</td>
            `;
        } else {
            tr.innerHTML = `
                <td style="text-align:center;">${no++}</td>
                <td style="font-weight:700;">${p.nama}</td>
                <td style="${styleColSama} background:#fff7ed; font-weight:600;">${awal}</td>
                <td style="${styleColSama} background:#dcfce7; color:#166534;">${tambah > 0 ? tambah : '-'}</td>
                <td style="${styleColSama} background:#fee2e2; color:#991b1b;">${kurang > 0 ? kurang : '-'}</td>
                <td style="${styleColSama} background:#f1f5f9; font-weight:800; color:#0f172a;">${totalStok}</td>
                <td style="${styleColSama} font-weight:800; color:#0f172a; background:#eef2ff;">${sisa !== null ? terjual : 0}</td>
                <td style="${styleColSama} color:#dc2626; font-weight:800; background:#fef2f2;">${sisa !== null ? valSisa : '-'}</td>
            `;
        }
        tbody.appendChild(tr); 
    });

 // 👉 PENYERAGAMAN WARNA & STRUKTUR BARIS TOTAL QTY
    if (sumTotalStok > 0 || totalPorsi > 0) { 
        const trTotal = document.createElement('tr'); 
        trTotal.className = "row-total";
        
        const bgTotal = "background-color: #ffedd5 !important; font-weight: 800; color: #9a3412;";
        
        if (isOwnerOrDapur) {
            trTotal.innerHTML = `
                <td style="text-align:center; ${bgTotal}">TOTAL</td>
                <td style="text-align:center; ${bgTotal}">QTY</td>
                <td style="text-align:center; width:60px; ${bgTotal}">${sumAwal}</td>
                <td style="text-align:center; width:60px; ${bgTotal}">${sumTambah}</td>
                <td style="text-align:center; width:60px; ${bgTotal}">${sumKurang}</td>
                <td style="text-align:center; width:60px; ${bgTotal}">${sumTotalStok}</td>
                <td style="text-align:center; width:60px; ${bgTotal}">${totalPorsi}</td>
                <td style="text-align:center; width:60px; ${bgTotal}">${sumSisa}</td>
                <td colspan="4" style="${bgTotal}"></td>
            `;
        } else {
            trTotal.innerHTML = `
                <td style="text-align:center; ${bgTotal}">TOTAL</td>
                <td style="text-align:center; ${bgTotal}">QTY</td>
                <td style="text-align:center; width:60px; ${bgTotal}">${sumAwal}</td>
                <td style="text-align:center; width:60px; ${bgTotal}">${sumTambah}</td>
                <td style="text-align:center; width:60px; ${bgTotal}">${sumKurang}</td>
                <td style="text-align:center; width:60px; ${bgTotal}">${sumTotalStok}</td>
                <td style="text-align:center; width:60px; ${bgTotal}">${totalPorsi}</td>
                <td style="text-align:center; width:60px; ${bgTotal}">${sumSisa}</td>
            `;
        }
        tbody.appendChild(trTotal); 
    }
    
    const setTxt = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
    if (typeof formatRupiah === 'function') {
        setTxt('bmModalAwal', formatRupiah(totalModal)); 
        const dataSetoran = (typeof dbSetoranDapur !== 'undefined' && dbSetoranDapur[tgl]) ? dbSetoranDapur[tgl] : { cash: 0, ket: '', pengeluaran: 0 }; 
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
}
function renderViewRekapTransfer() {
    try {
        const tglEl = document.getElementById('tglOps');
        if (!tglEl) {
            console.log("Elemen tglOps tidak ditemukan");
            return;
        }
        const tgl = tglEl.value; 
        
        // Pengaman array dbStok
        const items = (typeof dbStok !== 'undefined' && dbStok && dbStok[tgl]) ? dbStok[tgl] : []; 
        let totalModalBakso = 0, omsetLebihanBakso = 0, modalReseller = 0, profitKotor = 0;
        
        if (Array.isArray(items)) {
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
                        if (p.nama && p.nama.toLowerCase().includes('lebihan bakso')) omsetLebihanBakso += (terjual * p.jual); 
                        else modalReseller += (terjual * p.modal); 
                    } 
                } 
            });
        }
        
        const dataSetoran = (typeof dbSetoranDapur !== 'undefined' && dbSetoranDapur && dbSetoranDapur[tgl]) ? dbSetoranDapur[tgl] : { cash: 0, pengeluaran: 0 }; 
        const setoranTfBakso = Math.max(0, totalModalBakso - (dataSetoran.cash || 0) - (dataSetoran.pengeluaran || 0)); 
        
        const configCabang = (typeof pengaturanCabangAktif !== 'undefined' && pengaturanCabangAktif) ? pengaturanCabangAktif : {};
        const nominalHarian = configCabang.gajiHarian || 50000;
        
        const gajiInfo = (typeof dbGajiHarian !== 'undefined' && dbGajiHarian && dbGajiHarian[tgl]) ? dbGajiHarian[tgl] : { nominal: nominalHarian }; 
        
        // Pengaman khusus untuk dbPengeluaranHarian (memastikan bentuknya Array sebelum di-filter)
        const totalPengeluaranHarian = (typeof dbPengeluaranHarian !== 'undefined' && Array.isArray(dbPengeluaranHarian)) 
            ? dbPengeluaranHarian.filter(p => p.tgl === tgl).reduce((acc, curr) => acc + (curr.nominal || 0), 0) 
            : 0; 
        
        const profitBersih = profitKotor - (gajiInfo.nominal || 0) - totalPengeluaranHarian; 
        const alokasiBasis = Math.max(0, profitBersih); 
        
        let p1Num = (configCabang.pos1 && configCabang.pos1.persen ? configCabang.pos1.persen : 20) / 100;
        let p2Num = (configCabang.pos2 && configCabang.pos2.persen ? configCabang.pos2.persen : 40) / 100;
        let p3Num = (configCabang.pos3 && configCabang.pos3.persen ? configCabang.pos3.persen : 40) / 100;

        const danaDarurat = alokasiBasis * p1Num; 
        const tabAnak = alokasiBasis * p2Num;
        const labaBersih = alokasiBasis * p3Num; 
        
        const totalA = setoranTfBakso + modalReseller + omsetLebihanBakso + danaDarurat + labaBersih + tabAnak;
        
        const setTxt = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
        
        setTxt('lblRtPos1', (configCabang.pos1 && configCabang.pos1.nama ? configCabang.pos1.nama : "Dana Darurat") + ":");
        setTxt('lblRtPos2', (configCabang.pos2 && configCabang.pos2.nama ? configCabang.pos2.nama : "Tabungan Anak") + ":");
        setTxt('lblRtPos3', (configCabang.pos3 && configCabang.pos3.nama ? configCabang.pos3.nama : "Laba Bersih") + ":");

        setTxt('rtTfBakso', formatRupiah(setoranTfBakso)); 
        setTxt('rtKasReseller', formatRupiah(modalReseller)); 
        setTxt('rtKasPlastik', formatRupiah(omsetLebihanBakso)); 
        setTxt('rtKasDarurat', formatRupiah(danaDarurat)); 
        setTxt('rtKasAnak', formatRupiah(tabAnak)); 
        setTxt('rtKasLaba', formatRupiah(labaBersih)); 
        setTxt('rtTotalA', formatRupiah(totalA));
        
        const kas = (typeof dbKasMasuk !== 'undefined' && dbKasMasuk && dbKasMasuk[tgl]) ? dbKasMasuk[tgl] : { qris: 0, gojek: 0, grab: 0, shopee: 0, modalBesok: 0 }; 
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

    } catch (error) {
        // INI JEBAKANNYA: Jika ada error, akan muncul popup!
        alert("Terjadi Error di Rekap Transfer:\n" + error.message);
        console.error("Detail Error:", error);
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
// ==========================================
// FUNGSI HITUNG AKUMULASI KAS TOTAL (TEROPTIMASI DEBOUNCE)
// ==========================================
let timerDebounceKasTotal = null;

function hitungAkumulasiKasTotal() {  
    // 1. Batalkan eksekusi sebelumnya jika user masih mengetik (mencegah lag CPU)
    clearTimeout(timerDebounceKasTotal);

    // 2. Tunda perhitungan berat selama 300 milidetik setelah ketikan terakhir
    timerDebounceKasTotal = setTimeout(() => {
        eksekusiHitungKasTotalSebenarnya();
    }, 300);
}

// Fungsi internal yang menjalankan kalkulasi berat
function eksekusiHitungKasTotalSebenarnya() {
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
        (dbStok[tgl] || []).forEach(p => {  
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

        const pengeluaranHarianBulan = (dbPengeluaranHarian || []).filter(p => p.tgl === tgl).reduce((acc, curr) => acc + (parseFloat(curr.nominal) || 0), 0);  
        const nominalGaji = pengaturanCabangAktif.gajiHarian || 50000; 
        const gajiHarian = dbGajiHarian && dbGajiHarian[tgl] ? dbGajiHarian[tgl].nominal : nominalGaji;
        const pBersih = pKotor - gajiHarian - pengeluaranHarianBulan;  
        const basis = Math.max(0, pBersih);  

        kasReseller += modalReseller;  
        kasPlastik += omsetLebihan;  
        kasDarurat += (basis * p1);  
        kasLaba += (basis * p3);      
        kasAnak += (basis * p2);      
    });  

    if (typeof dbLogKas !== 'undefined' && Array.isArray(dbLogKas)) {
        dbLogKas.forEach(l => {  
            const n = l.tipe === 'masuk' ? parseFloat(l.nominal) || 0 : -(parseFloat(l.nominal) || 0);  
            if (l.jenis === 'Reseller') kasReseller += n;  
            else if (l.jenis === 'Plastik') kasPlastik += n;  
            else if (l.jenis === n1 || l.jenis === 'Dana Darurat') kasDarurat += n;  
            else if (l.jenis === n3 || l.jenis === 'Laba Bersih') kasLaba += n;  
            else if (l.jenis === n2 || l.jenis === 'Tabungan Anak') kasAnak += n;  
        });  
    }

    const setTxt = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
    setTxt('sbKasReseller', formatRupiah(kasReseller));  
    setTxt('sbKasPlastik', formatRupiah(kasPlastik));  
    setTxt('sbKasDarurat', formatRupiah(kasDarurat));  
    setTxt('sbKasLaba', formatRupiah(kasLaba));  
    setTxt('sbKasAnak', formatRupiah(kasAnak));  

    setTxt('lblCardPos1', n1);
    setTxt('lblCardPos3', n3);
    setTxt('lblCardPos2', n2);

    const elTab1 = document.getElementById('btnTabPos1'); if(elTab1) elTab1.innerText = `🛡️ ${n1}`;
    const elTab3 = document.getElementById('btnTabPos3'); if(elTab3) elTab3.innerText = `💵 ${n3}`;
    const elTab2 = document.getElementById('btnTabPos2'); if(elTab2) elTab2.innerText = `👶 ${n2}`;

    if (typeof activeKasTab !== 'undefined' && typeof renderMutasiTabKas === 'function') {
        renderMutasiTabKas(activeKasTab);  
    }
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
        keluarEtalase: 0,
        stokRusak: getNum('inputStokRusak'),
        minGudang: getNum('inputMinGudang'),
        minEtalase: getNum('inputMinEtalase')
    };
    p.margin = p.jual - p.modal; 

    if (!p.nama) {
        alert("Nama produk wajib diisi!");
        return;
    }

    const elEdit = document.getElementById('editIndexProduk');
    const idx = elEdit && elEdit.value !== "" ? parseInt(elEdit.value) : -1; 
    const aksiTeks = idx >= 0 ? `Mengubah/Edit produk "${p.nama}"` : `Menambahkan produk baru "${p.nama}"`;

    if (idx >= 0) {
        // Jika edit, pertahankan nilai keluarEtalase lama agar stok gudang tidak reset
        if (masterProduk[idx]) {
            p.keluarEtalase = masterProduk[idx].keluarEtalase || 0;
        }
        masterProduk[idx] = p; 
    } else {
        masterProduk.push(p);
        if (p.stokAwalGudang > 0 && typeof catatRiwayatStok === 'function') {
            catatRiwayatStok(p.nama, 'In', p.stokAwalGudang, p.stokAwalGudang);
        }
    } 
    
    // Samakan acuan global
    window.masterProduk = masterProduk;

    if (typeof catatAktivitas === 'function') catatAktivitas('Master Produk', aksiTeks);

    // Langsung update UI lokal agar respon instan tanpa perlu refresh
    renderTabelMasterProduk();
    const tgl = document.getElementById('tglOps') ? document.getElementById('tglOps').value : '';
    if (tgl) {
        syncStokDenganMaster(tgl);
        renderTabelMatriks();
    }

    if (typeof db !== 'undefined' && db !== null) {
        db.collection('cabang').doc(typeof CABANG_AKTIF !== 'undefined' ? CABANG_AKTIF : 'cipeteutara')
          .collection('appData').doc('masterProduk').set({ list: masterProduk })
        .then(() => { 
            if (typeof tutupModalKelolaProduk === 'function') tutupModalKelolaProduk(); 
            if (typeof showToast === 'function') showToast("✅ Produk Berhasil Disimpan!"); 
        }).catch(err => {
            console.error("Gagal simpan ke Firebase:", err);
            alert("Gagal menyimpan ke server: " + err.message);
        }); 
    } else { 
        if (typeof tutupModalKelolaProduk === 'function') tutupModalKelolaProduk(); 
        if (typeof showToast === 'function') showToast("✅ Tersimpan Lokal"); 
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
// RENDER TABEL MASTER PRODUK (SISA DIPINDAH KE KOLOM 3 & BEKU)
// ==========================================
function renderTabelMasterProduk() {
    const tbody = document.getElementById('tbodyMasterProduk');
    if (!tbody) return;
    
    if (typeof window.masterProduk === 'undefined' || !Array.isArray(window.masterProduk)) {
        window.masterProduk = [];
    }

    tbody.innerHTML = '';
    
    if (window.masterProduk.length === 0) {
        tbody.innerHTML = `<tr><td colspan="12" style="text-align: center; padding: 20px; color: #94a3b8; font-style: italic;">Belum ada data produk. Silakan tambahkan produk baru.</td></tr>`;
        return;
    }

    let htmlContent = '';

    window.masterProduk.forEach((p, index) => {
        // 👉 Cek apakah produk berkategori Bakso Malang
        const isBakso = p.kategori && p.kategori.toString().trim().toLowerCase() === 'bakso malang';

        const awalGudang = parseFloat(p.stokAwalGudang) || 0;
        const keluarEtalase = parseFloat(p.keluarEtalase) || 0; 
        const rusakTotal = parseFloat(p.stokRusak) || 0;
        
        // RUMUS TETAP SAMA & PRESISI: Sisa = Awal - Keluar - Rusak
        const sisaGudangAsli = awalGudang - keluarEtalase - rusakTotal;

        // 👉 Variabel kondisi tampilan khusus Bakso Malang vs Non-Bakso
        const displaySisa = isBakso 
            ? `<span style="background:#e2e8f0; color:#475569; padding:2px 6px; border-radius:4px; font-size:0.75rem; font-weight:bold;">Fresh</span>` 
            : sisaGudangAsli;

        const displayAwal = isBakso 
            ? `<span style="color:#cbd5e1;">-</span>` 
            : awalGudang;

        // PERBARUAN: Keluar Etalase disembunyikan untuk Bakso Malang
        const displayKeluar = isBakso 
            ? `<span style="color:#cbd5e1;">-</span>` 
            : keluarEtalase;

        const displayRusak = isBakso 
            ? `<span style="color:#cbd5e1;">-</span>` 
            : rusakTotal;

        const inputMasukHTML = isBakso 
            ? `<span style="color:#cbd5e1; font-weight:bold;">-</span>` 
            : `<input type="number" id="inputMasuk_${index}" min="0" oninput="hitungSisaGudangRealtime(${index})" style="width:48px; padding:2px 4px; text-align:center; border:1px solid #22c55e; border-radius:4px; background:#f0fdf4; font-weight:bold; color:#15803d; font-size:0.82rem;">`;

        const inputRusakHTML = isBakso 
            ? `<span style="color:#cbd5e1; font-weight:bold;">-</span>` 
            : `<input type="number" id="inputRusak_${index}" min="0" oninput="hitungSisaGudangRealtime(${index})" style="width:48px; padding:2px 4px; text-align:center; border:1px solid #ef4444; border-radius:4px; background:#fef2f2; font-weight:bold; color:#b91c1c; font-size:0.82rem;">`;

        const btnFisikHTML = isBakso 
            ? '' 
            : `<button onclick="bukaModalKoreksiStok(${index})" style="background:#f59e0b; color:white; border:none; padding:4px 7px; border-radius:5px; cursor:pointer; font-size:0.75rem; font-weight:bold; margin-right:2px;" title="Koreksi Opname Fisik">⚙️ Fisik</button>`;
        
        htmlContent += `
            <tr>
                <!-- 1. NO (BEKU) -->
                <td style="text-align:center; font-weight:bold; font-size:0.85rem;">${index + 1}</td>
                
                <!-- 2. NAMA PRODUK (BEKU) -->
                <td style="font-weight:bold; font-size:0.88rem;">${p.nama || '-'}</td>
                
                <!-- 3. SISA GUDANG (BEKU & PINDAH KE SINI) -->
                <td style="text-align:center; color:#0284c7; font-weight:bold; font-size:0.95rem;" id="sisaRealtime_${index}">${displaySisa}</td>
                
                <!-- 4. KATEGORI -->
                <td><span style="background:#e0e7ff; color:#4f46e5; padding:2px 6px; border-radius:10px; font-size:0.72rem; font-weight:bold;">${p.kategori || '-'}</span></td>
                
                <!-- 5. HARGA MODAL -->
                <td style="text-align:right; font-size:0.85rem;">Rp ${(p.modal || 0).toLocaleString('id-ID')}</td>
                
                <!-- 6. HARGA JUAL -->
                <td style="text-align:right; font-size:0.85rem;">Rp ${(p.jual || 0).toLocaleString('id-ID')}</td>
                
                <!-- 7. AWAL GUDANG -->
                <td style="text-align:center; background:#f0fdf4; color:#16a34a; font-weight:bold; font-size:0.88rem;">${displayAwal}</td>
                
                <!-- 8. KELUAR ETALASE -->
                <td style="text-align:center; background:#fff1f2; color:#e11d48; font-weight:bold; font-size:0.88rem;">${displayKeluar}</td>
                
                <!-- 9. STOK RUSAK -->
                <td style="text-align:center; background:#fff1f2; color:#9f1239; font-weight:bold; font-size:0.88rem;">${displayRusak}</td>
                
                <!-- 10. INPUT MASAL +GUDANG -->
                <td style="text-align:center;">
                    ${inputMasukHTML}
                </td>

                <!-- 11. INPUT MASAL +RUSAK -->
                <td style="text-align:center;">
                    ${inputRusakHTML}
                </td>

                <!-- 12. AKSI -->
                <td style="text-align:center; white-space:nowrap;">
                    ${btnFisikHTML}
                    <button onclick="editProdukMaster(${index})" style="background:none; border:none; cursor:pointer; font-size:0.95rem;" title="Edit Produk">✏️</button>
                    <button onclick="hapusProdukMaster(${index})" style="background:none; border:none; cursor:pointer; font-size:0.95rem;" title="Hapus Produk">🗑️</button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = htmlContent;
    munculkanTombolSimpanMasal();
}

// ==========================================
// 1. MUNCULKAN / RESET STATUS TOMBOL SIMPAN MASAL
// ==========================================
function munculkanTombolSimpanMasal() {
    let containerBtn = document.getElementById('containerBtnSimpanMasal');
    const tbody = document.getElementById('tbodyMasterProduk');
    const tableEl = tbody ? tbody.closest('table') : null;

    if (!containerBtn) {
        containerBtn = document.createElement('div');
        containerBtn.id = 'containerBtnSimpanMasal';
        
        // CSS Sticky agar tetap melayang di pojok kiri atas saat di-scroll
        containerBtn.style.cssText = `
            position: sticky;
            top: 10px;
            left: 10px;
            z-index: 1000;
            margin-bottom: 10px;
            display: inline-block;
            float: left;
        `;

        containerBtn.innerHTML = `
            <button id="btnSimpanMasal" onclick="simpanMutasiGudangMasal()" style="
                background: #16a34a; 
                color: white; 
                border: none; 
                padding: 6px 14px; 
                border-radius: 6px; 
                font-weight: bold; 
                cursor: pointer; 
                box-shadow: 0 2px 6px rgba(0,0,0,0.2); 
                font-size: 0.82rem;
                display: flex;
                align-items: center;
                gap: 5px;
                transition: all 0.2s ease;
            " onmouseover="this.style.transform='scale(1.03)'; this.style.backgroundColor='#15803d';" onmouseout="this.style.transform='scale(1)'; this.style.backgroundColor='#16a34a';">
                💾 Simpan
            </button>
        `;

        if (tableEl && tableEl.parentNode) {
            tableEl.parentNode.insertBefore(containerBtn, tableEl);
        }
    }

    // 👉 PERBARUAN UTAMA: Reset tombol ke kondisi aktif/hijau setiap kali fungsi ini dipanggil
    const btn = document.getElementById('btnSimpanMasal');
    if (btn) {
        btn.disabled = false;
        btn.innerHTML = '💾 Simpan';
        btn.style.backgroundColor = '#16a34a';
        btn.style.cursor = 'pointer';
    }
}

// ==========================================
// 2. LOGIKA HITUNG REAL-TIME SAAT DIKETIK
// ==========================================
function hitungSisaGudangRealtime(index) {
    if (!masterProduk || !masterProduk[index]) return;
    const p = masterProduk[index];

    const awalGudang = parseFloat(p.stokAwalGudang) || 0;
    const keluarEtalase = parseFloat(p.keluarEtalase) || 0;
    const rusakTotal = parseFloat(p.stokRusak) || 0;

    const inputMasukEl = document.getElementById(`inputMasuk_${index}`);
    const inputRusakEl = document.getElementById(`inputRusak_${index}`);
    
    const masukBaru = inputMasukEl ? (parseFloat(inputMasukEl.value) || 0) : 0;
    const rusakBaru = inputRusakEl ? (parseFloat(inputRusakEl.value) || 0) : 0;

    // Sisa Aktual = (Awal + Masuk Baru) - Keluar - (Rusak Lama + Rusak Baru)
    const sisaBaru = (awalGudang + masukBaru) - keluarEtalase - (rusakTotal + rusakBaru);
    
    const elSisa = document.getElementById(`sisaRealtime_${index}`);
    if (elSisa) {
        elSisa.innerText = sisaBaru;
        // Beri warna hijau jika ada perubahan, biru jika kosong/standar
        if (masukBaru > 0 || rusakBaru > 0) {
            elSisa.style.color = "#16a34a"; 
        } else {
            elSisa.style.color = "#0284c7";
        }
    }
}

// ==========================================
// 3. EKSEKUSI SIMPAN MUTASI MASAL KE FIREBASE
// ==========================================
function simpanMutasiGudangMasal() {
    let adaPerubahan = false;
    let daftarRiwayatBaru = []; 

    masterProduk.forEach((p, index) => {
        const inputMasukEl = document.getElementById(`inputMasuk_${index}`);
        const inputRusakEl = document.getElementById(`inputRusak_${index}`);
        if (!inputMasukEl || !inputRusakEl) return;

        const masukBaru = parseFloat(inputMasukEl.value) || 0;
        const rusakBaru = parseFloat(inputRusakEl.value) || 0;

        if (masukBaru > 0 || rusakBaru > 0) {
            adaPerubahan = true;
            
            if (masukBaru > 0) {
                p.stokAwalGudang = (parseFloat(p.stokAwalGudang) || 0) + masukBaru;
                daftarRiwayatBaru.push({ 
                    nama: p.nama, 
                    aksi: 'In (Gudang)', 
                    jumlah: masukBaru, 
                    sisaAkhir: (p.stokAwalGudang - (parseFloat(p.keluarEtalase) || 0) - (parseFloat(p.stokRusak) || 0)) 
                });
            }
            
            if (rusakBaru > 0) {
                p.stokRusak = (parseFloat(p.stokRusak) || 0) + rusakBaru;
                daftarRiwayatBaru.push({ 
                    nama: p.nama, 
                    aksi: 'Rusak (Gudang)', 
                    jumlah: rusakBaru, 
                    sisaAkhir: (p.stokAwalGudang - (parseFloat(p.keluarEtalase) || 0) - p.stokRusak) 
                });
            }
        }
    });

    if (!adaPerubahan) {
        alert("Peringatan: Belum ada angka [+] Masuk atau [+] Rusak yang diisi di tabel.");
        return;
    }

    if (confirm("Simpan semua perubahan stok ke database?")) {
        const btn = document.querySelector('#containerBtnSimpanMasal button') || document.getElementById('btnSimpanMasal');
        if(btn) { btn.innerText = "⏳ Sedang Menyimpan..."; btn.disabled = true; }

        window.masterProduk = masterProduk;

        if (typeof db !== 'undefined' && db !== null) {
            // 1. Simpan Master Produk ke Firebase
            db.collection('cabang').doc(CABANG_AKTIF).collection('appData').doc('masterProduk').set({ list: masterProduk })
            .then(async () => {
                // 2. 👉 OPTIMASI: Jalankan pencatatan riwayat secara paralel (cepat)
                if (typeof catatRiwayatStok === 'function' && daftarRiwayatBaru.length > 0) {
                    const janjiRiwayat = daftarRiwayatBaru.map(log => 
                        catatRiwayatStok(log.nama, log.aksi, log.jumlah, log.sisaAkhir)
                    );
                    await Promise.all(janjiRiwayat); // Menunggu semua log selesai dikirim bersamaan
                }

                if (typeof catatAktivitas === 'function') {
                    catatAktivitas("Master Produk", `Mutasi masal sukses: ${daftarRiwayatBaru.length} pergerakan barang dicatat.`);
                }
                if(typeof showToast === 'function') showToast("✅ Stok Baru Berhasil Disimpan!");
                
                renderTabelMasterProduk(); 
            })
            .catch(err => {
                alert("Gagal menyimpan ke server: " + err);
                if(btn) { 
                    btn.innerText = "💾 Simpan"; 
                    btn.disabled = false; 
                    btn.style.backgroundColor = '#16a34a';
                }
            });
        } else {
            renderTabelMasterProduk();
            alert("✅ Data tersimpan (Mode Lokal).");
        }
    }
}

// ==========================================
// 4. FUNGSI KOREKSI / SESUAIKAN STOK FISIK AKTUAL
// ==========================================
function bukaModalKoreksiStok(i) {
    const p = masterProduk[i];
    if (!p) return;

    let stokLama = (parseFloat(p.stokAwalGudang) || 0) - (parseFloat(p.keluarEtalase) || 0) - (parseFloat(p.stokRusak) || 0);

    let inputBaru = prompt(`⚙️ KOREKSI STOK FISIK: ${p.nama}\n\nMasukkan jumlah SISA STOK GUDANG yang aktual/riil saat ini di gudang:`, stokLama);
    
    if (inputBaru === null) return; // Batal
    let stokFisikAktual = parseInt(inputBaru);
    
    if (isNaN(stokFisikAktual) || stokFisikAktual < 0) {
        alert("Masukkan angka yang valid!");
        return;
    }

    let selisih = stokFisikAktual - stokLama;

    if (selisih === 0) {
        alert("Stok sudah sesuai, tidak ada perubahan.");
        return;
    }

    p.stokAwalGudang = (parseFloat(p.stokAwalGudang) || 0) + selisih;
    window.masterProduk = masterProduk;

    if(typeof db !== 'undefined' && db !== null) {
        db.collection('cabang').doc(CABANG_AKTIF).collection('appData').doc('masterProduk').set({ list: masterProduk })
        .then(() => { 
            renderTabelMasterProduk(); 
            if(typeof showToast === 'function') showToast("✅ Stok Berhasil Dikoreksi!");
        }); 
    } else { 
        renderTabelMasterProduk(); 
        if(typeof showToast === 'function') showToast("✅ Stok Berhasil Dikoreksi (Lokal)!"); 
    }

    const jenisAksi = selisih > 0 ? 'In' : 'Out';
    if (typeof catatRiwayatStok === 'function') {
        catatRiwayatStok(p.nama, `Koreksi Fisik (${jenisAksi})`, Math.abs(selisih), stokFisikAktual);
    }
    
    if (typeof catatAktivitas === 'function') {
        catatAktivitas('Master Produk', `Koreksi stok fisik "${p.nama}" menjadi ${stokFisikAktual} Pcs`);
    }
}

// ==========================================
// 5. FUNGSI RENDER RIWAYAT STOK
// ==========================================
function renderTabelRiwayatStok() {
    const tbody = document.getElementById('tbodyRiwayatStok');
    if (!tbody) return;
    
    let filterContainer = document.getElementById('containerFilterRiwayat');
    if (!filterContainer) {
        const tableEl = tbody.parentElement;
        filterContainer = document.createElement('div');
        filterContainer.id = 'containerFilterRiwayat';
        filterContainer.style.cssText = 'display:flex; gap:10px; margin-bottom:15px; flex-wrap:wrap; align-items:center; background:#f8fafc; padding:10px; border-radius:8px; border:1px solid #e2e8f0;';
        
        filterContainer.innerHTML = `
            <strong style="color:#475569; font-size:0.85rem;">Filter:</strong>
            <input type="text" id="filterRiwayatNama" placeholder="🔍 Cari Nama Produk..." style="padding:8px; border-radius:6px; border:1px solid #cbd5e1; flex:1; min-width:150px;">
            <input type="date" id="filterRiwayatMulai" style="padding:8px; border-radius:6px; border:1px solid #cbd5e1;">
            <span style="color:#64748b; font-size:0.85rem;">s/d</span>
            <input type="date" id="filterRiwayatAkhir" style="padding:8px; border-radius:6px; border:1px solid #cbd5e1;">
            
            <button onclick="terapkanFilterRiwayat()" style="background:#0284c7; color:white; padding:8px 15px; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">🔍 Cari</button>
            <button onclick="resetFilterRiwayat()" style="background:#ef4444; color:white; padding:8px 15px; border:none; border-radius:6px; cursor:pointer; font-weight:bold;">Reset</button>
        `;
        if (tableEl && tableEl.parentNode) {
            tableEl.parentNode.insertBefore(filterContainer, tableEl);
        }
    }

    if (typeof terapkanFilterRiwayat === 'function') {
        terapkanFilterRiwayat(); 
    }
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
// 6. FUNGSI HAPUS PRODUK (PERBAIKAN PRODUK HANTU)
// ==========================================
async function hapusProdukMaster(i) { 
    if(!confirm("Hapus produk ini dari Master Produk?")) return;
    
    const namaProd = masterProduk[i]?.nama || 'Produk';
    
    // 👉 PERBAIKAN: Buat cadangan data sebelum dihapus
    const backupMasterProduk = [...masterProduk];
    
    // Hapus di layar sementara
    masterProduk.splice(i, 1); 
    renderTabelMasterProduk(); // Update tampilan layar agar terasa cepat
    
    if (typeof db !== 'undefined' && db !== null) {
        try {
            // Tunggu kepastian dari server Firebase
            await db.collection('cabang').doc(CABANG_AKTIF).collection('appData').doc('masterProduk').set({ list: masterProduk });
            
            // Jika berhasil sampai sini, berarti aman (database benar-benar terhapus)
            if (typeof catatAktivitas === 'function') {
                catatAktivitas('Master Produk', `Menghapus produk "${namaProd}" dari daftar Master Produk`);
            }
            if (typeof showToast === 'function') showToast("✅ Produk berhasil dihapus!");
            
        } catch (error) {
            console.error("Error menghapus produk:", error);
            // 👉 JIKA GAGAL (Koneksi putus/Firebase error): Kembalikan produk hantu tadi karena server menolak!
            alert("Gagal menghapus produk dari server (Koneksi bermasalah). Data akan dikembalikan agar tidak error.");
            masterProduk = backupMasterProduk; // Kembalikan cadangan ke variabel utama
            renderTabelMasterProduk(); // Munculkan lagi di layar
        }
    } else {
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

// Fungsi untuk Membuka Modal
function bukaModalFeedback() {
    const modal = document.getElementById('modalFeedback');
    if (modal) {
        modal.style.display = 'flex'; // atau 'block' tergantung CSS Anda
    }
}

// Fungsi untuk Menutup Modal dengan Bersih
function tutupModalFeedback() {
    const modal = document.getElementById('modalFeedback');
    if (modal) {
        modal.style.display = 'none';
    }
    
    // 1. Kosongkan isian agar siap dipakai lagi
    const deskripsi = document.getElementById('inputDeskripsiLaporan');
    if (deskripsi) deskripsi.value = '';
    
    const jenis = document.getElementById('inputJenisLaporan');
    if (jenis) jenis.value = '🐛 Lapor Error / Bug';
    
    // 2. Jika Anda menggunakan efek latar belakang gelap (backdrop), bersihkan di sini:
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
        backdrop.remove();
    }
    
    // 3. Pastikan layar bisa diklik/di-scroll kembali (mencegah layar freeze)
    document.body.style.pointerEvents = 'auto';
    document.body.style.overflow = 'auto';
}
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
// FUNGSI DASHBOARD GRAFIK CHART.JS (DENGAN INFO SETORAN DAPUR & MODAL)
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

    // KODE BARU (DENGAN SUPPORT CUSTOM TANGGAL):
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
    // 👉 TAMBAHAN LOGIKA FILTER TANGGAL KUSTOM
    else if (periode === 'custom') {
        const tglAwal = document.getElementById('dashTglAwal')?.value;
        const tglAkhir = document.getElementById('dashTglAkhir')?.value;
        
        if (tglAwal && tglAkhir) {
            targetDates = allDates.filter(d => d >= tglAwal && d <= tglAkhir);
        } else {
            targetDates = allDates.slice(-7); // Default jika tanggal belum dipilih
        }
    }
    else { targetDates = allDates; }

    const setTxt = (id, val) => { const el = document.getElementById(id); if(el) el.innerText = val; };
    if(targetDates.length === 0) {
        setTxt('dashTotalOmset', "Rp 0");
        setTxt('dashOmsetBakso', "Rp 0");
        setTxt('dashOmsetReseller', "Rp 0");
        setTxt('dashTotalProfit', "Rp 0");
        setTxt('dashTotalSetoranDapur', "Rp 0"); // New ID
        setTxt('dashTotalBeban', "Rp 0");
        setTxt('dashBebanGaji', "Rp 0");
        setTxt('dashBebanDapur', "Rp 0");
        setTxt('dashBebanLaci', "Rp 0");
        if(chartTren) chartTren.destroy();
        if(chartTopBakso) chartTopBakso.destroy();
        if(chartTopReseller) chartTopReseller.destroy();
        return;
    }

    let totalOmsetBakso = 0, totalOmsetReseller = 0, totalProfit = 0, totalSetoranDapurAkumulatif = 0; 
    let totalGaji = 0, totalLaci = 0, totalDarurat = 0; 
    let labelsTren = [], dataBakso = [], dataReseller = [], dataProfitLine = [], dataSetoranBaksoLine = []; 
    let produkBakso = {}, produkReseller = {};

    // Cek Nama Pos Dana Darurat Dinamis dari Cabang Aktif
    const namaDarurat = (typeof pengaturanCabangAktif !== 'undefined' && pengaturanCabangAktif.pos1?.nama) 
        ? pengaturanCabangAktif.pos1.nama 
        : "Dana Darurat";

    targetDates.forEach(tgl => { 
        labelsTren.push(tgl.slice(-2) + '/' + tgl.slice(5,7)); 
        let harianOmsetBakso = 0, harianOmsetReseller = 0, harianProfitKotor = 0, harianSetoranBakso = 0; 
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
                const modalItem = laku * p.modal;
                const profit = laku * p.margin; 
                harianProfitKotor += profit; 
                
                if(p.kategori === 'Bakso Malang') { 
                    harianOmsetBakso += omset; 
                    harianSetoranBakso += modalItem; 
                    if(laku > 0) produkBakso[p.nama] = (produkBakso[p.nama] || 0) + laku; 
                } else { 
                    harianOmsetReseller += omset; 
                    if(laku > 0) produkReseller[p.nama] = (produkReseller[p.nama] || 0) + laku; 
                } 
            } 
        }); 
        
        // --- 1. AMBIL BEBAN GAJI HARIAN ---
        const nominalGajiStandar = (typeof pengaturanCabangAktif !== 'undefined' && pengaturanCabangAktif.gajiHarian) || 50000;
        const dGaji = (dbGajiHarian && dbGajiHarian[tgl] ? dbGajiHarian[tgl].nominal : nominalGajiStandar); 
        
        // --- 2. AMBIL BEBAN LACI KASIR ---
        const dLaci = (dbPengeluaranHarian || []).filter(p => p.tgl === tgl).reduce((acc, curr) => acc + (parseFloat(curr.nominal) || 0), 0); 
        
        // --- 3. 👉 AMBIL PENGELUARAN DANA DARURAT DARI dbLogKas ---
        let dDarurat = 0;
        if (typeof dbLogKas !== 'undefined' && Array.isArray(dbLogKas)) {
            dDarurat = dbLogKas
                .filter(l => l.tgl === tgl && (l.jenis === namaDarurat || l.jenis === 'Dana Darurat') && l.tipe === 'keluar')
                .reduce((acc, curr) => acc + (parseFloat(curr.nominal) || 0), 0);
        }

        // --- 4. RUMUS PROFIT BERSIH RIIL ---
        // Profit Kotor - (Gaji Harian + Belanja Laci + Uang Keluar Dana Darurat)
        const totalBebanHarian = dGaji + dLaci + dDarurat;
        const profitBersih = Math.max(0, harianProfitKotor - totalBebanHarian); 

        totalOmsetBakso += harianOmsetBakso; 
        totalOmsetReseller += harianOmsetReseller; 
        totalSetoranDapurAkumulatif += harianSetoranBakso;
        totalProfit += profitBersih; 
        totalGaji += dGaji; 
        totalLaci += dLaci; 
        totalDarurat += dDarurat;

        dataBakso.push(harianOmsetBakso); 
        dataReseller.push(harianOmsetReseller); 
        dataProfitLine.push(profitBersih); 
        dataSetoranBaksoLine.push(harianSetoranBakso);
    });

    // Update Text Ringkasan Dashboard
    setTxt('dashTotalOmset', formatRupiah(totalOmsetBakso + totalOmsetReseller)); 
    setTxt('dashOmsetBakso', formatRupiah(totalOmsetBakso)); 
    setTxt('dashOmsetReseller', formatRupiah(totalOmsetReseller)); 
    setTxt('dashTotalSetoranDapur', formatRupiah(totalSetoranDapurAkumulatif)); 
    setTxt('dashTotalProfit', formatRupiah(totalProfit)); 
    setTxt('dashTotalBeban', formatRupiah(totalGaji + totalLaci + totalDarurat)); 
    setTxt('dashBebanGaji', formatRupiah(totalGaji)); 
    setTxt('dashBebanLaci', formatRupiah(totalLaci));
    setTxt('dashBebanDarurat', formatRupiah(totalDarurat)); // Menampilkan total Pengeluaran Dana Darurat
    
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
            data: { 
                labels: labelsTren, 
                datasets: [ 
                    // 1. GARIS PROFIT BERSIH (HIJAU)
                    { 
                        type: 'line', 
                        label: 'Profit Bersih', 
                        data: dataProfitLine, 
                        borderColor: '#16a34a', 
                        backgroundColor: '#16a34a', 
                        borderWidth: 2.5, 
                        tension: 0.3, 
                        pointRadius: 4, 
                        datalabels: { 
                            align: 'top', 
                            anchor: 'end', 
                            color: '#15803d', 
                            font: { weight: 'bold', size: 10 }, 
                            formatter: formatSingkatan 
                        } 
                    },
                    // 2. GARIS SETORAN DAPUR (UNGU PUTUS-PUTUS)
                    { 
                        type: 'line', 
                        label: 'Setoran Dapur (Bakso)', 
                        data: dataSetoranBaksoLine, 
                        borderColor: '#8b5cf6', 
                        borderDash: [4, 4], 
                        backgroundColor: '#8b5cf6', 
                        borderWidth: 2, 
                        tension: 0.2, 
                        pointRadius: 3, 
                        datalabels: { 
                            align: 'bottom', 
                            anchor: 'start', 
                            color: '#6d28d9', 
                            font: { weight: 'bold', size: 8 }, 
                            formatter: formatSingkatan 
                        } 
                    },
                    // 3. BALOK OMSET RESELLER (BIRU - BAWAH)
                    { 
                        type: 'bar', 
                        label: 'Omset Reseller', 
                        data: dataReseller, 
                        backgroundColor: '#3b82f6', 
                        datalabels: { 
                            color: '#ffffff', 
                            font: { weight: 'bold', size: 8 }, 
                            formatter: formatSingkatan 
                        } 
                    }, 
                    // 4. BALOK OMSET BAKSO (ORANYE - ATAS)
                    { 
                        type: 'bar', 
                        label: 'Omset Bakso', 
                        data: dataBakso, 
                        backgroundColor: '#ea580c', 
                        datalabels: { 
                            align: 'top',
                            anchor: 'end',
                            color: '#0f172a', 
                            font: { weight: 'bold', size: 10 }, 
                            formatter: function(val, ctx) {
                                const idx = ctx.dataIndex;
                                const omsetBakso = dataBakso[idx] || 0;
                                const omsetReseller = dataReseller[idx] || 0;
                                return formatSingkatan(omsetBakso + omsetReseller);
                            }
                        } 
                    } 
                ] 
            }, 
            options: { 
                responsive: true, 
                maintainAspectRatio: false, 
                layout: { padding: { top: 25 } }, 
                plugins: { 
                    legend: { position: 'bottom', labels: { boxWidth: 12, font: {size: 10} } }, 
                    datalabels: { display: true },
                    // 👉 FITUR ANGKA REAL SAAT DI-KLIK / DI-TOUCH
                    tooltip: {
                        enabled: true,
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            // Menampilkan nilai asli per dataset dalam format Rupiah lengkap
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) label += ': ';
                                if (context.parsed.y !== null) {
                                    label += 'Rp ' + context.parsed.y.toLocaleString('id-ID');
                                }
                                return label;
                            },
                            // Menampilkan Total Omset Harian Gabungan di bagian bawah tooltip
                            footer: function(tooltipItems) {
                                let totalOmsetHarian = 0;
                                tooltipItems.forEach(function(item) {
                                    if (item.dataset.type === 'bar') {
                                        totalOmsetHarian += item.parsed.y || 0;
                                    }
                                });
                                return '------------------------\nTotal Omset: Rp ' + totalOmsetHarian.toLocaleString('id-ID');
                            }
                        }
                    }
                }, 
                scales: { 
                    x: { stacked: true, grid: { display: false } }, 
                    y: { stacked: true, beginAtZero: true, display: false } 
                } 
            } 
        });
    }
    const sortSliceTop5 = (dict) => Object.keys(dict).map(k => ({nama: k, qty: dict[k]})).sort((a,b) => b.qty - a.qty).slice(0, 5); 
    const topBakso = sortSliceTop5(produkBakso); 

    window.listProdukResellerAktif = Object.keys(produkReseller).sort(); 
    let resellerDifilter = Object.keys(produkReseller)
        .filter(nama => !(window.produkResellerDisembunyikan || []).includes(nama))
        .map(nama => ({nama: nama, qty: produkReseller[nama]}))
        .sort((a,b) => b.qty - a.qty)
        .slice(0, 10);

    const optHorizontalBar = { 
        indexAxis: 'y', 
        responsive: true, 
        maintainAspectRatio: false, 
        layout: { padding: { right: 45 } }, 
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
                grace: '15%' 
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
// FUNGSI TOGGLE INPUT TANGGAL KUSTOM DASHBOARD
// ==========================================
function toggleCustomDateDashboard() {
    const periodeEl = document.getElementById('filterDashboardPeriode');
    const containerCustom = document.getElementById('containerCustomDateDash');
    if (!periodeEl || !containerCustom) return;

    if (periodeEl.value === 'custom') {
        containerCustom.style.display = 'flex';
        // Set tanggal default jika masih kosong (7 hari terakhir)
        const elAwal = document.getElementById('dashTglAwal');
        const elAkhir = document.getElementById('dashTglAkhir');
        if (elAwal && !elAwal.value) {
            let d = new Date();
            d.setDate(d.getDate() - 6);
            elAwal.value = d.toISOString().split('T')[0];
        }
        if (elAkhir && !elAkhir.value) {
            elAkhir.value = new Date().toISOString().split('T')[0];
        }
    } else {
        containerCustom.style.display = 'none';
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

    // 👉 1. Filter kategori dibuat lebih aman (mengabaikan spasi & huruf besar/kecil)
    const listBakso = items.filter(p => p.kategori && p.kategori.toString().trim().toLowerCase() === 'bakso malang');

    if (listBakso.length === 0) {
        alert("Tidak ada data produk Bakso Malang untuk tanggal ini.");
        return;
    }

    // 👉 2. CETAK SEMUA BARIS PRODUK (Tanpa menyaring totalStok > 0 agar semua varian ikut tercetak)
    listBakso.forEach(p => { 
        const awal = parseFloat(p.awal) || 0; 
        const tambah = parseFloat(p.tambah) || 0; 
        const kurang = parseFloat(p.kurang) || 0; 
        const totalStok = awal + tambah - kurang; 
        const sisa = (p.sisa !== "" && p.sisa !== null) ? parseFloat(p.sisa) : null; 
        const terjual = (sisa !== null && sisa <= totalStok) ? (totalStok - sisa) : 0; 
        const valSisa = sisa !== null ? sisa : 0; 

        const modalTotalItem = terjual * (parseFloat(p.modal) || 0); 
        const profitTotalItem = terjual * (parseFloat(p.margin) || 0); 
        
        sumAwal += awal; 
        sumTambah += tambah; 
        sumKurang += kurang; 
        sumTotalStok += totalStok; 
        sumLaku += terjual; 
        sumSisa += valSisa; 
        sumSetoran += modalTotalItem; 
        sumProfit += profitTotalItem; 

        tbody.innerHTML += `
            <tr>
                <td style="text-align:center;">${no++}</td>
                <td><strong>${p.nama || '-'}</strong></td>
                <td style="text-align:center;">${awal}</td>
                <td style="text-align:center; color:#166534;">${tambah > 0 ? tambah : '-'}</td>
                <td style="text-align:center; color:#991b1b;">${kurang > 0 ? kurang : '-'}</td>
                <td style="text-align:center; font-weight:bold;">${totalStok}</td>
                <td style="text-align:center; font-weight:bold; color:#0f172a;">${terjual}</td>
                <td style="text-align:center; color:#dc2626; font-weight:bold;">${valSisa}</td>
                <td style="text-align:right;">${formatRupiah(p.modal || 0)}</td>
                <td style="text-align:right; font-weight:bold; color:#d97706;">${formatRupiah(modalTotalItem)}</td>
                <td style="text-align:right; font-weight:bold; color:#16a34a;">${formatRupiah(profitTotalItem)}</td>
            </tr>
        `; 
    }); 

    // Ringkasan Footer PDF
    tbody.innerHTML += `<tr style="background:#fed7aa; font-weight:800; font-size:0.9rem; border-top: 2px solid #ea580c;"><td colspan="2" style="text-align:center;">TOTAL QTY</td><td style="text-align:center;">${sumAwal}</td><td style="text-align:center; color:#166534;">${sumTambah}</td><td style="text-align:center; color:#991b1b;">${sumKurang}</td><td style="text-align:center; color:#0f172a;">${sumTotalStok}</td><td style="text-align:center; color:#0f172a;">${sumLaku}</td><td style="text-align:center; color:#b91c1c;">${sumSisa}</td><td></td><td style="text-align:right; color:#b45309;">${formatRupiah(sumSetoran)}</td><td style="text-align:right; color:#15803d;">${formatRupiah(sumProfit)}</td></tr>`; 

    const dataSetoran = (typeof dbSetoranDapur !== 'undefined' && dbSetoranDapur[tgl]) ? dbSetoranDapur[tgl] : { cash: 0, ket: '-', pengeluaran: 0 }; 
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
                    <!-- Kolom Waktu: Lebar dikunci di 65px -->
                    <td style="padding: 8px; color: #64748b; background: #ffffff; position: sticky; left: 0; z-index: 5; width: 65px; min-width: 65px; max-width: 65px; white-space: nowrap; overflow: hidden;">${d.waktu || '-'}</td>
                    
                    <!-- Kolom Pengguna: Digeser ke kiri (65px) mengikuti kolom waktu, lebar dikunci di 75px, nama panjang otomatis terpotong titik-titik (...) -->
                    <td style="padding: 8px; font-weight: 600; color: #0f172a; background: #ffffff; position: sticky; left: 65px; z-index: 5; box-shadow: 3px 0 4px -2px rgba(0,0,0,0.1); width: 75px; min-width: 75px; max-width: 75px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${d.user || 'Sistem'}</td>
                    
                    <!-- Kolom Keterangan: Dibuat fleksibel menyesuaikan sisa layar dan otomatis turun baris jika kepanjangan -->
                    <td style="padding: 8px; color: #334155; white-space: normal; word-break: break-word; line-height: 1.4;">${d.keterangan || '-'}</td>
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
async function kirimLaporanBug() {
    // Sesuaikan ID ini dengan ID yang ada di form Modal HTML Anda
    const jenisEl = document.getElementById('inputJenisLaporan'); 
    const deskripsiEl = document.getElementById('inputDeskripsiLaporan');

    const jenis = jenisEl ? jenisEl.value : 'Lapor Error / Bug';
    const deskripsi = deskripsiEl ? deskripsiEl.value : '';

    if (!deskripsi.trim()) {
        alert('Deskripsi laporan tidak boleh kosong!');
        return;
    }

    // Ambil waktu saat ini
    const now = new Date();
    const tglFormat = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    const jamFormat = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
    
    // Identifikasi siapa yang melapor
    let pelapor = 'Anonim';
    if (typeof currentUser !== 'undefined' && currentUser) {
        pelapor = `${currentUser.nama} (${currentUser.role})`;
    }

    const idUnik = Date.now().toString(); // Buat ID unik berdasarkan waktu

    const laporanBaru = {
        id: idUnik,
        waktu: `${tglFormat}, ${jamFormat}`,
        pelapor: pelapor,
        jenis: jenis,
        deskripsi: deskripsi,
        status: 'pending' // Status bawaan saat baru dikirim
    };

    try {
        const docRef = db.collection('cabang').doc(CABANG_AKTIF).collection('appData').doc('laporanBug');
        const doc = await docRef.get();
        let listLaporan = [];
        
        if (doc.exists) {
            listLaporan = doc.data().list || [];
        }
        
        listLaporan.unshift(laporanBaru); // Masukkan data baru di urutan paling atas
        await docRef.set({ list: listLaporan });
        
      alert('Laporan berhasil dikirim! Tim pusat akan segera mengeceknya.');
        
        // Bersihkan isian deskripsi
        if (deskripsiEl) deskripsiEl.value = '';
        
        // Menutup modal secara otomatis setelah sukses mengirim
        tutupModalFeedback();
        
        // Refresh tabel (jika Owner sedang membuka halamannya)
        muatDataLaporanBug(); 
        
        // CATATAN: Jika Anda punya fungsi menutup modal, letakkan di sini. 
        // Contoh: document.getElementById('modalBug').style.display = 'none';

    } catch (error) {
        console.error('Error kirim laporan:', error);
        alert('Gagal mengirim laporan. Pastikan koneksi internet stabil.');
    }
}

// 2. Fungsi untuk Memuat Laporan ke Tabel (Khusus Owner)
async function muatDataLaporanBug() {
    const tbody = document.getElementById('tbodyLaporanBug');
    if (!tbody) return;
    
    try {
        const docRef = db.collection('cabang').doc(CABANG_AKTIF).collection('appData').doc('laporanBug');
        const doc = await docRef.get();
        
        if (!doc.exists || !doc.data().list || doc.data().list.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px; color: #94a3b8;">Belum ada laporan masuk.</td></tr>';
            return;
        }

        const listLaporan = doc.data().list;
        tbody.innerHTML = '';
        
        listLaporan.forEach((item) => {
            const isSelesai = item.status === 'selesai';
            
            // Atur bentuk Label Status
            const statusBadge = isSelesai 
                ? '<span style="background: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: bold;">✅ Selesai</span>' 
                : '<span style="background: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: bold;">⏳ Menunggu</span>';
            
            // Atur tombol aksi (Jika sudah selesai, tombol mati/berubah abu-abu)
            const actionBtn = isSelesai 
                ? `<button disabled style="background: #e2e8f0; color: #94a3b8; border: none; padding: 4px 8px; border-radius: 6px; cursor: not-allowed; font-size:0.75rem;">Tuntas</button>`
                : `<button onclick="tandaiLaporanSelesai('${item.id}')" style="background: #3b82f6; color: white; border: none; padding: 4px 10px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size:0.75rem; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);">✔️ Tandai Selesai</button>`;

            // Baris yang sudah selesai akan agak redup
            const rowColor = isSelesai ? 'background: #f8fafc; opacity: 0.7;' : 'background: #fff;';

            tbody.innerHTML += `
                <tr style="${rowColor}">
                    <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size:0.75rem;">${item.waktu}</td>
                    <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-weight: 700; color:#0f172a;">${item.pelapor}</td>
                    <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0;"><span style="background: #f1f5f9; padding: 4px 8px; border-radius: 6px; border: 1px solid #e2e8f0; font-size:0.75rem;">${item.jenis}</span></td>
                    <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; white-space: normal; max-width: 250px; font-size:0.8rem;">${item.deskripsi}</td>
                    <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; text-align: center;">${statusBadge}</td>
                    <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; text-align: center;">${actionBtn}</td>
                </tr>
            `;
        });
        
    } catch (error) {
        console.error("Error muat laporan:", error);
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px; color: #ef4444;">Gagal memuat data laporan dari server.</td></tr>';
    }
}

// 3. Fungsi untuk Menandai Laporan Sudah Diperbaiki
async function tandaiLaporanSelesai(idLaporan) {
    if(!confirm('Apakah Anda yakin kendala/bug ini sudah diperbaiki?')) return;
    
    try {
        const docRef = db.collection('cabang').doc(CABANG_AKTIF).collection('appData').doc('laporanBug');
        const doc = await docRef.get();
        if(doc.exists) {
            let list = doc.data().list;
            // Cari data dengan ID yang cocok
            const index = list.findIndex(item => item.id === idLaporan);
            if(index !== -1) {
                list[index].status = 'selesai'; // Ubah statusnya
                await docRef.set({ list: list });
                muatDataLaporanBug(); // Refresh tabel setelah berhasil
            }
        }
    } catch (error) {
        console.error('Error update laporan:', error);
        alert('Gagal memperbarui status. Periksa koneksi internet.');
    }
}
function bersihkanGudangTotal() {
    if(!confirm("⚠️ PERINGATAN KERAS! Anda yakin ingin MENGHAPUS SEMUA RIWAYAT STOK dan MENG-NOL-KAN semua angka stok di Master Produk untuk cabang ini?")) return;

    // 1. Nol-kan Master Produk
    masterProduk.forEach(p => {
        p.stokAwalGudang = 0;
        p.keluarEtalase = 0;
        p.stokRusak = 0;
    });

    // 2. Kosongkan Riwayat
    riwayatStok = []; // Pastikan array riwayat kosong

    // 3. Tembak ke Firebase
    if(typeof db !== 'undefined' && db !== null) {
        const batch = db.batch();
        const refProduk = db.collection('cabang').doc(CABANG_AKTIF).collection('appData').doc('masterProduk');
        
        // Asumsi nama dokumen riwayat Anda di Firebase, sesuaikan jika berbeda
        const refRiwayat = db.collection('cabang').doc(CABANG_AKTIF).collection('appData').doc('riwayatStok'); 

        batch.set(refProduk, { list: masterProduk });
        batch.set(refRiwayat, { logs: [] }); // Timpa riwayat lama dengan array kosong

        batch.commit().then(() => {
            alert("✅ RESET BERHASIL! Semua stok menjadi 0 dan Riwayat telah bersih. Halaman akan dimuat ulang.");
            window.location.reload();
        }).catch(err => {
            alert("❌ Gagal reset: " + err);
        });
    }
}
function importMasterProdukCSV(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        
          const rows = text.split(/\r\n|\n/);
        let jumlahBerhasil = 0;

         for (let i = 1; i < rows.length; i++) {
            let row = rows[i].trim();
            if (!row) continue;

                      let cols = row.split(';').map(val => val.trim().replace(/^"|"$/g, ''));
            
                  if (cols.length >= 5) {
                const namaProduk = cols[1]; // Kolom ke-2 (index 1) adalah Nama Produk
                if (!namaProduk || namaProduk === '-') continue;

                const kategoriProduk = cols[2] || 'Umum';
                const modalProduk = parseFloat(cols[3]) || 0;
                const jualProduk = parseFloat(cols[4]) || 0;
                const stokGudangVal = parseFloat(cols[6]) || 0; 
                let existingIndex = masterProduk.findIndex(p => p.nama.toLowerCase() === namaProduk.toLowerCase());

                const produkBaru = {
                    nama: namaProduk,
                    kategori: kategoriProduk,
                    modal: modalProduk,
                    jual: jualProduk,
                    margin: jualProduk - modalProduk,
                    stokAwalGudang: stokGudangVal, 
                    keluarEtalase: 0,
                    stokRusak: 0,
                    minGudang: 10,  
                    minEtalase: 5   
                };

                if (existingIndex >= 0) {
                    // Jika sudah ada, update datanya (misal update harga atau stok)
                    masterProduk[existingIndex].modal = modalProduk;
                    masterProduk[existingIndex].jual = jualProduk;
                    masterProduk[existingIndex].margin = jualProduk - modalProduk;
                    masterProduk[existingIndex].stokAwalGudang = stokGudangVal;
                } else {
                    // Tambah baru jika belum ada
                    masterProduk.push(produkBaru);
                }
                jumlahBerhasil++;
            }
        }
        if (typeof db !== 'undefined' && db !== null && typeof CABANG_AKTIF !== 'undefined') {
            db.collection('cabang').doc(CABANG_AKTIF).collection('appData').doc('masterProduk').set({ list: masterProduk })
            .then(() => {
                if (typeof showToast === 'function') {
                    showToast(`✅ Sukses import ${jumlahBerhasil} produk!`);
                } else {
                    alert(`✅ Sukses import ${jumlahBerhasil} produk!`);
                }
                renderTabelMasterProduk();
                event.target.value = ''; // Reset input file
            }).catch(err => {
                alert("Gagal menyimpan data import ke server: " + err);
            });
        } else {
            renderTabelMasterProduk();
            alert(`✅ Sukses import ${jumlahBerhasil} produk (Mode Lokal).`);
            event.target.value = '';
        }
    };

    reader.readAsText(file);
}
