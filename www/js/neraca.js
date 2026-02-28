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
			// internetCheckQueue.check();
		},
		success: function (data) {
			var data_tools = '';

			if (data.data.length != 0) {
				var no = 0;
				var nominal_debet = 0;
				var nominal_kredit = 0;
				var nominal_admin_acc = 0;
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

					nominal_admin_acc += parseFloat(val.admin_acc);

					if (val.valid_spy == 1) {
						var btn_valid = 'btn-color-blueWhite';
					} else if (val.valid_spy == 2) {
						var btn_valid = 'card-color-red';
					} else {
						var btn_valid = 'text-add-colour-black-soft bg-dark-gray-young';
					}

					console.log('Nominal Debet = ' + nominal_debet);
					console.log('Nominal Kredit = ' + nominal_kredit);
					console.log('Nominal Admin = ' + nominal_admin_acc);
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
						data_tools += '     <td align="right" style="border-left: 1px solid grey;border-bottom: 1px solid grey;"  class="label-cell"  >' + number_format(parseFloat(nominal_acc) + parseFloat(val.admin_acc)) + '</td>';
						data_tools += '     <td align="right" style="border-left: 1px solid grey;border-bottom: 1px solid grey;border-right: 1px solid grey;"  class="label-cell"  ></td>';
					} else {
						data_tools += '     <td align="right" style="border-left: 1px solid grey;border-bottom: 1px solid grey;"  class="label-cell"  ></td>';
						data_tools += '     <td align="right" style="border-left: 1px solid grey;border-bottom: 1px solid grey;border-right: 1px solid grey;"  class="label-cell"  >' + number_format(parseFloat(nominal_acc) +  + parseFloat(val.admin_acc)) + '</td>';
					}
					if (localStorage.getItem("user_id") == 262) {
						data_tools += '		<td style="border-right: 1px solid grey;border-bottom: 1px solid grey;text-align:center">';
						data_tools += '			<a onclick="getEditTransaksiJurnalAcc(' + val.id_transaksi_acc + ',\'' + val.id_perusahaan_acc + '\')" class="text-add-colour-black-soft bg-dark-gray-young button-small col button popup-open text-bold" data-popup=".edit-transaksi-jurnal">Edit</a>';
						data_tools += '		</td>';
						data_tools += '		<td style="border-right: 1px solid grey;border-bottom: 1px solid grey;text-align:center">';
						data_tools += '			<a onclick="getEditKasAcc(' + val.id_transaksi_acc + ',\'' + val.id_tr_kas_acc + '\')" class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold popup-open" data-popup=".edit-kas-jurnal">Kas</a>';
						data_tools += '		</td>';
						data_tools += '		<td style="border-right: 1px solid grey;border-bottom: 1px solid grey;text-align:center">';
						data_tools += '			<a onclick="deleteJurnalTransaksiAcc(' + val.id_transaksi_acc + ',\'' + val.kategori_acc + '\')" class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold">Delete</a>';
						data_tools += '		</td>';
					} else if (localStorage.getItem("user_id") == 260) {
						data_tools += '		<td style="border-right: 1px solid grey;border-bottom: 1px solid grey;text-align:center">';
						data_tools += '			<a onclick="getDetailTransaksiJurnalAcc(' + val.id_transaksi_acc + ',\'' + val.id_perusahaan_acc + '\')" class="text-add-colour-black-soft bg-dark-gray-young button-small col button popup-open text-bold" data-popup=".detail-transaksi-jurnal">Detail</a>';
						data_tools += '		</td>';
					} else if (localStorage.getItem("user_id") == 261) {
						data_tools += '		<td style="border-right: 1px solid grey;border-bottom: 1px solid grey;text-align:center">';
						data_tools += '			<a onclick="getDetailTransaksiJurnalAcc(' + val.id_transaksi_acc + ',\'' + val.id_perusahaan_acc + '\')" class="text-add-colour-black-soft bg-dark-gray-young button-small col button popup-open text-bold" data-popup=".detail-transaksi-jurnal">Detail</a>';
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
				jQuery("#total-jurnal").html(number_format(parseFloat(nominal_debet) - parseFloat(nominal_kredit) - parseFloat(nominal_admin_acc)));

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
			internetCheckQueue.check();
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
			jQuery("#detail_expedisi_pengirim_jurnal").val(data.data.perusahaan_pengirim);
			jQuery("#detail_expedisi_penerima_jurnal").val(data.data.perusahaan_penerima);
			jQuery("#detail_expedisi_dari_jurnal").val(data.data.perusahaan_dari);
			jQuery("#detail_expedisi_tujuan_jurnal").val(data.data.perusahaan_tujuan);
			jQuery("#detail_alamat_jurnal").val(data.data.perusahaan_alamat);
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
			internetCheckQueue.check();
			app.dialog.preloader('Mengambil data jurnal...');
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
	// pola ID yang benar sesuai HTML: `${type}_file_jurnal_acc_${acc_table_id}`
	const fileInputId = '#' + type + '_file_jurnal_acc_' + acc_table_id;
	const labelId = '#' + type + '_value_jurnal_acc_' + acc_table_id;

	const val = jQuery(fileInputId).val();

	if (!val) {
		$$(labelId).html('File');
		// kembalikan ke 2 kolom
		jQuery('#button_' + type + '_jurnal_fill_camera').show()
			.removeClass('col-100').addClass('col');
		jQuery('#button_' + type + '_jurnal_fill_file')
			.removeClass('col-100').addClass('col');
	} else {
		const clean = val.replace(/.*[\/\\]/, ''); // ambil nama file saja
		$$(labelId).html(clean);
		// sembunyikan camera, jadikan tombol file full width
		jQuery('#button_' + type + '_jurnal_fill_camera').hide();
		jQuery('#button_' + type + '_jurnal_fill_file')
			.removeClass('col').addClass('col-100');
	}
}


function openCameraJurnalTerimaUpdate(selection) {

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
	const USER_ID = parseInt(localStorage.getItem("user_id"), 10);

	jQuery("#judul-popup-edit-transaksi-jurnal").html(
		USER_ID === 260 ? 'Detail Data' : 'Edit Data'
	);

	jQuery.ajax({
		type: "POST", // pakai POST
		url: BASE_API + "/get-detail-transaksi-acc",
		dataType: "JSON",
		timeout: 10000,
		data: { id_transaksi_acc: id_transaksi_acc },
		beforeSend: function () {
			internetCheckQueue.check();
			// clear field
			jQuery('.clear_edit_jurnal').val('');
			jQuery('#show_keterangan_reject').hide();

			// reset tombol & label
			jQuery("#edit_value_jurnal_acc_1").html('File');
			jQuery("#text_file_path_terima_jurnal_update").html('Camera');

			// reset preview gambar (ID diperbaiki)
			jQuery('#file_bukti_edit_jurnal_view_now')
				.attr('src', 'https://tasindo-sale-webservice.digiseminar.id/noimage.jpg');

			// reset state tombol file/camera ke 2 kolom
			jQuery('#button_edit_jurnal_fill_camera').show()
				.removeClass('col-100').addClass('col');
			jQuery('#button_edit_jurnal_fill_file').show()
				.removeClass('col-100').addClass('col');

			// bersihkan file input
			jQuery('#edit_file_jurnal_acc_1').val('');
		},
		success: function (resp) {
			const d = (resp && resp.data) ? resp.data : {};
			const isSpyReject = (d.valid_spy === 2);

			// === Kontrol akses edit / view-only ===
			if (USER_ID === 260) {
				if (isSpyReject) {
					jQuery("#show_button_update_jurnal").show();
					jQuery('#button_edit_jurnal_fill_camera, #button_edit_jurnal_fill_file').show();
					jQuery('#show_keterangan_reject').show();

					jQuery(".clear_edit_jurnal").prop('readonly', false);
					// enable select di Smart Select
					jQuery('#edit_kategori_jurnal, #edit_perusahaan_jurnal').prop('disabled', false);
					jQuery('#smart_select_edit_kategori_jurnal, #smart_select_edit_perusahaan_jurnal').removeClass('disabled');
				} else {
					jQuery("#show_button_update_jurnal").hide();
					jQuery('#show_keterangan_reject').hide();
					jQuery('#button_edit_jurnal_fill_camera, #button_edit_jurnal_fill_file').hide();

					jQuery(".clear_edit_jurnal").prop('readonly', true);
					// disable select di Smart Select
					jQuery('#edit_kategori_jurnal, #edit_perusahaan_jurnal').prop('disabled', true);
					jQuery('#smart_select_edit_kategori_jurnal, #smart_select_edit_perusahaan_jurnal').addClass('disabled');
				}
			} else {
				// user biasa: bisa edit
				jQuery("#show_button_update_jurnal").show();
				jQuery('#show_keterangan_reject').hide();
				jQuery('#button_edit_jurnal_fill_camera, #button_edit_jurnal_fill_file').show();

				jQuery(".clear_edit_jurnal").prop('readonly', false);
				jQuery('#edit_kategori_jurnal, #edit_perusahaan_jurnal, #edit_expedisi_keterangan_jurnal, #edit_pic_jurnal, #edit_plat_jurnal, #edit_expedisi_pengirim_jurnal, #edit_expedisi_dari_jurnal, #edit_expedisi_tujuan_jurnal, #edit_alamat_jurnal, #edit_nohp_jurnal').prop('disabled', false);
				jQuery('#edit_kategori_jurnal, #edit_perusahaan_jurnal, #edit_expedisi_keterangan_jurnal, #edit_pic_jurnal, #edit_plat_jurnal, #edit_expedisi_pengirim_jurnal, #edit_expedisi_dari_jurnal, #edit_expedisi_tujuan_jurnal, #edit_alamat_jurnal, #edit_nohp_jurnal').prop('required', false);
				jQuery('#edit_kategori_jurnal, #edit_perusahaan_jurnal, #edit_expedisi_keterangan_jurnal, #edit_pic_jurnal, #edit_plat_jurnal, #edit_expedisi_pengirim_jurnal, #edit_expedisi_dari_jurnal, #edit_expedisi_tujuan_jurnal, #edit_alamat_jurnal, #edit_nohp_jurnal').prop('validate', false);
				jQuery('#smart_select_edit_kategori_jurnal, #smart_select_edit_perusahaan_jurnal').removeClass('disabled');
			}

			// === Tampilkan blok sesuai ada/tidaknya perusahaan (expedisi) ===
			if (d.id_perusahaan_acc != null) {
				jQuery('.edit_expedisi_jurnal').show();
				jQuery('.edit_uraian_transaksi_jurnal').hide();
				jQuery('#edit_keterangan_jurnal').prop({ required: false });
			} else {
				jQuery('.edit_expedisi_jurnal').hide();
				jQuery('.edit_uraian_transaksi_jurnal').show();
				jQuery('.edit_expedisi_jurnal_att').prop({ required: false });
				jQuery('.edit_uraian_jurnal_att').prop({ required: true });
			}

			// === Combo & label smart select (pastikan fungsi ada) ===
			if (typeof comboKategoriDetailJurnal === 'function') {
				comboKategoriDetailJurnal(d.id_kategori_acc, 'edit');
			}
			if (typeof comboPerusahaanDetailJurnal === 'function') {
				comboPerusahaanDetailJurnal(d.id_perusahaan_acc, 'edit');
			}
			$$('.item_after_edit_kategori_jurnal').html(d.kategori_acc || '');
			$$('.item_after_edit_perusahaan_jurnal').html(d.perusahaan_acc || '');

			// === Isi field ===
			jQuery("#edit_pic_jurnal").val(d.perusahaan_pic || '');
			jQuery("#edit_plat_jurnal").val(d.perusahaan_no_plat || '');
			jQuery("#edit_nohp_jurnal").val(d.perusahaan_no_hp || '');
			jQuery("#edit_expedisi_pengirim_jurnal").val(d.perusahaan_pengirim || '');
			jQuery("#edit_expedisi_dari_jurnal").val(d.perusahaan_dari || '');
			jQuery("#edit_expedisi_tujuan_jurnal").val(d.perusahaan_tujuan || '');
			jQuery("#edit_alamat_jurnal").val(d.perusahaan_alamat || '');
			jQuery("#edit_expedisi_keterangan_jurnal").val(d.perusahaan_uraian || '');
			jQuery("#edit_keterangan_jurnal").val(d.keterangan || '');

			// nominal boleh diformat
			jQuery("#edit_nominal_jurnal").val(typeof number_format === 'function' ? number_format(d.nominal_acc) : (d.nominal_acc || ''));

			// ID transaksi JANGAN diformat
			jQuery("#edit_id_transaksi_jurnal_acc").val(d.id_transaksi_acc != null ? d.id_transaksi_acc : '');

			// tanggal transaksi raw
			jQuery("#edit_tanggal_transaksi_jurnal_acc").val(d.tanggal_transaksi || '');

			// keterangan reject
			jQuery("#edit_keterangan_reject_jurnal").val(d.keterangan_valid || '');

			// preview bukti foto
			if (d.bukti_foto_acc && d.bukti_foto_acc !== 'null') {
				jQuery('#file_bukti_edit_jurnal_view_now')
					.attr('src', (typeof BASE_PATH_IMAGE_FOTO_ACCOUNTING !== 'undefined'
						? (BASE_PATH_IMAGE_FOTO_ACCOUNTING + '/' + d.bukti_foto_acc)
						: d.bukti_foto_acc));
			} else {
				jQuery('#file_bukti_edit_jurnal_view_now')
					.attr('src', 'https://tasindo-sale-webservice.digiseminar.id/noimage.jpg');
			}
		},
		error: function () {
			// bisa tambahkan alert/log bila perlu
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
			// internetCheckQueue.check();
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
			// internetCheckQueue.check();
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
			// internetCheckQueue.check();
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
			// internetCheckQueue.check();
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
	const KEY_BUKTI = 'file_foto_update_terima_jurnal';
	const $form = $$('#form_edit_jurnal_acc')[0];

	// 1) Cek koneksi
	if (localStorage.getItem('internet_koneksi') === 'fail') {
		app.dialog.alert('<font style="font-size:22px; color:white; font-weight:bold;">Gagal, Internet Tidak Stabil, Box Koneksi Harus Berwarna Hijau</font>');
		return;
	}

	// 2) Cek form & validitas
	if (!$form || !$form.checkValidity()) {
		app.dialog.alert('Cek Isian Anda');
		return;
	}

	// 3) Deteksi lampiran (base64 di localStorage atau file input)
	const hasLsImage = localStorage.getItem(KEY_BUKTI) != null;
	const hasFileInput = !!jQuery('#edit_file_jurnal_acc_1').val();
	const hasAttachment = hasLsImage || hasFileInput;

	// 4) Siapkan FormData (sekali saja)
	const formData = new FormData(jQuery('#form_edit_jurnal_acc')[0]);
	formData.append('user_modified', localStorage.getItem('karyawan_nama') || '');
	formData.append('lokasi_pabrik', localStorage.getItem('lokasi_pabrik') || '');
	formData.append('user_id', localStorage.getItem('user_id') || '');
	formData.append('kas', jQuery('#filter_kas_neraca').val() || '');

	// Jika ada lampiran: kirim base64 dari localStorage (kalau ada).
	// Jika tidak ada: kirim null agar backend bisa mengosongkan.
	formData.append('bukti_terima', hasAttachment ? (localStorage.getItem(KEY_BUKTI) || '') : null);

	// 5) Kirim AJAX (satu blok saja)
	jQuery.ajax({
		type: 'POST',
		url: BASE_API + '/update-transaksi-jurnal-acc',
		dataType: 'JSON',
		data: formData,
		timeout: 7000,
		contentType: false,
		processData: false,
		beforeSend: function () {
			internetCheckQueue.check();
			app.dialog.preloader('Memproses data...');
		},
		success: function (data) {
			$$('.clear_edit_transaksi').val('');
			if (data && data.status === 'success') {
				app.popup.close();
				// refresh data
				if (typeof getDataJurnal === 'function') getDataJurnal();
				// bersihkan hanya kunci yang benar
				localStorage.removeItem(KEY_BUKTI);
				// reset file input (opsional)
				jQuery('#edit_file_jurnal_acc_1').val('');
			} else {
				// jika 'failed' atau respons tak terduga
				app.popup.close();
				if (!data || !data.status) {
					app.dialog.alert('Respons server tidak dikenali.');
				}
			}
		},
		error: function (xhr, textstatus) {
			const isTimeout = textstatus === 'timeout';
			app.dialog.alert(isTimeout
				? 'Waktu koneksi habis. Silakan coba lagi.'
				: 'Ada kendala pada koneksi server, Silahkan Coba Kembali');
			app.popup.close();
		},
		complete: function () {
			// pastikan preloader selalu ditutup
			try { app.dialog.close(); } catch (e) { }
		}
	});
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
			internetCheckQueue.check();
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
					internetCheckQueue.check();
				try {
					app.dialog.preloader('Memproses data...');
				} catch (e) { }
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
					internetCheckQueue.check();
				try {
					app.dialog.preloader('Memproses data...');
				} catch (e) { }
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