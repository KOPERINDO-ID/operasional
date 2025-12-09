var delayTimer;
function doSearchByKeteranganKas(text) {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function () {
        getDataMasterKas();
    }, 1000);
}

function resetDataKas(reset) {
    if (reset == 1) {
        jQuery('#keterangan_filter_master_kas').val('')
        getDataMasterKas()
    }
}

function tambahDataKas() {
    jQuery(".clear_tambah_kas_acc").val('');
}

function getDataMasterKas() {
    if (jQuery('#keterangan_filter_master_kas').val() == '' || jQuery('#keterangan_filter_master_kas').val() == null) {
        var keterangan_filter = 'empty';
    } else {
        var keterangan_filter = jQuery('#keterangan_filter_master_kas').val();
    }

    jQuery.ajax({
        type: 'POST',
        url: "" + BASE_API + "/get-master-kas-acc",
        dataType: 'JSON',
        data: {
            keterangan_filter: keterangan_filter
        },
        beforeSend: function () {
        },
        success: function (data) {
            var data_tools = '';
            var no = 0;
            if (data.data.length != 0) {
                jQuery.each(data.data, function (i, val) {
                    no++
                    data_tools += '<tr>';
                    data_tools += '     <td align="center" style="border-left: 1px solid grey;border-bottom: 1px solid grey;"  class="label-cell"  >' + no + '</td>';
                    data_tools += '     <td align="left" style="border-left: 1px solid grey;border-bottom: 1px solid grey;"  class="label-cell"  >' + val.kas_acc + '</td>';
                    data_tools += '		<td style="border-left: 1px solid grey;border-bottom: 1px solid grey;text-align:center">';
                    data_tools += '			<a onclick="getDataMasterKasKaryawan(\'' + val.id_kas_acc + '\',\'' + val.kas_acc + '\')" class="text-add-colour-black-soft bg-dark-gray-young button-small col button popup-open text-bold" data-popup=".detail-karyawan-popup">Karyawan</a>';
                    data_tools += '		</td>';
                    data_tools += '		<td style="border-right: 1px solid grey;border-bottom: 1px solid grey;text-align:center">';
                    data_tools += '			<a onclick="getDataEditMasterKas(\'' + val.id_kas_acc + '\',\'' + val.kas_acc + '\')" class="text-add-colour-black-soft bg-dark-gray-young button-small col button popup-open text-bold" data-popup=".edit-kas-popup">Edit</a>';
                    data_tools += '		</td>';
                    data_tools += '</tr>';
                });

                jQuery("#data_kas_accounting").html(data_tools);
            } else {
                jQuery("#data_kas_accounting").html('<tr><td colspan="4" align="center">Tidak Ada Data</td></tr>');
            }
        },
        error: function (xmlhttprequest, textstatus, message) {
        }
    });
}

function getDataEditMasterKas(id_kas_acc, kas_acc) {
    jQuery("#edit_kas").val(kas_acc);
    jQuery("#edit_id_kas").val(id_kas_acc);
}


function processTambahKasAcc() {
    if (localStorage.getItem("internet_koneksi") == 'fail') {
        app.dialog.alert('<font style="font-size:22px; color:white; font-weight:bold;">Gagal,Internet Tidak Stabil,Box Koneksi Harus Berwarna Hijau', function () {
        });
    } else {
        if (!$$('#form_tambah_kas_acc')[0].checkValidity()) {
            app.dialog.alert('Cek Isian Anda');
        } else {
            var formData = new FormData(jQuery("#form_tambah_kas_acc")[0]);
            formData.append('user_record', localStorage.getItem("karyawan_nama"));
            formData.append('user_id', localStorage.getItem("user_id"));
            formData.append('lokasi_pabrik', localStorage.getItem("lokasi_pabrik"));

            jQuery.ajax({
                type: "POST",
                url: "" + BASE_API + "/tambah-kas",
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
                    if (data.status == 'success') {
                        $$('.clear_tambah_kas_acc').val('');
                        $$("#back-tambah-kas").click();
                        getDataMasterKas();
                    } else if (data.status == 'failed') {
                        $$('.clear_tambah_kas_acc').val('');
                        $$("#back-tambah-kas").click();
                    }
                },
                error: function (xmlhttprequest, textstatus, message) {
                    app.dialog.alert('Ada kendala pada koneksi server, Silahkan Coba Kembali');
                    $$('.clear_tambah_kas_acc').val('');
                    $$("#back-tambah-kas").click();
                }

            });
        }
    }
}

function processEditKasAcc() {
    if (localStorage.getItem("internet_koneksi") == 'fail') {
        app.dialog.alert('<font style="font-size:22px; color:white; font-weight:bold;">Gagal,Internet Tidak Stabil,Box Koneksi Harus Berwarna Hijau', function () {
        });
    } else {
        if (!$$('#form_edit_kas')[0].checkValidity()) {
            app.dialog.alert('Cek Isian Anda');
        } else {
            var formData = new FormData(jQuery("#form_edit_kas")[0]);
            formData.append('user_modified', localStorage.getItem("karyawan_nama"));

            jQuery.ajax({
                type: "POST",
                url: "" + BASE_API + "/edit-kas",
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
                    if (data.status == 'success') {
                        $$('.clear_edit_kas').val('');
                        $$("#back-edit-kas").click();
                        getDataMasterKas();
                    } else if (data.status == 'failed') {
                        $$('.clear_edit_kas').val('');
                        $$("#back-edit-kas").click();
                    }
                },
                error: function (xmlhttprequest, textstatus, message) {
                    app.dialog.alert('Ada kendala pada koneksi server, Silahkan Coba Kembali');
                    $$('.clear_edit_kas').val('');
                    $$("#back-edit-kas").click();
                }

            });
        }
    }
}

