(function () {
  'use strict';
  /* ---------- data contoh (ilustrasi) ---------- */
  const COMM = {
    cabai: { n: 'Cabai merah', g: 6, price: 32000 },
    sawi: { n: 'Sawi hijau', g: 20, price: 9000 },
    tomat: { n: 'Tomat', g: 12, price: 11000 },
    bawang: { n: 'Bawang merah', g: 9, price: 30000 },
    wortel: { n: 'Wortel', g: 10, price: 10000 }
  };
  const MEMBERS = [
    { n: 'Pak Joko', ha: 0.7, h: 'Panen stabil 8 musim', w: 36 },
    { n: 'Pak Anton', ha: 0.5, h: 'Panen stabil 6 musim', w: 28 },
    { n: 'Bu Sari', ha: 0.3, h: 'Panen 4 musim', w: 14 },
    { n: 'Pak Slamet', ha: 0.2, h: 'Panen 3 musim', w: 5 },
    { n: 'Bu Wati', ha: 0.2, h: 'Panen 3 musim', w: 5 },
    { n: 'Pak Heri', ha: 0.15, h: 'Baru 1 musim', w: 4 },
    { n: 'Bu Lastri', ha: 0.15, h: 'Panen 2 musim', w: 4 },
    { n: 'Pak Yusuf', ha: 0.15, h: 'Panen 2 musim', w: 4 },
    { n: 'Pak Rudi', ha: 0.15, h: 'Baru 1 musim', w: 4 }
  ];
  const WSUM = MEMBERS.reduce((a, m) => a + m.w, 0);
  const SHOTS = [
    { g: 'A', f: 92, tip: 'Pisahkan 3 butir yang kulitnya mulai keriput.' },
    { g: 'B', f: 78, tip: 'Sortir butir yang lembek. Sisanya tetap layak dikirim.' },
    { g: 'A', f: 88, tip: 'Kemas dalam wadah berlubang dan kirim maksimal 24 jam.' }
  ];
  const LOTS = [
    { id: 'CBR-014', m: 0, st: 'Dikirim', g: 'A', f: 92 },
    { id: 'CBR-013', m: 1, st: 'Dipanen', g: 'A', f: 90 },
    { id: 'CBR-012', m: 2, st: 'Tertinggal', late: 3 },
    { id: 'CBR-011', m: 3, st: 'Dipanen', g: 'A', f: 88 },
    { id: 'CBR-010', m: 4, st: 'Dikirim', g: 'B', f: 81 },
    { id: 'CBR-009', m: 5, st: 'Tertinggal', late: 5 },
    { id: 'CBR-008', m: 6, st: 'Tumbuh' },
    { id: 'CBR-007', m: 7, st: 'Tumbuh' },
    { id: 'CBR-006', m: 8, st: 'Tumbuh' }
  ];
  const VIL = [['Pakis Aji', 91], ['Sumber Makmur', 78], ['Banjarejo', 64], ['Saptorenggo', 58], ['Sukodadi', 52], ['Ngebruk', 35]];
  const MENU = [
    ['Senin', ['Nasi', 'Ayam suwir cabai merah', 'Tumis sawi', 'Jeruk']],
    ['Selasa', ['Nasi', 'Telur balado', 'Sup wortel tomat', 'Pisang']],
    ['Rabu', ['Nasi', 'Ikan goreng', 'Sawi bawang merah', 'Melon']],
    ['Kamis', ['Nasi', 'Tempe orek', 'Sayur bening wortel', 'Semangka']],
    ['Jumat', ['Nasi', 'Semur ayam wortel', 'Lalapan tomat', 'Pepaya']]
  ];

  /* ---------- state ---------- */
  const S = { cur: 0, porsi: 3000, hari: 5, calc: false, k: 'cabai', res: 15, sent: false, acc: false, wa: false, shot: 0, phase: 'idle', qr: false, tab: 'sppg', pemda: 'sppg' };
  const rp = n => 'Rp' + Math.round(n).toLocaleString('id-ID');
  const need = k => S.porsi * S.hari * COMM[k].g / 1000;
  const fmt = n => (Math.round(n * 10) / 10).toLocaleString('id-ID');
  function quotas(k) {
    const target = Math.round(need(k) * (100 + S.res) / 100 + 1e-9);
    const raw = MEMBERS.map(m => m.w / WSUM * target), fl = raw.map(Math.floor);
    let left = target - fl.reduce((a, b) => a + b, 0);
    raw.map((r, i) => [r - fl[i], i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (left > 0) { fl[i]++; left--; } });
    return { target, q: fl };
  }
  const $ = s => document.querySelector(s);
  const ic = {
    alert: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C98B1F" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
    check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'
  };
  const toast = t => { const e = $('#toast'); e.textContent = t; e.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => e.classList.remove('show'), 2400); };

  /* ---------- kerangka ---------- */
  const SC = [
    { t: 'Input Menu', r: 'SPPG · Pak Bayu', web: true },
    { t: 'Pembagian Kuota', r: 'Koperasi · Bu Dewi', web: true },
    { t: 'Kuota Saya', r: 'Petani · Pak Joko', web: false },
    { t: 'Foto Mutu Panen', r: 'Petani · Pak Joko', web: false },
    { t: 'Pelacakan dan Dasbor', r: 'SPPG dan Pemda', web: true }
  ];
  const NOTES = [
    ['Ahli gizi SPPG memasukkan menu mingguan dan jumlah porsi. TANDUR menghitung kebutuhan kilogram tiap bahan.', ['Ubah jumlah porsi lalu tekan Hitung Kebutuhan.', 'Hasilnya diteruskan ke koperasi di layar berikutnya.'], 'Perhitungan memakai aturan pasti (gramasi per porsi), bukan AI, sehingga bisa dijelaskan dan diaudit.'],
    ['Manajer koperasi melihat target tanam dan pembagian kuota per anggota.', ['Geser cadangan untuk melihat kuota berubah.', 'Ganti komoditas untuk melihat kebutuhan lain.', 'Tekan Kirim Kontrak Tanam untuk meneruskan ke petani.'], 'Pembagian memakai algoritma optimasi sederhana (proporsional lahan dan riwayat panen, dengan cadangan). Bukan AI.'],
    ['Petani menerima kuota, jadwal, dan harga yang sudah pasti sebelum tanam. Bisa lewat aplikasi atau WhatsApp.', ['Tekan Terima Kontrak.', 'Pindah ke tampilan WhatsApp untuk petani yang tidak memasang aplikasi.'], 'Hanya sebagian hasil panen yang masuk kontrak. Sisanya bebas dijual ke pembeli lain.'],
    ['Petani memotret hasil panen. AI menilai grade dan kesegaran, lalu setiap lot mendapat kode QR.', ['Tekan tombol rana, lihat hasil, lalu Buat QR.', 'Coba foto lain untuk melihat hasil berbeda.'], 'Ini satu-satunya bagian yang memakai AI (Gemini): grade dan kesegaran saja, bukan ukuran. Di prototipe ini hasilnya simulasi.'],
    ['SPPG memantau pasokan dan mendapat peringatan dini bila ada yang tertinggal. Pemda melihat progres tanam per desa.', ['Klik baris lot untuk melihat asal-usul dan QR.', 'Buka tab Pemda untuk progres per desa.'], 'Peringatan dini dihitung dari kuota versus progres tanam, tanpa AI.']
  ];

  function renderSteps() {
    $('#steps').innerHTML = SC.map((s, i) => `<button class="step ${i === S.cur ? 'on' : ''}" data-go="${i}"><b><i>${i + 1}</i>${s.t}</b><small>${s.r}</small></button>`).join('');
  }
  function renderNote() {
    const n = NOTES[S.cur], s = SC[S.cur];
    $('#note').innerHTML = `<span class="pill role">${s.r}</span><h3>${s.t}</h3><p>${n[0]}</p><ul>${n[1].map(x => `<li>${x}</li>`).join('')}</ul><p style="font-size:12px;color:var(--brown2)"><b>Catatan jujur:</b> ${n[2]}</p>` +
      (S.cur < 4 ? `<button class="btn" data-go="${S.cur + 1}">Layar berikutnya</button>` : `<button class="btn ghost" data-go="0">Ulangi dari awal</button>`);
  }
  const browser = (url, nav, body) => `<div class="browser"><div class="bar"><span></span><span></span><span></span><em>${url}</em></div><div class="app"><div class="side"><img src="assets/logo.png" alt="TANDUR">${nav}</div><div class="main">${body}</div></div></div>`;
  const navLinks = (arr, on, who) => arr.map((x, i) => `<a class="${i === on ? 'on' : ''}">${x}</a>`).join('') + `<div class="who">${who}</div>`;
  const phone = (body, tab) => `<div class="phonewrap">${tab || ''}<div class="phone"><div class="screen"><div class="sbar"><span>9:41</span><span>●●● 100%</span></div>${body}</div></div></div>`;

  /* ---------- layar 1 ---------- */
  function s1() {
    const rows = Object.keys(COMM).map(k => `<tr><td>${COMM[k].n}</td><td class="num">${COMM[k].g} g</td><td class="num"><b>${fmt(need(k))} kg</b></td></tr>`).join('');
    const total = Object.keys(COMM).reduce((a, k) => a + need(k), 0);
    return browser('tandur.app/sppg/menu', navLinks(['Menu mingguan', 'Kebutuhan bahan', 'Pasokan', 'Laporan'], 0, 'Pak Bayu<br>Kepala SPPG Pakis'), `
      <h2>Menu mingguan</h2><div class="sub">SPPG Pakis · minggu depan</div>
      <div class="grid g3" style="margin-bottom:12px">
        <div><label>Porsi per hari</label><input type="number" id="porsi" value="${S.porsi}" min="100" step="100"></div>
        <div><label>Hari operasional</label><input type="number" id="hari" value="${S.hari}" min="1" max="7"></div>
        <div style="display:flex;align-items:end"><button class="btn" data-act="calc" style="width:100%">Hitung Kebutuhan</button></div>
      </div>
      <div class="card" style="padding:0;margin-bottom:12px"><table><tr><th style="width:80px">Hari</th><th>Menu</th></tr>${MENU.map(d => `<tr><td><b>${d[0]}</b></td><td>${d[1].map(c => `<span class="chip">${c}</span>`).join('')}</td></tr>`).join('')}</table></div>
      ${S.calc ? `<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><h3 style="font-size:15px">Kebutuhan bahan per minggu</h3><span class="chip ok">${S.porsi.toLocaleString('id-ID')} porsi × ${S.hari} hari</span></div>
        <table><tr><th>Bahan</th><th class="num">Gramasi per porsi</th><th class="num">Kebutuhan</th></tr>${rows}<tr><td><b>Total 5 bahan</b></td><td></td><td class="num"><b>${fmt(total)} kg</b></td></tr></table>
        <div style="margin-top:12px;display:flex;gap:10px;align-items:center;flex-wrap:wrap"><button class="btn brown" data-go="1">Teruskan ke KDMP Sumber Makmur</button><span class="legend" style="margin:0">Dikirim sebagai permintaan, bukan pesanan pembelian.</span></div></div>`
      : `<div class="card" style="text-align:center;color:var(--mute)">Tekan <b>Hitung Kebutuhan</b> untuk mengubah menu menjadi kilogram per bahan.</div>`}
      <div class="legend">Data ilustrasi.</div>`);
  }

  /* ---------- layar 2 ---------- */
  function s2() {
    const k = S.k, { target, q } = quotas(k), nd = need(k), tot = q.reduce((a, b) => a + b, 0);
    const rows = MEMBERS.map((m, i) => `<tr><td><b>${m.n}</b></td><td>${m.ha.toString().replace('.', ',')} ha</td><td style="color:var(--mute);font-size:12px">${m.h}</td><td style="width:34%"><div class="bar2"><i style="width:${q[i] / Math.max(...q) * 100}%"></i></div></td><td class="num"><b>${q[i]} kg</b></td></tr>`).join('');
    return browser('tandur.app/koperasi/kuota', navLinks(['Beranda', 'Permintaan SPPG', 'Pembagian kuota', 'Anggota', 'Keuangan'], 2, 'Bu Dewi<br>Manajer KDMP Sumber Makmur'), `
      <h2>Pembagian kuota tanam</h2><div class="sub">Permintaan dari SPPG Pakis · pasokan mingguan</div>
      <div class="grid g2" style="margin-bottom:12px">
        <div><label>Komoditas</label><select id="comm">${Object.keys(COMM).map(c => `<option value="${c}" ${c === k ? 'selected' : ''}>${COMM[c].n} (${fmt(need(c))} kg/minggu)</option>`).join('')}</select></div>
        <div><label>Cadangan pasokan: <b id="reslab">${S.res}%</b></label><input type="range" id="res" min="0" max="30" value="${S.res}"></div>
      </div>
      <div class="grid g4" style="margin-bottom:12px">
        <div class="card kpi"><small>Kebutuhan SPPG</small><b>${fmt(nd)} kg</b><span>per minggu</span></div>
        <div class="card kpi"><small>Cadangan</small><b>${S.res}%</b><span>untuk gagal panen kecil</span></div>
        <div class="card kpi"><small>Target tanam</small><b>${target} kg</b><span>per minggu</span></div>
        <div class="card kpi"><small>Harga disepakati</small><b>${rp(COMM[k].price)}</b><span>per kg, sebelum tanam</span></div>
      </div>
      <div class="card" style="padding:0"><table><tr><th>Anggota</th><th>Lahan</th><th>Riwayat</th><th>Porsi kuota</th><th class="num">Kuota</th></tr>${rows}<tr><td colspan="4"><b>Total kuota terbagi</b></td><td class="num"><b>${tot} kg</b></td></tr></table></div>
      <div style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap;align-items:center"><button class="btn" data-act="send" ${S.sent ? 'disabled' : ''}>${S.sent ? 'Kontrak terkirim ke petani' : 'Kirim Kontrak Tanam ke Petani'}</button>${S.sent ? '<button class="btn ghost" data-go="2">Lihat dari sisi petani</button>' : ''}</div>
      <div class="legend">Kuota dibagi menurut lahan dan riwayat panen. Data ilustrasi.</div>`);
  }

  /* ---------- layar 3 ---------- */
  function s3() {
    const { q } = quotas('cabai'), kg = q[0], c = COMM.cabai;
    const tab = `<div class="seg"><button class="${!S.wa ? 'on' : ''}" data-act="wa0">Aplikasi</button><button class="${S.wa ? 'on' : ''}" data-act="wa1">WhatsApp</button></div>`;
    if (S.wa) return phone(`<div class="phead"><img src="assets/logo.png" alt=""><div class="hi"><b>TANDUR</b>bot WhatsApp</div></div><div class="pbody"><div class="wa">
      <div class="m">Selamat pagi Pak Joko. Ada kontrak tanam baru dari KDMP Sumber Makmur.<br><br><b>Cabai merah ${kg} kg per minggu</b><br>Tanam: minggu ini<br>Panen: sekitar minggu ke-12<br>Harga: <b>${rp(c.price)}/kg</b><br><br>Sisa hasil panen bebas Bapak jual ke mana saja.<small>07.12</small></div>
      ${S.acc ? `<div class="m me">1<small>07.15</small></div><div class="m">Terima kasih Pak. Kontrak diterima. Pengingat tanam akan dikirim besok pagi.<small>07.15</small></div>` : `<div class="qr"><button data-act="accept">1 Terima</button><button data-act="ask">2 Tanya koperasi</button></div>`}
    </div></div>`, tab);
    return phone(`<div class="phead"><img src="assets/logo.png" alt=""><div class="hi">Halo,<b>Pak Joko</b></div></div><div class="pbody">
      <div class="big"><small>Kontrak tanam baru · KDMP Sumber Makmur</small><h3>${c.n}</h3>
        <div class="row"><span>Kuota</span><b>${kg} kg per minggu</b></div><div class="row"><span>Tanam</span><b>Minggu ini</b></div><div class="row"><span>Panen</span><b>Sekitar minggu ke-12</b></div><div class="row"><span>Harga pasti</span><b>${rp(c.price)}/kg</b></div><div class="row"><span>Nilai per minggu</span><b>${rp(kg * c.price)}</b></div></div>
      <div class="alert" style="margin-top:10px;font-size:12px"><div><b>Sisa panen bebas dijual</b>Hanya kuota ini yang terikat kontrak. Sisanya boleh Bapak jual ke mana saja.</div></div>
      ${S.acc ? `<div class="card" style="margin-top:10px"><span class="chip ok">Kontrak diterima</span><ul class="tl"><li class="done"><i></i>Kontrak diterima hari ini</li><li><i></i>Tanam, minggu ini</li><li><i></i>Pupuk dasar dan pengingat cuaca</li><li><i></i>Panen, sekitar minggu ke-12</li></ul><button class="btn" style="width:100%;margin-top:8px" data-go="3">Lanjut: foto hasil panen</button></div>`
      : `<div style="display:flex;gap:8px;margin-top:12px"><button class="btn" style="flex:1" data-act="accept">Terima Kontrak</button><button class="btn ghost" style="flex:1" data-act="ask">Tanya</button></div>`}
      <div class="legend" style="text-align:center">Data ilustrasi.</div></div>
      <div class="pnav"><div class="on">Kontrak</div><div>Jadwal</div><div>Panen</div><div>Saldo</div></div>`, tab);
  }

  /* ---------- layar 4 ---------- */
  const chili = '<svg class="ch" viewBox="0 0 300 150"><g fill="#C0392B" stroke="#8E2A20" stroke-width="2"><path d="M30 80c40-30 120-40 190-10 20 8 40 5 55-6-3 22-30 42-60 42-70 8-150 8-185-26z"/><path d="M45 105c50-18 110-22 170-4 22 6 42 2 56-8-6 20-32 36-60 36-60 6-130-4-166-24z" fill="#D14B3A"/></g><g fill="#3E4C21"><path d="M26 78c-8-8-8-20 2-26 6 6 10 14 8 24z"/><path d="M40 104c-9-6-12-18-4-26 6 4 12 12 12 22z"/></g></svg>';
  function s4() {
    const sh = SHOTS[S.shot], lot = 'CBR-014';
    let body;
    if (S.phase === 'idle') body = `<div class="view">${chili}<div class="guide"></div><div class="gtxt">Letakkan cabai di dalam bingkai</div></div><button class="shutter" data-act="shoot" aria-label="Ambil foto"></button><p style="text-align:center;font-size:12px;color:var(--mute);margin:8px 0 0">Foto contoh. Hasil di bawah adalah simulasi.</p>`;
    else if (S.phase === 'wait') body = `<div class="view">${chili}<div class="guide"></div></div><div style="text-align:center;margin-top:20px"><div class="spin"></div><p style="font-size:13px;color:var(--green);margin-top:10px">AI menilai mutu panen...</p></div>`;
    else body = `<div class="card"><div class="grade"><div class="g ${sh.g === 'B' ? 'b' : ''}">${sh.g}</div><div style="flex:1"><b>Grade ${sh.g}</b><div style="font-size:12px;color:var(--mute)">Kesegaran ${sh.f}%</div><div class="bar2" style="margin-top:6px"><i style="width:${sh.f}%"></i></div></div></div>
      <div class="alert" style="margin-top:10px;font-size:12px"><div><b>Saran</b>${sh.tip}</div></div>
      ${S.qr ? `<div class="qrbox"><div class="q">${TandurQR.svg('TANDUR|LOT:' + lot + '|Pak Joko|KDMP Sumber Makmur|Cabai merah ' + quotas('cabai').q[0] + ' kg|Grade ' + sh.g + '|Kesegaran ' + sh.f + '%|Data ilustrasi', { fg: '#2B1A14', bg: '#ffffff' })}</div><div style="font-size:12px"><b>Lot ${lot}</b><br>Tempel di kemasan. SPPG memindai untuk melihat asal dan mutu.<br><span class="chip ok">QR dibuat</span></div></div>
        <button class="btn" style="width:100%;margin-top:10px" data-go="4">Lihat di dasbor SPPG</button>`
      : `<div style="display:flex;gap:8px;margin-top:10px"><button class="btn" style="flex:1" data-act="mkqr">Buat QR</button><button class="btn ghost" style="flex:1" data-act="again">Foto lain</button></div>`}</div>
      <div class="legend" style="text-align:center">Penilaian AI hanya grade dan kesegaran. Simulasi.</div>`;
    return phone(`<div class="phead"><img src="assets/logo.png" alt=""><div class="hi">Foto mutu<b>Cabai merah · panen</b></div></div><div class="pbody">${body}</div><div class="pnav"><div>Kontrak</div><div>Jadwal</div><div class="on">Panen</div><div>Saldo</div></div>`);
  }

  /* ---------- layar 5 ---------- */
  function s5() {
    const { q } = quotas('cabai'), late = LOTS.filter(l => l.late), risk = late.reduce((a, l) => a + q[l.m], 0), target = quotas('cabai').target;
    const stc = l => ({ Dikirim: 'ok', Dipanen: 'ok', Tumbuh: '', Tertinggal: 'warn' }[l.st]);
    const sppg = `
      <div class="grid g3" style="margin-bottom:12px"><div class="card kpi"><small>Target pasokan cabai merah</small><b>${target} kg</b><span>minggu ini</span></div><div class="card kpi"><small>Sesuai jadwal</small><b>${target - risk} kg</b><span>${Math.round((target - risk) / target * 100)}% dari target</span></div><div class="card kpi"><small>Berisiko tertinggal</small><b style="color:var(--warn)">${risk} kg</b><span>${late.length} anggota</span></div></div>
      <div class="alert" style="margin-bottom:12px">${ic.alert}<div><b>Peringatan dini pasokan</b>${late.map(l => `${MEMBERS[l.m].name || MEMBERS[l.m].n} tertinggal ${l.late} hari`).join(', ')}. Kuota ${risk} kg berisiko. Hubungi koperasi atau siapkan pemasok cadangan sekarang.</div></div>
      <div class="card" style="padding:0"><table><tr><th>Lot</th><th>Petani</th><th class="num">Kuota</th><th>Mutu</th><th>Status</th></tr>${LOTS.map(l => `<tr class="click" data-lot="${l.id}"><td><b>${l.id}</b></td><td>${MEMBERS[l.m].n}</td><td class="num">${q[l.m]} kg</td><td>${l.g ? `Grade ${l.g} · ${l.f}%` : '<span style="color:var(--mute)">belum</span>'}</td><td><span class="chip ${stc(l)}">${l.st === 'Tertinggal' ? 'Tertinggal ' + l.late + ' hari' : l.st}</span></td></tr>`).join('')}</table></div>
      <div class="legend">Klik baris untuk melihat asal-usul lot. Peringatan dihitung dari kuota versus progres tanam.</div>`;
    const tot = Object.keys(COMM).reduce((a, k) => a + need(k), 0), weak = VIL.filter(v => v[1] < 55).length;
    const pemda = `
      <div class="grid g3" style="margin-bottom:12px"><div class="card kpi"><small>Kebutuhan MBG (5 komoditas)</small><b>${fmt(tot)} kg</b><span>per minggu, SPPG Pakis</span></div><div class="card kpi"><small>Desa terpantau</small><b>${VIL.length}</b><span>koperasi aktif</span></div><div class="card kpi"><small>Perlu pembinaan</small><b style="color:var(--warn)">${weak}</b><span>progres di bawah 55%</span></div></div>
      <div class="card"><h3 style="font-size:15px;margin-bottom:6px">Progres tanam sesuai kuota, per desa</h3>${VIL.map(v => `<div class="vil"><span>${v[0]}</span><div class="bar2 ${v[1] < 55 ? 'warn' : ''}"><i style="width:${v[1]}%"></i></div><b>${v[1]}%</b></div>`).join('')}</div>
      <div class="legend">Progres hari ini, bukan laporan sebulan kemudian. Data ilustrasi.</div>`;
    return browser('tandur.app/pasokan', navLinks(['Ringkasan', 'Pasokan', 'Asal-usul lot', 'Pengaturan'], 1, S.pemda === 'sppg' ? 'Pak Bayu<br>SPPG Pakis' : 'Bu Rina<br>Dinas Ketahanan Pangan'), `
      <h2>${S.pemda === 'sppg' ? 'Pasokan cabai merah minggu ini' : 'Pantauan Pemda'}</h2><div class="sub">${S.pemda === 'sppg' ? 'Dapur SPPG Pakis · KDMP Sumber Makmur' : 'Progres tanam desa binaan, Kabupaten Malang'}</div>
      <div class="tabs"><button class="${S.pemda === 'sppg' ? 'on' : ''}" data-act="t-sppg">Dapur SPPG</button><button class="${S.pemda === 'pemda' ? 'on' : ''}" data-act="t-pemda">Pemda</button></div>${S.pemda === 'sppg' ? sppg : pemda}`);
  }
  function openLot(id) {
    const l = LOTS.find(x => x.id === id), m = MEMBERS[l.m], q = quotas('cabai').q[l.m];
    const sh = SHOTS[0];
    $('#modal').innerHTML = `<div class="box"><div style="display:flex;justify-content:space-between;align-items:center"><h3>Asal-usul lot ${l.id}</h3><button class="btn ghost" data-act="close" style="padding:4px 12px">Tutup</button></div>
      <div style="display:flex;gap:14px;margin-top:12px;align-items:center"><div class="qr">${TandurQR.svg('TANDUR|LOT:' + l.id + '|' + m.n + '|KDMP Sumber Makmur|Cabai merah ' + q + ' kg|' + (l.g ? 'Grade ' + l.g + '|Kesegaran ' + l.f + '%' : 'Belum dinilai') + '|Data ilustrasi')}</div>
      <dl class="kv" style="margin:0;grid-template-columns:86px 1fr"><dt>Petani</dt><dd>${m.n}</dd><dt>Koperasi</dt><dd>KDMP Sumber Makmur</dd><dt>Komoditas</dt><dd>Cabai merah</dd><dt>Jumlah</dt><dd>${q} kg</dd><dt>Mutu</dt><dd>${l.g ? 'Grade ' + l.g + ', kesegaran ' + l.f + '%' : 'Belum dinilai'}</dd><dt>Status</dt><dd>${l.st}${l.late ? ', ' + l.late + ' hari' : ''}</dd></dl></div>
      <p class="legend">Data ilustrasi. QR ini dapat dipindai dengan kamera HP.</p></div>`;
    $('#modal').classList.add('show');
  }

  /* ---------- render & event ---------- */
  const SCREENS = [s1, s2, s3, s4, s5];
  function render(keepScroll) {
    renderSteps(); renderNote();
    $('#screen').innerHTML = SCREENS[S.cur]();
    if (!keepScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
    try { history.replaceState(null, '', '#' + (S.cur + 1)); } catch (e) { }
  }
  function go(i) { S.cur = i; if (i === 3) { S.phase = 'idle'; S.qr = false; } render(); }
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-go],[data-act],[data-lot]'); if (!t) { if (e.target.id === 'modal') $('#modal').classList.remove('show'); return; }
    if (t.dataset.go !== undefined) return go(+t.dataset.go);
    if (t.dataset.lot) return openLot(t.dataset.lot);
    const a = t.dataset.act;
    if (a === 'close') return $('#modal').classList.remove('show');
    if (a === 'calc') { S.porsi = Math.max(100, +$('#porsi').value || 3000); S.hari = Math.min(7, Math.max(1, +$('#hari').value || 5)); S.calc = true; }
    else if (a === 'send') { S.sent = true; toast('Kontrak tanam terkirim ke 9 anggota'); }
    else if (a === 'accept') { S.acc = true; toast('Kontrak diterima. Terima kasih Pak Joko'); }
    else if (a === 'ask') { toast('Pertanyaan diteruskan ke Bu Dewi (contoh)'); return; }
    else if (a === 'wa0') S.wa = false; else if (a === 'wa1') S.wa = true;
    else if (a === 'shoot') { S.phase = 'wait'; render(true); setTimeout(() => { S.phase = 'done'; render(true); }, 1300); return; }
    else if (a === 'mkqr') S.qr = true;
    else if (a === 'again') { S.shot = (S.shot + 1) % SHOTS.length; S.phase = 'idle'; S.qr = false; }
    else if (a === 't-sppg') S.pemda = 'sppg'; else if (a === 't-pemda') S.pemda = 'pemda';
    render(true);
  });
  document.addEventListener('change', e => { if (e.target.id === 'comm') { S.k = e.target.value; render(true); } if (e.target.id === 'res') { S.res = +e.target.value; render(true); } });
  document.addEventListener('input', e => { if (e.target.id === 'res') $('#reslab').textContent = e.target.value + '%'; });
  const h = parseInt((location.hash || '').slice(1), 10); if (h >= 1 && h <= 5) S.cur = h - 1;
  render(true);
})();
