import { LitElement, html, css } from 'lit';

export class CharacterCard extends LitElement {
  static properties = {
    name: { type: String },
    gender: { type: String },
    birthYear: { type: String },
    id: { type: String }
  };

  static styles = css`
    :host { display: block; }
    .card { 
      background: var(--panel, #121826); 
      border: 1px solid rgba(255,255,255,0.06); 
      border-radius: 12px; 
      padding: 14px; 
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .card:hover {
      border-color: var(--accent, #4f8cff);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(79, 140, 255, 0.1);
    }
    .name { font-weight: 600; margin-bottom: 6px; color: var(--text, #e8eefc); }
    .meta { color: var(--muted, #9fb0d0); font-size: 13px; margin-bottom: 4px; }
    .click-hint { 
      color: var(--accent, #4f8cff); 
      font-size: 12px; 
      font-weight: 500;
      margin-top: 8px;
    }
  `;

  handleClick() {
    if (this.id) {
      this.dispatchEvent(new CustomEvent('character-click', {
        bubbles: true,
        detail: { characterId: this.id, characterName: this.name }
      }));
    }
  }

  render() {
    return html`
      <div class="card" @click=${this.handleClick}>
        <div class="name">${this.name}</div>
        <div class="meta">Gender: ${this.gender || '—'}</div>
        <div class="meta">Birth year: ${this.birthYear || '—'}</div>
        <div class="click-hint">Click to view profile</div>
      </div>
    `;
  }
}

customElements.define('character-card', CharacterCard);


