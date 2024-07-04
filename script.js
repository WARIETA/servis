document.getElementById('add-window').addEventListener('click', function() {
    addDoor('Okno');
});

document.getElementById('add-balcony').addEventListener('click', function() {
    addDoor('Bal');
});

document.getElementById('add-sliding').addEventListener('click', function() {
    addDoor('Posuvné');
});

document.getElementById('add-entrance').addEventListener('click', function() {
    addDoor('Vchodovky');
});

document.getElementById('copy-table').addEventListener('click', function() {
    copyTable();
});

function addDoor(type) {
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const windowType = document.getElementById('window-type').value;

    const width = parseFloat(widthInput.value);
    const height = parseFloat(heightInput.value);

    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
        alert('Prosím zadejte platné rozměry.');
        return;
    }

    let perimeter;
    if (windowType === 'plastic') {
        perimeter = 2 * 2 * (width + height) / 100; // Dvojnásobný obvod pro plastová okna
    } else if (windowType === 'wood') {
        perimeter = 2 * (width + height) / 100;
    }

    const resultContainer = document.getElementById('result-container');
    const totalContainer = document.getElementById('total-perimeter');

    widthInput.value = '';
    heightInput.value = '';

    let tableHeader = document.getElementById(`${type}-header`);
    if (!tableHeader) {
        tableHeader = document.createElement('div');
        tableHeader.id = `${type}-header`;
        tableHeader.textContent = `${type} (0x)`;
        resultContainer.appendChild(tableHeader);
    }

    let lastRowOfType = null;
    const rows = resultContainer.querySelectorAll('.table-row');
    rows.forEach(row => {
        if (row.getAttribute('data-type') === type) {
            lastRowOfType = row;
        }
    });

    const newRow = document.createElement('div');
    newRow.classList.add('table-row');
    newRow.setAttribute('data-type', type);
    newRow.innerHTML = `
        <div class="dimensions">${width}x${height}</div>
        <div class="count">1x</div>
        <div class="perimeter">${perimeter.toFixed(1)}m</div>
        <div class="total-perimeter">(${perimeter.toFixed(1)}m)</div>
        <button class="increase">+</button>
        <button class="decrease">-</button>
    `;

    if (lastRowOfType) {
        lastRowOfType.parentNode.insertBefore(newRow, lastRowOfType.nextSibling);
    } else {
        resultContainer.appendChild(newRow);
    }

    const increaseButton = newRow.querySelector('.increase');
    const decreaseButton = newRow.querySelector('.decrease');
    const countElement = newRow.querySelector('.count');
    const perimeterElement = newRow.querySelector('.perimeter');
    const totalPerimeterElement = newRow.querySelector('.total-perimeter');

    function updateTotal() {
        let total = 0;
        resultContainer.querySelectorAll('.total-perimeter').forEach(function(element) {
            const value = parseFloat(element.textContent.replace(/[^\d.-]/g, ''));
            total += value;
        });
        totalContainer.textContent = `${total.toFixed(1)}m`;
    }

    function updateHeaderCount() {
        const header = document.getElementById(`${type}-header`);
        if (header) {
            const rowsOfType = resultContainer.querySelectorAll(`.table-row[data-type="${type}"]`);
            let totalCount = 0;
            rowsOfType.forEach(function(row) {
                const countEl = row.querySelector('.count');
                totalCount += parseInt(countEl.textContent);
            });
            header.textContent = `${type} (${totalCount}x)`;
        }
    }

    increaseButton.addEventListener('click', function() {
        let count = parseInt(countElement.textContent);
        count++;
        countElement.textContent = `${count}x`;
        totalPerimeterElement.textContent = `(${(count * perimeter).toFixed(1)}m)`;
        updateTotal();
        updateHeaderCount();
    });

    decreaseButton.addEventListener('click', function() {
        let count = parseInt(countElement.textContent);
        if (count > 1) {
            count--;
            countElement.textContent = `${count}x`;
            totalPerimeterElement.textContent = `(${(count * perimeter).toFixed(1)}m)`;
        } else {
            if (confirm('Opravdu chcete odstranit tento rozměr?')) {
                newRow.remove();
            }
        }
        updateTotal();
        updateHeaderCount();
    });

    updateTotal();
    updateHeaderCount();
}

function copyTable() {
    const windowType = document.getElementById('window-type').value === 'plastic' ? 'PLAST' : 'DŘEVO';
    const hardwareType = document.getElementById('hardware-type').value;
    const sealType = document.getElementById('seal-type').value;

    const resultContainer = document.getElementById('result-container');
    let copyText = `servis ${windowType}. Typ kování - ${hardwareType}. Typ těsnění - ${sealType}\n\n`;

    const rows = resultContainer.querySelectorAll('.table-row');
    const groupedRows = {};

    rows.forEach(function(row) {
        const type = row.getAttribute('data-type');
        const dimensions = row.querySelector('.dimensions').textContent;
        const count = row.querySelector('.count').textContent;
        const perimeter = row.querySelector('.perimeter').textContent;
        const totalPerimeter = row.querySelector('.total-perimeter').textContent;

        if (!groupedRows[type]) {
            groupedRows[type] = [];
        }

        groupedRows[type].push({
            dimensions,
            count: parseInt(count),
            perimeter,
            totalPerimeter
        });
    });

    Object.keys(groupedRows).forEach(function(type) {
        const totalCount = groupedRows[type].reduce((acc, row) => acc + row.count, 0);
        copyText += `${type} (${totalCount}x)\n`;
        groupedRows[type].forEach(function(row) {
            copyText += `${row.dimensions}   ${row.count}x   ${row.perimeter}   ${row.totalPerimeter}\n`;
        });
    });

    const totalPerimeter = document.getElementById('total-perimeter').textContent;
    copyText += `\nDohromady: ${totalPerimeter}`;

    navigator.clipboard.writeText(copyText).then(function() {
        alert('Tabulka byla zkopírována do schránky.');
    }, function(err) {
        alert('Došlo k chybě při kopírování tabulky: ', err);
    });
}

window.addEventListener('beforeunload', function(event) {
    event.preventDefault();
    event.returnValue = '';
});
