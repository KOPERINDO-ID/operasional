function startTimeMain() {
  var today = new Date();
  var d = today.getDate();
  var mon = today.getMonth();
  var y = today.getFullYear();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  const month_names_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  m = checkTimeMain(m);
  s = checkTimeMain(s);
  document.getElementById('clock_view').innerHTML =
    "<b> " + h + ":" + m + ":" + s + "<br> " + d + "/" + month_names_short[mon] + "/" + y + " </b>";
  var t = setTimeout(startTimeMain, 500);
}
function checkTimeMain(i) {
  if (i < 10) { i = "0" + i };
  return i;
}
// allow user rotate
screen.orientation.unlock();

// access current orientation


document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
}

function htmlToImage() {
  window.canvas2ImagePlugin.saveImageDataToLibrary(
    function (msg) {
      alert(msg);
    },
    function (err) {
      alert(err)
    },
    document.getElementById("myCanvas"),
    "jpeg" // format is optional, defaults to 'png'
  );
}

function checkReminderKategoriAcc() {
  jQuery.ajax({
    type: 'POST',
    url: BASE_API + '/kategori-acc-reminder',
    dataType: 'JSON',
    data: {
      karyawan_id: localStorage.getItem("user_id"),
      primary_kas: localStorage.getItem("primary_kas")
    },
    beforeSend: function () {
      // internetCheckQueue.check();
    },
    success: function (res) {
      if (!(res && res.status === 'success' && Array.isArray(res.data))) return;

      var overdueNames = [];   // H, H+1, H+2, ...
      var warningNames = [];   // H-5 .. H-1
      var maxLate = 0;

      jQuery.each(res.data, function (_, row) {
        // opsional: pastikan cuma yang belum terbayar
        if (row.paid === true) return;

        var dleft = Number(row.days_left);
        if (!Number.isFinite(dleft)) return;

        if (dleft <= 0) {
          // H dan lewat H (tetap merah)
          overdueNames.push(row.kategori_acc);
          var late = Math.abs(dleft);
          if (late > maxLate) maxLate = late;
        } else if (dleft <= 5) {
          // hanya H-5..H-1 yang dianggap warning
          warningNames.push(row.kategori_acc);
        }
        // dleft > 5 => abaikan (terlalu jauh, TIDAK ADA WARNING)
      });

      // tidak ada apa pun dalam jendela => diam
      if (overdueNames.length === 0 && warningNames.length === 0) return;

      var title = '⚠️ Reminder Tagihan';
      var text;

      if (overdueNames.length > 0) {
        text = 'H+' + maxLate +
          ' terdeteksi kedisiplinan administrasi, harap tidak terulang. ' +
          'Tagihan yang terlambat adalah ( ' + overdueNames.join(', ') + ' ).';
        playAudio();
      } else {
        text = 'Terdeteksi tagihan bulanan yang belum terbayar, ' +
          'segera lakukan pembayaran. Tagihan yang mendekati jatuh tempo adalah ( ' +
          warningNames.join(', ') + ' ).';
        playAudio();
      }

      app.dialog.create({
        title: title,
        text: text,
        buttons: [{ text: 'OK', bold: true }],
        destroyOnClose: true
      }).open();
    },
    error: function (xhr, status, err) {
      console.error('Error load reminder:', err);
    }
  });
}

function playAudio(maxMs = 20000) {
  const audio = document.getElementById('reminder-audio');
  if (!audio) {
    console.warn('Elemen #reminder-audio tidak ditemukan');
    return;
  }

  // reset posisi & pastikan unmuted
  audio.currentTime = 0;
  audio.muted = false;

  const playPromise = audio.play();

  // Browser modern mengembalikan Promise
  if (playPromise && typeof playPromise.then === 'function') {
    playPromise.then(() => {
      // sukses play → hentikan otomatis setelah maxMs
      setTimeout(() => {
        try { audio.pause(); audio.currentTime = 0; } catch (e) { }
      }, maxMs);
    }).catch((err) => {
      console.log('Autoplay diblokir, minta gesture user:', err);

      // Tawarkan tombol "Bunyikan" agar ada user gesture
      app.dialog.create({
        title: '🔔 Bunyi Pengingat',
        text: 'Browser memblokir pemutaran otomatis. Tekan "Bunyikan" untuk memutar suara.',
        buttons: [
          { text: 'Tutup' },
          {
            text: 'Bunyikan',
            bold: true,
            onClick: () => {
              // Ini berjalan via user gesture → harusnya lolos
              audio.currentTime = 0;
              audio.play().then(() => {
                setTimeout(() => {
                  try { audio.pause(); audio.currentTime = 0; } catch (e) { }
                }, maxMs);
              }).catch(e2 => {
                console.error('Gagal memutar meski dengan gesture:', e2);
              });
            }
          }
        ],
        destroyOnClose: true
      }).open();
    });
  }
}


function getMenuUser() {
  app.dialog.close();
  if (localStorage.getItem("user_id") == 260) {
    jQuery('.menu-ninda').show();
    jQuery('.menu-manan').hide();
    jQuery('.menu-owner').hide();
  } else if (localStorage.getItem("user_id") == 262) {
    jQuery('.menu-ninda').hide();
    jQuery('.menu-manan').hide();
    jQuery('.menu-owner').show();
  } else {
    jQuery('.menu-ninda').hide();
    jQuery('.menu-manan').show();
    jQuery('.menu-owner').hide();
  }
}

function showLineGraph() {

}


function showday() {



  const getDaysByMonth = (month) => {
    const daysInMonth = moment(month).daysInMonth();
    return Array.from({ length: daysInMonth }, (v, k) => k + 1)
  };

  let month = '2020-02';
  var dayday = getDaysByMonth(month);



  for (var i = 0; i < 7; i++) {



  }



}