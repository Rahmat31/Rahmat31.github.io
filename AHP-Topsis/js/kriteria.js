////////////// Event
const navButton = document.getElementById("navButton");
const mySidenav = document.getElementById("mySidenav");
const topNav = document.getElementById("topNav");
const content = document.getElementById("content");
const tambah = document.getElementById("tambah");
const simpan = document.getElementById("simpan");


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

tambah.addEventListener('click', async function () {
    //buat objek dari form
    let newCrit = getDataForm("tambahForm");

    //validasi
    if (newCrit.kriteria == '') {
        alert("Harap isikan nama kriteria");
    } else {
        //ambil data sekarang
        const crit = await getCriteria();
        const alt = await getAlternatif();

        //Tambahkan nilai kepentingan pada kriteria sebelumnya
        await addNilaiKepentingan(crit, newCrit);

        //gabungkan data
        crit.push(newCrit);

        //tambahkan nilai default pada alternatif
        addDefValue(alt);

        // simpan 
        localStorage.setItem("kriteria", JSON.stringify(crit));
        localStorage.setItem("alternatif", JSON.stringify(alt));

        //update tabel
        updateTableCriteria(crit);
        updateTableKepentingan(crit);

        //clear form
        document.getElementById("tambahForm").reset();
    }
});

simpan.addEventListener('click', async function () {
    //buat objek dari form
    let newCrit = getDataForm("editForm");
    newCrit.nilai.pop();

    //validasi nama
    if (newCrit.kriteria == '') {
        alert("Harap isikan nama kriteria");
    } else {
        //ambil data sekarang
        const crit = await getCriteria();
        const alt = await getAlternatif();

        let idx = this.parentElement.previousSibling.previousSibling.firstChild.nextSibling.firstChild.getAttribute("value");

        //Edit nilai kepentingan pada kriteria sebelumnya
        editNilaiKepentingan(crit, newCrit, idx);

        //gabungkan data
        crit.splice(idx, 1, newCrit);

        // simpan 
        localStorage.setItem("kriteria", JSON.stringify(crit));

        //update tabel
        updateTableCriteria(crit);
        updateTableKepentingan(crit);
    }
});


$(document).ready(async function () {
    const criteria = await getCriteria();
    updateTableCriteria(criteria);
    updateTableKepentingan(criteria);

});

function updateTableCriteria(crit) {
    let row = '';
    let head = `<tr>
                <th>Kriteria</th>`;
    crit.forEach((c, i) => {
        row += `<tr>
                <td>${i + 1}</td>
                <td>${c.kriteria}</td>
                <td>${c.jenis}</td>
                <td>
                     <button class="btn btn-sm btn-primary smoll" id="edit">Edit</button>
                     <button class="btn btn-sm btn-danger smoll" id="hapus">Hapus</button>
                </td>
                </tr>`;
        head += `<th><b>C${i + 1}</b></th>`;
    });
    head += `</tr>`;
    $('.criteria-table').html(row);
    $('#head').html(head);

    const hapus = document.querySelectorAll("#hapus");
    addEventHapus(hapus);

    const edit = document.querySelectorAll("#edit");
    addEventEdit(edit);

    updateFormTambah(crit);

    addEventInput();

}

function updateTableKepentingan(value) {
    let row = '';
    value.forEach((v, i) => {
        row += `<tr>
                <td><b>C${i + 1}</b></td>`
        row += setNilai(v.nilai);
        row += `</tr>`;
    });
    $('.pair-table').html(row);
}

