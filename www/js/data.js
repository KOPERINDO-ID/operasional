['#detail_nominal', '#edit_nominal', '#tambah_nominal'].forEach(function (el) {
	$(el).mask('000,000,000,000', { reverse: true });
});

// Fungsi helper untuk format plat
function formatPlat(val) {
	return val
		.toUpperCase()
		.replace(/\s+/g, '')
		.replace(/[^A-Z0-9]/g, '')
		.replace(/^([A-Z]{1,2})(\d{0,4})([A-Z]{0,3}).*/, function (_, p1, p2, p3) {
			return p1 + p2 + p3;
		});
}

// Fungsi helper untuk filter angka saja
function onlyNumber(val) {
	return (val || '').toString().replace(/[^0-9]/g, '');
}

// Fungsi base untuk membuka kamera
function openCameraTerimaBase(opts) {
	console.log('📸 openCameraTerimaBase dipanggil dengan opts:', opts);

	// Validasi Camera plugin
	if (typeof navigator.camera === 'undefined') {
		console.error('❌ navigator.camera tidak tersedia');
		app.dialog.alert('Camera tidak tersedia. Gunakan tombol File untuk upload dari gallery.', 'Error');
		return;
	}

	if (typeof Camera === 'undefined') {
		console.error('❌ Camera object tidak tersedia');
		app.dialog.alert('Camera plugin belum siap. Gunakan tombol File untuk upload dari gallery.', 'Error');
		return;
	}

	var srcType = Camera.PictureSourceType.CAMERA;
	var options = setOptionsTerima(srcType);

	console.log('📷 Memanggil navigator.camera.getPicture dengan options:', options);

	navigator.camera.getPicture(function cameraSuccess(imageUri) {
		console.log('✅ Camera success, imageUri:', imageUri);

		getFileContentAsBase64Terima(imageUri, function (base64Image) {
			if (!base64Image) {
				console.error('❌ Failed to convert image to base64');
				app.dialog.alert('Gagal memproses foto. Silakan coba lagi.', 'Error');
				return;
			}

			console.log('✅ Base64 conversion success');

			if (opts && opts.storageKey) {
				localStorage.setItem(opts.storageKey, base64Image);
				console.log('💾 Saved to localStorage:', opts.storageKey);
			}

			if (opts && typeof opts.onAfter === 'function') {
				console.log('🔄 Calling onAfter callback');
				opts.onAfter(imageUri);
			}

			if (opts && opts.hideSelector) {
				console.log('👁️ Hiding:', opts.hideSelector);
				jQuery(opts.hideSelector).hide();
			}

			if (opts && opts.btnCameraId) {
				console.log('🎨 Updating button classes:', opts.btnCameraId);
				$(opts.btnCameraId).removeClass("col");
				$(opts.btnCameraId).addClass("col-100");
			}

		});

	}, function cameraError(error) {
		console.error('❌ Camera error:', error);
		var errorMsg = "Gagal mengambil foto";

		if (typeof error === 'string') {
			errorMsg = errorMsg + ": " + error;
		} else if (error && error.message) {
			errorMsg = errorMsg + ": " + error.message;
		}

		console.error("Error detail:", errorMsg);

		// Tampilkan dialog error yang lebih informatif
		app.dialog.alert(
			'Tidak dapat membuka kamera. Pastikan:\n' +
			'1. Aplikasi memiliki izin kamera\n' +
			'2. Camera plugin terinstall dengan benar\n' +
			'3. Atau gunakan tombol File untuk upload foto',
			'Error Kamera'
		);

	}, options);
}
// === FUNGSI COPY TEXT KE CLIPBOARD ===
function copyToClipboard(elementId, label) {
	var element = document.getElementById(elementId);
	var textToCopy = '';

	if (element) {
		// Ambil text content, hapus format angka (titik/koma) untuk nominal
		textToCopy = element.innerText || element.textContent || '';
		textToCopy = textToCopy.trim();

		// Hapus karakter non-angka untuk field nominal (kecuali minus)
		if (elementId === 'detail_nominal') {
			textToCopy = textToCopy.replace(/[^\d\-]/g, '');
		}
	}

	if (!textToCopy || textToCopy === '-') {
		try {
			app.toast.create({
				text: label + ' kosong atau tidak tersedia',
				closeTimeout: 2000
			}).open();
		} catch (e) {
			alert(label + ' kosong atau tidak tersedia');
		}
		return;
	}

	// Copy ke clipboard
	if (navigator.clipboard && navigator.clipboard.writeText) {
		navigator.clipboard.writeText(textToCopy).then(function () {
			showCopySuccess(label, textToCopy);
		}).catch(function (err) {
			fallbackCopyText(textToCopy, label);
		});
	} else {
		fallbackCopyText(textToCopy, label);
	}
}

// === FUNGSI COPY REF NUMBER ===
function copyRefNumber(refNumber) {
	if (!refNumber || refNumber === '' || refNumber === '-') {
		try {
			app.toast.create({
				text: 'Ref Number kosong atau tidak tersedia',
				closeTimeout: 2000
			}).open();
		} catch (e) {
			alert('Ref Number kosong atau tidak tersedia');
		}
		return;
	}

	// Copy ke clipboard
	if (navigator.clipboard && navigator.clipboard.writeText) {
		navigator.clipboard.writeText(refNumber).then(function () {
			try {
				app.toast.create({
					text: 'Ref Number berhasil disalin: ' + refNumber,
					closeTimeout: 2000
				}).open();
			} catch (e) {
				alert('Ref Number berhasil disalin: ' + refNumber);
			}
		}).catch(function (err) {
			fallbackCopyRefNumber(refNumber);
		});
	} else {
		fallbackCopyRefNumber(refNumber);
	}
}

// Fallback untuk copy ref number
function fallbackCopyRefNumber(refNumber) {
	var textArea = document.createElement('textarea');
	textArea.value = refNumber;
	textArea.style.position = 'fixed';
	textArea.style.left = '-999999px';
	textArea.style.top = '-999999px';
	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();

	try {
		document.execCommand('copy');
		try {
			app.toast.create({
				text: 'Ref Number berhasil disalin: ' + refNumber,
				closeTimeout: 2000
			}).open();
		} catch (e) {
			alert('Ref Number berhasil disalin: ' + refNumber);
		}
	} catch (err) {
		try {
			app.toast.create({
				text: 'Gagal menyalin Ref Number',
				closeTimeout: 2000
			}).open();
		} catch (e) {
			alert('Gagal menyalin Ref Number');
		}
	}

	document.body.removeChild(textArea);
}

function generateReferensiPreview(mode, idKategori) {
	if (!idKategori) {
		// Kosongkan referensi number jika kategori tidak dipilih
		if (mode === 'tambah') {
			document.getElementById('tambah_referensi_number').value = '';
		} else if (mode === 'edit' || mode === 'detail') {
			// Untuk edit, tidak perlu kosongkan karena sudah ada nilai sebelumnya
		}
		return;
	}

	var formData = new FormData();
	formData.append('id_kategori_acc', idKategori);
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/generate-referensi",
		dataType: 'JSON',
		data: formData,
		processData: false,  // <-- WAJIB untuk FormData (biar gak diubah jadi querystring)
		contentType: false,  // <-- WAJIB untuk FormData (biar boundary multipart benar)
		beforeSend: function () { app.dialog.preloader('Harap Tunggu'); },
		success: function (data) {
			app.dialog.close();
			if (data.status === 'success' && data.data.referensi_number) {
				if (mode === 'tambah') {
					document.getElementById('tambah_referensi_number').value = data.data.referensi_number;
				} else if (mode === 'edit' || mode === 'detail') {
					document.getElementById(mode + '_referensi_number').value = data.data.referensi_number;
				}
			}
		},
		error: function () {
			app.dialog.close();
		},
		complete: function () {
			try { app.dialog.close(); } catch (e) { }
		}

	});
}

function displayReferensiNumber(data) {
	if (data.referensi_number) {
		document.getElementById('detail_referensi_number').value = data.referensi_number;
	} else {
		document.getElementById('detail_referensi_number').value = '-';
	}
}

function fallbackCopyText(text, label) {
	var textArea = document.createElement('textarea');
	textArea.value = text;
	textArea.style.position = 'fixed';
	textArea.style.left = '-999999px';
	textArea.style.top = '-999999px';
	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();

	try {
		document.execCommand('copy');
		showCopySuccess(label, text);
	} catch (err) {
		try {
			app.toast.create({
				text: 'Gagal menyalin ' + label,
				closeTimeout: 2000
			}).open();
		} catch (e) {
			alert('Gagal menyalin ' + label);
		}
	}

	document.body.removeChild(textArea);
}

function showCopySuccess(label, text) {
	var displayText = text.length > 20 ? text.substring(0, 20) + '...' : text;
	try {
		app.toast.create({
			text: label + ' berhasil disalin: ' + displayText,
			closeTimeout: 2000
		}).open();
	} catch (e) {
		alert(label + ' berhasil disalin: ' + displayText);
	}
}

// === SISTEM SUGGESTION BOX UNTUK NO. PLAT DAN NO. HP ===
// Objek global untuk menyimpan data suggestion
window.suggestionData = {
	tambah_plat: [],
	tambah_nohp: [],
	edit_plat: [],
	edit_nohp: []
};

