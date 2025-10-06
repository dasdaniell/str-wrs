import { LitElement, html, css } from 'lit';

/**
 * CharacterCard Component - Individual character display card
 *
 * Features:
 * - Displays character name, gender, and birth year
 * - Hover effects with elevation and border highlight
 * - Click handler to open character profile popup
 * - Click hint text for better UX
 *
 * Props:
 * - name: Character's name
 * - gender: Character's gender
 * - birthYear: Character's birth year
 * - id: Character ID for profile navigation
 */
export class CharacterCard extends LitElement {
  // Event type constants
  static get events() {
    return {
      CHARACTER_CLICK: 'characterClick'
    };
  }

  // Define reactive properties for Lit
  static properties = {
    name: { type: String }, // Character's name
    gender: { type: String }, // Character's gender
    birthYear: { type: String }, // Character's birth year
    id: { type: String }, // Character ID for profile popup
  };

  static styles = css`
    :host {
      display: block;
    }
    .card {
      background: var(--panel, #121826);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      padding: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .card:hover {
      border-color: var(--accent, #4f8cff);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(79, 140, 255, 0.1);
    }
    .name {
      font-weight: 600;
      margin-bottom: 6px;
      color: var(--text, #e8eefc);
    }
    .meta {
      color: var(--muted, #9fb0d0);
      font-size: 13px;
      margin-bottom: 4px;
    }
    .click-hint {
      color: var(--accent, #4f8cff);
      font-size: 12px;
      font-weight: 500;
      margin-top: 8px;
    }
    .content {
      flex: 1;
    }
    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 8px;
      flex-shrink: 0;
      background-color: transparent;
      object-fit: contain;
      filter: brightness(0) invert(1);
    }
  `;

  /**
   * Handle card click events
   * Dispatches custom event to parent component to open character profile
   * Only works if character has a valid ID
   */
  handleClick() {
    if (this.id) {
      // Dispatch custom event that bubbles up to parent components
      this.dispatchEvent(
        new CustomEvent(this.constructor.events.CHARACTER_CLICK, {
          bubbles: true,
          composed: true,
          detail: { characterId: this.id, characterName: this.name },
        })
      );
    }
  }

  render() {
    return html`
      <div class="card" @click=${this.handleClick}>
        <div class="content">
          <div class="name">${this.name}</div>
          <div class="meta">Gender: ${this.gender || '—'}</div>
          <div class="meta">Birth year: ${this.birthYear || '—'}</div>
          <div class="click-hint">View profile</div>
        </div>
        <img 
          src="/assets/icons/avatar-1.png" 
          alt="Character avatar" 
          class="avatar"
        />
      </div>
    `;
  }
}

customElements.define('character-card', CharacterCard);
