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

function getDataTransaksi() {
	var kas = '';
	if (jQuery('#filter_kas').val() == '' || jQuery('#filter_kas').val() == null) {
		kas = localStorage.getItem("primary_kas");
		// $("#hide-tambah-button").show();
	} else {
		kas = jQuery('#filter_kas').val();
	}

	// if (jQuery('#range-penjualan').val() == '' || jQuery('#range-penjualan').val() == null) {
	// 	var startdate = "empty";
	// 	var enddate = "empty";
	// } else {
	// 	var startdate_new = new Date(calendarRangePenjualan.value[0]);
	// 	var enddate_new = new Date(calendarRangePenjualan.value[1]);
	// 	var startdate = moment(startdate_new).format('YYYY-MM-DD');
	// 	var enddate = moment(enddate_new).format('YYYY-MM-DD');
	// }

	var year_now = new Date().getFullYear();
	if (jQuery('#transaksi_years option:selected').val() == null) {
		var year = year_now;
	} else if (jQuery('#transaksi_years option:selected').val() == 'all') {
		var year = 'empty';
	} else {
		var year = jQuery('#transaksi_years option:selected').val();
	}

	var month_now = new Date().getMonth() + 1;
	if (jQuery('#transaksi_bulan option:selected').val() == null) {
		var month = month_now;
	} else if (jQuery('#transaksi_bulan option:selected').val() == 'all') {
		var month = 'empty';
	} else {
		var month = jQuery('#transaksi_bulan option:selected').val();
	}
	console.log(jQuery('#transaksi_years option:selected').val());

	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-transaksi-acc",
		dataType: 'JSON',
		data: {
			user_id: localStorage.getItem("user_id"),
			kas: kas,
			// startdate: startdate,
			// enddate: enddate,
			month: month,
			year: year,
			lokasi_pabrik: localStorage.getItem("lokasi_pabrik"),
		},
		beforeSend: function () {
		},
		success: function (data) {
			var data_tools = '';

			var no = 0;
			if (data.data != null) {
				var nominal_debet = 0;
				var nominal_kredit = 0;
				jQuery.each(data.data, function (i, val) {
					no++
					if (val.type_acc == 'Debet') {
						var color_row = 'card-color-light-blue';
					}
					data_tools += '<tr class="' + color_row + '">';
					data_tools += '     <td align="center" style="border-left: 1px solid grey;border-bottom: 1px solid grey;"  class="label-cell"  >' + no + '</td>';
					data_tools += '     <td align="center" style="border-left: 1px solid grey;border-bottom: 1px solid grey;"  class="label-cell"  >' + moment(val.tanggal_transaksi).format('DD-MMM-YYYY') + '</td>';
					data_tools += '     <td align="left" style="border-left: 1px solid grey;border-bottom: 1px solid grey;"  class="label-cell"  >' + val.kategori_acc + '</td>';

					if (val.id_perusahaan_acc != null) {
						data_tools += '     <td align="left" style="border-left: 1px solid grey;border-bottom: 1px solid grey;"  class="label-cell popup-open" data-popup=".detail-perusahaan-popup" onclick="getDetailPerusahaanAcc(\'' + val.perusahaan_acc + '\',\'' + val.perusahaan_pic + '\',\'' + val.perusahaan_no_hp + '\',\'' + val.perusahaan_no_plat + '\',\'' + val.perusahaan_uraian + '\')" >' + val.keterangan + '</td>';
						var keterangan_acc = val.perusahaan_pic + ' , ' + val.perusahaan_no_plat;
					} else {
						data_tools += '     <td align="left" style="border-left: 1px solid grey;border-bottom: 1px solid grey;"  class="label-cell"  >' + val.keterangan + '</td>';
						var keterangan_acc = val.keterangan;
					}

					data_tools += '     <td align="right" style="border-left: 1px solid grey;border-bottom: 1px solid grey;"  class="label-cell"  >' + number_format(val.nominal_acc) + '</td>';

					if (val.valid == 1) {
						var btn_detail = 'btn-color-blueWhite';
					} else if (val.valid == 2) {
						var btn_detail = 'card-color-red';
					} else {
						var btn_detail = 'bg-dark-gray-young text-add-colour-black-soft';
					}

					var sisa = (val.nominal_acc) - val.operasional_jumlah_pembayaran;
					if (sisa <= 0) {
						var color_btn_byr = "btn-color-blueWhite";
					} else if (sisa > 0 && val.pembayaran1_tgl != null) {
						if (sisa == val.nominal_acc) {
							var color_btn_byr = "bg-dark-gray-young text-add-colour-black-soft";
						} else {
							var color_btn_byr = "btn-color-greenWhite";
						}
					}
					if (val.type_pembayaran == 'cicilan') {
						data_tools += '<td style="border-left:1px solid gray; border-bottom:1px solid gray;" class="label-cell">';
						data_tools += '   <a  class="' + color_btn_byr + '  button-small col button popup-open text-bold" data-popup=".detail-pembayaran" onclick="detailPembayaran(\'' + val.tanggal_transaksi + '\',\'' + val.bank_1 + '\',\'' + val.bank_2 + '\',\'' + val.bank_3 + '\',\'' + val.bank_4 + '\',\'' + val.bank_5 + '\',\'' + val.bank_6 + '\',\'' + val.bank_7 + '\',\'' + val.bank_8 + '\',\'' + val.bank_9 + '\',\'' + val.bank_10 + '\',\'' + val.pembayaran1_tgl + '\',\'' + val.pembayaran2_tgl + '\',\'' + val.pembayaran3_tgl + '\',\'' + val.pembayaran4_tgl + '\',\'' + val.pembayaran5_tgl + '\',\'' + val.pembayaran6_tgl + '\',\'' + val.pembayaran7_tgl + '\',\'' + val.pembayaran8_tgl + '\',\'' + val.pembayaran9_tgl + '\',\'' + val.pembayaran10_tgl + '\',\'' + val.bank + '\',\'' + val.pembayaran_1 + '\',\'' + val.pembayaran_2 + '\',\'' + val.pembayaran_3 + '\',\'' + val.pembayaran_4 + '\',\'' + val.pembayaran_5 + '\',\'' + val.pembayaran_6 + '\',\'' + val.pembayaran_7 + '\',\'' + val.pembayaran_8 + '\',\'' + val.pembayaran_9 + '\',\'' + val.pembayaran_10 + '\',\'' + val.operasional_jumlah_pembayaran + '\',\'' + val.nominal_acc + '\',\'' + val.id_transaksi_acc + '\',\'' + val.operasional_status_pembayaran + '\',\'' + val.pembayaran_operasional_id + '\',\'' + val.kategori_acc + '\',\'' + keterangan_acc + '\');">Bayar</a>';
						data_tools += '</td>';
					} else {
						data_tools += '<td style="border-left:1px solid gray; border-bottom:1px solid gray;" class="label-cell">';
						data_tools += '</td>';
					}

					data_tools += '		<td style="border-right: 1px solid grey;border-bottom: 1px solid grey;text-align:center">';
					data_tools += '			<a onclick="getDetailTransaksiAcc(\'' + val.id_transaksi_acc + '\',\'' + val.id_perusahaan_acc + '\')" class="' + btn_detail + ' button-small col button popup-open text-bold" data-popup=".detail-transaksi">Detail</a>';
					data_tools += '		</td>';
					if (localStorage.getItem("user_id") == 262) {
						data_tools += '		<td style="border-right: 1px solid grey;border-bottom: 1px solid grey;text-align:center">';
						data_tools += '			<a onclick="getEditTransaksiAcc(\'' + val.id_transaksi_acc + '\',\'' + val.id_perusahaan_acc + '\')" class="text-add-colour-black-soft bg-dark-gray-young button-small col button popup-open text-bold" data-popup=".edit-transaksi">Edit</a>';
						data_tools += '		</td>';
						data_tools += '		<td style="border-right: 1px solid grey;border-bottom: 1px solid grey;text-align:center">';
						data_tools += '			<a onclick="deleteTransaksiAcc(\'' + val.id_transaksi_acc + '\',\'' + val.kategori_acc + '\')" class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold">Delete</a>';
						data_tools += '		</td>';
					}
					data_tools += '</tr>';
					if (val.type_acc == 'Debet') {
						nominal_debet += parseFloat(val.nominal_acc);
					} else {
						nominal_kredit += parseFloat(val.nominal_acc);
					}
				});


				jQuery("#hide_total").show();
				jQuery("#total-accounting").html(number_format(parseFloat(nominal_debet) - parseFloat(nominal_kredit)));

				jQuery("#data_transaksi_accounting").html(data_tools);
			} else {
				jQuery("#total-accounting").html(number_format(0));
				jQuery("#data_transaksi_accounting").html('<tr><td colspan="5" align="center">Tidak Ada Data</td></tr>');
			}
			jQuery("#total-transaksi").html(no);
		},
		error: function (xmlhttprequest, textstatus, message) {
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

function openTambahPopup() {
	jQuery(".clear_tambah_transaksi").val('');
	$('.tambah_expedisi').hide();
	$('.uraian_transaksi').show();
	$('#button_tambah_fill_camera').show();
	$('#button_tambah_fill_file').show();
	$("#button_tambah_fill_camera").removeClass("col-100");
	$("#button_tambah_fill_file").removeClass("col-100");
	$("#button_tambah_fill_camera").addClass("col");
	$("#button_tambah_fill_file").addClass("col");
	comboKategoriTambah();
	comboPerusahaanTambah();
	jQuery("#text_file_path_terima").html('Camera');
	gambarAcc(1, 'tambah');
	$(".item_after_tambah_kategori").css("color", "gray");
}

function hideLunas(type) {
	var flag_lunas = $('#' + type + '_kategori').find(':selected').data('id');
	$('.item_after_' + type + '_kategori').css("color", "white");
	console.log(flag_lunas);
	if (flag_lunas == 1) {
		$('.' + type + '_expedisi').hide();
		$('#' + type + '_pembayaran').val('lunas');
		$('.' + type + '_uraian_transaksi').show();
		$('.' + type + '_expedisi_att').prop('required', false)
		$('.' + type + '_expedisi_att').prop('validate', false)
		$('.' + type + '_uraian_att').prop('required', true)
		$('.' + type + '_uraian_att').prop('validate', true)
	} else if (flag_lunas == 2) {
		$('.item_after_' + type + '_perusahaan').css("color", "gray");
		$('.' + type + '_expedisi').show();
		$('.' + type + '_uraian_transaksi').hide();
		$('.' + type + '_expedisi_att').prop('required', true)
		$('.' + type + '_expedisi_att').prop('validate', true)
		$('.' + type + '_uraian_att').prop('required', false)
		$('.' + type + '_uraian_att').prop('validate', false)
	} else {
		$('.' + type + '_expedisi').hide();
		$('.' + type + '_uraian_transaksi').show();
		$('.' + type + '_expedisi_att').prop('required', false)
		$('.' + type + '_expedisi_att').prop('validate', false)
		$('.' + type + '_uraian_att').prop('required', true)
		$('.' + type + '_uraian_att').prop('validate', true)
	}
}

function colorDropPerusahaan(type) {
	$('.item_after_' + type + '_perusahaan').css("color", "white");
}

function getDetailTransaksiAcc(id_transaksi_acc, id_perusahaan_acc) {
	jQuery.ajax({
		type: "POST", //pake post jangan  get rawan di hack
		url: "" + BASE_API + "/get-detail-transaksi-acc",
		dataType: 'JSON',
		timeout: 10000,
		data: {
			id_transaksi_acc: id_transaksi_acc
		},
		beforeSend: function () {
			jQuery('#clear_detail_transaksi').html('');
			jQuery("#show_button_valid").hide();
			gambarAcc(1, 'detail');
			jQuery('#file_bukti_terima_view_now').attr('src', 'https://tasindo-sale-webservice.digiseminar.id/noimage.jpg');
		},
		success: function (data) {
			if (localStorage.getItem("user_id") == 260 || localStorage.getItem("user_id") == 262) {
				if (data.data.valid == 0) {
					jQuery("#show_button_valid").show();
				} else {
					jQuery("#show_button_valid").hide();
				}
			} else {
				jQuery("#show_button_valid").hide();
			}
			colorDropPerusahaan('edit');
			if (data.data.id_perusahaan_acc != null) {
				jQuery('.detail_expedisi').show();
				$('.detail_uraian_transaksi').hide();
			} else {
				jQuery('.detail_expedisi').hide();
				jQuery('.detail_uraian_transaksi').show();
			}

			$('.detail_expedisi_att').prop('readonly', true)
			$('.detail_uraian_att').prop('readonly', true)
			$('.detail_nominal_att').prop('readonly', true)
			$('.detail_kategori_att').prop('readonly', true)
			$('#smart_select_detail_kategori').addClass('disabled');
			$('#smart_select_detail_perusahaan').addClass('disabled');
			comboKategoriDetail(data.data.id_kategori_acc, 'detail');
			comboPerusahaanDetail(data.data.id_perusahaan_acc), 'detail';
			$$('.item_after_detail_kategori').html(data.data.kategori_acc);
			$$('.item_after_detail_perusahaan').html(data.data.perusahaan_acc);
			jQuery("#detail_pic").val(data.data.perusahaan_pic);
			jQuery("#detail_plat").val(data.data.perusahaan_no_plat);
			jQuery("#detail_nohp").val(data.data.perusahaan_no_hp);
			jQuery("#detail_expedisi_keterangan").val(data.data.perusahaan_uraian);
			jQuery("#detail_keterangan").val(data.data.keterangan);
			jQuery("#detail_nominal").val(number_format(data.data.nominal_acc));
			jQuery("#detail_id_transaksi_acc").val(data.data.id_transaksi_acc);
			jQuery("#detail_pembayaran").val(data.data.type_pembayaran);
			if (data.data.bukti_foto_acc != 'null') {
				jQuery('#file_bukti_terima_view_now').attr('src', BASE_PATH_IMAGE_FOTO_ACCOUNTING + '/' + data.data.bukti_foto_acc);
			} else {
				jQuery('#file_bukti_terima_view_now').attr('src', 'https://tasindo-sale-webservice.digiseminar.id/noimage.jpg');
			}
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});

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
			if (data.data.bukti_foto_acc != 'null') {
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
				if (localStorage.getItem("primary_kas") == item.id_kas_acc) {
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
	if (jQuery('#pembayaran_' + number + '_' + pembayaran_id + '').val() == "" || jQuery('#bank_' + number + '_' + pembayaran_id + '').val() == "" || jQuery('#tanggal_' + number + '_' + pembayaran_id + '').val() == "" || jQuery('#foto_bukti_' + number + '_' + pembayaran_id).val() == "") {
		app.dialog.alert('Isi Data Pembayaran Dengan Lengkap');
		console.log(number + ' - ' + jQuery('#pembayaran_' + number + '_' + pembayaran_id + '').val());
		console.log(number + ' - ' + jQuery('#bank_' + number + '_' + pembayaran_id + '').val());
		console.log(number + ' - ' + jQuery('#tanggal_' + number + '_' + pembayaran_id + '').val());
		console.log(number + ' - ' + jQuery('#foto_bukti_' + number + '_' + pembayaran_id).val());
	} else {

		var total_harus_bayar = parseInt(jQuery('#total_harus_bayar_' + pembayaran_id + '').val());


		var sudah_bayar = parseInt(jQuery('#sudah_bayar_' + pembayaran_id + '').val()) + parseInt(jQuery('#pembayaran_' + number + '_' + pembayaran_id + '').val().replace(/\,/g, ''));
		var sisa_harus_bayar = total_harus_bayar - sudah_bayar;

		if (sisa_harus_bayar < 0) {
			var lebih_bayar = sudah_bayar - total_harus_bayar;
			app.dialog.alert('Pembayaran Melebihi Nominal <br> <br> Nominal Lebih : ' + number_format(lebih_bayar) + ' <br><br>Bagi Pada Angsuran Berikutnya');
		} else {

			var formData = new FormData($('#pembayaran_form_multiple_' + number + '_' + pembayaran_id)[0]);

			formData.append('pembayaran', jQuery('#pembayaran_' + number + '_' + pembayaran_id + '').val());
			formData.append('bank', jQuery('#bank_' + number + '_' + pembayaran_id + '').val());
			formData.append('tanggal', jQuery('#tanggal_' + number + '_' + pembayaran_id + '').val());
			formData.append('keterangan', jQuery('#keterangan_' + number + '_' + pembayaran_id + '').val());
			formData.append('pembayaran_id', pembayaran_id);
			formData.append('pembayaran_ke', number);
			formData.append('foto_bukti', jQuery('#foto_bukti_' + number + '_' + pembayaran_id + '').prop('files')[0]);
			formData.append('karyawan_nama', localStorage.getItem("karyawan_nama"));
			jQuery.ajax({
				type: 'POST',
				url: "" + BASE_API + "/proses-pembayaran-operasional-multiple",
				dataType: 'JSON',
				data: formData,
				contentType: false,
				processData: false,
				beforeSend: function () {
					app.dialog.preloader('Harap Tunggu');
				},
				success: function (data) {
					getDataTransaksi();
					app.dialog.close();
					app.popup.close();
					if (data.status == 'done') {
						app.dialog.alert('Berhasil Input Pembayaran');
					} else if (data.status == 'failed') {
						app.dialog.alert('Gagal Input Pembayaran');
					}
				},
				error: function (xmlhttprequest, textstatus, message) {
				}
			});
		}
	}
}

function uploadFotoPembayaran(foto_urutan, pembayaran_id, isi_foto) {
	jQuery('#penjualan_id_foto_pembayaran').val(pembayaran_id);
	jQuery('#foto_urutan').val(foto_urutan);

	jQuery('#file_foto_pembayaran').val('');
	localStorage.removeItem('file_foto_pembayaran');
	$('#file_foto_pembayaran_view').attr('src', '');
	$('#file_foto_pembayaran_view_now').attr('src', '');
	$$(".custom-file-upload-foto-pembayaran").show();
	if (isi_foto != 'null') {
		$('.btn-payment-penjualan').hide();
		jQuery('#file_foto_pembayaran_view_now').attr('src', BASE_PATH_IMAGE_FOTO_PEMBAYARAN + '/' + isi_foto);
	} else {
		$('.btn-payment-penjualan').show();
		jQuery('#file_foto_pembayaran_view_now').attr('src', 'https://tasindo-sale-webservice.digiseminar.id/noimage.jpg');
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


function detailPembayaran(tanggal_pembelian, bank_1, bank_2, bank_3, bank_4, bank_5, bank_6, bank_7, bank_8, bank_9, bank_10, pembayaran1_tgl, pembayaran2_tgl, pembayaran3_tgl, pembayaran4_tgl, pembayaran5_tgl, pembayaran6_tgl, pembayaran7_tgl, pembayaran8_tgl, pembayaran9_tgl, pembayaran10_tgl, bank, pembayaran_1, pembayaran_2, pembayaran_3, pembayaran_4, pembayaran_5, pembayaran_6, pembayaran_7, pembayaran_8, pembayaran_9, pembayaran_10, pembelian_jumlah_pembayaran, total_pembelian, pembelian_header_id, pembelian_status_pembayaran, pembayaran_pembelian_id, kategori_acc, keterangan_acc) {
	jQuery('#history_pembayaran_multiple').html("");

	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/detail-pembayaran-operasional-multiple",
		dataType: 'JSON',
		data: {
			id_transaksi_acc: pembelian_header_id
		},
		beforeSend: function () {
			app.dialog.preloader('Harap Tunggu');
		},
		success: function (data) {
			app.dialog.close();
			jQuery("#bayar_pembayaran").val('');
			$$('#popup-pembayaran-td-kategori').html(kategori_acc);
			$$('#popup-pembayaran-td-keterangan').html(keterangan_acc);
			$$('#popup-pembayaran-bank').html(bank);
			$$(".bank_pembayaran").val(bank);
			$$('#popup-pembayaran-penjualan_jumlah_pembayaran').html(number_format(data.pembelian_jumlah_pembayaran) + ' ,-');


			var history_pembayaran_multiple = "";
			var no = 1;
			var total_jumlah_pembayaran = 0;
			jQuery.each(data.pembayaran_data, function (i, val) {
				var no = i++;
				pembayaran_1 = number_format(val.pembayaran_1).replace(/\,/g, '');
				pembayaran_2 = number_format(val.pembayaran_2).replace(/\,/g, '');
				pembayaran_3 = number_format(val.pembayaran_3).replace(/\,/g, '');
				pembayaran_4 = number_format(val.pembayaran_4).replace(/\,/g, '');
				pembayaran_5 = number_format(val.pembayaran_5).replace(/\,/g, '');
				pembayaran_6 = number_format(val.pembayaran_6).replace(/\,/g, '');
				pembayaran_7 = number_format(val.pembayaran_7).replace(/\,/g, '');
				pembayaran_8 = number_format(val.pembayaran_8).replace(/\,/g, '');
				pembayaran_9 = number_format(val.pembayaran_9).replace(/\,/g, '');
				pembayaran_10 = number_format(val.pembayaran_10).replace(/\,/g, '');

				total_jumlah_pembayaran = parseInt(pembayaran_1) + parseInt(pembayaran_2) + parseInt(pembayaran_3) + parseInt(pembayaran_4) + parseInt(pembayaran_5) + parseInt(pembayaran_6) + parseInt(pembayaran_7) + parseInt(pembayaran_8) + parseInt(pembayaran_9) + parseInt(pembayaran_10);


				var penjualan_qty = val.qty;
				var penjualan_harga = val.price;
				var total_operasional = val.nominal_acc;
				var type_tr = null;

				if (parseInt(total_operasional) <= parseInt(total_jumlah_pembayaran)) {
					var background_multiple = "#133788";
					var status_lunas = "lunas";
				} else {
					var background_multiple = "";
					var status_lunas = "belum_lunas";
				}


				history_pembayaran_multiple += '<table  align="center" width="100%" border="0" style="border-collapse: collapse; border:1px solid white;">';
				history_pembayaran_multiple += '<tr style="background-color:' + background_multiple + '">';
				history_pembayaran_multiple += '<td width="50%" style="border-collapse: collapse; border:1px solid white;" class="numeric-cell text-align-center">';
				history_pembayaran_multiple += 'Terbayar : <br>' + number_format(total_jumlah_pembayaran) + '';
				history_pembayaran_multiple += '<input type="hidden" id="status_lunas_' + i + '" value="' + status_lunas + '" name="status_lunas_' + i + '"  /><input type="hidden"  id="total_harus_bayar_' + val.pembayaran_operasional_id + '" value="' + total_operasional + '" name="total_harus_bayar_' + val.pembayaran_operasional_id + '"  /><input type="hidden" id="sudah_bayar_' + val.pembayaran_operasional_id + '" value="' + total_jumlah_pembayaran + '" name="sudah_bayar_' + val.pembayaran_operasional_id + '"  />';
				history_pembayaran_multiple += '</td>';
				history_pembayaran_multiple += '<td width="50%" style="border-collapse: collapse; border:1px solid white;"';
				history_pembayaran_multiple += ' class="numeric-cell text-align-center">Sisa : <br>' + number_format((total_operasional - total_jumlah_pembayaran)) + '';
				history_pembayaran_multiple += '</td>';
				history_pembayaran_multiple += ' </tr>';
				history_pembayaran_multiple += ' </table>';


				history_pembayaran_multiple += ' <div style="overflow-x:auto; width:100%;">';
				history_pembayaran_multiple += '<table  align="center" width="700px" border="0" style="border-collapse: collapse; border:1px solid white;">';
				history_pembayaran_multiple += '<tr class="bg-dark-gray-medium">';
				history_pembayaran_multiple += '<td width="10%" style="border-collapse: collapse; border:1px solid white;" colspan="2"';
				history_pembayaran_multiple += ' class="numeric-cell text-align-center">Bayar';
				history_pembayaran_multiple += '</td>';
				history_pembayaran_multiple += '<td width="16%" style="border-collapse: collapse; border:1px solid white;"';
				history_pembayaran_multiple += ' class="numeric-cell text-align-center">Tanggal</td>';
				history_pembayaran_multiple += '<td width="17%" style="border-collapse: collapse; border:1px solid white;"';
				history_pembayaran_multiple += '  class="numeric-cell text-align-center">Bank</td>';
				history_pembayaran_multiple += '<td width="17%" style="border-collapse: collapse; border:1px solid white;"';
				history_pembayaran_multiple += ' class="numeric-cell text-align-center">Jumlah</td>';
				history_pembayaran_multiple += '<td width="25%" style="border-collapse: collapse; border:1px solid white;"';
				history_pembayaran_multiple += ' class="numeric-cell text-align-center">Keterangan</td>';
				history_pembayaran_multiple += '<td width="15%" style="border-collapse: collapse; border:1px solid white;"';
				history_pembayaran_multiple += ' class="numeric-cell text-align-center">Opsi</td>';

				history_pembayaran_multiple += '  </tr>';
				history_pembayaran_multiple += '<tbody id="table_num_' + i + '">';
				if (val.pembayaran_1 != null && val.pembayaran_1 != 0) {
					history_pembayaran_multiple += '<tr style="background-color:' + background_multiple + '">';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;" colspan="2"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-left">Bayar 1';
					history_pembayaran_multiple += '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-left">' + moment(val.pembayaran1_tgl).format('DD-MMM-YYYY') + '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += '  class="numeric-cell text-align-left">' + val.bank_1 + '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += ' class="total_jumlah_pembayaran_' + i + ' numeric-cell text-align-right">' + number_format(val.pembayaran_1) + '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					if (val.keterangan_1 != null) {
						history_pembayaran_multiple += ' class="numeric-cell text-align-left">' + val.keterangan_1 + '</td>';
					} else {
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">-</td>';
					}
					if (val.foto_1 != null) {
						history_pembayaran_multiple += '<td class="numeric-cell text-align-center"><button data-popup=".upload-foto-pembayaran" onclick="uploadFotoPembayaran(\'foto_1\',\'' + val.pembayaran_operasional_id + '\',\'' + val.foto_1 + '\')" class="popup-open text-add-colour-black-soft  card-color-blue button-small col button text-bold" style="color:white;">Foto</button></td>';
					} else {
						history_pembayaran_multiple += '<td class="numeric-cell text-align-center"><button data-popup=".upload-foto-pembayaran" onclick="uploadFotoPembayaran(\'foto_1\',\'' + val.pembayaran_operasional_id + '\',\'' + val.foto_1 + '\')" class="popup-open text-add-colour-black-soft button-small col button text-bold bg-dark-gray-young">Foto</button></td>';
					}

					history_pembayaran_multiple += ' </tr>';
				} else {
					history_pembayaran_multiple += '<form id="pembayaran_form_multiple_1_' + val.pembayaran_operasional_id + '"><tr>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;" colspan="2"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-left">Bayar 1';
					history_pembayaran_multiple += '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-left"><input  style="width:105px;text-align:center;"  id="tanggal_1_' + val.pembayaran_operasional_id + '" name="tanggal_1_' + val.pembayaran_operasional_id + '"  type="date" value="' + moment().format('YYYY-MM-DD') + '" class="date-multiple-penbayaran" readonly></td>';

					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;" class="numeric-cell text-align-center">';
					history_pembayaran_multiple += '<select style="width:60%; background-color:#1c1c1d;" class="hide_bank performa-input input-item-bank" id="bank_1_' + val.pembayaran_operasional_id + '" name="bank_1_' + val.pembayaran_operasional_id + '" >';
					history_pembayaran_multiple += '<option value="" selected>BANK</option>';
					history_pembayaran_multiple += '<option value="BCA">BCA</option>';
					history_pembayaran_multiple += '<option value="MANDIRI">MANDIRI</option>';
					history_pembayaran_multiple += '<option value="TUNAI">TUNAI</option>';
					history_pembayaran_multiple += ' </select>';
					history_pembayaran_multiple += ' </td>';

					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" class="input-pembayaran-multiple" id="pembayaran_1_' + val.pembayaran_operasional_id + '" name="pembayaran_1_' + val.pembayaran_operasional_id + '"  type="text" ></td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="keterangan_1_' + val.pembayaran_operasional_id + '" name="keterangan_1_' + val.pembayaran_operasional_id + '"  type="text"></td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-center"><label class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold" for="foto_bukti_1_' + val.pembayaran_operasional_id + '" >FOTO</label><input style="display: none" style="width:100%;" id="foto_bukti_1_' + val.pembayaran_operasional_id + '" name="foto_bukti_1_' + val.pembayaran_operasional_id + '"  type="file" onchange="prosesPembayaranMultiple(' + val.pembayaran_operasional_id + ',1);" ></td>';
					// history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';

					//	if (val.foto_1 != null) {
					//		var button_upload_foto = ' <button data-popup=".upload-foto-pembayaran" onclick="uploadFotoPembayaran(\'foto_1\',\'' + val.pembayaran_operasional_id + '\')" class="popup-open text-add-colour-black-soft  card-color-blue button-small col button text-bold" style="color:white;">Foto</button></td>';
					//	} else {
					//		var button_upload_foto = ' <button data-popup=".upload-foto-pembayaran" onclick="uploadFotoPembayaran(\'foto_1\',\'' + val.pembayaran_operasional_id + '\')" class="popup-open text-add-colour-black-soft button-small col button text-bold bg-dark-gray-young">Foto</button></td>';
					//	}
					// history_pembayaran_multiple += ' class="numeric-cell text-align-center"><button class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold" onclick="prosesPembayaranMultiple(' + val.pembayaran_operasional_id + ',1);">Save</button></td>';
					history_pembayaran_multiple += ' </tr></form>';
				}

				if (val.pembayaran_2 != null && val.pembayaran_2 != 0) {
					history_pembayaran_multiple += '<tr style="background-color:' + background_multiple + '">';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;" colspan="2"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-left">Bayar 2';
					history_pembayaran_multiple += '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-left">' + moment(val.pembayaran2_tgl).format('DD-MMM-YYYY') + '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += '  class="numeric-cell text-align-left">' + val.bank_2 + '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-right">' + number_format(val.pembayaran_2) + '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					if (val.keterangan_2 != null) {
						history_pembayaran_multiple += ' class="numeric-cell text-align-left">' + val.keterangan_2 + '</td>';
					} else {
						history_pembayaran_multiple += ' class="numeric-cell text-align-center"></td>';
					}

					if (val.foto_2 != null) {
						history_pembayaran_multiple += '<td class="numeric-cell text-align-center"><button data-popup=".upload-foto-pembayaran" onclick="uploadFotoPembayaran(\'foto_2\',\'' + val.pembayaran_operasional_id + '\',\'' + val.foto_2 + '\')" class="popup-open text-add-colour-black-soft  card-color-blue button-small col button text-bold" style="color:white;">Foto</button></td>';
					} else {
						history_pembayaran_multiple += '<td class="numeric-cell text-align-center"><button data-popup=".upload-foto-pembayaran" onclick="uploadFotoPembayaran(\'foto_2\',\'' + val.pembayaran_operasional_id + '\',\'' + val.foto_2 + '\')" class="popup-open text-add-colour-black-soft button-small col button text-bold bg-dark-gray-young">Foto</button></td>';
					}

					history_pembayaran_multiple += ' </tr>';
				} else {
					if (val.pembayaran_1 != null && val.pembayaran_1 != 0) {
						if (status_lunas != "lunas") {

							history_pembayaran_multiple += '<form id="pembayaran_form_multiple_2_' + val.pembayaran_operasional_id + '"><tr>';
							history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;" colspan="2"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-left">Bayar 2';
							history_pembayaran_multiple += '</td>';
							history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-left"><input   style="width:105px;" id="tanggal_2_' + val.pembayaran_operasional_id + '" name="tanggal_2_' + val.pembayaran_operasional_id + '"  type="date" class="date-multiple-penbayaran" value="' + moment().format('YYYY-MM-DD') + '"  readonly/></td>';

							history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;" class="numeric-cell text-align-center">';
							history_pembayaran_multiple += '<select style="width:60%; background-color:#1c1c1d;" class="hide_bank performa-input input-item-bank" id="bank_2_' + val.pembayaran_operasional_id + '" name="bank_2_' + val.pembayaran_operasional_id + '" required validate>';
							history_pembayaran_multiple += '<option value="" selected>BANK</option>';
							history_pembayaran_multiple += '<option value="BCA">BCA</option>';
							history_pembayaran_multiple += '<option value="MANDIRI">MANDIRI</option>';
							history_pembayaran_multiple += '<option value="TUNAI">TUNAI</option>';
							history_pembayaran_multiple += ' </select>';
							history_pembayaran_multiple += ' </td>';

							history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="pembayaran_2_' + val.pembayaran_operasional_id + '" class="input-pembayaran-multiple" name="pembayaran_2_' + val.pembayaran_operasional_id + '"  type="text"/></td>';
							history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="keterangan_2_' + val.pembayaran_operasional_id + '" name="keterangan_2_' + val.pembayaran_operasional_id + '"  type="text" /></td>';
							history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><label class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold" for="foto_bukti_2_' + val.pembayaran_operasional_id + '" >FOTO</label><input style="display: none" style="width:100%;" id="foto_bukti_2_' + val.pembayaran_operasional_id + '" name="foto_bukti_2_' + val.pembayaran_operasional_id + '"  type="file" onchange="prosesPembayaranMultiple(' + val.pembayaran_operasional_id + ',2);"></td>';
							// history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';

							// history_pembayaran_multiple += ' class="numeric-cell text-align-center"><button class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold" onclick="prosesPembayaranMultiple(' + val.pembayaran_operasional_id + ',2);">Save</button></td>';
							history_pembayaran_multiple += ' </tr></form>';
						}
					}
				}

				if (val.pembayaran_3 != null && val.pembayaran_3 != 0) {
					history_pembayaran_multiple += '<tr style="background-color:' + background_multiple + '">';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;" colspan="2"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-left">Bayar 3';
					history_pembayaran_multiple += '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-left">' + moment(val.pembayaran3_tgl).format('DD-MMM-YYYY') + '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += '  class="numeric-cell text-align-left">' + val.bank_3 + '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-right">' + number_format(val.pembayaran_3) + '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					if (val.keterangan_3 != null) {
						history_pembayaran_multiple += ' class="numeric-cell text-align-left">' + val.keterangan_3 + '</td>';
					} else {
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">-</td>';
					}
					if (val.foto_3 != null) {
						history_pembayaran_multiple += '<td class="numeric-cell text-align-center"><button data-popup=".upload-foto-pembayaran" onclick="uploadFotoPembayaran(\'foto_3\',\'' + val.pembayaran_operasional_id + '\',\'' + val.foto_3 + '\')" class="popup-open text-add-colour-black-soft  card-color-blue button-small col button text-bold" style="color:white;">Foto</button></td>';
					} else {
						history_pembayaran_multiple += '<td class="numeric-cell text-align-center"><button data-popup=".upload-foto-pembayaran" onclick="uploadFotoPembayaran(\'foto_3\',\'' + val.pembayaran_operasional_id + '\',\'' + val.foto_3 + '\')" class="popup-open text-add-colour-black-soft button-small col button text-bold bg-dark-gray-young">Foto</button></td>';
					}

					history_pembayaran_multiple += ' </tr>';
				} else {
					if (val.pembayaran_2 != null && val.pembayaran_2 != 0) {
						if (status_lunas != "lunas") {
							history_pembayaran_multiple += '<form id="pembayaran_form_multiple_3_' + val.pembayaran_operasional_id + '"><tr>';
							history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;" colspan="2"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-left">Bayar 3';
							history_pembayaran_multiple += '</td>';
							history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-left"><input  style="width:105px;" id="tanggal_3_' + val.pembayaran_operasional_id + '" name="tanggal_3_' + val.pembayaran_operasional_id + '"  type="date" class="date-multiple-penbayaran" value="' + moment().format('YYYY-MM-DD') + '"  readonly/></td>';

							history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;" class="numeric-cell text-align-center">';
							history_pembayaran_multiple += '<select style="width:60%; background-color:#1c1c1d;" class="hide_bank performa-input input-item-bank" id="bank_3_' + val.pembayaran_operasional_id + '" name="bank_3_' + val.pembayaran_operasional_id + '" required validate>';
							history_pembayaran_multiple += '<option value="" selected>BANK</option>';
							history_pembayaran_multiple += '<option value="BCA">BCA</option>';
							history_pembayaran_multiple += '<option value="MANDIRI">MANDIRI</option>';
							history_pembayaran_multiple += '<option value="TUNAI">TUNAI</option>';
							history_pembayaran_multiple += ' </select>';
							history_pembayaran_multiple += ' </td>';

							history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="pembayaran_3_' + val.pembayaran_operasional_id + '" class="input-pembayaran-multiple" name="pembayaran_3_' + val.pembayaran_operasional_id + '"  type="text" /></td>';
							history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="keterangan_3_' + val.pembayaran_operasional_id + '" name="keterangan_3_' + val.pembayaran_operasional_id + '"  type="text" /></td>';
							history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><label class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold" for="foto_bukti_3_' + val.pembayaran_operasional_id + '" >FOTO</label><input style="display: none" style="width:100%;" id="foto_bukti_3_' + val.pembayaran_operasional_id + '" name="foto_bukti_3_' + val.pembayaran_operasional_id + '"  type="file" onchange="prosesPembayaranMultiple(' + val.pembayaran_operasional_id + ',3);"></td>';
							// history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
							// history_pembayaran_multiple += ' class="numeric-cell text-align-center"><button class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold" onclick="prosesPembayaranMultiple(' + val.pembayaran_operasional_id + ',3);">Save</button></td>';
							history_pembayaran_multiple += ' </tr></form>';
						}
					}
				}


				if (val.pembayaran_4 != null && val.pembayaran_4 != 0) {
					history_pembayaran_multiple += '<tr style="background-color:' + background_multiple + '">';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;" colspan="2"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-left">Bayar 4';
					history_pembayaran_multiple += '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-left">' + moment(val.pembayaran4_tgl).format('DD-MMM-YYYY') + '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += '  class="numeric-cell text-align-left">' + val.bank_4 + '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-right">' + number_format(val.pembayaran_4) + '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					if (val.keterangan_4 != null) {
						history_pembayaran_multiple += ' class="numeric-cell text-align-left">' + val.keterangan_4 + '</td>';
					} else {
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">-</td>';
					}
					if (val.foto_4 != null) {
						history_pembayaran_multiple += '<td  class="numeric-cell text-align-center"><button data-popup=".upload-foto-pembayaran" onclick="uploadFotoPembayaran(\'foto_4\',\'' + val.pembayaran_operasional_id + '\',\'' + val.foto_4 + '\')" class="popup-open text-add-colour-black-soft  card-color-blue button-small col button text-bold" style="color:white;">Foto</button></td>';
					} else {
						history_pembayaran_multiple += '<td  class="numeric-cell text-align-center"><button data-popup=".upload-foto-pembayaran" onclick="uploadFotoPembayaran(\'foto_4\',\'' + val.pembayaran_operasional_id + '\',\'' + val.foto_4 + '\')" class="popup-open text-add-colour-black-soft button-small col button text-bold bg-dark-gray-young">Foto</button></td>';
					}

					history_pembayaran_multiple += ' </tr>';
				} else {
					if (val.pembayaran_3 != null && val.pembayaran_3 != 0) {
						if (status_lunas != "lunas") {
							history_pembayaran_multiple += '<form id="pembayaran_form_multiple_4_' + val.pembayaran_operasional_id + '"><tr>';
							history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;" colspan="2"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-left">Bayar 4';
							history_pembayaran_multiple += '</td>';
							history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-left"><input  style="width:105px;" id="tanggal_4_' + val.pembayaran_operasional_id + '" name="tanggal_4_' + val.pembayaran_operasional_id + '"  type="date" class="date-multiple-penbayaran" value="' + moment().format('YYYY-MM-DD') + '"  readonly /></td>';

							history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;" class="numeric-cell text-align-center">';
							history_pembayaran_multiple += '<select style="width:60%; background-color:#1c1c1d;" class="hide_bank performa-input input-item-bank" id="bank_4_' + val.pembayaran_operasional_id + '" name="bank_4_' + val.pembayaran_operasional_id + '" required validate>';
							history_pembayaran_multiple += '<option value="" selected>BANK</option>';
							history_pembayaran_multiple += '<option value="BCA">BCA</option>';
							history_pembayaran_multiple += '<option value="MANDIRI">MANDIRI</option>';
							history_pembayaran_multiple += '<option value="TUNAI">TUNAI</option>';
							history_pembayaran_multiple += ' </select>';
							history_pembayaran_multiple += ' </td>';

							history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="pembayaran_4_' + val.pembayaran_operasional_id + '" class="input-pembayaran-multiple" name="pembayaran_4_' + val.pembayaran_operasional_id + '"  type="text"/></td>';
							history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="keterangan_4_' + val.pembayaran_operasional_id + '" name="keterangan_4_' + val.pembayaran_operasional_id + '"  type="text" /></td>';
							history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><label class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold" for="foto_bukti_4_' + val.pembayaran_operasional_id + '" >FOTO</label><input style="display: none" style="width:100%;" id="foto_bukti_4_' + val.pembayaran_operasional_id + '" name="foto_bukti_4_' + val.pembayaran_operasional_id + '"  type="file" onchange="prosesPembayaranMultiple(' + val.pembayaran_operasional_id + ',4);"></td>';
							// history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
							// history_pembayaran_multiple += ' class="numeric-cell text-align-center"><button class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold" onclick="prosesPembayaranMultiple(' + val.pembayaran_operasional_id + ',4);">Save</button></td>';
							history_pembayaran_multiple += ' </tr></form>';
						}
					}
				}
				if (val.pembayaran_5 != null && val.pembayaran_5 != 0) {
					history_pembayaran_multiple += '<tr style="background-color:' + background_multiple + '">';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;" colspan="2"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-left">Bayar 5';
					history_pembayaran_multiple += '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-left">' + moment(val.pembayaran5_tgl).format('DD-MMM-YYYY') + '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += '  class="numeric-cell text-align-left">' + val.bank_5 + '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-right">' + number_format(val.pembayaran_5) + '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';

					if (val.keterangan_5 != null) {
						history_pembayaran_multiple += ' class="numeric-cell text-align-left">' + val.keterangan_5 + '</td>';
					} else {
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">-</td>';
					}
					if (val.foto_5 != null) {
						history_pembayaran_multiple += '<td class="numeric-cell text-align-center"><button data-popup=".upload-foto-pembayaran" onclick="uploadFotoPembayaran(\'foto_5\',\'' + val.pembayaran_operasional_id + '\',\'' + val.foto_5 + '\')" class="popup-open text-add-colour-black-soft  card-color-blue button-small col button text-bold" style="color:white;">Foto</button></td>';
					} else {
						history_pembayaran_multiple += '<td class="numeric-cell text-align-center"><button data-popup=".upload-foto-pembayaran" onclick="uploadFotoPembayaran(\'foto_5\',\'' + val.pembayaran_operasional_id + '\',\'' + val.foto_5 + '\')" class="popup-open text-add-colour-black-soft button-small col button text-bold bg-dark-gray-young">Foto</button></td>';
					}

					history_pembayaran_multiple += ' </tr>';
				} else {
					if (val.pembayaran_4 != null && val.pembayaran_4 != 0) {
						if (status_lunas != "lunas") {
							history_pembayaran_multiple += '<form id="pembayaran_form_multiple_5_' + val.pembayaran_operasional_id + '"><tr>';
							history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;" colspan="2"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-left">Bayar 5';
							history_pembayaran_multiple += '</td>';
							history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-left"><input  style="width:105px;" id="tanggal_5_' + val.pembayaran_operasional_id + '" name="tanggal_5_' + val.pembayaran_operasional_id + '"  type="date" class="date-multiple-penbayaran" value="' + moment().format('YYYY-MM-DD') + '"  readonly/></td>';

							history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;" class="numeric-cell text-align-center">';
							history_pembayaran_multiple += '<select style="width:60%; background-color:#1c1c1d;" class="hide_bank performa-input input-item-bank" id="bank_5_' + val.pembayaran_operasional_id + '" name="bank_5_' + val.pembayaran_operasional_id + '" required validate>';
							history_pembayaran_multiple += '<option value="" selected>BANK</option>';
							history_pembayaran_multiple += '<option value="BCA">BCA</option>';
							history_pembayaran_multiple += '<option value="MANDIRI">MANDIRI</option>';
							history_pembayaran_multiple += '<option value="TUNAI">TUNAI</option>';
							history_pembayaran_multiple += ' </select>';
							history_pembayaran_multiple += ' </td>';

							history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="pembayaran_5_' + val.pembayaran_operasional_id + '" class="input-pembayaran-multiple" name="pembayaran_5_' + val.pembayaran_operasional_id + '"  type="text"/></td>';
							history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="keterangan_5_' + val.pembayaran_operasional_id + '" name="keterangan_5_' + val.pembayaran_operasional_id + '"  type="text" /></td>';
							history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
							history_pembayaran_multiple += ' class="numeric-cell text-align-center"><label class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold" for="foto_bukti_5_' + val.pembayaran_operasional_id + '" >FOTO</label><input style="display: none" style="width:100%;" id="foto_bukti_5_' + val.pembayaran_operasional_id + '" name="foto_bukti_5_' + val.pembayaran_operasional_id + '"  type="file" onchange="prosesPembayaranMultiple(' + val.pembayaran_operasional_id + ',5);"></td>';
							// history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
							// history_pembayaran_multiple += ' class="numeric-cell text-align-center"><button class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold" onclick="prosesPembayaranMultiple(' + val.pembayaran_operasional_id + ',5);">Save</button></td>';

							history_pembayaran_multiple += ' </tr></form>';
						}
					}
				}


				if (val.pembayaran_6 != null && val.pembayaran_6 != 0) {
					history_pembayaran_multiple += '<tr style="background-color:' + background_multiple + '">';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;" colspan="2"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-left">Bayar 6';
					history_pembayaran_multiple += '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-left">' + moment(val.pembayaran6_tgl).format('DD-MMM-YYYY') + '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += '  class="numeric-cell text-align-left">' + val.bank_6 + '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-right">' + number_format(val.pembayaran_6) + '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					if (val.keterangan_6 != null) {
						history_pembayaran_multiple += ' class="numeric-cell text-align-left">' + val.keterangan_6 + '</td>';
					} else {
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">-</td>';
					}
					if (val.foto_6 != null) {
						history_pembayaran_multiple += '<td class="numeric-cell text-align-center"><button data-popup=".upload-foto-pembayaran" onclick="uploadFotoPembayaran(\'foto_6\',\'' + val.pembayaran_operasional_id + '\',\'' + val.foto_6 + '\')" class="popup-open text-add-colour-black-soft  card-color-blue button-small col button text-bold" style="color:white;">Foto</button></td>';
					} else {
						history_pembayaran_multiple += '<td class="numeric-cell text-align-center"><button data-popup=".upload-foto-pembayaran" onclick="uploadFotoPembayaran(\'foto_6\',\'' + val.pembayaran_operasional_id + '\',\'' + val.foto_6 + '\')" class="popup-open text-add-colour-black-soft button-small col button text-bold bg-dark-gray-young">Foto</button></td>';
					}

					history_pembayaran_multiple += ' </tr>';
				} else {
					if (val.pembayaran_5 != null && val.pembayaran_5 != 0) {
						history_pembayaran_multiple += '<form id="pembayaran_form_multiple_6_' + val.pembayaran_operasional_id + '"><tr>';
						history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;" colspan="2"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-left">Bayar 6';
						history_pembayaran_multiple += '</td>';
						history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-left"><input  style="width:105px;" id="tanggal_6_' + val.pembayaran_operasional_id + '" name="tanggal_6_' + val.pembayaran_operasional_id + '"  type="date" class="date-multiple-penbayaran" value="' + moment().format('YYYY-MM-DD') + '"  readonly/></td>';

						history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;" class="numeric-cell text-align-center">';
						history_pembayaran_multiple += '<select style="width:60%; background-color:#1c1c1d;" class="hide_bank performa-input input-item-bank" id="bank_6_' + val.pembayaran_operasional_id + '" name="bank_6_' + val.pembayaran_operasional_id + '" required validate>';
						history_pembayaran_multiple += '<option value="" selected>BANK</option>';
						history_pembayaran_multiple += '<option value="BCA">BCA</option>';
						history_pembayaran_multiple += '<option value="MANDIRI">MANDIRI</option>';
						history_pembayaran_multiple += '<option value="TUNAI">TUNAI</option>';
						history_pembayaran_multiple += ' </select>';
						history_pembayaran_multiple += ' </td>';

						history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="pembayaran_6_' + val.pembayaran_operasional_id + '" class="input-pembayaran-multiple" name="pembayaran_6_' + val.pembayaran_operasional_id + '"  type="text" /></td>';
						history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="keterangan_6_' + val.pembayaran_operasional_id + '" name="keterangan_6_' + val.pembayaran_operasional_id + '"  type="text" /></td>';
						history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center"><label class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold" for="foto_bukti_6_' + val.pembayaran_operasional_id + '" >FOTO</label><input style="display: none" style="width:100%;" id="foto_bukti_6_' + val.pembayaran_operasional_id + '" name="foto_bukti_6_' + val.pembayaran_operasional_id + '"  type="file" onchange="prosesPembayaranMultiple(' + val.pembayaran_operasional_id + ',6);"></td>';
						// history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
						// history_pembayaran_multiple += ' class="numeric-cell text-align-center"><button class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold" onclick="prosesPembayaranMultiple(' + val.pembayaran_operasional_id + ',6);">Save</button></td>';
						history_pembayaran_multiple += ' </tr></form>';
					}
				}

				if (val.pembayaran_7 != null && val.pembayaran_7 != 0) {
					history_pembayaran_multiple += '<tr style="background-color:' + background_multiple + '">';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;" colspan="2"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-left">Bayar 7';
					history_pembayaran_multiple += '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-left">' + moment(val.pembayaran7_tgl).format('DD-MMM-YYYY') + '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += '  class="numeric-cell text-align-left">' + val.bank_7 + '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-right">' + number_format(val.pembayaran_7) + '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					if (val.keterangan_7 != null) {
						history_pembayaran_multiple += 'class="numeric-cell text-align-left">' + val.keterangan_7 + '</td>';
					} else {
						history_pembayaran_multiple += 'class="numeric-cell text-align-center">-</td>';
					}

					if (val.foto_7 != null) {
						history_pembayaran_multiple += '<td class="numeric-cell text-align-center"><button data-popup=".upload-foto-pembayaran" onclick="uploadFotoPembayaran(\'foto_7\',\'' + val.pembayaran_operasional_id + '\',\'' + val.foto_7 + '\')" class="popup-open text-add-colour-black-soft  card-color-blue button-small col button text-bold" style="color:white;">Foto</button></td>';
					} else {
						history_pembayaran_multiple += '<td class="numeric-cell text-align-center"><button data-popup=".upload-foto-pembayaran" onclick="uploadFotoPembayaran(\'foto_7\',\'' + val.pembayaran_operasional_id + '\',\'' + val.foto_7 + '\')" class="popup-open text-add-colour-black-soft button-small col button text-bold bg-dark-gray-young">Foto</button></td>';
					}

					history_pembayaran_multiple += ' </tr>';
				} else {
					if (val.pembayaran_6 != null && val.pembayaran_6 != 0) {
						history_pembayaran_multiple += '<form id="pembayaran_form_multiple_7_' + val.pembayaran_operasional_id + '"><tr>';
						history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;" colspan="2"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-left">Bayar 7';
						history_pembayaran_multiple += '</td>';
						history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-left"><input  style="width:105px;" id="tanggal_7_' + val.pembayaran_operasional_id + '" name="tanggal_7_' + val.pembayaran_operasional_id + '"  type="date" class="date-multiple-penbayaran" value="' + moment().format('YYYY-MM-DD') + '"  readonly/></td>';

						history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;" class="numeric-cell text-align-center">';
						history_pembayaran_multiple += '<select style="width:60%; background-color:#1c1c1d;" class="hide_bank performa-input input-item-bank" id="bank_7_' + val.pembayaran_operasional_id + '" name="bank_7_' + val.pembayaran_operasional_id + '" required validate>';
						history_pembayaran_multiple += '<option value="" selected>BANK</option>';
						history_pembayaran_multiple += '<option value="BCA">BCA</option>';
						history_pembayaran_multiple += '<option value="MANDIRI">MANDIRI</option>';
						history_pembayaran_multiple += '<option value="TUNAI">TUNAI</option>';
						history_pembayaran_multiple += ' </select>';
						history_pembayaran_multiple += ' </td>';

						history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="pembayaran_7_' + val.pembayaran_operasional_id + '" class="input-pembayaran-multiple" name="pembayaran_7_' + val.pembayaran_operasional_id + '"  type="text"/></td>';
						history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="keterangan_7_' + val.pembayaran_operasional_id + '" name="keterangan_7_' + val.pembayaran_operasional_id + '"  type="text" /></td>';
						history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center"><label class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold" for="foto_bukti_7_' + val.pembayaran_operasional_id + '" >FOTO</label><input style="display: none" style="width:100%;" id="foto_bukti_7_' + val.pembayaran_operasional_id + '" name="foto_bukti_7_' + val.pembayaran_operasional_id + '"  type="file" onchange="prosesPembayaranMultiple(' + val.pembayaran_operasional_id + ',7);"></td>';
						// history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
						// history_pembayaran_multiple += ' class="numeric-cell text-align-center"><button class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold" onclick="prosesPembayaranMultiple(' + val.pembayaran_operasional_id + ',7);">Save</button></td>';
						history_pembayaran_multiple += ' </tr></form>';
					}
				}


				if (val.pembayaran_8 != null && val.pembayaran_8 != 0) {
					history_pembayaran_multiple += '<tr style="background-color:' + background_multiple + '">';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;" colspan="2"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-left">Bayar 8';
					history_pembayaran_multiple += '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-left">' + moment(val.pembayaran8_tgl).format('DD-MMM-YYYY') + '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += '  class="numeric-cell text-align-left">' + val.bank_8 + '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-right">' + number_format(val.pembayaran_8) + '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';

					if (val.keterangan_8 != null) {
						history_pembayaran_multiple += ' class="numeric-cell text-align-left">' + val.keterangan_8 + '</td>';
					} else {
						history_pembayaran_multiple += ' class="numeric-cell text-align-center">-</td>';
					}
					if (val.foto_8 != null) {
						history_pembayaran_multiple += '<td class="numeric-cell text-align-center"><button data-popup=".upload-foto-pembayaran" onclick="uploadFotoPembayaran(\'foto_8\',\'' + val.pembayaran_operasional_id + '\',\'' + val.foto_8 + '\')" class="popup-open text-add-colour-black-soft  card-color-blue button-small col button text-bold" style="color:white;">Foto</button></td>';
					} else {
						history_pembayaran_multiple += '<td class="numeric-cell text-align-center"><button data-popup=".upload-foto-pembayaran" onclick="uploadFotoPembayaran(\'foto_8\',\'' + val.pembayaran_operasional_id + '\',\'' + val.foto_8 + '\')" class="popup-open text-add-colour-black-soft button-small col button text-bold bg-dark-gray-young">Foto</button></td>';
					}

					history_pembayaran_multiple += ' </tr>';
				} else {
					if (val.pembayaran_7 != null && val.pembayaran_7 != 0) {
						history_pembayaran_multiple += '<form id="pembayaran_form_multiple_8_' + val.pembayaran_operasional_id + '"><tr>';
						history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;" colspan="2"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-left">Bayar 8';
						history_pembayaran_multiple += '</td>';
						history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-left"><input  style="width:105px;" id="tanggal_8_' + val.pembayaran_operasional_id + '" name="tanggal_8_' + val.pembayaran_operasional_id + '"  type="date" class="date-multiple-penbayaran" value="' + moment().format('YYYY-MM-DD') + '"  readonly/></td>';

						history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;" class="numeric-cell text-align-center">';
						history_pembayaran_multiple += '<select style="width:60%; background-color:#1c1c1d;" class="hide_bank performa-input input-item-bank" id="bank_8_' + val.pembayaran_operasional_id + '" name="bank_8_' + val.pembayaran_operasional_id + '" required validate>';
						history_pembayaran_multiple += '<option value="" selected>BANK</option>';
						history_pembayaran_multiple += '<option value="BCA">BCA</option>';
						history_pembayaran_multiple += '<option value="MANDIRI">MANDIRI</option>';
						history_pembayaran_multiple += '<option value="TUNAI">TUNAI</option>';
						history_pembayaran_multiple += ' </select>';
						history_pembayaran_multiple += ' </td>';

						history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="pembayaran_8_' + val.pembayaran_operasional_id + '" class="input-pembayaran-multiple" name="pembayaran_8_' + val.pembayaran_operasional_id + '"  type="text" /></td>';
						history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="keterangan_8_' + val.pembayaran_operasional_id + '" name="keterangan_8_' + val.pembayaran_operasional_id + '"  type="text" /></td>';
						history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center"><label class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold" for="foto_bukti_8_' + val.pembayaran_operasional_id + '" >FOTO</label><input style="display: none" style="width:100%;" id="foto_bukti_8_' + val.pembayaran_operasional_id + '" name="foto_bukti_8_' + val.pembayaran_operasional_id + '"  type="file" onchange="prosesPembayaranMultiple(' + val.pembayaran_operasional_id + ',8;" ></td>';
						// history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
						// history_pembayaran_multiple += ' class="numeric-cell text-align-center"><button class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold" onclick="prosesPembayaranMultiple(' + val.pembayaran_operasional_id + ',8);">Save</button></td>';
						history_pembayaran_multiple += ' </tr></form>';
					}
				}

				if (val.pembayaran_9 != null && val.pembayaran_9 != 0) {
					history_pembayaran_multiple += '<tr style="background-color:' + background_multiple + '">';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;" colspan="2"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-left">Bayar 9';
					history_pembayaran_multiple += '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-left">' + moment(val.pembayaran9_tgl).format('DD-MMM-YYYY') + '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += '  class="numeric-cell text-align-left">' + val.bank_9 + '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-right">' + number_format(val.pembayaran_9) + '</td>';
				} else {
					if (val.pembayaran_8 != null && val.pembayaran_8 != 0) {
						history_pembayaran_multiple += '<form id="pembayaran_form_multiple_9_' + val.pembayaran_operasional_id + '"><tr>';
						history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;" colspan="2"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-left">Bayar 9';
						history_pembayaran_multiple += '</td>';
						history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-left"><input  style="width:105px;" id="tanggal_9_' + val.pembayaran_operasional_id + '" name="tanggal_9_' + val.pembayaran_operasional_id + '"  type="date" class="date-multiple-penbayaran" value="' + moment().format('YYYY-MM-DD') + '"  readonly/></td>';

						history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;" class="numeric-cell text-align-center">';
						history_pembayaran_multiple += '<select style="width:60%; background-color:#1c1c1d;" class="hide_bank performa-input input-item-bank" id="bank_9_' + val.pembayaran_operasional_id + '" name="bank_9_' + val.pembayaran_operasional_id + '" required validate>';
						history_pembayaran_multiple += '<option value="" selected>BANK</option>';
						history_pembayaran_multiple += '<option value="BCA">BCA</option>';
						history_pembayaran_multiple += '<option value="MANDIRI">MANDIRI</option>';
						history_pembayaran_multiple += '<option value="TUNAI">TUNAI</option>';
						history_pembayaran_multiple += ' </select>';
						history_pembayaran_multiple += ' </td>';

						history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="pembayaran_9_' + val.pembayaran_operasional_id + '" class="input-pembayaran-multiple" name="pembayaran_9_' + val.pembayaran_operasional_id + '"  type="text" /></td>';
						history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="keterangan_9_' + val.pembayaran_operasional_id + '" name="keterangan_9_' + val.pembayaran_operasional_id + '"  type="text" /></td>';
						history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center"><label class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold" for="foto_bukti_9_' + val.pembayaran_operasional_id + '" >FOTO</label><input style="display: none" style="width:100%;" id="foto_bukti_9_' + val.pembayaran_operasional_id + '" name="foto_bukti_9_' + val.pembayaran_operasional_id + '"  type="file" onchange="prosesPembayaranMultiple(' + val.pembayaran_operasional_id + ',9);"></td>';
						// history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
						// history_pembayaran_multiple += ' class="numeric-cell text-align-center"><button class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold" onclick="prosesPembayaranMultiple(' + val.pembayaran_operasional_id + ',9);">Save</button></td>';
						history_pembayaran_multiple += ' </tr></form>';
					}
				}

				if (val.pembayaran_10 != null && val.pembayaran_10 != 0) {
					history_pembayaran_multiple += '<tr style="background-color:' + background_multiple + '">';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;" colspan="2"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-left">Bayar 10';
					history_pembayaran_multiple += '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-left">' + moment(val.pembayaran10_tgl).format('DD-MMM-YYYY') + '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += '  class="numeric-cell text-align-left">' + val.bank_10 + '</td>';
					history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
					history_pembayaran_multiple += ' class="numeric-cell text-align-right">' + number_format(val.pembayaran_10) + '</td>';
					history_pembayaran_multiple += ' </tr>';
				} else {
					if (val.pembayaran_9 != null && val.pembayaran_9 != 0) {
						history_pembayaran_multiple += '<form id="pembayaran_form_multiple_10_' + val.pembayaran_operasional_id + '"><tr>';
						history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;" colspan="2"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-left">Bayar 10';
						history_pembayaran_multiple += '</td>';
						history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-left"><input  style="width:105px;" id="tanggal_10_' + val.pembayaran_operasional_id + '" name="tanggal_10_' + val.pembayaran_operasional_id + '"  type="date" class="date-multiple-penbayaran" value="' + moment().format('YYYY-MM-DD') + '"  readonly/></td>';

						history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;" class="numeric-cell text-align-center">';
						history_pembayaran_multiple += '<select style="width:60%; background-color:#1c1c1d;" class="hide_bank performa-input input-item-bank" id="bank_10_' + val.pembayaran_operasional_id + '" name="bank_10_' + val.pembayaran_operasional_id + '" required validate>';
						history_pembayaran_multiple += '<option value="" selected>BANK</option>';
						history_pembayaran_multiple += '<option value="BCA">BCA</option>';
						history_pembayaran_multiple += '<option value="MANDIRI">MANDIRI</option>';
						history_pembayaran_multiple += '<option value="TUNAI">TUNAI</option>';
						history_pembayaran_multiple += ' </select>';
						history_pembayaran_multiple += ' </td>';

						history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="pembayaran_10_' + val.pembayaran_operasional_id + '" class="input-pembayaran-multiple" name="pembayaran_10_' + val.pembayaran_operasional_id + '"  type="text" /></td>';
						history_pembayaran_multiple += '<td colspan="2" style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center"><input style="width:100%;" id="keterangan_10_' + val.pembayaran_operasional_id + '" name="keterangan_10_' + val.pembayaran_operasional_id + '"  type="text" /></td>';
						history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
						history_pembayaran_multiple += ' class="numeric-cell text-align-center"><label class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold" for="foto_bukti_10_' + val.pembayaran_operasional_id + '" >FOTO</label><input style="display: none" style="width:100%;" id="foto_bukti_10_' + val.pembayaran_operasional_id + '" name="foto_bukti_10_' + val.pembayaran_operasional_id + '"  type="file" onchange="prosesPembayaranMultiple(' + val.pembayaran_operasional_id + ',10);"></td>';
						// history_pembayaran_multiple += '<td style="border-collapse: collapse; border:1px solid white;"';
						// history_pembayaran_multiple += ' class="numeric-cell text-align-center"><button class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold" onclick="prosesPembayaranMultiple(' + val.pembayaran_operasional_id + ',10);">Save</button></td>';
						history_pembayaran_multiple += ' </tr></form>';
					}
				}
				history_pembayaran_multiple += '<tbody>';
				history_pembayaran_multiple += '</table>';
				history_pembayaran_multiple += '</div><br>';
			});

			$$('#popup-pembayaran-penjualan_grandtotal').html(number_format((parseInt(data.penjualan_grandtotal))) + ' ,-');
			$$('#popup-pembayaran-penjualan_kekurangan').html(number_format((parseInt(data.penjualan_grandtotal)) - data.pembelian_jumlah_pembayaran) + ' ,-');

			if (((data.penjualan_grandtotal) - data.pembelian_jumlah_pembayaran) <= 0) {
				$$('#popup-pembayaran-penjualan_status_pembayaran').html('<b>Lunas</b>');
				$$('#popup-pembayaran-penjualan_status_pembayaran').removeClass('card-color-green').removeClass('card-color-blue').addClass('card-color-blue');
			} else {
				$$('#popup-pembayaran-penjualan_status_pembayaran').html('<b>Belum Lunas</b>');
				$$('#popup-pembayaran-penjualan_status_pembayaran').removeClass('card-color-green').removeClass('card-color-blue').addClass('card-color-green');


			}

			jQuery('#history_pembayaran_multiple').html(history_pembayaran_multiple);
			jQuery('#table_num_1').show()
			jQuery('#table_num_2').show()
			jQuery('#table_num_3').show()
			jQuery('#table_num_4').show()
			jQuery('#table_num_5').show()
			jQuery('#table_num_6').show()
			jQuery('#table_num_7').show()
			jQuery('#table_num_8').show()
			jQuery('#table_num_9').show()
			jQuery('#table_num_10').show()
			console.log(jQuery('#status_lunas_2').val());




			var today = moment().format('YYYY-MM-DD');
			document.getElementsByClassName("date-multiple-penbayaran")[0].setAttribute('min', today);
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});


	$$('#tanggal_pembayaran_choose').html(moment(tanggal_pembelian).format('DD-MMM-YYYY'));

	if (number_format(pembayaran_1) != 0) {
		$$('#content_bayar2').show();
		$$('#pembayaran_1_dp_awal').val(number_format(pembayaran_1));
		$$('#popup-pembayaran-tgl1').html(moment(pembayaran1_tgl).format('DD-MMM-YYYY'));
		$$('#pembayaran_1_dp_awal').attr('readonly', true);
		$$('#pembayaran_1_dp_awal').prop("onclick", null).off("click");
		$$('#bank_1').val(bank);

	} else {
		$$('#pembayaran_1_dp_awal').val(number_format(0));
		$$('#content_bayar2').hide();
		$$('#popup-pembayaran-tgl1').html("");
		$$('#pembayaran_1_dp_awal').removeAttr("readonly");
		$$('#pembayaran_1_dp_awal').attr('onClick', 'emptyValue("pembayaran_1")');
		$$('#bank_1').val(bank);
	}
	if (number_format(pembayaran_2) != 0) {
		$$('#content_bayar3').show();
		$$('#pembayaran_2').val(number_format(pembayaran_2));
		$$('#popup-pembayaran-tgl2').html(moment(pembayaran2_tgl).format('DD-MMM-YYYY'));
		$$('#pembayaran_2').attr('readonly', true);
		$$('#pembayaran_2').prop("onclick", null).off("click");
		$$('#bank_2').val(bank_2);

	} else {
		$$('#pembayaran_2').val(number_format(0));
		$$('#content_bayar3').hide();
		$$('#popup-pembayaran-tgl2').html("");
		$$('#pembayaran_2').removeAttr("readonly");
		$$('#pembayaran_2').attr('onClick', 'emptyValue("pembayaran_2")');
		$$('#bank_2').val(bank);
	}

	if (number_format(pembayaran_3) != 0) {
		$$('#pembayaran_3').val(number_format(pembayaran_3));
		$$('#popup-pembayaran-tgl3').html(moment(pembayaran3_tgl).format('DD-MMM-YYYY'));
		$$('#pembayaran_3').attr('readonly', true);
		$$('#content_bayar4').show();
		$$('#pembayaran_3').prop("onclick", null).off("click");
		$$('#bank_3').val(bank_3);
	} else {
		$$('#pembayaran_3').val(number_format(0));
		$$('#content_bayar4').hide();
		$$('#popup-pembayaran-tgl3').html("");
		$$('#pembayaran_3').removeAttr("readonly");
		$$('#pembayaran_3').attr('onClick', 'emptyValue("pembayaran_3")');
		$$('#bank_3').val(bank);
	}
	if (number_format(pembayaran_4) != 0) {
		$$('#pembayaran_4').val(number_format(pembayaran_4));
		$$('#popup-pembayaran-tgl4').html(moment(pembayaran4_tgl).format('DD-MMM-YYYY'));
		$$('#pembayaran_4').attr('readonly', true);
		$$('#content_bayar5').show();
		$$('#pembayaran_4').prop("onclick", null).off("click");
		$$('#bank_4').val(bank_4);
	} else {
		$$('#pembayaran_4').val(number_format(0));
		$$('#content_bayar5').hide();
		$$('#popup-pembayaran-tgl4').html("");
		$$('#pembayaran_4').removeAttr("readonly");
		$$('#pembayaran_4').attr('onClick', 'emptyValue("pembayaran_4")');
		$$('#bank_4').val(bank);
	}
	if (number_format(pembayaran_5) != 0) {
		$$('#pembayaran_5').val(number_format(pembayaran_5));
		$$('#pembayaran_5').attr('readonly', true);
		$$('#popup-pembayaran-tgl5').html(moment(pembayaran5_tgl).format('DD-MMM-YYYY'));
		$$('#content_bayar6').show();
		$$('#pembayaran_5').prop("onclick", null).off("click");
		$$('#bank_5').val(bank_5);
	} else {
		$$('#pembayaran_5').val(number_format(0));
		$$('#content_bayar6').hide();
		$$('#popup-pembayaran-tgl5').html("");
		$$('#pembayaran_5').removeAttr("readonly");
		$$('#pembayaran_5').attr('onClick', 'emptyValue("pembayaran_5")');
		$$('#bank_5').val(bank);
	}
	if (number_format(pembayaran_6) != 0) {
		$$('#pembayaran_6').val(number_format(pembayaran_6));
		$$('#pembayaran_6').attr('readonly', true);
		$$('#popup-pembayaran-tgl6').html(moment(pembayaran6_tgl).format('DD-MMM-YYYY'));
		$$('#content_bayar7').show();
		$$('#pembayaran_6').prop("onclick", null).off("click");
		$$('#bank_6').val(bank_6);
	} else {
		$$('#pembayaran_6').val(number_format(0));
		$$('#content_bayar7').hide();
		$$('#popup-pembayaran-tgl6').html("");
		$$('#pembayaran_6').removeAttr("readonly");
		$$('#pembayaran_6').attr('onClick', 'emptyValue("pembayaran_6")');
		$$('#bank_6').val(bank);
	}
	if (number_format(pembayaran_7) != 0) {
		$$('#pembayaran_7').val(number_format(pembayaran_7));
		$$('#pembayaran_7').attr('readonly', true);
		$$('#popup-pembayaran-tgl7').html(moment(pembayaran7_tgl).format('DD-MMM-YYYY'));
		$$('#content_bayar8').show();
		$$('#pembayaran_7').prop("onclick", null).off("click");
		$$('#bank_7').val(bank_7);
	} else {
		$$('#pembayaran_7').val(number_format(0));
		$$('#content_bayar8').hide();
		$$('#popup-pembayaran-tgl7').html("");
		$$('#pembayaran_7').removeAttr("readonly");
		$$('#pembayaran_7').attr('onClick', 'emptyValue("pembayaran_7")');
		$$('#bank_7').val(bank);
	}
	if (number_format(pembayaran_8) != 0) {
		$$('#pembayaran_8').val(number_format(pembayaran_8));
		$$('#pembayaran_8').attr('readonly', true);
		$$('#popup-pembayaran-tgl8').html(moment(pembayaran8_tgl).format('DD-MMM-YYYY'));
		$$('#content_bayar9').show();
		$$('#pembayaran_8').prop("onclick", null).off("click");
		$$('#bank_8').val(bank_8);
	} else {
		$$('#pembayaran_8').val(number_format(0));
		$$('#content_bayar9').hide();
		$$('#popup-pembayaran-tgl8').html("");
		$$('#pembayaran_8').removeAttr("readonly");
		$$('#pembayaran_8').attr('onClick', 'emptyValue("pembayaran_8")');
		$$('#bank_8').val(bank);
	}
	if (number_format(pembayaran_9) != 0) {
		$$('#pembayaran_9').val(number_format(pembayaran_9));
		$$('#pembayaran_9').attr('readonly', true);
		$$('#popup-pembayaran-tgl9').html(moment(pembayaran9_tgl).format('DD-MMM-YYYY'));
		$$('#content_bayar10').show();
		$$('#pembayaran_9').prop("onclick", null).off("click");
		$$('#bank_9').val(bank_9);
	} else {
		$$('#pembayaran_9').val(number_format(0));
		$$('#content_bayar10').hide();
		$$('#popup-pembayaran-tgl9').html("");
		$$('#pembayaran_9').removeAttr("readonly");
		$$('#pembayaran_9').attr('onClick', 'emptyValue("pembayaran_9")');
		$$('#bank_9').val(bank);
	}
	if (number_format(pembayaran_10) != 0) {
		$$('#pembayaran_10').val(number_format(pembayaran_10));
		$$('#pembayaran_10').prop("onclick", null).off("click");
		$$('#pembayaran_10').attr('readonly', true);
		$$('#popup-pembayaran-tgl10').html(moment(pembayaran10_tgl).format('DD-MMM-YYYY'));
	} else {
		$$('#pembayaran_10').val(number_format(0));
		$$('#popup-pembayaran-tgl10').html("");
		$$('#pembayaran_10').removeAttr("readonly");
		$$('#pembayaran_10').attr('onClick', 'emptyValue("pembayaran_10")');
	}

	$$('#pembayaran-penjualan_id').val(pembelian_header_id);
	// $$('#pembayaran-client_id').val(supplier_id);
	setTimeout(function () {
		if (localStorage.getItem("username") != 'Stn') {
			$$('.hide_bank option[value="Tunai"]').remove();
		}
	}, 1000);
}

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