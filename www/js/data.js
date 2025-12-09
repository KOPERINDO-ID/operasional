$('#detail_nominal').mask('000,000,000,000', { reverse: true });
$('#edit_nominal').mask('000,000,000,000', { reverse: true });
$('#tambah_nominal').mask('000,000,000,000', { reverse: true });

jQuery('.pembayaran_1_dp').mask('000,000,000,000', { reverse: true });
jQuery('#bayar_pembayaran').mask('000.000.000', { reverse: false });
jQuery('#pembayaran_1').mask('000,000,000,000', { reverse: true });
jQuery('#pembayaran_2').mask('000,000,000,000', { reverse: true });
jQuery('#pembayaran_3').mask('000,000,000,000', { reverse: true });
jQuery('#pembayaran_4').mask('000,000,000,000', { reverse: true });
jQuery('#pembayaran_5').mask('000,000,000,000', { reverse: true });
jQuery('#pembayaran_6').mask('000,000,000,000', { reverse: true });
jQuery('#pembayaran_7').mask('000,000,000,000', { reverse: true });
jQuery('#pembayaran_8').mask('000,000,000,000', { reverse: true });
jQuery('#pembayaran_9').mask('000,000,000,000', { reverse: true });
jQuery('#pembayaran_10').mask('000,000,000,000', { reverse: true });
jQuery('#pembayaran_admin_1').mask('000,000,000,000', { reverse: true });
jQuery('#pembayaran_admin_2').mask('000,000,000,000', { reverse: true });
jQuery('#pembayaran_admin_3').mask('000,000,000,000', { reverse: true });
jQuery('#pembayaran_admin_4').mask('000,000,000,000', { reverse: true });
jQuery('#pembayaran_admin_5').mask('000,000,000,000', { reverse: true });
jQuery('#pembayaran_admin_6').mask('000,000,000,000', { reverse: true });
jQuery('#pembayaran_admin_7').mask('000,000,000,000', { reverse: true });
jQuery('#pembayaran_admin_8').mask('000,000,000,000', { reverse: true });
jQuery('#pembayaran_admin_9').mask('000,000,000,000', { reverse: true });
jQuery('#pembayaran_admin_10').mask('000,000,000,000', { reverse: true });

//Config Get Image From Camera
function setOptionsTerima(srcType) {
	var options = {
		// Some common settings are 20, 50, and 100
		quality: 50,
		destinationType: Camera.DestinationType.FILE_URI,
		// In this app, dynamically set the picture source, Camera or photo gallery
		sourceType: srcType,
		encodingType: Camera.EncodingType.JPEG,
		mediaType: Camera.MediaType.PICTURE,
		allowEdit: false,
		correctOrientation: true  //Corrects Android orientation quirks
	}
	return options;
}

function getFileEntryTerima(imgUri) {
	window.resolveLocalFileSystemURL(imgUri, function success(fileEntry) {

		// Do something with the FileEntry object, like write to it, upload it, etc.
		// writeFile(fileEntry, imgUri);
		alert("got file: " + fileEntry.nativeURL);
		// displayFileData(fileEntry.nativeURL, "Native URL");

	}, function () {
		// If don't get the FileEntry (which may happen when testing
		// on some emulators), copy to a new FileEntry.
		createNewFileEntryTerima(imgUri);
	});
}

function createNewFileEntryTerima(imgUri) {
	window.resolveLocalFileSystemURL(cordova.file.cacheDirectory, function success(dirEntry) {
		// JPEG file
		dirEntry.getFile("tempFile.jpeg", { create: true, exclusive: false }, function (fileEntry) {
			// Do something with it, like write to it, upload it, etc.
			// writeFile(fileEntry, imgUri);
			alert("got file file entry: " + fileEntry.fullPath);


			// displayFileData(fileEntry.fullPath, "File copied to");
		}, onErrorCreateFile);
	}, onErrorResolveUrl);
}

function getFileContentAsBase64Terima(path, callback) {
	window.resolveLocalFileSystemURL(path, gotFile, fail);

	function fail(e) {
		alert('Cannot found requested file');
	}

	function gotFile(fileEntry) {
		fileEntry.file(function (file) {
			var reader = new FileReader();
			reader.onloadend = function (e) {
				var content = this.result;
				callback(content);
			};
			// The most important point, use the readAsDatURL Method from the file plugin
			reader.readAsDataURL(file);
		});
	}
}

function toDataURL(path, callback) {
	window.resolveLocalFileSystemURL(path, gotFile, fail);

	function fail(e) {
		alert('Cannot found requested file');
	}
	function gotFile(fileEntry) {
		fileEntry.file(function (file) {
			var reader = new FileReader();
			reader.onloadend = function (e) {
				var content = this.result;
				callback(content);
			};
			// The most important point, use the readAsDatURL Method from the file plugin
			reader.readAsDataURL(file);
		});
	}
}

function openCameraTerima(selection) {

	var srcType = Camera.PictureSourceType.CAMERA;
	var options = setOptionsTerima(srcType);
	var func = createNewFileEntryTerima;

	navigator.camera.getPicture(function cameraSuccess(imageUri) {

		// displayImage(imageUri);
		// // You may choose to copy the picture, save it somewhere, or upload.

		getFileContentAsBase64Terima(imageUri, function (base64Image) {
			//window.open(base64Image);
			localStorage.setItem("file_foto_terima_pabrik", base64Image);
			changeTextFotoTerima(imageUri);
			jQuery('#button_tambah_fill_file').hide();
			$("#button_tambah_fill_camera").removeClass("col");
			$("#button_tambah_fill_camera").addClass("col-100");
			// Then you'll be able to handle the myimage.png file as base64
		});

	}, function cameraError(error) {
		console.debug("Unable to obtain picture: " + error, "app");
		alert("Unable to obtain picture: ");

	}, options);
}

function openCameraFotoPembayaran(id) {
	var srcType = Camera.PictureSourceType.CAMERA;
	var options = setOptionsTerima(srcType);
	var func = createNewFileEntryTerima;
	navigator.camera.getPicture(function cameraSuccess(imageUri) {
		$$("#" + id + "_view").attr("src", imageUri);
		$$("#" + id).hide();
		toDataURL(imageUri, function (dataUrl) {
			localStorage.setItem(id, dataUrl);
			//$$("#"+id+"_value").val(dataUrl);
		})
	}, function cameraError(error) {
		console.debug("Unable to obtain picture: " + error, "app");
		alert("Unable to obtain picture: ");
	}, options);
}

function openCameraTerimaUpdate(selection) {

	var srcType = Camera.PictureSourceType.CAMERA;
	var options = setOptionsTerima(srcType);
	var func = createNewFileEntryTerima;

	navigator.camera.getPicture(function cameraSuccess(imageUri) {

		// displayImage(imageUri);
		// // You may choose to copy the picture, save it somewhere, or upload.

		getFileContentAsBase64Terima(imageUri, function (base64Image) {
			//window.open(base64Image);
			localStorage.setItem("file_foto_update_terima_pabrik", base64Image);
			changeTextFotoTerimaUpdate(imageUri);
			jQuery('#button_detail_fill_file').hide();
			$("#button_detail_fill_camera").removeClass("col");
			$("#button_detail_fill_camera").addClass("col-100");
			// Then you'll be able to handle the myimage.png file as base64
		});

	}, function cameraError(error) {
		console.debug("Unable to obtain picture: " + error, "app");
		alert("Unable to obtain picture: ");

	}, options);
}

function changeTextFotoTerima(imageUri) {
	var arr = imageUri.split('/');
	$$('#text_file_path_terima').html(arr[8]);
}

function changeTextFotoTerimaUpdate(imageUri) {
	var arr = imageUri.split('/');
	$$('#text_file_path_terima_update').html(arr[8]);
}

function dateRangeDeclarationDataOperational() {
	calendarRangePenjualan = app.calendar.create({
		inputEl: '#range-penjualan',
		rangePicker: true,
		dateFormat: 'dd-mm-yyyy',
		closeOnSelect: true,
		rangePickerMinDays: 1,
		on: {
			close: function () {
				getDataTransaksi();
			}
		}
	});
}

function zoom_view(src) {
	var gambar_zoom = src;
	var myPhotoBrowserPopupDark = app.photoBrowser.create({
		photos: [
			'' + gambar_zoom + ''
		],
		theme: 'dark',
		type: 'popup'
	});
	myPhotoBrowserPopupDark.open();
}

function gambarAcc(acc_table_id, type) {
	if (jQuery('#' + type + '_file_acc_' + acc_table_id + '').val() == '' || jQuery('#' + type + '_file_acc_' + acc_table_id + '').val() == null) {
		$$('#' + type + '_value_acc_' + acc_table_id + '').html('File');
	} else {
		$$('#' + type + '_value_acc_' + acc_table_id + '').html($$('#' + type + '_file_acc_' + acc_table_id + '').val().replace('fakepath', ''));
		jQuery('#button_' + type + '_fill_camera').hide();
		$('#button_' + type + '_fill_file').removeClass("col");
		$('#button_' + type + '_fill_file').addClass("col-100");
	}
}

function resetDataTransaksi(reset) {
	if (reset == 1) {
		jQuery('#filter_kas').val(localStorage.getItem("primary_kas"))
		jQuery('#range-penjualan').val('')
		filterDataTransaksi();
	}
}

function filterDataTransaksi() {
	// if (jQuery('#filter_kas').val() != localStorage.getItem("primary_kas")) {
	// 	$("#hide-tambah-button").hide();
	// } else {
	// 	$("#hide-tambah-button").show();
	// }
	getDataTransaksi()
}
// =============== HELPER STYLE =================
function updateTipeTransaksiColor(elOr$) {
	var $sel = (window.jQuery && elOr$ && elOr$.jquery) ? elOr$ : jQuery(elOr$);
	if (!$sel.length) return;

	if (!$sel.val()) $sel.val('Payment');            // default
	var val = ($sel.val() || '').toLowerCase();
	var isPay = (val === 'payment');

	// style select (walau hidden)
	$sel.css({ background: isPay ? '#007bff' : '#FF7A1A', color: '#fff' });

	// style options (opsional)
	$sel.find('option').each(function () {
		var v = (jQuery(this).val() || '').toLowerCase();
		jQuery(this).prop('selected', v === val)
			.css({ background: v === 'payment' ? '#007bff' : '#FF7A1A', color: '#fff' });
	});

	// sinkron UI kustom via wrapper paling dekat
	var $wrap = $sel.closest('.custom-dd');
	var $toggle = $wrap.find('.custom-dd-toggle');
	var $label = $wrap.find('.custom-dd-label');
	var $optSel = $sel.find('option:selected');

	$label.text($optSel.text() || $sel.val() || '');

	var bg = $optSel.data('color') || (isPay ? '#007bff' : '#FF7A1A');
	var tx = $optSel.data('text') || '#fff';
	$toggle.css({ backgroundColor: bg, color: tx });

	// tandai item aktif (jika menu sudah ada)
	$wrap.find('.custom-dd-menu > li').each(function () {
		var active = ((jQuery(this).data('value') || '').toString().toLowerCase() === val);
		jQuery(this).toggleClass('active', active);
	});
}

// =============== BUILD MENU =================
function buildMenuFromOptions($sel, $menu) {
	$menu.empty();
	$sel.find('option').each(function () {
		var $opt = jQuery(this);
		jQuery('<li/>', {
			text: $opt.text(),
			'data-value': $opt.val(),
			role: 'option',
			class: $opt.is(':selected') ? 'active' : ''
		}).appendTo($menu);
	});
}

