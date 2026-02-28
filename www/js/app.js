function daysInThisMonth() {
  var now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}

function daysNameInThisMonth() {
  var now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDay();
}

function abbreviateNumber(number) {
  var SI_PREFIXES = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: ' Ribu' },
    { value: 1e6, symbol: ' Juta' },
    { value: 1e9, symbol: ' Milyar' },
    { value: 1e12, symbol: ' Triliun' },
  ]
  if (number === 0) return number

  var tier = SI_PREFIXES.filter((n) => number >= n.value).pop()
  var numberFixed = (number / tier.value).toFixed(0)

  return numberFixed + tier.symbol
}

// ========================================
// FUNGSI HELPER: Sequential Function Runner
// Menjalankan fungsi secara bergantian dengan max concurrent
// ========================================
function runFunctionsSequentially(functions, maxConcurrent) {
  maxConcurrent = maxConcurrent || 2; // Default max 2 concurrent

  console.log('🔄 Starting sequential execution of ' + functions.length + ' functions (max ' + maxConcurrent + ' concurrent)');

  var currentIndex = 0;
  var activeCount = 0;
  var completedCount = 0;

  function runNext() {
    // Jika semua fungsi sudah selesai
    if (completedCount >= functions.length) {
      console.log('✅ All functions completed (' + completedCount + '/' + functions.length + ')');
      return;
    }

    // Jalankan fungsi selama belum mencapai max concurrent dan masih ada fungsi
    while (activeCount < maxConcurrent && currentIndex < functions.length) {
      var funcIndex = currentIndex;
      var funcItem = functions[funcIndex];
      currentIndex++;
      activeCount++;

      console.log('▶️  Running: ' + funcItem.name + ' (' + (funcIndex + 1) + '/' + functions.length + ') [Active: ' + activeCount + ']');

      // Jalankan fungsi
      (function (index, item) {
        try {
          // Jika fungsi mengembalikan Promise atau memiliki callback
          var result = item.func();

          // Jika hasilnya Promise
          if (result && typeof result.then === 'function') {
            result.then(function () {
              onComplete(index, item.name);
            }).catch(function (err) {
              console.error('❌ Error in ' + item.name + ':', err);
              onComplete(index, item.name);
            });
          } else {
            // Jika bukan Promise, tunggu sebentar lalu lanjut
            setTimeout(function () {
              onComplete(index, item.name);
            }, 100);
          }
        } catch (error) {
          console.error('❌ Error executing ' + item.name + ':', error);
          onComplete(index, item.name);
        }
      })(funcIndex, funcItem);
    }
  }

  function onComplete(index, name) {
    activeCount--;
    completedCount++;
    console.log('✓ Completed: ' + name + ' (' + completedCount + '/' + functions.length + ') [Active: ' + activeCount + ']');

    // Jalankan fungsi berikutnya
    runNext();
  }

  // Mulai eksekusi
  runNext();
}

// ========================================
// FUNGSI HELPER: Wrap function untuk compatibility
// ========================================
function wrapFunction(func, name) {
  return function () {
    return new Promise(function (resolve) {
      try {
        func();
        // Tunggu sebentar untuk memastikan AJAX selesai
        setTimeout(resolve, 200);
      } catch (error) {
        console.error('Error in ' + name + ':', error);
        resolve();
      }
    });
  };
}

var $$ = Dom7;
var app = new Framework7({
  photoBrowser: {
    type: 'popup',
    toolbar: false
  },
  root: '#app', // App root element
  id: 'id.vertice.tasindosalesapp', // App bundle ID
  name: 'Admin', // App name
  theme: 'md', // Automatic theme detection
  // App root data
  data: function () {
    return {
    };
  },
  // App root methods
  methods: {
  },
  // App routes
  routes: routes,

  // Input settings
  input: {
    scrollIntoViewOnFocus: Framework7.device.cordova && !Framework7.device.electron,
    scrollIntoViewCentered: Framework7.device.cordova && !Framework7.device.electron,
  },
  // Cordova Statusbar settings
  statusbar: {
    iosOverlaysWebView: true,
    androidOverlaysWebView: false,
  },
  on: {
    init: function () {

      var f7 = this;

      if (f7.device.cordova) {
        cordovaApp.init(f7);
      }

      f7.on('pageAfterIn', function (page) {
        // Update GPS setiap pindah halaman (kecuali halaman login)
        if (localStorage.getItem("login") == "true" && page.name !== 'login') {
          updateUserLocation();
          initializeImageCompression();
          setTimeout(function () {
            // schedulePaymentWarningChecker();
            console.log('✅ Payment warning scheduler activated');
          }, 3000);
        }
      });

      if (localStorage.getItem("login") != "true") {
        setTimeout(function () {
          return app.views.main.router.navigate('/login');
        }, 300);
      } else {

        initNotificationManager(true);
        startTimeMain();
        $$('#karyawan-nama').html(localStorage.getItem("karyawan_nama"));
        setTimeout(function () {
          getPlayAudio();
          if (localStorage.getItem("user_id") == 260) {
            return app.views.main.router.navigate('/data-kas');
          } else if (localStorage.getItem("user_id") == 262) {
            return app.views.main.router.navigate('/data-kas');
          } else {
            return app.views.main.router.navigate('/data');
          }
        }, 300);
      }
    },
  },
});

