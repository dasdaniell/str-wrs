import { LitElement, html, css } from 'lit';


// TODO: make a base Skeleton component - the other skeletons should use it as a base

/**
 * SkeletonCard Component - Loading placeholder for character cards
 *
 * Features:
 * - Mimics the exact layout of CharacterCard
 * - Animated shimmer effect for loading indication
 * - Same dimensions and spacing as real cards
 * - Smooth pulse animation for breathing effect
 *
 * Used during:
 * - Initial page load (18 skeleton cards)
 * - Background loading (remaining character count)
 */
export class SkeletonCard extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .skeleton-card {
      background: var(--panel, #121826);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      padding: 14px;
      animation: pulse 1.5s ease-in-out infinite;
    }

    .skeleton-line {
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.1) 25%,
        rgba(255, 255, 255, 0.2) 50%,
        rgba(255, 255, 255, 0.1) 75%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 4px;
      margin-bottom: 8px;
    }

    .skeleton-name {
      height: 20px;
      width: 70%;
      margin-bottom: 12px;
    }

    .skeleton-meta {
      height: 14px;
      width: 60%;
      margin-bottom: 6px;
    }

    .skeleton-hint {
      height: 12px;
      width: 50%;
      margin-top: 8px;
    }

    @keyframes pulse {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.7;
      }
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
      <div class="skeleton-card">
        <div class="skeleton-line skeleton-name"></div>
        <div class="skeleton-line skeleton-meta"></div>
        <div class="skeleton-line skeleton-meta"></div>
        <div class="skeleton-line skeleton-hint"></div>
      </div>
    `;
  }
}

customElements.define('skeleton-card', SkeletonCard);
