import { LitElement, html, css } from 'lit';

export class CharacterList extends LitElement {
  static styles = css`
    :host { display: block; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
    .panel { background: var(--panel, #121826); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 16px; }
    h2 { margin: 0 0 12px; font-size: 18px; }
  `;

  render() {
    return html`
      <div class="panel">
        <h2>Characters</h2>
        <div class="grid">
          <!-- Data wiring to come later -->
          <character-card name="Luke Skywalker" gender="male" birthYear="19BBY"></character-card>
          <character-card name="Leia Organa" gender="female" birthYear="19BBY"></character-card>
          <character-card name="Han Solo" gender="male" birthYear="29BBY"></character-card>
        </div>
      </div>
    `;
  }
}

customElements.define('character-list', CharacterList);