// Render suggestion items ke dalam suggestion box
function renderSuggestions(inputId, data, label) {
	var suggestionBox = document.getElementById('suggestion_' + inputId);
	if (!suggestionBox) return;

	var html = '';
	if (data && data.length > 0) {
		html += '<div class="suggestion-label">' + label + ' (' + data.length + ' data)</div>';
		for (var i = 0; i < data.length; i++) {
			var val = (data[i] || '').toString();
			if (val) {
				html += '<div class="suggestion-item" onclick="selectSuggestion(\'' + inputId + '\', \'' + val.replace(/'/g, "\\'") + '\')">' + val + '</div>';
			}
		}
	}
	suggestionBox.innerHTML = html;

	// Simpan data untuk filtering
	window.suggestionData[inputId] = data || [];
}

// Tampilkan suggestion box
function showSuggestions(inputId) {
	var suggestionBox = document.getElementById('suggestion_' + inputId);
	if (suggestionBox && suggestionBox.innerHTML.trim() !== '') {
		suggestionBox.style.display = 'block';
	}
}

// Sembunyikan suggestion box
function hideSuggestions(inputId) {
	var suggestionBox = document.getElementById('suggestion_' + inputId);
	if (suggestionBox) {
		suggestionBox.style.display = 'none';
	}
}

// Sembunyikan semua suggestion box
function hideAllSuggestions() {
	var boxes = document.querySelectorAll('.suggestion-box');
	boxes.forEach(function (box) {
		box.style.display = 'none';
	});
}

// Filter suggestion berdasarkan input
function filterSuggestions(inputId) {
	var input = document.getElementById(inputId);
	var suggestionBox = document.getElementById('suggestion_' + inputId);
	if (!input || !suggestionBox) return;

	var value = input.value.toUpperCase();
	var data = window.suggestionData[inputId] || [];
	var label = inputId.includes('plat') ? 'Riwayat No. Plat' : 'Riwayat No. HP';

	if (!value) {
		// Tampilkan semua jika input kosong
		renderSuggestions(inputId, data, label);
		showSuggestions(inputId);
		return;
	}

	// Filter data
	var filtered = data.filter(function (item) {
		return (item || '').toString().toUpperCase().indexOf(value) !== -1;
	});

	if (filtered.length > 0) {
		var html = '<div class="suggestion-label">' + label + ' (' + filtered.length + ' hasil)</div>';
		for (var i = 0; i < filtered.length; i++) {
			var val = (filtered[i] || '').toString();
			if (val) {
				html += '<div class="suggestion-item" onclick="selectSuggestion(\'' + inputId + '\', \'' + val.replace(/'/g, "\\'") + '\')">' + val + '</div>';
			}
		}
		suggestionBox.innerHTML = html;
		suggestionBox.style.display = 'block';
	} else {
		suggestionBox.style.display = 'none';
	}
}

// Pilih suggestion item
function selectSuggestion(inputId, value) {
	var input = document.getElementById(inputId);
	if (input) {
		input.value = value;
		// Trigger input event untuk validasi
		jQuery(input).trigger('input').trigger('change');
	}
	hideSuggestions(inputId);
}

// Tutup suggestion saat klik di luar
jQuery(document).on('click', function (e) {
	if (!jQuery(e.target).closest('.item-input-wrap').length) {
		hideAllSuggestions();
	}
});

jQuery('.pembayaran_1_dp').mask('000,000,000,000', { reverse: true });
jQuery('#bayar_pembayaran').mask('000.000.000', { reverse: false });
// Mask untuk pembayaran 1-10 (optimized with loop)
for (var i = 1; i <= 10; i++) {
	jQuery('#pembayaran_' + i).mask('000,000,000,000', { reverse: true });
}
// Mask untuk pembayaran_admin 1-10 (optimized with loop)
for (var i = 1; i <= 10; i++) {
	jQuery('#pembayaran_admin_' + i).mask('000,000,000,000', { reverse: true });
}

//Config Get Image From Camera
function setOptionsTerima(srcType) {
	var options = {
		// Some common settings are 20, 50, and 100
		quality: 100, // ✅ CHANGED: No compression (was 50)
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
	console.log('🔄 getFileContentAsBase64Terima called for path:', path);

	// Validasi path
	if (!path) {
		console.error('❌ Path is empty or undefined');
		app.dialog.alert('Path file kosong. Silakan coba lagi.', 'Error');
		if (typeof callback === 'function') {
			callback(null);
		}
		return;
	}

	window.resolveLocalFileSystemURL(path, gotFile, fail);

	function fail(e) {
		console.error('❌ Cannot resolve file URL:', e);
		console.error('   Error code:', e.code);
		console.error('   Error message:', e.message);

		app.dialog.alert('Gagal membaca file foto. Silakan coba lagi.', 'Error');

		if (typeof callback === 'function') {
			callback(null);
		}
	}

	function gotFile(fileEntry) {
		console.log('✅ File entry resolved:', fileEntry.nativeURL);

		fileEntry.file(function (file) {
			console.log('📄 File object obtained, size:', file.size, 'bytes');

			var reader = new FileReader();

			reader.onloadend = function (e) {
				console.log('✅ FileReader finished reading');
				var content = this.result;

				if (!content) {
					console.error('❌ FileReader result is empty');
					app.dialog.alert('Gagal membaca data foto. Coba lagi.', 'Error');
					if (typeof callback === 'function') {
						callback(null);
					}
					return;
				}

				console.log('✅ Base64 data size:', content.length, 'characters');
				if (typeof callback === 'function') {
					callback(content);
				}
			};

			reader.onerror = function (e) {
				console.error('❌ FileReader error:', e);
				app.dialog.alert('Error membaca file. Silakan coba lagi.', 'Error');
				if (typeof callback === 'function') {
					callback(null);
				}
			};

			// The most important point, use the readAsDatURL Method from the file plugin
			reader.readAsDataURL(file);
		}, function (error) {
			console.error('❌ Failed to get file object:', error);
			app.dialog.alert('Gagal mengakses file foto.', 'Error');
			if (typeof callback === 'function') {
				callback(null);
			}
		});
	}
}

function toDataURL(path, callback) {
	console.log('🔄 toDataURL called for path:', path);

	// Validasi path
	if (!path) {
		console.error('❌ Path is empty or undefined');
		if (typeof callback === 'function') {
			callback(null);
		}
		return;
	}

	window.resolveLocalFileSystemURL(path, gotFile, fail);

	function fail(e) {
		console.error('❌ Cannot resolve file URL:', e);
		console.error('   Error code:', e.code);
		console.error('   Error message:', e.message);

		// Tampilkan alert untuk user
		app.dialog.alert('Gagal membaca file foto. Silakan coba lagi atau gunakan metode lain.', 'Error');

		if (typeof callback === 'function') {
			callback(null);
		}
	}

	function gotFile(fileEntry) {
		console.log('✅ File entry resolved:', fileEntry.nativeURL);

		fileEntry.file(function (file) {
			console.log('📄 File object obtained, size:', file.size, 'bytes');

			var reader = new FileReader();

			reader.onloadend = function (e) {
				console.log('✅ FileReader finished reading');
				var content = this.result;

				if (!content) {
					console.error('❌ FileReader result is empty');
					app.dialog.alert('Gagal membaca data foto. Coba lagi.', 'Error');
					if (typeof callback === 'function') {
						callback(null);
					}
					return;
				}

				console.log('✅ Base64 data size:', content.length, 'characters');
				if (typeof callback === 'function') {
					callback(content);
				}
			};

			reader.onerror = function (e) {
				console.error('❌ FileReader error:', e);
				app.dialog.alert('Error membaca file. Silakan coba lagi.', 'Error');
				if (typeof callback === 'function') {
					callback(null);
				}
			};

			// The most important point, use the readAsDataURL Method from the file plugin
			reader.readAsDataURL(file);
		}, function (error) {
			console.error('❌ Failed to get file object:', error);
			app.dialog.alert('Gagal mengakses file foto.', 'Error');
			if (typeof callback === 'function') {
				callback(null);
			}
		});
	}
}

function openCameraTerima(selection) {
	console.log('🎥 openCameraTerima dipanggil');

	// Cek apakah Cordova Camera plugin tersedia
	if (typeof navigator.camera === 'undefined' || typeof Camera === 'undefined') {
		console.error('❌ Cordova Camera plugin tidak tersedia');
		app.dialog.alert('Camera plugin tidak tersedia. Silakan gunakan tombol File untuk upload foto dari gallery.', 'Error');
		return;
	}

	openCameraTerimaBase({
		storageKey: "file_foto_terima_pabrik",
		onAfter: function (imageUri) {
			changeTextFotoTerima(imageUri);
		},
		hideSelector: "#button_tambah_fill_file",
		btnCameraId: "#button_tambah_fill_camera"
	});
}


function openCameraFotoPembayaran(inputId) {
	console.log('📷 openCameraFotoPembayaran called for:', inputId);

	// Validasi Camera plugin
	if (typeof navigator.camera === 'undefined' || typeof Camera === 'undefined') {
		app.dialog.alert('Kamera tidak tersedia. Silakan gunakan opsi File.', 'Error');
		return;
	}

	const options = {
		quality: 80,
		destinationType: Camera.DestinationType.DATA_URL,
		sourceType: Camera.PictureSourceType.CAMERA,
		encodingType: Camera.EncodingType.JPEG,
		mediaType: Camera.MediaType.PICTURE,
		correctOrientation: true,
		saveToPhotoAlbum: false,
		targetWidth: 1024,
		targetHeight: 1024
	};

	navigator.camera.getPicture(
		function cameraSuccess(imageData) {
			console.log('✅ Camera success');
			const base64Image = 'data:image/jpeg;base64,' + imageData;

			// Preview foto di popup
			jQuery('#file_foto_pembayaran_view')
				.attr('src', base64Image)
				.show();

			// Hide foto existing (jika ada)
			jQuery('#file_foto_pembayaran_view_now').hide();

			// Simpan ke localStorage untuk diupload nanti
			localStorage.setItem('file_foto_pembayaran', base64Image);

			console.log('✅ Foto dari kamera siap diupload');
		},
		function cameraError(error) {
			console.error('❌ Camera error:', error);
			app.dialog.alert(
				'Tidak dapat membuka kamera. Pastikan aplikasi memiliki izin kamera atau gunakan opsi File.',
				'Error Kamera'
			);
		},
		options
	);
}

function openCameraTerimaUpdate(selection) {
	console.log('🎥 openCameraTerimaUpdate dipanggil');

	// Cek apakah Cordova Camera plugin tersedia
	if (typeof navigator.camera === 'undefined' || typeof Camera === 'undefined') {
		console.error('❌ Cordova Camera plugin tidak tersedia');
		app.dialog.alert('Camera plugin tidak tersedia. Silakan gunakan tombol File untuk upload foto dari gallery.', 'Error');
		return;
	}

	openCameraTerimaBase({
		storageKey: "file_foto_update_terima_pabrik",
		onAfter: function (imageUri) {
			changeTextFotoTerimaUpdate(imageUri);
		},
		hideSelector: "#button_detail_fill_file",
		btnCameraId: "#button_detail_fill_camera"
	});
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
		getPengajuan();
		localStorage.removeItem("id_transaksi_kas");
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

	$('#tambah_kategori').val('').trigger('change');
	$('#tambah_perusahaan').val('').trigger('change');
	$('#tambah_kas').val('').trigger('change');
	$('#tambah_tipe_transaksi').val('').trigger('change');

	// Clear text inputs
	$('#tambah_nominal').val('');
	$('#tambah_admin').val('');
	$('#tambah_keterangan').val('');
	$('#tambah_uraian').val('');

	// Clear perusahaan related fields
	$('#tambah_pic').val('');
	$('#tambah_plat').val('');
	$('#tambah_hp').val('');
	$('#tambah_bank_rekening').val('');
	$('#tambah_no_rekening').val('');
	$('#tambah_nama_rekening').val('');

	// Clear expedisi fields
	$('#tambah_pengirim').val('');
	$('#tambah_penerima').val('');
	$('#tambah_dari').val('');
	$('#tambah_tujuan').val('');
	$('#tambah_alamat').val('');

	// Clear metode bayar dan referensi
	$('#tambah_metode_bayar').val('').trigger('change');
	$('#tambah_referensi_number').val('');

	// Clear date picker
	$('#tambah_tanggal').val('');

	// Clear file upload
	$('#tambah_bukti').val('');
	$('#text_file_path_terima').html('Camera');

	// Reset visibility
	$('.tambah_expedisi').hide();
	$('.uraian_transaksi').show();

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
	// === OPTIMASI 1: Cache jQuery selectors ===
	const $filterKas = jQuery('#filter_kas');
	const $transaksiYears = jQuery('#transaksi_years');
	const $transaksiBulan = jQuery('#transaksi_bulan');
	const $hideTotal = jQuery('#hide_total');
	const $totalAccounting = jQuery('#total-accounting');
	const $dataTransaksiAccounting = jQuery('#data_transaksi_accounting');
	const $totalTransaksi = jQuery('#total-transaksi');

	// === OPTIMASI 2: Simplify kas logic ===
	var kas = localStorage.getItem("pending_filter_kas") ||
		$filterKas.val() ||
		localStorage.getItem('primary_kas');

	if (localStorage.getItem("pending_filter_kas")) {
		$filterKas.val(kas);
	}

	// === OPTIMASI 3: Simplify year/month logic ===
	var year = $transaksiYears.val() || new Date().getFullYear();
	if (year === 'all') year = 'empty';

	var month = $transaksiBulan.val() || (new Date().getMonth() + 1);
	if (month === 'all') month = 'empty';

	var id_transaksi = (localStorage.getItem("pengajuan") === 'notif')
		? localStorage.getItem('id_transaksi_kas')
		: 'empty';

	// === OPTIMASI 4: Combine AJAX calls or handle reminder failure gracefully ===
	jQuery.ajax({
		type: 'POST',
		url: BASE_API + '/kategori-acc-reminder',
		dataType: 'JSON',
		data: {
			karyawan_id: 260,
			primary_kas: 2,
			only_warning: 1
		},
		success: function (rem) {
			// Map reminder per id_kategori_acc
			var remMap = {};
			if (rem?.data?.length > 0) {
				rem.data.forEach(r => {
					remMap[r.id_kategori_acc] = r;
				});
			}
			loadTransaksiData(remMap);
		},
		error: function () {
			// Load without reminder data
			loadTransaksiData({});
		}
	});

	// === OPTIMASI 5: Extract main data loading logic ===
	function loadTransaksiData(remMap) {
		jQuery.ajax({
			type: 'POST',
			url: BASE_API + '/get-transaksi-acc',
			dataType: 'JSON',
			data: {
				user_id: localStorage.getItem('user_id'),
				kas: kas,
				month: month,
				year: year,
				id_transaksi: id_transaksi,
				lokasi_pabrik: localStorage.getItem('lokasi_pabrik')
			},
			beforeSend: function () {
				try { app.dialog.preloader('Harap Tunggu...'); } catch (e) { }
			},
			success: function (data) {
				app.dialog.close();

				if (!data?.data?.length) {
					showEmptyState();
					return;
				}

				renderTransaksiData(data, remMap);
			},
			error: function () {
				showErrorState();
			}
		});
	}

	// === OPTIMASI 6: Separate rendering logic ===
	function renderTransaksiData(data, remMap) {
		// === OPTIMASI 7: Use array instead of string concatenation ===
		const rows = [];
		let nominal_debet = 0;
		let nominal_kredit = 0;
		const userId = localStorage.getItem('user_id');
		const isAdmin = (userId == 262);

		data.data.forEach((val, index) => {
			const no = index + 1;

			// Set count_valid
			val.count_valid = data.count_valid?.[val.id_transaksi_acc] || 0;

			// Calculate amounts
			const total_bayar = parseFloat(val.operasional_jumlah_pembayaran || 0);
			const nominal = parseFloat(val.nominal_acc || 0);
			const sisa = nominal - total_bayar;

			const nominal_asal = (val.type_pembayaran === 'cicilan' && sisa > 0)
				? sisa
				: (val.type_pembayaran === 'cicilan' ? total_bayar : nominal);

			// Determine colors and styles
			const { color_row, row_style, badge_html } = getRowStyle(val, sisa, total_bayar, remMap);
			const color_btn_byr = getButtonColor(sisa, val.pembayaran1_tgl);
			const btn_detail = getDetailButtonColor(val.valid);

			// Build keterangan column
			const { kolom_ket, keterangan_acc_escaped } = buildKeteranganColumn(val, badge_html);

			// Parse validation flags
			const validSpy = parseInt(val.valid_spy, 10);
			const valid = parseInt(val.valid, 10);
			const validPembayaran = parseInt(val.count_valid, 10);
			const nominal_tampil = (validSpy === 2 || valid === 2) ? number_format(0) : number_format(nominal_asal);

			// === OPTIMASI 8: Build row with template literals ===
			rows.push(buildTableRow({
				no, val, color_row, row_style, nominal_tampil,
				kolom_ket, validSpy, valid, validPembayaran,
				nominal_asal, color_btn_byr, keterangan_acc_escaped,
				btn_detail, isAdmin
			}));

			// Calculate totals
			if (validSpy !== 2 && valid !== 2) {
				if (val.type_acc === 'Debet') {
					nominal_debet += nominal;
				} else {
					nominal_kredit += (nominal + parseFloat(val.admin_acc || 0));
				}
			}
		});

		// === OPTIMASI 9: Single DOM update ===
		updateDOM(rows.join(''), data, nominal_debet, nominal_kredit);
	}

	// === Helper Functions ===

	function getRowStyle(val, sisa, total_bayar, remMap) {
		let color_row = '';

		if (val.type_transaksi === 'Pengajuan') {
			color_row = (sisa > 0) ? 'bg-orange' : 'bg-aquamarine';
		} else if (val.valid_spy == 2 || val.valid == 2 || val.count_valid > 0) {
			color_row = (val.is_edit == 1) ? 'announcement card-color-red' : 'card-color-red';
		} else if (val.type_acc === 'Kredit' && val.type_pembayaran === 'cicilan' &&
			(total_bayar === 0 || (sisa > 0 && total_bayar > 0))) {
			color_row = 'bg-orange';
		} else if (val.type_acc === 'Debet') {
			color_row = 'card-color-light-blue';
		}

		let row_style = '';
		let badge_html = '';
		const isBaseRed = color_row.includes('card-color-red');
		const remInfo = remMap[val.id_kategori_acc];

		if (!isBaseRed && remInfo?.show_warning) {
			row_style = ` style="background-color:${remInfo.row_color};color:white"`;
			badge_html = ` <span style="background:${remInfo.badge_color};padding:2px 8px;border-radius:10px;margin-left:6px;font-size:11px;">${remInfo.h_label}</span>`;
		}

		return { color_row, row_style, badge_html };
	}

	function getButtonColor(sisa, pembayaran1_tgl) {
		if (sisa <= 0) return 'btn-color-blueWhite';
		if (sisa > 0 && pembayaran1_tgl) return 'btn-color-greenWhite';
		return 'bg-dark-gray-young text-add-colour-black-soft';
	}

	function getDetailButtonColor(valid) {
		if (valid == 1) return 'btn-color-blueWhite';
		if (valid == 2) return 'card-color-red';
		return 'bg-dark-gray-young text-add-colour-black-soft';
	}

	function buildKeteranganColumn(val, badge_html) {
		let keterangan_acc = '';
		let kolom_ket = '';

		if (val.id_perusahaan_acc) {
			const fullKet = `${val.perusahaan_acc || ''} | ${val.keterangan || ''}`;
			const shortKet = fullKet.length > 20 ? fullKet.substring(0, 20) + '...' : fullKet;

			keterangan_acc = `${val.perusahaan_pic || '-'} , ${val.perusahaan_no_plat || '-'}`;
			kolom_ket = `<td align="left" style="border-left:1px solid grey;border-bottom:1px solid grey;" 
				class="label-cell popup-open" data-popup=".detail-perusahaan-popup" 
				onclick="getDetailPerusahaanAcc('${val.perusahaan_acc || ''}','${val.perusahaan_pic || ''}','${val.perusahaan_no_hp || ''}','${val.perusahaan_no_plat || ''}','${val.perusahaan_uraian || ''}')" 
				title="${fullKet.replace(/"/g, '&quot;')}">${shortKet}${badge_html}</td>`;
		} else {
			const fullKet = val.keterangan || '';
			const shortKet = fullKet.length > 20 ? fullKet.substring(0, 20) + '...' : fullKet;

			keterangan_acc = fullKet;
			kolom_ket = `<td align="left" style="border-left:1px solid grey;border-bottom:1px solid grey;" 
				class="label-cell" title="${fullKet.replace(/"/g, '&quot;')}">${shortKet}${badge_html}</td>`;
		}

		// Escape for onclick
		const keterangan_acc_escaped = keterangan_acc
			.replace(/\\/g, '\\\\')
			.replace(/'/g, "\\'")
			.replace(/"/g, '\\"')
			.replace(/\n/g, '\\n')
			.replace(/\r/g, '\\r')
			.replace(/\t/g, '\\t');

		return { kolom_ket, keterangan_acc_escaped };
	}

	function buildTableRow(params) {
		const { no, val, color_row, row_style, nominal_tampil, kolom_ket,
			validSpy, valid, validPembayaran, nominal_asal, color_btn_byr,
			keterangan_acc_escaped, btn_detail, isAdmin } = params;

		// === OPTIMASI 10: Build payment button params once ===
		const paymentParams = `'${val.tanggal_transaksi}','${val.bank_1}','${val.bank_2}','${val.bank_3}','${val.bank_4}','${val.bank_5}','${val.bank_6}','${val.bank_7}','${val.bank_8}','${val.bank_9}','${val.bank_10}','${val.pembayaran1_tgl}','${val.pembayaran2_tgl}','${val.pembayaran3_tgl}','${val.pembayaran4_tgl}','${val.pembayaran5_tgl}','${val.pembayaran6_tgl}','${val.pembayaran7_tgl}','${val.pembayaran8_tgl}','${val.pembayaran9_tgl}','${val.pembayaran10_tgl}','${val.bank}','${val.pembayaran_1}','${val.pembayaran_2}','${val.pembayaran_3}','${val.pembayaran_4}','${val.pembayaran_5}','${val.pembayaran_6}','${val.pembayaran_7}','${val.pembayaran_8}','${val.pembayaran_9}','${val.pembayaran_10}','${val.operasional_jumlah_pembayaran}','${val.nominal_acc}','${val.id_transaksi_acc}','${val.operasional_status_pembayaran}','${val.pembayaran_operasional_id}','${val.kategori_acc}','${keterangan_acc_escaped}','${val.admin_acc}'`;

		const isInvalidOrZero = (validSpy === 2 || valid === 2 || validPembayaran > 0 || nominal_asal === 0);
		const paymentBtnClass = isInvalidOrZero ? 'card-color-red' : color_btn_byr;

		const paymentCell = (val.type_pembayaran === 'cicilan')
			? `<td style="border-top:1px solid gray;" class="label-cell">
				<a class="${paymentBtnClass} button-small col button popup-open text-bold" 
				   onclick="detailPembayaran(${paymentParams});">Bayar</a>
			   </td>`
			: '<td style="border-top:1px solid gray;"></td>';

		const detailCell = (validSpy === 2 || valid === 2 || nominal_asal === 0)
			? `<td style="border-top:1px solid gray;text-align:center">
				<a onclick="getEditTransaksiAcc('${val.id_transaksi_acc || ''}','${val.id_perusahaan_acc || ''}')" 
				   class="card-color-red button-small col button popup-open text-bold" 
				   data-popup=".edit-transaksi">Detail</a>
			   </td>`
			: `<td style="border-top:1px solid gray;text-align:center">
				<a onclick="getDetailTransaksiAcc('${val.id_transaksi_acc || ''}','${val.id_perusahaan_acc || ''}')" 
				   class="${btn_detail} button-small col button popup-open text-bold" 
				   data-popup=".detail-transaksi">Detail</a>
			   </td>`;

		const deleteCell = isAdmin
			? `<td style="border-top:1px solid gray;border-right:1px solid grey;text-align:center">
				<a onclick="deleteTransaksiAcc('${val.id_transaksi_acc || ''}','${val.kategori_acc || ''}')" 
				   class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold">Delete</a>
			   </td>`
			: '';

		return `<tr class="${color_row}"${row_style}>
			<td align="center" style="border-left:1px solid grey;border-bottom:1px solid grey;" class="label-cell">${no}</td>
			<td align="center" style="border-left:1px solid grey;border-bottom:1px solid grey;" class="label-cell">${moment(val.tanggal_transaksi).format('DD-MMM-YYYY')}</td>
			<td align="left" style="border-left:1px solid grey;border-bottom:1px solid grey;" class="label-cell">${val.kategori_acc || ''}</td>
			${kolom_ket}
			<td align="right" style="border-left:1px solid grey;border-bottom:1px solid grey;border-right:1px solid gray;" class="label-cell">${nominal_tampil}</td>
			<td align="right" style="border-bottom:1px solid grey;border-right:1px solid gray;" class="label-cell">${number_format(val.admin_acc)}</td>
			${paymentCell}
			${detailCell}
			${deleteCell}
		</tr>`;
	}

	function updateDOM(htmlContent, data, nominal_debet, nominal_kredit) {
		localStorage.removeItem('pending_filter_kas');
		localStorage.removeItem('pending_filter_kas_page');

		$hideTotal.show();
		$totalAccounting.html(number_format(nominal_debet - nominal_kredit));
		$dataTransaksiAccounting.html(htmlContent);
		$totalTransaksi.html(data.data.length);

		// Store kas values
		['kas_utama', 'kas_tunai', 'kas_marketing', 'kas_backup'].forEach(key => {
			if (data[key]) localStorage.setItem(key, data[key]);
		});
	}

	function showEmptyState() {
		$hideTotal.show();
		$totalAccounting.html(number_format(0));
		$dataTransaksiAccounting.html('<tr><td colspan="8" align="center">Tidak Ada Data</td></tr>');
		$totalTransaksi.html(0);
	}

	function showErrorState() {
		$dataTransaksiAccounting.html('<tr><td colspan="8" align="center">Gagal memuat data</td></tr>');
		$totalAccounting.html(number_format(0));
		$totalTransaksi.html(0);
	}
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
	// Ambil ID kategori yang dipilih
	var idKategori = document.getElementById(type + '_kategori').value;

	// Generate referensi number preview
	generateReferensiPreview(type, idKategori);
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
			internetCheckQueue.check();
			try { app.dialog.preloader('Harap Tunggu...'); } catch (e) { }
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
			app.dialog.close();
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

			displayReferensiNumber(data);

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
			jQuery("#detail_tipe_bayar").text(d.type_pembayaran || "-");
			jQuery("#detail_referensi_number").text(d.referensi_number || "-");

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
			jQuery("#detail_bank_rekening_acc").val(d.perusahaan_nama_bank || d.perusahaan_bank_rekening || "-");
			jQuery("#detail_no_rekening_acc").val(d.perusahaan_no_rekening || "-");
			jQuery("#detail_nama_rekening_acc").val(d.perusahaan_nama_rekening || "-");
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
			internetCheckQueue.check(); try { app.dialog.preloader('Harap Tunggu...'); } catch (e) { }
			jQuery('#clear_edit_transaksi').html('');
			$('.edit_keterangan_reject_transaksi').hide();
			gambarAcc(1, 'edit');
			jQuery('#file_bukti_edit_view_now').attr('src', 'https://tasindo-sale-webservice.digiseminar.id/noimage.jpg');
		},
		success: function (data) {
			app.dialog.close();
			jQuery("#show_button_update").show();
			$('#button_edit_fill_camera').show();
			$('#button_edit_fill_file').show();
			$("#button_edit_fill_camera").removeClass("col-100");
			$("#button_edit_fill_file").removeClass("col-100");
			$("#button_edit_fill_camera").addClass("col");
			$("#button_edit_fill_file").addClass("col");
			console.log(data.data);

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
			jQuery("#edit_referensi_number").val(data.data.referensi_number);
			jQuery("#edit_value_acc_1").html('File');
			jQuery("#text_file_path_terima_update").html('Camera');

			comboKategoriDetail(data.data.id_kategori_acc, 'edit');
			comboPerusahaanDetail(data.data.id_perusahaan_acc, 'edit');
			$$('.item_after_edit_kategori').html(data.data.kategori_acc);
			$$('.item_after_edit_perusahaan').html(data.data.perusahaan_acc);
			jQuery("#edit_pic").val(data.data.perusahaan_pic);
			jQuery("#edit_plat").val(data.data.perusahaan_no_plat);
			jQuery("#edit_nohp").val(data.data.perusahaan_no_hp);
			jQuery("#edit_bank_rekening").val(data.data.perusahaan_nama_bank);
			jQuery("#edit_no_rekening").val(data.data.perusahaan_no_rekening);
			jQuery("#edit_nama_rekening").val(data.data.perusahaan_nama_rekening);
			jQuery("#edit_metode_bayar").val(data.data.type_pembayaran || "");
			jQuery("#edit_referensi_number").val(data.data.referensi_number || "");
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
	jQuery.ajax({
		type: "POST",
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
				// ✅ TAMBAHKAN data attributes untuk auto-fill
				optionsValues += '<option value="' + item.id_perusahaan_acc + '" ' +
					'data-pic="' + (item.perusahaan_pic || '') + '" ' +
					'data-plat="' + (item.perusahaan_no_plat || '') + '" ' +
					'data-hp="' + (item.perusahaan_no_hp || '') + '" ' +
					'data-bank="' + (item.perusahaan_nama_bank || '') + '" ' +
					'data-norek="' + (item.perusahaan_no_rekening || '') + '" ' +
					'data-namarek="' + (item.perusahaan_nama_rekening || '') + '" ' +
					'data-uraian="' + (item.perusahaan_uraian || '') + '" ' +
					'>' + item.perusahaan_acc + '</option>';
			});

			jQuery('#tambah_perusahaan').html(optionsValues);

			// ✅ TAMBAHKAN onChange event handler
			jQuery('#tambah_perusahaan').off('change').on('change', function () {
				var selectedOption = $(this).find('option:selected');

				if (selectedOption.val()) {
					// Auto-fill fields dari data attributes
					$('#tambah_pic').val(selectedOption.data('pic') || '');
					$('#tambah_plat').val(selectedOption.data('plat') || '');
					$('#tambah_hp').val(selectedOption.data('hp') || '');
					$('#tambah_bank_rekening').val(selectedOption.data('bank') || '');
					$('#tambah_no_rekening').val(selectedOption.data('norek') || '');
					$('#tambah_nama_rekening').val(selectedOption.data('namarek') || '');
					$('#tambah_uraian').val(selectedOption.data('uraian') || '');
				} else {
					// Clear fields jika pilih "Pilih Perusahaan"
					$('#tambah_pic').val('');
					$('#tambah_plat').val('');
					$('#tambah_hp').val('');
					$('#tambah_bank_rekening').val('');
					$('#tambah_no_rekening').val('');
					$('#tambah_nama_rekening').val('');
					$('#tambah_uraian').val('');
				}
			});
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
	jQuery.ajax({
		type: "POST",
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
				var isSelected = (id_perusahaan_acc == item.id_perusahaan_acc);

				// ✅ TAMBAHKAN data attributes
				optionsValues += '<option value="' + item.id_perusahaan_acc + '" ' +
					(isSelected ? 'selected' : '') + ' ' +
					'data-pic="' + (item.perusahaan_pic || '') + '" ' +
					'data-plat="' + (item.perusahaan_no_plat || '') + '" ' +
					'data-hp="' + (item.perusahaan_no_hp || '') + '" ' +
					'data-bank="' + (item.perusahaan_nama_bank || '') + '" ' +
					'data-norek="' + (item.perusahaan_no_rekening || '') + '" ' +
					'data-namarek="' + (item.perusahaan_nama_rekening || '') + '" ' +
					'data-uraian="' + (item.perusahaan_uraian || '') + '" ' +
					'>' + item.perusahaan_acc + '</option>';
			});

			jQuery('#' + type + '_perusahaan').html(optionsValues);

			// ✅ TAMBAHKAN onChange event handler untuk EDIT/DETAIL
			jQuery('#' + type + '_perusahaan').off('change').on('change', function () {
				var selectedOption = $(this).find('option:selected');

				if (selectedOption.val()) {
					// Auto-fill fields
					$('#' + type + '_pic').val(selectedOption.data('pic') || '');
					$('#' + type + '_plat').val(selectedOption.data('plat') || '');
					$('#' + type + '_hp').val(selectedOption.data('hp') || '');
					$('#' + type + '_bank_rekening').val(selectedOption.data('bank') || '');
					$('#' + type + '_no_rekening').val(selectedOption.data('norek') || '');
					$('#' + type + '_nama_rekening').val(selectedOption.data('namarek') || '');
					$('#' + type + '_uraian').val(selectedOption.data('uraian') || '');
				} else {
					// Clear fields
					$('#' + type + '_pic').val('');
					$('#' + type + '_plat').val('');
					$('#' + type + '_hp').val('');
					$('#' + type + '_bank_rekening').val('');
					$('#' + type + '_no_rekening').val('');
					$('#' + type + '_nama_rekening').val('');
					$('#' + type + '_uraian').val('');
				}
			});
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

/**
 * ========================================
 * 1. INTEGRASI KE simpanTransaksi()
 * ========================================
 */
async function simpanTransaksi() {
	if (localStorage.getItem("internet_koneksi") == 'fail') {
		app.dialog.alert('<font style="font-size:22px; color:white; font-weight:bold;">Gagal,Internet Tidak Stabil,Box Koneksi Harus Berwarna Hijau', function () {
		});
		return;
	}

	if (!$$('#form_tambah_transaksi_acc')[0].checkValidity()) {
		app.dialog.alert('Cek Isian Anda');
		return;
	}

	// ✅ PERUBAHAN 1: Cek foto dari localStorage atau input
	const fotoInput = jQuery('#tambah_file_acc_1')[0];
	const fotoFromStorage = localStorage.getItem("file_foto_terima_pabrik");

	if (!fotoFromStorage && (!fotoInput || !fotoInput.files || !fotoInput.files[0])) {
		app.dialog.alert('Silahkan Foto Bukti');
		return;
	}

	try {
		app.dialog.preloader('Memproses gambar...');

		// ✅ PERUBAHAN 2: Compress foto jika dari input file
		let fotoBlob;

		if (fotoInput && fotoInput.files && fotoInput.files[0]) {
			// Compress foto baru
			console.log('🔄 Compressing new photo from input...');
			const file = fotoInput.files[0];

			// Validasi dulu
			if (!validateFileType(file)) {
				app.dialog.close();
				return;
			}

			if (!validateFileSize(file, 50)) {
				app.dialog.close();
				return;
			}

			// ✅ NO COMPRESSION: Use original file
			fotoBlob = file;
			console.log('✅ Using original photo (no compression):', formatBytes(fotoBlob.size));
		} else {
			// Gunakan foto dari localStorage
			console.log('📦 Using photo from localStorage');
			fotoBlob = base64ToBlob(fotoFromStorage);
		}

		// ✅ PERUBAHAN 3: Buat FormData dengan foto original
		var formData = new FormData(jQuery("#form_tambah_transaksi_acc")[0]);

		// Remove old foto field jika ada
		formData.delete('bukti_terima');

		// Append compressed foto
		const fileName = 'bukti_transaksi_' + Date.now() + '.jpg';
		formData.append('bukti_terima', fotoBlob, fileName);

		// Append other fields
		formData.append('user_record', localStorage.getItem("karyawan_nama"));
		formData.append('lokasi_pabrik', localStorage.getItem("lokasi_pabrik"));
		formData.append('user_id', localStorage.getItem("user_id"));
		formData.append('kas', jQuery('#filter_kas').val());

		console.log('📤 Uploading transaction with compressed photo...');
		console.log('   Photo size:', formatBytes(fotoBlob.size));

		jQuery.ajax({
			type: "POST",
			url: "" + BASE_API + "/tambah-transaksi-acc",
			dataType: "JSON",
			data: formData,
			contentType: false,
			processData: false,
			xhr: function () {
				var xhr = new window.XMLHttpRequest();
				// ✅ TAMBAHAN: Progress bar untuk upload
				if (xhr.upload) {
					xhr.upload.addEventListener('progress', function (e) {
						if (e.lengthComputable) {
							var percent = Math.round((e.loaded / e.total) * 100);
							console.log('Upload progress:', percent + '%');
							// Bisa update UI progress bar disini
						}
					}, false);
				}
				return xhr;
			},
			beforeSend: function () {
				internetCheckQueue.check(); try { app.dialog.preloader('Harap Tunggu...'); } catch (e) { }
			},
			success: function (data) {
				app.dialog.close();
				app.dialog.close();
				$$('.clear_tambah_transaksi').val('');

				if (data.status == 'success') {
					app.popup.close();
					getDataTransaksi();

					// ✅ CLEANUP: Hapus dari localStorage
					localStorage.removeItem('file_foto_terima_pabrik');
					cleanupPerusahaanDatalists('tambah');

					// Clear input file
					if (fotoInput) fotoInput.value = '';

					app.toast.create({
						text: '✓ Transaksi berhasil disimpan',
						position: 'center',
						closeTimeout: 2000
					}).open();

				} else if (data.status == 'failed') {
					app.popup.close();
					app.dialog.alert(data.message || 'Gagal menyimpan transaksi');
				}
			},
			error: function (xmlhttprequest, textstatus, message) {
				app.dialog.close();
				app.dialog.alert('Ada kendala pada koneksi server, Silahkan Coba Kembali');
				console.error('Upload error:', textstatus, message);
			},
			complete: function () {
				try { app.dialog.close(); } catch (e) { }
			}

		});

	} catch (error) {
		app.dialog.close();
		app.dialog.alert('Gagal memproses gambar: ' + error.message);
		console.error('Transaction error:', error);
	}
}

/**
 * ========================================
 * 2. INTEGRASI KE updateTransaksi()
 * ========================================
 */
async function updateTransaksi() {
	if (localStorage.getItem("internet_koneksi") == 'fail') {
		app.dialog.alert('<font style="font-size:22px; color:white; font-weight:bold;">Gagal,Internet Tidak Stabil,Box Koneksi Harus Berwarna Hijau', function () {
		});
		return;
	}

	if (!$$('#form_edit_transaksi_acc')[0].checkValidity()) {
		app.dialog.alert('Cek Isian Anda');
		return;
	}

	try {
		// ✅ Handle foto update
		const fotoInput = jQuery('#edit_file_acc_1')[0];
		const fotoFromStorage = localStorage.getItem("file_foto_update_terima_pabrik");

		let fotoBlob = null;
		let hasNewPhoto = false;

		// Check if there's a new photo
		if (fotoInput && fotoInput.files && fotoInput.files[0]) {
			hasNewPhoto = true;

			app.dialog.preloader('Memproses gambar...');

			const file = fotoInput.files[0];

			// Validasi
			if (!validateFileType(file)) {
				app.dialog.close();
				return;
			}

			if (!validateFileSize(file, 50)) {
				app.dialog.close();
				return;
			}

			// ✅ NO COMPRESSION: Use original file
			fotoBlob = file;
			console.log('✅ Using original photo (no compression):', formatBytes(fotoBlob.size));

		} else if (fotoFromStorage) {
			hasNewPhoto = true;
			fotoBlob = base64ToBlob(fotoFromStorage);
			console.log('📦 Using photo from localStorage');
		}

		// Build FormData
		var formData = new FormData(jQuery("#form_edit_transaksi_acc")[0]);
		formData.append('user_modified', localStorage.getItem("karyawan_nama"));
		formData.append('lokasi_pabrik', localStorage.getItem("lokasi_pabrik"));
		formData.append('user_id', localStorage.getItem("user_id"));
		formData.append('kas', jQuery('#filter_kas').val());

		// ✅ Handle foto field
		if (hasNewPhoto && fotoBlob) {
			formData.delete('bukti_terima');
			const fileName = 'bukti_transaksi_update_' + Date.now() + '.jpg';
			formData.append('bukti_terima', fotoBlob, fileName);
			console.log('📤 Uploading with new photo:', formatBytes(fotoBlob.size));
		} else {
			formData.append('bukti_terima', null);
			console.log('📤 Uploading without photo change');
		}

		jQuery.ajax({
			type: "POST",
			url: "" + BASE_API + "/update-transaksi-acc",
			dataType: "JSON",
			data: formData,
			timeout: 7000,
			contentType: false,
			processData: false,
			xhr: function () {
				var xhr = new window.XMLHttpRequest();
				if (xhr.upload) {
					xhr.upload.addEventListener('progress', function (e) {
						if (e.lengthComputable) {
							var percent = Math.round((e.loaded / e.total) * 100);
							console.log('Upload progress:', percent + '%');
						}
					}, false);
				}
				return xhr;
			},
			beforeSend: function () {
				internetCheckQueue.check(); try { app.dialog.preloader('Harap Tunggu...'); } catch (e) { }
			},
			success: function (data) {
				app.dialog.close();
				$$('.clear_edit_transaksi').val('');

				if (data.status == 'success') {
					app.popup.close();
					getDataTransaksi();
					cleanupPerusahaanDatalists('edit');

					// Cleanup
					localStorage.removeItem('file_foto_update_terima_pabrik');
					if (fotoInput) fotoInput.value = '';

					app.toast.create({
						text: '✓ Transaksi berhasil diupdate',
						position: 'center',
						closeTimeout: 2000
					}).open();

				} else if (data.status == 'failed') {
					app.popup.close();
					app.dialog.alert(data.message || 'Gagal update transaksi');
				}
			},
			error: function (xmlhttprequest, textstatus, message) {
				app.dialog.close();
				app.dialog.alert('Ada kendala pada koneksi server, Silahkan Coba Kembali');
				console.error('Update error:', textstatus, message);
			},
			complete: function () {
				try { app.dialog.close(); } catch (e) { }
			}

		});

	} catch (error) {
		app.dialog.close();
		app.dialog.alert('Gagal memproses gambar: ' + error.message);
		console.error('Update error:', error);
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
					internetCheckQueue.check(); try { app.dialog.preloader('Harap Tunggu...'); } catch (e) { }
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
				},
				complete: function () {
					try { app.dialog.close(); } catch (e) { }
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
					internetCheckQueue.check(); try { app.dialog.preloader('Harap Tunggu...'); } catch (e) { }
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
				},
				complete: function () {
					try { app.dialog.close(); } catch (e) { }
				}

			});

		}
	});
}

// =============================================
// FIXED VERSION - prosesPembayaranMultiple
// Perbaikan bug: variabel fileInput dan hasFile tidak dideklarasikan
// =============================================


// Global variable untuk menyimpan foto yang akan diupload
window.detailPembayaranPhotoData = {
	base64: null,
	fileName: null,
	fileSize: null,
	sourceType: null, // 'camera' atau 'file'
	idTransaksi: null,
	pembayaranId: null
};

/**
 * ========================================
 * 3. INTEGRASI KE prosesPembayaranMultiple()
 * ========================================
 */
function prosesPembayaranMultiple(pembayaran_id, number) {
	console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
	console.log('🎯 prosesPembayaranMultiple CALLED');
	console.log('   - Pembayaran ID:', pembayaran_id);
	console.log('   - Number:', number);
	console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

	var storageKey = 'foto_pembayaran_' + pembayaran_id + '_' + number;

	// ... existing code ...

	var $pay = jQuery('#pembayaran_' + number + '_' + pembayaran_id);
	var $adm = jQuery('#pembayaran_admin_' + number + '_' + pembayaran_id);
	var $bank = jQuery('#bank_' + number + '_' + pembayaran_id);
	var $tgl = jQuery('#tanggal_' + number + '_' + pembayaran_id);
	var $btn = jQuery('#btn_bayar_' + number + '_' + pembayaran_id);
	var $rowEls = jQuery('#pembayaran_' + number + '_' + pembayaran_id + ', #pembayaran_admin_' + number + '_' + pembayaran_id + ', #bank_' + number + '_' + pembayaran_id + ', #tanggal_' + number + '_' + pembayaran_id);

	console.log('📋 Form fields check:');
	console.log('   - Pembayaran value:', $pay.val());
	console.log('   - Admin value:', $adm.val());
	console.log('   - Bank value:', $bank.val());
	console.log('   - Tanggal value:', $tgl.val());

	// Validasi form fields
	if (!$pay.val() || !$bank.val() || !$tgl.val()) {
		app.dialog.close();
		app.dialog.alert('Isi Data Pembayaran Dengan Lengkap (Nominal, Bank, Tanggal)');
		return false;
	}

	// ✅ CRITICAL: Validasi foto dengan logging detail
	const fotoInput = document.getElementById('foto_bukti_' + number + '_' + pembayaran_id);
	const fotoFromStorage = localStorage.getItem(storageKey);

	console.log('📸 Foto check:');
	console.log('   - Storage key:', storageKey);
	console.log('   - Foto from storage exists?', !!fotoFromStorage);
	console.log('   - Foto from storage length:', fotoFromStorage ? fotoFromStorage.length : 0);
	console.log('   - Foto input element exists?', !!fotoInput);
	console.log('   - Foto input has files?', fotoInput ? !!fotoInput.files : false);
	console.log('   - Foto input files[0] exists?', fotoInput && fotoInput.files ? !!fotoInput.files[0] : false);

	if (fotoInput && fotoInput.files && fotoInput.files[0]) {
		console.log('   - File object name:', fotoInput.files[0].name);
		console.log('   - File object size:', (fotoInput.files[0].size / 1024).toFixed(2) + ' KB');
		console.log('   - File object type:', fotoInput.files[0].type);
	}

	if (!fotoFromStorage && (!fotoInput || !fotoInput.files || !fotoInput.files[0])) {
		app.dialog.close();
		console.error('❌ Foto validation failed: No foto from camera or gallery');
		app.dialog.alert('Isi Data Pembayaran Dengan Lengkap (Foto Bukti Belum Ada)');
		return false;
	}

	console.log('✅ Foto validation passed');

	// ... rest of existing code ...

	try {
		app.dialog.preloader('Memproses foto untuk upload...');

		let fotoBlob;

		// ✅ PRIORITAS: File input dulu (gallery), baru localStorage (camera)
		if (fotoInput && fotoInput.files && fotoInput.files[0]) {
			// GALLERY FLOW
			console.log('📁 Using foto from GALLERY (file input)');
			const file = fotoInput.files[0];

			console.log('   - File name:', file.name);
			console.log('   - File size:', (file.size / 1024).toFixed(2) + ' KB');
			console.log('   - File type:', file.type);

			// Validasi file type
			const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
			if (!validTypes.includes(file.type)) {
				app.dialog.close();
				console.error('❌ Invalid file type:', file.type);
				app.dialog.alert('File harus berupa gambar (JPG, PNG, GIF, WEBP)');
				return false;
			}

			// Validasi file size (max 50MB)
			const maxSize = 50 * 1024 * 1024;
			if (file.size > maxSize) {
				app.dialog.close();
				console.error('❌ File too large:', (file.size / (1024 * 1024)).toFixed(2) + ' MB');
				app.dialog.alert('Ukuran file maksimal 50MB');
				return false;
			}

			console.log('✅ Gallery file validation passed');

			// ✅ NO COMPRESSION: Use original file
			fotoBlob = file;
			console.log('✅ Using original file from gallery (no compression)');

		} else if (fotoFromStorage) {
			// CAMERA FLOW
			console.log('📷 Using foto from CAMERA (localStorage)');
			console.log('   - Base64 length:', fotoFromStorage.length);

			try {
				fotoBlob = base64ToBlob(fotoFromStorage);
				console.log('✅ Converted base64 to blob');
				console.log('   - Blob size:', (fotoBlob.size / 1024).toFixed(2) + ' KB');
				console.log('   - Blob type:', fotoBlob.type);
			} catch (conversionError) {
				app.dialog.close();
				console.error('❌ Failed to convert base64 to blob:', conversionError);
				app.dialog.alert('Gagal memproses foto dari kamera. Silakan coba lagi.');
				return false;
			}
		} else {
			// Ini seharusnya tidak pernah terjadi karena sudah ada validasi di atas
			app.dialog.close();
			console.error('❌ Critical error: No foto source available');
			app.dialog.alert('Error: Foto tidak ditemukan. Silakan coba lagi.');
			return false;
		}

		console.log('✅ Foto blob ready for upload:', (fotoBlob.size / 1024).toFixed(2) + ' KB');

		// Build FormData
		var formData = new FormData();

		// Append foto
		var fileName = 'foto_pembayaran_' + pembayaran_id + '_' + number + '_' + Date.now() + '.jpg';
		formData.append('foto_bukti', fotoBlob, fileName);
		console.log('📦 FormData created with foto:', fileName);

		// Append other fields
		formData.append('pembayaran', $pay.val());
		formData.append('admin', $adm.val());
		formData.append('bank', $bank.val());
		formData.append('tanggal', $tgl.val());
		formData.append('keterangan', jQuery('#keterangan_' + number + '_' + pembayaran_id).val());
		formData.append('pembayaran_id', pembayaran_id);
		formData.append('user_id', localStorage.getItem("user_id"));
		formData.append('pembayaran_ke', number);

		// id_kategori_acc
		if (window.current_id_kategori_acc) {
			formData.append('id_kategori_acc', window.current_id_kategori_acc);
			console.log('✅ Added id_kategori_acc:', window.current_id_kategori_acc);
		} else {
			app.dialog.close();
			console.error('❌ Missing id_kategori_acc');
			app.dialog.alert('Error: Data kategori tidak ditemukan. Silakan tutup dan buka kembali detail pembayaran.');
			return false;
		}

		var transfer_kas = jQuery('#filter_kas').val();

		if (localStorage.getItem("user_id") == 262) {
			formData.append('primary_kas', localStorage.getItem("primary_kas"));
			formData.append('transfer_kas', transfer_kas);
			console.log('   - Added kas data for user 262');
		}

		formData.append('karyawan_nama', localStorage.getItem("karyawan_nama"));

		console.log('✅ FormData complete, ready to upload');

		// Disable UI
		var originalBtnText = $btn.text();
		$btn.addClass('is-uploading disabled')
			.css({ 'pointer-events': 'none', 'opacity': 0.6 })
			.text('UPLOADING 0%');
		$rowEls.prop('disabled', true);

		console.log('🚀 Starting AJAX upload...');

		jQuery.ajax({
			type: 'POST',
			url: "" + BASE_API + "/proses-pembayaran-operasional-multiple",
			dataType: 'JSON',
			data: formData,
			contentType: false,
			processData: false,
			timeout: 60000, // ✅ Timeout 60 detik
			xhr: function () {
				var xhr = new window.XMLHttpRequest();
				if (xhr.upload) {
					xhr.upload.addEventListener('progress', function (e) {
						if (e.lengthComputable) {
							var pct = Math.round((e.loaded / e.total) * 100);
							$btn.text('UPLOADING ' + pct + '%');
							console.log('📊 Upload progress:', pct + '%');
						}
					}, false);
				}
				return xhr;
			},
			beforeSend: function () {
				console.log('📤 AJAX beforeSend');
				internetCheckQueue.check(); try { app.dialog.preloader('Harap Tunggu...'); } catch (e) { }
			},
			success: function (data) {
				console.log('✅ AJAX success');
				console.log('   Response:', data);
				app.dialog.close();
				app.dialog.close();
				// Cleanup localStorage jika dari camera
				if (fotoFromStorage && localStorage.getItem(storageKey)) {
					localStorage.removeItem(storageKey);
					console.log('🗑️ Cleaned up localStorage:', storageKey);
				}

				// Clear preview
				var previewElement = document.getElementById('foto_bukti_' + number + '_' + pembayaran_id + '_view');
				if (previewElement) {
					previewElement.src = '';
					previewElement.style.display = 'none';
				}

				// Clear input
				if (fotoInput) {
					fotoInput.value = '';
				}


				app.dialog.close();
				app.dialog.close();

				resetDataTransaksi(1);
				jQuery('#filter_kas').val(transfer_kas).trigger('change');

				if (data.status == 'done' || data.status == 'success') {
					app.dialog.alert(data.message || 'Pembayaran berhasil diproses');
				} else if (data.status == 'failed') {
					console.error('❌ Backend returned failed status:', data.message);
					app.dialog.alert(data.message || 'Gagal memproses pembayaran');
				} else {
					app.dialog.alert('Pembayaran berhasil diproses');
				}
			},
			error: function (xhr, textstatus, message) {
				console.error('❌ AJAX error');
				console.error('   Status:', textstatus);
				console.error('   Message:', message);
				console.error('   Response:', xhr.responseText);

				app.dialog.close();

				if (textstatus === 'timeout') {
					app.dialog.alert('Upload timeout. File terlalu besar atau koneksi lambat. Silakan coba lagi.');
				} else {
					app.dialog.alert('Gagal mengunggah pembayaran. Coba lagi.');
				}
			},
			complete: function () {
				console.log('🏁 AJAX complete');

				// Re-enable UI
				$btn.removeClass('is-uploading disabled')
					.css({ 'pointer-events': '', 'opacity': '' })
					.text(originalBtnText || 'FOTO');
				$rowEls.prop('disabled', false);
			}
		});

	} catch (error) {
		app.dialog.close();
		console.error('❌ Critical error in prosesPembayaranMultiple:', error);
		console.error('   Stack:', error.stack);
		app.dialog.alert('Gagal memproses foto: ' + error.message);
		return false;
	}
}

/**
 * ========================================
 * 4. SETUP AUTO-COMPRESS UNTUK INPUT FILES
 * ========================================
 * ✅ DISABLED: Auto-compress saat user pilih foto DINONAKTIFKAN
 */
function initializeImageCompression() {
	console.log('⚠️ Image compression is DISABLED - using original images');

	// ✅ COMMENT OUT: Auto-compress dinonaktifkan
	/*
	// Transaksi tambah
	setupCompressedFileInput(
		'tambah_file_acc_1',
		'file_foto_terima_pabrik',
		'tambah_file_acc_1_view',
		{ maxSizeMB: 4, quality: 0.8 }
	);

	// Transaksi edit
	setupCompressedFileInput(
		'edit_file_acc_1',
		'file_foto_update_terima_pabrik',
		'edit_file_acc_1_view',
		{ maxSizeMB: 4, quality: 0.8 }
	);

	// Pembayaran multiple (dynamic - setup saat popup dibuka)
	// Ini perlu dipanggil ulang setiap kali popup pembayaran dibuka
	// karena element-nya dinamis
	*/

	console.log('✅ Using original images without compression');
}

// === Template row input (belum ada pembayaran) ===
// Parameter sisa: jumlah yang belum terbayar
// Parameter totalOperasional: total nominal yang harus dibayar
function tplInputRow(idx, val, sisa, totalOperasional, id_transaksi_acc) {
	const id = val.pembayaran_operasional_id;

	// Default nilai pembayaran = sisa yang belum terbayar
	const defaultBayar = sisa > 0 ? fmt(sisa) : '0';

	// Rekomendasi keterangan
	const rekomendasiKet = (sisa > 0 && sisa <= totalOperasional) ? 'Lunas' : 'Bayar';
	console.log()
	// Generate reference number format
	const refNumber = val.referensi_number || '';
	const refFormat = idx === 1 ? `DP-${refNumber}` : `B${idx - 1}-${refNumber}`;

	// ========================================
	// CEK: Apakah data pembayaran sudah tersimpan?
	// ========================================
	const pembayaran = Number(val[`pembayaran_${idx}`] || 0);
	const pembayaranTgl = val[`pembayaran${idx}_tgl`] || null;
	const bank = val[`bank_${idx}`] || null;
	const foto = val[`foto_${idx}`] || null;

	// Data dianggap tersimpan jika ada tanggal ATAU bank
	const isDataSaved = pembayaranTgl || bank;
	const isFotoUploaded = foto && foto !== 'null' && foto !== '';

	// Tentukan state: empty, data-saved, atau complete
	let state = 'empty';
	let statusBadgeHtml = '<i class="f7-icons" style="font-size:14px;">circle</i> Belum Diisi';
	let statusBadgeClass = 'badge-empty';

	if (isFotoUploaded) {
		state = 'complete';
		statusBadgeHtml = '<i class="f7-icons" style="font-size:14px;">checkmark_circle_fill</i> Selesai';
		statusBadgeClass = 'badge-complete';
	} else if (isDataSaved) {
		state = 'data-saved';
		statusBadgeHtml = '<i class="f7-icons" style="font-size:14px;">checkmark_circle_fill</i> Data Tersimpan';
		statusBadgeClass = 'badge-data-saved';
	}

	// ========================================
	// RENDER HTML dengan TOMBOL DINAMIS (SIMPAN/FOTO)
	// ========================================
	return `
		<form id="pembayaran_form_multiple_${idx}_${id}">
			<tr>
				<!-- Reference Number -->
				<td style="border:1px solid white;" class="numeric-cell text-align-center">
					<div style="display: flex; align-items: center; justify-content: center; gap: 5px;">
						<span>${refFormat}</span>
						<i class="f7-icons" 
						   style="font-size: 18px; cursor: pointer; color: #4CAF50;" 
						   onclick="copyRefNumber('${refFormat}')"
						   title="Copy Ref Number">doc_on_doc</i>
					</div>
				</td>
				
				<!-- Label "Bayar N" + Status Badge -->
				<td colspan="2" style="border:1px solid white;" class="numeric-cell text-align-left">
					<div style="display: flex; align-items: center; gap: 8px;">
						<span>Bayar ${idx}</span>
					</div>
					<input type="hidden" value="${id_transaksi_acc}" id="id_transaksi_acc_bayar" name="id_transaksi_acc_bayar">
				</td>
				
				<!-- Tanggal -->
				<td style="border:1px solid white;" class="numeric-cell text-align-center">
					<input style="width:105px;text-align:center;" 
					       id="tanggal_${idx}_${id}" 
					       name="tanggal_${idx}_${id}"
					       type="date" 
					       class="date-multiple-pembayaran" 
					       value="${pembayaranTgl || moment().format('YYYY-MM-DD')}" 
					       ${state !== 'empty' ? 'disabled' : ''}>
				</td>
				
				<!-- Bank -->
				<td style="border:1px solid white;" class="numeric-cell text-align-center">
					<select style="width:60%; background-color:#1c1c1d;" 
					        class="hide_bank performa-input input-item-bank"
					        id="bank_${idx}_${id}" 
					        name="bank_${idx}_${id}"
					        ${state !== 'empty' ? 'disabled' : ''}>
						<option value="">BANK</option>
						<option value="BCA" ${bank === 'BCA' ? 'selected' : ''}>BCA</option>
						<option value="MANDIRI" ${bank === 'MANDIRI' ? 'selected' : ''}>MANDIRI</option>
						<option value="BNI" ${bank === 'BNI' ? 'selected' : ''}>BNI</option>
						<option value="BRI" ${bank === 'BRI' ? 'selected' : ''}>BRI</option>
						<option value="CIMB" ${bank === 'CIMB' ? 'selected' : ''}>CIMB</option>
						<option value="PERMATA" ${bank === 'PERMATA' ? 'selected' : ''}>PERMATA</option>
						<option value="DANAMON" ${bank === 'DANAMON' ? 'selected' : ''}>DANAMON</option>
						<option value="TUNAI" ${bank === 'TUNAI' ? 'selected' : ''}>TUNAI</option>
					</select>
				</td>
				
				<!-- Nominal -->
				<td style="border:1px solid white;" class="numeric-cell text-align-right">
					<input style="width:100%;text-align:right;" 
					       class="input-pembayaran-multiple" 
					       id="pembayaran_${idx}_${id}" 
					       name="pembayaran_${idx}_${id}" 
					       type="text" 
					       value="${pembayaran > 0 ? fmt(pembayaran) : defaultBayar}" 
					       onclick="if(this.value==='0') this.value='';" 
					       onblur="if(this.value==='') this.value='0';" 
					       oninput="updateJumlahPembayaran(${idx}, ${id})"
					       onchange="updateKeteranganRekomendasi(${idx}, ${id}, ${sisa})"
					       ${state !== 'empty' ? 'disabled' : ''}>
				</td>
				
				<!-- Admin -->
				<td style="border:1px solid white;" class="numeric-cell text-align-right">
					<input style="width:100%;text-align:right;" 
					       class="input-pembayaran-multiple" 
					       id="pembayaran_admin_${idx}_${id}" 
					       name="pembayaran_admin_${idx}_${id}" 
					       type="text" 
					       value="${val[`admin_${idx}`] ? fmt(val[`admin_${idx}`]) : '0'}" 
					       onclick="if(this.value==='0') this.value='';" 
					       onblur="if(this.value==='') this.value='0';"
					       oninput="updateJumlahPembayaran(${idx}, ${id})"
					       ${state !== 'empty' ? 'disabled' : ''}>
				</td>
				
				<!-- Jumlah (Total) -->
				<td style="border:1px solid white;" class="numeric-cell text-align-right">
					<input style="width:100%;text-align:right;" 
					       class="input-pembayaran-multiple" 
					       id="pembayaran_jumlah_${idx}_${id}" 
					       name="pembayaran_jumlah_${idx}_${id}" 
					       type="text" 
					       readonly 
					       value="${pembayaran > 0 ? fmt(pembayaran + (val[`admin_${idx}`] || 0)) : defaultBayar}">
				</td>
				
				<!-- Keterangan -->
				<td style="border:1px solid white;" class="numeric-cell text-align-center">
					<input style="width:100%;" 
					       id="keterangan_${idx}_${id}" 
					       name="keterangan_${idx}_${id}" 
					       type="text" 
					       value="${val[`keterangan_${idx}`] || rekomendasiKet}" 
					       placeholder="Lunas/Bayar"
					       ${state !== 'empty' ? 'disabled' : ''}>
				</td>
				
				<!-- ============================================ -->
				<!-- OPSI SECTION dengan TOMBOL DINAMIS           -->
				<!-- ============================================ -->
				<td style="border:1px solid white;" class="numeric-cell text-align-center">
					
					<!-- Hidden file input (untuk gallery) -->
					<input type="file" 
					       id="foto_bukti_${idx}_${id}" 
					       name="foto_bukti_${idx}_${id}"
					       accept="image/*" 
					       style="display:none;" />
					
					<!-- Preview Foto (jika sudah upload) -->
					${isFotoUploaded ?
			`<div style="margin-bottom: 5px;">
							<img src="${BASE_PATH_IMAGE_FOTO_PEMBAYARAN}/${foto}" 
							     alt="Foto" 
							     style="width: 100%; max-width: 120px; border-radius: 4px; border: 2px solid #4CAF50;">
						</div>`
			:
			`<img id="foto_preview_${idx}_${id}" 
						     alt="Preview"
						     style="display:none; width: 100%; max-width: 120px; border-radius: 4px; border: 2px solid #4CAF50; margin-bottom: 5px;" />`
		}
					
					<!-- ============================================ -->
					<!-- TOMBOL SIMPAN (Muncul jika data belum simpan) -->
					<!-- ============================================ -->
					<button type="button"
					        id="btn_simpan_${idx}_${id}" 
					        class="button button-small"
					        onclick="simpanDataPembayaran('${id}', '${idx}')"
					        style="width: 100%; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; font-weight: bold; font-size: 12px; display: ${state === 'empty' ? 'block' : 'none'};">
						SIMPAN
					</button>
					
					<!-- ============================================ -->
					<!-- TOMBOL FOTO (Muncul jika data sudah simpan)  -->
					<!-- ============================================ -->
					<button type="button"
					        id="btn_foto_${idx}_${id}" 
					        class="button button-small bg-dark-gray-young text-add-colour-black-soft"
					        onclick="showFotoOptions('${id}', '${idx}')"
					        style="width: 100%; font-weight: bold; font-size: 12px; display: ${state === 'data-saved' && !isFotoUploaded ? 'block' : 'none'};">FOTO
					</button>
					
					<!-- Status Selesai (jika foto sudah terupload) -->
					${isFotoUploaded ?
			`<div style="border-radius: 4px; font-weight: bold; font-size: 11px;">
							<i class="f7-icons" style="font-size: 14px;">checkmark_circle_fill</i> SELESAI
						</div>`
			: ''
		}
					
				</td>
			</tr>
		</form>
	`;
}

function uploadFotoPembayaran(pembayaran_id, idx, fotoData, source) {
	console.log('📤 uploadFotoPembayaran:', { pembayaran_id, idx, source });

	var formData = new FormData();
	var blob = null;
	var fileName = 'foto_pembayaran_' + Date.now() + '.jpg';

	// ========================================
	// FIXED: Handle camera (base64 string)
	// ========================================
	if (source === 'camera') {
		console.log('📷 Source: CAMERA - converting base64 to blob');
		console.log('   fotoData type:', typeof fotoData);
		console.log('   fotoData length:', fotoData ? fotoData.length : 0);
		console.log('   fotoData prefix:', fotoData ? fotoData.substring(0, 30) : 'null');

		if (!fotoData) {
			app.dialog.alert('Error: Data foto dari kamera kosong');
			return;
		}

		try {
			// Gunakan base64ToBlob yang sudah difix
			blob = base64ToBlob(fotoData, 'image/jpeg');
			console.log('✅ base64 converted to blob, size:', (blob.size / 1024).toFixed(2) + ' KB');
		} catch (error) {
			console.error('❌ Error converting base64 to blob:', error);
			app.dialog.alert('Error: Gagal memproses foto dari kamera. ' + error.message);
			return;
		}

		// ========================================
		// Handle gallery (File object)
		// ========================================
	} else if (source === 'gallery') {
		console.log('🖼️ Source: GALLERY - using File object directly');

		if (!fotoData) {
			app.dialog.alert('Error: File foto dari galeri kosong');
			return;
		}

		// fotoData sudah berupa File object dari gallery
		blob = fotoData;
		fileName = fotoData.name || fileName;
		console.log('✅ Using gallery file:', fileName, 'size:', (blob.size / 1024).toFixed(2) + ' KB');

	} else {
		console.error('❌ Unknown source type:', source);
		app.dialog.alert('Error: Sumber foto tidak dikenal');
		return;
	}

	// Validasi blob
	if (!blob || blob.size === 0) {
		app.dialog.alert('Error: Foto kosong atau tidak valid, silakan coba lagi');
		return;
	}

	// Append foto ke FormData
	// PENTING: Gunakan nama field 'foto_bukti' sesuai backend
	formData.append('foto_bukti', blob, fileName);

	// Append parameter lainnya
	formData.append('pembayaran_id', pembayaran_id);
	formData.append('pembayaran_ke', idx);
	formData.append('user_id', localStorage.getItem('user_id') || '');

	var uploadUrl = BASE_API + '/upload-foto-pembayaran-operasional';

	console.log('📤 Uploading to:', uploadUrl);
	console.log('📋 FormData params:', {
		pembayaran_id: pembayaran_id,
		pembayaran_ke: idx,
		user_id: localStorage.getItem('user_id'),
		foto_size_kb: (blob.size / 1024).toFixed(2)
	});

	// Upload ke server
	jQuery.ajax({
		type: 'POST',
		url: uploadUrl,
		dataType: 'JSON',
		data: formData,
		contentType: false,
		processData: false,
		timeout: 60000,
		xhr: function () {
			var dialog = app.dialog.progress('Mengupload ', 0);
			dialog.setText('0%');
			var xhr = new window.XMLHttpRequest();
			xhr.upload.addEventListener('progress', function (evt) {
				if (evt.lengthComputable) {
					var pct = Math.round((evt.loaded / evt.total) * 100);
					dialog.setProgress(pct);
					dialog.setText(pct + '%');
				}
			}, false);
			return xhr;
		},
		beforeSend: function () {
			internetCheckQueue.check();
		},
		success: function (data) {
			app.dialog.close();
			console.log('✅ Upload response:', data);

			if (data.status === 'success') {
				// Update UI: Sembunyikan tombol FOTO, tampilkan status SELESAI
				jQuery('#btn_foto_' + idx + '_' + pembayaran_id).hide();

				// Tampilkan status selesai di td opsi
				var tdOpsi = jQuery('#btn_foto_' + idx + '_' + pembayaran_id).closest('td');
				tdOpsi.append(
					'<div style="border-radius:4px; font-weight:bold; font-size:11px; margin-top:5px;">' +
					'<i class="f7-icons" style="font-size:14px;">checkmark_circle_fill</i> SELESAI' +
					'</div>'
				);

				// Clear localStorage
				localStorage.removeItem('foto_pembayaran_' + pembayaran_id + '_' + idx);

				// Tutup popup & refresh data
				app.popup.close();
				app.dialog.alert('Foto berhasil diupload!', 'Sukses', function () {
					getDataTransaksi();
				});

			} else {
				app.dialog.alert(data.message || 'Gagal mengupload foto');
			}
		},
		error: function (xhr, status, error) {
			app.dialog.close();
			console.error('❌ Upload error:', error);
			console.error('❌ Response:', xhr.responseText);

			var errorMsg = 'Terjadi kesalahan saat mengupload foto';
			try {
				var response = JSON.parse(xhr.responseText);
				if (response.message) errorMsg = response.message;
			} catch (e) {
				errorMsg += ': ' + error;
			}

			app.dialog.alert(errorMsg);
		}
	});
}



function updateFotoPembayaranProcess() {
	console.log('📤 updateFotoPembayaranProcess called');

	var formData = new FormData();
	var hasFile = false;

	// ========================================
	// VALIDASI: Cek apakah hidden values sudah terisi
	// ========================================
	var pembayaranId = jQuery('#penjualan_id_foto_pembayaran').val();
	var fotoUrutan = jQuery('#foto_urutan').val();

	console.log('📋 Hidden values check:');
	console.log('   - pembayaran_id:', pembayaranId);
	console.log('   - foto_urutan:', fotoUrutan);

	if (!pembayaranId || !fotoUrutan) {
		console.error('❌ Hidden values tidak terisi!');
		app.dialog.alert('Error: Data pembayaran tidak lengkap. Silakan coba lagi.');
		return;
	}

	// ========================================
	// CEK 1: Apakah ada foto dari CAMERA (localStorage)?
	// ========================================
	var base64Image = localStorage.getItem('file_foto_pembayaran');

	if (base64Image && base64Image !== '') {
		console.log('✅ Ada foto dari camera (base64)');

		// Convert base64 to blob
		try {
			var block = base64Image.split(";");
			var contentType = block[0].split(":")[1]; // Get mime type
			var realData = block[1].split(",")[1]; // Get actual base64 data

			// Convert base64 to binary
			var byteCharacters = atob(realData);
			var byteNumbers = new Array(byteCharacters.length);
			for (var i = 0; i < byteCharacters.length; i++) {
				byteNumbers[i] = byteCharacters.charCodeAt(i);
			}
			var byteArray = new Uint8Array(byteNumbers);
			var blob = new Blob([byteArray], { type: contentType });

			// Create file from blob
			var fileName = 'foto_pembayaran_' + Date.now() + '.jpg';
			var file = new File([blob], fileName, { type: contentType });

			formData.append('file_foto_pembayaran', file);
			formData.append('foto_source', 'camera'); // Flag untuk backend
			hasFile = true;

			console.log('✅ Base64 berhasil diconvert ke file:', fileName);
		} catch (error) {
			console.error('❌ Error converting base64:', error);
			app.dialog.alert('Error: Gagal memproses foto dari camera');
			return;
		}
	}
	// ========================================
	// CEK 2: Apakah ada foto dari FILE INPUT (gallery)?
	// ========================================
	else if ($('#file_foto_pembayaran').val() !== "" && $('#file_foto_pembayaran').prop('files')[0]) {
		console.log('✅ Ada foto dari file input (gallery)');

		var fileInput = $('#file_foto_pembayaran').prop('files')[0];
		formData.append('file_foto_pembayaran', fileInput);
		formData.append('foto_source', 'gallery'); // Flag untuk backend
		hasFile = true;

		console.log('✅ File dari gallery:', fileInput.name);
	}
	// ========================================
	// TIDAK ADA FOTO
	// ========================================
	else {
		console.log('❌ Tidak ada foto dari camera maupun file input');
		app.dialog.alert('Harap Isi Foto');
		return;
	}

	// ========================================
	// JIKA ADA FILE, LANJUT UPLOAD
	// ========================================
	if (hasFile) {
		// Append data lainnya
		formData.append('penjualan_id_foto_pembayaran', pembayaranId);
		formData.append('foto_urutan', fotoUrutan);

		console.log('📤 Uploading foto...');
		console.log('   - pembayaran_id:', pembayaranId);
		console.log('   - foto_urutan:', fotoUrutan);

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
			beforeSend: function () {
				internetCheckQueue.check(); try { app.dialog.preloader('Harap Tunggu...'); } catch (e) { }
			},
			success: function (data) {
				app.popup.close();
				app.popup.close();
				app.dialog.close();

				console.log('✅ Upload response:', data);

				if (data.status == 'done') {
					app.dialog.alert('Berhasil Update Foto');

					// Clear localStorage dan file input
					localStorage.removeItem('file_foto_pembayaran');
					$('#file_foto_pembayaran').val('');
					$('#file_foto_pembayaran_view').attr('src', '');

					localStorage.removeItem("id_transaksi_kas");
				} else if (data.status == 'failed') {
					app.dialog.alert('Gagal Update Foto: ' + (data.message || 'Unknown error'));
				}
			},
			error: function (xhr, status, error) {
				app.dialog.close();
				console.error('❌ Upload error:', error);
				console.error('❌ Response:', xhr.responseText);
				app.dialog.alert('Error: Gagal upload foto. ' + error);
			}
		});
	}
}

