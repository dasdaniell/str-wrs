import { LitElement, html, css } from 'lit';

export class CharacterProfile extends LitElement {
  static properties = {
    personId: { type: String, attribute: 'person-id' }
  };

  static styles = css`
    :host { display: block; }
    .panel { background: var(--panel, #121826); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 16px; }
    h2 { margin: 0 0 12px; font-size: 20px; }
    .meta { color: var(--muted, #9fb0d0); }
  `;

  render() {
    const pid = this.personId || '';
    return html`
      <div class="panel">
        <h2>Character Profile</h2>
        <div class="meta">ID: ${pid || 'unknown'}</div>
        <p>Data wiring will be added later.</p>
        <p><a href="#/characters">← Back to list</a></p>
      </div>
    `;
  }
}

customElements.define('character-profile', CharacterProfile);


