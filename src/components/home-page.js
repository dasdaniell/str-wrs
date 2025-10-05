import { LitElement, html, css } from 'lit';

export class HomePage extends LitElement {
  static styles = css`
    :host { display: block; }
    section { background: var(--panel, #121826); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 20px; }
    h1 { margin: 0 0 8px; font-size: 22px; }
    p { margin: 0 0 16px; color: var(--muted, #9fb0d0); }
    a.btn { display: inline-block; background: var(--accent, #4f8cff); color: white; padding: 10px 14px; border-radius: 8px; text-decoration: none; }
  `;

  render() {
    return html`
      <section>
        <h1>Welcome to SW Characters</h1>
        <p>Browse Star Wars characters using a Vanilla JS app with Lit components.</p>
        <a class="btn" href="#/characters">View Characters</a>
      </section>
    `;
  }
}

customElements.define('home-page', HomePage);