// ========================================
// FUNGSI HELPER: Hitung jarak antara 2 koordinat (Haversine Formula)
// ========================================
function calculateDistance(lat1, lon1, lat2, lon2) {
  // Radius bumi dalam meter
  var R = 6371000; // meter

  // Convert derajat ke radian
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLon = (lon2 - lon1) * Math.PI / 180;

  var lat1Rad = lat1 * Math.PI / 180;
  var lat2Rad = lat2 * Math.PI / 180;

  // Haversine formula
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) *
    Math.cos(lat1Rad) * Math.cos(lat2Rad);

  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  var distance = R * c; // Jarak dalam meter

  return distance;
}

// ========================================
// FUNGSI UTAMA: Update User Location dengan Radius Check
// ========================================
function updateUserLocation() {
  console.log('🌍 Checking user location...');

  if (navigator.geolocation) {
    console.log('📍 Getting current position...');

    navigator.geolocation.getCurrentPosition(
      function (position) {
        var currentLat = position.coords.latitude;
        var currentLng = position.coords.longitude;

        console.log('📍 Current Position: ' + currentLat + ', ' + currentLng);

        // ========================================
        // CEK POSISI TERAKHIR DARI LOCALSTORAGE
        // ========================================
        var lastLat = parseFloat(localStorage.getItem("lat_usr"));
        var lastLng = parseFloat(localStorage.getItem("lng_usr"));

        console.log('📍 Last Position: ' + lastLat + ', ' + lastLng);

        // ========================================
        // HITUNG JARAK (jika ada posisi terakhir)
        // ========================================
        var shouldUpdate = false;
        var distance = 0;

        if (lastLat && lastLng && !isNaN(lastLat) && !isNaN(lastLng)) {
          // Hitung jarak dari posisi terakhir
          distance = calculateDistance(lastLat, lastLng, currentLat, currentLng);
          console.log('📏 Distance from last position: ' + distance.toFixed(2) + ' meters');

          // Update hanya jika jarak > 100 meter
          if (distance > 100) {
            console.log('✅ Distance > 100m, will update location');
            shouldUpdate = true;
          } else {
            console.log('⏭️ Distance < 100m, skip update (save: ' + (100 - distance).toFixed(2) + 'm)');
            shouldUpdate = false;
          }
        } else {
          // Tidak ada posisi terakhir, update langsung (first time)
          console.log('🆕 No previous location, first time update');
          shouldUpdate = true;
        }

        // ========================================
        // UPDATE KE DATABASE (jika perlu)
        // ========================================
        if (shouldUpdate) {
          // Simpan ke localStorage
          localStorage.setItem("lat_usr", currentLat);
          localStorage.setItem("lng_usr", currentLng);

          // Update ke database
          jQuery.ajax({
            type: "POST",
            url: BASE_API + "/update-user-location",
            dataType: "JSON",
            data: {
              user_id: localStorage.getItem("user_id"),
              latitude: currentLat,
              longitude: currentLng,
              appname: 'operasional',
              distance_moved: distance.toFixed(2) // Optional: kirim info jarak
            },
            success: function (data) {
              console.log('✅ GPS Updated: ' + currentLat + ', ' + currentLng + ' (moved: ' + distance.toFixed(2) + 'm)');
            },
            error: function (xhr, status, error) {
              console.error('❌ GPS Update Failed: ' + error);

              // Jika error, rollback localStorage ke posisi lama
              if (lastLat && lastLng) {
                localStorage.setItem("lat_usr", lastLat);
                localStorage.setItem("lng_usr", lastLng);
                console.log('⏮️ Rollback to last position');
              }
            }
          });
        } else {
          console.log('⏭️ Location update skipped (within 100m radius)');
        }
      },
      function (error) {
        console.error('❌ Geolocation Error: ' + error.message);
        console.error('   Error Code: ' + error.code);

        // Handle berbagai error code
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.error('   User denied GPS permission');
            app.dialog.alert(
              'Aktifkan izin GPS untuk kestabilan server',
              function () {
                localStorage.clear();
                return app.views.main.router.navigate('/login');
              }
            );
            break;

          case error.POSITION_UNAVAILABLE:
            console.error('   Location information unavailable');
            app.toast.create({
              text: 'GPS tidak tersedia, coba lagi nanti',
              closeTimeout: 3000
            }).open();
            break;

          case error.TIMEOUT:
            console.error('   GPS timeout');
            app.toast.create({
              text: 'GPS timeout, coba lagi',
              closeTimeout: 3000
            }).open();
            break;

          default:
            console.error('   Unknown GPS error');
            app.dialog.alert(
              'Aktifkan GPS untuk kestabilan server',
              function () {
                localStorage.clear();
                return app.views.main.router.navigate('/login');
              }
            );
            break;
        }
      },
      {
        timeout: 15000,
        enableHighAccuracy: true,
        maximumAge: 0
      }
    );
  } else {
    console.error('❌ Geolocation not supported by this browser');
    app.dialog.alert('Browser tidak support GPS');
  }
}

