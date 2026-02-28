['#detail_nominal', '#edit_nominal', '#tambah_nominal'].forEach(function (el) {
	$(el).mask('000,000,000,000', { reverse: true });
});

// Fungsi helper untuk format plat// Fungsi helper untuk filter angka saja// Fungsi base untuk membuka kamera
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


function openCameraFotoPembayaran(id) {
	console.log('📷 Opening camera for:', id);

	// Validasi Camera plugin
	if (typeof navigator.camera === 'undefined' || typeof Camera === 'undefined') {
		console.error('❌ Cordova Camera plugin tidak tersedia');
		app.dialog.alert('Camera plugin tidak tersedia. Silakan gunakan pilihan Gallery untuk upload foto.', 'Error');
		return;
	}

	var srcType = Camera.PictureSourceType.CAMERA;
	var options = setOptionsTerima(srcType);

	navigator.camera.getPicture(function cameraSuccess(imageUri) {
		console.log('✅ Camera success:', imageUri);

		// Convert to base64 and save to localStorage
		toDataURL(imageUri, function (dataUrl) {
			if (!dataUrl) {
				console.error('❌ Failed to convert image to base64');
				app.dialog.alert('Gagal memproses foto. Silakan coba lagi.', 'Error');
				return;
			}

			console.log('✅ Base64 conversion success');
			localStorage.setItem(id, dataUrl);

			// ========================================
			// MODIFIKASI: Langsung proses pembayaran setelah foto diambil
			// ========================================
			console.log('🚀 Auto-submit pembayaran after camera...');

			// Ekstrak pembayaran_id dan number dari id (format: foto_bukti_NUMBER_PEMBAYARAN_ID)
			var parts = id.split('_');
			if (parts.length >= 4) {
				var number = parts[2]; // index ke-2 adalah number
				var pembayaran_id = parts[3]; // index ke-3 adalah pembayaran_id

				console.log('   - Number:', number);
				console.log('   - Pembayaran ID:', pembayaran_id);

				// Simpan foto ke storage key yang digunakan prosesPembayaranMultiple
				var storageKey = 'foto_pembayaran_' + pembayaran_id + '_' + number;
				localStorage.setItem(storageKey, dataUrl);
				console.log('   - Saved to:', storageKey);

				// Panggil fungsi proses pembayaran
				setTimeout(function () {
					prosesPembayaranMultiple(pembayaran_id, number);
				}, 500); // Delay 500ms untuk memastikan UI sudah siap
			} else {
				console.error('❌ Invalid id format:', id);
				app.dialog.alert('Format ID tidak valid. Silakan coba lagi.', 'Error');
			}
		});

	}, function cameraError(error) {
		console.error('❌ Camera error:', error);

		var errorMsg = 'Gagal mengambil foto';
		if (typeof error === 'string') {
			errorMsg = errorMsg + ': ' + error;
		} else if (error && error.message) {
			errorMsg = errorMsg + ': ' + error.message;
		}

		app.dialog.alert(
			'Tidak dapat membuka kamera. Pastikan:\n' +
			'1. Aplikasi memiliki izin kamera\n' +
			'2. Atau gunakan pilihan Gallery untuk upload foto',
			'Error Kamera'
		);
	}, options);
}

