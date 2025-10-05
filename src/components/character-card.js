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
    .card { background: var(--panel, #121826); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 14px; }
    .name { font-weight: 600; margin-bottom: 6px; }
    .meta { color: var(--muted, #9fb0d0); font-size: 13px; }
    a { color: var(--accent, #4f8cff); text-decoration: none; }
  `;

  render() {
    return html`
      <div class="card">
        <div class="name">${this.name}</div>
        <div class="meta">Gender: ${this.gender || '—'}</div>
        <div class="meta">Birth year: ${this.birthYear || '—'}</div>
        ${this.id ? html`<a href="#/characters/${this.id}">View profile →</a>` : ''}
      </div>
    `;
  }
}

customElements.define('character-card', CharacterCard);


