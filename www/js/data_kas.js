$('#detail_kas_nominal').mask('000,000,000,000', { reverse: true });
$('#tambah_kas_nominal').mask('000,000,000,000', { reverse: true });
$('#edit_kas_nominal').mask('000,000,000,000', { reverse: true });

//Config Get Image From Camera
function setOptionsTerimaKas(srcType) {
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

function getFileEntryTerimaKas(imgUri) {
	window.resolveLocalFileSystemURL(imgUri, function success(fileEntry) {

		// Do something with the FileEntry object, like write to it, upload it, etc.
		// writeFile(fileEntry, imgUri);
		alert("got file: " + fileEntry.nativeURL);
		// displayFileData(fileEntry.nativeURL, "Native URL");

	}, function () {
		// If don't get the FileEntry (which may happen when testing
		// on some emulators), copy to a new FileEntry.
		createNewFileEntryTerimaKas(imgUri);
	});
}

function createNewFileEntryTerimaKas(imgUri) {
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


function getFileContentAsBase64TerimaKas(path, callback) {
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


function toDataURLKas(path, callback) {
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

function openCameraTerimaKas(selection) {

	var srcType = Camera.PictureSourceType.CAMERA;
	var options = setOptionsTerimaKas(srcType);
	var func = createNewFileEntryTerimaKas;

	navigator.camera.getPicture(function cameraSuccess(imageUri) {

		// displayImage(imageUri);
		// // You may choose to copy the picture, save it somewhere, or upload.

		getFileContentAsBase64TerimaKas(imageUri, function (base64Image) {
			//window.open(base64Image);
			localStorage.setItem("file_foto_terima_pabrik_kas", base64Image);
			changeTextFotoTerimaKas(imageUri);
			jQuery('#button_tambah_fill_file_kas').hide();
			$("#button_tambah_fill_camera_kas").removeClass("col");
			$("#button_tambah_fill_camera_kas").addClass("col-100");
			// Then you'll be able to handle the myimage.png file as base64
		});

	}, function cameraError(error) {
		console.debug("Unable to obtain picture: " + error, "app");
		alert("Unable to obtain picture: ");

	}, options);
}

function openCameraTerimaUpdateKas(selection) {

	var srcType = Camera.PictureSourceType.CAMERA;
	var options = setOptionsTerimaKas(srcType);
	var func = createNewFileEntryTerimaKas;

	navigator.camera.getPicture(function cameraSuccess(imageUri) {

		// displayImage(imageUri);
		// // You may choose to copy the picture, save it somewhere, or upload.

		getFileContentAsBase64TerimaKas(imageUri, function (base64Image) {
			//window.open(base64Image);
			localStorage.setItem("file_foto_update_terima_pabrik_kas", base64Image);
			changeTextFotoTerimaUpdateKas(imageUri);
			jQuery('#button_edit_fill_file_kas').hide();
			$("#button_edit_fill_camera_kas").removeClass("col");
			$("#button_edit_fill_camera_kas").addClass("col-100");
			// Then you'll be able to handle the myimage.png file as base64
		});

	}, function cameraError(error) {
		console.debug("Unable to obtain picture: " + error, "app");
		alert("Unable to obtain picture: ");

	}, options);
}

function changeTextFotoTerimaKas(imageUri) {
	var arr = imageUri.split('/');
	$$('#text_file_path_terima_kas').html(arr[8]);
}
function changeTextFotoTerimaUpdateKas(imageUri) {
	var arr = imageUri.split('/');
	$$('#text_file_path_terima_update_kas').html(arr[8]);
}

function dateRangeDeclarationDataOperationalKas() {
	calendarRangePenjualan = app.calendar.create({
		inputEl: '#range-penjualan-in',
		rangePicker: true,
		dateFormat: 'dd-mm-yyyy',
		closeOnSelect: true,
		rangePickerMinDays: 1,
		on: {
			close: function () {
				getDataTransaksiKas();
			}
		}
	});
}

function gambarAccKas(acc_table_id, type) {
	if (jQuery('#' + type + '_file_kas_acc_' + acc_table_id + '').val() == '' || jQuery('#' + type + '_file_kas_acc_' + acc_table_id + '').val() == null) {
		$$('#' + type + '_value_kas_acc_' + acc_table_id + '').html('File');
	} else {
		$$('#' + type + '_value_kas_acc_' + acc_table_id + '').html($$('#' + type + '_file_kas_acc_' + acc_table_id + '').val().replace('fakepath', ''));
		jQuery('#button_' + type + '_fill_camera_kas').hide();
		$('#button_' + type + '_fill_file_kas').removeClass("col");
		$('#button_' + type + '_fill_file_kas').addClass("col-100");
	}
}

function resetDataTransaksiKas(reset) {
	if (reset == 1) {
		jQuery('#filter_kas_in_asal').val(localStorage.getItem("primary_kas"))
		jQuery('#range-penjualan-in').val('')
		filterDataTransaksiKas();
	}
}

function filterDataTransaksiKas() {
	cekMinusKas();
	getDataTransaksiKas()
}

function openKategori() {
	if ($("#tambah_kas_transfer").val() == 8) {
		$('#input_kategori_data_kas').show();
		comboKategoriKas('tambah');
		$$('#tambah_kategori_data_kas').prop('required', true)
		$$('#tambah_kategori_data_kas').prop('validate', true)
	} else {
		$('#input_kategori_data_kas').hide();
		$$('#tambah_kategori_data_kas').prop('required', false)
		$$('#tambah_kategori_data_kas').prop('validate', false)
	}
}

function getDataTransaksiKas() {
	var kas_out = '';
	if (jQuery('#filter_kas_in_asal').val() == '' || jQuery('#filter_kas_in_asal').val() == null) {
		kas_out = localStorage.getItem("primary_kas");
		// $("#hide-tambah-button").show();
	} else {
		kas_out = jQuery('#filter_kas_in_asal').val();
	}

	// if (jQuery('#range-penjualan-in').val() == '' || jQuery('#range-penjualan-in').val() == null) {
	// 	var startdate = "empty";
	// 	var enddate = "empty";
	// } else {
	// 	var startdate_new = new Date(calendarRangePenjualan.value[0]);
	// 	var enddate_new = new Date(calendarRangePenjualan.value[1]);
	// 	var startdate = moment(startdate_new).format('YYYY-MM-DD');
	// 	var enddate = moment(enddate_new).format('YYYY-MM-DD');
	// }

	var year_now = new Date().getFullYear();
	if (jQuery('#transaksi_kas_years option:selected').val() == null) {
		var year = year_now;
	} else if (jQuery('#transaksi_kas_years option:selected').val() == 'all') {
		var year = 'empty';
	} else {
		var year = jQuery('#transaksi_kas_years option:selected').val();
	}

	var month_now = new Date().getMonth() + 1;
	if (jQuery('#transaksi_kas_bulan option:selected').val() == null) {
		var month = month_now;
	} else if (jQuery('#transaksi_kas_bulan option:selected').val() == 'all') {
		var month = 'empty';
	} else {
		var month = jQuery('#transaksi_kas_bulan option:selected').val();
	}

	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-transaksi-kas-acc",
		dataType: 'JSON',
		data: {
			user_id: localStorage.getItem("user_id"),
			kas_out: kas_out,
			month: month,
			year: year,
			lokasi_pabrik: localStorage.getItem("lokasi_pabrik"),
		},
		beforeSend: function () {
		},
		success: function (data) {
			var data_tools = '';
			console.log(data.data);
			var no = 0;
			if (data.data != null) {

				var nominal_debet = 0;
				var nominal_kredit = 0;
				jQuery.each(data.data, function (i, val) {
					no++
					// if (data.check_in[val.id_tr_kas_acc] != null) {
					// 	var text_color = 'card-color-light-blue';
					// } else {
					// 	var text_color = '';
					// }

					if (kas_out == val.id_kas_tujuan) {
						var text_color = 'card-color-light-blue';
					} else {
						var text_color = '';
					}

					data_tools += '<tr class="' + text_color + '">';
					data_tools += '     <td align="center" style="border-left: 1px solid grey;border-bottom: 1px solid grey;"  class="label-cell">' + no + '</td>';
					data_tools += '     <td align="center" style="border-left: 1px solid grey;border-bottom: 1px solid grey;"  class="label-cell">' + moment(val.tanggal_kas_acc).format('DD-MMM-YYYY') + '</td>';
					data_tools += '     <td align="left" style="border-left: 1px solid grey;border-bottom: 1px solid grey;"  class="label-cell">' + val.kas_asal + '</td>';
					data_tools += '     <td align="left" style="border-left: 1px solid grey;border-bottom: 1px solid grey;"  class="label-cell">' + val.kas_tujuan + '</td>';
					data_tools += '     <td align="left" style="border-left: 1px solid grey;border-bottom: 1px solid grey;"  class="label-cell">' + val.keterangan_kas_acc + '</td>';


					data_tools += '     <td align="right" style="border-left: 1px solid grey;border-right: 1px solid grey;border-bottom: 1px solid grey;"  class="label-cell">' + number_format(val.nominal_kas_acc) + '</td>';

					if (val.valid == 1) {
						var btn_detail = 'btn-color-blueWhite';
					} else if (val.valid == 2) {
						var btn_detail = 'card-color-red';
					} else {
						var btn_detail = 'bg-dark-gray-young text-add-colour-black-soft';
					}


					if (localStorage.getItem("user_id") == 260) {
						// if (val.valid == 1) {
						// 	data_tools += '		<td style="border-right: 1px solid grey;border-bottom: 1px solid grey;text-align:center">';
						// 	data_tools += '			<a onclick="getDetailTransaksiKasAcc(\'' + val.id_tr_kas_acc + '\')" class="' + btn_detail + ' button-small col button popup-open text-bold" data-popup=".detail-transaksi-in">Detail</a>';
						// 	data_tools += '		</td>';
						// } else {
						// 	data_tools += '		<td style="border-right: 1px solid grey;border-bottom: 1px solid grey;text-align:center">';
						// 	data_tools += '			<a onclick="getEditTransaksiKasAcc(\'' + val.id_tr_kas_acc + '\')" class="text-add-colour-black-soft bg-dark-gray-young button-small col button popup-open text-bold" data-popup=".edit-transaksi-in">Edit</a>';
						// 	data_tools += '		</td>';
						// }
						data_tools += '		<td style="border-right: 1px solid grey;border-bottom: 1px solid grey;text-align:center">';
						data_tools += '			<a onclick="getDetailTransaksiKasAcc(\'' + val.id_tr_kas_acc + '\')" class="' + btn_detail + ' button-small col button popup-open text-bold" data-popup=".detail-transaksi-in">Detail</a>';
						data_tools += '		</td>';
					}
					if (localStorage.getItem("user_id") == 262) {
						data_tools += '		<td style="border-right: 1px solid grey;border-bottom: 1px solid grey;text-align:center">';
						data_tools += '			<a onclick="getEditTransaksiKasAcc(\'' + val.id_tr_kas_acc + '\')" class="text-add-colour-black-soft bg-dark-gray-young button-small col button popup-open text-bold" data-popup=".edit-transaksi-in">Edit</a>';
						data_tools += '		</td>'
						data_tools += '		<td style="border-right: 1px solid grey;border-bottom: 1px solid grey;text-align:center">';
						data_tools += '			<a onclick="deleteTransaksiKasAcc(\'' + val.id_tr_kas_acc + '\',\'' + val.kategori_acc + '\')" class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold">Delete</a>';
						data_tools += '		</td>';
					}
					data_tools += '</tr>';
					if (val.type_acc == 'Debet') {
						nominal_debet += parseFloat(val.nominal_acc);
					} else {
						nominal_kredit += parseFloat(val.nominal_acc);
					}
				});

				jQuery("#data_transaksi_in_accounting").html(data_tools);
				jQuery("#utama_value_kas").html(number_format(data.kas_utama));
				jQuery("#backup_value_kas").html(number_format(data.kas_backup));
				jQuery("#tunai_value_kas").html(number_format(data.kas_tunai));
				jQuery("#marketing_value_kas").html(number_format(data.kas_marketing));
				jQuery("#sisa_utama_value_kas").html(number_format(parseFloat(data.kas_tunai + data.kas_utama + data.kas_backup)));
				cekMinusKas();
			} else {
				jQuery("#data_transaksi_in_accounting").html('<tr><td colspan="5" align="center">Tidak Ada Data</td></tr>');
			}
			jQuery("#total-transaksi-in").html(no);
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}

function cekMinusKas() {
	// daftar id nominal yang ingin dicek
	var ids = ['#utama_value_kas', '#backup_value_kas', '#tunai_value_kas', '#marketing_value_kas'];

	$.each(ids, function (i, id) {
		var $el = $(id);
		var val = parseFloat(String($el.text()).replace(/[^0-9\-\.]/g, '')) || 0;

		if (val < 0) {
			$el.css('color', '#FF3B30'); // merah
		} else {
			$el.css('color', 'white'); // normal kembali
		}
	});
}

function openTambahKasPopup() {
	cleanupRekomendasiKeteranganKas();
	$('#input_kategori_data_kas').hide();
	jQuery(".clear_tambah_transaksi_in").val('');
	$('#button_tambah_fill_camera_kas').show();
	$('#button_tambah_fill_file_kas').show();
	$("#button_tambah_fill_camera_kas").removeClass("col-100");
	$("#button_tambah_fill_file_kas").removeClass("col-100");
	$("#button_tambah_fill_camera_kas").addClass("col");
	$("#button_tambah_fill_file_kas").addClass("col");
	comboKasAsal($$('#filter_kas_in_asal').val(), 'tambah');
	comboKasTujuan(null, 'tambah');
	jQuery("#text_file_path_terima_kas").html('Camera');
	gambarAccKas(1, 'tambah');
	$(".item_after_tambah_kas_asal").css("color", "white");
	$(".item_after_tambah_kas_transfer").css("color", "gray");
	$(".item_after_tambah_kas_asal").html($("#filter_kas_in_asal option:selected").text());
	comboKategoriKas('tambah');
}

function colorDropKasAsal(type) {
	$('.item_after_' + type + '_kas_asal').css("color", "white");
}

function colorDropKasTransfer(type) {
	if ($('#' + type + '_kas_asal').val() == $('#' + type + '_kas_transfer').val()) {
		app.dialog.alert('Kas Masuk Sama Dengan Kas Keluar');
		$('#' + type + '_kas_transfer').val('');
		$$('.item_after_' + type + '_kas_transfer').html('Kas Masuk');
		$('.item_after_' + type + '_kas_transfer').css("color", "grey");
	} else {
		$('.item_after_' + type + '_kas_transfer').css("color", "white");
	}
}

function getDetailTransaksiKasAcc(id_transaksi_kas_acc) {
	jQuery.ajax({
		type: "POST", //pake post jangan  get rawan di hack
		url: "" + BASE_API + "/get-detail-transaksi-kas-acc",
		dataType: 'JSON',
		timeout: 1000,
		data: {
			id_transaksi_kas_acc: id_transaksi_kas_acc
		},
		beforeSend: function () {
			jQuery('#clear_detail_transaksi_in').html('');
			jQuery('#file_bukti_terima_view_now_kas').attr('src', 'https://tasindo-sale-webservice.digiseminar.id/noimage.jpg');
		},
		success: function (data) {
			jQuery("#detail_kas_asal").val(data.data.kas_asal);
			jQuery("#detail_kas_transfer").val(data.data.kas_tujuan);
			jQuery("#detail_kas_nominal").val(number_format(data.data.nominal_kas_acc));
			jQuery("#detail_keterangan_kas").val(data.data.keterangan_kas_acc);
			if (data.data.bukti_foto_kas_acc != 'null') {
				jQuery('#file_bukti_terima_view_now_kas').attr('src', BASE_PATH_IMAGE_FOTO_ACCOUNTING + '/' + data.data.bukti_foto_kas_acc);
			} else {
				jQuery('#file_bukti_terima_view_now_kas').attr('src', 'https://tasindo-sale-webservice.digiseminar.id/noimage.jpg');
			}
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}


function getEditTransaksiKasAcc(id_transaksi_kas_acc) {
	jQuery.ajax({
		type: "POST", //pake post jangan  get rawan di hack
		url: "" + BASE_API + "/get-detail-transaksi-kas-acc",
		dataType: 'JSON',
		timeout: 10000,
		data: {
			id_transaksi_kas_acc: id_transaksi_kas_acc
		},
		beforeSend: function () {
			jQuery('#clear_edit_transaksi_in').html('');
			gambarAccKas(1, 'edit');
			jQuery('#file_bukti_terima_view_now_edit_kas').attr('src', 'https://tasindo-sale-webservice.digiseminar.id/noimage.jpg');
		},
		success: function (data) {
			$('#button_edit_fill_camera_kas').show();
			$('#button_edit_fill_file_kas').show();
			$("#button_edit_fill_camera_kas").removeClass("col-100");
			$("#button_edit_fill_file_kas").removeClass("col-100");
			$("#button_edit_fill_camera_kas").addClass("col");
			$("#button_edit_fill_file_kas").addClass("col");

			jQuery("#edit_value_kas_acc_1").html('File');
			jQuery("#text_file_path_terima_update_kas").html('Camera');


			comboKasAsal(data.data.id_kas_kr_acc, 'edit');
			comboKasTujuan(data.data.id_kas_db_acc, 'edit');
			$$('.item_after_edit_kas_asal').html(data.data.kas_asal);
			$$('.item_after_edit_kas_transfer').html(data.data.kas_tujuan);
			jQuery("#edit_kas_nominal").val(number_format(data.data.nominal_kas_acc));
			jQuery("#edit_keterangan_kas").val(data.data.keterangan_kas_acc);
			jQuery("#edit_id_tr_kas_acc").val(data.data.id_tr_kas_acc);

			if (data.data.bukti_foto_kas_acc != 'null') {
				jQuery('#file_bukti_terima_view_now_edit_kas').attr('src', BASE_PATH_IMAGE_FOTO_ACCOUNTING + '/' + data.data.bukti_foto_kas_acc);
			} else {
				jQuery('#file_bukti_terima_view_now_edit_kas').attr('src', 'https://tasindo-sale-webservice.digiseminar.id/noimage.jpg');
			}
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});

}

function comboKasAsal(id_kas_acc, type) {
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
			jQuery('#' + type + '_kas_asal').html('');
		},
		success: function (data) {
			var optionsValues = "";
			jQuery.each(data.data, function (i, item) {
				if (id_kas_acc == item.id_kas_acc) {
					optionsValues += '<option value="' + item.id_kas_acc + '" selected>' + item.kas_acc + '</option>';
				} else {
					optionsValues += '<option value="' + item.id_kas_acc + '">' + item.kas_acc + '</option>';
				}
			});
			jQuery('#' + type + '_kas_asal').html(optionsValues);
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
	$$('.item_after_' + type + '_kas_asal').html('Kas Keluar');
}

function comboKasTujuan(id_kas_acc, type) {
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
			jQuery('#' + type + '_kas_transfer').html('');
		},
		success: function (data) {
			var optionsValues = "";
			jQuery.each(data.data, function (i, item) {
				if (id_kas_acc == item.id_kas_acc) {
					optionsValues += '<option value="' + item.id_kas_acc + '" selected>' + item.kas_acc + '</option>';
				} else {
					optionsValues += '<option value="' + item.id_kas_acc + '">' + item.kas_acc + '</option>';
				}
			});
			jQuery('#' + type + '_kas_transfer').html(optionsValues);
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
	$$('.item_after_' + type + '_kas_transfer').html('Kas Masuk');
}

function comboKasFilterOut() {
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
			jQuery('#filter_kas_in_asal').html('');
		},
		success: function (data) {
			var optionsValues = "";
			jQuery.each(data.data, function (i, item) {
				if (localStorage.getItem("primary_kas") == item.id_kas_acc) {
					optionsValues += '<option value="' + item.id_kas_acc + '" selected>' + item.kas_acc + '</option>';
				} else {
					optionsValues += '<option value="' + item.id_kas_acc + '">' + item.kas_acc + '</option>';
				}
			});
			jQuery('#filter_kas_in_asal').html(optionsValues);
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}

function comboKategoriKas(type) {
	// start koding ajax
	jQuery.ajax({
		type: "POST", //pake post jangan  get rawan di hack
		url: "" + BASE_API + "/get-kategori-acc",
		dataType: 'JSON',
		timeout: 10000,
		data: {
			user_id: localStorage.getItem("user_id"),
			kas: jQuery('#' + type + '_kas_transfer').val()
		},
		beforeSend: function () {
			jQuery('#' + type + '_kategori_data_kas').html('');
		},
		success: function (data) {
			var optionsValues = "";
			optionsValues += '<option value="">Kategori</option>';
			jQuery.each(data.data, function (i, item) {
				optionsValues += '<option value="' + item.id_kategori_acc + '" data-id="' + item.flag_lunas + '" >' + item.kategori_acc + '</option>';
			});
			jQuery('#' + type + '_kategori_data_kas').html(optionsValues);
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
	$$('.item_after_' + type + '_kategori_data_kas').html('~ Pilih Kategori ~');
}

function simpanTransaksiKas() {
	if (localStorage.getItem("internet_koneksi") == 'fail') {
		app.dialog.alert('<font style="font-size:22px; color:white; font-weight:bold;">Gagal,Internet Tidak Stabil,Box Koneksi Harus Berwarna Hijau', function () {
		});
	} else {
		if (!$$('#form_tambah_transaksi_in_acc')[0].checkValidity()) {
			app.dialog.alert('Cek Isian Anda');
		} else {
			if (localStorage.getItem("file_foto_terima_pabrik_kas") != null || jQuery('#tambah_file_kas_acc_1').val() != '') {
				var formData = new FormData(jQuery("#form_tambah_transaksi_in_acc")[0]);
				formData.append('user_record', localStorage.getItem("karyawan_nama"));
				formData.append('lokasi_pabrik', localStorage.getItem("lokasi_pabrik"));
				formData.append('user_id', localStorage.getItem("user_id"));
				formData.append('bukti_terima', localStorage.getItem("file_foto_terima_pabrik_kas"));
				jQuery.ajax({
					type: "POST",
					url: "" + BASE_API + "/tambah-transaksi-kas-acc",
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
						$$('.clear_tambah_transaksi_in').val('');
						if (data.status == 'success') {
							app.popup.close();
							getDataTransaksiKas()
							localStorage.removeItem('file_foto_terima_pabrik_kas');
							cleanupRekomendasiKeteranganKas();
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

function updateTransaksiKas() {
	if (localStorage.getItem("internet_koneksi") == 'fail') {
		app.dialog.alert('<font style="font-size:22px; color:white; font-weight:bold;">Gagal,Internet Tidak Stabil,Box Koneksi Harus Berwarna Hijau', function () {
		});
	} else {
		if (!$$('#form_edit_transaksi_in_acc')[0].checkValidity()) {
			app.dialog.alert('Cek Isian Anda');
			var formData = new FormData(jQuery("#form_edit_transaksi_in_acc")[0]);
			// output as an object
			console.log(Object.fromEntries(formData));
		} else {
			if (localStorage.getItem("file_foto_update_terima_pabrik_kas") != null || jQuery('#edit_file_kas_acc_1').val() != '') {
				var formData = new FormData(jQuery("#form_edit_transaksi_in_acc")[0]);
				formData.append('user_modified', localStorage.getItem("karyawan_nama"));
				formData.append('bukti_terima', localStorage.getItem("file_foto_update_terima_pabrik_kas"));
				formData.append('lokasi_pabrik', localStorage.getItem("lokasi_pabrik"));
				formData.append('user_id', localStorage.getItem("user_id"));

				jQuery.ajax({
					type: "POST",
					url: "" + BASE_API + "/update-transaksi-kas-acc",
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
						$$('.clear_edit_transaksi_in').val('');
						if (data.status == 'success') {
							app.popup.close();
							getDataTransaksiKas()
							localStorage.removeItem('file_foto_update_terima_pabrik_kas');
							cleanupRekomendasiKeteranganKas();
						} else if (data.status == 'failed') {
							app.popup.close();
						}
					},
					error: function (xmlhttprequest, textstatus, message) {
						app.dialog.alert('Ada kendala pada koneksi server, Silahkan Coba Kembali');
						app.popup.close();
					}

				});
			} else if (localStorage.getItem("file_foto_update_terima_pabrik_kas") == null && jQuery('#edit_file_kas_acc_1').val() == '') {
				var formData = new FormData(jQuery("#form_edit_transaksi_in_acc")[0]);
				formData.append('user_modified', localStorage.getItem("karyawan_nama"));
				formData.append('bukti_terima_kas', null);
				formData.append('lokasi_pabrik', localStorage.getItem("lokasi_pabrik"));
				formData.append('user_id', localStorage.getItem("user_id"));

				jQuery.ajax({
					type: "POST",
					url: "" + BASE_API + "/update-transaksi-kas-acc",
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
						$$('.clear_edit_transaksi_in').val('');
						if (data.status == 'success') {
							app.popup.close();
							getDataTransaksiKas()
							localStorage.removeItem('file_foto_update_terima_pabrik_kas');
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


function deleteTransaksiKasAcc(id_tr_kas_acc) {
	app.dialog.confirm('Delete Data ?', function () {
		if (localStorage.getItem("internet_koneksi") == 'fail') {
			app.dialog.alert('<font style="font-size:22px; color:white; font-weight:bold;">Gagal,Internet Tidak Stabil,Box Koneksi Harus Berwarna Hijau', function () {
			});
		} else {
			jQuery.ajax({
				type: "POST",
				url: "" + BASE_API + "/delete-transaksi-kas-acc",
				dataType: "JSON",
				data: {
					id_tr_kas_acc: id_tr_kas_acc,
				},
				beforeSend: function () {
					app.dialog.preloader('Harap Tunggu');
				},
				success: function (data) {
					app.dialog.close();
					if (data.status == 'success') {
						app.dialog.alert('Berhasil Menghapus Data');
						getDataTransaksiKas();
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


function getBulanTransaksiKas() {
	var m = moment.months();
	var month_now = moment().month();
	var n = 0;
	for (var i = 0; i < 12; i++) {
		n++
		if (i == month_now) {
			$('.transaksi_kas_bulan').append($('<option selected/>').val(n).html(m[i]));
		} else {
			$('.transaksi_kas_bulan').append($('<option />').val(n).html(m[i]));
		}
	}
}

function getYearTransaksiKas() {
	let startYear = 2010;
	let endYear = new Date().getFullYear();
	for (i = endYear; i > startYear; i--) {
		if (i == endYear) {
			$('.transaksi_kas_years').append($('<option selected/>').val(i).html(i));
		} else {
			$('.transaksi_kas_years').append($('<option />').val(i).html(i));
		}
	}
}

// ===============================
// REKOMENDASI KETERANGAN KAS (GLOBAL, GAYA KODE KAMU)
// ===============================
function initRekomendasiKeteranganKas(type) {
	// ===== helpers =====
	function firstExistingSelector(arr) {
		for (var i = 0; i < arr.length; i++) if (jQuery(arr[i]).length) return arr[i];
		return null;
	}
	function ensureDropdownContainer(id) {
		if (jQuery('#' + id).length === 0) {
			jQuery('body').append(
				'<div id="' + id + '" class="custom-datalist" ' +
				// Naikkan z-index agar di atas Framework7 popup/overlays
				'style="display:none;position:absolute;background:#222;color:#fff;border:1px solid #444;border-radius:8px;padding:4px 0;z-index:30001;max-height:260px;overflow:auto;"></div>'
			);
		}
	}
	function escapeHtml(s) {
		return String(s).replace(/[&<>"']/g, function (m) {
			return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m];
		});
	}
	// === NEW: helper untuk show kalau sedang fokus
	function showIfFocused(selKet, dropId) {
		var $inp = jQuery(selKet);
		if ($inp.length && document.activeElement === $inp.get(0)) {
			positionDropdown();
			jQuery('#' + dropId).show();
		}
	}

	function renderOptions(dropId, arr) {
		var html = '';
		for (var i = 0; i < (arr || []).length; i++) {
			var v = ((arr[i] || {}).keterangan || '').toString();
			if (!v) continue;
			html += '' +
				'<div class="option-item" style="display:flex;align-items:center;justify-content:space-between;padding:6px 10px;cursor:pointer;">' +
				'<span class="opt-text" style="pointer-events:none;">' + escapeHtml(v) + '</span>' +
				'<span class="opt-del" data-val="' + escapeHtml(v) + '" ' +
				'style="margin-left:8px;padding:0 6px;border-radius:4px;cursor:pointer;color:#FF4F04;font-weight:bold;">✕</span>' +
				'</div>' +
				'<div style="height:1px;background:#333;margin:0;"></div>';
		}
		jQuery('#' + dropId).html(html || '<div style="padding:8px 10px;color:#aaa;">Tidak ada rekomendasi</div>');
	}

	// ===== targets =====
	var KAS_ASAL_IDS = ['#' + type + '_kas_asal'];
	var KAS_TRANSFER_IDS = ['#' + type + '_kas_transfer'];
	var KET_IDS = ['#' + type + '_keterangan_kas'];

	var selKas = firstExistingSelector(KAS_ASAL_IDS);
	var selKasTra = firstExistingSelector(KAS_TRANSFER_IDS);
	var selKet = firstExistingSelector(KET_IDS);
	if (!selKas || !selKet) return;
	if (!selKasTra) return; // <— fix typo

	var DROP_ID = 'list_keterangan_kas_' + type + '_dropdown';
	ensureDropdownContainer(DROP_ID);

	function positionDropdown() {
		var $inp = jQuery(selKet), $drop = jQuery('#' + DROP_ID);
		var pos = $inp.offset();
		$drop.css({
			top: pos.top + $inp.outerHeight(),
			left: pos.left,
			width: $inp.outerWidth()
		});
	}

	function loadRekomendasi() {
		var idKas = jQuery(selKas).val() || '';
		var idKasTj = jQuery(selKasTra).val() || '';
		if (!idKas) {
			renderOptions(DROP_ID, []);
			jQuery('#' + DROP_ID).hide();   // <— sembunyikan kalau kosong
			return;
		}
		jQuery.ajax({
			type: 'POST',
			url: '' + BASE_API + '/rekomendasi-keterangan',
			dataType: 'JSON',
			data: { id_kas_acc_asal: idKas, id_kas_acc_tujuan: idKasTj },
			success: function (res) {
				var rows = (res && res.status === 'success') ? (res.data || []) : [];
				renderOptions(DROP_ID, rows);
				// === NEW: auto show kalau input sedang fokus, supaya langsung terlihat
				showIfFocused(selKet, DROP_ID);
			},
			error: function () {
				renderOptions(DROP_ID, []);
				jQuery('#' + DROP_ID).hide();
			}
		});
	}

	// ==== EVENTS ====

	// 1) Ubah kas_asal ATAU kas_transfer -> reload
	jQuery(document).off('change.rekoKasAsal' + type, selKas)
		.on('change.rekoKasAsal' + type, selKas, function () {
			loadRekomendasi();
			if (jQuery('#' + DROP_ID).is(':visible')) positionDropdown();
		});

	jQuery(document).off('change.rekoKasTj' + type, selKasTra)
		.on('change.rekoKasTj' + type, selKasTra, function () {
			loadRekomendasi();
			if (jQuery('#' + DROP_ID).is(':visible')) positionDropdown();
		});

	// 2) Fokus/ketik pada input -> buka & filter
	jQuery(document).off('focus.rekoKas' + type, selKet)
		.on('focus.rekoKas' + type, selKet, function () {
			positionDropdown();
			jQuery('#' + DROP_ID).show();
		});

	jQuery(document).off('input.rekoKas' + type, selKet)
		.on('input.rekoKas' + type, selKet, function () {
			var q = (jQuery(this).val() || '').toLowerCase();
			jQuery('#' + DROP_ID + ' .option-item').each(function () {
				var t = jQuery(this).find('.opt-text').text().toLowerCase();
				var vis = (t.indexOf(q) !== -1);
				jQuery(this).toggle(vis);
				jQuery(this).next().toggle(vis);
			});
			if (!jQuery('#' + DROP_ID).is(':visible')) {
				positionDropdown();
				jQuery('#' + DROP_ID).show();
			}
		});

	// 3) Klik item -> set nilai
	jQuery(document).off('click.rekoKasPick' + type, '#' + DROP_ID + ' .option-item')
		.on('click.rekoKasPick' + type, '#' + DROP_ID + ' .option-item', function (e) {
			if (jQuery(e.target).hasClass('opt-del')) return;
			var val = jQuery(this).find('.opt-text').text();
			jQuery(selKet).val(val).trigger('change');
			jQuery('#' + DROP_ID).hide();
		});

	// 4) Klik X per item
	jQuery(document).off('click.rekoKasDel' + type, '#' + DROP_ID + ' .opt-del')
		.on('click.rekoKasDel' + type, '#' + DROP_ID + ' .opt-del', function (e) {
			e.stopPropagation();
			var val = jQuery(this).data('val');
			jQuery(this).closest('.option-item').next().remove();
			jQuery(this).closest('.option-item').remove();
			// contoh kalau mau panggil API hapus rekomendasi: 
			jQuery.post(BASE_API + '/delete-rekomendasi-keterangan', { keterangan: val, id_kas_acc: jQuery(selKas).val() });
			if (jQuery(selKet).val() === val) jQuery(selKet).val('').trigger('change');
		});

	// 5) Klik di luar -> tutup
	jQuery(document).off('mousedown.rekoKasOutside' + type)
		.on('mousedown.rekoKasOutside' + type, function (e) {
			if (!jQuery(e.target).closest('#' + DROP_ID + ', ' + selKet).length) {
				jQuery('#' + DROP_ID).hide();
			}
		});

	// 6) Reposition saat resize/scroll
	jQuery(window).off('resize.rekoKas' + type).on('resize.rekoKas' + type, function () {
		if (jQuery('#' + DROP_ID).is(':visible')) positionDropdown();
	});
	jQuery(window).off('scroll.rekoKas' + type).on('scroll.rekoKas' + type, function () {
		if (jQuery('#' + DROP_ID).is(':visible')) positionDropdown();
	});

	// === NEW: reposition saat scroll kontainer popup (.page-content)
	var $scrollHost = jQuery(selKet).closest('.page-content');
	if ($scrollHost.length) {
		$scrollHost.off('scroll.rekoKasHost' + type).on('scroll.rekoKasHost' + type, function () {
			if (jQuery('#' + DROP_ID).is(':visible')) positionDropdown();
		});
	}

	// initial load (+ auto-show jika input fokus)
	loadRekomendasi();
}

function cleanupRekomendasiKeteranganKas(type) {
	var selKet = '#' + type + '_keterangan_kas';
	var selKas = '#' + type + '_kas_asal';
	var selKasTra = '#' + type + '_kas_transfer';
	var DROP_ID = 'list_keterangan_kas_' + type + '_dropdown';

	jQuery(document).off('change.rekoKasAsal' + type, selKas);
	jQuery(document).off('change.rekoKasTj' + type, selKasTra);
	jQuery(document).off('focus.rekoKas' + type, selKet);
	jQuery(document).off('input.rekoKas' + type, selKet);
	jQuery(document).off('click.rekoKasPick' + type, '#' + DROP_ID + ' .option-item');
	jQuery(document).off('click.rekoKasDel' + type, '#' + DROP_ID + ' .opt-del');
	jQuery(document).off('mousedown.rekoKasOutside' + type);
	jQuery(window).off('resize.rekoKas' + type);
	jQuery(window).off('scroll.rekoKas' + type);

	// lepas scroll host
	var $scrollHost = jQuery(selKet).closest('.page-content');
	if ($scrollHost.length) $scrollHost.off('scroll.rekoKasHost' + type);

	jQuery('#' + DROP_ID).remove();
}