function getDataMasterKasKaryawan(id_kas_acc, nama_kas) {
    // if (jQuery('#keterangan_filter_master_kas').val() == '' || jQuery('#keterangan_filter_master_kas').val() == null) {
    //     var keterangan_filter = 'empty';
    // } else {
    //     var keterangan_filter = jQuery('#keterangan_filter_master_kas').val();
    // }

    // jQuery('#keterangan_filter_master_kas').val(nama_kas);

    jQuery.ajax({
        type: 'POST',
        url: "" + BASE_API + "/get-master-kas-karyawan-acc",
        dataType: 'JSON',
        data: {
            id_kas_acc: id_kas_acc,
            lokasi_pabrik: localStorage.getItem("lokasi_pabrik")
        },
        beforeSend: function () {
        },
        success: function (data) {
            var data_tools = '';
            var no = 0;
            $("#nama-kas-karyawan").html(nama_kas);
            if (data.data.length != 0) {
                jQuery.each(data.data_karyawan, function (i, val) {
                    no++

                    var isChecked = (data.data && data.data[val.user_id] > 0);
                    var checkboxId = 'check_karyawan_' + no;
                    var is_add = isChecked ? 0 : 1; // jika sudah ter-relasi: klik = hapus(0), jika belum: klik = tambah(1)

                    data_tools += '<tr>';
                    data_tools += '     <td align="center" style="border-left: 1px solid grey;border-bottom: 1px solid grey;"  class="label-cell"  >' + no + '</td>';
                    data_tools += '     <td align="left" style="border-left: 1px solid grey;border-bottom: 1px solid grey;"  class="label-cell"  >' + val.karyawan_nama + '</td>';
                    // data_tools += '		<td style="border-left: 1px solid grey;border-bottom: 1px solid grey;text-align:center">';
                    // data_tools += '			<a onclick="getDataEditMasterKasKaryawan(\'' + val.user_id + '\',\'' + val.karyawan_nama + '\')" class="text-add-colour-black-soft bg-dark-gray-young button-small col button popup-open text-bold" data-popup=".edit-karyawan-popup">Edit</a>';
                    // data_tools += '		</td>';
                    // data_tools += '		<td style="border-right: 1px solid grey;border-bottom: 1px solid grey;text-align:center">';
                    // data_tools += '			<a onclick="deleteKaryawan(\'' + val.user_id + '\',\'' + val.karyawan_nama + '\')" class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold">Delete</a>';
                    // data_tools += '		</td>';
                    data_tools += '		<td style="border-right: 1px solid grey;border-bottom: 1px solid grey;text-align:center">';
                    data_tools += '         <input type="checkbox" ' + (isChecked ? 'checked' : '') + ' id="' + checkboxId + '" ';
                    data_tools += '         onclick="updateKasKaryawan(\'' + val.user_id + '\',\'' + val.karyawan_nama + '\',\'' + nama_kas + '\',' + is_add + ',' + id_kas_acc + ', this)">';
                    data_tools += '		</td>';
                    data_tools += '</tr>';
                });

                jQuery("#detail_karyawan_kas_values").html(data_tools);
            } else {
                jQuery("#detail_karyawan_kas_values").html('<tr><td colspan="4" align="center">Tidak Ada Data</td></tr>');
            }
        },
        error: function (xmlhttprequest, textstatus, message) {
        }
    });
}

function updateKasKaryawan(user_id, karyawan_nama, nama_kas, is_add, id_kas_acc, el) {
    var teksKonfirmasi = (is_add === 1) ? 'Tambah Relasi ' + karyawan_nama + ' di ' + nama_kas + '?' : 'Hapus Relasi ' + karyawan_nama + ' di ' + nama_kas + '?';

    app.dialog.confirm(teksKonfirmasi, function () {
        if (localStorage.getItem('internet_koneksi') == 'fail') {
            app.dialog.alert('<font style="font-size:22px; color:white; font-weight:bold;">Gagal,Internet Tidak Stabil,Box Koneksi Harus Berwarna Hijau', function () { });
            // rollback checkbox
            if (el) { el.checked = !el.checked; }
            return;
        }

        jQuery.ajax({
            type: 'POST',
            url: BASE_API + '/attach-master-kas-karyawan-acc',
            dataType: 'JSON',
            data: {
                id_kas_acc: id_kas_acc,
                user_id: user_id,
                checked: is_add,
                lokasi_pabrik: localStorage.getItem('lokasi_pabrik'),
                karyawan_nama: localStorage.getItem('karyawan_nama')
            },
            beforeSend: function () {
                app.dialog.preloader('Harap Tunggu');
            },
            success: function (data) {
                app.dialog.close();
                if (data && data.status == 'success') {
                    app.dialog.alert((is_add === 1 ? 'Berhasil Menambahkan Relasi' : 'Berhasil Menghapus Relasi'));
                    // refresh list agar sinkron
                    $$("#back-detail-karyawan").click();
                } else {
                    // gagal -> rollback checkbox
                    if (el) { el.checked = !el.checked; }
                    app.dialog.alert(data && data.message ? data.message : 'Gagal Memperbarui Relasi');
                    $$("#back-detail-karyawan").click();
                }
            },
            error: function () {
                app.dialog.close();
                if (el) { el.checked = !el.checked; }
                app.dialog.alert('Ada kendala pada koneksi server, Silahkan Coba Kembali');
                    $$("#back-detail-karyawan").click();
            }
        });
    }, function () {
        // batal -> rollback checkbox
        if (el) { el.checked = !el.checked; }
    });
}
