var studentlist = new Map();
var table = document.getElementById("reporttable");
studentlist.set("name1", 123456);
studentlist.set("name2", 234567);

function populateList() {
    clearlist();
    for (const [name, id] of studentlist) {
        addToList(name, id);
    }
}

function clearlist() {
    const rows = table.querySelectorAll('.row');
    rows.forEach(row => row.remove());
}

function addToList(name, id) {
    const row = document.createElement('li');
    row.classList.add('row');

    const nameCell = document.createElement('div');
    nameCell.classList.add('name');
    nameCell.textContent = name;
    row.appendChild(nameCell);

    const idCell = document.createElement('div');
    idCell.classList.add('id');
    idCell.textContent = id;
    row.appendChild(idCell);

    const timeInCell = document.createElement('div');
    timeInCell.classList.add('timein');
    timeInCell.textContent = "00:00";
    row.appendChild(timeInCell);

    const elapsedTimeCell = document.createElement('div');
    elapsedTimeCell.classList.add('timer');
    elapsedTimeCell.textContent = "00:00";
    row.appendChild(elapsedTimeCell);

    const timeOutCell = document.createElement('div');
    timeOutCell.classList.add('timeout');
    timeOutCell.textContent = "00:00";
    row.appendChild(timeOutCell);

    table.appendChild(row);
}

function search(input) {
    clearlist();
    for(const[name, id] of studentlist) {
        if(name == input) {
            addToList(name, id);
        }
    }
}
