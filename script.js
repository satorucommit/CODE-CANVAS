// Database simulation using localStorage
class CodeCanvasDB {
    constructor() {
        this.items = this.loadItems();
        this.theme = this.loadTheme();
    }
    
    // Load items from localStorage
    loadItems() {
        const itemsData = localStorage.getItem('codeCanvasItems');
        return itemsData ? JSON.parse(itemsData) : [];
    }
    
    // Save items to localStorage
    saveItems() {
        localStorage.setItem('codeCanvasItems', JSON.stringify(this.items));
    }
    
    // Load theme preference
    loadTheme() {
        return localStorage.getItem('codeCanvasTheme') || 'dark';
    }
    
    // Save theme preference
    saveTheme(theme) {
        this.theme = theme;
        localStorage.setItem('codeCanvasTheme', theme);
    }
    
    // Add item
    addItem(item) {
        this.items.push(item);
        this.saveItems();
    }
    
    // Update item
    updateItem(id, updatedItem) {
        const index = this.items.findIndex(item => item.id == id);
        if (index !== -1) {
            this.items[index] = updatedItem;
            this.saveItems();
            return true;
        }
        return false;
    }
    
    // Delete item
    deleteItem(id) {
        this.items = this.items.filter(item => item.id != id);
        this.saveItems();
    }
    
    // Get all items
    getItems() {
        return this.items;
    }
}

// Initialize database
const db = new CodeCanvasDB();

// DOM Elements
const themeSelector = document.getElementById('themeSelector');
const animationsToggle = document.getElementById('animationsToggle');

// Navigation elements
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');
const addNoteBtn = document.getElementById('addNoteBtn');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const fileInput = document.getElementById('fileInput');
const saveItemBtn = document.getElementById('saveItem');
const itemTitle = document.getElementById('itemTitle');
const itemContent = document.getElementById('itemContent');
const recentItemsContainer = document.getElementById('recentItemsContainer');
const libraryItemsContainer = document.getElementById('libraryItemsContainer');
const itemsCount = document.getElementById('totalItems');
const codeItemsCount = document.getElementById('codeItems');
const noteItemsCount = document.getElementById('noteItems');
const templateCards = document.querySelectorAll('.template-card');
const colorOptions = document.querySelectorAll('.color-option');
const searchInput = document.getElementById('searchInput');
const filterByType = document.getElementById('filterByType');
const sortBy = document.getElementById('sortBy');

// Wizard Steps
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const nextToStep2 = document.getElementById('nextToStep2');
const backToStep1 = document.getElementById('backToStep1');
const nextToStep3 = document.getElementById('nextToStep3');
const backToStep2 = document.getElementById('backToStep2');
const wizardSteps = document.querySelectorAll('.step');

// Slide-in Panels
const notesPanel = document.getElementById('notesPanel');
const codesPanel = document.getElementById('codesPanel');
const openNotesBtn = document.getElementById('openNotesBtn');
const openCodesBtn = document.getElementById('openCodesBtn');
const closeNotesPanel = document.getElementById('closeNotesPanel');
const closeCodesPanel = document.getElementById('closeCodesPanel');
const newNoteBtn = document.getElementById('newNoteBtn');
const newCodeBtn = document.getElementById('newCodeBtn');
const notesTemplatesList = document.getElementById('notesTemplatesList');
const codesTemplatesList = document.getElementById('codesTemplatesList');

// Current state
let currentTemplate = 'classic';
let currentColor = 'blue';
let currentPage = 'dashboard';

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Apply theme
    applyTheme(db.theme);
    
    // Render dashboard
    renderDashboard();
    updateStats();
    loadPanelTemplates();
});

// Apply theme function
function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    
    // Update theme selector
    if (themeSelector) {
        themeSelector.value = theme;
    }
}

// Theme selector change
if (themeSelector) {
    themeSelector.addEventListener('change', (e) => {
        const theme = e.target.value;
        db.saveTheme(theme);
        applyTheme(theme);
    });
}

