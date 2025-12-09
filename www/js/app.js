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

      if (localStorage.getItem("login") != "true") {
        setTimeout(function () {
          return app.views.main.router.navigate('/login');
        }, 300);
      } else {
        getMenuUser();
        getPengumuman();
        getPengajuan();
        checkKasMinimum();
        startTimeMain();
        $$('#karyawan-nama').html(localStorage.getItem("karyawan_nama"));
        checkReminderKategoriAcc();
        setTimeout(function () {
          if (localStorage.getItem("user_id") == 260) {
            return app.views.main.router.navigate('/data-kas');
          } else if (localStorage.getItem("user_id") == 262) {
            return app.views.main.router.navigate('/data-kas');
          } else {
            return app.views.main.router.navigate('/data');
          }
        }, 300);
        // }
      }
    },
  },
});

$$(document).on('page:afterin', '.page[data-name="data"]', function (e) {
  getMenuUser();
  checkLogin();
  checkConnection();
  dateRangeDeclarationDataOperational();

  getPengumuman();
  getPengajuan();
  comboKasFilter();
  getBulanTransaksi();
  getYearTransaksi();
  getDataTransaksi();
  checkKasMinimum();

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
  $$('#karyawan-nama').html(localStorage.getItem("karyawan_nama"));

  checkReminderKategoriAcc();
});

$$(document).on('page:afterin', '.page[data-name="data_kas"]', function (e) {
  getMenuUser();
  checkLogin();
  checkConnection();
  dateRangeDeclarationDataOperationalKas();
  getPengumuman();
  getPengajuan();
  getBulanTransaksiKas();
  getYearTransaksiKas();
  getDataTransaksiKas();
  comboKasFilterOut();
  checkKasMinimum();
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
  $$('#karyawan-nama').html(localStorage.getItem("karyawan_nama"));

  checkReminderKategoriAcc();
});

$$(document).on('page:afterin', '.page[data-name="master"]', function (e) {
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
  getMenuUser();
  checkLogin();
  checkConnection();

  getPengumuman();
  checkKasMinimum();
  getPengajuan();
  getDataKategori();
  $$('#karyawan-nama').html(localStorage.getItem("karyawan_nama"));
  jQuery('#tambah_show_ipl').hide();
  jQuery('#edit_show_ipl').hide();
  checkReminderKategoriAcc();
});


$$(document).on('page:afterin', '.page[data-name="master_expedisi"]', function (e) {
  if (localStorage.getItem("user_id") == 262) {
    jQuery('#show_opsi_master_expedisi').show();
  } else {
    jQuery('#show_opsi_master_expedisi').hide();
  }
  if (localStorage.getItem("user_id") == 262) {
    jQuery('#pengumuman_logo').hide();
    jQuery('#pengajuan_logo').show();
  } else {
    jQuery('#pengumuman_logo').show();
    jQuery('#pengajuan_logo').hide();
  }
  getMenuUser();
  checkLogin();
  checkConnection();
  checkKasMinimum();

  getPengumuman();
  getPengajuan();
  getDataPerusahaan();
  $$('#karyawan-nama').html(localStorage.getItem("karyawan_nama"));
  checkReminderKategoriAcc();
});


$$(document).on('page:afterin', '.page[data-name="master-kas"]', function (e) {
  getMenuUser();
  checkLogin();
  checkConnection();

  if (localStorage.getItem("user_id") == 262) {
    jQuery('#pengumuman_logo').hide();
    jQuery('#pengajuan_logo').show();
  } else {
    jQuery('#pengumuman_logo').show();
    jQuery('#pengajuan_logo').hide();
  }
  getPengumuman();
  checkKasMinimum();
  getPengajuan();
  getDataMasterKas();
  $$('#karyawan-nama').html(localStorage.getItem("karyawan_nama"));
  checkReminderKategoriAcc();
});

$$(document).on('page:afterin', '.page[data-name="neraca"]', function (e) {
  getMenuUser();
  checkLogin();
  checkConnection();

  getPengumuman();
  checkKasMinimum();
  getPengajuan();
  dateRangeDeclarationDataNeraca();
  getBulanOperasional();
  getYearOperasional();
  comboKasFilterNeraca();
  getDataJurnal();
  if (localStorage.getItem("user_id") == 262 || localStorage.getItem("user_id") == 260) {
    jQuery('#showFilterKasNeraca').show();
    document.getElementById('showFilterKasNeraca').style.width = '50%'
    document.getElementById('showKeteranganNeraca').style.width = '50%'
  } else {
    jQuery('#showFilterKasNeraca').hide();
    document.getElementById('showKeteranganNeraca').style.width = '100%'
  }
  if (localStorage.getItem("user_id") == 262) {
    jQuery('#pengumuman_logo').hide();
    jQuery('#pengajuan_logo').show();
  } else {
    jQuery('#pengumuman_logo').show();
    jQuery('#pengajuan_logo').hide();
  }
  // comboKategoriFilterNeraca();
  $$('#karyawan-nama').html(localStorage.getItem("karyawan_nama"));
  checkReminderKategoriAcc();
});

// Page penjualan input On load
$$(document).on('page:afterin', '.page[data-name="login"]', function (e) {
  $$('#logout_logo').css("display", "none");
  $$('#pengumuman_logo').css("display", "none");
  $$('#pengajuan_logo').css("display", "none");
  startTimeMain();
  checkConnection();
  checkReminderKategoriAcc();
});
