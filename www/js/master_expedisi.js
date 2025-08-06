var delayTimer;
function doSearchByPerusahaan(text) {
    clearTimeout(delayTimer);
    delayTimer = setTimeout(function () {
        getDataPerusahaan();
    }, 1000);
}

function resetDataPerusahaan(reset) {
    if (reset == 1) {
        jQuery('#perusahaan_filter').val('')
        getDataPerusahaan()
    }
}


function getDataPerusahaan() {
    if (jQuery('#perusahaan_filter').val() == '' || jQuery('#perusahaan_filter').val() == null) {
        var perusahaan_filter = 'empty';
    } else {
        var perusahaan_filter = jQuery('#perusahaan_filter').val();
    }
    jQuery.ajax({
        type: 'POST',
        url: "" + BASE_API + "/get-perusahaan-acc",
        dataType: 'JSON',
        data: {
            user_id: localStorage.getItem("user_id"),
            perusahaan_filter: perusahaan_filter
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
                    data_tools += '     <td align="left" style="border-left: 1px solid grey;border-bottom: 1px solid grey;"  class="label-cell popup-open" data-popup=".detail-alamat-popup" onclick="detailAlamatPopup(\'' + val.alamat + '\')" >' + val.perusahaan_acc + '</td>';
                    data_tools += '     <td align="left" style="border-left: 1px solid grey;border-bottom: 1px solid grey;"  class="label-cell"  >' + val.pic + '</td>';
                    data_tools += '     <td align="left" style="border-left: 1px solid grey;border-bottom: 1px solid grey;"  class="label-cell"  >' + val.no_telp + '</td>';
                    if (localStorage.getItem("user_id") == 262) {
                        data_tools += '		<td style="border-left: 1px solid grey;border-right: 1px solid grey;border-bottom: 1px solid grey;text-align:center">';
                        data_tools += '			<a onclick="getDataEditPerusahaan(\'' + val.id_perusahaan_acc + '\',\'' + val.perusahaan_acc + '\',\'' + val.pic + '\',\'' + val.no_telp + '\',\'' + val.alamat + '\')" class="text-add-colour-black-soft bg-dark-gray-young button-small col button popup-open text-bold" data-popup=".edit-perusahaan-popup">Edit</a>';
                        data_tools += '		</td>';
                        data_tools += '		<td style="border-right: 1px solid grey;border-bottom: 1px solid grey;text-align:center">';
                        data_tools += '			<a onclick="deletePerusahaanAcc(\'' + val.id_perusahaan_acc + '\',\'' + val.perusahaan_acc + '\')" class="text-add-colour-black-soft bg-dark-gray-young button-small col button text-bold">Delete</a>';
                        data_tools += '		</td>';
                    }
                    data_tools += '</tr>';
                });

                jQuery("#data_perusahaan_accounting").html(data_tools);
            } else {
                jQuery("#data_perusahaan_accounting").html('<tr><td colspan="4" align="center">Tidak Ada Data</td></tr>');
            }
            jQuery("#total-expedisi").html(no);
        },
        error: function (xmlhttprequest, textstatus, message) {
        }
    });
}

function detailAlamatPopup(alamat) {
    jQuery("#detail_alamat_popup").val(alamat);
}

function tambahDataPerusahaan() {
    jQuery(".clear_tambah_perusahaan_acc").val('');
}

function getDataEditPerusahaan(id_perusahaan_acc, perusahaan_acc, pic, no_telp, alamat) {
    jQuery("#edit_master_perusahaan").val(perusahaan_acc);
    jQuery("#edit_master_perusahaan_pic").val(pic);
    jQuery("#edit_master_perusahaan_telp").val(no_telp);
    jQuery("#edit_master_perusahaan_alamat").val(alamat);
    jQuery("#edit_id_perusahaan").val(id_perusahaan_acc);
}
function processTambahPerusahaanAcc() {
    if (localStorage.getItem("internet_koneksi") == 'fail') {
        app.dialog.alert('<font style="font-size:22px; color:white; font-weight:bold;">Gagal,Internet Tidak Stabil,Box Koneksi Harus Berwarna Hijau', function () {
        });
    } else {
        if (!$$('#form_tambah_perusahaan_acc')[0].checkValidity()) {
            app.dialog.alert('Cek Isian Anda');
        } else {
            var formData = new FormData(jQuery("#form_tambah_perusahaan_acc")[0]);
            formData.append('user_record', localStorage.getItem("karyawan_nama"));
            formData.append('user_id', localStorage.getItem("user_id"));
            formData.append('lokasi_pabrik', localStorage.getItem("lokasi_pabrik"));

            jQuery.ajax({
                type: "POST",
                url: "" + BASE_API + "/tambah-perusahaan-acc",
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
                    $$('.clear_tambah_perusahaan_acc').val('');
                    if (data.status == 'success') {
                        app.popup.close();
                        getDataPerusahaan();
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


function deletePerusahaanAcc(id_perusahaan_acc, perusahaan_acc) {
    app.dialog.confirm('Delete Data ' + perusahaan_acc + ' ?', function () {
        if (localStorage.getItem("internet_koneksi") == 'fail') {
            app.dialog.alert('<font style="font-size:22px; color:white; font-weight:bold;">Gagal,Internet Tidak Stabil,Box Koneksi Harus Berwarna Hijau', function () {
            });
        } else {
            jQuery.ajax({
                type: "POST",
                url: "" + BASE_API + "/delete-perusahaan-acc",
                dataType: "JSON",
                data: {
                    id_perusahaan_acc: id_perusahaan_acc,
                },
                beforeSend: function () {
                    app.dialog.preloader('Harap Tunggu');
                },
                success: function (data) {
                    app.dialog.close();
                    if (data.status == 'success') {
                        app.dialog.alert('Berhasil Menghapus Data');
                        getDataPerusahaan();
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

function processEditPerusahaanAcc() {
    if (localStorage.getItem("internet_koneksi") == 'fail') {
        app.dialog.alert('<font style="font-size:22px; color:white; font-weight:bold;">Gagal,Internet Tidak Stabil,Box Koneksi Harus Berwarna Hijau', function () {
        });
    } else {
        if (!$$('#form_edit_perusahaan')[0].checkValidity()) {
            app.dialog.alert('Cek Isian Anda');
        } else {
            var formData = new FormData(jQuery("#form_edit_perusahaan")[0]);
            formData.append('user_modified', localStorage.getItem("karyawan_nama"));

            jQuery.ajax({
                type: "POST",
                url: "" + BASE_API + "/update-perusahaan-acc",
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
                    $$('.clear_edit_perusahaan').val('');
                    if (data.status == 'success') {
                        app.popup.close();
                        getDataPerusahaan();
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