let configData = {};

// Load and Save Config JSON
document.getElementById('configFile').addEventListener('change', event => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        configData = JSON.parse(e.target.result);
        populateConfigFields();
    };

    if (file) reader.readAsText(file);
});

document.getElementById('saveConfigJson').addEventListener('click', () => {
    saveJsonFile('config.json', configData);
});

function populateConfigFields() {
    document.getElementById('clanId').value = configData.clanId || '';
    document.getElementById('whatsappName').value = configData.whatsapp?.name || '';
    document.getElementById('whatsappLink').value = configData.whatsapp?.link || '';
}

function saveJsonFile(fileName, jsonData) {
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
}

// Update configData when fields are changed
document.getElementById('clanId').addEventListener('input', event => {
    configData.clanId = event.target.value;
});

document.getElementById('whatsappName').addEventListener('input', event => {
    if (!configData.whatsapp) configData.whatsapp = {};
    configData.whatsapp.name = event.target.value;
});

document.getElementById('whatsappLink').addEventListener('input', event => {
    if (!configData.whatsapp) configData.whatsapp = {};
    configData.whatsapp.link = event.target.value;
});