// =============== INIT PER-POPUP (SCOPE) =================
// scopeEl: element popup (DOM atau jQuery)
// selectSelector: '#detail_tipe_transaksi' atau '#edit_tipe_transaksi'
function initScopedTipeDropdown(scopeEl, selectSelector) {
	var $scope = (window.jQuery && scopeEl && scopeEl.jquery) ? scopeEl : jQuery(scopeEl);
	if (!$scope.length) return;

	var $sel = $scope.find(selectSelector);
	if (!$sel.length) return;

	var $wrap = $sel.closest('.custom-dd');
	var $toggle = $wrap.find('.custom-dd-toggle');   // pakai CLASS, bukan ID
	var $menu = $wrap.find('.custom-dd-menu');     // pakai CLASS, bukan ID

	// cegah double-binding
	if ($wrap.data('ddBound')) {
		// tetap sinkron tampilan (misal value baru)
		updateTipeTransaksiColor($sel);
		return;
	}
	$wrap.data('ddBound', 1);

	// default Payment
	if (!$sel.val()) $sel.val('Payment');

	// build awal + sinkron warna
	buildMenuFromOptions($sel, $menu);
	updateTipeTransaksiColor($sel);

	// honor disabled (detail)
	var isDisabled = $sel.is(':disabled');
	$toggle.prop('disabled', isDisabled);

	// buka/tutup menu
	$toggle.on('click', function (e) {
		if (isDisabled) return;         // jangan buka kalau disabled
		e.stopPropagation();
		if ($menu.is(':visible')) $menu.hide();
		else { buildMenuFromOptions($sel, $menu); $menu.show(); }
	});

	// pilih item
	$menu.on('click', 'li', function () {
		if (isDisabled) return;
		var val = jQuery(this).data('value');
		$sel.val(val);
		updateTipeTransaksiColor($sel); // update warna/label langsung
		$menu.hide();
	});

	// tutup saat klik di luar / scroll
	jQuery(document).on('click', function (e) {
		if (!$wrap.has(e.target).length) $menu.hide();
	});
	jQuery(window).on('scroll', function () { $menu.hide(); });

	// bila opsi <select> berubah dinamis (jarang), rebuild
	var mo = new MutationObserver(function () {
		buildMenuFromOptions($sel, $menu);
		updateTipeTransaksiColor($sel);
	});
	mo.observe($sel[0], { childList: true });
}

// ==== Hook popup kamu ====
function openTambahPopup() {
	// ===== Guard saldo kas berdasar filter_kas =====
	var filterVal = String(jQuery('#filter_kas').val() || '');
	var lsKey = null;

	if (filterVal === '2') {
		lsKey = 'kas_utama';
	} else if (filterVal === '7') {
		lsKey = 'kas_tunai';
	} else if (filterVal === '6') {
		lsKey = 'kas_backup';
	} else if (filterVal === '3') {
		lsKey = 'kas_marketing';
	}

	if (lsKey) {
		var raw = localStorage.getItem(lsKey);
		var num = 0;
		console.log('Cek saldo ' + lsKey + ' = ' + raw);
		try {
			num = parseFloat(String(raw || '0').replace(/[^\d\-\.]/g, '')) || 0;
		} catch (e) {
			num = 0;
		}

		if (num < 0) {
			// blokir buka popup + beri notifikasi
			try {
				app.toast.create({
					text: 'Saldo ' + lsKey.replace('_', ' ') + ' tidak mencukupi untuk membuka form tambah.',
					closeTimeout: 3000
				}).open();
			} catch (err) {
				alert('Saldo kas tidak mencukupi untuk membuka form tambah.');
			}
			return false;
		}
	}

	// ===== Reset & init seperti biasa =====
	$(".clear_tambah_transaksi").val('');
	$('.tambah_expedisi').hide();
	$('.uraian_transaksi').show();

	$('#button_tambah_fill_camera,#button_tambah_fill_file')
		.show().removeClass("col-100").addClass("col");

	$("#text_file_path_terima").html('Camera');
	$(".item_after_tambah_kategori").css("color", "gray");

	if (typeof comboKategoriTambah === 'function') comboKategoriTambah();
	if (typeof comboPerusahaanTambah === 'function') comboPerusahaanTambah();
	if (typeof gambarAcc === 'function') gambarAcc(1, 'tambah');

	// init dropdown custom di dalam popup
	var $popup = jQuery('.popup.tambah-transaksi');
	initScopedTipeDropdown($popup, '#tambah_tipe_transaksi');
	updateTipeTransaksiColor($popup.find('#tambah_tipe_transaksi'));

	// jika perlu, di sini kamu bisa langsung open popup:
	try { app.popup.open('.popup.tambah-transaksi'); } catch (e) { }
}