// Animations toggle
if (animationsToggle) {
    animationsToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.body.style.setProperty('--animation-speed', '0.5s');
        } else {
            document.body.style.setProperty('--animation-speed', '0s');
        }
    });
}

// Navigation
navItems.forEach(item => {
    item.addEventListener('click', () => {
        const page = item.dataset.page;
        switchPage(page);
    });
});

// Page switching
function switchPage(page) {
    // Update navigation
    navItems.forEach(navItem => {
        navItem.classList.remove('active');
        if (navItem.dataset.page === page) {
            navItem.classList.add('active');
        }
    });
    
    // Update pages
    pages.forEach(pageElement => {
        pageElement.classList.remove('active');
        if (pageElement.id === `${page}-page`) {
            pageElement.classList.add('active');
        }
    });
    
    currentPage = page;
    
    // Update content based on page
    switch (page) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'library':
            renderLibrary();
            break;
    }
}

// Dashboard rendering
function renderDashboard() {
    // Render recent items
    renderRecentItems();
    updateStats();
}

// Render recent items
function renderRecentItems() {
    recentItemsContainer.innerHTML = '';
    
    const items = db.getItems();
    
    if (items.length === 0) {
        recentItemsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📋</div>
                <h3>No items yet</h3>
                <p>Create your first item to get started!</p>
                <button id="createFirstBtn" class="primary-btn">
                    <i class="fas fa-plus"></i> Create First Item
                </button>
            </div>
        `;
        document.getElementById('createFirstBtn').addEventListener('click', () => {
            switchPage('create');
        });
        return;
    }
    
    // Get last 6 items
    const recentItems = [...items].reverse().slice(0, 6);
    
    recentItems.forEach(item => {
        const itemElement = createItemCard(item);
        recentItemsContainer.appendChild(itemElement);
    });
}

// Create item card for dashboard
function createItemCard(item) {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.dataset.id = item.id;
    
    // Apply color theme
    const colorThemes = {
        blue: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        green: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        orange: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        purple: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        red: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    };
    
    card.style.background = colorThemes[item.color];
    
    // Get template icon
    const templateIcons = {
        classic: '📝',
        checklist: '✅',
        timeline: '📅',
        diagram: '📊',
        brainstorm: '💡',
        code: '💻'
    };
    
    const icon = templateIcons[item.template] || '📝';
    
    card.innerHTML = `
        <div class="item-header">
            <div class="item-icon">${icon}</div>
            <div class="item-title">${escapeHtml(item.title)}</div>
            <div class="item-type">${formatTemplateName(item.template)}</div>
        </div>
        <div class="item-preview-content">
            ${getItemPreviewContent(item)}
        </div>
        <div class="item-actions">
            <button class="action-btn edit-btn" onclick="editItem(${item.id})">
                <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn delete-btn" onclick="deleteItem(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    return card;
}

// Get preview content based on template
function getItemPreviewContent(item) {
    const content = item.content;
    switch (item.template) {
        case 'checklist':
            const checklistItems = content.split('\n').slice(0, 3);
            return checklistItems.map(item => `
                <div class="preview-checklist-item">
                    <i class="far fa-square"></i>
                    <span>${escapeHtml(item.substring(0, 30))}${item.length > 30 ? '...' : ''}</span>
                </div>
            `).join('');
        case 'code':
            return `<div class="preview-code">${escapeHtml(content.substring(0, 100))}${content.length > 100 ? '...' : ''}</div>`;
        default:
            return `<div class="preview-text">${escapeHtml(content.substring(0, 100))}${content.length > 100 ? '...' : ''}</div>`;
    }
}

// Update statistics
function updateStats() {
    const items = db.getItems();
    itemsCount.textContent = items.length;
    
    const codeItems = items.filter(item => item.template === 'code').length;
    codeItemsCount.textContent = codeItems;
    
    const noteItems = items.length - codeItems;
    noteItemsCount.textContent = noteItems;
}

// Library rendering
function renderLibrary() {
    libraryItemsContainer.innerHTML = '';
    
    const items = db.getItems();
    
    if (items.length === 0) {
        libraryItemsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📚</div>
                <h3>Your library is empty</h3>
                <p>Create items to populate your library!</p>
            </div>
        `;
        return;
    }
    
    // Filter and sort items
    let filteredItems = [...items];
    
    // Apply type filter
    const typeFilter = filterByType.value;
    if (typeFilter !== 'all') {
        filteredItems = filteredItems.filter(item => item.template === typeFilter);
    }
    
    // Apply sorting
    const sortOption = sortBy.value;
    switch (sortOption) {
        case 'newest':
            filteredItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        case 'oldest':
            filteredItems.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
        case 'title':
            filteredItems.sort((a, b) => a.title.localeCompare(b.title));
            break;
    }
    
    if (filteredItems.length === 0) {
        libraryItemsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🔍</div>
                <h3>No items match your filter</h3>
                <p>Try changing your filter settings</p>
            </div>
        `;
        return;
    }
    
    filteredItems.forEach(item => {
        const itemElement = createItemCard(item);
        libraryItemsContainer.appendChild(itemElement);
    });
}

// Event Listeners
addNoteBtn.addEventListener('click', () => switchPage('create'));
exportBtn.addEventListener('click', exportData);
importBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', importData);
saveItemBtn.addEventListener('click', saveItem);

// Template selection in wizard
templateCards.forEach(card => {
    card.addEventListener('click', () => {
        templateCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        currentTemplate = card.dataset.template;
        updatePreview();
    });
});

// Color selection in wizard
colorOptions.forEach(option => {
    option.addEventListener('click', () => {
        colorOptions.forEach(o => o.classList.remove('active'));
        option.classList.add('active');
        currentColor = option.dataset.color;
        updatePreview();
    });
});

// Wizard navigation
nextToStep2.addEventListener('click', () => {
    showStep(2);
});

backToStep1.addEventListener('click', () => {
    showStep(1);
});

nextToStep3.addEventListener('click', () => {
    const title = itemTitle.value.trim();
    const content = itemContent.value.trim();
    
    if (!title) {
        showNotification('Please enter a title', 'warning');
        return;
    }
    
    if (!content) {
        showNotification('Please enter some content', 'warning');
        return;
    }
    
    showStep(3);
    updatePreview();
});

backToStep2.addEventListener('click', () => {
    showStep(2);
});

// Show wizard step
function showStep(stepNumber) {
    // Update step indicators
    wizardSteps.forEach(step => {
        step.classList.remove('active');
        if (parseInt(step.dataset.step) <= stepNumber) {
            step.classList.add('active');
        }
    });
    
    // Show current step
    step1.classList.remove('active');
    step2.classList.remove('active');
    step3.classList.remove('active');
    
    switch (stepNumber) {
        case 1:
            step1.classList.add('active');
            break;
        case 2:
            step2.classList.add('active');
            break;
        case 3:
            step3.classList.add('active');
            break;
    }
}

// Update preview
function updatePreview() {
    const title = itemTitle.value.trim() || 'Untitled';
    const content = itemContent.value.trim() || 'No content';
    
    const preview = document.getElementById('itemPreview');
    if (!preview) return;
    
    // Apply color theme
    const colorThemes = {
        blue: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        green: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        orange: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        purple: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        red: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    };
    
    preview.style.background = colorThemes[currentColor];
    
    // Render content based on template
    let previewContent = '';
    
    switch (currentTemplate) {
        case 'checklist':
            const checklistItems = content.split('\n').filter(line => line.trim() !== '');
            previewContent = checklistItems.map(item => `
                <div class="checklist-item">
                    <input type="checkbox">
                    <span>${escapeHtml(item)}</span>
                </div>
            `).join('');
            break;
        case 'timeline':
            const timelineEvents = content.split('\n').filter(line => line.trim() !== '');
            previewContent = '<div class="timeline-container">';
            timelineEvents.forEach(event => {
                previewContent += `
                    <div class="timeline-item">
                        <div>${escapeHtml(event)}</div>
                    </div>
                `;
            });
            previewContent += '</div>';
            break;
        case 'diagram':
            const diagramItems = content.split('\n').filter(line => line.trim() !== '');
            previewContent = '<div class="diagram-container">';
            diagramItems.forEach((item, index) => {
                previewContent += `<div class="diagram-box">${escapeHtml(item)}</div>`;
                if (index < diagramItems.length - 1) {
                    previewContent += '<div class="diagram-arrow">↓</div>';
                }
            });
            previewContent += '</div>';
            break;
        case 'brainstorm':
            const ideas = content.split(',').map(idea => idea.trim()).filter(idea => idea !== '');
            previewContent = '<div class="brainstorm-container">';
            ideas.forEach(idea => {
                previewContent += `<div class="brainstorm-item">${escapeHtml(idea)}</div>`;
            });
            previewContent += '</div>';
            break;
        case 'code':
            previewContent = `<div class="code-snippet">${escapeHtml(content)}</div>`;
            break;
        default: // classic
            previewContent = `<div class="item-content">${escapeHtml(content).replace(/\n/g, '<br>')}</div>`;
    }
    
    preview.innerHTML = `
        <div class="preview-header">
            <div class="preview-title">${escapeHtml(title)}</div>
            <div class="preview-type">${formatTemplateName(currentTemplate)}</div>
        </div>
        <div class="preview-content">${previewContent}</div>
    `;
}

// Save item function
function saveItem() {
    const title = itemTitle.value.trim();
    const content = itemContent.value.trim();
    
    if (!title || !content) {
        showNotification('Please enter both title and content', 'warning');
        return;
    }
    
    const newItem = {
        id: Date.now(),
        title: title,
        content: content,
        template: currentTemplate,
        color: currentColor,
        createdAt: new Date().toISOString()
    };
    
    db.addItem(newItem);
    renderDashboard();
    updateStats();
    resetCreationForm();
    switchPage('dashboard');
    showNotification('Item saved successfully!', 'success');
}

// Reset creation form
function resetCreationForm() {
    itemTitle.value = '';
    itemContent.value = '';
    
    // Reset to default template and color
    templateCards.forEach(card => {
        card.classList.remove('active');
        if (card.dataset.template === 'classic') {
            card.classList.add('active');
            currentTemplate = 'classic';
        }
    });
    
    colorOptions.forEach(option => {
        option.classList.remove('active');
        if (option.dataset.color === 'blue') {
            option.classList.add('active');
            currentColor = 'blue';
        }
    });
    
    showStep(1);
}

// Edit item function
function editItem(id) {
    const items = db.getItems();
    const item = items.find(item => item.id == id);
    if (!item) return;
    
    // Switch to create page
    switchPage('create');
    
    // Fill form with item data
    itemTitle.value = item.title;
    itemContent.value = item.content;
    
    // Set template
    templateCards.forEach(card => {
        card.classList.remove('active');
        if (card.dataset.template === item.template) {
            card.classList.add('active');
            currentTemplate = item.template;
        }
    });
    
    // Set color
    colorOptions.forEach(option => {
        option.classList.remove('active');
        if (option.dataset.color === item.color) {
            option.classList.add('active');
            currentColor = item.color;
        }
    });
    
    // Remove item from array for editing
    db.deleteItem(id);
    renderDashboard();
    updateStats();
    
    // Show step 2
    showStep(2);
    
    // Show notification
    showNotification('Item loaded for editing', 'info');
}

// Delete item function
function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        db.deleteItem(id);
        renderDashboard();
        updateStats();
        renderLibrary();
        showNotification('Item deleted successfully!', 'success');
    }
}

