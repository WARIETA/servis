// Event listeners for adding doors
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

// Function to add a door with specified type
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
        perimeter = 4 * (width + height) / 100; // 4x for plastic windows
    } else if (windowType === 'wood') {
        perimeter = 2 * (width + height) / 100; // 2x for wooden windows
    }

    const resultContainer = document.getElementById('result-container');
    const totalContainer = document.getElementById('total-perimeter');

    // Clear input fields
    widthInput.value = '';
    heightInput.value = '';

    // Check if header exists for the type
    let tableHeader = document.getElementById(`${type}-header`);
    if (!tableHeader) {
        tableHeader = document.createElement('div');
        tableHeader.id = `${type}-header`;
        tableHeader.textContent = `${type}`;
        resultContainer.appendChild(tableHeader);
    }

    // Find the last row of this type to insert after
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
        <div class="dimensions">
            ${width}x${height}
        </div>
        <div class="count">
            1x
        </div>
        <div class="perimeter">
            ${perimeter.toFixed(1)}m
        </div>
        <div class="total-perimeter">
            (${perimeter.toFixed(1)}m)
        </div>
        <button class="increase">+</button>
        <button class="decrease">-</button>
    `;

    // Insert new row after the last row of this type
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
            updateTotal();
            updateHeaderCount();
        }
    });

    updateTotal();
    updateHeaderCount();
}

// Function to copy the table
function copyTable() {
    const windowType = document.getElementById('window-type').value === 'plastic' ? 'PLAST' : 'DŘEVO';
    const hardwareType = document.getElementById('hardware-type').value;
    const sealType = document.getElementById('seal-type').value;

    const resultContainer = document.getElementById('result-container');
    const totalPerimeter = document.getElementById('total-perimeter').textContent;

    let text = `servis ${windowType}. Typ kování - ${hardwareType}. Typ těsnění - ${sealType}\n\n`;

    const headers = resultContainer.querySelectorAll('div[id$="-header"]');
    headers.forEach(function(header) {
        text += `${header.textContent}\n`;

        const rows = resultContainer.querySelectorAll(`.table-row[data-type="${header.id.split('-')[0]}"]`);
        rows.forEach(function(row) {
            const dimensions = row.querySelector('.dimensions').textContent.trim();
            const count = row.querySelector('.count').textContent.trim();
            const perimeter = row.querySelector('.perimeter').textContent.trim();
            const totalPerimeter = row.querySelector('.total-perimeter').textContent.trim();
            text += ` ${dimensions}   ${count}   ${perimeter}   ${totalPerimeter}\n`;
        });

        text += '\n';
    });

    text += `Dohromady: ${totalPerimeter}`;

    navigator.clipboard.writeText(text).then(function() {
        alert('Tabulka byla zkopírována do schránky.');
    }, function(err) {
        console.error('Could not copy text: ', err);
    });
}