jQuery(document).on('change', '#file_foto_pembayaran', function (e) {
	const file = e.target.files[0];
	if (!file) return;

	console.log('📁 File dipilih dari galeri:', file.name);

	// Validasi tipe file
	if (!file.type.match('image.*')) {
		app.dialog.alert('File harus berupa gambar');
		jQuery(this).val('');
		return;
	}

	// Preview foto
	const reader = new FileReader();
	reader.onload = function (evt) {
		const base64Image = evt.target.result;

		// Tampilkan preview
		jQuery('#file_foto_pembayaran_view')
			.attr('src', base64Image)
			.show();

		// Hide foto existing (jika ada)
		jQuery('#file_foto_pembayaran_view_now').hide();

		console.log('✅ Preview foto dari galeri ditampilkan');
	};
	reader.readAsDataURL(file);
	console.log('🚀 Langsung upload foto from gallery...');
	updateFotoPembayaranProcess();
});

// === Helpers angka ===
function fmt(n) {
	n = Number(n || 0);
	return n.toLocaleString('id-ID');
}

function unfmt(s) {
	if (s == null) return 0;
	return Number(String(s).replace(/[^\d\-]/g, '')) || 0;
}

/**
 * Update field Jumlah (Nominal + Admin) secara real-time
 * Dipanggil setiap kali user mengetik di field Nominal atau Admin
 */
