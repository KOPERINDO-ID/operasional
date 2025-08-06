function dateRangeDeclarationDataNeraca() {
	calendarRangePenjualan = app.calendar.create({
		inputEl: '#range-neraca',
		rangePicker: true,
		dateFormat: 'dd-mm-yyyy',
		closeOnSelect: true,
		rangePickerMinDays: 1,
		on: {
			close: function () {
				getDataJurnal();
			}
		}
	});
}


//Config Get Image From Camera
function setOptionsTerimaJurnal(srcType) {
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

function getFileEntryTerimaJurnal(imgUri) {
	window.resolveLocalFileSystemURL(imgUri, function success(fileEntry) {

		// Do something with the FileEntry object, like write to it, upload it, etc.
		// writeFile(fileEntry, imgUri);
		alert("got file: " + fileEntry.nativeURL);
		// displayFileData(fileEntry.nativeURL, "Native URL");

	}, function () {
		// If don't get the FileEntry (which may happen when testing
		// on some emulators), copy to a new FileEntry.
		createNewFileEntryTerimaJurnal(imgUri);
	});
}

function createNewFileEntryTerimaJurnal(imgUri) {
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


function getFileContentAsBase64TerimaJurnal(path, callback) {
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

var delayTimer;
function doSearchByJurnal(text) {
	clearTimeout(delayTimer);
	delayTimer = setTimeout(function () {
		getDataJurnal();
	}, 1000);
}

function resetDataJurnal(reset) {
	if (reset == 1) {
		jQuery('#range-neraca').val('')
		jQuery('#filter_kas_neraca').val(localStorage.getItem("primary_kas"))
		jQuery('#filter_kategori_neraca').val('')
		getDataJurnal()
	}
}

function getDataJurnal() {
	// if (jQuery('#range-neraca').val() == '' || jQuery('#range-neraca').val() == null) {
	// 	const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
	// 	const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');
	// 	var startdate = startOfMonth;
	// 	var enddate = endOfMonth;
	// } else {
	// 	var startdate_new = new Date(calendarRangePenjualan.value[0]);
	// 	var enddate_new = new Date(calendarRangePenjualan.value[1]);
	// 	var startdate = moment(startdate_new).format('YYYY-MM-DD');
	// 	var enddate = moment(enddate_new).format('YYYY-MM-DD');
	// }

	var year_now = new Date().getFullYear();
	if (jQuery('#operasional_years option:selected').val() == null) {
		var year = year_now;
	} else if (jQuery('#operasional_years option:selected').val() == 'all') {
		var year = 'empty';
	} else {
		var year = jQuery('#operasional_years option:selected').val();
	}

	var month_now = new Date().getMonth() + 1;
	if (jQuery('#operasional_bulan option:selected').val() == null) {
		var month = month_now;
	} else if (jQuery('#operasional_bulan option:selected').val() == 'all') {
		var month = 'empty';
	} else {
		var month = jQuery('#operasional_bulan option:selected').val();
	}

	var kas = '';
	if (jQuery('#filter_kas_neraca').val() == '' || jQuery('#filter_kas_neraca').val() == null) {
		kas = localStorage.getItem("primary_kas");
	} else {
		kas = jQuery('#filter_kas_neraca').val();
	}

	var keterangan = '';
	if (jQuery('#filter_kategori_neraca').val() == '' || jQuery('#filter_kategori_neraca').val() == null) {
		keterangan = 'empty';
	} else {
		keterangan = jQuery('#filter_kategori_neraca').val();
	}

	if (localStorage.getItem("user_id") == 262) {
		$('#show_hide_opsi').show();
	} else if (localStorage.getItem("user_id") == 260) {
		$('#show_hide_opsi').show();
	} else {
		$('#show_hide_opsi').hide();
	}

	if (jQuery('#operasional_bulan').val() == null && jQuery('#operasional_years').val() == null) {
		$("#periode-neraca").html(moment().format('MMMM-YYYY'));
	} else {
		$("#periode-neraca").html($("#operasional_bulan option:selected").text() + ' ' + $("#operasional_years option:selected").text());
	}

	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-jurnal-acc",
		dataType: 'JSON',
		data: {
			user_id: localStorage.getItem("user_id"),
			kas: kas,
			keterangan: keterangan,
			month: month,
			year: year,
			// startdate: startdate,
			// enddate: enddate,
			lokasi_pabrik: localStorage.getItem("lokasi_pabrik"),
		},
		beforeSend: function () {
		},
		success: function (data) {
			var data_tools = '';

			if (data.data.length != 0) {
				var no = 0;
				var nominal_debet = 0;
				var nominal_kredit = 0;
				jQuery.each(data.data, function (i, val) {
					no++

					if (val.type_acc == 'Debet') {
						nominal_debet += parseFloat(val.nominal_acc);
					} else {
						if (val.type_pembayaran == 'cicilan') {
							nominal_kredit += parseFloat(val.operasional_jumlah_pembayaran);
						} else {
							nominal_kredit += parseFloat(val.nominal_acc);
						}
					}

					if (val.valid_spy == 1) {
						var btn_valid = 'btn-color-blueWhite';
					} else if (val.valid_spy == 2) {
						var btn_valid = 'card-color-red';
					} else {
						var btn_valid = 'text-add-colour-black-soft bg-dark-gray-young';
					}

					console.log('Nominal Debet = ' + nominal_debet);
					console.log('Nominal Kredit = ' + nominal_kredit);
					data_tools += '<tr>';
					data_tools += '     <td align="center" style="border-left: 1px solid grey;border-bottom: 1px solid grey;"  class="label-cell"  >' + no + '</td>';
					data_tools += '     <td align="center" style="border-left: 1px solid grey;border-bottom: 1px solid grey;"  class="label-cell"  >' + moment(val.tanggal_transaksi).format('DD-MMM-YYYY') + '</td>';
					data_tools += '     <td align="left" style="border-left: 1px solid grey;border-bottom: 1px solid grey;"  class="label-cell"  >' + val.kategori_acc + '</td>';

					if (val.type_pembayaran == 'cicilan') {
						var nominal_acc = val.operasional_jumlah_pembayaran;
					} else {
						var nominal_acc = val.nominal_acc;
					}
					data_tools += '     <td align="left" style="border-left: 1px solid grey;border-bottom: 1px solid grey;"  class="label-cell"  >' + val.keterangan + '</td>';

					if (val.type_acc == 'Debet') {
						data_tools += '     <td align="right" style="border-left: 1px solid grey;border-bottom: 1px solid grey;"  class="label-cell"  >' + number_format(nominal_acc) + '</td>';
						data_tools += '     <td align="right" style="border-left: 1px solid grey;border-bottom: 1px solid grey;border-right: 1px solid grey;"  class="label-cell"  ></td>';
					} else {
						data_tools += '     <td align="right" style="border-left: 1px solid grey;border-bottom: 1px solid grey;"  class="label-cell"  ></td>';
						data_tools += '     <td align="right" style="border-left: 1px solid grey;border-bottom: 1px solid grey;border-right: 1px solid grey;"  class="label-cell"  >' + number_format(nominal_acc) + '</td>';
					}
					if (localStorage.getItem("user_id") == 262) {
						data_tools += '		<td style="border-right: 1px solid grey;border-bottom: 1px solid grey;text-align:center">';
						data_tools += '			<a onclick="getEditTransaksiJurnalAcc(\'' + val.id_transaksi_acc + '\',\'' + val.id_perusahaan_acc + '\')" class="text-add-colour-black-soft bg-dark-gray-young button-small col button popup-open text-bold" data-popup=".edit-transaksi-jurnal">Edit</a>';
						data_tools += '		</td>';
						data_tools += '		<td style="border-right: 1px solid grey;border-bottom: 1px solid grey;text-align:center">';
						data_tools += '			<a onclick="getEditKasAcc(\'' + val.id_transaksi_acc + '\',\'' + val.id_tr_kas_acc + '\')" class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold popup-open" data-popup=".edit-kas-jurnal">Kas</a>';
						data_tools += '		</td>';
						data_tools += '		<td style="border-right: 1px solid grey;border-bottom: 1px solid grey;text-align:center">';
						data_tools += '			<a onclick="deleteJurnalTransaksiAcc(\'' + val.id_transaksi_acc + '\',\'' + val.kategori_acc + '\')" class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold">Delete</a>';
						data_tools += '		</td>';
					} else if (localStorage.getItem("user_id") == 260) {
						data_tools += '		<td style="border-right: 1px solid grey;border-bottom: 1px solid grey;text-align:center">';
						data_tools += '			<a onclick="getEditTransaksiJurnalAcc(\'' + val.id_transaksi_acc + '\',\'' + val.id_perusahaan_acc + '\')" class="' + btn_valid + ' button-small col button popup-open text-bold" data-popup=".edit-transaksi-jurnal">Detail</a>';
						data_tools += '		</td>';
					} else if (localStorage.getItem("user_id") == 261) {
						data_tools += '		<td style="border-right: 1px solid grey;border-bottom: 1px solid grey;text-align:center">';
						data_tools += '			<a onclick="getDetailTransaksiJurnalAcc(\'' + val.id_transaksi_acc + '\',\'' + val.id_perusahaan_acc + '\')" class="text-add-colour-black-soft bg-dark-gray-young button-small col button popup-open text-bold" data-popup=".detail-transaksi-jurnal">Detail</a>';
						data_tools += '		</td>';
					}
					data_tools += '</tr>';
				});
				// if (localStorage.getItem("user_id") != 262) {
				// 	jQuery("#hide_total_jurnal").show();
				// 	jQuery("#total-jurnal").html(number_format(parseFloat(nominal_debet) - parseFloat(nominal_kredit)));
				// } else {
				// 	jQuery("#hide_total_jurnal").hide();
				// }


				jQuery("#hide_total_jurnal").show();
				jQuery("#total-jurnal").html(number_format(parseFloat(nominal_debet) - parseFloat(nominal_kredit)));

				jQuery("#data_jurnal_accounting").html(data_tools);
			} else {
				jQuery("#total-jurnal").html(number_format(0));
				jQuery("#data_jurnal_accounting").html('<tr><td colspan="5" align="center">Tidak Ada Data</td></tr>');
			}
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}


function getDetailTransaksiJurnalAcc(id_transaksi_acc, id_perusahaan_acc) {
	jQuery.ajax({
		type: "POST", //pake post jangan  get rawan di hack
		url: "" + BASE_API + "/get-detail-transaksi-acc",
		dataType: 'JSON',
		timeout: 10000,
		data: {
			id_transaksi_acc: id_transaksi_acc
		},
		beforeSend: function () {
			jQuery('#clear_detail_transaksi_jurnal').html('');
			gambarAccJurnal(1, 'detail');
			jQuery('#file_bukti_terima_detail_jurnal_view_now').attr('src', 'https://tasindo-sale-webservice.digiseminar.id/noimage.jpg');
		},
		success: function (data) {

			if (data.data.id_perusahaan_acc != null) {
				jQuery('.detail_expedisi_jurnal').show();
				$('.detail_uraian_transaksi_jurnal').hide();
			} else {
				jQuery('.detail_expedisi_jurnal').hide();
				jQuery('.detail_uraian_transaksi_jurnal').show();
			}

			$('.detail_expedisi_att_jurnal').prop('readonly', true)
			$('.detail_uraian_att_jurnal').prop('readonly', true)
			$('.detail_nominal_att_jurnal').prop('readonly', true)
			$('.detail_kategori_att_jurnal').prop('readonly', true)
			$('#smart_select_detail_kategori_jurnal').addClass('disabled');
			$('#smart_select_detail_perusahaan_jurnal').addClass('disabled');
			comboKategoriDetailJurnal(data.data.id_kategori_acc, 'detail');
			comboPerusahaanDetailJurnal(data.data.id_perusahaan_acc), 'detail';
			$$('.item_after_detail_kategori_jurnal').html(data.data.kategori_acc);
			$$('.item_after_detail_perusahaan_jurnal').html(data.data.perusahaan_acc);
			$('.item_after_detail_kategori_jurnal').css("color", "white");
			$('.item_after_detail_perusahaan_jurnal').css("color", "white");
			jQuery("#detail_pic_jurnal").val(data.data.perusahaan_pic);
			jQuery("#detail_plat_jurnal").val(data.data.perusahaan_no_plat);
			jQuery("#detail_nohp_jurnal").val(data.data.perusahaan_no_hp);
			jQuery("#detail_expedisi_keterangan_jurnal").val(data.data.perusahaan_uraian);
			jQuery("#detail_keterangan_jurnal").val(data.data.keterangan);
			jQuery("#detail_nominal_jurnal").val(number_format(data.data.nominal_acc));
			jQuery("#detail_id_transaksi_acc_jurnal").val(number_format(data.data.id_transaksi_acc));
			jQuery("#detail_pembayaran_jurnal").val(data.data.type_pembayaran);
			if (data.data.bukti_foto_acc != 'null') {
				jQuery('#file_bukti_terima_detail_jurnal_view_now').attr('src', BASE_PATH_IMAGE_FOTO_ACCOUNTING + '/' + data.data.bukti_foto_acc);
			} else {
				jQuery('#file_bukti_terima_detail_jurnal_view_now').attr('src', 'https://tasindo-sale-webservice.digiseminar.id/noimage.jpg');
			}
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});

}

function downloadJurnalAcc() {
	var data_tools = '';

	// if (jQuery('#range-neraca').val() == '' || jQuery('#range-neraca').val() == null) {
	// 	const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
	// 	const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');
	// 	var startdate = startOfMonth;
	// 	var enddate = endOfMonth;
	// } else {
	// 	var startdate_new = new Date(calendarRangePenjualan.value[0]);
	// 	var enddate_new = new Date(calendarRangePenjualan.value[1]);
	// 	var startdate = moment(startdate_new).format('YYYY-MM-DD');
	// 	var enddate = moment(enddate_new).format('YYYY-MM-DD');
	// }

	var year_now = new Date().getFullYear();
	if (jQuery('#operasional_years option:selected').val() == null) {
		var year = year_now;
	} else if (jQuery('#operasional_years option:selected').val() == 'all') {
		var year = 'empty';
	} else {
		var year = jQuery('#operasional_years option:selected').val();
	}

	var month_now = new Date().getMonth() + 1;
	if (jQuery('#operasional_bulan option:selected').val() == null) {
		var month = month_now;
	} else if (jQuery('#operasional_bulan option:selected').val() == 'all') {
		var month = 'empty';
	} else {
		var month = jQuery('#operasional_bulan option:selected').val();
	}

	var kas = '';
	if (jQuery('#filter_kas_neraca').val() == '' || jQuery('#filter_kas_neraca').val() == null) {
		kas = localStorage.getItem("primary_kas");
	} else {
		kas = jQuery('#filter_kas_neraca').val();
	}
	var keterangan = '';
	if (jQuery('#filter_kategori_neraca').val() == '' || jQuery('#filter_kategori_neraca').val() == null) {
		keterangan = 'empty';
	} else {
		keterangan = jQuery('#filter_kategori_neraca').val();
	}

	if (localStorage.getItem("user_id") == 262) {
		$('#show_hide_opsi').show();
	} else if (localStorage.getItem("user_id") == 260) {
		$('#show_hide_opsi').show();
	} else {
		$('#show_hide_opsi').hide();
	}


	if (jQuery('#operasional_bulan').val() == null && jQuery('#operasional_years').val() == null) {
		$("#periode-neraca").html(moment().format('MMMM-YYYY'));
	} else {
		$("#periode-neraca").html($("#operasional_bulan option:selected").text() + ' ' + $("#operasional_years option:selected").text());
	}

	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-jurnal-acc",
		dataType: 'JSON',
		data: {
			user_id: localStorage.getItem("user_id"),
			kas: kas,
			keterangan: keterangan,
			month: month,
			year: year,
			// startdate: startdate,
			// enddate: enddate,
			lokasi_pabrik: localStorage.getItem("lokasi_pabrik"),
		},
		beforeSend: function () {
			app.dialog.preloader('Mengambil Data Jurnal');
			data_tools += '<table width="100%" border="0">';
			data_tools += '	<tr>';
			data_tools += '		<td colspan="6" align="center"><h2>Jurnal</h2></td>';
			data_tools += '	</tr>';
			data_tools += '	<tr>';
			data_tools += '		<td style="border-top: solid 1px; border-left: solid 1px;border-bottom: 1px solid grey;font-weight:bold;" align="center">No</td>';
			data_tools += '		<td style="border-top: solid 1px; border-left: solid 1px;border-bottom: 1px solid grey;font-weight:bold;" align="center">Tanggal</td>';
			data_tools += '		<td style="border-top: solid 1px; border-left: solid 1px;border-bottom: 1px solid grey;font-weight:bold;" align="center">Kategori</td>';
			data_tools += '		<td style="border-top: solid 1px; border-left: solid 1px;border-bottom: 1px solid grey;font-weight:bold;" align="center">Keterangan</td>';
			data_tools += '		<td style="border-top: solid 1px; border-left: solid 1px;border-bottom: 1px solid grey;font-weight:bold;" align="center">Debet</td>';
			data_tools += '		<td style="border-top: solid 1px; border-right: solid 1px;border-bottom: 1px solid grey;border-left: solid 1px; font-weight:bold;" align="center">Kredit</td>';
			data_tools += '	</tr>';
		},
		success: function (data) {
			app.dialog.close();

			if (data.data.length != 0) {
				var no = 0;
				var nominal_debet = 0;
				var nominal_kredit = 0;
				jQuery.each(data.data, function (i, val) {
					no++

					if (val.type_acc == 'Debet') {
						nominal_debet += parseFloat(val.nominal_acc);
					} else {
						if (val.type_pembayaran == 'cicilan') {
							nominal_kredit += parseFloat(val.operasional_jumlah_pembayaran);
						} else {
							nominal_kredit += parseFloat(val.nominal_acc);
						}
					}

					data_tools += '<tr>';
					data_tools += '     <td align="center" style="border-left: 1px solid grey;border-bottom: 1px solid grey;"  class="label-cell"  >' + no + '</td>';
					data_tools += '     <td align="center" style="border-left: 1px solid grey;border-bottom: 1px solid grey;"  class="label-cell"  >' + moment(val.tanggal_transaksi).format('DD-MMM-YYYY') + '</td>';
					data_tools += '     <td align="left" style="border-left: 1px solid grey;border-bottom: 1px solid grey;"  class="label-cell"  >' + val.kategori_acc + '</td>';

					if (val.type_pembayaran == 'cicilan') {
						var nominal_acc = val.operasional_jumlah_pembayaran;
					} else {
						var nominal_acc = val.nominal_acc;
					}
					data_tools += '     <td align="left" style="border-left: 1px solid grey;border-bottom: 1px solid grey;"  class="label-cell"  >' + val.keterangan + '</td>';

					if (val.type_acc == 'Debet') {
						data_tools += '     <td align="right" style="border-left: 1px solid grey;border-bottom: 1px solid grey;"  class="label-cell"  >' + number_format(nominal_acc) + '</td>';
						data_tools += '     <td align="right" style="border-left: 1px solid grey;border-bottom: 1px solid grey;border-right: 1px solid grey;"  class="label-cell"  ></td>';
					} else {
						data_tools += '     <td align="right" style="border-left: 1px solid grey;border-bottom: 1px solid grey;"  class="label-cell"  ></td>';
						data_tools += '     <td align="right" style="border-left: 1px solid grey;border-bottom: 1px solid grey;border-right: 1px solid grey;"  class="label-cell"  >' + number_format(nominal_acc) + '</td>';
					}
					data_tools += '</tr>';
				});

			}
			data_tools += '	<tr>';
			data_tools += '		<td colspan="4" style="border-left: 1px solid grey;border-bottom: 1px solid grey;font-weight:bold;" align="right">Total</td>';
			data_tools += '		<td style="border-left: 1px solid grey;border-right: 1px solid grey;border-bottom: 1px solid grey;font-weight:bold;" align="right">' + number_format(nominal_debet) + '</td>';
			data_tools += '		<td style="border-right: 1px solid grey;border-bottom: 1px solid grey;font-weight:bold;" align="right">' + number_format(nominal_kredit) + '</td>';
			data_tools += '	</tr>';
			data_tools += '</table>';

			let options = {
				documentSize: 'A4',
				type: 'share',
				fileName: 'jurnal_' + $('#filter_kas_neraca :selected').text() + '.pdf'
			}

			pdf.fromData(data_tools, options)
				.then((stats) => console.log('status', stats))
				.catch((err) => console.err(err))

			console.log(data_tools);
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}

function gambarAccJurnal(acc_table_id, type) {
	if (jQuery('#' + type + '_file_jurnal_acc' + acc_table_id + '').val() == '' || jQuery('#' + type + '_file_jurnal_acc' + acc_table_id + '').val() == null) {
		$$('#' + type + '_value_jurnal_acc_' + acc_table_id + '').html('File');
	} else {
		$$('#' + type + '_value_jurnal_acc_' + acc_table_id + '').html($$('#' + type + '_file_jurnal_acc' + acc_table_id + '').val().replace('fakepath', ''));
		jQuery('#button_' + type + '_jurnal_fill_camera').hide();
		$('#button_' + type + '_jurnal_fill_file').removeClass("col");
		$('#button_' + type + '_jurnal_fill_file').addClass("col-100");
	}
}


function openCameraTerimaUpdate(selection) {

	var srcType = Camera.PictureSourceType.CAMERA;
	var options = setOptionsTerimaJurnal(srcType);
	var func = createNewFileEntryTerimaJurnal;

	navigator.camera.getPicture(function cameraSuccess(imageUri) {

		// displayImage(imageUri);
		// // You may choose to copy the picture, save it somewhere, or upload.

		getFileContentAsBase64TerimaJurnal(imageUri, function (base64Image) {
			//window.open(base64Image);
			localStorage.setItem("file_foto_update_terima_jurnal", base64Image);
			changeTextFotoTerimaJurnalUpdate(imageUri);
			jQuery('#button_edit_jurnal_fill_file').hide();
			$("#button_edit_jurnal_fill_camera").removeClass("col");
			$("#button_edit_jurnal_fill_camera").addClass("col-100");
			// Then you'll be able to handle the myimage.png file as base64
		});

	}, function cameraError(error) {
		console.debug("Unable to obtain picture: " + error, "app");
		alert("Unable to obtain picture: ");

	}, options);
}

function changeTextFotoTerimaJurnalUpdate(imageUri) {
	var arr = imageUri.split('/');
	$$('#text_file_path_terima_jurnal_update').html(arr[8]);
}

function getEditTransaksiJurnalAcc(id_transaksi_acc, id_perusahaan_acc) {
	if (localStorage.getItem("user_id") == 260) {
		jQuery("#judul-popup-edit-transaksi-jurnal").html('Detail Data');
	} else {
		jQuery("#judul-popup-edit-transaksi-jurnal").html('Edit Data');
	}
	jQuery.ajax({
		type: "POST", //pake post jangan  get rawan di hack
		url: "" + BASE_API + "/get-detail-transaksi-acc",
		dataType: 'JSON',
		timeout: 10000,
		data: {
			id_transaksi_acc: id_transaksi_acc
		},
		beforeSend: function () {
			jQuery('#clear_edit_jurnal').html('');
			$('#show_keterangan_reject').hide();
			gambarAccJurnal(1, 'edit');
			jQuery('#file_bukti_edit_view_now').attr('src', 'https://tasindo-sale-webservice.digiseminar.id/noimage.jpg');
		},
		success: function (data) {

			if (localStorage.getItem("user_id") == 260) {
				if (data.data.valid_spy == 2) {
					jQuery("#show_button_update_jurnal").show();
					$('#button_edit_jurnal_fill_camera').show();
					$('#button_edit_jurnal_fill_file').show();
					$('#show_keterangan_reject').show();
					$(".clear_edit_jurnal").prop('readonly', false)
					$("#button_edit_jurnal_fill_camera").removeClass("col-100");
					$("#button_edit_jurnal_fill_file").removeClass("col-100");
					$("#button_edit_jurnal_fill_camera").addClass("col");
					$("#button_edit_jurnal_fill_file").addClass("col");
					$('#smart_select_edit_kategori_jurnal').removeClass('disabled');
					$('#smart_select_edit_perusahaan_jurnal').removeClass('disabled');
				} else {
					jQuery("#show_button_update_jurnal").hide();
					$('#show_keterangan_reject').hide();
					$('#button_edit_jurnal_fill_camera').hide();
					$('#button_edit_jurnal_fill_file').hide();
					$(".clear_edit_jurnal").prop('readonly', true)
					$('#smart_select_edit_kategori_jurnal').addClass('disabled');
					$('#smart_select_edit_perusahaan_jurnal').addClass('disabled');
				}
			} else {
				jQuery("#show_button_update_jurnal").show();
				$('#show_keterangan_reject').hide();
				$('#button_edit_jurnal_fill_camera').show();
				$('#button_edit_jurnal_fill_file').show();
				$(".clear_edit_jurnal").prop('readonly', false)
				$("#button_edit_jurnal_fill_camera").removeClass("col-100");
				$("#button_edit_jurnal_fill_file").removeClass("col-100");
				$("#button_edit_jurnal_fill_camera").addClass("col");
				$("#button_edit_jurnal_fill_file").addClass("col");
				$('#smart_select_edit_kategori_jurnal').removeClass('disabled');
				$('#smart_select_edit_perusahaan_jurnal').removeClass('disabled');

			}
			if (data.data.id_perusahaan_acc != null) {
				jQuery('.edit_expedisi_jurnal').show();
				$('.edit_uraian_transaksi_jurnal').hide();
				$('#edit_keterangan_jurnal').prop('required', false)
				$('#edit_keterangan_jurnal').prop('validate', false)
			} else {
				jQuery('.edit_expedisi_jurnal').hide();
				jQuery('.edit_uraian_transaksi_jurnal').show();
				$('.edit_expedisi_jurnal_att').prop('required', false)
				$('.edit_expedisi_jurnal_att').prop('validate', false)
				$('.edit_uraian_jurnal_att').prop('required', true)
				$('.edit_uraian_jurnal_att').prop('validate', true)
			}

			jQuery("#edit_value_jurnal_acc_1").html('File');
			jQuery("#text_file_path_terima_jurnal_update").html('Camera');

			comboKategoriDetailJurnal(data.data.id_kategori_acc, 'edit');
			comboPerusahaanDetailJurnal(data.data.id_perusahaan_acc, 'edit');
			$$('.item_after_edit_kategori_jurnal').html(data.data.kategori_acc);
			$$('.item_after_edit_perusahaan_jurnal').html(data.data.perusahaan_acc);
			jQuery("#edit_pic_jurnal").val(data.data.perusahaan_pic);
			jQuery("#edit_plat_jurnal").val(data.data.perusahaan_no_plat);
			jQuery("#edit_nohp_jurnal").val(data.data.perusahaan_no_hp);
			jQuery("#edit_expedisi_keterangan_jurnal").val(data.data.perusahaan_uraian);
			jQuery("#edit_keterangan_jurnal").val(data.data.keterangan);
			jQuery("#edit_nominal_jurnal").val(number_format(data.data.nominal_acc));
			jQuery("#edit_id_transaksi_jurnal_acc").val(number_format(data.data.id_transaksi_acc));
			jQuery("#edit_pembayaran_jurnal").val(data.data.type_pembayaran);
			jQuery("#edit_tanggal_transaksi_jurnal_acc").val(data.data.tanggal_transaksi);
			jQuery("#edit_keterangan_reject_jurnal").val(data.data.keterangan_valid);
			if (data.data.bukti_foto_acc != 'null') {
				jQuery('#file_bukti_edit_jurnal_view_now').attr('src', BASE_PATH_IMAGE_FOTO_ACCOUNTING + '/' + data.data.bukti_foto_acc);
			} else {
				jQuery('#file_bukti_edit_jurnal_view_now').attr('src', 'https://tasindo-sale-webservice.digiseminar.id/noimage.jpg');
			}
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});

}



function comboKategoriDetailJurnal(id_kategori_acc, type) {
	// start koding ajax
	jQuery.ajax({
		type: "POST", //pake post jangan  get rawan di hack
		url: "" + BASE_API + "/get-kategori-jurnal-acc",
		dataType: 'JSON',
		timeout: 10000,
		data: {
			user_id: localStorage.getItem("user_id"),
			type: type,
			kas: jQuery('#filter_kas_neraca').val(),
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
			jQuery('#' + type + '_kategori_jurnal').html(optionsValues);
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
	$$('.item_after_' + type + '_kategori_jurnal').html('Kategori');
}


function comboPerusahaanDetailJurnal(id_perusahaan_acc, type) {
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
			jQuery('#' + type + '_perusahaan_jurnal').html(optionsValues);
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
	$$('.item_after_' + type + '_perusahaan_jurnal').html('Pilih Perusahaan');
}

function comboKasFilterNeraca() {
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
			jQuery('#filter_kas_neraca').html('');
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
			jQuery('#filter_kas_neraca').html(optionsValues);
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}


function comboKasAsalJurnal(id_kas_acc, type) {
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
			jQuery('#' + type + '_kas_jurnal_asal').html('');
		},
		success: function (data) {
			var optionsValues = "";
			optionsValues += '<option value="">Kas Keluar</option>';
			jQuery.each(data.data, function (i, item) {
				if (id_kas_acc == item.id_kas_acc) {
					optionsValues += '<option value="' + item.id_kas_acc + '" selected>' + item.kas_acc + '</option>';
				} else {
					if (jQuery('#filter_kas_neraca').val() != item.id_kas_acc) {
						optionsValues += '<option value="' + item.id_kas_acc + '">' + item.kas_acc + '</option>';
					}
				}
			});
			jQuery('#' + type + '_kas_jurnal_asal').html(optionsValues);
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
	$$('.item_after_' + type + '_kas_jurnal_asal').html('Kas Keluar');
}

function colorDropKasAsalJurnal(type) {
	$('.item_after_' + type + '_kas_jurnal_asal').css("color", "white");
}

function updateTransaksiJurnal() {
	if (localStorage.getItem("internet_koneksi") == 'fail') {
		app.dialog.alert('<font style="font-size:22px; color:white; font-weight:bold;">Gagal,Internet Tidak Stabil,Box Koneksi Harus Berwarna Hijau', function () {
		});
	} else {
		if (!$$('#form_edit_jurnal_acc')[0].checkValidity()) {
			app.dialog.alert('Cek Isian Anda');
		} else {
			if (localStorage.getItem("file_foto_update_terima_jurnal") != null || jQuery('#edit_file_jurnal_acc_1').val() != '') {
				var formData = new FormData(jQuery("#form_edit_jurnal_acc")[0]);
				formData.append('user_modified', localStorage.getItem("karyawan_nama"));
				formData.append('bukti_terima', localStorage.getItem("file_foto_update_terima_jurnal"));
				formData.append('lokasi_pabrik', localStorage.getItem("lokasi_pabrik"));
				formData.append('user_id', localStorage.getItem("user_id"));
				formData.append('kas', jQuery('#filter_kas_neraca').val());

				jQuery.ajax({
					type: "POST",
					url: "" + BASE_API + "/update-transaksi-jurnal-acc",
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
							getDataJurnal()
							localStorage.removeItem('file_foto_update_terima_jurnal');
						} else if (data.status == 'failed') {
							app.popup.close();
						}
					},
					error: function (xmlhttprequest, textstatus, message) {
						app.dialog.alert('Ada kendala pada koneksi server, Silahkan Coba Kembali');
						app.popup.close();
					}

				});
			} else if (localStorage.getItem("file_foto_update_terima_jurnal") == null && jQuery('#edit_file_jurnal_acc_1').val() == '') {
				var formData = new FormData(jQuery("#form_edit_jurnal_acc")[0]);
				formData.append('user_modified', localStorage.getItem("karyawan_nama"));
				formData.append('bukti_terima', null);
				formData.append('lokasi_pabrik', localStorage.getItem("lokasi_pabrik"));
				formData.append('user_id', localStorage.getItem("user_id"));
				formData.append('kas', jQuery('#filter_kas_neraca').val());

				jQuery.ajax({
					type: "POST",
					url: "" + BASE_API + "/update-transaksi-jurnal-acc",
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
							getDataJurnal()
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

function getEditKasAcc(id_transaksi_acc, id_tr_kas_acc) {
	var id_tr_kas_acc_val = '';
	if (id_tr_kas_acc === 'undefined') {
		id_tr_kas_acc_val = null;
	} else {
		id_tr_kas_acc_val = id_tr_kas_acc;
	}
	jQuery.ajax({
		type: "POST", //pake post jangan  get rawan di hack
		url: "" + BASE_API + "/get-edit-kas-acc",
		dataType: 'JSON',
		timeout: 10000,
		data: {
			id_transaksi_acc: id_transaksi_acc,
			id_tr_kas_acc: id_tr_kas_acc_val,
		},
		beforeSend: function () {
			jQuery('#clear_edit_kas_jurnal').html('');
		},
		success: function (data) {
			comboKasAsalJurnal(data.data.id_kas_acc, 'edit');
			jQuery('#id_transaksi_acc_jurnal').val(data.data.id_transaksi_acc);
			jQuery('#id_tr_kas_acc_jurnal').val(data.data.id_tr_kas_acc);
			$$('.item_after_edit_kas_jurnal_asal').html(data.data.kas_acc);
		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});

}


function updateJurnalKas() {
	if (localStorage.getItem("internet_koneksi") == 'fail') {
		app.dialog.alert('<font style="font-size:22px; color:white; font-weight:bold;">Gagal,Internet Tidak Stabil,Box Koneksi Harus Berwarna Hijau', function () {
		});
	} else {
		if (!$$('#form_edit_kas_jurnal_acc')[0].checkValidity()) {
			app.dialog.alert('Cek Isian Anda');
		} else {
			var formData = new FormData(jQuery("#form_edit_kas_jurnal_acc")[0]);
			formData.append('user_modified', localStorage.getItem("karyawan_nama"));
			formData.append('user_id', localStorage.getItem("user_id"));
			formData.append('kas', jQuery('#filter_kas_neraca').val());

			jQuery.ajax({
				type: "POST",
				url: "" + BASE_API + "/update-kas-asal-acc",
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
					$$('.clear_edit_kas_jurnal').val('');
					if (data.status == 'success') {
						app.popup.close();
						getDataJurnal()
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

function deleteJurnalTransaksiAcc(id_transaksi_acc, kategori_acc) {
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
						getDataJurnal();
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

function getBulanOperasional() {
	var m = moment.months();
	var month_now = moment().month();
	var n = 0;
	for (var i = 0; i < 12; i++) {
		n++
		if (i == month_now) {
			$('.operasional_bulan').append($('<option  selected/>').val(n).html(m[i]));
		} else {
			$('.operasional_bulan').append($('<option />').val(n).html(m[i]));
		}
	}
}

function getYearOperasional() {
	let startYear = 2010;
	let endYear = new Date().getFullYear();
	for (i = endYear; i > startYear; i--) {
		if (i == endYear) {
			$('.operasional_years').append($('<option  selected/>').val(i).html(i));
		} else {
			$('.operasional_years').append($('<option />').val(i).html(i));
		}
	}
}