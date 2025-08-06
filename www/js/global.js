

// Configuration APP
function checkConnection() {
	var networkState = navigator.connection.type;

	var states = {};
	states[Connection.UNKNOWN] = 'Unknown connection';
	states[Connection.ETHERNET] = 'Ethernet connection';
	states[Connection.WIFI] = 'WiFi connection';
	states[Connection.CELL_2G] = 'Cell 2G connection';
	states[Connection.CELL_3G] = 'Cell 3G connection';
	states[Connection.CELL_4G] = 'Cell 4G connection';
	states[Connection.CELL] = 'Cell generic connection';
	states[Connection.NONE] = 'no_network';

	if (states[networkState] == 'no_network') {
		app.dialog.alert('Internet Sangat Lambat, Cek Koneksi Lalu Klik Oke', function () {
			app.views.main.router.navigate(app.views.main.router.currentRoute.url, {
				ignoreCache: true,
				reloadCurrent: true
			});
		});
	}
}




var BASE_API = 'https://tasindo-sale-webservice.digiseminar.id/api';

var BASE_API2 = 'https://tasindo-sale-webservice.digiseminar.id/api';
var BASE_PATH_IMAGE_ABSEN = 'https://tasindo-sale-webservice.digiseminar.id/absen';
var BASE_PATH_IMAGE = 'https://tasindo-sale-webservice.digiseminar.id/kunjungan';
var BASE_PATH_IMAGE_PERFORMA = 'https://tasindo-sale-webservice.digiseminar.id/performa_image';
var BASE_PATH_IMAGE_CUSTOMER = 'https://tasindo-sale-webservice.digiseminar.id/customer_logo';
var BASE_PATH_IMAGE_PRODUCT = 'https://tasindo-sale-webservice.digiseminar.id/product_image';
var BASE_PATH_IMAGE_BROADCAST = 'https://tasindo-sale-webservice.digiseminar.id/gambar_broadcast';
var BASE_PATH_IMAGE_SURAT_JALAN = 'https://tasindo-sale-webservice.digiseminar.id/foto_surat_jalan';
var BASE_PATH_IMAGE_FOTO_PEMBAYARAN = 'https://tasindo-sale-webservice.digiseminar.id/foto_pembayaran';
var BASE_PATH_IMAGE_FOTO_ACCOUNTING = 'https://tasindo-sale-webservice.digiseminar.id/bukti_accounting';


function refreshPage() {
	return app.views.main.router.navigate(app.views.main.router.currentRoute.url, { reloadCurrent: true, ignoreCache: true, });
}

function checkInternet() {
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/check-internet",
		dataType: 'JSON',
		data: {
			karyawan_id: localStorage.getItem("user_id")
		},
		beforeSend: function () {
		},
		success: function (data) {
			localStorage.setItem("internet_koneksi", "good");
			$("#box_internet").css("background-color", "green");

			console.log(localStorage.getItem("internet_koneksi"));
		},
		error: function (xmlhttprequest, textstatus, message) {
			if (textstatus === "timeout") {
				$("#box_internet").css("background-color", "red");
				localStorage.setItem("internet_koneksi", "fail")
			} else {
				$("#box_internet").css("background-color", "red");
				localStorage.setItem("internet_koneksi", "fail")
			}
		}
	});
}

function inputLog(id_transaksi, jenis, keterangan) {
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/input-log-proses",
		dataType: 'JSON',
		data: {
			id_transaksi: id_transaksi,
			jenis: jenis,
			keterangan: keterangan
		},
		beforeSend: function () {
		},
		success: function (data) {
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}



function checkLogin() {
	if (localStorage.getItem("login") != "true") {
		$$('#title-nama').html("Admin");
		return app.views.main.router.navigate('/login');
	} else {
		console.log('is_login');
		console.log(localStorage.getItem("login"));
		console.log(localStorage.getItem("user_location"));
		$$('#title-nama').html(localStorage.getItem("karyawan_nama"));
	}
}


function logOut() {
	localStorage.clear();	
	$$('#title-nama').html("Admin");
	return app.views.main.router.navigate('/login');
}

function writeLog(str) {
	if (!logOb) return;
	var log = str + " [" + (new Date()) + "]\n";
	logOb.createWriter(function (fileWriter) {
		fileWriter.seek(fileWriter.length);
		var blob = new Blob([log], { type: 'text/plain' });
		fileWriter.write(blob);
	}, fail);
}

function screenshot_me(client_nama) {
	jQuery('#button_invoice').remove();
	jQuery('.menu-detail-product').hide();
	jQuery('.navbar').hide();


	setTimeout(function () {
		navigator.screenshot.save(function (error, res) {
			if (error) {
				app.dialog.preloader('Gagal');
				setTimeout(function () {
					app.dialog.close();
					app.popup.close();
				}, 2000);
				jQuery('.menu-detail-product').show();
				jQuery('.navbar').show();
			} else {
				app.dialog.preloader('Berhasil');
				setTimeout(function () {
					app.dialog.close();
					app.popup.close();
				}, 2000);
				jQuery('.menu-detail-product').show();
				jQuery('.navbar').show();
			}
		}, 'jpg', 50, '' + client_nama + '_' + moment().format('DDMMYYYYHHmmss') + '');
	}, 1000);
}

function number_format(number, decimals, dec_point, thousands_sep) {

	number = (number + '').replace(/[^0-9+\-Ee.]/g, '');

	var n = !isFinite(+number) ? 0 : +number,

		prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),

		sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,

		dec = (typeof dec_point === 'undefined') ? '.' : dec_point,

		s = '',

		toFixedFix = function (n, prec) {

			var k = Math.pow(10, prec);

			return '' + Math.round(n * k) / k;

		};

	// Fix for IE parseFloat(0.55).toFixed(0) = 0;

	s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');

	if (s[0].length > 3) {

		s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);

	}

	if ((s[1] || '').length < prec) {

		s[1] = s[1] || '';

		s[1] += new Array(prec - s[1].length + 1).join('0');

	}

	return s.join(dec);

}



setInterval(function () {
	checkInternet();
}, 3000);

function getPengumuman() {
	var pengumuman = '';
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-pengumuman-absensi",
		dataType: 'JSON',
		data: {
			user_id: localStorage.getItem("user_id"),
		},
		beforeSend: function () {
		},
		success: function (data) {
			$("#count_pengumuman").html(data.data.length)
			
			$.each(data.data, function (i, item) {

				pengumuman += ' <div class="block block-strong">';
				pengumuman += '    <a class="float-right" style="color:red;" onclick="updatePengumuman(\'' + item.id + '\');"><i class="f7-icons" style="font-size:18px;">xmark</i></a>';
				pengumuman += '    <p>' + item.text + '</p>';
				pengumuman += '    <p style="font-weight: bold;">' + moment(item.dt_record).locale('id').format("dddd, DD MMM YYYY") + '</p>';
				pengumuman += ' </div> ';

			});

			jQuery('#data_pengumuman').html(pengumuman);
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}

function updatePengumuman(id) {
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/update-pengumuman-absensi",
		dataType: 'JSON',
		data: {
			id: id,
			user_id: localStorage.getItem("user_id"),
			user_record: localStorage.getItem("karyawan_nama")
		},
		beforeSend: function () {
		},
		success: function (data) {
			if (data.status == 'success') {
				getPengumuman();
			} else {
				getPengumuman();
			}

		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});

}