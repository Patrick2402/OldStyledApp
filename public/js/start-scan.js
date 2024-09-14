document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('scanForm');
    const loader = document.getElementById('loader');
    const statusDiv = document.getElementById('status');

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Zablokuj domyślną akcję formularza
        loader.style.display = 'block'; // Pokaż loader

        const formData = new FormData(form);
        const response = await fetch('/start-scan', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        const scanId = data.scanId;

        // Regularne sprawdzanie statusu
        const checkStatus = async () => {
            const statusResponse = await fetch(`/scan-status/${scanId}`);
            const statusData = await statusResponse.json();
            const status = statusData.status;

            if (status === 'completed') {
                loader.style.display = 'none'; 
                statusDiv.textContent = 'Scan completed successfully!';
            } else if (status === 'failed') {
                loader.style.display = 'none'; 
                statusDiv.textContent = 'Scan failed.';
            } else {
                setTimeout(checkStatus, 2000); 
            }
        };

        checkStatus();
    });
});