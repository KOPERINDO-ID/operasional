

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
	console.log(app.views.main.router.currentRoute.url);
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/check-internet-admin",
		dataType: 'JSON',
		data: {
			karyawan_id: localStorage.getItem("user_id"),
			password: localStorage.getItem("password")
		},
		beforeSend: function () {
			// app.dialog.close();
		},
		success: function (data) {
			console.log(data.password);
			console.log(localStorage.getItem("password"));
			if (data.version.config_value_string == localStorage.getItem("versioon_app_now")) {
				if (localStorage.getItem("password") == data.password) {
					console.log('Password Accept')
				} else {
					app.dialog.alert('Password Anda Tidak Sesuai', function () {
						logOut();
					});
				}

				console.log('Version Accept');
			} else {
				app.dialog.alert(data.version.config_keterangan, function () {
					logOut();
				});
			}

			localStorage.setItem("internet_koneksi", "good");
			$("#box_internet").css("background-color", "green");
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
		$$('#title-nama').html("Admin");
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

function getPengajuan() {
	jQuery.ajax({
		type: 'POST',
		url: BASE_API + "/get-pengajuan",
		dataType: 'JSON',
		data: { user_id: localStorage.getItem("user_id") },
		success: function (data) {
			$("#count_pengajuan").html(data?.count || 0);

			const rows = [];
			let no = 0;

			$.each(data?.data || [], function (i, val) {
				no++;

				// Kolom keterangan
				let kolom_ket = '';
				if (val.id_perusahaan_acc != null) {
					kolom_ket =
						'  <td align="left" style="border-left:1px solid grey;border-bottom:1px solid grey;"' +
						'      class="popup-open" data-popup=".detail-perusahaan-popup"' +
						'      onclick="getDetailPerusahaanAcc(\'' +
						(val.perusahaan_acc || '') + '\',\'' +
						(val.perusahaan_pic || '') + '\',\'' +
						(val.perusahaan_no_hp || '') + '\',\'' +
						(val.perusahaan_no_plat || '') + '\',\'' +
						(val.perusahaan_uraian || '') + '\')">' +
						(val.keterangan || '') + '</td>';
				} else {
					kolom_ket =
						'  <td align="left" style="border-left:1px solid grey;border-bottom:1px solid grey;">' +
						(val.keterangan || '') + '</td>';
				}

				var total_bayar = parseFloat(val.operasional_jumlah_pembayaran);
				var nominal = parseFloat(val.nominal_acc);

				var sisa = nominal - total_bayar;

				if (val.type_pembayaran == 'cicilan') {
					if (sisa > 0) {
						var nominal_asal = parseFloat(val.nominal_acc) - parseFloat(val.operasional_jumlah_pembayaran);
					} else {
						var nominal_asal = parseFloat(val.operasional_jumlah_pembayaran);
					}
				} else {

					var nominal_asal = parseFloat(val.operasional_jumlah_pembayaran);
				}
				var nominal_tampil = (val.valid_spy == 2) ? number_format(0) : number_format(nominal_asal);
				// Halaman tujuan
				// const page = (val.id_tr_kas_acc != null) ? '/data-kas' : '/data';
				const page = (val.id_tr_kas_acc != null) ? '/data' : '/data';

				rows.push(
					'<tr>' +
					'  <td align="center" style="border-left:1px solid grey;border-bottom:1px solid grey;">' + no + '</td>' +
					'  <td align="center" style="border-left:1px solid grey;border-bottom:1px solid grey;">' +
					(val.tanggal_transaksi ? moment(val.tanggal_transaksi).format('DD-MMM-YYYY') : '-') + '</td>' +
					'  <td align="left" style="border-left:1px solid grey;border-bottom:1px solid grey;">' + (val.kategori_acc || '') + '</td>' +
					kolom_ket +
					'  <td align="right" style="border-left:1px solid grey;border-bottom:1px solid grey;">' + number_format(nominal_tampil || 0) + '</td>' +
					'  <td style="border-bottom:1px solid gray;border-right:1px solid gray;">' +
					// PENTING: tidak pakai href! pakai button + data-*
					'    <button type="button"' +
					'       class="bg-dark-gray-young text-add-colour-black-soft button-small col button text-bold btn-show"' +
					'       data-id="' + (val.id_transaksi_acc) + '"' +
					'       data-kas="' + (val.id_kas_acc) + '"' +
					'       data-page="' + page + '">Show</button>' +
					'  </td>' +
					'</tr>'
				);
			});

			jQuery('#data_pengajuan').html(rows.join(''));
		}
	});
}

$(document).on('click', '.btn-show', function (e) {
	e.preventDefault();

	const $btn = $(this);
	const id = $btn.data('id');
	const kas = String($btn.data('kas') ?? '');
	const page = String($btn.data('page') || '/data');

	// simpan pending value + target page
	try {
		localStorage.setItem('pending_filter_kas', kas);
		localStorage.setItem('pending_filter_kas_page', page);
		localStorage.setItem('last_show_click', JSON.stringify({
			id: String(id ?? ''),
			kas, page,
			at: new Date().toISOString()
		}));
	} catch (err) { }

	// tutup popup
	try { app.popup.close('.popup-pengajuan'); } catch (err) { }

	// cek apakah saat ini sudah di page tujuan
	let onSamePage = false;
	try {
		const curUrl = app?.views?.main?.router?.currentRoute?.url || '';
		onSamePage = (!!curUrl && curUrl === page);
	} catch (err) {
		// fallback pakai location.pathname
		onSamePage = (location && location.pathname === page);
	}

	if (onSamePage) {
		// SUDAH di /data → reload saja
		try {
			// cara 1 (F7): refresh halaman sekarang
			app.views.main.router.refreshPage(); // Framework7 v5+
		} catch (e1) {
			try {
				// cara 2: navigate dgn reload current
				app.views.main.router.navigate(page, { reloadCurrent: true, ignoreCache: true });
			} catch (e2) {
				// cara 3: full reload
				location.reload();
			}
		}
	} else {
		// BELUM di /data → navigate seperti biasa
		try {
			app.views.main.router.navigate(page);
		} catch (e) {
			location.href = page;
		}
	}
});


// helper: set nilai select + trigger change (tambah option kalau belum ada)
function setSelectValueSafe($sel, value) {
	if (!$sel || !$sel.length) return false;
	const v = String(value ?? '');

	// jika option belum ada, tambahkan sementara supaya .val() berhasil
	if ($sel.find('option[value="' + v.replace(/"/g, '\\"') + '"]').length === 0) {
		$sel.append($('<option>', { value: v, text: v, hidden: true, 'data-temp': '1' }));
	}

	$sel.val(v).trigger('change');
	return String($sel.val()) === v;
}

// helper: tunggu sampai select siap, lalu apply pending
function applyPendingFilterKasWithRetry(maxTries = 30, intervalMs = 100) {
	const pending = localStorage.getItem('pending_filter_kas');
	if (!pending) return;

	let tries = 0;
	const timer = setInterval(() => {
		const $sel = jQuery('select.input-filter-kas'); // sesuai permintaan: cek class ini saja
		// syarat siap: elemen ada & minimal sudah ada 1 option (atau kita bisa suntik)
		if ($sel.length && ($sel.find('option').length || true)) {
			if (setSelectValueSafe($sel, pending)) {
				localStorage.removeItem('pending_filter_kas');
				clearInterval(timer);
				return;
			}
		}
		if (++tries >= maxTries) clearInterval(timer);
	}, intervalMs);
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

$(document).on('input blur', '.input_nohp', function () {
	var val = $(this).val().replace(/[^0-9]/g, ''); // hanya angka
	$(this).val(val); // langsung bersihkan input selain angka

	var errorId = 'error_' + $(this).attr('id');
	if ($('#' + errorId).length === 0) {
		$(this).after('<span id="' + errorId + '" class="input-error" style="color:#ff4f04;font-size:12px;display:none;">Nomor HP tidak valid</span>');
	}

	var error = $('#' + errorId);

	// Validasi panjang (10–15 digit)
	if (/^[0-9]{10,15}$/.test(val)) {
		error.hide();
		$(this).removeClass('input-invalid').addClass('input-valid');
	} else {
		error.show();
		$(this).removeClass('input-valid').addClass('input-invalid');
	}
});

// ===========================
// POPUP PERINGATAN SALDO KAS
// ===========================
function getCurrentMonthYear() {
	try {
		const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		const nowLocalString = new Date().toLocaleString("en-US", { timeZone: userTimeZone });
		const now = new Date(nowLocalString);

		return {
			month: now.getMonth() + 1,
			year: now.getFullYear()
		};
	} catch (e) {
		const jakartaString = new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
		const jakarta = new Date(jakartaString);

		return {
			month: jakarta.getMonth() + 1,
			year: jakarta.getFullYear()
		};
	}
}

function checkKasMinimum(month, year) {
	if (!month || !year) {
		var today = getCurrentMonthYear();
		month = today.month;
		year = today.year;
	}

	$.ajax({
		type: 'POST',
		url: BASE_API + '/get-data-amount-kas',   // sesuaikan dengan route kamu
		dataType: 'json',
		data: {
			month: month,
			year: year,
			user_id: localStorage.getItem("user_id"),
		},
		success: function (res) {
			if (res.status !== 200 && res.status !== '200') {
				console.log('Gagal ambil data kas:', res.message);
				return;
			}

			// Mapping id_kas_acc -> saldo (harus sama dengan controller)
			var saldoMap = {
				2: parseFloat(res.kas_utama) || 0,  // Kas Utama
				3: parseFloat(res.kas_marketing) || 0,  // Kas Marketing
				6: parseFloat(res.kas_backup) || 0,  // Kas Backup
				7: parseFloat(res.kas_tunai) || 0,  // Kas Tunai
				8: parseFloat(res.kas_khusus) || 0,  // Kas Khusus
				9: parseFloat(res.kas_payable) || 0   // Kas Payable
			};

			var listKurang = [];

			(res.kas || []).forEach(function (row) {
				var idKas = parseInt(row.id_kas_acc, 10);
				var saldo = saldoMap[idKas];
				var minimum = parseFloat(row.saldo_minimum) || 0;

				// hanya cek kas yang punya saldo di saldoMap
				if (typeof saldo !== 'undefined' && saldo < minimum) {
					listKurang.push({
						nama: row.kas_acc,
						saldo: saldo,
						minimum: minimum
					});
				}
			});

			// Jika tidak ada kas yang kurang dari saldo_minimum → tidak perlu dialog
			if (!listKurang.length) {
				return;
			}

			// ============================
			// BUILD TABEL (PAKAI KODEMU)
			// ============================
			var html = `
              <div class="dialog-kas-warning">
                <p>Beberapa kas berada di bawah saldo minimum:</p>
                <div class="data-table">
                  <table class="table table-striped table-bordered" style="width: 100%;" cellpadding="1">
                    <thead>
                      <tr>
                        <th style="text-align:center;">Kas</th>
                        <th style="text-align:center;">Saldo</th>
                        <th style="text-align:center;">Kurang</th>
                      </tr>
                    </thead>
                    <tbody>`;

			listKurang.forEach(function (item) {
				var saldo = parseFloat(item.saldo) || 0;
				var minimum = parseFloat(item.minimum) || 0;
				var selisih = saldo - minimum; // biasanya minus

				html += `
                      <tr>
                        <td>${item.nama}</td>
                        <td style="text-align:right;">${number_format(saldo, 0)}</td>
                        <td style="text-align:right; ${selisih < 0 ? 'color:red;' : ''}">
                          ${number_format(selisih, 0)}
                        </td>
                      </tr>`;
			});

			html += `
                    </tbody>
                  </table>
                </div>
              </div>`;

			// ============================
			// TAMPILKAN DIALOG FRAMEWORK7
			// ============================
			app.dialog.create({
				title: 'Peringatan Saldo Kas Minimum',
				content: html,
				buttons: [
					{
						text: 'Tutup',
						close: true
					}
				]
			}).open();
		},
		error: function (xhr) {
			console.log('Error AJAX get-data-amount-kas', xhr);
		}
	});
}