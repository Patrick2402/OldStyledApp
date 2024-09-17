document.addEventListener('DOMContentLoaded', () => {
    const table = document.querySelector('#result-table table');

    table.addEventListener('click', (event) => {
        const target = event.target;

        if (target.classList.contains('severity-text')) {
            const cell = target.parentElement;
            const currentSeverity = target.textContent;

     

            const dropdown = document.createElement('select');
            dropdown.classList.add('severity-dropdown');
            ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].forEach(severity => {
                const option = document.createElement('option');
                option.value = severity;
                option.textContent = severity;
                if (severity === currentSeverity.toUpperCase()) {
                    option.selected = true;
                }
                dropdown.appendChild(option);
            });

            target.replaceWith(dropdown);

            dropdown.addEventListener('change', () => {
                const newSeverity = dropdown.value;
                const rowId = cell.getAttribute('data-id');
                console.log('FETCH')
                console.log(rowId);
                fetch(`/update-severity/${rowId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ severity: newSeverity })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const newText = document.createElement('span');
                        newText.classList.add('severity-text');
                        newText.textContent = newSeverity;
                        cell.className = `severity-cell severity-${newSeverity.toLowerCase()}`;
                        dropdown.replaceWith(newText);
                    } else {
                        alert('Failed to update severity');
                        dropdown.replaceWith(target); 
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred');
                    dropdown.replaceWith(target); // Przywróć pierwotny tekst w razie błędu
                });
            });
        }
    });
});