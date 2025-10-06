import { LitElement, html, css } from 'lit';

export class CharacterList extends LitElement {
  // Event type constants
  static get events() {
    return {
      CHARACTER_CLICK: 'characterClick'
    };
  }

  static properties = {
    characters: { 
      type: Array,
      attribute: false,
      hasChanged: (newVal, oldVal) => {
        return JSON.stringify(newVal) !== JSON.stringify(oldVal);
      }
    },
  };

  constructor() {
    super();
    this.characters = [];
  }

  static styles = css`
    :host {
      display: block;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 12px;
    }
    .panel {
      background: var(--panel, #121826);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      padding: 16px;
    }
    h2 {
      margin: 0 0 12px;
      font-size: 18px;
    }
  `;

  render() {
    return html`
      <div class="panel">
        <h2>Characters</h2>
        <div class="grid">
          ${this.characters.map(
            character => html`
              <character-card
                name=${character.name || ''}
                gender=${character.gender || ''}
                birthYear=${character.birth_year || ''}
                id=${character.url
                  ? character.url.split('/').slice(-2, -1)[0]
                  : ''}
              ></character-card>
            `
          )}
        </div>
      </div>
    `;
  }
}

customElements.define('character-list', CharacterList);
