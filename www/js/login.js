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
				localStorage.setItem("versioon_app_now", "13.03");
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