function updateJumlahPembayaran(idx, id) {
	try {
		console.log(`🔄 updateJumlahPembayaran called: idx=${idx}, id=${id}`);

		// Ambil nilai Nominal dan Admin
		const nominalInput = jQuery(`#pembayaran_${idx}_${id}`);
		const adminInput = jQuery(`#pembayaran_admin_${idx}_${id}`);
		const jumlahInput = jQuery(`#pembayaran_jumlah_${idx}_${id}`);

		if (!nominalInput.length || !adminInput.length || !jumlahInput.length) {
			console.warn('⚠️ Input elements not found');
			return;
		}

		// Unfmt: hapus format ribuan, ambil angka murni
		const nominal = unfmt(nominalInput.val());
		const admin = unfmt(adminInput.val());
		const jumlah = nominal + admin;

		console.log(`   - Nominal: ${nominal}, Admin: ${admin}, Jumlah: ${jumlah}`);

		// Update field Jumlah dengan format ribuan
		jumlahInput.val(fmt(jumlah));

		console.log(`✅ Jumlah updated to: ${fmt(jumlah)}`);
	} catch (error) {
		console.error('❌ Error in updateJumlahPembayaran:', error);
	}
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

	// Generate reference number format
	const refNumber = val.referensi_number || '';
	const refFormat = idx === 1 ? `DP-${refNumber}` : `B${idx - 1}-${refNumber}`;

	return `
    <tr style="background-color:${bg}">
      <td style="border:1px solid white;" class="numeric-cell text-align-center">
        <div style="display: flex; align-items: center; justify-content: center; gap: 5px;">
          <span>${refFormat}</span>
          <i class="f7-icons" 
             style="font-size: 18px; cursor: pointer; color: #4CAF50;" 
             onclick="copyRefNumber('${refFormat}')"
             title="Copy Ref Number">doc_on_doc</i>
        </div>
      </td>
      <td colspan="2" style="border:1px solid white;" class="numeric-cell text-align-left">Bayar ${idx}</td>
      <td style="border:1px solid white;" class="numeric-cell text-align-center">${tgl ? moment(tgl).format('DD-MMM-YYYY') : '-'}</td>
      <td style="border:1px solid white;" class="numeric-cell text-align-left">${bank}</td>
      <td style="border:1px solid white;" class="numeric-cell text-align-right">${fmt(nominal)}</td>
      <td style="border:1px solid white;" class="numeric-cell text-align-right">${fmt(admin)}</td>
      <td style="border:1px solid white;" class="numeric-cell text-align-right">${fmt(jumlah)}</td>
      <td style="border:1px solid white;" class="numeric-cell text-align-left">${ket ? ket : '-'}</td>
      <td style="border:1px solid white;" class="numeric-cell text-align-center">
        <button 
          onclick="showUploadFotoOptions('foto_${idx}','${val.pembayaran_operasional_id}','${idx}','${val.valid}','${val.valid_spy}','${val.keterangan_valid}','${foto || ''}')"
          class="text-add-colour-black-soft ${foto ? 'card-color-blue' : 'bg-dark-gray-young'} button-small col button text-bold"
          style="color:white;">Foto</button>
      </td>
    </tr>
  `;
}



