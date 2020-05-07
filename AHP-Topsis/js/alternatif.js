const navButton = document.getElementById("navButton");
const mySidenav = document.getElementById("mySidenav");
const topNav = document.getElementById("topNav");
const tambah = document.getElementById("tambah");
const edit = document.getElementById("edit");



navButton.addEventListener('click', function (e) {
    mySidenav.classList.toggle("sidenav-show");
    e.stopPropagation();
});

content.addEventListener('click', function () {
    if (mySidenav.classList.contains('sidenav-show')) {
        mySidenav.classList.toggle("sidenav-show");
    }
});

topNav.addEventListener('click', function () {
    if (mySidenav.classList.contains('sidenav-show')) {
        mySidenav.classList.toggle("sidenav-show");
    }
});

tambah.addEventListener('click', async function (e) {
    // ambil data dari form
    let data = getDataTable();

    // cek input validasi jika benar jalankan
    let validasi = validasiInput(data);

    if (validasi) {
        // ambil data sekarang
        const alt = await getAlternatif();

        //gabungkan data
        alt.push(data);

        // simpan 
        localStorage.setItem("alternatif", JSON.stringify(alt));

        //update tabel
        updateTableAlternatif(alt);

        // clear form
        document.getElementById("tambahForm").reset();
    } else {
        alert("Harap isi data dengan benar");
    }


});

edit.addEventListener('click', async function (e) {
    // ambil data dari form
    let data = getDataTableEdit();

    // cek input validasi jika benar jalankan
    let validasi = validasiInput(data);

    if (validasi) {
        // ambil data sekarang
        const alt = await getAlternatif();

        //index ke-
        let idx = this.parentElement.previousSibling.previousSibling.firstChild.nextSibling.firstChild.getAttribute("value");

        // masukan ke data/edit
        alt.splice(idx, 1, data);

        // simpan 
        localStorage.setItem("alternatif", JSON.stringify(alt));

        //update tabel
        updateTableAlternatif(alt);
    } else {
        alert("Harap isi data dengan benar");
    }
});



$(document).ready(async function () {
    const criteria = await getCriteria();
    updateTableCriteria(criteria);
    const alternatif = await getAlternatif();
    updateTableAlternatif(alternatif);



});

function updateTableCriteria(crit) {
    let head = `<tr>
                <th>NO</th>
                <th>Alternatif</th>`;
    crit.forEach((c, i) => {
        head += `<th>${c.kriteria}</th>`;
    });
    head += `   <th>Aksi</th>
                </tr>`;
    $('#head').html(head);

    updateFormTambah(crit);
}

function updateTableAlternatif(alt) {
    let row = '';
    alt.forEach((c, i) => {
        row += `<tr>
                        <td>${i + 1}</td>
                        <td>${c.nama}</td> `
        row += setAlternatif(c.nilai);
        row += `<td><button class="btn btn-primary btn-sm smoll" value="${i}" id="edit"> Edit </button>
                <button class="btn btn-danger btn-sm smoll" id="hapus"> Hapus </button></td>
                </tr>`;
    });
    $('.alternatif-table').html(row);

    const hapus = document.querySelectorAll("#hapus");
    addEventHapus(hapus);

    const edit = document.querySelectorAll("#edit");
    addEventEdit(edit);
}

function setAlternatif(n) {
    let row = '';
    n.forEach(arr => {
        row += `<td>${arr}</td> `
    })
    return row;
}

function getCriteria() {
    if (JSON.parse(localStorage.getItem("kriteria")) == null) {
        return fetch('json/criteria.json').then(response => response.json()).then(response => response);
    } else {
        return JSON.parse(localStorage.getItem("kriteria"));
    }
}

function getAlternatif() {
    if (JSON.parse(localStorage.getItem("alternatif")) == null) {
        return fetch('json/alternatif.json').then(response => response.json()).then(response => response);
    } else {
        return JSON.parse(localStorage.getItem("alternatif"));
    }
}

function getDataTable() {
    let obj = {};
    const formElements = document.getElementById("tambahForm").elements;
    obj.nama = formElements[0].value;;
    let nilai = [];
    for (let i = 1; i < formElements.length; i++) {
        nilai.push(parseInt(formElements[i].value));
    }
    obj.nilai = nilai;

    return obj;
}

function getDataTableEdit() {
    let obj = {};
    const formElements = document.getElementById("editForm").elements;
    obj.nama = formElements[0].value;;
    let nilai = [];
    for (let i = 2; i < formElements.length; i++) {
        nilai.push(parseInt(formElements[i].value));
    }
    obj.nilai = nilai;

    return obj;
}

////////////////////////////////////////////////////////////////////

function updateFormTambah(crit) {
    let form = `<div class="form-group row">
                    <label for="inputAlternatif" class="col-sm-4 col-form-label">Alternatif</label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control" id="inputAlternatif" placeholder="Alternatif">
                    </div>
                </div>`;
    crit.forEach((c, i) => {
        form += `<div class="form-group row">
                    <label for="nilaiC${i + 1}" class="col-sm-4 col-form-label">${c.kriteria}</label>
                    <div class="col-sm-8">
                        <input type="number" class="form-control" id="nilaiC${i + 1}" placeholder="${c.kriteria}">
                    </div>
                </div>`;
    });
    $('#tambahForm').html(form);

}

function updateFormEdit(crit, alt, idx) {
    let form = `<div class="form-group row" value="${idx}">
                    <label for="inputAlternatif" class="col-sm-4 col-form-label">Alternatif</label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control" id="inputAlternatif" value="${alt[idx].nama}">
                        <input type="hidden" value="${idx}">
                    </div>
                </div>`;
    crit.forEach((c, i) => {
        form += `<div class="form-group row">
                    <label for="nilaiC${i + 1}" class="col-sm-4 col-form-label">${c.kriteria}</label>
                    <div class="col-sm-8">
                        <input type="number" class="form-control" id="nilaiC${i + 1}" value="${alt[idx].nilai[i]}">
                    </div>
                </div>`;
    });
    $('#editForm').html(form);
}

function addEventHapus(elemen) {
    elemen.forEach(function (btn, i) {
        btn.addEventListener('click', function (e) {
            if (confirm("Yakin ingin menghapus alternatif ini?")) {
                // hapis alternatif ke-i
                hapusAlternatif(i);
            } else {

            }
        });
    });
}

function addEventEdit(elemen) {
    elemen.forEach(function (btn, i) {
        btn.addEventListener('click', async function (e) {

            // update form
            updateFormEdit(await getCriteria(), await getAlternatif(), i);

            //munculkan modal
            $("#edit-modal").modal();

        });
    });
}

async function hapusAlternatif(idx) {
    // ambil data sekarang
    const alt = await getAlternatif();

    //hapus data ke-idx
    alt.splice(idx, 1);

    // simpan 
    localStorage.setItem("alternatif", JSON.stringify(alt));

    //update tabel
    updateTableAlternatif(alt);
}

function validasiInput(data) {
    let bool = true;
    if (data.nama == '') {
        bool = false;
    } else if (data.nilai.includes(NaN)) {
        bool = false;
    }
    return bool;
}