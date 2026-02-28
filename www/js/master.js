jQuery('.nominal_master').mask('000,000,000,000', { reverse: true });

var delayTimer;
function doSearchByKeterangan(text) {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function () {
        getDataKategori();
    }, 1000);
}
function changeMenuMaster(type) {
    if (type == 'kas') {
        $('.clear_color_role').removeClass("bg-dark-gray-medium");
        $('.colorMenuKas').addClass("bg-dark-gray-medium");
        // getDataKaryawan();
    } else if (type == 'kategori') {
        $('.clear_color_role').removeClass("bg-dark-gray-medium");
        $('.colorMenuKategori').addClass("bg-dark-gray-medium");
        // getDataKaryawan();
    }
}
function resetDataKategori(reset) {
    if (reset == 1) {
        jQuery('#keterangan_filter').val('')
        getDataKategori()
    }
}

function tambahDataKeterangan() {
    jQuery(".clear_tambah_kategori_acc").val('');
}


function getDataKategori() {
    if (jQuery('#keterangan_filter').val() == '' || jQuery('#keterangan_filter').val() == null) {
        var keterangan_filter = 'empty';
    } else {
        var keterangan_filter = jQuery('#keterangan_filter').val();
    }

    jQuery.ajax({
        type: 'POST',
        url: "" + BASE_API + "/get-master-kategori-acc",
        dataType: 'JSON',
        data: {
            keterangan_filter: keterangan_filter
        },
        beforeSend: function () {
            // internetCheckQueue.check();
        },
        success: function (data) {
            var data_tools = '';
            var no = 0;
            var id_kategori_acc = '';
            if (data.data.length != 0) {
                jQuery.each(data.data, function (i, val) {
                    no++
                    data_tools += '<tr>';
                    data_tools += '     <td align="center" style="border-left: 1px solid grey;border-bottom: 1px solid grey;"  class="label-cell"  >' + no + '</td>';
                    data_tools += '     <td align="left" style="border-left: 1px solid grey;border-bottom: 1px solid grey;"  class="label-cell"  >' + val.kategori_acc + '</td>';
                    data_tools += '     <td align="center" style="border-left:1px solid grey;border-bottom:1px solid grey;" class="label-cell">' +
                        ((val.tanggal_reminder != '0' && val.tanggal_reminder != 0) ? val.tanggal_reminder : '-') + '</td>';
                    data_tools += '     <td align="right" style="border-left: 1px solid grey;border-bottom: 1px solid grey;"  class="label-cell"  >' + number_format(val.nominal_payment ? val.nominal_payment : 0) + '</td>';
                    // if (val.kategori_acc.includes('Cash in') != true) {
                    if (val.kredit == 3) {
                        data_tools += '	    <td style="border-left: 1px solid grey;border-right: 1px solid grey;border-bottom: 1px solid grey;text-align:center">';
                        data_tools += '		    <input type="checkbox" checked id="check_type_' + no + '" name="check_type_' + no + '" onclick="processUpdateKasAcc(\'' + val.kategori_acc + '\',\'' + no + '\',0)">';
                        data_tools += '	    </td>';
                    } else {
                        data_tools += '	    <td style="border-left: 1px solid grey;border-right: 1px solid grey;border-bottom: 1px solid grey;text-align:center">';
                        data_tools += '		    <input type="checkbox" id="check_type_' + no + '" name="check_type_' + no + '" onclick="processUpdateKasAcc(\'' + val.kategori_acc + '\',\'' + no + '\',1)">';
                        data_tools += '	    </td>';
                    }
                    if (localStorage.getItem("user_id") == 260) {
                        data_tools += '		<td style="border-right: 1px solid grey;border-bottom: 1px solid grey;text-align:center">';
                        data_tools += '			<a onclick="getDataEditKategori(\'' + val.id_kategori_acc + '\',\'' + val.kategori_acc + '\',\'' + val.flag_notif + '\',\'' + val.tanggal_reminder + '\',\'' + val.nominal_payment + '\')" class="text-add-colour-black-soft bg-dark-gray-young button-small col button popup-open text-bold" data-popup=".edit-keterangan-popup">Edit</a>';
                        data_tools += '		</td>';
                    }
                    if (localStorage.getItem("user_id") == 262) {
                        data_tools += '		<td style="border-left: 1px solid grey;border-right: 1px solid grey;border-bottom: 1px solid grey;text-align:center">';
                        data_tools += '			<a onclick="getDataEditKategori(\'' + val.id_kategori_acc + '\',\'' + val.kategori_acc + '\',\'' + val.flag_notif + '\',\'' + val.tanggal_reminder + '\',\'' + val.nominal_payment + '\')" class="text-add-colour-black-soft bg-dark-gray-young button-small col button popup-open text-bold" data-popup=".edit-keterangan-popup">Edit</a>';
                        data_tools += '		</td>';
                        data_tools += '		<td style="border-right: 1px solid grey;border-bottom: 1px solid grey;text-align:center">';
                        data_tools += '			<a onclick="deleteKategoriAcc(\'' + val.id_kategori_acc + '\',\'' + val.kategori_acc + '\')" class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold">Delete</a>';
                        data_tools += '		</td>';
                    }
                    data_tools += '</tr>';
                });

                jQuery("#data_kategori_accounting").html(data_tools);
            } else {
                jQuery("#data_kategori_accounting").html('<tr><td colspan="4" align="center">Tidak Ada Data</td></tr>');
            }
            jQuery("#total-keterangan").html(no);
        },
        error: function (xmlhttprequest, textstatus, message) {
        }
    });
}