// ========================================
// OPTIONAL: Fungsi untuk force update (ignore radius)
// ========================================
function forceUpdateUserLocation() {
  console.log('🌍 Force updating user location (ignore radius)...');

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        // Simpan ke localStorage
        localStorage.setItem("lat_usr", lat);
        localStorage.setItem("lng_usr", lng);

        console.log('📍 Force Update Position: ' + lat + ', ' + lng);

        // Update ke database
        jQuery.ajax({
          type: "POST",
          url: BASE_API + "/update-user-location",
          dataType: "JSON",
          data: {
            user_id: localStorage.getItem("user_id"),
            latitude: lat,
            longitude: lng,
            appname: 'operasional',
            force_update: true // Flag untuk backend
          },
          success: function (data) {
            console.log('✅ GPS Force Updated: ' + lat + ', ' + lng);
          },
          error: function (xhr, status, error) {
            console.error('❌ GPS Force Update Failed: ' + error);
          }
        });
      },
      function (error) {
        console.error('❌ GPS Error: ' + error.message);
      },
      {
        timeout: 15000,
        enableHighAccuracy: true,
        maximumAge: 0
      }
    );
  }
}

// ========================================
// PAGE: data
// MODIFIKASI: Fungsi berjalan sequential dengan max 2 concurrent
// ========================================
$$(document).on('page:afterin', '.page[data-name="data"]', function (e) {
  // Fungsi UI yang langsung dijalankan (tidak perlu sequential)
  $$('#karyawan-nama').html(localStorage.getItem("karyawan_nama"));

  if (localStorage.getItem("user_id") == 262 || localStorage.getItem("user_id") == 260) {
    jQuery('#showFilterKasData').show();
  } else {
    jQuery('#showFilterKasData').hide();
  }

  if (localStorage.getItem("user_id") == 262) {
    jQuery('#pengumuman_logo').hide();
    jQuery('#pengajuan_logo').show();
  } else {
    jQuery('#pengumuman_logo').show();
    jQuery('#pengajuan_logo').hide();
  }

  // Fungsi yang memerlukan AJAX - jalankan sequential
  runFunctionsSequentially([
    { name: 'internetCheck', func: wrapFunction(() => internetCheckQueue.check(), 'internetCheck') },
    { name: 'getMenuUser', func: wrapFunction(getMenuUser, 'getMenuUser') },
    { name: 'checkLogin', func: wrapFunction(checkLogin, 'checkLogin') },
    { name: 'checkConnection', func: wrapFunction(checkConnection, 'checkConnection') },
    { name: 'getPengajuan', func: wrapFunction(getPengajuan, 'getPengajuan') },
    { name: 'comboKasFilter', func: wrapFunction(comboKasFilter, 'comboKasFilter') },
    { name: 'getBulanTransaksi', func: wrapFunction(getBulanTransaksi, 'getBulanTransaksi') },
    { name: 'getYearTransaksi', func: wrapFunction(getYearTransaksi, 'getYearTransaksi') },
    { name: 'getDataTransaksi', func: wrapFunction(getDataTransaksi, 'getDataTransaksi') },
    { name: 'checkKasMinimum', func: wrapFunction(checkKasMinimum, 'checkKasMinimum') },
    { name: 'checkReminderKategoriAcc', func: wrapFunction(checkReminderKategoriAcc, 'checkReminderKategoriAcc') }
  ], 2); // Max 2 concurrent
});

