import { LitElement, html, css } from 'lit';

/**
 * SkeletonProfile Component - Loading placeholder for character profile popup
 *
 * Features:
 * - Mimics the exact layout of CharacterProfile popup
 * - Animated shimmer effect for loading indication
 * - Same dimensions as real profile popup
 * - Prevents layout shift during loading
 *
 * Used during:
 * - Character profile popup loading
 * - Maintains popup size while data loads
 */
export class SkeletonProfile extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .skeleton-name {
      height: 32px;
      width: 60%;
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.1) 25%,
        rgba(255, 255, 255, 0.2) 50%,
        rgba(255, 255, 255, 0.1) 75%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 4px;
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
      width: 32px;
      height: 32px;
    }

    .details {
      display: grid;
      gap: 16px;
    }

    .skeleton-detail {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .skeleton-label {
      height: 16px;
      width: 30%;
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.1) 25%,
        rgba(255, 255, 255, 0.2) 50%,
        rgba(255, 255, 255, 0.1) 75%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 4px;
    }

    .skeleton-value {
      height: 16px;
      width: 40%;
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.1) 25%,
        rgba(255, 255, 255, 0.2) 50%,
        rgba(255, 255, 255, 0.1) 75%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 4px;
    }

    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
  `;

  render() {
    return html`
      <div class="header">
        <div class="skeleton-name"></div>
        <button class="close-btn">×</button>
      </div>

      <div class="details">
        <div class="skeleton-detail">
          <div class="skeleton-label"></div>
          <div class="skeleton-value"></div>
        </div>
        <div class="skeleton-detail">
          <div class="skeleton-label"></div>
          <div class="skeleton-value"></div>
        </div>
        <div class="skeleton-detail">
          <div class="skeleton-label"></div>
          <div class="skeleton-value"></div>
        </div>
      </div>
    `;
  }
}

customElements.define('skeleton-profile', SkeletonProfile);