function getDataEditKategori(id_kategori_acc, kategori_acc, flag_notif, tanggal_reminder, nominal_payment) {
    jQuery("#edit_kategori").val(kategori_acc);
    jQuery("#edit_id_kategori").val(id_kategori_acc);
    jQuery("#edit_tanggal").val(tanggal_reminder);
    jQuery("#edit_nominal_master").val(number_format(nominal_payment ? nominal_payment : 0));
    if (flag_notif == 1) {
        jQuery("#edit_ipl").prop("checked", true);
    } else {
        jQuery("#edit_ipl").prop("checked", false);
    }
    changeIpl('edit');
}

function changeIpl(type) {
    if (jQuery('#' + type + '_ipl').is(':checked')) {
        jQuery('.' + type + '_show_ipl').show();
        $$('#' + type + '_tanggal').prop('required', true)
        $$('#' + type + '_tanggal').prop('validate', true)
        $$('#' + type + '_nominal').prop('required', true)
        $$('#' + type + '_nominal').prop('validate', true)
    } else {
        jQuery('.' + type + '_show_ipl').hide();
        $$('#' + type + '_tanggal').prop('required', false)
        $$('#' + type + '_tanggal').prop('validate', false)
        $$('#' + type + '_nominal').prop('required', false)
        $$('#' + type + '_nominal').prop('validate', false)
    }

}

