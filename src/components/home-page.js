import { LitElement, html, css } from 'lit';
import { getAllPeople } from '../services/api.js';

export class HomePage extends LitElement {
  static properties = {
    characters: { type: Array },
    loading: { type: Boolean },
    searchTerm: { type: String },
    selectedCharacterId: { type: String }
  };

  constructor() {
    super();
    this.characters = [];
    this.loading = false;
    this.searchTerm = '';
    this.selectedCharacterId = '';
  }

  static styles = css`
    :host { 
      display: flex; 
      flex-direction: column; 
      height: 100vh; 
      overflow: hidden;
    }
    .header {
      flex-shrink: 0;
      padding: 20px;
      background: var(--bg, #0b0f17);
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .title { 
      color: var(--text, #e8eefc); 
      text-align: center; 
      margin-bottom: 20px; 
      font-size: 28px;
      font-weight: 600;
    }
    .search-container { 
      display: flex;
      justify-content: center;
    }
    .search-bar { 
      width: 100%; 
      max-width: 600px;
      padding: 14px 18px; 
      background: var(--panel, #121826); 
      border: 1px solid rgba(255,255,255,0.1); 
      border-radius: 12px; 
      color: var(--text, #e8eefc);
      font-size: 16px;
      transition: border-color 0.2s ease;
    }
    .search-bar::placeholder { color: var(--muted, #9fb0d0); }
    .search-bar:focus { 
      outline: none; 
      border-color: var(--accent, #4f8cff); 
      box-shadow: 0 0 0 3px rgba(79, 140, 255, 0.1);
    }
    .content {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
    }
    .character-count {
      text-align: center;
      color: var(--muted, #9fb0d0);
      margin-bottom: 20px;
      font-size: 14px;
      font-weight: 500;
    }
    .character-list { 
      display: grid; 
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
      gap: 16px; 
      max-width: 1200px;
      margin: 0 auto;
    }
    .loading { 
      text-align: center; 
      color: var(--muted, #9fb0d0); 
      padding: 40px; 
      font-size: 18px;
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    await this.loadCharacters();
  }

  async loadCharacters(search = '') {
    this.loading = true;
    this.searchTerm = search;
    const data = await getAllPeople(search);
    this.characters = data.results || [];
    this.loading = false;
  }

  handleSearch(e) {
    const searchTerm = e.target.value;
    this.loadCharacters(searchTerm);
  }

  handleCharacterClick(e) {
    const { characterId } = e.detail;
    this.selectedCharacterId = characterId;
  }

  handleProfileClose() {
    this.selectedCharacterId = '';
  }

  render() {
    return html`
      <div class="header">
        <h1 class="title">Star Wars Characters</h1>
        <div class="search-container">
          <input 
            class="search-bar" 
            type="text" 
            placeholder="Search characters..." 
            .value=${this.searchTerm}
            @input=${this.handleSearch}
          />
        </div>
      </div>
      
      <div class="content">
        ${!this.loading && this.characters.length > 0 ? html`
          <div class="character-count">
            Showing ${this.characters.length} characters
          </div>
        ` : ''}
        
        <div class="character-list" @character-click=${this.handleCharacterClick}>
          ${this.loading ? html`<div class="loading">Loading all characters...</div>` : ''}
          ${!this.loading && this.characters.length === 0 ? html`<div class="loading">No characters found</div>` : ''}
          ${this.characters.map(character => html`
            <character-card 
              name=${character.name || ''}
              gender=${character.gender || ''}
              birthYear=${character.birth_year || ''}
              id=${character.url ? character.url.split('/').slice(-2, -1)[0] : ''}
            ></character-card>
          `)}
        </div>
      </div>
      
      ${this.selectedCharacterId ? html`
        <character-profile 
          person-id=${this.selectedCharacterId}
          @profile-close=${this.handleProfileClose}
        ></character-profile>
      ` : ''}
    `;
  }
}

customElements.define('home-page', HomePage);


