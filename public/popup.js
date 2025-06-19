class QuickNotes {
  constructor() {
    this.notes = [];
    this.editingNoteId = null;
    this.init();
  }

  async init() {
    await this.loadNotes();
    this.bindEvents();
    this.render();
    this.focusInput();
  }

  bindEvents() {
    // Add note
    document.getElementById('addBtn').addEventListener('click', () => this.addNote());
    document.getElementById('noteInput').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        this.addNote();
      }
    });

    // Search
    document.getElementById('searchInput').addEventListener('input', (e) => {
      this.filterNotes(e.target.value);
    });

    // Export
    document.getElementById('exportBtn').addEventListener('click', () => this.exportNotes());
  }

  focusInput() {
    setTimeout(() => {
      document.getElementById('noteInput').focus();
    }, 100);
  }

  async loadNotes() {
    try {
      const result = await chrome.storage.local.get(['quickNotes']);
      this.notes = result.quickNotes || [];
    } catch (error) {
      console.error('Error loading notes:', error);
      this.notes = [];
    }
  }

  async saveNotes() {
    try {
      await chrome.storage.local.set({ quickNotes: this.notes });
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  }

  async addNote() {
    const input = document.getElementById('noteInput');
    const content = input.value.trim();
    
    if (!content) return;

    const note = {
      id: Date.now().toString(),
      content: content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.notes.unshift(note);
    await this.saveNotes();
    
    input.value = '';
    this.render();
    this.focusInput();
  }

  async deleteNote(noteId) {
    this.notes = this.notes.filter(note => note.id !== noteId);
    await this.saveNotes();
    this.render();
  }

  async editNote(noteId, newContent) {
    const noteIndex = this.notes.findIndex(note => note.id === noteId);
    if (noteIndex !== -1) {
      this.notes[noteIndex].content = newContent;
      this.notes[noteIndex].updatedAt = new Date().toISOString();
      await this.saveNotes();
    }
  }

  startEditing(noteId) {
    this.editingNoteId = noteId;
    const noteElement = document.querySelector(`[data-note-id="${noteId}"]`);
    const contentElement = noteElement.querySelector('.note-content');
    const editInput = noteElement.querySelector('.note-edit-input');
    
    contentElement.classList.add('editing');
    editInput.classList.add('active');
    editInput.value = contentElement.textContent;
    editInput.focus();
    
    // Auto-resize textarea
    editInput.style.height = 'auto';
    editInput.style.height = editInput.scrollHeight + 'px';
  }

  stopEditing(noteId, save = false) {
    const noteElement = document.querySelector(`[data-note-id="${noteId}"]`);
    const contentElement = noteElement.querySelector('.note-content');
    const editInput = noteElement.querySelector('.note-edit-input');
    
    if (save) {
      const newContent = editInput.value.trim();
      if (newContent && newContent !== contentElement.textContent) {
        this.editNote(noteId, newContent);
        contentElement.textContent = newContent;
      }
    }
    
    contentElement.classList.remove('editing');
    editInput.classList.remove('active');
    this.editingNoteId = null;
  }

  filterNotes(searchTerm) {
    const noteElements = document.querySelectorAll('.note-item');
    const term = searchTerm.toLowerCase();
    
    noteElements.forEach(element => {
      const content = element.querySelector('.note-content').textContent.toLowerCase();
      if (content.includes(term)) {
        element.style.display = 'block';
      } else {
        element.style.display = 'none';
      }
    });
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  exportNotes() {
    if (this.notes.length === 0) {
      return;
    }

    const content = this.notes.map(note => {
      const date = new Date(note.createdAt).toLocaleDateString();
      return `${date}\n${note.content}\n${'='.repeat(50)}`;
    }).join('\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `quick-notes-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  render() {
    const notesList = document.getElementById('notesList');
    const emptyState = document.getElementById('emptyState');
    
    if (this.notes.length === 0) {
      notesList.innerHTML = '';
      emptyState.classList.remove('hidden');
      return;
    }
    
    emptyState.classList.add('hidden');
    
    notesList.innerHTML = this.notes.map(note => {
      return `
        <div class="note-item" data-note-id="${note.id}">
          <div class="note-header">
            <span class="note-date">${this.formatDate(note.createdAt)}</span>
            <div class="note-actions">
              <button class="note-action-btn edit" title="Edit" onclick="quickNotes.startEditing('${note.id}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button class="note-action-btn delete" title="Delete" onclick="quickNotes.deleteNote('${note.id}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3,6 5,6 21,6"/>
                  <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="note-content">${note.content}</div>
          <textarea 
            class="note-edit-input" 
            onblur="quickNotes.stopEditing('${note.id}', true)"
            onkeydown="if(event.key==='Enter' && event.ctrlKey) quickNotes.stopEditing('${note.id}', true); if(event.key==='Escape') quickNotes.stopEditing('${note.id}', false);"
            oninput="this.style.height='auto'; this.style.height=this.scrollHeight+'px';"
          ></textarea>
        </div>
      `;
    }).join('');
  }
}

// Initialize the app
const quickNotes = new QuickNotes();