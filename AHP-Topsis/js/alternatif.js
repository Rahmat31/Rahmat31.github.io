const navButton = document.getElementById("navButton");
const mySidenav = document.getElementById("mySidenav");
const topNav = document.getElementById("topNav");

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
})

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
}

function updateTableAlternatif(alt) {
    let row = '';
    alt.forEach((c, i) => {
        row += `<tr>
                        <td>${i+1}</td>
                        <td>${c.nama}</td> `
        row += setAlternatif(c.nilai);
        row += `<td><a href="" class="btn btn-primary btn-sm smoll"> Edit </a>
                <a href="" class="btn btn-danger btn-sm smoll"> Hapus </a></td>
                </tr>`;
    });
    $('.alternatif-table').html(row);
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