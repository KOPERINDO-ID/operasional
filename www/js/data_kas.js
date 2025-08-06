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
		jQuery('#filter_kas_in_asal').val('')
		jQuery('#range-penjualan-in').val('')
		filterDataTransaksiKas();
	}
}

function filterDataTransaksiKas() {
	// if (jQuery('#filter_kas_in_asal').val() == localStorage.getItem("primary_kas")) {
	// 	$("#hide-tambah-kas-button").show();
	// } else {
	// 	$("#hide-tambah-kas-button").hide();
	// }
	getDataTransaksiKas()
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

					data_tools += '		<td style="border-right: 1px solid grey;border-bottom: 1px solid grey;text-align:center">';
					data_tools += '			<a onclick="getDetailTransaksiKasAcc(\'' + val.id_tr_kas_acc + '\')" class="' + btn_detail + ' button-small col button popup-open text-bold" data-popup=".detail-transaksi-in">Detail</a>';
					data_tools += '		</td>';
					if (localStorage.getItem("user_id") == 262) {
						data_tools += '		<td style="border-right: 1px solid grey;border-bottom: 1px solid grey;text-align:center">';
						data_tools += '			<a onclick="getEditTransaksiKasAcc(\'' + val.id_tr_kas_acc + '\')" class="text-add-colour-black-soft bg-dark-gray-young button-small col button popup-open text-bold" data-popup=".edit-transaksi-in">Edit</a>';
						data_tools += '		</td>';
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
			} else {
				jQuery("#data_transaksi_in_accounting").html('<tr><td colspan="5" align="center">Tidak Ada Data</td></tr>');
			}
			jQuery("#total-transaksi-in").html(no);
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}

function openTambahKasPopup() {

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