// ========================================
// PAGE: data_kas
// MODIFIKASI: Fungsi berjalan sequential dengan max 2 concurrent
// ========================================
$$(document).on('page:afterin', '.page[data-name="data_kas"]', function (e) {
  // Fungsi UI yang langsung dijalankan
  $$('#karyawan-nama').html(localStorage.getItem("karyawan_nama"));

  if (localStorage.getItem("user_id") == 262 || localStorage.getItem("user_id") == 260) {
    jQuery('#showFilterKasDataTransaksi').show();
  } else {
    jQuery('#showFilterKasDataTransaksi').hide();
  }

  if (localStorage.getItem("user_id") == 262) {
    jQuery('#pengumuman_logo').hide();
    jQuery('#pengajuan_logo').show();
  } else {
    jQuery('#pengumuman_logo').show();
    jQuery('#pengajuan_logo').hide();
  }

  // Fungsi yang memerlukan AJAX - jalankan sequential
  runFunctionsSequentially([
    { name: 'internetCheck', func: wrapFunction(() => internetCheckQueue.check(), 'internetCheck') },
    { name: 'getMenuUser', func: wrapFunction(getMenuUser, 'getMenuUser') },
    { name: 'checkLogin', func: wrapFunction(checkLogin, 'checkLogin') },
    { name: 'checkConnection', func: wrapFunction(checkConnection, 'checkConnection') },
    { name: 'dateRangeDeclarationDataOperationalKas', func: wrapFunction(dateRangeDeclarationDataOperationalKas, 'dateRangeDeclarationDataOperationalKas') },
    { name: 'getPengajuan', func: wrapFunction(getPengajuan, 'getPengajuan') },
    { name: 'getBulanTransaksiKas', func: wrapFunction(getBulanTransaksiKas, 'getBulanTransaksiKas') },
    { name: 'getYearTransaksiKas', func: wrapFunction(getYearTransaksiKas, 'getYearTransaksiKas') },
    { name: 'getDataTransaksiKas', func: wrapFunction(getDataTransaksiKas, 'getDataTransaksiKas') },
    { name: 'comboKasFilterOut', func: wrapFunction(comboKasFilterOut, 'comboKasFilterOut') },
    { name: 'checkKasMinimum', func: wrapFunction(checkKasMinimum, 'checkKasMinimum') },
    { name: 'checkReminderKategoriAcc', func: wrapFunction(checkReminderKategoriAcc, 'checkReminderKategoriAcc') }
  ], 2); // Max 2 concurrent
});

// ========================================
// PAGE: master
// MODIFIKASI: Fungsi berjalan sequential dengan max 2 concurrent
// ========================================
$$(document).on('page:afterin', '.page[data-name="master"]', function (e) {
  // Fungsi UI yang langsung dijalankan
  $$('#karyawan-nama').html(localStorage.getItem("karyawan_nama"));
  jQuery('#tambah_show_ipl').hide();
  jQuery('#edit_show_ipl').hide();

  if (localStorage.getItem("user_id") == 262 || localStorage.getItem("user_id") == 260) {
    jQuery('#show_opsi_master_kategori').show();
  } else {
    jQuery('#show_opsi_master_kategori').hide();
  }

  if (localStorage.getItem("user_id") == 262) {
    jQuery('#pengumuman_logo').hide();
    jQuery('#pengajuan_logo').show();
  } else {
    jQuery('#pengumuman_logo').show();
    jQuery('#pengajuan_logo').hide();
  }

  // Fungsi yang memerlukan AJAX - jalankan sequential
  runFunctionsSequentially([
    { name: 'internetCheck', func: wrapFunction(() => internetCheckQueue.check(), 'internetCheck') },
    { name: 'getMenuUser', func: wrapFunction(getMenuUser, 'getMenuUser') },
    { name: 'checkLogin', func: wrapFunction(checkLogin, 'checkLogin') },
    { name: 'checkConnection', func: wrapFunction(checkConnection, 'checkConnection') },
    { name: 'checkKasMinimum', func: wrapFunction(checkKasMinimum, 'checkKasMinimum') },
    { name: 'getPengajuan', func: wrapFunction(getPengajuan, 'getPengajuan') },
    { name: 'getDataKategori', func: wrapFunction(getDataKategori, 'getDataKategori') },
    { name: 'checkReminderKategoriAcc', func: wrapFunction(checkReminderKategoriAcc, 'checkReminderKategoriAcc') }
  ], 2); // Max 2 concurrent
});

