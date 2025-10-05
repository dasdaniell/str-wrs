import { LitElement, html, css } from 'lit';
import { getPerson } from '../services/api.js';

export class CharacterProfile extends LitElement {
  static properties = {
    personId: { type: String, attribute: 'person-id' },
    character: { type: Object },
    loading: { type: Boolean },
    visible: { type: Boolean }
  };

  constructor() {
    super();
    this.character = null;
    this.loading = false;
    this.visible = false;
  }

  static styles = css`
    :host { 
      display: block; 
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1000;
      pointer-events: none;
    }
    
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(4px);
      pointer-events: auto;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .overlay.visible {
      opacity: 1;
    }
    
    .popup {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.9);
      background: var(--panel, #121826);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      padding: 24px;
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      pointer-events: auto;
      transition: transform 0.3s ease;
    }
    
    .popup.visible {
      transform: translate(-50%, -50%) scale(1);
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .close-btn {
      background: none;
      border: none;
      color: var(--muted, #9fb0d0);
      font-size: 24px;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: color 0.2s ease;
    }
    
    .close-btn:hover {
      color: var(--text, #e8eefc);
    }
    
    .name {
      font-size: 28px;
      font-weight: 600;
      color: var(--text, #e8eefc);
      margin: 0;
    }
    
    .details {
      display: grid;
      gap: 16px;
    }
    
    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .detail-label {
      color: var(--muted, #9fb0d0);
      font-weight: 500;
    }
    
    .detail-value {
      color: var(--text, #e8eefc);
      font-weight: 600;
    }
    
    .loading {
      text-align: center;
      color: var(--muted, #9fb0d0);
      padding: 40px;
    }
    
    .error {
      text-align: center;
      color: #ff6b6b;
      padding: 40px;
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    if (this.personId) {
      await this.loadCharacter();
    }
  }

  async updated(changedProperties) {
    if (changedProperties.has('personId') && this.personId) {
      await this.loadCharacter();
    }
  }

  async loadCharacter() {
    this.loading = true;
    this.character = null;
    this.visible = true;
    
    const data = await getPerson(this.personId);
    this.character = data;
    this.loading = false;
  }

  closePopup() {
    this.visible = false;
    // Dispatch custom event to notify parent
    this.dispatchEvent(new CustomEvent('profile-close', {
      bubbles: true,
      detail: { personId: this.personId }
    }));
  }

  render() {
    if (!this.visible) return html``;
    
    return html`
      <div class="overlay ${this.visible ? 'visible' : ''}" @click=${this.closePopup}></div>
      <div class="popup ${this.visible ? 'visible' : ''}">
        <div class="header">
          <h1 class="name">${this.character?.name || 'Loading...'}</h1>
          <button class="close-btn" @click=${this.closePopup}>×</button>
        </div>
        
        ${this.loading ? html`
          <div class="loading">Loading character details...</div>
        ` : this.character ? html`
          <div class="details">
            <div class="detail-item">
              <span class="detail-label">Name</span>
              <span class="detail-value">${this.character.name || 'Unknown'}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Gender</span>
              <span class="detail-value">${this.character.gender || 'Unknown'}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Birth Year</span>
              <span class="detail-value">${this.character.birth_year || 'Unknown'}</span>
            </div>
          </div>
        ` : html`
          <div class="error">Failed to load character details</div>
        `}
      </div>
    `;
  }
}

customElements.define('character-profile', CharacterProfile);