// ==========================================
// MODIFIKASI: Event handler untuk gallery/file input
// ==========================================
jQuery(document).on('change', 'input[type="file"][id^="foto_bukti_"]', function (e) {
	const file = e.target.files[0];
	const inputId = this.id; // foto_bukti_NUMBER_PEMBAYARAN_ID

	console.log('📁 File foto pembayaran dipilih dari gallery:', file ? file.name : 'none');
	console.log('   - Input ID:', inputId);

	if (!file) {
		console.log('⚠️ No file selected');
		return;
	}

	// Validasi tipe file
	if (!file.type.match('image.*')) {
		app.dialog.alert('File harus berupa gambar (JPG, PNG, dll)', 'Error');
		jQuery(this).val('');
		return;
	}

	// Validasi ukuran file (max 10MB)
	// const maxSize = 10 * 1024 * 1024; // 10MB
	// if (file.size > maxSize) {
	// 	app.dialog.alert('Ukuran file maksimal 10MB. File Anda: ' + (file.size / (1024 * 1024)).toFixed(2) + ' MB', 'Error');
	// 	jQuery(this).val('');
	// 	return;
	// }

	console.log('✅ File validation passed');
	console.log('   - File size:', (file.size / 1024).toFixed(2), 'KB');
	console.log('   - File type:', file.type);

	// Convert file to base64
	const reader = new FileReader();

	reader.onload = function (event) {
		const base64Data = event.target.result;

		if (!base64Data) {
			console.error('❌ Failed to read file');
			app.dialog.alert('Gagal membaca file. Silakan coba lagi.', 'Error');
			jQuery(this).val('');
			return;
		}

		console.log('✅ File converted to base64');
		console.log('   - Base64 size:', base64Data.length, 'characters');

		// Simpan ke localStorage dengan key yang sama seperti kamera
		localStorage.setItem(inputId, base64Data);

		// ========================================
		// MODIFIKASI: Langsung proses pembayaran setelah foto dipilih
		// ========================================
		console.log('🚀 Auto-submit pembayaran after gallery selection...');

		// Ekstrak pembayaran_id dan number dari inputId (format: foto_bukti_NUMBER_PEMBAYARAN_ID)
		var parts = inputId.split('_');
		if (parts.length >= 4) {
			var number = parts[2]; // index ke-2 adalah number
			var pembayaran_id = parts[3]; // index ke-3 adalah pembayaran_id

			console.log('   - Number:', number);
			console.log('   - Pembayaran ID:', pembayaran_id);

			// Simpan foto ke storage key yang digunakan prosesPembayaranMultiple
			var storageKey = 'foto_pembayaran_' + pembayaran_id + '_' + number;
			localStorage.setItem(storageKey, base64Data);
			console.log('   - Saved to:', storageKey);

			// Panggil fungsi proses pembayaran
			setTimeout(function () {
				prosesPembayaranMultiple(pembayaran_id, number);
			}, 500); // Delay 500ms untuk memastikan UI sudah siap
		} else {
			console.error('❌ Invalid inputId format:', inputId);
			app.dialog.alert('Format ID tidak valid. Silakan coba lagi.', 'Error');
		}
	};

	reader.onerror = function (error) {
		console.error('❌ Error reading file:', error);
		app.dialog.alert('Error: Gagal membaca file. Silakan coba lagi.', 'Error');
		jQuery(this).val('');
	};

	reader.readAsDataURL(file);
});

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

	var id_transaksi = '';
	if (localStorage.getItem("pengajuan") != 'notif') {
		id_transaksi = 'empty';
	} else {
		id_transaksi = localStorage.getItem('id_transaksi_kas');
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
					id_transaksi: id_transaksi,
					lokasi_pabrik: localStorage.getItem('lokasi_pabrik')
				},
				success: function (data) {
					var data_tools = '';
					var no = 0;
					var nominal_debet = 0;
					var nominal_kredit = 0;
					var nominal_asal = 0;

					if (data && data.data && data.data.length > 0) {
						jQuery.each(data.data, function (i, val) {
							no++;

							if (data.count_valid && data.count_valid[val.id_transaksi_acc] != null) {
								val.count_valid = data.count_valid[val.id_transaksi_acc];
							} else {
								val.count_valid = 0;
							}

							var total_bayar = parseFloat(val.operasional_jumlah_pembayaran || 0);
							var nominal = parseFloat(val.nominal_acc || 0);
							var sisa = nominal - total_bayar;

							if (val.type_pembayaran == 'cicilan') {
								// tampilkan sisa yang belum dibayar (atau sesuai kebutuhanmu)
								nominal_asal = (sisa > 0) ? sisa : total_bayar;
							} else {
								// LUNAS / non-cicilan: tampilkan nominal transaksi
								nominal_asal = nominal;
							}

							// console.log('id = ' + val.id_transaksi_acc + ' ,sisa = ' + sisa);
							// ===== Warna tombol bayar =====
							var color_btn_byr = 'bg-dark-gray-young text-add-colour-black-soft';
							if (sisa <= 0) {
								// Sudah lunas
								color_btn_byr = 'btn-color-blueWhite';
							} else if (sisa > 0 && val.pembayaran1_tgl != null) {
								// Masih ada sisa DAN sudah ada pembayaran
								// Maka warna hijau (cicilan berjalan) ✅
								color_btn_byr = 'btn-color-greenWhite';
							} else {
								// Belum ada pembayaran sama sekali
								color_btn_byr = 'bg-dark-gray-young text-add-colour-black-soft';
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

							// Escape keterangan_acc untuk digunakan di onclick handler
							var keterangan_acc_escaped = keterangan_acc
								.replace(/\\/g, '\\\\')   // escape backslash
								.replace(/'/g, "\\'")     // escape single quote
								.replace(/"/g, '\\"')     // escape double quote
								.replace(/\n/g, '\\n')    // escape newline ← INI YANG PENTING!
								.replace(/\r/g, '\\r')    // escape carriage return
								.replace(/\t/g, '\\t');   // escape tab

							var validSpy = parseInt(val.valid_spy, 10);
							var valid = parseInt(val.valid, 10);
							var validPembayaran = parseInt(data.count_valid[val.id_transaksi_acc], 10);

							let nominal_tampil = (validSpy === 2 || valid === 2) ? number_format(0) : number_format(nominal_asal);

							data_tools += '<tr class="' + color_row + '"' + row_style + '>';
							data_tools += '  <td align="center" style="border-left:1px solid grey;border-bottom:1px solid grey;" class="label-cell">' + no + '</td>';
							data_tools += '  <td align="center" style="border-left:1px solid grey;border-bottom:1px solid grey;" class="label-cell">' + moment(val.tanggal_transaksi).format('DD-MMM-YYYY') + '</td>';
							data_tools += '  <td align="left"   style="border-left:1px solid grey;border-bottom:1px solid grey;" class="label-cell">' + (val.kategori_acc || '') + '</td>';
							data_tools += kolom_ket;
							data_tools += '  <td align="right"  style="border-left:1px solid grey;border-bottom:1px solid grey;border-right:1px solid gray;" class="label-cell">' + nominal_tampil + '</td>';
							data_tools += '  <td align="right"  style="border-bottom:1px solid grey;border-right:1px solid gray;" class="label-cell">' + number_format(val.admin_acc) + '</td>';

							if (val.type_pembayaran == 'cicilan') {
								if (validSpy === 2 || valid === 2 || validPembayaran > 0 || nominal_asal === 0) {
									data_tools += '  <td style="border-top:1px solid gray;" class="label-cell">';
									data_tools += '    <a class="card-color-red button-small col button popup-open text-bold"  onclick="detailPembayaran(\'' + val.tanggal_transaksi + '\',\'' + val.bank_1 + '\',\'' + val.bank_2 + '\',\'' + val.bank_3 + '\',\'' + val.bank_4 + '\',\'' + val.bank_5 + '\',\'' + val.bank_6 + '\',\'' + val.bank_7 + '\',\'' + val.bank_8 + '\',\'' + val.bank_9 + '\',\'' + val.bank_10 + '\',\'' + val.pembayaran1_tgl + '\',\'' + val.pembayaran2_tgl + '\',\'' + val.pembayaran3_tgl + '\',\'' + val.pembayaran4_tgl + '\',\'' + val.pembayaran5_tgl + '\',\'' + val.pembayaran6_tgl + '\',\'' + val.pembayaran7_tgl + '\',\'' + val.pembayaran8_tgl + '\',\'' + val.pembayaran9_tgl + '\',\'' + val.pembayaran10_tgl + '\',\'' + val.bank + '\',\'' + val.pembayaran_1 + '\',\'' + val.pembayaran_2 + '\',\'' + val.pembayaran_3 + '\',\'' + val.pembayaran_4 + '\',\'' + val.pembayaran_5 + '\',\'' + val.pembayaran_6 + '\',\'' + val.pembayaran_7 + '\',\'' + val.pembayaran_8 + '\',\'' + val.pembayaran_9 + '\',\'' + val.pembayaran_10 + '\',\'' + val.operasional_jumlah_pembayaran + '\',\'' + val.nominal_acc + '\',\'' + val.id_transaksi_acc + '\',\'' + val.operasional_status_pembayaran + '\',\'' + val.pembayaran_operasional_id + '\',\'' + val.kategori_acc + '\',\'' + keterangan_acc_escaped + '\',\'' + val.admin_acc + '\');">Bayar</a>';
									data_tools += '  </td>';
								} else {
									data_tools += '  <td style="border-top:1px solid gray;" class="label-cell">';
									data_tools += '    <a class="' + color_btn_byr + ' button-small col button popup-open text-bold"  onclick="detailPembayaran(\'' + val.tanggal_transaksi + '\',\'' + val.bank_1 + '\',\'' + val.bank_2 + '\',\'' + val.bank_3 + '\',\'' + val.bank_4 + '\',\'' + val.bank_5 + '\',\'' + val.bank_6 + '\',\'' + val.bank_7 + '\',\'' + val.bank_8 + '\',\'' + val.bank_9 + '\',\'' + val.bank_10 + '\',\'' + val.pembayaran1_tgl + '\',\'' + val.pembayaran2_tgl + '\',\'' + val.pembayaran3_tgl + '\',\'' + val.pembayaran4_tgl + '\',\'' + val.pembayaran5_tgl + '\',\'' + val.pembayaran6_tgl + '\',\'' + val.pembayaran7_tgl + '\',\'' + val.pembayaran8_tgl + '\',\'' + val.pembayaran9_tgl + '\',\'' + val.pembayaran10_tgl + '\',\'' + val.bank + '\',\'' + val.pembayaran_1 + '\',\'' + val.pembayaran_2 + '\',\'' + val.pembayaran_3 + '\',\'' + val.pembayaran_4 + '\',\'' + val.pembayaran_5 + '\',\'' + val.pembayaran_6 + '\',\'' + val.pembayaran_7 + '\',\'' + val.pembayaran_8 + '\',\'' + val.pembayaran_9 + '\',\'' + val.pembayaran_10 + '\',\'' + val.operasional_jumlah_pembayaran + '\',\'' + val.nominal_acc + '\',\'' + val.id_transaksi_acc + '\',\'' + val.operasional_status_pembayaran + '\',\'' + val.pembayaran_operasional_id + '\',\'' + val.kategori_acc + '\',\'' + keterangan_acc_escaped + '\',\'' + val.admin_acc + '\');">Bayar</a>';
									data_tools += '  </td>';
								}
							} else {
								data_tools += '  <td style="border-top:1px solid gray;"></td>';
							}

							console.log('nominal_tampil :', nominal_tampil, 'ID_TRANSAKSI : ', val.id_transaksi_acc)

							if (validSpy === 2 || valid === 2 || nominal_asal === 0) {
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
			jQuery("#detail_bank_rekening").text(d.perusahaan_bank_rekening || "-");
			jQuery("#detail_no_rekening").text(d.perusahaan_no_rekening || "-");
			jQuery("#detail_nama_rekening").text(d.perusahaan_nama_rekening || "-");
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
			jQuery("#edit_bank_rekening").val(data.data.perusahaan_bank_rekening);
			jQuery("#edit_no_rekening").val(data.data.perusahaan_no_rekening);
			jQuery("#edit_nama_rekening").val(data.data.perusahaan_nama_rekening);
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

			// Compress
			fotoBlob = await compressImage(file, {
				maxSizeMB: 4,
				maxWidthOrHeight: 1920,
				quality: 0.8
			});

			console.log('✅ Photo compressed:', formatBytes(fotoBlob.size));
		} else {
			// Gunakan foto dari localStorage (sudah tercompress sebelumnya)
			console.log('📦 Using photo from localStorage');
			fotoBlob = base64ToBlob(fotoFromStorage);
		}

		// ✅ PERUBAHAN 3: Buat FormData dengan foto tercompress
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
				app.dialog.preloader('Mengunggah transaksi...');
			},
			success: function (data) {
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

			// Compress
			fotoBlob = await compressImage(file, {
				maxSizeMB: 4,
				maxWidthOrHeight: 1920,
				quality: 0.8
			});

			console.log('✅ Photo compressed:', formatBytes(fotoBlob.size));

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
				app.dialog.preloader('Mengunggah update...');
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
async function prosesPembayaranMultiple(pembayaran_id, number) {
	var $pay = jQuery('#pembayaran_' + number + '_' + pembayaran_id);
	var $adm = jQuery('#pembayaran_admin_' + number + '_' + pembayaran_id);
	var $bank = jQuery('#bank_' + number + '_' + pembayaran_id);
	var $tgl = jQuery('#tanggal_' + number + '_' + pembayaran_id);
	var $btn = jQuery('label[for="foto_bukti_' + number + '_' + pembayaran_id + '"]');
	var $rowEls = jQuery([
		'#pembayaran_' + number + '_' + pembayaran_id,
		'#pembayaran_admin_' + number + '_' + pembayaran_id,
		'#bank_' + number + '_' + pembayaran_id,
		'#tanggal_' + number + '_' + pembayaran_id,
		'#keterangan_' + number + '_' + pembayaran_id,
		'#foto_bukti_' + number + '_' + pembayaran_id
	].join(','));

	var storageKey = 'foto_pembayaran_' + pembayaran_id + '_' + number;

	// Prevent double trigger
	if ($btn.hasClass('is-uploading')) {
		return false;
	}

	// Validasi field
	if ($pay.val() == "" || $bank.val() == "" || $tgl.val() == "") {
		app.dialog.alert('Isi Data Pembayaran Dengan Lengkap (Nominal, Bank, Tanggal)');
		return false;
	}

	// ✅ PERUBAHAN: Validasi foto dengan support file input juga
	const fotoInput = document.getElementById('foto_bukti_' + number + '_' + pembayaran_id);
	const fotoFromStorage = localStorage.getItem(storageKey);

	if (!fotoFromStorage && (!fotoInput || !fotoInput.files || !fotoInput.files[0])) {
		app.dialog.alert('Isi Data Pembayaran Dengan Lengkap (Foto Bukti Belum Ada)');
		return false;
	}

	// Validasi nominal
	var total_harus_bayar = parseInt(jQuery('#total_harus_bayar_' + pembayaran_id).val());
	var sudah_bayar = parseInt(jQuery('#sudah_bayar_' + pembayaran_id).val()) + parseInt($pay.val().replace(/\,/g, ''));
	var sisa_harus_bayar = total_harus_bayar - sudah_bayar;

	if (sisa_harus_bayar < 0) {
		var lebih_bayar = sudah_bayar - total_harus_bayar;
		app.dialog.alert('Pembayaran Melebihi Nominal <br> <br> Nominal Lebih : ' + number_format(lebih_bayar) + ' <br><br>Bagi Pada Angsuran Berikutnya');
		return false;
	}

	try {
		// ✅ PERUBAHAN: Compress foto sebelum upload
		app.dialog.preloader('Memproses foto...');

		let fotoBlob;

		if (fotoInput && fotoInput.files && fotoInput.files[0]) {
			// Compress foto baru dari input
			console.log('🔄 Compressing payment photo from input...');
			const file = fotoInput.files[0];

			// Validasi
			if (!validateFileType(file)) {
				app.dialog.close();
				return false;
			}

			if (!validateFileSize(file, 50)) {
				app.dialog.close();
				return false;
			}

			// Compress
			fotoBlob = await compressImage(file, {
				maxSizeMB: 4,
				maxWidthOrHeight: 1920,
				quality: 0.8
			});

			console.log('✅ Payment photo compressed:', formatBytes(fotoBlob.size));

		} else {
			// Gunakan foto dari localStorage
			console.log('📦 Using payment photo from localStorage');
			fotoBlob = base64ToBlob(fotoFromStorage);
		}

		// Build FormData
		var formData = new FormData();

		// Append compressed foto
		var fileName = 'foto_pembayaran_' + pembayaran_id + '_' + number + '_' + Date.now() + '.jpg';
		formData.append('foto_bukti', fotoBlob, fileName);

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
			app.dialog.alert('Error: Data kategori tidak ditemukan. Silakan tutup dan buka kembali detail pembayaran.');
			return false;
		}

		var transfer_kas = jQuery('#filter_kas').val();

		if (localStorage.getItem("user_id") == 262) {
			formData.append('primary_kas', localStorage.getItem("primary_kas"));
			formData.append('transfer_kas', transfer_kas);
		}

		formData.append('karyawan_nama', localStorage.getItem("karyawan_nama"));

		console.log('✅ FormData prepared for payment upload');
		console.log('   Foto blob size:', formatBytes(fotoBlob.size));
		console.log('   Foto filename:', fileName);

		// Disable UI
		var originalBtnText = $btn.text();
		$btn.addClass('is-uploading disabled')
			.css({ 'pointer-events': 'none', 'opacity': 0.6 })
			.text('UPLOADING 0%');
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
				try { app.dialog.preloader('Mengunggah pembayaran...'); } catch (e) { }
			},
			success: function (data) {
				// Cleanup localStorage
				if (localStorage.getItem(storageKey)) {
					localStorage.removeItem(storageKey);
					console.log('✅ Cleaned up localStorage:', storageKey);
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

				resetDataTransaksi(1);
				jQuery('#filter_kas').val(transfer_kas).trigger('change');

				try { app.dialog.close(); } catch (e) { }
				try { app.popup.close(); } catch (e) { }

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
				console.error('Upload error:', textstatus, message);
			},
			complete: function () {
				// Re-enable UI
				$btn.removeClass('is-uploading disabled')
					.css({ 'pointer-events': '', 'opacity': '' })
					.text(originalBtnText || 'FOTO');
				$rowEls.prop('disabled', false);
			}
		});

	} catch (error) {
		app.dialog.close();
		app.dialog.alert('Gagal memproses foto: ' + error.message);
		console.error('Payment error:', error);
		return false;
	}
}

/**
 * ========================================
 * 4. SETUP AUTO-COMPRESS UNTUK INPUT FILES
 * ========================================
 * Panggil ini saat halaman load untuk auto-compress saat user pilih foto
 */// === Template row input (belum ada pembayaran) ===
// Parameter sisa: jumlah yang belum terbayar
// Parameter totalOperasional: total nominal yang harus dibayar
function tplInputRow(idx, val, sisa, totalOperasional, id_transaksi_acc) {
	const id = val.pembayaran_operasional_id;

	// Default nilai pembayaran = sisa yang belum terbayar
	const defaultBayar = sisa > 0 ? fmt(sisa) : '0';

	// Rekomendasi keterangan berdasarkan apakah pembayaran ini akan melunasi
	const rekomendasiKet = (sisa > 0 && sisa <= totalOperasional) ? 'Lunas' : 'Bayar';

	// Generate reference number format
	const refNumber = val.referensi_number || '';
	const refFormat = idx === 1 ? `DP-${refNumber}` : `B${idx - 1}-${refNumber}`;

	return `
    <form id="pembayaran_form_multiple_${idx}_${id}">
      <tr id="payment_row_${idx}_${id}">
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
          <input style="width:100%;text-align:right;" class="input-pembayaran-multiple" id="pembayaran_${idx}_${id}" name="pembayaran_${idx}_${id}" type="text" value="${defaultBayar}" onclick="if(this.value==='0') this.value='';" onblur="if(this.value==='') this.value='0';" onchange="updateKeteranganRekomendasi(${idx}, ${id}, ${sisa})">
        </td>
        <td style="border:1px solid white;" class="numeric-cell text-align-right">
          <input style="width:100%;text-align:right;" class="input-pembayaran-multiple" id="pembayaran_admin_${idx}_${id}" name="pembayaran_admin_${idx}_${id}" type="text" value="0" onclick="if(this.value==='0') this.value='';" onblur="if(this.value==='') this.value='0';">
        </td>
        <td style="border:1px solid white;" class="numeric-cell text-align-right">
          <input style="width:100%;text-align:right;" class="input-pembayaran-multiple" id="pembayaran_jumlah_${idx}_${id}" name="pembayaran_jumlah_${idx}_${id}" type="text" readonly value="${defaultBayar}">
        </td>
        <td style="border:1px solid white;" class="numeric-cell text-align-center">
          <input style="width:100%;" id="keterangan_${idx}_${id}" name="keterangan_${idx}_${id}" type="text" value="${rekomendasiKet}" placeholder="Lunas/Bayar">
        </td>
        <td style="border:1px solid white;" class="numeric-cell text-align-center">
          
          <!-- ✅ STEP 1: Tombol SIMPAN untuk simpan data dulu -->
          <button type="button"
                  id="btn_simpan_${idx}_${id}"
                  class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold" 
                  onclick="simpanDataPembayaran(${idx}, ${id})" 
                  style="cursor:pointer; display:block;">
            SIMPAN
          </button>
          
          <!-- ✅ STEP 2: Tombol FOTO muncul setelah data tersimpan (hidden dulu) -->
          <button type="button"
                  id="btn_foto_${idx}_${id}"
                  class="text-add-colour-black-soft card-color-blue button-small col button text-bold" 
                  onclick="showUploadFotoOptions('foto_bukti_${idx}_${id}', ${id}, ${idx}, '', '');" 
                  style="cursor:pointer; display:none; color:white;">
            FOTO
          </button>
          
          <!-- Input file (hidden) -->
          <input type="file" 
                 id="foto_bukti_${idx}_${id}" 
                 name="foto_bukti_${idx}_${id}"
                 accept="image/*" 
                 style="display:none;" />
          
          <!-- Preview image -->
          <div style="margin-top:5px;">
            <img id="foto_bukti_${idx}_${id}_view" 
                 alt="Preview"
                 style="display:none; width:100%; max-width:150px; border-radius:4px; margin-top:5px; border:2px solid #4CAF50;" />
          </div>
          
        </td>
      </tr>
    </form>
  `;
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

// ===== EVENT HANDLER UNTUK FILE INPUT FOTO PEMBAYARAN =====
// Preview foto ketika user pilih dari gallery
jQuery(document).on('change', '#file_foto_pembayaran', function (e) {
	const file = e.target.files[0];
	if (file) {
		console.log('📁 File foto pembayaran dipilih:', file.name);

		// Validasi tipe file
		if (!file.type.match('image.*')) {
			app.dialog.alert('File harus berupa gambar');
			jQuery(this).val('');
			return;
		}

		// Validasi ukuran file (max 10MB)
		// const maxSize = 10 * 1024 * 1024; // 10MB
		// if (file.size > maxSize) {
		// 	app.dialog.alert('Ukuran file maksimal 10MB');
		// 	jQuery(this).val('');
		// 	return;
		// }

		// ========================================
		// LANGSUNG PROSES UPLOAD (NO PREVIEW, NO DELAY)
		// ========================================
		console.log('🚀 Langsung upload foto from gallery...');
		updateFotoPembayaranProcess();
	}
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

			// ===== PENTING: Simpan id_kategori_acc untuk digunakan saat proses pembayaran =====
			// Ambil dari data response atau dari data transaksi
			if (data.pembayaran_data && data.pembayaran_data.length > 0) {
				var id_kategori = data.pembayaran_data[0].id_kategori_acc;
				console.log('💾 Saving id_kategori_acc for payment:', id_kategori);
				// Simpan ke variabel global atau hidden field
				window.current_id_kategori_acc = id_kategori;
				window.current_kategori_acc = kategori_acc;
			} else {
				console.warn('⚠️ No pembayaran_data found, id_kategori_acc might be missing');
			}

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

				// ===== LOGIKA SEQUENTIAL PAYMENT (UPDATED) =====
				let lastPaidIndex = 0; // Track index pembayaran terakhir yang ada record

				// Loop 1: Tampilkan semua pembayaran yang sudah ada record
				for (let idx = 1; idx <= 10; idx++) {
					const payValue = Number(val[`pembayaran_${idx}`] || 0);
					const payTgl = val[`pembayaran${idx}_tgl`];
					const payBank = val[`bank_${idx}`];

					// ✅ Cek ada record (tanggal ATAU bank terisi)
					// Ini adalah cara yang benar - tidak peduli nominal 0 atau tidak
					const hasRecord = payTgl || payBank;

					if (hasRecord) {
						// Ada record → Tampilkan sebagai paid row
						out += tplPaidRow(idx, val, bg);
						lastPaidIndex = idx; // Update index terakhir yang punya record
					}
				}

				// Loop 2: Tampilkan 1 FORM INPUT BARU (hanya jika belum lunas)
				if (!lunas) {
					const nextPaymentIndex = lastPaidIndex + 1; // Pembayaran berikutnya

					if (nextPaymentIndex <= 10) {
						const sisaBayar = totalOperasional - totalBayar;
						out += tplInputRow(nextPaymentIndex, val, sisaBayar, totalOperasional, pembelian_header_id);
					}
				}
				// ===== END LOGIKA SEQUENTIAL =====

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

			// Set min date ke semua input tanggal dinamis
			const today = moment().format('YYYY-MM-DD');
			document.querySelectorAll('.date-multiple-pembayaran').forEach(function (el) {
				el.setAttribute('min', today);
			});
		},
		error: function () {
			app.dialog.close();
		}
	});

	$$('#tanggal_pembayaran_choose').html(moment(tanggal_pembelian).format('DD-MMM-YYYY'));

	// ===== TIDAK PERLU prefill 10 blok lama (sudah digantikan oleh AJAX dinamis) =====
	// Data ditampilkan otomatis dari database via logika sequential di atas

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

// =============================================
// MODIFIKASI: showUploadFotoOptions
// Sekarang langsung trigger upload setelah foto dipilih
// =============================================
function showUploadFotoOptions(inputId, pembayaran_id, foto_urutan, valid, valid_spy) {
	console.log('📸 showUploadFotoOptions called');
	console.log('   inputId:', inputId);
	console.log('   pembayaran_id:', pembayaran_id);
	console.log('   foto_urutan:', foto_urutan);

	// Parse number dari inputId (format: foto_bukti_NUMBER_PEMBAYARAN_ID)
	var parts = inputId.split('_');
	var number = parts.length >= 3 ? parts[2] : foto_urutan;

	console.log('   Extracted number:', number);

	// Show action sheet untuk pilih camera atau gallery
	var buttons = [];

	// Check if camera available
	if (typeof navigator.camera !== 'undefined' && typeof Camera !== 'undefined') {
		buttons.push({
			text: 'Camera',
			onClick: function () {
				openCameraFotoPembayaran_Step2(inputId, pembayaran_id, number);
			}
		});
	}

	// Gallery option (always available)
	buttons.push({
		text: 'Gallery',
		onClick: function () {
			// Trigger file input
			jQuery('#' + inputId).click();

			// Set up one-time change handler
			jQuery('#' + inputId).off('change').on('change', function () {
				if (this.files && this.files[0]) {
					console.log('📁 File selected from gallery');

					// Show preview
					var reader = new FileReader();
					reader.onload = function (e) {
						var previewId = inputId + '_view';
						jQuery('#' + previewId).attr('src', e.target.result).show();
					};
					reader.readAsDataURL(this.files[0]);

					// Auto-upload
					setTimeout(function () {
						uploadFotoPembayaran_Step2(pembayaran_id, number);
					}, 300);
				}
			});
		}
	});

	// Cancel button
	buttons.push({
		text: 'Cancel',
		color: 'red'
	});

	// Show action sheet
	app.actions.create({
		buttons: [buttons]
	}).open();
}

// =============================================
// FUNGSI: Open Camera untuk Step 2
// =============================================
function openCameraFotoPembayaran_Step2(inputId, pembayaran_id, number) {
	console.log('📸 Opening camera for payment foto - Step 2');
	console.log('   inputId:', inputId);
	console.log('   pembayaran_id:', pembayaran_id);
	console.log('   number:', number);

	// Validasi Camera plugin
	if (typeof navigator.camera === 'undefined') {
		console.error('❌ navigator.camera not available');
		app.dialog.alert('Camera tidak tersedia. Silakan gunakan Gallery.', 'Error');
		return;
	}

	if (typeof Camera === 'undefined') {
		console.error('❌ Camera object not available');
		app.dialog.alert('Camera plugin tidak tersedia. Silakan gunakan Gallery.', 'Error');
		return;
	}

	var storageKey = 'foto_pembayaran_' + pembayaran_id + '_' + number;

	var options = setOptionsTerima(Camera.PictureSourceType.CAMERA);

	console.log('📷 Calling navigator.camera.getPicture...');

	navigator.camera.getPicture(
		function cameraSuccess(imageUri) {
			console.log('✅ Camera success:', imageUri);

			getFileContentAsBase64Terima(imageUri, function (base64Image) {
				if (!base64Image) {
					console.error('❌ Failed to convert to base64');
					app.dialog.alert('Gagal memproses foto. Silakan coba lagi.');
					return;
				}

				console.log('✅ Base64 conversion success');

				// Save to localStorage
				localStorage.setItem(storageKey, base64Image);
				console.log('💾 Saved to localStorage:', storageKey);

				// Show preview
				var previewId = inputId + '_view';
				jQuery('#' + previewId).attr('src', base64Image).show();

				// Auto-upload
				setTimeout(function () {
					uploadFotoPembayaran_Step2(pembayaran_id, number);
				}, 300);
			});
		},
		function cameraError(error) {
			console.error('❌ Camera error:', error);
			app.dialog.alert('Gagal membuka kamera. Silakan gunakan Gallery.', 'Error Kamera');
		},
		options
	);
}

console.log('✅ Modified payment flow loaded - 2 Step Process (SIMPAN → FOTO)');

// ===== FUNGSI HANDLE PILIHAN CAMERA ATAU GALLERY UNTUK PEMBAYARAN =====
function pilihFotoSourcePembayaran(source) {
	console.log('Foto source selected:', source);

	// Tutup popup pilihan
	app.popup.close('.popup-foto-pembayaran-choice');

	const photoData = window.detailPembayaranPhotoData || {};
	const inputId = photoData.inputId || currentPhotoInputId;

	if (!inputId) {
		app.toast.create({
			text: 'Error: Input ID tidak ditemukan',
			closeTimeout: 2000
		}).open();
		return;
	}

	if (source === 'camera') {
		// Panggil fungsi kamera untuk pembayaran
		// Auto-submit sudah di-handle di dalam openCameraFotoPembayaran
		console.log('Opening camera for:', inputId);
		openCameraFotoPembayaran(inputId);
	} else if (source === 'gallery') {
		// Trigger input file untuk gallery
		// Auto-submit sudah di-handle oleh global event handler
		console.log('Opening gallery for:', inputId);
		const fileInput = document.getElementById(inputId);
		if (fileInput) {
			fileInput.click();
		} else {
			console.error('File input not found:', inputId);
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
function base64ToBlob(base64Data) {
	// Remove data:image prefix if exists
	var base64 = base64Data.split(',')[1] || base64Data;

	// Decode base64
	var byteCharacters = atob(base64);
	var byteNumbers = new Array(byteCharacters.length);

	for (var i = 0; i < byteCharacters.length; i++) {
		byteNumbers[i] = byteCharacters.charCodeAt(i);
	}

	var byteArray = new Uint8Array(byteNumbers);

	// Determine MIME type
	var mimeType = 'image/jpeg'; // default
	if (base64Data.indexOf('data:image/png') === 0) {
		mimeType = 'image/png';
	} else if (base64Data.indexOf('data:image/jpg') === 0) {
		mimeType = 'image/jpeg';
	} else if (base64Data.indexOf('data:image/jpeg') === 0) {
		mimeType = 'image/jpeg';
	}

	return new Blob([byteArray], { type: mimeType });
}

/**
 * Show toast notification
 *//**
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

// =============================================
// FUNGSI BARU: Simpan Data Pembayaran (tanpa foto)
// =============================================
function simpanDataPembayaran(number, pembayaran_id) {
	console.log('💾 Simpan data pembayaran - Step 1...');
	console.log('   - Number:', number);
	console.log('   - Pembayaran ID:', pembayaran_id);

	var $pay = jQuery('#pembayaran_' + number + '_' + pembayaran_id);
	var $adm = jQuery('#pembayaran_admin_' + number + '_' + pembayaran_id);
	var $bank = jQuery('#bank_' + number + '_' + pembayaran_id);
	var $tgl = jQuery('#tanggal_' + number + '_' + pembayaran_id);
	var $ket = jQuery('#keterangan_' + number + '_' + pembayaran_id);
	var $btnSimpan = jQuery('#btn_simpan_' + number + '_' + pembayaran_id);
	var $btnFoto = jQuery('#btn_foto_' + number + '_' + pembayaran_id);

	// Prevent double click
	if ($btnSimpan.hasClass('is-processing')) {
		console.log('⚠️ Already processing...');
		return false;
	}

	// ===== VALIDASI FIELD =====
	if ($pay.val() == "" || $bank.val() == "" || $tgl.val() == "") {
		app.dialog.alert('Isi Data Pembayaran Dengan Lengkap (Nominal, Bank, Tanggal)');
		return false;
	}

	// Validasi nominal vs sisa
	var total_harus_bayar = parseInt(jQuery('#total_harus_bayar_' + pembayaran_id).val() || 0);
	var sudah_bayar = parseInt(jQuery('#sudah_bayar_' + pembayaran_id).val() || 0);
	var nominal_bayar = parseInt($pay.val().replace(/\,/g, ''));
	var admin_bayar = parseInt($adm.val().replace(/\,/g, '') || 0);
	var total_bayar_baru = sudah_bayar + nominal_bayar;
	var sisa_harus_bayar = total_harus_bayar - total_bayar_baru;

	if (sisa_harus_bayar < 0) {
		var lebih_bayar = total_bayar_baru - total_harus_bayar;
		app.dialog.alert('Pembayaran Melebihi Nominal <br><br>Nominal Lebih : ' + number_format(lebih_bayar) + ' <br><br>Bagi Pada Angsuran Berikutnya');
		return false;
	}

	// ===== BUILD DATA =====
	var postData = {
		pembayaran: $pay.val(),
		admin: $adm.val(),
		bank: $bank.val(),
		tanggal: $tgl.val(),
		keterangan: $ket.val() || '',
		pembayaran_id: pembayaran_id,
		pembayaran_ke: number,
		user_id: localStorage.getItem("user_id") || '',
		karyawan_nama: localStorage.getItem("karyawan_nama") || ''
	};

	// id_kategori_acc
	if (window.current_id_kategori_acc) {
		postData.id_kategori_acc = window.current_id_kategori_acc;
		console.log('✅ Added id_kategori_acc:', window.current_id_kategori_acc);
	} else {
		app.dialog.alert('Error: Data kategori tidak ditemukan. Silakan tutup dan buka kembali detail pembayaran.');
		return false;
	}

	// Khusus user 262
	if (localStorage.getItem("user_id") == 262) {
		var transfer_kas = jQuery('#filter_kas').val();
		postData.primary_kas = localStorage.getItem("primary_kas");
		postData.transfer_kas = transfer_kas;
	}

	console.log('📤 Sending data:', postData);

	// ===== DISABLE UI =====
	$btnSimpan.addClass('is-processing disabled')
		.css({ 'pointer-events': 'none', 'opacity': 0.6 })
		.text('MENYIMPAN...');

	// Disable input fields
	$pay.prop('disabled', true);
	$adm.prop('disabled', true);
	$bank.prop('disabled', true);
	$tgl.prop('disabled', true);
	$ket.prop('disabled', true);

	// ===== AJAX CALL =====
	jQuery.ajax({
		type: 'POST',
		url: BASE_API + "/simpan-data-pembayaran-operasional",
		dataType: 'JSON',
		data: postData,
		beforeSend: function () {
			try {
				app.dialog.preloader('Menyimpan data pembayaran...');
			} catch (e) { }
		},
		success: function (response) {
			console.log('✅ Response:', response);

			try {
				app.dialog.close();
			} catch (e) { }

			if (response.status === 'success') {
				// ===== SUCCESS: Ubah tombol SIMPAN jadi FOTO =====
				$btnSimpan.hide(); // Sembunyikan tombol SIMPAN
				$btnFoto.show();   // Tampilkan tombol FOTO

				app.toast.create({
					text: 'Data pembayaran berhasil disimpan. Silakan upload foto bukti.',
					closeTimeout: 3000,
					position: 'center'
				}).open();

				console.log('✅ Data saved, button changed to FOTO');

			} else {
				// ===== FAILED: Reset UI =====
				$btnSimpan.removeClass('is-processing disabled')
					.css({ 'pointer-events': '', 'opacity': 1 })
					.text('SIMPAN');

				$pay.prop('disabled', false);
				$adm.prop('disabled', false);
				$bank.prop('disabled', false);
				$tgl.prop('disabled', false);
				$ket.prop('disabled', false);

				app.dialog.alert(response.message || 'Gagal menyimpan data');
			}
		},
		error: function (xhr, status, error) {
			console.error('❌ AJAX Error:', error);

			try {
				app.dialog.close();
			} catch (e) { }

			// Reset UI
			$btnSimpan.removeClass('is-processing disabled')
				.css({ 'pointer-events': '', 'opacity': 1 })
				.text('SIMPAN');

			$pay.prop('disabled', false);
			$adm.prop('disabled', false);
			$bank.prop('disabled', false);
			$tgl.prop('disabled', false);
			$ket.prop('disabled', false);

			var errorMsg = 'Gagal menyimpan data';
			if (xhr.responseJSON && xhr.responseJSON.message) {
				errorMsg = xhr.responseJSON.message;
			}

			app.dialog.alert(errorMsg);
		}
	});
}

// =============================================
// MODIFIKASI: Upload Foto Saja (Step 2)
// =============================================
async function uploadFotoPembayaran_Step2(pembayaran_id, number) {
	console.log('📸 Upload foto - Step 2...');
	console.log('   - Pembayaran ID:', pembayaran_id);
	console.log('   - Number:', number);

	var storageKey = 'foto_pembayaran_' + pembayaran_id + '_' + number;
	var $btnFoto = jQuery('#btn_foto_' + number + '_' + pembayaran_id);

	// Prevent double trigger
	if ($btnFoto.hasClass('is-uploading')) {
		console.log('⚠️ Already uploading...');
		return false;
	}

	// ===== VALIDASI FOTO =====
	const fotoInput = document.getElementById('foto_bukti_' + number + '_' + pembayaran_id);
	const fotoFromStorage = localStorage.getItem(storageKey);

	if (!fotoFromStorage && (!fotoInput || !fotoInput.files || !fotoInput.files[0])) {
		app.dialog.alert('Silakan pilih foto bukti pembayaran terlebih dahulu');
		return false;
	}

	try {
		// ===== COMPRESS FOTO =====
		app.dialog.preloader('Memproses foto...');

		let fotoBlob;

		if (fotoInput && fotoInput.files && fotoInput.files[0]) {
			// Compress foto baru dari input
			console.log('🔄 Compressing photo from input...');
			const file = fotoInput.files[0];

			// Validasi
			if (!validateFileType(file)) {
				app.dialog.close();
				return false;
			}

			if (!validateFileSize(file, 50)) {
				app.dialog.close();
				return false;
			}

			// Compress
			fotoBlob = await compressImage(file, {
				maxSizeMB: 4,
				maxWidthOrHeight: 1920,
				quality: 0.8
			});

			console.log('✅ Photo compressed:', formatBytes(fotoBlob.size));

		} else {
			// Gunakan foto dari localStorage (camera)
			console.log('📦 Using photo from localStorage');
			fotoBlob = base64ToBlob(fotoFromStorage);
		}

		// ===== BUILD FORMDATA =====
		var formData = new FormData();

		// Append foto
		var fileName = 'foto_pembayaran_' + pembayaran_id + '_' + number + '_' + Date.now() + '.jpg';
		formData.append('foto_bukti', fotoBlob, fileName);

		// Append IDs
		formData.append('pembayaran_id', pembayaran_id);
		formData.append('pembayaran_ke', number);
		formData.append('user_id', localStorage.getItem("user_id"));

		console.log('✅ FormData prepared for photo upload');
		console.log('   Photo blob size:', formatBytes(fotoBlob.size));
		console.log('   Photo filename:', fileName);

		// ===== DISABLE UI =====
		$btnFoto.addClass('is-uploading disabled')
			.css({ 'pointer-events': 'none', 'opacity': 0.6 })
			.text('UPLOADING 0%');

		// ===== AJAX UPLOAD =====
		jQuery.ajax({
			type: 'POST',
			url: BASE_API + "/upload-foto-pembayaran-operasional",
			dataType: 'JSON',
			data: formData,
			contentType: false,
			processData: false,
			xhr: function () {
				var xhr = new window.XMLHttpRequest();
				if (xhr.upload) {
					xhr.upload.addEventListener('progress', function (e) {
						if (e.lengthComputable) {
							var pct = Math.round((e.loaded / e.total) * 100);
							$btnFoto.text('UPLOADING ' + pct + '%');
						}
					}, false);
				}
				return xhr;
			},
			beforeSend: function () {
				try {
					app.dialog.close();
					app.dialog.preloader('Mengunggah foto...');
				} catch (e) { }
			},
			success: function (data) {
				console.log('✅ Upload success:', data);

				try {
					app.dialog.close();
				} catch (e) { }

				// Cleanup localStorage
				if (localStorage.getItem(storageKey)) {
					localStorage.removeItem(storageKey);
					console.log('✅ Cleaned up localStorage:', storageKey);
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

				// Success message
				if (data.status === 'success') {
					app.toast.create({
						text: 'Foto berhasil diupload!',
						closeTimeout: 2000,
						position: 'center'
					}).open();

					// Close popup dan reload
					setTimeout(function () {
						try {
							app.popup.close('.popup.detail-pembayaran');
						} catch (e) { }
						resetDataTransaksi(1);
					}, 500);

				} else {
					// Reset button
					$btnFoto.removeClass('is-uploading disabled')
						.css({ 'pointer-events': '', 'opacity': 1 })
						.text('FOTO');

					app.dialog.alert(data.message || 'Gagal upload foto');
				}
			},
			error: function (xhr, status, error) {
				console.error('❌ Upload error:', error);

				try {
					app.dialog.close();
				} catch (e) { }

				// Reset button
				$btnFoto.removeClass('is-uploading disabled')
					.css({ 'pointer-events': '', 'opacity': 1 })
					.text('FOTO');

				var errorMsg = 'Gagal upload foto';
				if (xhr.responseJSON && xhr.responseJSON.message) {
					errorMsg = xhr.responseJSON.message;
				}

				app.dialog.alert(errorMsg);
			}
		});

	} catch (error) {
		console.error('❌ Error:', error);

		try {
			app.dialog.close();
		} catch (e) { }

		app.dialog.alert('Gagal memproses foto: ' + error.message);
	}
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
 * 4. SETUP AUTO-COMPRESS UNTUK INPUT FILES
 * ========================================
 * Panggil ini saat halaman load untuk auto-compress saat user pilih foto
 */
function initializeImageCompression() {
	console.log('🔧 Initializing image compression for all file inputs...');

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

	console.log('✅ Image compression initialized');
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

// ============================================================
// INISIALISASI
// ============================================================
console.log('✅ Simplified Foto Upload Functions Loaded (Direct Process After Capture)');