// ========================================
// PAGE: master_expedisi
// MODIFIKASI: Fungsi berjalan sequential dengan max 2 concurrent
// ========================================
$$(document).on('page:afterin', '.page[data-name="master_expedisi"]', function (e) {
  // Fungsi UI yang langsung dijalankan
  $$('#karyawan-nama').html(localStorage.getItem("karyawan_nama"));

  if (localStorage.getItem("user_id") == 262) {
    jQuery('#show_opsi_master_expedisi').show();
    jQuery('#pengumuman_logo').hide();
    jQuery('#pengajuan_logo').show();
  } else {
    jQuery('#show_opsi_master_expedisi').hide();
    jQuery('#pengumuman_logo').show();
    jQuery('#pengajuan_logo').hide();
  }

  // Fungsi yang memerlukan AJAX - jalankan sequential
  runFunctionsSequentially([
    { name: 'internetCheck', func: wrapFunction(() => internetCheckQueue.check(), 'internetCheck') },
    { name: 'getMenuUser', func: wrapFunction(getMenuUser, 'getMenuUser') },
    { name: 'checkLogin', func: wrapFunction(checkLogin, 'checkLogin') },
    { name: 'checkConnection', func: wrapFunction(checkConnection, 'checkConnection') },
    { name: 'checkKasMinimum', func: wrapFunction(checkKasMinimum, 'checkKasMinimum') },
    { name: 'getPengajuan', func: wrapFunction(getPengajuan, 'getPengajuan') },
    { name: 'getDataPerusahaan', func: wrapFunction(getDataPerusahaan, 'getDataPerusahaan') },
    { name: 'checkReminderKategoriAcc', func: wrapFunction(checkReminderKategoriAcc, 'checkReminderKategoriAcc') }
  ], 2); // Max 2 concurrent
});

// ========================================
// PAGE: master-kas
// MODIFIKASI: Fungsi berjalan sequential dengan max 2 concurrent
// ========================================
$$(document).on('page:afterin', '.page[data-name="master-kas"]', function (e) {
  // Fungsi UI yang langsung dijalankan
  $$('#karyawan-nama').html(localStorage.getItem("karyawan_nama"));

  if (localStorage.getItem("user_id") == 262) {
    jQuery('#pengumuman_logo').hide();
    jQuery('#pengajuan_logo').show();
  } else {
    jQuery('#pengumuman_logo').show();
    jQuery('#pengajuan_logo').hide();
  }

  // Fungsi yang memerlukan AJAX - jalankan sequential
  runFunctionsSequentially([
    { name: 'internetCheck', func: wrapFunction(() => internetCheckQueue.check(), 'internetCheck') },
    { name: 'getMenuUser', func: wrapFunction(getMenuUser, 'getMenuUser') },
    { name: 'checkLogin', func: wrapFunction(checkLogin, 'checkLogin') },
    { name: 'checkConnection', func: wrapFunction(checkConnection, 'checkConnection') },
    { name: 'checkKasMinimum', func: wrapFunction(checkKasMinimum, 'checkKasMinimum') },
    { name: 'getPengajuan', func: wrapFunction(getPengajuan, 'getPengajuan') },
    { name: 'getDataMasterKas', func: wrapFunction(getDataMasterKas, 'getDataMasterKas') },
    { name: 'checkReminderKategoriAcc', func: wrapFunction(checkReminderKategoriAcc, 'checkReminderKategoriAcc') }
  ], 2); // Max 2 concurrent
});