function processTambahKategoriAcc() {
    if (localStorage.getItem("internet_koneksi") == 'fail') {
        app.dialog.alert('<font style="font-size:22px; color:white; font-weight:bold;">Gagal,Internet Tidak Stabil,Box Koneksi Harus Berwarna Hijau', function () {
        });
    } else {
        if (!$$('#form_tambah_kategori_acc')[0].checkValidity()) {
            app.dialog.alert('Cek Isian Anda');
        } else {
            var formData = new FormData(jQuery("#form_tambah_kategori_acc")[0]);
            formData.append('user_record', localStorage.getItem("karyawan_nama"));
            formData.append('user_id', localStorage.getItem("user_id"));
            formData.append('lokasi_pabrik', localStorage.getItem("lokasi_pabrik"));

            jQuery.ajax({
                type: "POST",
                url: "" + BASE_API + "/tambah-kategori-acc",
                dataType: "JSON",
                data: formData,
                timeout: 7000,
                contentType: false,
                processData: false,
                beforeSend: function () {
                    internetCheckQueue.check();
                    try {
                        app.dialog.preloader('Menyimpan kategori...');
                    } catch (e) { }
                },
                success: function (data) {
                    app.dialog.close();
                    $$('.clear_tambah_kategori_acc').val('');
                    if (data.status == 'success') {
                        app.popup.close();
                        getDataKategori();
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


function deleteKategoriAcc(id_kategori_acc, kategori_acc) {
    app.dialog.confirm('Delete Data ' + kategori_acc + ' ?', function () {
        if (localStorage.getItem("internet_koneksi") == 'fail') {
            app.dialog.alert('<font style="font-size:22px; color:white; font-weight:bold;">Gagal,Internet Tidak Stabil,Box Koneksi Harus Berwarna Hijau', function () {
            });
        } else {
            jQuery.ajax({
                type: "POST",
                url: "" + BASE_API + "/delete-kategori-acc",
                dataType: "JSON",
                data: {
                    id_kategori_acc: id_kategori_acc,
                },
                beforeSend: function () {
                    internetCheckQueue.check();
                    try {
                        app.dialog.preloader('Menghapus kategori...');
                    } catch (e) { }
                },
                success: function (data) {
                    app.dialog.close();
                    if (data.status == 'success') {
                        app.dialog.alert('Berhasil Menghapus Data');
                        getDataKategori();
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

function processUpdateKasAcc(nama_kategori, no_check, status_check) {
    app.dialog.confirm('Apakah yakin ingin mengubah ?', function () {
        if (localStorage.getItem("internet_koneksi") == 'fail') {
            app.dialog.alert('<font style="font-size:22px; color:white; font-weight:bold;">Gagal,Internet Tidak Stabil,Box Koneksi Harus Berwarna Hijau', function () {
            });
        } else {
            jQuery.ajax({
                type: "POST",
                url: "" + BASE_API + "/update-type-acc",
                dataType: "JSON",
                data: {
                    nama_kategori: nama_kategori,
                    no_check: no_check,
                    status_check: status_check
                },
                beforeSend: function () {
                    internetCheckQueue.check();
                    try {
                        app.dialog.preloader('Memperbarui tipe kategori...');
                    } catch (e) { }
                },
                success: function (data) {
                    app.dialog.close();
                    if (data.status == 'success') {
                        app.dialog.alert('Berhasil Update Data');
                        getDataKategori();
                    } else if (data.status == 'failed') {
                        app.dialog.alert('Gagal Update Data');
                    }
                },
                error: function (xmlhttprequest, textstatus, message) {
                    app.dialog.alert('Ada kendala pada koneksi server, Silahkan Coba Kembali');
                }
            });
        }
    }, function () { $('#check_type_' + no_check).prop('checked', false); });
}

function processEditKategoriAcc() {
    if (localStorage.getItem("internet_koneksi") == 'fail') {
        app.dialog.alert('<font style="font-size:22px; color:white; font-weight:bold;">Gagal,Internet Tidak Stabil,Box Koneksi Harus Berwarna Hijau', function () {
        });
    } else {
        if (!$$('#form_edit_kategori')[0].checkValidity()) {
            app.dialog.alert('Cek Isian Anda');
        } else {
            var formData = new FormData(jQuery("#form_edit_kategori")[0]);
            formData.append('user_modified', localStorage.getItem("karyawan_nama"));

            jQuery.ajax({
                type: "POST",
                url: "" + BASE_API + "/update-kategori-acc",
                dataType: "JSON",
                data: formData,
                timeout: 7000,
                contentType: false,
                processData: false,
                beforeSend: function () {
                    internetCheckQueue.check();
                    try {
                        app.dialog.preloader('Menyimpan perubahan kategori...');
                    } catch (e) { }
                },
                success: function (data) {
                    app.dialog.close();
                    $$('.clear_edit_kategori').val('');
                    if (data.status == 'success') {
                        app.popup.close();
                        getDataKategori();
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