// Fungsi untuk update rekomendasi keterangan saat nominal pembayaran berubah
function updateKeteranganRekomendasi(idx, id, sisa) {
	var inputBayar = jQuery('#pembayaran_' + idx + '_' + id);
	var inputKet = jQuery('#keterangan_' + idx + '_' + id);

	var nilaiInput = unfmt(inputBayar.val());

	// Jika input >= sisa, rekomendasikan "Lunas", jika tidak "Bayar"
	if (nilaiInput >= sisa && sisa > 0) {
		if (inputKet.val() === '' || inputKet.val() === 'Bayar') {
			inputKet.val('Lunas');
		}
	} else {
		if (inputKet.val() === '' || inputKet.val() === 'Lunas') {
			inputKet.val('Bayar');
		}
	}
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
      <table align="center" width="1200px" style="border-collapse:collapse;border:1px solid white;">
        <tr class="bg-dark-gray-medium">
          <td width="15%" style="border:1px solid white;" class="numeric-cell text-align-center">Ref</td>
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
	pembayaran1_tgl, pembayaran2_tgl, pembayaran3_tgl, pembayaran4_tgl, pembayaran5_tgl,
	pembayaran6_tgl, pembayaran7_tgl, pembayaran8_tgl, pembayaran9_tgl, pembayaran10_tgl,
	bank,
	pembayaran_1, pembayaran_2, pembayaran_3, pembayaran_4, pembayaran_5,
	pembayaran_6, pembayaran_7, pembayaran_8, pembayaran_9, pembayaran_10,
	pembelian_jumlah_pembayaran, total_pembelian, pembelian_header_id,
	pembelian_status_pembayaran, pembayaran_pembelian_id, kategori_acc,
	keterangan_acc, admin_acc
) {
	console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
	console.log('📋 detailPembayaran CALLED');
	console.log('   - pembayaran_id:', pembayaran_pembelian_id);
	console.log('   - id_transaksi_acc:', pembelian_header_id);
	console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

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
		} catch (e) {
			num = 0;
		}

		if (num < 0) {
			try {
				app.toast.create({
					text: 'Saldo ' + lsKey.replace('_', ' ') + ' tidak mencukupi untuk membayar.',
					closeTimeout: 3000
				}).open();
			} catch (err) {
				alert('Saldo kas tidak mencukupi untuk membuka detail pembayaran.');
			}
			return false;
		}
	}

	// ===== Lolos guard: buka popup detail-pembayaran =====
	try {
		app.popup.open('.popup.detail-pembayaran');
	} catch (e) {
		console.error('Error opening popup:', e);
	}

	// Clear existing history
	jQuery('#history_pembayaran_multiple').html("");

	// ===== FETCH DATA PEMBAYARAN DARI SERVER =====
	jQuery.ajax({
		type: 'POST',
		url: BASE_API + "/detail-pembayaran-operasional-multiple",
		dataType: 'JSON',
		data: {
			id_transaksi_acc: pembelian_header_id
		},
		beforeSend: function () {
			internetCheckQueue.check();
			try {
				app.dialog.preloader('Harap Tunggu...');
			} catch (e) { }
		},
		success: function (data) {
			app.dialog.close();

			console.log('✅ Data pembayaran loaded:', data);

			// ===== CEK FLAG has_payment =====
			if (!data.has_payment) {
				console.log('🆕 CASE: BELUM ADA DATA PEMBAYARAN - Tampilkan Form Kosong');
				renderEmptyPaymentForm(data, kategori_acc, keterangan_acc, bank, pembelian_header_id);
			} else {
				console.log('📦 CASE: SUDAH ADA DATA PEMBAYARAN - Load Data yang Ada');
				renderExistingPayments(data, kategori_acc, keterangan_acc, bank, pembelian_header_id);
			}
		},
		error: function (xhr, status, error) {
			app.dialog.close();
			console.error('❌ Error loading detail pembayaran:');
			console.error('   - Status:', status);
			console.error('   - Error:', error);
			console.error('   - Response:', xhr.responseText);

			app.dialog.alert('Gagal memuat detail pembayaran: ' + error);
		}
	});

	// Set tanggal header
	$$('#tanggal_pembayaran_choose').html(moment(tanggal_pembelian).format('DD-MMM-YYYY'));
}
/**
 * ========================================
 * RENDER EMPTY PAYMENT FORM (Belum Ada Data)
 * ========================================
 */
