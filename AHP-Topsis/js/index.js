const navButton = document.getElementById("navButton");
const mySidenav = document.getElementById("mySidenav");
const topNav = document.getElementById("topNav");
const content = document.getElementById("content");

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

$(document).ready(async function () {
    const criteria = await getCriteria();
    updateTableCriteria(criteria);

    const alternatif = await getAlternatif();
    updateTableAlternatif(alternatif);

    const bobot = hitungAHP(criteria);

    const hasil = hitungTopsis(alternatif, bobot, criteria);

    const rank = hitungRangking(hasil);

    updateTableHasil(alternatif, hasil, rank);
});

function updateTableCriteria(crit) {
    let row = '';
    let head = `<tr>
                <th>NO</th>
                <th>Alternatif</th>`;
    crit.forEach((c, i) => {
        row += `<tr>
                <td>${i + 1}</td>
                <td>${c.kriteria}</td>
                <td>${c.jenis}</td>
                </tr>`;
        head += `<th>C${i + 1}</th>`;
    });
    head += `</tr>`;
    $('.criteria-table').html(row);
    $('#head').html(head);
}

function updateTableAlternatif(alt) {
    let row = '';
    alt.forEach((c, i) => {
        row += `<tr>
                        <td>${i + 1}</td>
                        <td>${c.nama}</td> `
        row += setAlternatif(c.nilai);
        row += `</tr>`
    });
    $('.alternatif-table').html(row);
}

function updateTableHasil(alt, hasil, rank) {
    let row = '';
    alt.forEach((c, i) => {
        row += `<tr>
                    <td>A${i + 1}</td>
                    <td>${c.nama}</td> 
                    <td>${hasil[i].toFixed(4)}</td>
                    <td>${rank[i]}</td>
                </tr>`;
    });
    $('.result-table').html(row);
}

function setAlternatif(n) {
    let row = '';
    n.forEach(arr => {
        row += `<td>${arr}</td> `
    })
    return row;
}

function getCriteria() {
    return fetch('json/criteria.json').then(response => response.json()).then(response => response);
}

function getAlternatif() {
    return fetch('json/alternatif.json').then(response => response.json()).then(response => response);
}

function hitungAHP(crit) {
    //Ambil nilai perbandingan dan total
    const nilai = getPerbandingan(crit);
    const total = addTotal(nilai);

    //hitung matriks ternormalisasi
    const normalisasi = hitungNormalisasi(nilai, total);

    //hitung nilai eigen/bobot
    const bobot = hitungEigen(normalisasi);

    //hitung konsistensi bobot
    const nilaiCR = hitungKonsistensi(nilai, bobot);

    //cek nilai CR
    if (nilaiCR < 0.1) {
        return bobot;
    } else {
        alert('Harap edit Kriteria, Nilai CR =' + nilaiCR);
    }

    // console.log(nilai);
    // console.log(total);
    // console.log(normalisasi);
    // console.log(bobot);
    // console.log(nilaiCR);

}

function getPerbandingan(n) {
    let array = [];
    n.forEach((element, i) => {
        array.push(element.nilai);
    });
    return array;
}

function addTotal(n) {
    let total = [];
    let temp = 0;
    for (let i = 0; i < n.length; i++) {
        temp = 0;
        for (let j = 0; j < n.length; j++) {
            temp = temp + n[j][i];
        };
        total.push(temp);
    };
    return total;
}

function hitungNormalisasi(a, b) {
    let normal = [];
    let row = [];
    for (let i = 0; i < a.length; i++) {
        row = [];
        a[i].forEach((n, j) => {
            row.push(n / b[j]);
        });
        normal.push(row);
    };
    return normal;
}

function hitungEigen(a) {
    let eigen = [];
    let temp = 0;

    for (let i = 0; i < a.length; i++) {
        temp = 0;
        temp = a[i].reduce((a, b) => a + b);
        eigen.push(temp);
    }
    eigen = eigen.map(n => n / a.length);

    return eigen;
}

function hitungKonsistensi(n, w) {
    const RI = [0, 0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49];

    //tabel perbandingan berpasangan dikalikan bobot (matrix A)
    const matA = perbandinganTerbobot(n, w);

    // jumlah tiap baris matrix a
    const jumlah = sumRow(matA);

    //hitung nilai lamda
    const lamda = hitungLamda(jumlah, w);

    //hitung lamda max (total lamda / jml kriteria)
    const lamdaMAx = (lamda.reduce((a, b) => a + b)) / (lamda.length);

    //hitung CI
    const CI = (lamdaMAx - lamda.length) / (lamda.length - 1);

    //hitung CR
    const CR = CI / RI[lamda.length];

    return CR;
}

function perbandinganTerbobot(a, b) {
    let matrix = [];
    let temp = [];
    for (let i = 0; i < a.length; i++) {
        temp = [];
        a[i].forEach((n, j) => {
            temp.push(n * b[j]);
        });
        matrix.push(temp);
    };
    return matrix;

}