function setNilai(n) {
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

function updateFormTambah(crit) {
    let form = `<div class="form-group row">
                    <label for="inputKriteria" class="col-sm-4 col-form-label">Kriteria</label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control" id="inputKriteria" placeholder="Kriteria">
                    </div>
                </div>
                <div class="form-group row">
                    <label for="jenisKriteria" class="col-sm-4 col-form-label">Jenis</label>
                    <div class="col-sm-8">
                        <select class="custom-select">
                            <option value="Benefit">Benefit</option>
                            <option value="Cost">Cost</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <input class="form-control text-center" type="text" placeholder="Nilai Kepentingan" readonly="">
                </div>`;
    crit.forEach((c, i) => {
        form += `<div class="form-group">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-addon input-group-text" id="kriteriaBaru">Kriteria</span>
                        </div>
                        <select class="custom-select">
                            <option value="0.111">1/9 - Extremely less important</option>
                            <option value="0.125">1/8 - Far less important to extremely less important</option>
                            <option value="0.143">1/7 - Far less important</option>
                            <option value="0.167">1/6 - Way to far less important</option>
                            <option value="0.2">1/5 - Way less important</option>
                            <option value="0.25">1/4 - Slightly to way less important</option>
                            <option value="0.333">1/3 - Slightly less important</option>
                            <option value="0.5">1/2 - Equally or slightly less important</option>
                            <option selected value="1">1 - Equally important</option>
                            <option value="2">2 - Equally or slightly more important</option>
                            <option value="3">3 - Slightly more important</option>
                            <option value="4">4 - Slightly to much more important</option>
                            <option value="5">5 - Much more important</option>
                            <option value="6">6 - Much to far more important</option>
                            <option value="7">7 - Far more important</option>
                            <option value="8">8 - Far more important to extremely more important</option>
                            <option value="9">9 - Extremely more important</option>
                        </select>
                        <div class="input-group-append">
                            <span class="input-group-addon input-group-text">${c.kriteria}</span>
                        </div>
                        </div>
                </div>`;
    });
    $('#tambahForm').html(form);
}

function addEventInput() {
    const typing = document.getElementById("inputKriteria");
    const value = document.querySelectorAll("#kriteriaBaru");
    typing.addEventListener('input', function (e) {
        value.forEach((v, i) => {
            v.innerHTML = document.getElementById("inputKriteria").value;
        });
    });
}

function addEventInput2() {
    const typing2 = document.getElementById("editKriteria");
    const value2 = document.querySelectorAll("#editBaru");
    typing2.addEventListener('input', function (e) {
        value2.forEach((v, i) => {
            v.innerHTML = document.getElementById("editKriteria").value;
        });
    });
}

function getDataForm(str) {
    let obj = {};
    const formElements = document.getElementById(str).elements;
    obj.kriteria = formElements[0].value;
    obj.jenis = formElements[1].value;
    let nilai = [];
    for (let i = 3; i < formElements.length; i++) {
        nilai.push(parseFloat(formElements[i].value));
    }
    nilai.push(1);
    obj.nilai = nilai;
    return obj;
}

function addNilaiKepentingan(oldC, newC) {
    const up = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const down = [1, 0.5, 0.333, 0.25, 0.2, 0.167, 0.143, 0.125, 0.111];

    let nilai = [];
    for (let i = 0; i < newC.nilai.length; i++) {
        if (newC.nilai[i] > 1) {
            nilai.push(down[up.indexOf(newC.nilai[i])]);
        } else {
            nilai.push(up[down.indexOf(newC.nilai[i])]);
        }
    }
    oldC.forEach((c, i) => {
        c.nilai.push(nilai[i])
    });

    return oldC;
}

function editNilaiKepentingan(oldC, newC, idx) {
    const up = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const down = [1, 0.5, 0.333, 0.25, 0.2, 0.167, 0.143, 0.125, 0.111];

    let nilai = [];
    for (let i = 0; i < newC.nilai.length; i++) {
        if (newC.nilai[i] > 1) {
            nilai.push(down[up.indexOf(newC.nilai[i])]);
        } else {
            nilai.push(up[down.indexOf(newC.nilai[i])]);
        }
    }

    oldC.forEach((c, i) => {
        c.nilai.splice(idx, 1, nilai[i]);
    });
}

function addDefValue(alt) {
    alt.forEach((a) => {
        a.nilai.push(1);
    });
}

function addEventHapus(node) {
    node.forEach((e, i) => {
        e.addEventListener('click', function (e) {
            if (confirm("Yakin ingin menghapus kriteria ini?")) {
                // hapus kriteria ke-i
                hapusKriteria(i);
            }
        });
    });
}

function addEventEdit(node) {
    node.forEach((e, i) => {
        e.addEventListener('click', function (e) {
            modalEditShow(i);
        });
    });
}

async function hapusKriteria(idx) {
    // ambil data sekarang
    const crit = await getCriteria();
    const alt = await getAlternatif();

    //hapus nilai kepentingan dari kriteria
    deleteValueOfCrit(crit, idx);

    //hapus nilai kriteria pada alternatif
    deleteValueOfAlter(alt, idx);

    //hapus data kriteria ke-idx
    crit.splice(idx, 1);

    // simpan 
    localStorage.setItem("kriteria", JSON.stringify(crit));
    localStorage.setItem("alternatif", JSON.stringify(alt));

    //update tabel
    updateTableCriteria(crit);
    updateTableKepentingan(crit);
}

function deleteValueOfAlter(alt, idx) {
    alt.forEach((a) => {
        a.nilai.splice(idx, 1);
    });
}

function deleteValueOfCrit(crit, idx) {
    crit.forEach((c) => {
        c.nilai.splice(idx, 1);
    });
}

async function modalEditShow(idx) {
    const crit = await getCriteria();
    let form = `<div class="form-group row" value="${idx}">
                    <label for="inputKriteria" class="col-sm-4 col-form-label">Kriteria</label>
                    <div class="col-sm-8">
                        <input type="text" class="form-control" id="editKriteria" value="${crit[idx].kriteria}">
                    </div>
                </div>
                <div class="form-group row">
                    <label for="jenisKriteria" class="col-sm-4 col-form-label">Jenis</label>
                    <div class="col-sm-8">
                        <select class="custom-select" id="jenis">
                            <option value="Benefit">Benefit</option>
                            <option value="Cost">Cost</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <input class="form-control text-center" type="text" placeholder="Nilai Kepentingan" readonly="">
                </div>`;
    crit.forEach((c, i) => {
        form += `<div class="form-group">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-addon input-group-text" id="editBaru">${crit[idx].kriteria}</span>
                        </div>`;
        if (i == idx) {
            form += `<select class="custom-select" id="kepentingan" disabled>`;
        } else {
            form += `<select class="custom-select" id="kepentingan">`;
        }

        form += `<option value="0.111">1/9 - Extremely less important</option>
                            <option value="0.125">1/8 - Far less important to extremely less important</option>
                            <option value="0.143">1/7 - Far less important</option>
                            <option value="0.167">1/6 - Way to far less important</option>
                            <option value="0.2">1/5 - Way less important</option>
                            <option value="0.25">1/4 - Slightly to way less important</option>
                            <option value="0.333">1/3 - Slightly less important</option>
                            <option value="0.5">1/2 - Equally or slightly less important</option>
                            <option selected value="1">1 - Equally important</option>
                            <option value="2">2 - Equally or slightly more important</option>
                            <option value="3">3 - Slightly more important</option>
                            <option value="4">4 - Slightly to much more important</option>
                            <option value="5">5 - Much more important</option>
                            <option value="6">6 - Much to far more important</option>
                            <option value="7">7 - Far more important</option>
                            <option value="8">8 - Far more important to extremely more important</option>
                            <option value="9">9 - Extremely more important</option>
                        </select>
                        <div class="input-group-append">
                            <span class="input-group-addon input-group-text">${c.kriteria}</span>
                        </div>
                        </div>
                </div>`;
    });
    $('#editForm').html(form);

    addEventInput2();

    const jenis = document.getElementById("jenis").options;
    if (crit[idx].jenis == "Benefit") {
        jenis.selectedIndex = 0;
    } else {
        jenis.selectedIndex = 1;
    }

    const up = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const down = [1, 0.5, 0.333, 0.25, 0.2, 0.167, 0.143, 0.125, 0.111];

    const nilai = document.querySelectorAll("#kepentingan");
    nilai.forEach((n, i) => {
        if (crit[idx].nilai[i] > 1) {
            n.selectedIndex = (n.selectedIndex + up.indexOf(crit[idx].nilai[i]));
        } else {
            n.selectedIndex = (n.selectedIndex - down.indexOf(crit[idx].nilai[i]));
        }
    });




    $('#edit-modal').modal();
}