function renderEmptyPaymentForm(data, kategori_acc, keterangan_acc, bank, id_transaksi_acc) {
	console.log('🆕 Rendering Empty Payment Form');
	console.log('📦 Data received:', data);

	// Clear inputs
	jQuery("#bayar_pembayaran").val('');

	// Set header info dari transaksi_data
	const transaksiData = data.transaksi_data;

	// ✅ FIX: Gunakan keterangan dari transaksi_data.keterangan (bukan keterangan_acc)
	const displayKeterangan = transaksiData.keterangan || transaksiData.keterangan_acc || keterangan_acc || '-';

	$$('#popup-pembayaran-td-kategori').html(transaksiData.kategori_acc);
	$$('#popup-pembayaran-td-keterangan').html(displayKeterangan);
	$$('#popup-pembayaran-bank').html(bank);
	$$(".bank_pembayaran").val(bank);

	// ===== Simpan id_kategori_acc untuk digunakan saat proses pembayaran =====
	window.current_id_kategori_acc = transaksiData.id_kategori_acc;
	window.current_kategori_acc = transaksiData.kategori_acc;
	window.current_pembayaran_id = null; // Belum ada pembayaran_id

	const nominalOperasional = Number(transaksiData.nominal_acc || 0);
	const adminOperasional = Number(transaksiData.admin_acc || 0);

	console.log('💰 Empty Form Data:');
	console.log('   - ID Transaksi:', transaksiData.id_transaksi_acc);
	console.log('   - Referensi Number:', transaksiData.referensi_number);
	console.log('   - Nominal Operasional:', nominalOperasional);
	console.log('   - Admin:', adminOperasional);

	// ===== BUILD HTML untuk FORM KOSONG (Pembayaran Pertama) =====
	var out = '';

	// ✅ Status Header: Format seperti screenshot (Terbayar dan Sisa)
	out += '<table align="center" width="100%" style="border-collapse:collapse;border:1px solid white;">';
	out += '  <tr>';
	out += '    <td width="50%" style="border:1px solid white;" class="numeric-cell text-align-center">';
	out += '      Terbayar : <br>' + fmt(0);
	out += '    </td>';
	out += '    <td width="50%" style="border:1px solid white;" class="numeric-cell text-align-center">';
	out += '      Sisa : <br>' + fmt(nominalOperasional);
	out += '    </td>';
	out += '  </tr>';
	out += '</table>';

	// ✅ FIX: Build object val yang sesuai dengan yang diharapkan tplInputRow()
	const valObject = {
		id_transaksi_acc: transaksiData.id_transaksi_acc,
		id_kategori_acc: transaksiData.id_kategori_acc,
		nominal_acc: nominalOperasional,
		admin_acc: adminOperasional,
		referensi_number: transaksiData.referensi_number || '',  // ✅ Tambahkan referensi_number
		pembayaran_operasional_id: null, // Belum ada
		// Tambahkan field-field lain yang mungkin dibutuhkan tplInputRow
		pembayaran_1: 0,
		pembayaran1_tgl: null,
		bank_1: null,
		foto_1: null,
		admin_1: 0,
		keterangan_1: null
	};

	console.log('🔧 Building valObject for tplInputRow:', valObject);

	// Table: Pembayaran Ke-1 (Form Input Kosong)
	out += tplTableStart(1);
	out += tplInputRow(1, valObject, nominalOperasional, nominalOperasional, id_transaksi_acc);
	out += tplTableEnd();

	// ===== UPDATE SUMMARY INFO =====
	const summaryData = data.summary || {};

	$$('#popup-pembayaran-penjualan_jumlah_pembayaran').html('0 ,-');
	$$('#popup-pembayaran-penjualan_grandtotal').html(fmt(nominalOperasional) + ' ,-');
	$$('#popup-pembayaran-admin').html(fmt(adminOperasional) + ' ,-');
	$$('#popup-pembayaran-penjualan_kekurangan').html(fmt(nominalOperasional) + ' ,-');

	// Update status badge: Belum Lunas
	$$('#popup-pembayaran-penjualan_status_pembayaran').html('<b>Belum Lunas</b>')
		.removeClass('card-color-blue').addClass('card-color-green');

	// Inject HTML ke DOM
	jQuery('#history_pembayaran_multiple').html(out);

	// ===== Set min date untuk input tanggal =====
	const today = moment().format('YYYY-MM-DD');
	document.querySelectorAll('.date-multiple-pembayaran').forEach(function (el) {
		el.setAttribute('min', today);
	});

	console.log('✅ Empty Payment Form rendering complete');
}

/**
 * ========================================
 * RENDER EXISTING PAYMENTS (Sudah Ada Data)
 * ========================================
 */