function getDataTransaksi() {
	var kas = '';
	if (jQuery('#filter_kas').val() == '' || jQuery('#filter_kas').val() == null) {
		if (localStorage.getItem("pending_filter_kas") != null) {
			jQuery('#filter_kas').val(localStorage.getItem("pending_filter_kas"));
			kas = localStorage.getItem('pending_filter_kas');
		} else {
			kas = localStorage.getItem('primary_kas');
		}
	} else {
		if (localStorage.getItem("pending_filter_kas") != null) {
			jQuery('#filter_kas').val(localStorage.getItem("pending_filter_kas"));
			kas = localStorage.getItem('pending_filter_kas');
		} else {
			kas = jQuery('#filter_kas').val();
		}
	}

	var year_now = new Date().getFullYear();
	var year = '';
	if (jQuery('#transaksi_years option:selected').val() == null) {
		year = year_now;
	} else if (jQuery('#transaksi_years option:selected').val() == 'all') {
		year = 'empty';
	} else {
		year = jQuery('#transaksi_years option:selected').val();
	}

	var month_now = new Date().getMonth() + 1;
	var month = '';
	if (jQuery('#transaksi_bulan option:selected').val() == null) {
		month = month_now;
	} else if (jQuery('#transaksi_bulan option:selected').val() == 'all') {
		month = 'empty';
	} else {
		month = jQuery('#transaksi_bulan option:selected').val();
	}

	// === 1) Ambil reminder (warning saja) ===
	jQuery.ajax({
		type: 'POST',
		url: '' + BASE_API + '/kategori-acc-reminder',
		dataType: 'JSON',
		data: {
			karyawan_id: 260,
			primary_kas: 2,
			only_warning: 1
		},
		success: function (rem) {
			// Map reminder per id_kategori_acc
			var remMap = {};
			if (rem && rem.data && rem.data.length > 0) {
				jQuery.each(rem.data, function (i, r) {
					remMap[r.id_kategori_acc] = r; // { row_color, badge_color, h_label, show_warning, ... }
				});
			}

			// === 2) Ambil data transaksi utama ===
			jQuery.ajax({
				type: 'POST',
				url: '' + BASE_API + '/get-transaksi-acc',
				dataType: 'JSON',
				data: {
					user_id: localStorage.getItem('user_id'),
					kas: kas,
					month: month,
					year: year,
					lokasi_pabrik: localStorage.getItem('lokasi_pabrik')
				},
				success: function (data) {
					var data_tools = '';
					var no = 0;
					var nominal_debet = 0;
					var nominal_kredit = 0;

					if (data && data.data && data.data.length > 0) {
						jQuery.each(data.data, function (i, val) {
							no++;

							if (data.count_valid && data.count_valid[val.id_transaksi_acc] != null) {
								val.count_valid = data.count_valid[val.id_transaksi_acc];
							} else {
								val.count_valid = 0;
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

							console.log('id = ' + val.id_transaksi_acc + ' ,sisa = ' + sisa);
							// ===== Warna tombol bayar =====
							var color_btn_byr = 'bg-dark-gray-young text-add-colour-black-soft';
							if (sisa <= 0) {
								color_btn_byr = 'btn-color-blueWhite';
							} else if (sisa > 0 && val.pembayaran1_tgl != null) {
								if (sisa == nominal_asal) {
									color_btn_byr = 'bg-dark-gray-young text-add-colour-black-soft';
								} else {
									color_btn_byr = 'btn-color-greenWhite';
								}
							}

							// ===== Base color row =====
							var color_row = '';

							var color_row = '';

							if (val.type_transaksi === 'Pengajuan') {
								// Cek status pelunasan
								if (sisa > 0) {
									// Belum lunas
									color_row = 'bg-orange';
								} else {
									// Sudah lunas
									color_row = 'bg-aquamarine';
								}
							} else if (val.valid_spy == 2 || val.valid == 2 || val.count_valid > 0) {
								if (val.is_edit == 1) {
									color_row = 'announcement card-color-red';
								} else {
									color_row = 'card-color-red';
								}
							} else if (
								val.type_acc == 'Kredit' &&
								val.type_pembayaran == 'cicilan' && // ← hanya untuk cicilan
								(total_bayar == 0 || (sisa > 0 && total_bayar > 0))
							) {
								// Kredit + Cicilan + belum/lunas sebagian
								color_row = 'bg-orange';
							} else if (val.type_acc == 'Debet') {
								color_row = 'card-color-light-blue';
							} else {
								color_row = '';
							}

							// ===== gabung reminder ke warna baris =====
							var row_style = '';
							var badge_html = '';
							var remInfo = remMap[val.id_kategori_acc];
							// hanya timpa jika BELUM base merah
							var isBaseRed = (color_row.indexOf('card-color-red') !== -1);
							if (!isBaseRed && remInfo && remInfo.show_warning) {
								row_style = ' style="background-color:' + remInfo.row_color + ';color:white"';
								badge_html = ' <span style="background:' + remInfo.badge_color + ';padding:2px 8px;border-radius:10px;margin-left:6px;font-size:11px;">' + remInfo.h_label + '</span>';
							}

							// tombol detail
							var btn_detail = '';
							if (val.valid == 1) {
								btn_detail = 'btn-color-blueWhite';
							} else if (val.valid == 2) {
								btn_detail = 'card-color-red';
							} else {
								btn_detail = 'bg-dark-gray-young text-add-colour-black-soft';
							}

							// kolom keterangan
							var keterangan_acc = '';
							var kolom_ket = '';
							if (val.id_perusahaan_acc != null) {
								const fullKet = (val.perusahaan_acc + ' | ' + val.keterangan || '');
								const shortKet = fullKet.length > 20 ? fullKet.substring(0, 20) + '...' : fullKet;

								keterangan_acc = (val.perusahaan_pic || '-') + ' , ' + (val.perusahaan_no_plat || '-');
								kolom_ket =
									'<td align="left" style="border-left:1px solid grey;border-bottom:1px solid grey;" ' +
									'class="label-cell popup-open" data-popup=".detail-perusahaan-popup" ' +
									'onclick="getDetailPerusahaanAcc(\'' + (val.perusahaan_acc || '') + '\',\'' + (val.perusahaan_pic || '') + '\',\'' + (val.perusahaan_no_hp || '') + '\',\'' + (val.perusahaan_no_plat || '') + '\',\'' + (val.perusahaan_uraian || '') + '\')" ' +
									'title="' + fullKet.replace(/"/g, '&quot;') + '">' + // tampilkan full di tooltip
									shortKet + badge_html + '</td>';
							} else {
								const fullKet = (val.keterangan || '');
								const shortKet = fullKet.length > 20 ? fullKet.substring(0, 20) + '...' : fullKet;

								keterangan_acc = fullKet;
								kolom_ket =
									'<td align="left" style="border-left:1px solid grey;border-bottom:1px solid grey;" ' +
									'class="label-cell" title="' + fullKet.replace(/"/g, '&quot;') + '">' +
									shortKet + badge_html + '</td>';
							}

							var nominal_tampil = (val.valid_spy == 2 || val.valid == 2) ? number_format(0) : number_format(nominal_asal);

							data_tools += '<tr class="' + color_row + '"' + row_style + '>';
							data_tools += '  <td align="center" style="border-left:1px solid grey;border-bottom:1px solid grey;" class="label-cell">' + no + '</td>';
							data_tools += '  <td align="center" style="border-left:1px solid grey;border-bottom:1px solid grey;" class="label-cell">' + moment(val.tanggal_transaksi).format('DD-MMM-YYYY') + '</td>';
							data_tools += '  <td align="left"   style="border-left:1px solid grey;border-bottom:1px solid grey;" class="label-cell">' + (val.kategori_acc || '') + '</td>';
							data_tools += kolom_ket;
							data_tools += '  <td align="right"  style="border-left:1px solid grey;border-bottom:1px solid grey;border-right:1px solid gray;" class="label-cell">' + nominal_tampil + '</td>';
							data_tools += '  <td align="right"  style="border-bottom:1px solid grey;border-right:1px solid gray;" class="label-cell">' + number_format(val.admin_acc) + '</td>';

							if (val.type_pembayaran == 'cicilan') {
								data_tools += '  <td style="border-top:1px solid gray;" class="label-cell">';
								data_tools += '    <a class="' + color_btn_byr + ' button-small col button popup-open text-bold"  onclick="detailPembayaran(\'' + val.tanggal_transaksi + '\',\'' + val.bank_1 + '\',\'' + val.bank_2 + '\',\'' + val.bank_3 + '\',\'' + val.bank_4 + '\',\'' + val.bank_5 + '\',\'' + val.bank_6 + '\',\'' + val.bank_7 + '\',\'' + val.bank_8 + '\',\'' + val.bank_9 + '\',\'' + val.bank_10 + '\',\'' + val.pembayaran1_tgl + '\',\'' + val.pembayaran2_tgl + '\',\'' + val.pembayaran3_tgl + '\',\'' + val.pembayaran4_tgl + '\',\'' + val.pembayaran5_tgl + '\',\'' + val.pembayaran6_tgl + '\',\'' + val.pembayaran7_tgl + '\',\'' + val.pembayaran8_tgl + '\',\'' + val.pembayaran9_tgl + '\',\'' + val.pembayaran10_tgl + '\',\'' + val.bank + '\',\'' + val.pembayaran_1 + '\',\'' + val.pembayaran_2 + '\',\'' + val.pembayaran_3 + '\',\'' + val.pembayaran_4 + '\',\'' + val.pembayaran_5 + '\',\'' + val.pembayaran_6 + '\',\'' + val.pembayaran_7 + '\',\'' + val.pembayaran_8 + '\',\'' + val.pembayaran_9 + '\',\'' + val.pembayaran_10 + '\',\'' + val.operasional_jumlah_pembayaran + '\',\'' + val.nominal_acc + '\',\'' + val.id_transaksi_acc + '\',\'' + val.operasional_status_pembayaran + '\',\'' + val.pembayaran_operasional_id + '\',\'' + val.kategori_acc + '\',\'' + keterangan_acc + '\',\'' + val.admin_acc + '\');">Bayar</a>';
								data_tools += '  </td>';
							} else {
								data_tools += '  <td style="border-top:1px solid gray;"></td>';
							}

							if (val.valid_spy == 2 || val.valid == 2 || nominal_tampil == 0) {
								data_tools += '  <td style="border-top:1px solid gray;text-align:center">';
								data_tools += '    <a onclick="getEditTransaksiAcc(\'' + (val.id_transaksi_acc || '') + '\',\'' + (val.id_perusahaan_acc || '') + '\')" class="card-color-red button-small col button popup-open text-bold" data-popup=".edit-transaksi">Detail</a>';
								data_tools += '  </td>';
							} else {
								data_tools += '  <td style="border-top:1px solid gray;text-align:center">';
								data_tools += '    <a onclick="getDetailTransaksiAcc(\'' + (val.id_transaksi_acc || '') + '\',\'' + (val.id_perusahaan_acc || '') + '\')" class="' + btn_detail + ' button-small col button popup-open text-bold" data-popup=".detail-transaksi">Detail</a>';
								data_tools += '  </td>';
							}

							if (localStorage.getItem('user_id') == 262) {
								data_tools += '  <td style="border-top:1px solid gray;border-right:1px solid grey;text-align:center">';
								data_tools += '    <a onclick="deleteTransaksiAcc(\'' + (val.id_transaksi_acc || '') + '\',\'' + (val.kategori_acc || '') + '\')" class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold">Delete</a>';
								data_tools += '  </td>';
							}

							data_tools += '</tr>';

							// total
							if (val.type_acc == 'Debet') {
								if (val.valid_spy == 2 || val.valid == 2) nominal_debet += 0;
								else nominal_debet += parseFloat(val.nominal_acc || 0);
							} else {
								if (val.valid_spy == 2 || val.valid == 2) nominal_kredit += 0;
								else nominal_kredit += parseFloat(val.nominal_acc + val.admin_acc || 0);
							}
						});
						localStorage.removeItem('pending_filter_kas');
						localStorage.removeItem('pending_filter_kas_page');
						jQuery('#hide_total').show();
						jQuery('#total-accounting').html(number_format(parseFloat(nominal_debet) - parseFloat(nominal_kredit)));
						jQuery('#data_transaksi_accounting').html(data_tools);
						jQuery('#total-transaksi').html(no);
						localStorage.setItem('kas_utama', data.kas_utama);
						localStorage.setItem('kas_tunai', data.kas_tunai);
						localStorage.setItem('kas_marketing', data.kas_marketing);
						localStorage.setItem('kas_backup', data.kas_backup);
					} else {
						jQuery('#hide_total').show();
						jQuery('#total-accounting').html(number_format(0));
						jQuery('#data_transaksi_accounting').html('<tr><td colspan="8" align="center">Tidak Ada Data</td></tr>');
						jQuery('#total-transaksi').html(0);
					}
				},
				error: function () {
					jQuery('#data_transaksi_accounting').html('<tr><td colspan="8" align="center">Gagal memuat data</td></tr>');
					jQuery('#total-accounting').html(number_format(0));
					jQuery('#total-transaksi').html(0);
				}
			});
		},
		error: function () {
			// kalau reminder gagal, tetap ambil transaksi tanpa pewarnaan reminder
			jQuery.ajax({
				type: 'POST',
				url: '' + BASE_API + '/get-transaksi-acc',
				dataType: 'JSON',
				data: {
					user_id: localStorage.getItem('user_id'),
					kas: kas,
					month: month,
					year: year,
					lokasi_pabrik: localStorage.getItem('lokasi_pabrik')
				},
				success: function (data) {
					// (opsional) bisa panggil kembali versi lama tanpa remMap
					// biar singkat, tampilkan kosong jika error reminder + error transaksi
					if (!data || !data.data || data.data.length == 0) {
						jQuery('#data_transaksi_accounting').html('<tr><td colspan="8" align="center">Tidak Ada Data</td></tr>');
						jQuery('#total-accounting').html(number_format(0));
						jQuery('#total-transaksi').html(0);
					}
				}
			});
		}
	});
}

function getDetailPerusahaanAcc(perusahaan_acc, perusahaan_pic, perusahaan_no_hp, perusahaan_no_plat, perusahaan_uraian) {
	jQuery("#detail_perusahaan_acc").val(perusahaan_acc);
	jQuery("#detail_pic_acc").val(perusahaan_pic);
	jQuery("#detail_plat_acc").val(perusahaan_no_plat);
	jQuery("#detail_hp_acc").val(perusahaan_no_hp);
	jQuery("#detail_uraian_acc").val(perusahaan_uraian);
}

function hideLunas(type) {
	var flag_lunas = $('#' + type + '_kategori').find(':selected').data('id');
	var flag_expedisi = $('#' + type + '_kategori :selected').text();
	$('.item_after_' + type + '_kategori').css("color", "white");
	if (flag_expedisi != 'Expedisi') {
		$('#' + type + '-change-text-label-foto').html('<b>Foto Bukti</b>');
		$('.' + type + '_expedisi').hide();
		$('#' + type + '_pembayaran').val('lunas');
		$('.' + type + '_uraian_transaksi').show();
		$('.' + type + '_expedisi_att').prop('required', false)
		$('.' + type + '_expedisi_att').prop('validate', false)
		$('.' + type + '_uraian_att').prop('required', true)
		$('.' + type + '_uraian_att').prop('validate', true)
		$('#' + type + '_pic').prop('required', false)
		$('#' + type + '_pic').prop('validate', false)
		$('#' + type + '_plat').prop('required', false)
		$('#' + type + '_plat').prop('validate', false)
		$('#' + type + '_nohp').prop('required', false)
		$('#' + type + '_nohp').prop('validate', false)
		$('#' + type + '_expedisi_pengirim').prop('required', false)
		$('#' + type + '_expedisi_pengirim').prop('validate', false)
		$('#' + type + '_expedisi_penerima').prop('required', false)
		$('#' + type + '_expedisi_penerima').prop('validate', false)
		$('#' + type + '_expedisi_dari').prop('required', false)
		$('#' + type + '_expedisi_dari').prop('validate', false)
		$('#' + type + '_expedisi_tujuan').prop('required', false)
		$('#' + type + '_expedisi_tujuan').prop('validate', false)
		$('#' + type + '_alamat').prop('required', false)
		$('#' + type + '_alamat').prop('validate', false)
		$('#' + type + '_expedisi_keterangan').prop('required', false)
		$('#' + type + '_expedisi_keterangan').prop('validate', false)
	} else if (flag_expedisi == 'Expedisi') {
		$('.item_after_' + type + '_perusahaan').css("color", "gray");
		$('.' + type + '_expedisi').show();
		$('.' + type + '_uraian_transaksi').hide();
		$('#' + type + '-change-text-label-foto').html('<b>Foto Bukti SJ</b>');
		$('.' + type + '_expedisi_att').prop('required', true)
		$('.' + type + '_expedisi_att').prop('validate', true)
		$('.' + type + '_uraian_att').prop('required', false)
		$('.' + type + '_uraian_att').prop('validate', false)
		$('#' + type + '_pic').prop('required', true)
		$('#' + type + '_pic').prop('validate', true)
		$('#' + type + '_plat').prop('required', true)
		$('#' + type + '_plat').prop('validate', true)
		$('#' + type + '_nohp').prop('required', true)
		$('#' + type + '_nohp').prop('validate', true)
		$('#' + type + '_expedisi_pengirim').prop('required', true)
		$('#' + type + '_expedisi_pengirim').prop('validate', true)
		$('#' + type + '_expedisi_penerima').prop('required', true)
		$('#' + type + '_expedisi_penerima').prop('validate', true)
		$('#' + type + '_expedisi_dari').prop('required', true)
		$('#' + type + '_expedisi_dari').prop('validate', true)
		$('#' + type + '_expedisi_tujuan').prop('required', true)
		$('#' + type + '_expedisi_tujuan').prop('validate', true)
		$('#' + type + '_alamat').prop('required', true)
		$('#' + type + '_alamat').prop('validate', true)
		$('#' + type + '_expedisi_keterangan').prop('required', true)
		$('#' + type + '_expedisi_keterangan').prop('validate', true)
	} else {
		$('.' + type + '_expedisi').hide();
		$('.' + type + '_uraian_transaksi').show();
		$('#' + type + '-change-text-label-foto').html('<b>Foto Bukti</b>');
		$('.' + type + '_expedisi_att').prop('required', false)
		$('.' + type + '_expedisi_att').prop('validate', false)
		$('.' + type + '_uraian_att').prop('required', true)
		$('.' + type + '_uraian_att').prop('validate', true)
		$('#' + type + '_pic').prop('required', false)
		$('#' + type + '_pic').prop('validate', false)
		$('#' + type + '_plat').prop('required', false)
		$('#' + type + '_plat').prop('validate', false)
		$('#' + type + '_nohp').prop('required', false)
		$('#' + type + '_nohp').prop('validate', false)
		$('#' + type + '_expedisi_pengirim').prop('required', false)
		$('#' + type + '_expedisi_pengirim').prop('validate', false)
		$('#' + type + '_expedisi_penerima').prop('required', false)
		$('#' + type + '_expedisi_penerima').prop('validate', false)
		$('#' + type + '_expedisi_dari').prop('required', false)
		$('#' + type + '_expedisi_dari').prop('validate', false)
		$('#' + type + '_expedisi_tujuan').prop('required', false)
		$('#' + type + '_expedisi_tujuan').prop('validate', false)
		$('#' + type + '_alamat').prop('required', false)
		$('#' + type + '_alamat').prop('validate', false)
		$('#' + type + '_expedisi_keterangan').prop('required', false)
		$('#' + type + '_expedisi_keterangan').prop('validate', false)
	}
}

function colorDropPerusahaan(type) {
	$('.item_after_' + type + '_perusahaan').css("color", "white");
}

function getDetailTransaksiAcc(id_transaksi_acc, id_perusahaan_acc) {
	jQuery.ajax({
		type: "POST",
		url: BASE_API + "/get-detail-transaksi-acc",
		dataType: "JSON",
		timeout: 10000,
		data: {
			id_transaksi_acc: id_transaksi_acc,
		},
		beforeSend: function () {
			// clear isi value
			jQuery("#form_detail_transaksi_acc .value").text("");
			jQuery("#wa-text").text(""); // ✅ JANGAN hapus isi #detail_nohp_btn
			jQuery("#show_button_valid").hide();
			gambarAcc(1, "detail");
			jQuery("#file_bukti_terima_view_now").attr(
				"src",
				"https://tasindo-sale-webservice.digiseminar.id/noimage.jpg"
			);
		},
		success: function (data) {
			var d = data.data || {};

			// show/hide tombol valid/reject
			var uid = localStorage.getItem("user_id");
			if (uid == 262) {
				jQuery("#detail_nohp_reject_btn").show();
			} else {
				jQuery("#detail_nohp_reject_btn").hide();
			}
			if (uid == 260 || uid == 262) {
				if (d.valid == 0) {
					jQuery("#show_button_valid").show();
				} else {
					jQuery("#show_button_valid").hide();
				}
			} else {
				jQuery("#show_button_valid").hide();
			}

			colorDropPerusahaan("edit");

			// toggle field ekspedisi / non-ekspedisi
			if (d.id_perusahaan_acc != null) {
				jQuery(".detail_expedisi").show();
				jQuery(".detail_uraian_transaksi").hide();
			} else {
				jQuery(".detail_expedisi").hide();
				jQuery(".detail_uraian_transaksi").show();
			}

			// mapping text
			jQuery("#detail_kategori").text(d.kategori_acc || "-");
			jQuery("#detail_perusahaan").text(d.perusahaan_acc || "-");
			jQuery("#detail_pic").text(d.perusahaan_pic || "-");
			jQuery("#detail_plat").text(d.perusahaan_no_plat || "-");

			// No HP → button hijau
			var nohp = d.perusahaan_no_hp || "-";
			var nominal = number_format(d.nominal_acc) || "0";
			jQuery("#wa-text").text(nohp);
			jQuery("#detail_nohp_btn")
				.off("click")
				.on("click", function () {
					openWaCheck(nohp, d.perusahaan_no_plat, d.perusahaan_pic, d.perusahaan_uraian, nominal);
				});

			jQuery("#detail_nohp_reject_btn")
				.off("click")
				.on("click", function () {
					UpdateValidNeraca(d.id_transaksi_acc, 3);
				});



			jQuery("#detail_expedisi_pengirim").text(d.perusahaan_pengirim || "-");
			jQuery("#detail_expedisi_penerima").text(d.perusahaan_penerima || "-");
			jQuery("#detail_expedisi_dari").text(d.perusahaan_dari || "-");
			jQuery("#detail_expedisi_tujuan").text(d.perusahaan_tujuan || "-");
			jQuery("#detail_alamat").text(d.perusahaan_alamat || "");
			jQuery("#detail_expedisi_keterangan").html(
				(d.perusahaan_uraian || "")
					.replace(/\n{2,}/g, "\n")   // hilangkan gap newline double+
					.replace(/\n/g, "<br>")     // apply newline
			); jQuery("#detail_keterangan").html(
				(d.keterangan || "")
					.replace(/\n{2,}/g, "\n")   // hilangkan gap newline double+
					.replace(/\n/g, "<br>")     // apply newline
			);
			jQuery("#detail_nominal").text(
				d.nominal_acc ? number_format(d.nominal_acc) : "0"
			);

			// hidden field
			jQuery("#detail_id_transaksi_acc").val(d.id_transaksi_acc);
			jQuery("#detail_pembayaran").val(d.type_pembayaran);

			// set nilai select tipe transaksi
			var tipe = d.type_transaksi || "Payment";
			jQuery("#detail_tipe_transaksi").val(tipe);

			// inisialisasi dropdown custom (kalau fungsi ini sudah ada di project)
			var $popup = jQuery(".popup.detail-transaksi");
			if (typeof initScopedTipeDropdown === "function") {
				initScopedTipeDropdown($popup, "#detail_tipe_transaksi");
			}
			if (typeof updateTipeTransaksiColor === "function") {
				updateTipeTransaksiColor($popup.find("#detail_tipe_transaksi")[0]);
			}

			// foto bukti
			if (
				d.bukti_foto_acc &&
				d.bukti_foto_acc !== "null" &&
				d.bukti_foto_acc !== "-"
			) {
				jQuery("#file_bukti_terima_view_now").attr(
					"src",
					BASE_PATH_IMAGE_FOTO_ACCOUNTING + "/" + d.bukti_foto_acc
				);
			} else {
				jQuery("#file_bukti_terima_view_now").attr(
					"src",
					"https://tasindo-sale-webservice.digiseminar.id/noimage.jpg"
				);
			}
		},
		error: function (xmlhttprequest, textstatus, message) {
			console.log("Error getDetailTransaksiAcc:", textstatus, message);
		},
	});
}

function openWaCheck(no, plat, pic, uraian, nominal) {
	let nohp = no || '';

	// normalisasi nomor hp
	nohp = nohp.replace(/[\s().-]/g, ''); // hilangkan spasi, kurung, titik, strip

	let hp = '';
	if (/^[+0-9]+$/.test(nohp)) {
		if (nohp.startsWith('62')) {
			hp = nohp;
		} else if (nohp.startsWith('0')) {
			hp = '62' + nohp.substring(1);
		} else if (nohp.startsWith('+62')) {
			hp = nohp.replace('+', ''); // ubah +62 jadi 62
		}
	}

	if (!hp) {
		alert('Nomor HP tidak valid');
		return;
	}

	// buat pesan WA
	let pesan = `Halo, Kami dari Koperindo.id ingin konfirmasi.
Apakah data anda sudah sesuai?

Plat: ${plat}
PIC: ${pic}
Keterangan: 
${uraian}
NOMINAL: ${nominal}

Jika ada pertanyaan bisa hubungi admin CS kami di +628113181844`;

	// encode pesan agar aman di URL
	let text_link = `https://wa.me/${hp}?text=${encodeURIComponent(pesan)}`;

	window.open(text_link, '_blank');
}

function getEditTransaksiAcc(id_transaksi_acc, id_perusahaan_acc) {
	jQuery.ajax({
		type: "POST", //pake post jangan  get rawan di hack
		url: "" + BASE_API + "/get-detail-transaksi-acc",
		dataType: 'JSON',
		timeout: 10000,
		data: {
			id_transaksi_acc: id_transaksi_acc
		},
		beforeSend: function () {
			jQuery('#clear_edit_transaksi').html('');
			$('.edit_keterangan_reject_transaksi').hide();
			gambarAcc(1, 'edit');
			jQuery('#file_bukti_edit_view_now').attr('src', 'https://tasindo-sale-webservice.digiseminar.id/noimage.jpg');
		},
		success: function (data) {

			jQuery("#show_button_update").show();
			$('#button_edit_fill_camera').show();
			$('#button_edit_fill_file').show();
			$("#button_edit_fill_camera").removeClass("col-100");
			$("#button_edit_fill_file").removeClass("col-100");
			$("#button_edit_fill_camera").addClass("col");
			$("#button_edit_fill_file").addClass("col");

			if (data.data.id_perusahaan_acc != null) {
				jQuery('.edit_expedisi').show();
				$('.edit_uraian_transaksi').hide();
				$('#edit_keterangan').prop('required', false)
				$('#edit_keterangan').prop('validate', false)
			} else {
				jQuery('.edit_expedisi').hide();
				jQuery('.edit_uraian_transaksi').show();
				$('.edit_expedisi_att').prop('required', false)
				$('.edit_expedisi_att').prop('validate', false)
				$('.edit_uraian_att').prop('required', true)
				$('.edit_uraian_att').prop('validate', true)
			}

			if (data.data.valid_spy == 2 || data.data.valid == 2) {
				$('.edit_keterangan_reject_transaksi').show();
			} else {
				$('.edit_keterangan_reject_transaksi').hide();
			}

			jQuery("#edit_keterangan_reject").val(data.data.keterangan_valid);
			jQuery("#edit_value_acc_1").html('File');
			jQuery("#text_file_path_terima_update").html('Camera');

			comboKategoriDetail(data.data.id_kategori_acc, 'edit');
			comboPerusahaanDetail(data.data.id_perusahaan_acc, 'edit');
			$$('.item_after_edit_kategori').html(data.data.kategori_acc);
			$$('.item_after_edit_perusahaan').html(data.data.perusahaan_acc);
			jQuery("#edit_pic").val(data.data.perusahaan_pic);
			jQuery("#edit_plat").val(data.data.perusahaan_no_plat);
			jQuery("#edit_nohp").val(data.data.perusahaan_no_hp);
			jQuery("#edit_expedisi_keterangan").val(data.data.perusahaan_uraian);
			jQuery("#edit_keterangan").val(data.data.keterangan);
			jQuery("#edit_nominal").val(number_format(data.data.nominal_acc));
			jQuery("#edit_id_transaksi_acc").val(number_format(data.data.id_transaksi_acc));
			jQuery("#edit_pembayaran").val(data.data.type_pembayaran);
			jQuery("#edit_tanggal_transaksi_acc").val(data.data.tanggal_transaksi);
			jQuery("#edit_expedisi_pengirim").val(data.data.perusahaan_pengirim);
			jQuery("#edit_expedisi_penerima").val(data.data.perusahaan_penerima);
			jQuery("#edit_expedisi_dari").val(data.data.perusahaan_dari);
			jQuery("#edit_expedisi_tujuan").val(data.data.perusahaan_tujuan);
			jQuery("#edit_alamat").val(data.data.perusahaan_alamat);
			jQuery("#edit_tipe_transaksi").val(data.data.type_transaksi);
			var $popup = jQuery('.popup.edit-transaksi');
			initScopedTipeDropdown($popup, '#edit_tipe_transaksi');
			updateTipeTransaksiColor($popup.find('#edit_tipe_transaksi'));
			if (data.data.bukti_foto_acc && data.data.bukti_foto_acc !== 'null' && data.data.bukti_foto_acc !== '-') {
				jQuery('#file_bukti_edit_view_now').attr('src', BASE_PATH_IMAGE_FOTO_ACCOUNTING + '/' + data.data.bukti_foto_acc);
			} else {
				jQuery('#file_bukti_edit_view_now').attr('src', 'https://tasindo-sale-webservice.digiseminar.id/noimage.jpg');
			}
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});

}

function comboKategoriTambah() {
	// start koding ajax
	jQuery.ajax({
		type: "POST", //pake post jangan  get rawan di hack
		url: "" + BASE_API + "/get-kategori-acc",
		dataType: 'JSON',
		timeout: 10000,
		data: {
			user_id: localStorage.getItem("user_id"),
			kas: jQuery('#filter_kas').val()
		},
		beforeSend: function () {
			jQuery('#tambah_kategori').html('');
		},
		success: function (data) {
			var optionsValues = "";
			optionsValues += '<option value="">Kategori</option>';
			jQuery.each(data.data, function (i, item) {
				optionsValues += '<option value="' + item.id_kategori_acc + '" data-id="' + item.flag_lunas + '" >' + item.kategori_acc + '</option>';
			});
			jQuery('#tambah_kategori').html(optionsValues);
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
	$$('.item_after_tambah_kategori').html('Kategori');
}

function comboPerusahaanTambah() {
	// start koding ajax
	jQuery.ajax({
		type: "POST", //pake post jangan  get rawan di hack
		url: "" + BASE_API + "/get-perusahaan-acc",
		dataType: 'JSON',
		timeout: 10000,
		data: {
			user_id: localStorage.getItem("user_id"),
		},
		beforeSend: function () {
			jQuery('#tambah_kategori').html('');
		},
		success: function (data) {
			var optionsValues = "";
			optionsValues += '<option value="">Pilih Perusahaan</option>';
			jQuery.each(data.data, function (i, item) {
				optionsValues += '<option value="' + item.id_perusahaan_acc + '" >' + item.perusahaan_acc + '</option>';
			});
			jQuery('#tambah_perusahaan').html(optionsValues);
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
	$$('.item_after_tambah_perusahaan').html('Pilih Perusahaan');
}

function comboKategoriDetail(id_kategori_acc, type) {
	// start koding ajax
	jQuery.ajax({
		type: "POST", //pake post jangan  get rawan di hack
		url: "" + BASE_API + "/get-kategori-acc",
		dataType: 'JSON',
		timeout: 10000,
		data: {
			user_id: localStorage.getItem("user_id"),
			type: type,
			kas: jQuery('#filter_kas').val(),
		},
		beforeSend: function () {
			jQuery('#' + type + '_kategori').html('');
		},
		success: function (data) {
			var optionsValues = "";
			optionsValues += '<option value="">Kategori</option>';
			jQuery.each(data.data, function (i, item) {
				if (id_kategori_acc == item.id_kategori_acc) {
					optionsValues += '<option value="' + item.id_kategori_acc + '" data-id="' + item.flag_lunas + '" selected>' + item.kategori_acc + '</option>';
				} else {
					optionsValues += '<option value="' + item.id_kategori_acc + '" data-id="' + item.flag_lunas + '" >' + item.kategori_acc + '</option>';
				}
			});
			jQuery('#' + type + '_kategori').html(optionsValues);
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
	$$('.item_after_' + type + '_kategori').html('Kategori');
}

function comboPerusahaanDetail(id_perusahaan_acc, type) {
	// start koding ajax
	jQuery.ajax({
		type: "POST", //pake post jangan  get rawan di hack
		url: "" + BASE_API + "/get-perusahaan-acc",
		dataType: 'JSON',
		timeout: 10000,
		data: {
			user_id: localStorage.getItem("user_id"),
		},
		beforeSend: function () {
			jQuery('#' + type + '_perusahaan').html('');
		},
		success: function (data) {
			var optionsValues = "";
			optionsValues += '<option value="">Pilih Perusahaan</option>';
			jQuery.each(data.data, function (i, item) {
				if (id_perusahaan_acc == item.id_perusahaan_acc) {
					optionsValues += '<option value="' + item.id_perusahaan_acc + '" selected>' + item.perusahaan_acc + '</option>';
				} else {
					optionsValues += '<option value="' + item.id_perusahaan_acc + '" >' + item.perusahaan_acc + '</option>';
				}
			});
			jQuery('#' + type + '_perusahaan').html(optionsValues);
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
	$$('.item_after_' + type + '_perusahaan').html('Pilih Perusahaan');
}

function comboKasFilter() {
	// start koding ajax
	jQuery.ajax({
		type: "POST", //pake post jangan  get rawan di hack
		url: "" + BASE_API + "/get-kas-acc",
		dataType: 'JSON',
		timeout: 10000,
		data: {
			user_id: localStorage.getItem("user_id"),
		},
		beforeSend: function () {

			jQuery('#filter_kas').html('');
		},
		success: function (data) {
			var optionsValues = "";
			jQuery.each(data.data, function (i, item) {
				if (localStorage.getItem("primary_kas") == item.id_kas_acc || localStorage.getItem("pending_filter_kas") == item.id_kas_acc) {
					optionsValues += '<option value="' + item.id_kas_acc + '" selected>' + item.kas_acc + '</option>';
				} else {
					optionsValues += '<option value="' + item.id_kas_acc + '">' + item.kas_acc + '</option>';
				}
			});
			jQuery('#filter_kas').html(optionsValues);
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}

function simpanTransaksi() {
	if (localStorage.getItem("internet_koneksi") == 'fail') {
		app.dialog.alert('<font style="font-size:22px; color:white; font-weight:bold;">Gagal,Internet Tidak Stabil,Box Koneksi Harus Berwarna Hijau', function () {
		});
	} else {
		if (!$$('#form_tambah_transaksi_acc')[0].checkValidity()) {
			app.dialog.alert('Cek Isian Anda');
		} else {
			if (localStorage.getItem("file_foto_terima_pabrik") != null || jQuery('#tambah_file_acc_1').val() != '') {
				var formData = new FormData(jQuery("#form_tambah_transaksi_acc")[0]);
				formData.append('user_record', localStorage.getItem("karyawan_nama"));
				formData.append('lokasi_pabrik', localStorage.getItem("lokasi_pabrik"));
				formData.append('user_id', localStorage.getItem("user_id"));
				formData.append('bukti_terima', localStorage.getItem("file_foto_terima_pabrik"));
				formData.append('kas', jQuery('#filter_kas').val());
				jQuery.ajax({
					type: "POST",
					url: "" + BASE_API + "/tambah-transaksi-acc",
					dataType: "JSON",
					data: formData,
					timeout: 7000,
					contentType: false,
					processData: false,
					beforeSend: function () {
						app.dialog.preloader('Harap Tunggu');
					},
					success: function (data) {
						app.dialog.close();
						$$('.clear_tambah_transaksi').val('');
						if (data.status == 'success') {
							app.popup.close();
							getDataTransaksi()
							localStorage.removeItem('file_foto_terima_pabrik');
							cleanupPerusahaanDatalists('tambah');
						} else if (data.status == 'failed') {
							app.popup.close();
						}
					},
					error: function (xmlhttprequest, textstatus, message) {
						app.dialog.alert('Ada kendala pada koneksi server, Silahkan Coba Kembali');
						app.popup.close();
					}

				});
			} else {
				app.dialog.alert('Silahkan Foto Bukti');
			}
		}
	}
}

function updateTransaksi() {
	if (localStorage.getItem("internet_koneksi") == 'fail') {
		app.dialog.alert('<font style="font-size:22px; color:white; font-weight:bold;">Gagal,Internet Tidak Stabil,Box Koneksi Harus Berwarna Hijau', function () {
		});
	} else {
		if (!$$('#form_edit_transaksi_acc')[0].checkValidity()) {
			app.dialog.alert('Cek Isian Anda');
			var formData = new FormData(jQuery("#form_edit_transaksi_acc")[0]);
			// output as an object
			console.log(Object.fromEntries(formData));
		} else {
			if (localStorage.getItem("file_foto_update_terima_pabrik") != null || jQuery('#edit_file_acc_1').val() != '') {
				var formData = new FormData(jQuery("#form_edit_transaksi_acc")[0]);
				formData.append('user_modified', localStorage.getItem("karyawan_nama"));
				formData.append('bukti_terima', localStorage.getItem("file_foto_update_terima_pabrik"));
				formData.append('lokasi_pabrik', localStorage.getItem("lokasi_pabrik"));
				formData.append('user_id', localStorage.getItem("user_id"));
				formData.append('kas', jQuery('#filter_kas').val());

				jQuery.ajax({
					type: "POST",
					url: "" + BASE_API + "/update-transaksi-acc",
					dataType: "JSON",
					data: formData,
					timeout: 7000,
					contentType: false,
					processData: false,
					beforeSend: function () {
						app.dialog.preloader('Harap Tunggu');
					},
					success: function (data) {
						app.dialog.close();
						$$('.clear_edit_transaksi').val('');
						if (data.status == 'success') {
							app.popup.close();
							getDataTransaksi()
							localStorage.removeItem('file_foto_update_terima_pabrik');
						} else if (data.status == 'failed') {
							app.popup.close();
						}
					},
					error: function (xmlhttprequest, textstatus, message) {
						app.dialog.alert('Ada kendala pada koneksi server, Silahkan Coba Kembali');
						app.popup.close();
					}

				});
			} else if (localStorage.getItem("file_foto_update_terima_pabrik") == null && jQuery('#edit_file_acc_1').val() == '') {
				var formData = new FormData(jQuery("#form_edit_transaksi_acc")[0]);
				formData.append('user_modified', localStorage.getItem("karyawan_nama"));
				formData.append('bukti_terima', null);
				formData.append('lokasi_pabrik', localStorage.getItem("lokasi_pabrik"));
				formData.append('user_id', localStorage.getItem("user_id"));
				formData.append('kas', jQuery('#filter_kas').val());

				jQuery.ajax({
					type: "POST",
					url: "" + BASE_API + "/update-transaksi-acc",
					dataType: "JSON",
					data: formData,
					timeout: 7000,
					contentType: false,
					processData: false,
					beforeSend: function () {
						app.dialog.preloader('Harap Tunggu');
					},
					success: function (data) {
						app.dialog.close();
						$$('.clear_edit_transaksi').val('');
						if (data.status == 'success') {
							app.popup.close();
							getDataTransaksi()
							cleanupPerusahaanDatalists('edit');
							localStorage.removeItem('file_foto_update_terima_pabrik');
						} else if (data.status == 'failed') {
							app.popup.close();
						}
					},
					error: function (xmlhttprequest, textstatus, message) {
						app.dialog.alert('Ada kendala pada koneksi server, Silahkan Coba Kembali');
						app.popup.close();
					}

				});
			}
		}
	}
}

function deleteTransaksiAcc(id_transaksi_acc, kategori_acc) {
	app.dialog.confirm('Delete Data ' + kategori_acc + ' ?', function () {
		if (localStorage.getItem("internet_koneksi") == 'fail') {
			app.dialog.alert('<font style="font-size:22px; color:white; font-weight:bold;">Gagal,Internet Tidak Stabil,Box Koneksi Harus Berwarna Hijau', function () {
			});
		} else {
			jQuery.ajax({
				type: "POST",
				url: "" + BASE_API + "/delete-transaksi-acc",
				dataType: "JSON",
				data: {
					id_transaksi_acc: id_transaksi_acc,
				},
				beforeSend: function () {
					app.dialog.preloader('Harap Tunggu');
				},
				success: function (data) {
					app.dialog.close();
					if (data.status == 'success') {
						app.dialog.alert('Berhasil Menghapus Data');
						getDataTransaksi();
					} else if (data.status == 'failed') {
						app.dialog.alert('Gagal Menghapus Data');
					}
				},
				error: function (xmlhttprequest, textstatus, message) {
					app.dialog.alert('Ada kendala pada koneksi server, Silahkan Coba Kembali');
				}
			});

		}
	});
}

function validTransaksi(type) {
	if (type == 1) {
		var message = 'Valid';
	} else {
		var message = 'Reject';
	}

	app.dialog.confirm('Update Data ' + message + ' ?', function () {
		if (localStorage.getItem("internet_koneksi") == 'fail') {
			app.dialog.alert('<font style="font-size:22px; color:white; font-weight:bold;">Gagal,Internet Tidak Stabil,Box Koneksi Harus Berwarna Hijau', function () {
			});
		} else {
			jQuery.ajax({
				type: "POST",
				url: "" + BASE_API + "/update-valid-transaksi-acc",
				dataType: "JSON",
				data: {
					id_transaksi_acc: $("#detail_id_transaksi_acc").val(),
					valid: type
				},
				beforeSend: function () {
					app.dialog.preloader('Harap Tunggu');
				},
				success: function (data) {
					app.dialog.close();
					if (data.status == 'success') {
						app.dialog.alert('Berhasil Validasi Data');
						app.popup.close();
						getDataKategori();
						getDataTransaksi();
					} else if (data.status == 'failed') {
						app.dialog.alert('Gagal Validasi Data');
						app.popup.close();
						getDataTransaksi();
					}
				},
				error: function (xmlhttprequest, textstatus, message) {
					app.dialog.alert('Ada kendala pada koneksi server, Silahkan Coba Kembali');
					app.popup.close();
				}
			});

		}
	});
}

function prosesPembayaranMultiple(pembayaran_id, number) {
	var $pay = jQuery('#pembayaran_' + number + '_' + pembayaran_id);
	var $adm = jQuery('#pembayaran_admin_' + number + '_' + pembayaran_id);
	var $bank = jQuery('#bank_' + number + '_' + pembayaran_id);
	var $tgl = jQuery('#tanggal_' + number + '_' + pembayaran_id);
	var $file = jQuery('#foto_bukti_' + number + '_' + pembayaran_id);
	var $btn = jQuery('label[for="foto_bukti_' + number + '_' + pembayaran_id + '"]'); // tombol label FOTO
	var $rowEls = jQuery([
		'#pembayaran_' + number + '_' + pembayaran_id,
		'#pembayaran_admin_' + number + '_' + pembayaran_id,
		'#bank_' + number + '_' + pembayaran_id,
		'#tanggal_' + number + '_' + pembayaran_id,
		'#keterangan_' + number + '_' + pembayaran_id,
		'#foto_bukti_' + number + '_' + pembayaran_id
	].join(','));

	// cegah double trigger saat masih upload
	if ($btn.hasClass('is-uploading')) {
		return false;
	}

	if ($pay.val() == "" || $bank.val() == "" || $tgl.val() == "" || !$file.val()) {
		app.dialog.alert('Isi Data Pembayaran Dengan Lengkap');
		console.log(number + ' - ' + $pay.val());
		console.log(number + ' - ' + $adm.val());
		console.log(number + ' - ' + $bank.val());
		console.log(number + ' - ' + $tgl.val());
		console.log(number + ' - ' + $file.val());
		return false;
	}

	var total_harus_bayar = parseInt(jQuery('#total_harus_bayar_' + pembayaran_id).val());
	var sudah_bayar = parseInt(jQuery('#sudah_bayar_' + pembayaran_id).val()) + parseInt($pay.val().replace(/\,/g, ''));
	var sisa_harus_bayar = total_harus_bayar - sudah_bayar;

	if (sisa_harus_bayar < 0) {
		var lebih_bayar = sudah_bayar - total_harus_bayar;
		app.dialog.alert('Pembayaran Melebihi Nominal <br> <br> Nominal Lebih : ' + number_format(lebih_bayar) + ' <br><br>Bagi Pada Angsuran Berikutnya');
		return false;
	}

	var transfer_kas = jQuery('#filter_kas').val();
	var formData = new FormData($('#pembayaran_form_multiple_' + number + '_' + pembayaran_id)[0]);

	formData.append('pembayaran', $pay.val());
	formData.append('admin', $adm.val());
	formData.append('bank', $bank.val());
	formData.append('tanggal', $tgl.val());
	formData.append('keterangan', jQuery('#keterangan_' + number + '_' + pembayaran_id).val());
	formData.append('pembayaran_id', pembayaran_id);
	formData.append('user_id', localStorage.getItem("user_id"));
	formData.append('pembayaran_ke', number);
	if (localStorage.getItem("user_id") == 262) {
		formData.append('primary_kas', localStorage.getItem("primary_kas"));
		formData.append('transfer_kas', transfer_kas);
	}
	formData.append('foto_bukti', $file.prop('files')[0]);
	formData.append('karyawan_nama', localStorage.getItem("karyawan_nama"));

	// ====== Disable UI + simpan teks tombol ======
	var originalBtnText = $btn.text();
	$btn.addClass('is-uploading disabled').css({ 'pointer-events': 'none', 'opacity': 0.6 }).text('UPLOADING 0%');
	$rowEls.prop('disabled', true);

	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/proses-pembayaran-operasional-multiple",
		dataType: 'JSON',
		data: formData,
		contentType: false,
		processData: false,
		xhr: function () {
			var xhr = new window.XMLHttpRequest();
			// progress upload
			if (xhr.upload) {
				xhr.upload.addEventListener('progress', function (e) {
					if (e.lengthComputable) {
						var pct = Math.round((e.loaded / e.total) * 100);
						$btn.text('UPLOADING ' + pct + '%');
					}
				}, false);
			}
			return xhr;
		},
		beforeSend: function () {
			try { app.dialog.preloader('Mengunggah bukti...'); } catch (e) { }
		},
		success: function (data) {
			resetDataTransaksi(1);
			jQuery('#filter_kas').val(transfer_kas).trigger('change');
			try { app.dialog.close(); } catch (e) { }
			try { app.popup.close(); } catch (e) { }

			// notifikasi sesuai status backend
			if (data.status == 'done' || data.status == 'success') {
				app.dialog.alert(data.message || 'Berhasil diproses');
			} else if (data.status == 'failed') {
				app.dialog.alert(data.message || 'Gagal memproses pembayaran');
			} else {
				app.dialog.alert('Selesai diproses');
			}
		},
		error: function (xmlhttprequest, textstatus, message) {
			try { app.dialog.close(); } catch (e) { }
			app.dialog.alert('Gagal mengunggah pembayaran. Coba lagi.');
		},
		complete: function () {
			// ====== Re-enable UI & restore tombol ======
			$btn.removeClass('is-uploading disabled').css({ 'pointer-events': '', 'opacity': '' }).text(originalBtnText || 'FOTO');
			$rowEls.prop('disabled', false);
		}
	});
}

function uploadFotoPembayaran(foto_urutan, pembayaran_id, valid_spy, keterangan_valid, isi_foto) {
	jQuery('#penjualan_id_foto_pembayaran').val(pembayaran_id);
	jQuery('#foto_urutan').val(foto_urutan);

	jQuery('#file_foto_pembayaran').val('');
	localStorage.removeItem('file_foto_pembayaran');
	$('#file_foto_pembayaran_view').attr('src', '');
	$('#file_foto_pembayaran_view_now').attr('src', '');
	$$(".custom-file-upload-foto-pembayaran").show();
	if (valid_spy == 2) {
		$('.btn-payment-penjualan').show();
		$('#hide_keterangan_reject').show();
		jQuery('#keterangan_reject_cicilan').val(keterangan_valid);
		jQuery('#file_foto_pembayaran_view_now').attr('src', BASE_PATH_IMAGE_FOTO_PEMBAYARAN + '/' + isi_foto);
	} else {
		$('#hide_keterangan_reject').hide();
		if (isi_foto != 'null') {
			$('.btn-payment-penjualan').hide();
			jQuery('#file_foto_pembayaran_view_now').attr('src', BASE_PATH_IMAGE_FOTO_PEMBAYARAN + '/' + isi_foto);
		} else {
			$('.btn-payment-penjualan').show();
			jQuery('#file_foto_pembayaran_view_now').attr('src', 'https://tasindo-sale-webservice.digiseminar.id/noimage.jpg');
		}
	}
}

function updateFotoPembayaranProcess() {
	if ($('#file_foto_pembayaran').val() != "") {
		var formData = new FormData(jQuery("#upload_foto_pembayaran_form")[0]);
		formData.append('file_foto_pembayaran', $('#file_foto_pembayaran').prop('files')[0]);
		formData.append('penjualan_id_foto_pembayaran', jQuery('#penjualan_id_foto_pembayaran').val());
		formData.append('foto_urutan', jQuery('#foto_urutan').val());


		jQuery.ajax({
			type: "POST",
			url: "" + BASE_API + "/update-foto-pembayaran-operasional",
			dataType: "JSON",
			data: formData,
			contentType: false,
			processData: false,
			xhr: function () {
				var dialog = app.dialog.progress('Loading ', 0);
				dialog.setText('0%');
				var xhr = new window.XMLHttpRequest();
				xhr.upload.addEventListener("progress", function (evt) {

					if (evt.lengthComputable) {
						var percentComplete = evt.loaded / evt.total;
						dialog.setProgress(Math.round(percentComplete * 100));
						dialog.setText('' + (Math.round(percentComplete * 100)) + '%');
					}

				}, false);
				return xhr;
			},
			success: function (data) {
				app.popup.close();
				app.popup.close();
				app.dialog.close();


				if (data.status == 'done') {
					app.dialog.alert('Berhasil Update Foto');

				} else if (data.status == 'failed') {
					app.dialog.alert('Gagal Update Foto');
				}
			}
		});
	} else {
		app.dialog.alert('Harap Isi Foto');
	}
}

// === Helpers angka ===
function fmt(n) {
	n = Number(n || 0);
	return n.toLocaleString('id-ID');
}

function unfmt(s) {
	if (s == null) return 0;
	return Number(String(s).replace(/[^\d\-]/g, '')) || 0;
}

// === Template row history (sudah ada pembayaran) ===
function tplPaidRow(idx, val, bg) {
	const tgl = val[`pembayaran${idx}_tgl`];
	const bank = val[`bank_${idx}`] || '-';
	const nominal = Number(val[`pembayaran_${idx}`] || 0);
	const admin = Number(val[`admin_${idx}`] || 0);
	const jumlah = nominal + admin;
	const ket = val[`keterangan_${idx}`];
	const foto = val[`foto_${idx}`];

	return `
    <tr style="background-color:${bg}">
      <td colspan="2" style="border:1px solid white;" class="numeric-cell text-align-left">Bayar ${idx}</td>
      <td style="border:1px solid white;" class="numeric-cell text-align-center">${tgl ? moment(tgl).format('DD-MMM-YYYY') : '-'}</td>
      <td style="border:1px solid white;" class="numeric-cell text-align-left">${bank}</td>
      <td style="border:1px solid white;" class="numeric-cell text-align-right">${fmt(nominal)}</td>
      <td style="border:1px solid white;" class="numeric-cell text-align-right">${fmt(admin)}</td>
      <td style="border:1px solid white;" class="numeric-cell text-align-right">${fmt(jumlah)}</td>
      <td style="border:1px solid white;" class="numeric-cell text-align-left">${ket ? ket : '-'}</td>
      <td style="border:1px solid white;" class="numeric-cell text-align-center">
        <button data-popup=".upload-foto-pembayaran"
          onclick="uploadFotoPembayaran('foto_${idx}','${val.pembayaran_operasional_id}','${val.valid_spy}','${val.keterangan_valid}','${foto || ''}')"
          class="popup-open text-add-colour-black-soft ${foto ? 'card-color-blue' : 'bg-dark-gray-young'} button-small col button text-bold"
          style="color:white;">Foto</button>
      </td>
    </tr>
  `;
}

// === Template row input (belum ada pembayaran) ===
function tplInputRow(idx, val) {
	const id = val.pembayaran_operasional_id;
	return `
    <form id="pembayaran_form_multiple_${idx}_${id}">
      <tr>
        <td colspan="2" style="border:1px solid white;" class="numeric-cell text-align-left">Bayar ${idx}</td>
        <td style="border:1px solid white;" class="numeric-cell text-align-center">
          <input style="width:105px;text-align:center;" id="tanggal_${idx}_${id}" name="tanggal_${idx}_${id}"
            type="date" class="date-multiple-pembayaran" value="${moment().format('YYYY-MM-DD')}" readonly>
        </td>
        <td style="border:1px solid white;" class="numeric-cell text-align-center">
          <select style="width:60%; background-color:#1c1c1d;" class="hide_bank performa-input input-item-bank"
            id="bank_${idx}_${id}" name="bank_${idx}_${id}">
            <option value="" selected>BANK</option>
            <option value="BCA">BCA</option>
            <option value="MANDIRI">MANDIRI</option>
            <option value="TUNAI">TUNAI</option>
          </select>
        </td>
        <td style="border:1px solid white;" class="numeric-cell text-align-right">
          <input style="width:100%;text-align:right;" class="input-pembayaran-multiple" id="pembayaran_${idx}_${id}" name="pembayaran_${idx}_${id}" type="text" value="0" onclick="if(this.value==='0') this.value='';" onblur="if(this.value==='') this.value='0';">
        </td>
        <td style="border:1px solid white;" class="numeric-cell text-align-right">
          <input style="width:100%;text-align:right;" class="input-pembayaran-multiple" id="pembayaran_admin_${idx}_${id}" name="pembayaran_admin_${idx}_${id}" type="text" value="0" onclick="if(this.value==='0') this.value='';" onblur="if(this.value==='') this.value='0';">
        </td>
        <td style="border:1px solid white;" class="numeric-cell text-align-right">
          <input style="width:100%;text-align:right;" class="input-pembayaran-multiple" id="pembayaran_jumlah_${idx}_${id}" name="pembayaran_jumlah_${idx}_${id}" type="text" readonly>
        </td>
        <td style="border:1px solid white;" class="numeric-cell text-align-center">
          <input style="width:100%;" id="keterangan_${idx}_${id}" name="keterangan_${idx}_${id}" type="text">
        </td>
        <td style="border:1px solid white;" class="numeric-cell text-align-center">
          <label class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold" for="foto_bukti_${idx}_${id}">FOTO</label>
          <input style="display:none;" id="foto_bukti_${idx}_${id}" name="foto_bukti_${idx}_${id}" type="file"
                 onchange="prosesPembayaranMultiple(${id},${idx});">
        </td>
      </tr>
    </form>
  `;
}

// === Bar status header per transaksi ===
function tplStatusHeader(val, totalBayar, totalAdmin) {
	const totalOperasional = Number(val.nominal_acc || 0);
	const lunas = totalBayar >= totalOperasional;
	const bg = lunas ? '#133788' : '';
	return `
    <table align="center" width="100%" style="border-collapse:collapse;border:1px solid white;">
      <tr style="background-color:${bg}">
        <td width="50%" style="border:1px solid white;" class="numeric-cell text-align-center">
          Terbayar : <br>${fmt(parseInt(totalBayar) + parseInt(totalAdmin))}
          <input type="hidden" id="status_lunas_${val.pembayaran_operasional_id}" value="${lunas ? 'lunas' : 'belum_lunas'}">
          <input type="hidden" id="total_harus_bayar_${val.pembayaran_operasional_id}" value="${totalOperasional}">
          <input type="hidden" id="sudah_bayar_${val.pembayaran_operasional_id}" value="${totalBayar}">
        </td>
        <td width="50%" style="border:1px solid white;" class="numeric-cell text-align-center">
          Sisa : <br>${fmt(totalOperasional - totalBayar)}
        </td>
      </tr>
    </table>
  `;
}

// === Tabel detail per transaksi ===
function tplTableStart(idx) {
	return `
    <div style="overflow-x:auto;width:100%;">
      <table align="center" width="800px" style="border-collapse:collapse;border:1px solid white;">
        <tr class="bg-dark-gray-medium">
          <td width="10%" style="border:1px solid white;" colspan="2" class="numeric-cell text-align-center">Bayar</td>
          <td width="12%" style="border:1px solid white;" class="numeric-cell text-align-center">Tanggal</td>
          <td width="12%" style="border:1px solid white;" class="numeric-cell text-align-center">Bank</td>
          <td width="12%" style="border:1px solid white;" class="numeric-cell text-align-center">Nominal</td>
          <td width="12%" style="border:1px solid white;" class="numeric-cell text-align-center">Admin</td>
          <td width="12%" style="border:1px solid white;" class="numeric-cell text-align-center">Jumlah</td>
          <td width="20%" style="border:1px solid white;" class="numeric-cell text-align-center">Keterangan</td>
          <td width="10%" style="border:1px solid white;" class="numeric-cell text-align-center">Opsi</td>
        </tr>
        <tbody id="table_num_${idx}">
  `;
}
function tplTableEnd() {
	return `</tbody></table></div><br>`;
}

// === MAIN ===
function detailPembayaran(
	tanggal_pembelian,
	bank_1, bank_2, bank_3, bank_4, bank_5, bank_6, bank_7, bank_8, bank_9, bank_10,
	pembayaran1_tgl, pembayaran2_tgl, pembayaran3_tgl, pembayaran4_tgl, pembayaran5_tgl, pembayaran6_tgl, pembayaran7_tgl, pembayaran8_tgl, pembayaran9_tgl, pembayaran10_tgl,
	bank, pembayaran_1, pembayaran_2, pembayaran_3, pembayaran_4, pembayaran_5, pembayaran_6, pembayaran_7, pembayaran_8, pembayaran_9, pembayaran_10,
	pembelian_jumlah_pembayaran, total_pembelian, pembelian_header_id, pembelian_status_pembayaran, pembayaran_pembelian_id, kategori_acc, keterangan_acc, admin_acc
) {
	// ===== Guard saldo kas berdasar filter_kas (blokir jika < 0) =====
	var filterVal = String(jQuery('#filter_kas').val() || '');
	var lsKey = null;
	if (filterVal === '2') {
		lsKey = 'kas_utama';
	} else if (filterVal === '7') {
		lsKey = 'kas_tunai';
	} else if (filterVal === '6') {
		lsKey = 'kas_backup';
	}
	if (lsKey) {
		var raw = localStorage.getItem(lsKey);
		var num = 0;
		try {
			num = parseFloat(String(raw || '0').replace(/[^\d\-\.]/g, '')) || 0;
		} catch (e) { num = 0; }
		if (num < 0) {
			try {
				app.toast.create({
					text: 'Saldo ' + lsKey.replace('_', ' ') + ' tidak mencukupi untuk membayar.',
					closeTimeout: 3000
				}).open();
			} catch (err) { alert('Saldo kas tidak mencukupi untuk membuka detail pembayaran.'); }
			return false;
		}
	}

	// ===== Lolos guard: buka popup detail-pembayaran =====
	try { app.popup.open('.popup.detail-pembayaran'); } catch (e) { }

	jQuery('#history_pembayaran_multiple').html("");

	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/detail-pembayaran-operasional-multiple",
		dataType: 'JSON',
		data: { id_transaksi_acc: pembelian_header_id },
		beforeSend: function () { app.dialog.preloader('Harap Tunggu'); },
		success: function (data) {
			app.dialog.close();

			jQuery("#bayar_pembayaran").val('');
			$$('#popup-pembayaran-td-kategori').html(kategori_acc);
			$$('#popup-pembayaran-td-keterangan').html(keterangan_acc);
			$$('#popup-pembayaran-bank').html(bank);
			$$(".bank_pembayaran").val(bank);

			var out = '';
			jQuery.each(data.pembayaran_data, function (i, val) {
				// total terbayar = sum pembayaran_1..10 (angka murni)
				let totalBayar = 0;
				let totalAdmin = 0;
				for (let k = 1; k <= 10; k++) {
					totalBayar += Number(val[`pembayaran_${k}`] || 0);
					totalAdmin += Number(val[`admin_${k}`] || 0);
				}

				const totalOperasional = Number(val.nominal_acc || 0);
				const lunas = totalBayar >= totalOperasional;
				const bg = val.valid_spy == 2 ? '#FF0000' : (lunas ? '#133788' : '');

				out += tplStatusHeader(val, totalBayar, totalAdmin);
				out += tplTableStart(i + 1);

				for (let idx = 1; idx <= 10; idx++) {
					const hasPay = Number(val[`pembayaran_${idx}`] || 0) > 0;
					if (hasPay) {
						out += tplPaidRow(idx, val, bg);
					} else {
						// Tampilkan form input berurutan & hanya jika belum lunas
						const prevOk = (idx === 1) ? true : Number(val[`pembayaran_${idx - 1}`] || 0) > 0;
						if (prevOk && !lunas) out += tplInputRow(idx, val);
					}
				}

				out += tplTableEnd();
			});

			$$('#popup-pembayaran-penjualan_jumlah_pembayaran').html(fmt(data.pembelian_jumlah_pembayaran) + ' ,-');
			$$('#popup-pembayaran-penjualan_grandtotal').html(fmt(parseInt(data.penjualan_grandtotal)) + ' ,-');
			$$('#popup-pembayaran-admin').html(fmt(parseInt(data.penjualan_admin || 0)) + ' ,-');
			$$('#popup-pembayaran-penjualan_kekurangan').html(fmt(parseInt(data.penjualan_grandtotal) - (parseInt(data.pembelian_jumlah_pembayaran) || 0)) + ' ,-');

			if (((parseInt(data.penjualan_grandtotal) || 0) - (data.pembelian_jumlah_pembayaran || 0)) <= 0) {
				$$('#popup-pembayaran-penjualan_status_pembayaran').html('<b>Lunas</b>')
					.removeClass('card-color-green').addClass('card-color-blue');
			} else {
				$$('#popup-pembayaran-penjualan_status_pembayaran').html('<b>Belum Lunas</b>')
					.removeClass('card-color-blue').addClass('card-color-green');
			}

			jQuery('#history_pembayaran_multiple').html(out);

			// set min date ke semua input tanggal dinamis
			const today = moment().format('YYYY-MM-DD');
			document.querySelectorAll('.date-multiple-pembayaran').forEach(function (el) { el.setAttribute('min', today); });
		},
		error: function () {
			app.dialog.close();
		}
	});

	$$('#tanggal_pembayaran_choose').html(moment(tanggal_pembelian).format('DD-MMM-YYYY'));

	// Prefill 10 blok lama (fixed header kanan/kiri)
	const banks = [bank_1, bank_2, bank_3, bank_4, bank_5, bank_6, bank_7, bank_8, bank_9, bank_10];
	const pays = [pembayaran_1, pembayaran_2, pembayaran_3, pembayaran_4, pembayaran_5, pembayaran_6, pembayaran_7, pembayaran_8, pembayaran_9, pembayaran_10];
	const tgls = [pembayaran1_tgl, pembayaran2_tgl, pembayaran3_tgl, pembayaran4_tgl, pembayaran5_tgl, pembayaran6_tgl, pembayaran7_tgl, pembayaran8_tgl, pembayaran9_tgl, pembayaran10_tgl];

	for (let i = 1; i <= 10; i++) {
		const pay = unfmt(pays[i - 1]);
		const adminEl = jQuery(`#pembayaran_admin_${i}`);
		if (pay > 0) {
			jQuery(`#content_bayar${i + 1}`).show();
			jQuery(`#pembayaran_${i}`).val(fmt(pay)).prop('readonly', true).off('click');
			jQuery(`#popup-pembayaran-tgl${i}`).html(tgls[i - 1] ? moment(tgls[i - 1]).format('DD-MMM-YYYY') : '');
			jQuery(`#bank_${i}`).val(banks[i - 1] || bank);
			adminEl.val(fmt(0)).prop('readonly', true).off('click');
		} else {
			jQuery(`#pembayaran_${i}`).val(fmt(0)).prop('readonly', false).attr('onClick', `emptyValue('pembayaran_${i}')`);
			jQuery(`#bank_${i}`).val(bank);
			adminEl.val(fmt(0)).prop('readonly', false).attr('onClick', `emptyValue('pembayaran_admin_${i}')`);
			jQuery(`#content_bayar${i + 1}`).hide();
			jQuery(`#popup-pembayaran-tgl${i}`).html('');
		}
	}

	$$('#pembayaran-penjualan_id').val(pembelian_header_id);

	setTimeout(function () {
		if (localStorage.getItem("username") != 'Stn') {
			// Hapus opsi "Tunai" (case-insensitive)
			$$('.hide_bank option').each(function (idx, opt) {
				if (String(opt.value).toLowerCase() === 'tunai') jQuery(opt).remove();
			});
		}
	}, 500);
}

// === Delegasi hitung jumlah (nominal + admin) untuk input dinamis ===
jQuery(document)
	.on('input', '.input-pembayaran-multiple', function () {
		const id = this.id; // contoh: pembayaran_2_123 atau pembayaran_admin_2_123
		const m = id.match(/(pembayaran|pembayaran_admin)_(\d+)_(\d+)/);
		if (!m) return;
		const idx = m[2], trx = m[3];
		const nominal = unfmt(jQuery(`#pembayaran_${idx}_${trx}`).val());
		const admin = unfmt(jQuery(`#pembayaran_admin_${idx}_${trx}`).val());
		jQuery(`#pembayaran_jumlah_${idx}_${trx}`).val(fmt(nominal + admin));
	});

// === Masking (delegated) untuk semua input angka dinamis & statis ===
function applyMask($root) {
	const sel = [
		'.input-pembayaran-multiple',
		'#bayar_pembayaran',
		'#pembayaran_1', '#pembayaran_2', '#pembayaran_3', '#pembayaran_4', '#pembayaran_5',
		'#pembayaran_6', '#pembayaran_7', '#pembayaran_8', '#pembayaran_9', '#pembayaran_10',
		'#pembayaran_admin_1', '#pembayaran_admin_2', '#pembayaran_admin_3', '#pembayaran_admin_4', '#pembayaran_admin_5',
		'#pembayaran_admin_6', '#pembayaran_admin_7', '#pembayaran_admin_8', '#pembayaran_admin_9', '#pembayaran_admin_10'
	].join(',');
	$root.find(sel).mask('000.000.000.000', { reverse: true });
}
// initial
applyMask(jQuery(document));
// re-apply setelah konten dinamis diinject
jQuery(document).on('DOMNodeInserted', '#history_pembayaran_multiple', function () {
	applyMask(jQuery('#history_pembayaran_multiple'));
});


function getBulanTransaksi() {
	var m = moment.months();
	var month_now = moment().month();
	var n = 0;
	for (var i = 0; i < 12; i++) {
		n++
		if (i == month_now) {
			$('.transaksi_bulan').append($('<option selected/>').val(n).html(m[i]));
		} else {
			$('.transaksi_bulan').append($('<option />').val(n).html(m[i]));
		}
	}
}

function getYearTransaksi() {
	let startYear = 2010;
	let endYear = new Date().getFullYear();
	for (i = endYear; i > startYear; i--) {
		if (i == endYear) {
			$('.transaksi_years').append($('<option selected/>').val(i).html(i));
		} else {
			$('.transaksi_years').append($('<option />').val(i).html(i));
		}
	}
}
function onPerusahaanChangedTambah(type) {
	// --- resolve perusahaan value ---
	var perusahaan;
	if (type == 'edit_jurnal') {
		perusahaan = jQuery('#' + type + '_perusahaan_jurnal').val() || '';
	} else {
		perusahaan = jQuery('#' + type + '_perusahaan').val() || '';
	}

	// ===== helpers (gaya sederhana) =====
	function firstExistingSelector(arr) {
		for (var i = 0; i < arr.length; i++) {
			if (jQuery(arr[i]).length) return arr[i];
		}
		return null;
	}
	function setVal(selArr, val) {
		var sel = firstExistingSelector(selArr);
		if (sel) jQuery(sel).val(val);
	}
	function setListAttr(selArr, listId) {
		var sel = firstExistingSelector(selArr);
		if (sel) jQuery(sel).attr('list', listId);
	}
	function ensureDatalist(id) {
		if (jQuery('#' + id).length === 0) {
			jQuery('body').append('<datalist id="' + id + '"></datalist>');
		}
	}
	function renderOptions(listId, arr) {
		var html = '';
		for (var i = 0; i < (arr || []).length; i++) {
			var v = (arr[i] || '').toString();
			if (!v) continue;
			html += '<option value="' + v + '">';
		}
		jQuery('#' + listId).html(html);
	}

	// ===== target field ids (berbagai pola yang sering kamu pakai) =====
	var PIC_IDS = ['#' + type + '_pic_jurnal', '#' + type + '_pic'];
	var NOHP_IDS = ['#' + type + '_nohp_jurnal', '#' + type + '_nohp'];
	var PLAT_IDS = ['#' + type + '_plat_jurnal', '#' + type + '_plat', '#' + type + '_no_plat', '#tambah_plat'];
	var PENGIRIM_IDS = ['#' + type + '_expedisi_pengirim_jurnal', '#' + type + '_expedisi_pengirim', '#tambah_expedisi_pengirim'];
	var DARI_IDS = ['#' + type + '_expedisi_dari_jurnal', '#' + type + '_expedisi_dari', '#tambah_expedisi_dari'];

	// datalist unik per type
	var LIST_PLAT_ID = 'list_plat_' + type;
	var LIST_PENGIRIM_ID = 'list_pengirim_' + type;
	var LIST_DARI_ID = 'list_dari_' + type;

	// 1) Isi PIC & NO HP dari riwayat
	jQuery.ajax({
		type: 'POST',
		url: '' + BASE_API + '/expedisi-perusahaan-detail',
		dataType: 'JSON',
		data: {
			perusahaan: perusahaan,
			lokasi_pabrik: localStorage.getItem('lokasi_pabrik')
		},
		success: function (res) {
			if (res && res.status === 'success' && res.data) {
				if (res.data.pic) setVal(PIC_IDS, res.data.pic);
				if (res.data.nohp) setVal(NOHP_IDS, String(res.data.nohp).replace(/[^0-9]/g, ''));
			}
		}
	});

	// 2) DISTINCT: PLAT, PENGIRIM, DARI -> langsung render + apply default
	ensureDatalist(LIST_PLAT_ID);
	ensureDatalist(LIST_PENGIRIM_ID);
	ensureDatalist(LIST_DARI_ID);

	// tempel datalist ke input yg ada utk type ini
	setListAttr(PLAT_IDS, LIST_PLAT_ID);
	setListAttr(PENGIRIM_IDS, LIST_PENGIRIM_ID);
	setListAttr(DARI_IDS, LIST_DARI_ID);

	jQuery.ajax({
		type: 'POST',
		url: '' + BASE_API + '/expedisi-distinct',
		dataType: 'JSON',
		data: {
			perusahaan: perusahaan,
			lokasi_pabrik: localStorage.getItem('lokasi_pabrik')
		},
		success: function (res) {
			var distinct = (res && res.status === 'success' && res.distinct) ? res.distinct : { plat: [], pengirim: [], dari: [] };

			// render datalist
			renderOptions(LIST_PLAT_ID, distinct.plat || []);
			renderOptions(LIST_PENGIRIM_ID, distinct.pengirim || []);
			renderOptions(LIST_DARI_ID, distinct.dari || []);

			// apply default rules ke field sesuai type:
			// PLAT: jika hanya 1 -> set (dan trigger input biar filter plat-mu jalan)
			if ((distinct.plat || []).length === 1) {
				var vPlat = (distinct.plat[0] || '').toString().toUpperCase();
				setVal(PLAT_IDS, vPlat);
				var selPlat = firstExistingSelector(PLAT_IDS);
				if (selPlat) jQuery(selPlat).trigger('input');
			}
			// PENGIRIM: jika hanya 1 -> set
			if ((distinct.pengirim || []).length === 1) {
				var vPeng = (distinct.pengirim[0] || '').toString().toUpperCase();
				setVal(PENGIRIM_IDS, vPeng);
			}
			// DARI: >1 => MULTI, =1 => nilai tunggal
			var dariSel = firstExistingSelector(DARI_IDS);
			if (dariSel) {
				if ((distinct.dari || []).length > 1) {
					jQuery(dariSel).val('MULTI');
				} else if ((distinct.dari || []).length === 1) {
					jQuery(dariSel).val((distinct.dari[0] || '').toString().toUpperCase());
				}
			}
		},
		error: function () {
			renderOptions(LIST_PLAT_ID, []);
			renderOptions(LIST_PENGIRIM_ID, []);
			renderOptions(LIST_DARI_ID, []);
			window.__EXP_DISTINCT__ = { plat: [], pengirim: [], dari: [] };
		}
	});
}

// ==== helper baru: lepas & hapus datalist untuk type ====
function cleanupPerusahaanDatalists(type) {
	// id datalist yang dipakai di onPerusahaanChangedTambah
	var LIST_PLAT_ID = 'list_plat_' + type;
	var LIST_PENGIRIM_ID = 'list_pengirim_' + type;
	var LIST_DARI_ID = 'list_dari_' + type;

	// selector input yang sebelumnya ditempeli atribut list
	var PLAT_IDS = ['#' + type + '_plat_jurnal', '#' + type + '_plat', '#' + type + '_no_plat', '#tambah_plat'];
	var PENGIRIM_IDS = ['#' + type + '_expedisi_pengirim_jurnal', '#' + type + '_expedisi_pengirim', '#tambah_expedisi_pengirim'];
	var DARI_IDS = ['#' + type + '_expedisi_dari_jurnal', '#' + type + '_expedisi_dari', '#tambah_expedisi_dari'];

	// lepas atribut list dari semua kandidat input
	function unsetListAttr(selArr) {
		for (var i = 0; i < selArr.length; i++) {
			var $el = jQuery(selArr[i]);
			if ($el.length) $el.removeAttr('list');
		}
	}
	unsetListAttr(PLAT_IDS);
	unsetListAttr(PENGIRIM_IDS);
	unsetListAttr(DARI_IDS);

	// hapus elemen <datalist> dari DOM bila ada
	jQuery('#' + LIST_PLAT_ID).remove();
	jQuery('#' + LIST_PENGIRIM_ID).remove();
	jQuery('#' + LIST_DARI_ID).remove();

	// optional: bersihkan cache global jika kamu pakai
	if (window.__EXP_DISTINCT__) window.__EXP_DISTINCT__ = { plat: [], pengirim: [], dari: [] };
}


const toInt = v => {
	v = (v || '').toString().replace(/[.,\s]/g, ''); // hapus koma, titik, spasi
	return v ? parseInt(v, 10) : null;               // kirim null jika kosong
};

function UpdateValidNeraca(id_transaksi_acc, type) {
	if (type == 1) {
		var message = 'Update Valid';
		var type_valid = 1;
	} else if (type == 2) {
		var message = 'Update Reject';
		var type_valid = 2;
	} else if (type == 3) {
		var message = 'Reject No Hp';
		var type_valid = 3;
	} else if (type == 0) {
		var message = 'Reset Data';
		var type_valid = 0;
	}

	app.dialog.confirm('' + message + ' ?', function () {
		if (localStorage.getItem("internet_koneksi") == 'fail') {
			app.dialog.alert('<font style="font-size:22px; color:white; font-weight:bold;">Gagal,Internet Tidak Stabil,Box Koneksi Harus Berwarna Hijau', function () {
			});
		} else {
			jQuery.ajax({
				type: "POST",
				url: "" + BASE_API + "/update-valid-nohp-acc",
				dataType: "JSON",
				data: {
					id_transaksi_acc: toInt(id_transaksi_acc),
					valid: type_valid
				},
				beforeSend: function () {
					app.dialog.preloader('Harap Tunggu');
				},
				success: function (data) {
					app.dialog.close();
					if (data.status == 'success') {
						app.dialog.alert('Berhasil Update Data');
						getDataTransaksi();
						$$("#back-detail-transaksi").click();
						app.popup.close();
					} else if (data.status == 'failed') {
						app.dialog.alert('Gagal Update Data');
						getDataTransaksi();
						$$("#back-detail-transaksi").click();
						app.popup.close();
					}
				},
				error: function (xmlhttprequest, textstatus, message) {
					app.dialog.alert('Ada kendala pada koneksi server, Silahkan Coba Kembali');
					app.popup.close();
				}
			});

		}
	});
}
