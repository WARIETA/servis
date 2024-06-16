document.getElementById('add-window').addEventListener('click', function() {
    const width = parseFloat(document.getElementById('width').value);
    const height = parseFloat(document.getElementById('height').value);

    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
        alert('Prosím zadejte platné rozměry.');
        return;
    }

    const perimeter = 2 * (width + height) / 100; // Convert to meters
    const table = document.getElementById('result-table').getElementsByTagName('tbody')[0];

    const newRow = table.insertRow();
    newRow.insertCell(0).textContent = 'OKNO';
    newRow.insertCell(1).textContent = `${width} x ${height}`;
    newRow.insertCell(2).textContent = '1';
    newRow.insertCell(3).textContent = perimeter.toFixed(2);
    newRow.insertCell(4).textContent = perimeter.toFixed(2);

    const actionCell = newRow.insertCell(5);
    const increaseButton = document.createElement('button');
    increaseButton.textContent = '+';
    increaseButton.addEventListener('click', function() {
        const countCell = newRow.cells[2];
        const currentCount = parseInt(countCell.textContent, 10);
        countCell.textContent = currentCount + 1;
        updateRow(newRow, width, height, currentCount + 1);
    });

    const decreaseButton = document.createElement('button');
    decreaseButton.textContent = '-';
    decreaseButton.addEventListener('click', function() {
        const countCell = newRow.cells[2];
        const currentCount = parseInt(countCell.textContent, 10);
        if (currentCount > 1) {
            countCell.textContent = currentCount - 1;
            updateRow(newRow, width, height, currentCount - 1);
        }
    });

    actionCell.appendChild(increaseButton);
    actionCell.appendChild(decreaseButton);
});

function updateRow(row, width, height, count) {
    const perimeter = 2 * (width + height) / 100;
    row.cells[3].textContent = perimeter.toFixed(2);
    row.cells[4].textContent = (perimeter * count).toFixed(2);
}
