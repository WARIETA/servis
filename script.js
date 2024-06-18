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
        <div class="details">
            <span class="count">1x</span> 
            <span class="perimeter">${perimeter.toFixed(1)}m</span> 
            (<span class="total-perimeter">${perimeter.toFixed(1)}m</span>) 
            <button class="increase">+</button> 
            <button class="decrease">-</button>
        </div>
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
        resultContainer.querySelectorAll('.total-perimeter').forEach(function(el) {
            total += parseFloat(el.textContent);
        });
        totalContainer.textContent = `${total.toFixed(1)}m`;
    }

    function updateHeaderCount() {
        const header = document.getElementById(`${type}-header`);
        let count = 0;
        resultContainer.querySelectorAll(`.table-row[data-type="${type}"] .count`).forEach(function(el) {
            count += parseInt(el.textContent);
        });
        header.textContent = `${type} (${count}x)`;
    }

    increaseButton.addEventListener('click', function() {
        const currentCount = parseInt(countElement.textContent);
        countElement.textContent = `${currentCount + 1}x`;
        updateRow(currentCount + 1);
        updateTotal();
        updateHeaderCount();
    });

    decreaseButton.addEventListener('click', function() {
        const currentCount = parseInt(countElement.textContent);
        if (currentCount > 1) {
            countElement.textContent = `${currentCount - 1}x`;
            updateRow(currentCount - 1);
            updateTotal();
            updateHeaderCount();
        } else if (currentCount === 1) {
            if (confirm('Opravdu chcete odstranit tento řádek?')) {
                resultContainer.removeChild(newRow);
                updateTotal();
                updateHeaderCount();
            }
        }
    });

    function updateRow(count) {
        totalPerimeterElement.textContent = `${(perimeter * count).toFixed(1)}m`;
    }

    updateTotal();
    updateHeaderCount();
}

// Function to copy table
function copyTable() {
    const resultContainer = document.getElementById('result-container');
    const totalPerimeter = document.getElementById('total-perimeter').textContent;
    const rows = resultContainer.querySelectorAll('.table-row');
    const windowType = document.getElementById('window-type').value;
    const hardwareType = document.getElementById('hardware-type').value;
    const sealType = document.getElementById('seal-type').value;

    let copyText = `servis ${windowType === 'plastic' ? 'PLAST' : 'DŘEVO'}. Typ kování - ${hardwareType}. Typ těsnění - ${sealType}\n\n`;

    let lastType = null;
    const typeCounts = {};

    rows.forEach(row => {
        const type = row.getAttribute('data-type');
        if (type) {
            if (!typeCounts[type]) {
                typeCounts[type] = 0;
            }
            const rowCount = parseInt(row.querySelector('.count').textContent);
            typeCounts[type] += rowCount;
        }
    });

    rows.forEach(row => {
        const type = row.getAttribute('data-type');
        if (type && type !== lastType) {
            if (lastType) {
                copyText += '\n'; // Add newline for separation between sections
            }
            copyText += `${type} (${typeCounts[type]}x)\n`;
            lastType = type;
        }
        const dimensions = row.querySelector('.dimensions').textContent.trim();
        const count = row.querySelector('.count').textContent.trim();
        const perimeter = row.querySelector('.perimeter').textContent.trim();
        const totalPerimeter = row.querySelector('.total-perimeter').textContent.trim();
        copyText += ` ${dimensions} ${count} ${perimeter} (${totalPerimeter})\n`;
    });

    copyText += `\nDohromady ${totalPerimeter}`;

    const textarea = document.createElement('textarea');
    textarea.value = copyText;
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        alert('Tabulka byla zkopírována do schránky.');
    } catch (err) {
        alert('Kopírování se nezdařilo. Zkuste to znovu.');
    }
    document.body.removeChild(textarea);
}

// Prevent accidental page refresh or navigation
window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    e.returnValue = '';
});
