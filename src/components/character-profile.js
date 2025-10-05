import { LitElement, html, css } from 'lit';
import { getPerson } from '../services/api.js';

/**
 * CharacterProfile Component - Modal popup for character details
 *
 * Features:
 * - Full-screen overlay with backdrop blur
 * - Centered popup with character details
 * - Skeleton loading while fetching data
 * - Click outside or close button to dismiss
 * - Smooth animations for open/close
 *
 * Props:
 * - person-id: Character ID to fetch details for
 *
 * Events:
 * - profile-close: Dispatched when popup is closed
 */
export class CharacterProfile extends LitElement {
  // Define reactive properties for Lit
  static properties = {
    personId: { type: String, attribute: 'person-id' }, // Character ID from URL
    character: { type: Object }, // Character data from API
    loading: { type: Boolean }, // Loading state for skeleton
    visible: { type: Boolean }, // Popup visibility state
  };

  constructor() {
    super();
    // Initialize properties
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
      border: 1px solid rgba(255, 255, 255, 0.1);
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
      align-items: flex-start;
      margin-bottom: 20px;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 20px;
      flex: 1;
    }

    .profile-avatar {
      width: 150px;
      height: 150px;
      border-radius: 12px;
      flex-shrink: 0;
      background-color: transparent;
      object-fit: contain;
      filter: brightness(0) invert(1);
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
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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

  /**
   * Called when component is added to DOM
   * Loads character data if personId is available
   */
  async connectedCallback() {
    super.connectedCallback();
    if (this.personId) {
      await this.loadCharacter();
    }
  }

  /**
   * Called when component properties change
   * Reloads character data if personId changes
   * @param {Map} changedProperties - Map of changed properties
   */
  async updated(changedProperties) {
    if (changedProperties.has('personId') && this.personId) {
      await this.loadCharacter();
    }
  }

  /**
   * Load character data from API
   * Shows skeleton while loading, then displays character details
   */
  async loadCharacter() {
    this.loading = true;
    this.character = null;
    this.visible = true;

    // Fetch character data from SWAPI
    const data = await getPerson(this.personId);
    this.character = data;
    this.loading = false;
  }

  /**
   * Close the popup and notify parent component
   * Dispatches custom event for parent to handle cleanup
   */
  closePopup() {
    this.visible = false;
    // Dispatch custom event to notify parent component
    this.dispatchEvent(
      new CustomEvent('profile-close', {
        bubbles: true,
        detail: { personId: this.personId },
      })
    );
  }

  render() {
    if (!this.visible) return html``;

    return html`
      <div
        class="overlay ${this.visible ? 'visible' : ''}"
        @click=${this.closePopup}
      ></div>
      <div class="popup ${this.visible ? 'visible' : ''}">
        ${this.loading
          ? html`
              <!-- Show skeleton profile while loading to maintain size -->
              <skeleton-profile></skeleton-profile>
            `
          : this.character
            ? html`
                <div class="header">
                  <div class="header-content">
                    <img 
                      src="/assets/icons/avatar-1.png" 
                      alt="Character avatar" 
                      class="profile-avatar"
                    />
                    <h1 class="name">${this.character.name || 'Unknown'}</h1>
                  </div>
                  <button class="close-btn" @click=${this.closePopup}>×</button>
                </div>

                <div class="details">
                  <div class="detail-item">
                    <span class="detail-label">Name</span>
                    <span class="detail-value"
                      >${this.character.name || 'Unknown'}</span
                    >
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Birth Year</span>
                    <span class="detail-value"
                      >${this.character.birth_year || 'Unknown'}</span
                    >
                  </div>
                </div>
              `
            : html`
                <div class="header">
                  <h1 class="name">Error</h1>
                  <button class="close-btn" @click=${this.closePopup}>×</button>
                </div>
                <div class="error">Failed to load character details</div>
              `}
      </div>
    `;
  }
}

customElements.define('character-profile', CharacterProfile);