// Export data function
function exportData() {
    const items = db.getItems();
    
    if (items.length === 0) {
        showNotification('No items to export', 'warning');
        return;
    }
    
    // Create export data
    const exportData = {
        items: items,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `codecanvas-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification('Data exported successfully!', 'success');
}

// Import data function
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (importedData.items && Array.isArray(importedData.items)) {
                // Add imported items
                importedData.items.forEach(item => {
                    db.addItem(item);
                });
                
                renderDashboard();
                updateStats();
                renderLibrary();
                showNotification('Data imported successfully!', 'success');
            } else {
                throw new Error('Invalid data format');
            }
        } catch (error) {
            showNotification('Error importing data: ' + error.message, 'error');
        }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
}

// Load templates for panels
function loadPanelTemplates() {
    // Sample templates for notes
    const notesTemplates = [
        { id: 1, title: 'Meeting Notes', content: 'Key points from today\'s meeting...', template: 'classic', icon: '📝' },
        { id: 2, title: 'Project Plan', content: 'Task 1\nTask 2\nTask 3', template: 'checklist', icon: '✅' },
        { id: 3, title: 'Brainstorm Ideas', content: 'Idea 1, Idea 2, Idea 3', template: 'brainstorm', icon: '💡' },
        { id: 4, title: 'Research Notes', content: 'Findings and observations...', template: 'classic', icon: '🔍' }
    ];
    
    // Sample templates for codes
    const codeTemplates = [
        { id: 1, title: 'JavaScript Function', content: 'function example() {\n  // Your code here\n}', template: 'code', icon: '💻' },
        { id: 2, title: 'HTML Structure', content: '<div class="container">\n  <h1>Title</h1>\n  <p>Content</p>\n</div>', template: 'code', icon: '💻' },
        { id: 3, title: 'CSS Styles', content: '.container {\n  display: flex;\n  justify-content: center;\n}', template: 'code', icon: '💻' },
        { id: 4, title: 'Python Script', content: 'def main():\n    print("Hello World")\n\nif __name__ == "__main__":\n    main()', template: 'code', icon: '💻' }
    ];
    
    // Render notes templates
    notesTemplatesList.innerHTML = '';
    notesTemplates.forEach(template => {
        const templateElement = createTemplateItem(template, 'note');
        notesTemplatesList.appendChild(templateElement);
    });
    
    // Render code templates
    codesTemplatesList.innerHTML = '';
    codeTemplates.forEach(template => {
        const templateElement = createTemplateItem(template, 'code');
        codesTemplatesList.appendChild(templateElement);
    });
}

// Create template item for panels
function createTemplateItem(template, type) {
    const item = document.createElement('div');
    item.className = 'template-item';
    item.dataset.id = template.id;
    item.dataset.type = type;
    
    item.innerHTML = `
        <div class="template-item-header">
            <div class="template-item-icon">${template.icon}</div>
            <h3 class="template-item-title">${escapeHtml(template.title)}</h3>
        </div>
        <p class="template-item-content">${escapeHtml(template.content.substring(0, 60))}${template.content.length > 60 ? '...' : ''}</p>
        <div class="template-item-meta">
            <span>${formatTemplateName(template.template)}</span>
            <span>Click to use</span>
        </div>
    `;
    
    // Add click event to use template
    item.addEventListener('click', () => {
        useTemplate(template);
    });
    
    return item;
}

// Use template function
function useTemplate(template) {
    // Close the panel
    if (template.template === 'code') {
        codesPanel.classList.remove('active');
    } else {
        notesPanel.classList.remove('active');
    }
    
    // Switch to create page
    switchPage('create');
    
    // Fill form with template data
    itemTitle.value = template.title;
    itemContent.value = template.content;
    
    // Set template
    templateCards.forEach(card => {
        card.classList.remove('active');
        if (card.dataset.template === template.template) {
            card.classList.add('active');
            currentTemplate = template.template;
        }
    });
    
    // Show step 2
    showStep(2);
    
    showNotification(`Template "${template.title}" loaded`, 'success');
}

// Panel functionality
openNotesBtn.addEventListener('click', () => {
    notesPanel.classList.add('active');
});

openCodesBtn.addEventListener('click', () => {
    codesPanel.classList.add('active');
});

closeNotesPanel.addEventListener('click', () => {
    notesPanel.classList.remove('active');
});

closeCodesPanel.addEventListener('click', () => {
    codesPanel.classList.remove('active');
});

newNoteBtn.addEventListener('click', () => {
    notesPanel.classList.remove('active');
    switchPage('create');
    // Set default to classic note template
    templateCards.forEach(card => {
        card.classList.remove('active');
        if (card.dataset.template === 'classic') {
            card.classList.add('active');
            currentTemplate = 'classic';
        }
    });
    showStep(2);
});

newCodeBtn.addEventListener('click', () => {
    codesPanel.classList.remove('active');
    switchPage('create');
    // Set default to code template
    templateCards.forEach(card => {
        card.classList.remove('active');
        if (card.dataset.template === 'code') {
            card.classList.add('active');
            currentTemplate = 'code';
        }
    });
    showStep(2);
});

// Close panels when clicking outside
document.addEventListener('click', (e) => {
    if (notesPanel.classList.contains('active') && 
        !notesPanel.contains(e.target) && 
        e.target !== openNotesBtn &&
        !openNotesBtn.contains(e.target)) {
        notesPanel.classList.remove('active');
    }
    
    if (codesPanel.classList.contains('active') && 
        !codesPanel.contains(e.target) && 
        e.target !== openCodesBtn &&
        !openCodesBtn.contains(e.target)) {
        codesPanel.classList.remove('active');
    }
});

// Helper functions
function formatTemplateName(template) {
    const names = {
        classic: 'Classic Note',
        checklist: 'Checklist',
        timeline: 'Timeline',
        diagram: 'Diagram',
        brainstorm: 'Brainstorm',
        code: 'Code Snippet'
    };
    return names[template] || template;
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Show notification
function showNotification(message, type) {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '10px';
    notification.style.color = 'white';
    notification.style.fontWeight = '600';
    notification.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
    notification.style.zIndex = '1000';
    notification.style.transform = 'translateX(200%)';
    notification.style.transition = 'transform 0.3s ease';
    notification.style.maxWidth = '400px';
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #11998e, #38ef7d)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #f5576c, #fa709a)';
            break;
        case 'warning':
            notification.style.background = 'linear-gradient(135deg, #f093fb, #fee140)';
            break;
        case 'info':
            notification.style.background = 'linear-gradient(135deg, #4facfe, #00f2fe)';
            break;
        default:
            notification.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    }
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(200%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Event listeners for back buttons
document.getElementById('backToDashboard').addEventListener('click', () => switchPage('dashboard'));
document.getElementById('backToDashboard2').addEventListener('click', () => switchPage('dashboard'));
document.getElementById('backToDashboard3').addEventListener('click', () => switchPage('dashboard'));
document.getElementById('backToDashboard4').addEventListener('click', () => switchPage('dashboard'));

// Event listeners for filter changes
filterByType.addEventListener('change', renderLibrary);
sortBy.addEventListener('change', renderLibrary);

// Search functionality
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm.length === 0) {
        renderLibrary();
        return;
    }
    
    const items = db.getItems();
    libraryItemsContainer.innerHTML = '';
    
    const filteredItems = items.filter(item => 
        item.title.toLowerCase().includes(searchTerm) || 
        item.content.toLowerCase().includes(searchTerm)
    );
    
    if (filteredItems.length === 0) {
        libraryItemsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🔍</div>
                <h3>No items found</h3>
                <p>Try different search terms</p>
            </div>
        `;
        return;
    }
    
    filteredItems.forEach(item => {
        const itemElement = createItemCard(item);
        libraryItemsContainer.appendChild(itemElement);
    });
});

// Settings page functionality
document.getElementById('exportDataBtn').addEventListener('click', exportData);
document.getElementById('importDataBtn').addEventListener('click', () => fileInput.click());
document.getElementById('clearDataBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all your data? This cannot be undone.')) {
        // Clear all items
        db.items = [];
        db.saveItems();
        
        renderDashboard();
        updateStats();
        renderLibrary();
        showNotification('All your data cleared successfully!', 'success');
    }
});