function renderExistingPayments(data, kategori_acc, keterangan_acc, bank, id_transaksi_acc) {
	console.log('📦 Rendering Existing Payments');

	// Clear inputs
	jQuery("#bayar_pembayaran").val('');

	// Set header info
	$$('#popup-pembayaran-td-kategori').html(kategori_acc);
	$$('#popup-pembayaran-td-keterangan').html(keterangan_acc);
	$$('#popup-pembayaran-bank').html(bank);
	$$(".bank_pembayaran").val(bank);

	// ===== PENTING: Simpan id_kategori_acc untuk digunakan saat proses pembayaran =====
	if (data.pembayaran_data && data.pembayaran_data.length > 0) {
		var id_kategori = data.pembayaran_data[0].id_kategori_acc;
		console.log('💾 Saving id_kategori_acc for payment:', id_kategori);

		// Simpan ke variabel global
		window.current_id_kategori_acc = id_kategori;
		window.current_kategori_acc = kategori_acc;
		window.current_pembayaran_id = data.pembayaran_data[0].pembayaran_operasional_id;
	} else {
		console.warn('⚠️ No pembayaran_data found, id_kategori_acc might be missing');
	}

	var out = '';

	// ===== LOOP SETIAP PEMBAYARAN DATA (EXISTING LOGIC) =====
	jQuery.each(data.pembayaran_data, function (i, val) {
		console.log('📦 Processing pembayaran data:', val);

		// Calculate total terbayar
		let totalBayar = 0;
		let totalAdmin = 0;
		for (let k = 1; k <= 10; k++) {
			totalBayar += Number(val[`pembayaran_${k}`] || 0);
			totalAdmin += Number(val[`admin_${k}`] || 0);
		}

		const totalOperasional = Number(val.nominal_acc || 0);
		const lunas = totalBayar >= totalOperasional;
		const bg = val.valid_spy == 2 ? '#FF0000' : (lunas ? '#133788' : '');

		console.log('💰 Payment calculation:');
		console.log('   - Total Bayar:', totalBayar);
		console.log('   - Total Admin:', totalAdmin);
		console.log('   - Total Operasional:', totalOperasional);
		console.log('   - Lunas:', lunas);

		// Generate HTML output
		out += tplStatusHeader(val, totalBayar, totalAdmin);
		out += tplTableStart(i + 1);

		// ===== LOGIKA SEQUENTIAL PAYMENT (2-STEP FLOW) =====
		let lastPaidIndex = 0; // Track index pembayaran terakhir yang ada record

		// Loop 1: Tampilkan semua pembayaran yang sudah ada record
		for (let idx = 1; idx <= 10; idx++) {
			const payValue = Number(val[`pembayaran_${idx}`] || 0);
			const payTgl = val[`pembayaran${idx}_tgl`];
			const payBank = val[`bank_${idx}`];
			const payFoto = val[`foto_${idx}`];

			// ✅ Cek ada record (tanggal ATAU bank terisi)
			const hasRecord = payTgl || payBank;

			if (hasRecord) {
				// Ada record → Tampilkan sebagai paid row
				console.log(`   ✅ Payment ${idx}: Has record (shown as paid)`);
				out += tplPaidRow(idx, val, bg);
				lastPaidIndex = idx; // Update index terakhir yang punya record
			} else {
				console.log(`   ⚪ Payment ${idx}: No record (skip)`);
			}
		}

		// Loop 2: Tampilkan 1 FORM INPUT BARU (hanya jika belum lunas)
		if (!lunas) {
			const nextPaymentIndex = lastPaidIndex + 1; // Pembayaran berikutnya

			if (nextPaymentIndex <= 10) {
				const sisaBayar = totalOperasional - totalBayar;
				console.log(`   📝 Showing input for payment ${nextPaymentIndex} (sisa: ${sisaBayar})`);
				out += tplInputRow(nextPaymentIndex, val, sisaBayar, totalOperasional, id_transaksi_acc);
			} else {
				console.log('   ⚠️ All 10 payment slots used');
			}
		} else {
			console.log('   ✅ Payment LUNAS - no new input form');
		}
		// ===== END LOGIKA SEQUENTIAL =====

		out += tplTableEnd();
	});

	// ===== UPDATE SUMMARY INFO =====
	$$('#popup-pembayaran-penjualan_jumlah_pembayaran').html(fmt(data.summary.pembelian_jumlah_pembayaran) + ' ,-');
	$$('#popup-pembayaran-penjualan_grandtotal').html(fmt(parseInt(data.summary.penjualan_grandtotal)) + ' ,-');
	$$('#popup-pembayaran-admin').html(fmt(parseInt(data.summary.penjualan_admin || 0)) + ' ,-');
	$$('#popup-pembayaran-penjualan_kekurangan').html(fmt(parseInt(data.summary.penjualan_grandtotal) - (parseInt(data.summary.pembelian_jumlah_pembayaran) || 0)) + ' ,-');

	// Update status badge
	if (((parseInt(data.summary.penjualan_grandtotal) || 0) - (data.summary.pembelian_jumlah_pembayaran || 0)) <= 0) {
		$$('#popup-pembayaran-penjualan_status_pembayaran').html('<b>Lunas</b>')
			.removeClass('card-color-green').addClass('card-color-blue');
	} else {
		$$('#popup-pembayaran-penjualan_status_pembayaran').html('<b>Belum Lunas</b>')
			.removeClass('card-color-blue').addClass('card-color-green');
	}

	// Inject HTML ke DOM
	jQuery('#history_pembayaran_multiple').html(out);

	// ===== Set min date untuk semua input tanggal dinamis =====
	const today = moment().format('YYYY-MM-DD');
	document.querySelectorAll('.date-multiple-pembayaran').forEach(function (el) {
		el.setAttribute('min', today);
	});

	console.log('✅ Existing Payments rendering complete');
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

			// Jika response memiliki array nohp_list, render ke suggestion box
			if (res && res.nohp_list && res.nohp_list.length > 0) {
				var nohpInputId = type + '_nohp';
				if (typeof renderSuggestions === 'function') {
					renderSuggestions(nohpInputId, res.nohp_list, 'Riwayat No. HP');
				}
			}
		}
	});

	// 1b) Ambil distinct nohp untuk suggestion box
	jQuery.ajax({
		type: 'POST',
		url: '' + BASE_API + '/expedisi-nohp-distinct',
		dataType: 'JSON',
		data: {
			perusahaan: perusahaan,
			lokasi_pabrik: localStorage.getItem('lokasi_pabrik')
		},
		success: function (res) {
			if (res && res.status === 'success' && res.nohp && res.nohp.length > 0) {
				var nohpInputId = type + '_nohp';
				if (typeof renderSuggestions === 'function') {
					renderSuggestions(nohpInputId, res.nohp, 'Riwayat No. HP');
				}
			}
		},
		error: function () {
			// API tidak tersedia, gunakan fallback dari expedisi-distinct jika ada
			console.log('API expedisi-nohp-distinct tidak tersedia');
		}
	});

	// 2) DISTINCT: PLAT, PENGIRIM, DARI -> langsung render + apply default
	ensureDatalist(LIST_PLAT_ID);
	ensureDatalist(LIST_PENGIRIM_ID);
	ensureDatalist(LIST_DARI_ID);

	// tempel datalist ke input yg ada utk type ini (untuk fallback)
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
			var distinct = (res && res.status === 'success' && res.distinct) ? res.distinct : { plat: [], pengirim: [], dari: [], nohp: [] };

			// render datalist (untuk fallback)
			renderOptions(LIST_PLAT_ID, distinct.plat || []);
			renderOptions(LIST_PENGIRIM_ID, distinct.pengirim || []);
			renderOptions(LIST_DARI_ID, distinct.dari || []);

			// === RENDER SUGGESTION BOX untuk No. Plat dan No. HP ===
			// Render suggestion box untuk plat
			var platInputId = type + '_plat';
			if (typeof renderSuggestions === 'function') {
				renderSuggestions(platInputId, distinct.plat || [], 'Riwayat No. Plat');
				// Hapus attribute list dari input plat agar datalist native tidak muncul
				jQuery('#' + platInputId).removeAttr('list');
			}

			// Render suggestion box untuk nohp (jika ada data nohp dari distinct)
			var nohpInputId = type + '_nohp';
			if (typeof renderSuggestions === 'function') {
				// Jika API mengembalikan data nohp
				if (distinct.nohp && distinct.nohp.length > 0) {
					renderSuggestions(nohpInputId, distinct.nohp || [], 'Riwayat No. HP');
				}
				// Hapus attribute list dari input nohp agar datalist native tidak muncul
				jQuery('#' + nohpInputId).removeAttr('list');
			}

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
					internetCheckQueue.check(); try { app.dialog.preloader('Harap Tunggu...'); } catch (e) { }
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
				},
				complete: function () {
					try { app.dialog.close(); } catch (e) { }
				}

			});

		}
	});
}

// ============================================================
// SIMPLIFIED: FOTO UPLOAD - DIRECT PROCESS AFTER CAPTURE
// ============================================================
// Flow: Klik FOTO → Pilih Camera/File → Ambil Foto → Langsung Upload
// Tidak ada: Preview, Lihat Foto, Ganti Foto, Hapus Foto
// ============================================================

/**
 * Fungsi utama yang dipanggil saat klik button FOTO
 * Langsung tampilkan pilihan Camera atau File
 * 
 * @param {string} foto_element_id - ID element input file (contoh: 'foto_bukti_1_123')
 * @param {number} pembayaran_id - ID pembayaran operasional
 * @param {number} idx - Index/nomor urut pembayaran
 */
// ===== VARIABEL GLOBAL UNTUK TRACKING FOTO PEMBAYARAN =====
var currentPhotoInputId = ''; // untuk menyimpan ID input foto pembayaran

// ===== FUNGSI UNTUK MEMBUKA POPUP/TRIGGER UPLOAD FOTO PEMBAYARAN =====
function showUploadFotoOptions(foto_element_id, pembayaran_id, idx, valid, valid_spy, keterangan_valid, existing_foto) {
	console.log('📸 showUploadFotoOptions called');
	console.log('   Foto Element ID:', foto_element_id);
	console.log('   Pembayaran ID:', pembayaran_id);
	console.log('   Index Pembayaran:', idx);
	console.log('   Valid:', valid);
	console.log('   Valid Spy:', valid_spy);
	console.log('   Keterangan Valid:', keterangan_valid);
	console.log('   Existing Foto:', existing_foto);
	console.log('   Existing Foto Type:', typeof existing_foto);

	// Simpan informasi foto saat ini
	currentPhotoInputId = foto_element_id;
	window.detailPembayaranPhotoData = {
		inputId: foto_element_id,
		pembayaranId: pembayaran_id,
		idx: idx,
		valid: valid,
		valid_spy: valid_spy,
		keterangan_valid: keterangan_valid,
		existingFoto: existing_foto
	};

	// ========================================
	// PENTING: SET HIDDEN VALUES untuk auto-submit
	// ========================================
	jQuery('#penjualan_id_foto_pembayaran').val(pembayaran_id);
	jQuery('#foto_urutan').val(idx);
	console.log('✅ Set hidden values - pembayaran_id:', pembayaran_id, 'foto_urutan:', idx);

	// ========================================
	// CEK: Jika SUDAH ADA FOTO
	// ========================================
	var hasFoto = existing_foto &&
		existing_foto !== '' &&
		existing_foto !== 'null' &&
		existing_foto !== 'undefined' &&
		existing_foto !== null &&
		existing_foto !== undefined;

	console.log('   Has Foto?', hasFoto);

	if (hasFoto) {
		console.log('✅ Foto sudah ada, langsung buka popup upload untuk lihat/ganti foto');

		// ========================================
		// ISI NILAI-NILAI DI POPUP
		// ========================================

		// 1. Tampilkan foto existing
		const fotoUrl = BASE_PATH_IMAGE_FOTO_PEMBAYARAN + '/' + existing_foto;
		jQuery('#file_foto_pembayaran_view_now').attr('src', fotoUrl).show();
		console.log('   Foto URL:', fotoUrl);

		// 2. Handle keterangan reject
		if (valid_spy == 2 && keterangan_valid) {
			// Jika reject, tampilkan keterangan dan tombol upload
			jQuery('#keterangan_reject_cicilan').val(keterangan_valid);
			jQuery('#hide_keterangan_reject').show();
			jQuery('#btn_foto_pembayaran_upload').show();
			jQuery('#btn_upload_foto_selesai').show();
			console.log('   Status: REJECT - Tampilkan tombol upload');
		} else {
			// Jika tidak reject, sembunyikan keterangan dan tombol upload
			jQuery('#keterangan_reject_cicilan').val('');
			jQuery('#hide_keterangan_reject').hide();
			jQuery('#btn_foto_pembayaran_upload').hide();
			jQuery('#btn_upload_foto_selesai').hide();
			console.log('   Status: OK - Hanya tampilkan foto');
		}

		// 3. Clear preview upload baru (jika ada)
		jQuery('#file_foto_pembayaran').val('');
		jQuery('#file_foto_pembayaran_view').attr('src', '').hide();
		localStorage.removeItem('file_foto_pembayaran');

		// 4. Buka popup
		app.popup.open('.upload-foto-pembayaran');

		return; // PENTING: Stop di sini, jangan lanjut ke bawah

	} else {
		// ========================================
		// Jika BELUM ADA FOTO, tampilkan popup pilihan
		// ========================================
		console.log('❌ Belum ada foto, tampilkan popup pilihan');

		// Clear previous values
		jQuery('#file_foto_pembayaran').val('');
		jQuery('#file_foto_pembayaran_view').attr('src', '').hide();
		jQuery('#file_foto_pembayaran_view_now').attr('src', '').hide();
		jQuery('#keterangan_reject_cicilan').val('');
		jQuery('#hide_keterangan_reject').hide();
		localStorage.removeItem('file_foto_pembayaran');

		// Tampilkan tombol upload (karena belum ada foto)
		jQuery('#btn_foto_pembayaran_upload').show();
		jQuery('#btn_upload_foto_selesai').show();

		// Buka popup upload langsung (atau bisa pakai popup choice jika ada)
		// app.popup.open('.upload-foto-pembayaran');

		showFotoOptions(pembayaran_id, idx);
	}
}

// ===== FUNGSI HANDLE PILIHAN CAMERA ATAU GALLERY UNTUK PEMBAYARAN =====

function pilihFotoSourcePembayaran(source) {
	console.log('📸 Foto source selected:', source);

	// Tutup popup pilihan
	app.popup.close('.popup-foto-pembayaran-choice');

	const photoData = window.detailPembayaranPhotoData || {};
	const pembayaranId = photoData.pembayaranId;
	const idx = photoData.idx;

	console.log('📋 Photo data:', photoData);

	if (!pembayaranId || !idx) {
		app.toast.create({
			text: 'Error: Data pembayaran tidak ditemukan',
			closeTimeout: 2000
		}).open();
		return;
	}

	// ========================================
	// PERBAIKAN: Gunakan input file yang sudah ada
	// yaitu 'file_foto_pembayaran' dari popup
	// ========================================
	const fileInputId = 'file_foto_pembayaran';

	if (source === 'camera') {
		// Panggil fungsi kamera untuk pembayaran
		console.log('📷 Opening camera...');
		openCameraFotoPembayaran(fileInputId);
	} else if (source === 'gallery') {
		// Trigger input file untuk gallery
		console.log('🖼️ Opening gallery...');
		const fileInput = document.getElementById(fileInputId);
		if (fileInput) {
			fileInput.click();
		} else {
			console.error('❌ File input not found:', fileInputId);
			app.toast.create({
				text: 'Error: Input file tidak ditemukan',
				closeTimeout: 2000
			}).open();
		}
	}
}

/**
 * Get foto data untuk dikirim ke server
 * Fungsi ini dipanggil dari fungsi simpan pembayaran
 * 
 * @param {string} storageKey - Key localStorage (contoh: 'foto_pembayaran_123_1')
 * @returns {string|null} Base64 image atau null jika tidak ada
 */
function getFotoDataForUpload(storageKey) {
	console.log('📤 getFotoDataForUpload called for:', storageKey);

	// Ambil dari localStorage
	var base64Image = localStorage.getItem(storageKey);

	if (base64Image) {
		console.log('✅ Found foto data in localStorage');
		return base64Image;
	}

	console.log('⚠️ No foto data found in localStorage');
	return null;
}

/**
 * Convert base64 to blob
 */
function base64ToBlob(base64Data, defaultMimeType) {
	defaultMimeType = defaultMimeType || 'image/jpeg';

	var mimeType = defaultMimeType;
	var base64String = base64Data;

	// Cek apakah ada prefix "data:...;base64,"
	if (base64Data.indexOf('data:') === 0) {
		var parts = base64Data.split(',');
		if (parts.length >= 2) {
			// Ambil mime type dari prefix
			var mimeMatch = parts[0].match(/data:([^;]+);base64/);
			if (mimeMatch && mimeMatch[1]) {
				mimeType = mimeMatch[1];
			}
			base64String = parts[1];
		}
	}

	// Decode base64
	try {
		var byteCharacters = atob(base64String);
	} catch (e) {
		console.error('❌ base64ToBlob: atob() failed, base64 string tidak valid', e);
		throw new Error('Base64 string tidak valid: ' + e.message);
	}

	var byteNumbers = new Array(byteCharacters.length);
	for (var i = 0; i < byteCharacters.length; i++) {
		byteNumbers[i] = byteCharacters.charCodeAt(i);
	}

	var byteArray = new Uint8Array(byteNumbers);
	return new Blob([byteArray], { type: mimeType });
}

/**
 * Show toast notification
 */
function showToast(message, duration) {
	duration = duration || 2000;

	if (typeof app !== 'undefined' && app.toast) {
		app.toast.create({
			text: message,
			position: 'center',
			closeTimeout: duration
		}).open();
	} else {
		console.log('Toast:', message);
	}
}

/**
 * Helper function untuk convert file URI to base64 (Cordova)
 * Jika belum ada, definisikan di sini
 */
if (typeof getFileContentAsBase64Terima === 'undefined') {
	function getFileContentAsBase64Terima(path, callback) {
		window.resolveLocalFileSystemURL(path, function (fileEntry) {
			fileEntry.file(function (file) {
				var reader = new FileReader();
				reader.onloadend = function (e) {
					callback(this.result);
				};
				reader.readAsDataURL(file);
			});
		});
	}
}


/**
 * ============================================================================
 * STEP 1: Simpan Data Pembayaran Saja (Tanpa Foto)
 * ============================================================================
 * 
 * Fungsi ini digunakan untuk menyimpan data pembayaran (nominal, bank, tanggal, dll)
 * tanpa foto bukti pembayaran.
 * 
 * @param {number} pembayaran_id - ID pembayaran operasional
 * @param {number} number - Urutan pembayaran (1-10)
 */
