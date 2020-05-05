const navButton = document.getElementById("navButton");
const mySidenav = document.getElementById("mySidenav");
const topNav = document.getElementById("topNav");
const content = document.getElementById("content");
const addCrit = document.getElementById("addCriteria");

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

// addCrit.addEventListener('click', async function () {
//     const criteria = await getCriteria();

// })

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
                <td>${i+1}</td>
                <td>${c.kriteria}</td>
                <td>${c.jenis}</td>
                <td>
                     <a href="" class="btn btn-sm btn-primary smoll">Edit</a>
                     <a href="" class="btn btn-sm btn-danger smoll">Hapus</a>
                </td>
                </tr>`;
        head += `<th><b>C${i+1}</b></th>`;
    });
    head += `</tr>`;
    $('.criteria-table').html(row);
    $('#head').html(head);
}

function updateTableKepentingan(value) {
    let row = '';
    value.forEach((v, i) => {
        row += `<tr>
                <td><b>C${i+1}</b></td>`
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
    return fetch('json/criteria.json').then(response => response.json()).then(response => response);
}