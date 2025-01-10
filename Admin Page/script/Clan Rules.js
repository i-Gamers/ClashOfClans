        let clanRulesData = {};

        // Load JSON file
        document.getElementById('configFile').addEventListener('change', event => {
            const file = event.target.files[0];
            const reader = new FileReader();

            reader.onload = function(e) {
                clanRulesData = JSON.parse(e.target.result);
                displaySections();
            };

            if (file) reader.readAsText(file);
        });

        // Display sections dynamically based on JSON
        function displaySections() {
            const rulesContainer = document.getElementById('rulesContainer');
            rulesContainer.innerHTML = ''; // Clear previous content
            rulesContainer.style.display = 'block';

            addSection(rulesContainer, 'General Rules', 'generalRulesList', clanRulesData.clanRules.generalRules, 'general');
            addSection(rulesContainer, 'Clan War Rules', 'clanWarRulesList', clanRulesData.clanRules.clanWarRules.nonCWL, 'clanWar');
            addSection(
                rulesContainer,
                'CWL Rules',
                'cwlRulesList',
                clanRulesData.clanRules.clanWarLeagueRules.participationAndHeroUpgrade,
                'cwl'
            );

            // Show Save Button
            document.getElementById('saveButtonContainer').style.display = 'block';
        }

        // Add a section dynamically
        function addSection(container, headingText, listId, rules, type) {
            const section = document.createElement('div');
            section.classList.add('card', 'mb-4');

            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');

            // Heading
            const heading = document.createElement('h5');
            heading.classList.add('card-title');
            heading.innerText = headingText;
            heading.contentEditable = true;

            // Rules List
            const rulesList = document.createElement('div');
            rulesList.id = listId;
            rulesList.classList.add('sortable-list');
            rules.forEach((rule, index) => {
                const ruleDiv = createRuleElement(rule, index, type);
                rulesList.appendChild(ruleDiv);
            });

            // Add Rule Button
            const addButton = document.createElement('button');
            addButton.classList.add('btn', 'btn-primary', 'mt-3');
            addButton.innerText = 'Add Rule';
            addButton.addEventListener('click', () => {
                rules.push('');
                updateRulesList(rulesList, rules, type);
            });

            // Append all to section
            cardBody.appendChild(heading);
            cardBody.appendChild(rulesList);
            cardBody.appendChild(addButton);
            section.appendChild(cardBody);
            container.appendChild(section);

            // Enable Drag-and-Drop
            addDragAndDrop(rulesList, rules, type);
        }

        function createRuleElement(rule, index, type) {
            const ruleDiv = document.createElement('div');
            ruleDiv.classList.add('mb-3', 'd-flex', 'align-items-center', 'draggable-item');
            ruleDiv.setAttribute('draggable', 'true');
            ruleDiv.setAttribute('data-index', index);

            const ruleInput = document.createElement('input');
            ruleInput.type = 'text';
            ruleInput.value = rule;
            ruleInput.classList.add('form-control', 'me-2');
            ruleInput.addEventListener('input', event => {
                updateRule(type, index, event.target.value);
            });

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('btn', 'btn-danger');
            deleteButton.innerText = 'Delete';
            deleteButton.addEventListener('click', () => {
                deleteRule(type, index);
            });

            ruleDiv.appendChild(ruleInput);
            ruleDiv.appendChild(deleteButton);

            return ruleDiv;
        }

        function updateRule(type, index, value) {
            if (type === 'general') {
                clanRulesData.clanRules.generalRules[index] = value;
            } else if (type === 'clanWar') {
                clanRulesData.clanRules.clanWarRules.nonCWL[index] = value;
            } else if (type === 'cwl') {
                clanRulesData.clanRules.clanWarLeagueRules.participationAndHeroUpgrade[index] = value;
            }
        }

        function deleteRule(type, index) {
            if (type === 'general') {
                clanRulesData.clanRules.generalRules.splice(index, 1);
            } else if (type === 'clanWar') {
                clanRulesData.clanRules.clanWarRules.nonCWL.splice(index, 1);
            } else if (type === 'cwl') {
                clanRulesData.clanRules.clanWarLeagueRules.participationAndHeroUpgrade.splice(index, 1);
            }
            displaySections();
        }

        function updateRulesList(container, rules, type) {
            container.innerHTML = '';
            rules.forEach((rule, index) => {
                const ruleDiv = createRuleElement(rule, index, type);
                container.appendChild(ruleDiv);
            });
        }

        function addDragAndDrop(container, rules, type) {
            let draggedItem = null;

            container.addEventListener('dragstart', event => {
                draggedItem = event.target;
                event.target.classList.add('dragging');
            });

            container.addEventListener('dragend', event => {
                event.target.classList.remove('dragging');
            });

            container.addEventListener('dragover', event => {
                event.preventDefault();
                const afterElement = getDragAfterElement(container, event.clientY);
                if (afterElement == null) {
                    container.appendChild(draggedItem);
                } else {
                    container.insertBefore(draggedItem, afterElement);
                }
            });

            container.addEventListener('drop', () => {
                const items = Array.from(container.children);
                const newOrder = items.map(item => item.querySelector('input').value);
                if (type === 'general') {
                    clanRulesData.clanRules.generalRules = newOrder;
                } else if (type === 'clanWar') {
                    clanRulesData.clanRules.clanWarRules.nonCWL = newOrder;
                } else if (type === 'cwl') {
                    clanRulesData.clanRules.clanWarLeagueRules.participationAndHeroUpgrade = newOrder;
                }
                displaySections();
            });
        }

        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll('.draggable-item:not(.dragging)')];

            return draggableElements.reduce(
                (closest, child) => {
                    const box = child.getBoundingClientRect();
                    const offset = y - box.top - box.height / 2;
                    if (offset < 0 && offset > closest.offset) {
                        return { offset, element: child };
                    } else {
                        return closest;
                    }
                },
                { offset: Number.NEGATIVE_INFINITY }
            ).element;
        }

        document.getElementById('saveRulesJson').addEventListener('click', () => {
            const blob = new Blob([JSON.stringify(clanRulesData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'clanRules.json';
            a.click();
        });