let jsonData = {};

function populateTHDropdown() {
    const dropdown = document.getElementById('newTHName');
    dropdown.innerHTML = '<option value="" disabled selected>Select Town Hall</option>';

    Object.keys(jsonData).forEach(thKey => {
        const option = document.createElement('option');
        option.value = thKey;
        option.textContent = thKey.toUpperCase();
        dropdown.appendChild(option);
    });
}

function createArmyLinks(armyLinks, thKey, videoIndex) {
    return armyLinks.map((link, index) => `
        <div class="input-group mb-2">
            <input type="text" class="form-control me-1" placeholder="Text" value="${link.text}" 
                onchange="updateArmyLink('${thKey}', ${videoIndex}, ${index}, 'text', this.value)">
            <input type="text" class="form-control" placeholder="URL" value="${link.url}" 
                onchange="updateArmyLink('${thKey}', ${videoIndex}, ${index}, 'url', this.value)">
            <button class="btn btn-danger btn-sm" onclick="removeArmyLink('${thKey}', ${videoIndex}, ${index})">Remove</button>
        </div>
    `).join('');
}

function renderTownHalls() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = '';

    Object.keys(jsonData).forEach(thKey => {
        const thData = jsonData[thKey];
        const videos = thData.map((video, index) => `
            <div class="card">
                <div class="card-body">
                    <label class="form-label">Video Title:</label>
                    <input type="text" class="form-control mb-2" value="${video.title}" 
                        onchange="updateVideo('${thKey}', ${index}, 'title', this.value)">
                    <label class="form-label">Video URL:</label>
                    <input type="text" class="form-control mb-2" value="${video.videoUrl}" 
                        onchange="updateVideo('${thKey}', ${index}, 'videoUrl', this.value)">
                    <label class="form-label">Army Links:</label>
                    <div>
                        ${createArmyLinks(video.armyLinks, thKey, index)}
                        <button class="btn btn-sm btn-success mt-2" onclick="addArmyLink('${thKey}', ${index})">Add Army Link</button>
                    </div>
                    <button class="btn btn-danger mt-3" onclick="removeVideo('${thKey}', ${index})">Remove Video</button>
                </div>
            </div>
        `).join('');

        mainContent.innerHTML += `
            <div class="accordion-item">
                <h2 class="accordion-header" id="heading-${thKey}">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" 
                        data-bs-target="#collapse-${thKey}" aria-expanded="true" aria-controls="collapse-${thKey}">
                        ${thKey.toUpperCase()}
                    </button>
                </h2>
                <div id="collapse-${thKey}" class="accordion-collapse collapse show" aria-labelledby="heading-${thKey}">
                    <div class="accordion-body">
                        ${videos}
                        <button class="btn btn-primary mt-3" onclick="addVideo('${thKey}')">Add New Video</button>
                    </div>
                </div>
            </div>
        `;
    });
}

document.getElementById('jsonFile').addEventListener('change', event => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        jsonData = JSON.parse(e.target.result);
        renderTownHalls();
        populateTHDropdown();
    };

    if (file) reader.readAsText(file);
});

document.getElementById('saveJson').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'strategies.json';
    a.click();
});

let newArmyLinks = [];


document.getElementById('addNewArmyLink').addEventListener('click', () => {
    const container = document.getElementById('newArmyLinksContainer');
    const index = newArmyLinks.length;

    newArmyLinks.push({ text: '', url: '' });

    const linkElement = document.createElement('div');
    linkElement.className = 'input-group mb-2';
    linkElement.innerHTML = `
        <input type="text" class="form-control me-1" placeholder="Text" onchange="updateNewArmyLink(${index}, 'text', this.value)">
        <input type="text" class="form-control" placeholder="URL" onchange="updateNewArmyLink(${index}, 'url', this.value)">
        <button class="btn btn-danger btn-sm" onclick="removeNewArmyLink(${index})">Remove</button>
    `;
    container.appendChild(linkElement);
});

function updateNewArmyLink(index, field, value) {
    if (newArmyLinks[index]) {
        newArmyLinks[index][field] = value;
    }
}

function removeNewArmyLink(index) {
    newArmyLinks.splice(index, 1);
    const container = document.getElementById('newArmyLinksContainer');
    container.innerHTML = '';

    newArmyLinks.forEach((link, i) => {
        const linkElement = document.createElement('div');
        linkElement.className = 'input-group mb-2';
        linkElement.innerHTML = `
            <input type="text" class="form-control me-1" placeholder="Text" value="${link.text}" onchange="updateNewArmyLink(${i}, 'text', this.value)">
            <input type="text" class="form-control" placeholder="URL" value="${link.url}" onchange="updateNewArmyLink(${i}, 'url', this.value)">
            <button class="btn btn-danger btn-sm" onclick="removeNewArmyLink(${i})">Remove</button>
        `;
        container.appendChild(linkElement);
    });
}

document.getElementById('addTHButton').addEventListener('click', () => {
    const thName = document.getElementById('newTHName').value.trim();
    const videoTitle = document.getElementById('newVideoTitle').value.trim();
    const videoUrl = document.getElementById('newVideoUrl').value.trim();

    if (thName && videoTitle && videoUrl) {
        if (!jsonData[thName]) {
            jsonData[thName] = [];
        }

        jsonData[thName].push({ title: videoTitle, videoUrl: videoUrl, armyLinks: [...newArmyLinks] });

        renderTownHalls();
        populateTHDropdown();

        document.getElementById('newTHName').value = '';
        document.getElementById('newVideoTitle').value = '';
        document.getElementById('newVideoUrl').value = '';
        document.getElementById('newArmyLinksContainer').innerHTML = '';
        newArmyLinks = [];
    } else {
        alert('Please fill out all fields to add a new video.');
    }
});


function addVideo(thKey) {
    jsonData[thKey].unshift({ title: '', videoUrl: '', armyLinks: [] });
    renderTownHalls();
}

function removeVideo(thKey, index) {
    jsonData[thKey].splice(index, 1);
    renderTownHalls();
}

function addArmyLink(thKey, videoIndex) {
    jsonData[thKey][videoIndex].armyLinks.push({ text: '', url: '' });
    renderTownHalls();
}

function removeArmyLink(thKey, videoIndex, linkIndex) {
    jsonData[thKey][videoIndex].armyLinks.splice(linkIndex, 1);
    renderTownHalls();
}

function updateVideo(thKey, videoIndex, field, value) {
    jsonData[thKey][videoIndex][field] = value;
}

function updateArmyLink(thKey, videoIndex, linkIndex, field, value) {
    jsonData[thKey][videoIndex].armyLinks[linkIndex][field] = value;
}

document.getElementById('saveJsonButton').addEventListener('click', () => {
    const jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const downloadLink = document.createElement('a');

    downloadLink.href = URL.createObjectURL(jsonBlob);
    downloadLink.download = 'strategies.json';
    downloadLink.click();

    alert('Strategies file has been saved!');
});