// ========================================
// PAGE: neraca
// MODIFIKASI: Fungsi berjalan sequential dengan max 2 concurrent
// ========================================
$$(document).on('page:afterin', '.page[data-name="neraca"]', function (e) {
  // Fungsi UI yang langsung dijalankan
  $$('#karyawan-nama').html(localStorage.getItem("karyawan_nama"));

  if (localStorage.getItem("user_id") == 262 || localStorage.getItem("user_id") == 260) {
    jQuery('#showFilterKasNeraca').show();
    document.getElementById('showFilterKasNeraca').style.width = '50%';
    document.getElementById('showKeteranganNeraca').style.width = '50%';
  } else {
    jQuery('#showFilterKasNeraca').hide();
    document.getElementById('showKeteranganNeraca').style.width = '100%';
  }

  if (localStorage.getItem("user_id") == 262) {
    jQuery('#pengumuman_logo').hide();
    jQuery('#pengajuan_logo').show();
  } else {
    jQuery('#pengumuman_logo').show();
    jQuery('#pengajuan_logo').hide();
  }

  // Fungsi yang memerlukan AJAX - jalankan sequential
  runFunctionsSequentially([
    { name: 'internetCheck', func: wrapFunction(() => internetCheckQueue.check(), 'internetCheck') },
    { name: 'getMenuUser', func: wrapFunction(getMenuUser, 'getMenuUser') },
    { name: 'checkLogin', func: wrapFunction(checkLogin, 'checkLogin') },
    { name: 'checkConnection', func: wrapFunction(checkConnection, 'checkConnection') },
    { name: 'checkKasMinimum', func: wrapFunction(checkKasMinimum, 'checkKasMinimum') },
    { name: 'getPengajuan', func: wrapFunction(getPengajuan, 'getPengajuan') },
    { name: 'dateRangeDeclarationDataNeraca', func: wrapFunction(dateRangeDeclarationDataNeraca, 'dateRangeDeclarationDataNeraca') },
    { name: 'getBulanOperasional', func: wrapFunction(getBulanOperasional, 'getBulanOperasional') },
    { name: 'getYearOperasional', func: wrapFunction(getYearOperasional, 'getYearOperasional') },
    { name: 'comboKasFilterNeraca', func: wrapFunction(comboKasFilterNeraca, 'comboKasFilterNeraca') },
    { name: 'getDataJurnal', func: wrapFunction(getDataJurnal, 'getDataJurnal') },
    { name: 'checkReminderKategoriAcc', func: wrapFunction(checkReminderKategoriAcc, 'checkReminderKategoriAcc') }
  ], 2); // Max 2 concurrent
});

// ========================================
// PAGE: login
// MODIFIKASI: Fungsi berjalan sequential dengan max 2 concurrent
// ========================================
$$(document).on('page:afterin', '.page[data-name="login"]', function (e) {
  // Fungsi UI yang langsung dijalankan
  $$('#logout_logo').css("display", "none");
  $$('#pengumuman_logo').css("display", "none");
  $$('#pengajuan_logo').css("display", "none");

  // Fungsi yang memerlukan AJAX - jalankan sequential
  runFunctionsSequentially([
    { name: 'internetCheck', func: wrapFunction(() => internetCheckQueue.check(), 'internetCheck') },
    { name: 'startTimeMain', func: wrapFunction(startTimeMain, 'startTimeMain') },
    { name: 'checkConnection', func: wrapFunction(checkConnection, 'checkConnection') },
    { name: 'checkReminderKategoriAcc', func: wrapFunction(checkReminderKategoriAcc, 'checkReminderKategoriAcc') }
  ], 2); // Max 2 concurrent
});


/**
 * Inisialisasi NotificationManager
 * Dipanggil setelah login berhasil
 * @param {boolean} forceRefresh - true jika setelah login (bukan app init)
 */
function initNotificationManager(forceRefresh) {
  var userId = localStorage.getItem("user_id");

  if (!userId) {
    console.log('[App] No user_id found, skipping notification init');
    return;
  }

  if (typeof cordova !== 'undefined' && document.readyState !== 'complete') {
    document.addEventListener('deviceready', function () {
      _doInitNotification(userId, forceRefresh);
    }, false);
  } else {
    setTimeout(function () {
      _doInitNotification(userId, forceRefresh);
    }, 500);
  }
}

function _doInitNotification(userId, forceRefresh) {
  if (typeof NotificationManager === 'undefined') {
    console.warn('[App] NotificationManager not loaded');
    return;
  }

  if (typeof BASE_API !== 'undefined') {
    NotificationManager.config.apiUrl = BASE_API;
  }

  NotificationManager.init(userId, forceRefresh || false);

  if (forceRefresh && NotificationManager.forceRefreshToken) {
    setTimeout(function () {
      NotificationManager.forceRefreshToken();
    }, 1000);
  }

  console.log('[App] NotificationManager initialized for user:', userId);
}

/**
 * Cleanup NotificationManager sebelum logout
 * Panggil ini di fungsi logOut()
 */
function cleanupNotificationManager(callback) {
  if (typeof NotificationManager !== 'undefined' && NotificationManager.isInitialized) {
    NotificationManager.cleanup(function () {
      console.log('[App] NotificationManager cleaned up');
      if (callback) callback();
    });
  } else {
    if (callback) callback();
  }
}