function sumRow(a) {
    let result = [];
    for (let i = 0; i < a.length; i++) {
        result.push(a[i].reduce((a, b) => a + b));
    }
    return result;
}

function hitungLamda(a, b) {
    let result = [];
    for (let i = 0; i < a.length; i++) {
        result.push(a[i] / b[i]);
    }
    return result;
}

function hitungTopsis(alt, w, crit) {
    // buat matrix keputusan
    const matrix = matKeputusan(alt);

    // hitung matrix ternormalisasi
    const normal = matNormalisasi(matrix, w.length);

    //hitung matriks normalisasi terbobot
    const terbobot = matTerbobot(normal, w);

    // cari solusi ideal Positif dan negatif
    const idealPositif = hitungIdealP(terbobot, crit);
    const idealNegatif = hitungIdealN(terbobot, crit);

    // // hitung jarak ideal positif dan negatif
    const jarakPositif = hitungJarakP(terbobot, idealPositif);
    const jarakNegatif = hitungJarakN(terbobot, idealNegatif);

    //hitung nilai preferensi/hasil
    const hasil = hitungHasil(jarakPositif, jarakNegatif);

    // console.log(matrix);
    // console.log(normal);
    // console.log(terbobot);
    // console.log(idealPositif);
    // console.log(idealNegatif);
    // console.log(jarakPositif);
    // console.log(jarakNegatif);
    // console.log(hasil);

    return hasil;
}

function matKeputusan(alt) {
    let mat = [];
    for (let i = 0; i < alt.length; i++) {
        mat.push(alt[i].nilai);
    }
    return mat;
}

function matNormalisasi(m, sumC) {
    let mat = [];
    let temp = [];
    const pembagi = hitungPembagi(m, sumC);
    //console.log(pembagi);
    for (let i = 0; i < m.length; i++) {
        temp = [];
        for (let j = 0; j < sumC; j++) {
            temp.push(m[i][j] / pembagi[j]);
        }
        mat.push(temp);
    }
    return mat;
}

function hitungPembagi(matrix, idx) {
    let mat = [];
    let temp = [];

    for (let i = 0; i < idx; i++) {
        temp = [];
        for (let j = 0; j < matrix.length; j++) {
            temp.push(Math.pow(matrix[j][i], 2));
        }
        mat.push(Math.sqrt(temp.reduce((a, b) => a + b)));
    }
    return mat;
}

function matTerbobot(m, w) {
    let mat = [];
    let temp = [];
    for (let i = 0; i < m.length; i++) {
        temp = [];
        for (let j = 0; j < w.length; j++) {
            temp.push(m[i][j] * w[j]);
        }
        mat.push(temp);
    }
    return mat;
}

function hitungIdealP(m, ct) {
    let idealP = [];
    let temp = [];

    for (let i = 0; i < ct.length; i++) {
        temp = [];
        for (let j = 0; j < m.length; j++) {
            temp.push(m[j][i]);
        }
        if (ct[i].jenis == 'Benefit') {
            idealP.push(Math.max(...temp));
        } else {
            idealP.push(Math.min(...temp));
        }
    }
    return idealP;
}

function hitungIdealN(m, ct) {
    let idealN = [];
    let temp = [];

    for (let i = 0; i < ct.length; i++) {
        temp = [];
        for (let j = 0; j < m.length; j++) {
            temp.push(m[j][i]);
        }
        if (ct[i].jenis == 'Benefit') {
            idealN.push(Math.min(...temp));
        } else {
            idealN.push(Math.max(...temp));
        }
    }
    return idealN;
}

function hitungJarakP(m, sp) {
    let jarakP = [];
    let temp = [];

    for (let i = 0; i < m.length; i++) {
        temp = [];
        for (let j = 0; j < sp.length; j++) {
            temp.push(Math.pow((sp[j] - m[i][j]), 2));
        }
        jarakP.push(Math.sqrt(temp.reduce((a, b) => a + b)));
    }
    return jarakP;
}

function hitungJarakN(m, sn) {
    let jarakN = [];
    let temp = [];

    for (let i = 0; i < m.length; i++) {
        temp = [];
        for (let j = 0; j < sn.length; j++) {
            temp.push(Math.pow((m[i][j] - sn[j]), 2));
        }
        jarakN.push(Math.sqrt(temp.reduce((a, b) => a + b)));
    }
    return jarakN;
}

function hitungHasil(jp, jn) {
    let result = [];
    for (let i = 0; i < jp.length; i++) {
        result.push(jn[i] / (jn[i] + jp[i]));
    }
    return result;
}

function hitungRangking(arr) {
    let sort = arr.slice().sort((a, b) => b - a);
    let rank = arr.map(v => sort.indexOf(v) + 1);
    return rank;
}