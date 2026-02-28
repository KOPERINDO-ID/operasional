function getDataUser() {
	var username = jQuery('#username').val();
	var password = jQuery('#password').val();
	jQuery.ajax({
		type: 'POST',
		url: "" + BASE_API + "/get-data-login",
		dataType: 'JSON',
		data: {
			username: username,
			password: password
		},
		beforeSend: function () {
		},
		success: function (data) {
			if (data == 0) {
				app.dialog.preloader('Username Atau Password Salah');
				setTimeout(function () {
					app.dialog.close();
				}, 1000);
			} else {
				localStorage.setItem("versioon_app_now", "13.04");
				if (data.jabatan == 'Finance') {
					console.log(data);
					app.dialog.close();
					$$('#logout_logo').css("display", "initial");
					$$('#pengumuman_logo').css("display", "initial");
					localStorage.setItem("user_id", data.user_id);
					localStorage.setItem("username", data.username);
					localStorage.setItem("karyawan_nama", data.karyawan_nama);
					localStorage.setItem("password", data.password_real);
					localStorage.setItem("login", "true");
					localStorage.setItem("jabatan", data.user_position);
					localStorage.setItem("jabatan_kantor", data.jabatan);
					localStorage.setItem("sales_kota", data.kota);
					localStorage.setItem("lokasi_pabrik", data.lokasi_pabrik);
					localStorage.setItem("primary_kas", data.primary_kas);
					localStorage.setItem("latitude_pabrik", data.latitude);
					localStorage.setItem("longtitude_pabrik", data.longtitude);


					//INIT NOTIF
					initNotificationManagerAfterLogin();

					if (localStorage.getItem("login") != "true") {
						$$('#title-nama').html("Admin");
					} else {
						$$('#title-nama').html("Admin");
					}

					setTimeout(function () {
						if (localStorage.getItem("user_id") == 260) {
							return app.views.main.router.navigate('/data-kas');
						} else if (localStorage.getItem("user_id") == 262) {
							return app.views.main.router.navigate('/data-kas');
						} else {
							return app.views.main.router.navigate('/data');
						}


					}, 100);
				} else {
					app.dialog.preloader('Role User Tidak Sesuai');
					setTimeout(function () {
						app.dialog.close();
					}, 100);
				}
			}

		},
		error: function (xmlhttprequest, textstatus, message) {
		}
	});
}


/**
 * Inisialisasi NotificationManager setelah login berhasil
 * Fungsi ini memastikan FCM token di-generate dan di-register ke server
 */
function initNotificationManagerAfterLogin() {
	var userId = localStorage.getItem("user_id");

	if (!userId) {
		console.error('[Login] No user_id found after login');
		return;
	}

	console.log('[Login] Initializing NotificationManager for user:', userId);

	// Tunggu sedikit untuk memastikan semua localStorage sudah tersimpan
	setTimeout(function () {
		if (typeof NotificationManager === 'undefined') {
			console.error('[Login] NotificationManager not loaded');
			return;
		}

		// Update API URL
		if (typeof BASE_API !== 'undefined') {
			NotificationManager.config.apiUrl = BASE_API;
		}

		// Inisialisasi dengan forceRefresh = true
		NotificationManager.init(userId, true);

		// Force get FCM token setelah delay tambahan
		setTimeout(function () {
			if (NotificationManager.isFirebaseAvailable()) {
				console.log('[Login] Getting FCM token...');
				NotificationManager.getFirebaseToken();
			} else {
				console.warn('[Login] Firebase plugin not available');
			}
		}, 1500);

	}, 500);
}