// ========================================
// FUNGSI SIMPAN DATA PEMBAYARAN
// ========================================
function simpanDataPembayaran(pembayaran_id, idx) {
	console.log('💾 simpanDataPembayaran called:', { pembayaran_id, idx });

	// Ambil nilai dari form
	// CATATAN: saat pembayaran pertama, pembayaran_id bisa 'null' (string) atau null
	var tanggal = jQuery('#tanggal_' + idx + '_' + pembayaran_id).val();
	var bank = jQuery('#bank_' + idx + '_' + pembayaran_id).val();
	var nominal = unfmt(jQuery('#pembayaran_' + idx + '_' + pembayaran_id).val());
	var admin = unfmt(jQuery('#pembayaran_admin_' + idx + '_' + pembayaran_id).val());
	var keterangan = jQuery('#keterangan_' + idx + '_' + pembayaran_id).val();
	var id_transaksi_acc = unfmt(jQuery('#id_transaksi_acc_bayar').val());

	console.log('📋 Form values:', { tanggal, bank, nominal, admin, keterangan, id_transaksi_acc });

	// Validasi
	if (!tanggal) {
		app.dialog.alert('Harap pilih tanggal pembayaran');
		return;
	}
	if (!bank) {
		app.dialog.alert('Harap pilih bank pembayaran');
		return;
	}
	if (nominal <= 0) {
		app.dialog.alert('Nominal pembayaran harus lebih dari 0');
		return;
	}
	if (!id_transaksi_acc) {
		app.dialog.alert('Error: ID transaksi tidak ditemukan. Silakan tutup dan buka ulang popup.');
		return;
	}

	// Kirim data ke server
	jQuery.ajax({
		type: 'POST',
		url: BASE_API + '/simpan-pembayaran-operasional',
		dataType: 'JSON',
		data: {
			pembayaran_id: (pembayaran_id === 'null' || pembayaran_id === null) ? '' : pembayaran_id,
			urutan: idx,
			tanggal: tanggal,
			bank: bank,
			nominal: nominal,
			admin: admin,
			keterangan: keterangan,
			id_transaksi_acc: id_transaksi_acc,
			user_id: localStorage.getItem('user_id') || ''
		},
		beforeSend: function () {
			internetCheckQueue.check();
			try { app.dialog.preloader('Menyimpan...'); } catch (e) { }
		},
		success: function (data) {
			app.dialog.close();
			console.log('✅ Simpan response:', data);

			if (data.status === 'success' || data.status === 'done') {

				// ============================================================
				// KRITIS: Ambil pembayaran_id BARU dari response backend
				// Backend harus mengembalikan pembayaran_operasional_id
				// ============================================================
				var newPembayaranId = null;

				if (data.data && data.data.pembayaran_operasional_id) {
					newPembayaranId = data.data.pembayaran_operasional_id;
				} else if (data.pembayaran_operasional_id) {
					newPembayaranId = data.pembayaran_operasional_id;
				} else if (data.id) {
					newPembayaranId = data.id;
				}

				console.log('🆔 New pembayaran_id from server:', newPembayaranId);

				if (!newPembayaranId) {
					// Backend tidak mengembalikan ID — tampilkan warning tapi tetap update UI
					console.warn('⚠️ Backend tidak mengembalikan pembayaran_operasional_id!');
					console.warn('   Pastikan endpoint /simpan-pembayaran-operasional mengembalikan pembayaran_operasional_id di response');
					// Lanjutkan dengan pembayaran_id lama (mungkin sudah ada)
					newPembayaranId = pembayaran_id;
				}

				// ============================================================
				// UPDATE UI: Ganti semua element ID lama (null) dengan ID baru
				// ============================================================
				if (newPembayaranId && newPembayaranId !== pembayaran_id) {
					console.log('🔄 Updating element IDs:', pembayaran_id, '→', newPembayaranId);
					updateElementIds(pembayaran_id, newPembayaranId, idx);
					// Gunakan newPembayaranId untuk update UI selanjutnya
					pembayaran_id = newPembayaranId;
				}

				// Update UI: Disable form inputs
				jQuery('#tanggal_' + idx + '_' + pembayaran_id).prop('disabled', true);
				jQuery('#bank_' + idx + '_' + pembayaran_id).prop('disabled', true);
				jQuery('#pembayaran_' + idx + '_' + pembayaran_id).prop('disabled', true);
				jQuery('#pembayaran_admin_' + idx + '_' + pembayaran_id).prop('disabled', true);
				jQuery('#keterangan_' + idx + '_' + pembayaran_id).prop('disabled', true);

				// Update UI: Sembunyikan SIMPAN, tampilkan FOTO
				jQuery('#btn_simpan_' + idx + '_' + pembayaran_id).hide();
				jQuery('#btn_foto_' + idx + '_' + pembayaran_id).show();

				// Simpan pembayaran_id baru ke global untuk digunakan showFotoOptions
				window.current_pembayaran_id = pembayaran_id;

				app.dialog.alert('Data pembayaran berhasil disimpan! Silakan upload foto bukti.', 'Sukses');

			} else {
				app.dialog.alert(data.message || 'Gagal menyimpan data pembayaran');
			}
		},
		error: function (xhr, status, error) {
			app.dialog.close();
			console.error('❌ Error simpan:', error);
			console.error('   Response:', xhr.responseText);
			app.dialog.alert('Terjadi kesalahan saat menyimpan data: ' + error);
		}
	});
}

// ============================================================
// FUNGSI HELPER BARU: Update semua element ID di DOM
// Dipanggil setelah simpan berhasil dan dapat pembayaran_id baru
// ============================================================
function updateElementIds(oldId, newId, idx) {
	console.log('🔄 updateElementIds: old=' + oldId + ' new=' + newId + ' idx=' + idx);

	// Daftar semua element yang ID-nya perlu diupdate
	var elementIds = [
		'tanggal_' + idx + '_' + oldId,
		'bank_' + idx + '_' + oldId,
		'pembayaran_' + idx + '_' + oldId,
		'pembayaran_admin_' + idx + '_' + oldId,
		'pembayaran_jumlah_' + idx + '_' + oldId,
		'keterangan_' + idx + '_' + oldId,
		'btn_simpan_' + idx + '_' + oldId,
		'btn_foto_' + idx + '_' + oldId,
		'foto_bukti_' + idx + '_' + oldId,
		'foto_preview_' + idx + '_' + oldId,
	];

	elementIds.forEach(function (oldElementId) {
		var el = document.getElementById(oldElementId);
		if (el) {
			var newElementId = oldElementId.replace('_' + oldId, '_' + newId);
			el.id = newElementId;
			console.log('   ✅ Updated:', oldElementId, '→', newElementId);
		}
	});

	// Update juga onclick di btn_foto jika ada
	var btnFoto = document.getElementById('btn_foto_' + idx + '_' + newId);
	if (btnFoto) {
		btnFoto.setAttribute('onclick', "showFotoOptions('" + newId + "', '" + idx + "')");
	}

	// Update form ID
	var form = document.getElementById('pembayaran_form_multiple_' + idx + '_' + oldId);
	if (form) {
		form.id = 'pembayaran_form_multiple_' + idx + '_' + newId;
	}
}


// ========================================
// FUNGSI SHOW POPUP PILIHAN FOTO (Camera/Gallery)
// VERSION: Extra Small & Compact
// ========================================
function showFotoOptions(pembayaran_id, idx) {
	console.log('📋 showFotoOptions:', { pembayaran_id, idx });

	// Validasi pembayaran_id
	if (!pembayaran_id || pembayaran_id === 'null' || pembayaran_id === 'undefined') {
		app.dialog.alert(
			'Data pembayaran belum tersimpan.\n\nSilakan klik tombol SIMPAN terlebih dahulu, lalu klik FOTO.',
			'Perhatian'
		);
		return;
	}

	var modalId = 'foto-modal-' + pembayaran_id + '-' + idx;

	// Hapus modal lama jika ada
	var existingModal = document.getElementById(modalId);
	if (existingModal) existingModal.remove();

	var modalHTML = '<div id="' + modalId + '" style="' +
		'position:fixed; top:0; left:0; width:100%; height:100%;' +
		'background:rgba(0,0,0,0.5); display:flex; align-items:center;' +
		'justify-content:center; z-index:99999;' +
		'" onclick="if(event.target.id===\'' + modalId + '\') closeFotoModal(\'' + modalId + '\')">' +
		'<div style="position:relative; z-index:2; width:90%; max-width:300px;' +
		'background:white; border-radius:12px; box-shadow:0 8px 24px rgba(0,0,0,0.3);' +
		'padding:16px;">' +
		'<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">' +
		'<h4 style="margin:0; font-size:16px; font-weight:600; color:#333;">Upload Foto</h4>' +
		'<a href="#" onclick="closeFotoModal(\'' + modalId + '\'); return false;" style="color:#999; text-decoration:none;">' +
		'<i class="f7-icons" style="font-size:22px;">xmark_circle</i></a>' +
		'</div>' +
		'<div style="display:flex; gap:8px;">' +
		'<button type="button" onclick="pilihKamera(\'' + pembayaran_id + '\', \'' + idx + '\'); closeFotoModal(\'' + modalId + '\');"' +
		' style="flex:1; height:60px; background:#2196F3; border:none; border-radius:8px;' +
		'color:white; font-size:12px; display:flex; flex-direction:column;' +
		'align-items:center; justify-content:center; cursor:pointer; font-family:inherit;">' +
		'<i class="f7-icons" style="font-size:26px; margin-bottom:2px;">camera_fill</i>' +
		'<span>Kamera</span></button>' +
		'<button type="button" onclick="pilihGaleri(\'' + pembayaran_id + '\', \'' + idx + '\'); closeFotoModal(\'' + modalId + '\');"' +
		' style="flex:1; height:60px; background:#4CAF50; border:none; border-radius:8px;' +
		'color:white; font-size:12px; display:flex; flex-direction:column;' +
		'align-items:center; justify-content:center; cursor:pointer; font-family:inherit;">' +
		'<i class="f7-icons" style="font-size:26px; margin-bottom:2px;">photo_fill</i>' +
		'<span>Galeri</span></button>' +
		'</div></div></div>';

	var modalElement = document.createElement('div');
	modalElement.innerHTML = modalHTML;
	document.body.appendChild(modalElement.firstElementChild);
}

// ========================================
// FUNGSI CLOSE MODAL
// ========================================
function closeFotoModal(modalId) {
	console.log('🔒 Closing modal:', modalId);
	const modal = document.getElementById(modalId);
	if (modal) {
		// Fade out animation
		modal.style.opacity = '0';
		modal.style.transition = 'opacity 0.2s ease-out';

		setTimeout(() => {
			modal.remove();
		}, 200);
	}
}


// ========================================
// FUNGSI PILIH KAMERA
// ========================================
function pilihKamera(pembayaran_id, idx) {
	console.log('📷 pilihKamera called:', { pembayaran_id, idx });

	// Tutup popup
	app.popup.close('.popup-foto-options');

	// Buka kamera
	openCameraForPembayaran(pembayaran_id, idx);
}

// ========================================
// FUNGSI PILIH GALERI
// ========================================
window.pilihGaleri = function (pembayaran_id, idx) {
	console.log('🖼️ [FIX] pilihGaleri called:', { pembayaran_id, idx });

	const inputId = `foto_bukti_${idx}_${pembayaran_id}`;
	let $fileInput = jQuery(`#${inputId}`);

	console.log('🔍 Looking for input:', inputId);
	console.log('📍 Input found:', $fileInput.length > 0);

	// ✅ SOLUSI: Buat input baru jika tidak ditemukan
	if ($fileInput.length === 0) {
		console.log('⚠️ Input tidak ditemukan, membuat input baru...');

		// Buat input file baru
		const fileInput = document.createElement('input');
		fileInput.type = 'file';
		fileInput.id = inputId;
		fileInput.name = inputId;
		fileInput.accept = 'image/*';
		fileInput.style.display = 'none';

		// Tambahkan ke body
		document.body.appendChild(fileInput);

		// Update jQuery reference
		$fileInput = jQuery(`#${inputId}`);

		console.log('✅ Input baru dibuat:', inputId);

		// Attach event handler langsung
		$fileInput.on('change', function (e) {
			const file = e.target.files[0];
			if (!file) {
				console.log('⚠️ Tidak ada file dipilih');
				return;
			}

			console.log('📁 File dipilih:', file.name);

			// Validasi tipe file
			if (!file.type.match('image.*')) {
				app.dialog.alert('File harus berupa gambar');
				jQuery(this).val('');
				return;
			}

			// Preview foto
			const reader = new FileReader();
			reader.onload = function (evt) {
				const base64Image = evt.target.result;

				// Tampilkan preview
				const previewId = `foto_preview_${idx}_${pembayaran_id}`;
				console.log('🖼️ Menampilkan preview di:', previewId);

				jQuery(`#${previewId}`)
					.attr('src', base64Image)
					.show();

				console.log('✅ Preview ditampilkan');

				// Upload foto (urutan parameter: pembayaran_id, idx)
				console.log('📤 Memanggil uploadFotoPembayaran dengan:', {
					pembayaran_id: pembayaran_id,
					idx: idx,
					fileName: file.name
				});

				uploadFotoPembayaran(pembayaran_id, idx, file, 'gallery');
			};

			reader.readAsDataURL(file);

			// Reset input value
			jQuery(this).val('');
		});
	}

	// Trigger click
	console.log('👆 Triggering file input click...');
	setTimeout(function () {
		$fileInput.click();
		console.log('✅ File input clicked');
	}, 200);
};

// OVERRIDE fungsi handleFileInputChange jika belum ada
if (typeof window.handleFileInputChange !== 'function') {
	window.handleFileInputChange = function (e, pembayaran_id, idx) {
		const file = e.target.files[0];
		if (!file) return;

		console.log('📁 File dipilih dari galeri:', file.name);

		// Validasi tipe file
		if (!file.type.match('image.*')) {
			app.dialog.alert('File harus berupa gambar');
			jQuery(e.target).val('');
			return;
		}

		// Preview foto
		const reader = new FileReader();
		reader.onload = function (evt) {
			const base64Image = evt.target.result;

			jQuery(`#foto_preview_${idx}_${pembayaran_id}`)
				.attr('src', base64Image)
				.show();

			console.log('✅ Preview displayed');

			// Upload (pastikan urutan parameter benar)
			uploadFotoPembayaran(pembayaran_id, idx, file, 'gallery');
		};

		reader.readAsDataURL(file);

		// Reset input
		jQuery(e.target).val('');
	};
}

// ========================================
// FUNGSI BUKA KAMERA UNTUK PEMBAYARAN
// ========================================
function openCameraForPembayaran(pembayaran_id, idx) {
	console.log('📷 openCameraForPembayaran:', { pembayaran_id, idx });

	// Validasi Camera plugin
	if (typeof navigator.camera === 'undefined' || typeof Camera === 'undefined') {
		app.dialog.alert('Kamera tidak tersedia. Silakan gunakan opsi Galeri.', 'Error');
		return;
	}

	var options = {
		quality: 80,
		// PENTING: Gunakan DATA_URL agar langsung dapat base64
		destinationType: Camera.DestinationType.DATA_URL,
		sourceType: Camera.PictureSourceType.CAMERA,
		encodingType: Camera.EncodingType.JPEG,
		mediaType: Camera.MediaType.PICTURE,
		correctOrientation: true,
		saveToPhotoAlbum: false,
		targetWidth: 1024,
		targetHeight: 1024
	};

	navigator.camera.getPicture(
		function cameraSuccess(imageData) {
			console.log('✅ Camera success');
			console.log('   imageData type:', typeof imageData);
			console.log('   imageData length:', imageData ? imageData.length : 0);
			console.log('   imageData prefix:', imageData ? imageData.substring(0, 30) : 'null');

			// Ketika destinationType = DATA_URL, imageData adalah pure base64 TANPA prefix
			// Kita perlu tambahkan prefix agar base64ToBlob bisa parse dengan benar
			var base64Image;
			if (imageData && imageData.indexOf('data:') === 0) {
				// Sudah ada prefix
				base64Image = imageData;
			} else {
				// Belum ada prefix, tambahkan
				base64Image = 'data:image/jpeg;base64,' + imageData;
			}

			console.log('✅ base64Image ready, length:', base64Image.length);

			// Preview foto di tabel
			jQuery('#foto_preview_' + idx + '_' + pembayaran_id)
				.attr('src', base64Image)
				.show();

			// Simpan ke localStorage sebagai backup
			try {
				localStorage.setItem('foto_pembayaran_' + pembayaran_id + '_' + idx, base64Image);
				console.log('💾 Saved to localStorage');
			} catch (storageErr) {
				// localStorage mungkin penuh, tapi lanjut upload
				console.warn('⚠️ localStorage save failed (mungkin penuh):', storageErr.message);
			}

			// Langsung upload foto
			uploadFotoPembayaran(pembayaran_id, idx, base64Image, 'camera');
		},
		function cameraError(error) {
			console.error('❌ Camera error:', error);
			app.dialog.alert(
				'Tidak dapat membuka kamera. Pastikan aplikasi memiliki izin kamera atau gunakan opsi Galeri.',
				'Error Kamera'
			);
		},
		options
	);
}


/**
 * ============================================================================
 * Event Handler: File Input Change (Gallery)
 * ============================================================================
 */
jQuery(document).on('change', '[id^="foto_bukti_"]', function (e) {
	const file = e.target.files[0];
	if (!file) return;

	console.log('📁 File dipilih dari galeri:', file.name);

	// Validasi tipe file
	if (!file.type.match('image.*')) {
		app.dialog.alert('File harus berupa gambar');
		jQuery(this).val('');
		return;
	}

	// Parse ID untuk mendapatkan pembayaran_id dan idx
	const inputId = this.id; // format: foto_bukti_{idx}_{pembayaran_id}
	const matches = inputId.match(/foto_bukti_(\d+)_(\d+)/);

	if (!matches) {
		console.error('❌ Invalid input ID format:', inputId);
		return;
	}

	const idx = matches[1];
	const pembayaran_id = matches[2];

	console.log('✅ Parsed data:', { idx, pembayaran_id });

	// Preview foto
	const reader = new FileReader();
	reader.onload = function (evt) {
		const base64Image = evt.target.result;

		// ✅ FIX: Perbaiki syntax error (backtick di tempat yang salah)
		jQuery(`#foto_preview_${idx}_${pembayaran_id}`)
			.attr('src', base64Image)
			.show();

		console.log('✅ Preview displayed');

		// Langsung upload foto
		uploadFotoPembayaran(pembayaran_id, idx, file, 'gallery');
	};

	reader.readAsDataURL(file);
});

console.log('✅ Pembayaran 2-Step Flow Functions Loaded');

// ============================================================
// INISIALISASI
// ============================================================
console.log('✅ Simplified Foto Upload Functions Loaded (Direct Process After Capture)');