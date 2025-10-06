import { LitElement, html, css } from 'lit';
import { getFirstPage, getAllPeople } from '../services/api.js';

/**
 * HomePage Component - Main application view
 *
 * Features:
 * - Fixed header with search bar
 * - Scrollable character grid
 * - Progressive loading (first 10 chars, then the rest)
 * - Real-time search functionality (filtering)
 * - Character profile popup integration
 *
 * Layout:
 * - Header: Title + search bar (fixed)
 * - Content: Character count + character grid (scrollable)
 */
export class HomePage extends LitElement {
  // Event type constants
  static get events() {
    return {
      CHARACTER_CLICK: 'characterClick',
      PROFILE_CLOSE: 'profileClose',
    };
  }

  // Define reactive properties for Lit
  static properties = {
    characters: {
      type: Array,
      attribute: false,
      hasChanged: (newVal, oldVal) => {
        return JSON.stringify(newVal) !== JSON.stringify(oldVal);
      },
    }, // Array of character objects from API
    loading: {
      type: Boolean,
      reflect: true,
    }, // Initial loading state (shows skeletons)
    loadingMore: {
      type: Boolean,
      reflect: true,
    }, // Background loading state (shows more skeletons)
    searchTerm: {
      type: String,
      reflect: true,
    }, // Current search input value
    selectedCharacterId: {
      type: String,
      attribute: 'selectedCharacterId',
    }, // ID of character to show in popup
    totalCount: {
      type: Number,
      attribute: false,
    }, // Total number of characters available
    error: {
      type: String,
      reflect: true,
    }, // Error message if API fails
  };

  constructor() {
    super();
    // Initialize all properties with default values
    this.characters = [];
    this.loading = false;
    this.loadingMore = false;
    this.searchTerm = '';
    this.selectedCharacterId = '';
    this.totalCount = 0;
    this.error = '';

    // Search debouncing
    this.searchTimeout = null;
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }
    .header {
      flex-shrink: 0;
      padding: 20px;
      background: var(--bg, #0b0f17);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .title {
      text-align: center;
      margin-bottom: 20px;
    }
    .title img {
      height: 70px;
      width: auto;
      filter: invert(1) sepia(1) saturate(0) hue-rotate(0deg) brightness(1);
    }
    .search-container {
      display: flex;
      justify-content: center;
    }
    .search-bar {
      width: 100%;
      max-width: 600px;
      padding: 14px 18px;
      background: var(--panel, #121826);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: var(--text, #e8eefc);
      font-size: 16px;
      transition: border-color 0.2s ease;
    }
    .search-bar::placeholder {
      color: var(--muted, #9fb0d0);
    }
    .search-bar:focus {
      outline: none;
      border-color: var(--accent, #4f8cff);
      box-shadow: 0 0 0 3px rgba(79, 140, 255, 0.1);
    }
    .content {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }

    .character-count {
      position: sticky;
      top: 0;
      background: var(--bg, #0b0f17);
      padding: 12px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      z-index: 10;
      flex-shrink: 0;
      text-align: center;
      color: var(--muted, #9fb0d0);
      font-size: 14px;
      font-weight: 500;
    }

    .character-grid {
      padding: 20px;
    }
    .character-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .loading {
      text-align: center;
      color: var(--muted, #9fb0d0);
      padding: 40px;
      font-size: 18px;
    }
    .no-data {
      text-align: center;
      padding: 60px 20px;
      color: var(--muted, #9fb0d0);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 300px;
    }
    .no-data-icon {
      margin-bottom: 16px;
      opacity: 0.6;
    }
    .no-data-icon img {
      width: 64px;
      height: 64px;
      display: block;
      filter: brightness(0) invert(1);
    }
    .no-data-title {
      font-size: 20px;
      font-weight: 600;
      color: var(--text, #e8eefc);
      margin-bottom: 8px;
    }
    .no-data-subtitle {
      font-size: 14px;
      opacity: 0.8;
    }
    .error {
      text-align: center;
      padding: 60px 20px;
      color: var(--muted, #9fb0d0);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 300px;
    }
    .error-icon {
      margin-bottom: 16px;
      opacity: 0.6;
    }
    .error-icon img {
      width: 64px;
      height: 64px;
      display: block;
      filter: brightness(0) invert(1);
    }
    .error-title {
      font-size: 20px;
      font-weight: 600;
      color: var(--text, #e8eefc);
      margin-bottom: 8px;
    }
    .error-subtitle {
      font-size: 14px;
      opacity: 0.8;
    }
  `;

  /**
   * Called when component is added to DOM
   * Loads initial character data
   */
  async connectedCallback() {
    super.connectedCallback();
    await this.loadCharacters();
    // await this.loadCharactersNoDataMock();
    // await this.loadCharactersServerErrorMock();
  }

  /**
   * Called when component is removed from DOM
   * Clean up any timers or resources
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    // Clear search timeout to prevent memory leaks
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = null;
    }
  }

  /**
   * Progressive loading strategy for optimal user experience
   *
   * Phase 1: Load first page (10 characters) quickly for immediate display
   * Phase 2: If no search, load remaining characters in background
   *
   * @param {string} search - Search term to filter characters
   */
  async loadCharacters(search = '') {
    this.loading = true;
    this.loadingMore = false;
    this.searchTerm = search;
    this.error = ''; // Clear any previous errors

    try {
      // STEP 1: Load first page quickly for immediate display
      // This gives users instant feedback and something to interact with
      const firstPageData = await getFirstPage(search);
      this.characters = firstPageData.results || [];
      this.totalCount = firstPageData.count || 0;
      this.loading = false; // Hide initial skeleton loading, show first 10 characters

      // STEP 2: Progressive loading - only for initial load (no search)
      // If there are more characters and no search term, load the rest in background
      // This prevents blocking the UI while still providing complete data
      if (!search && firstPageData.next) {
        this.loadingMore = true;
        const allData = await getAllPeople(search);
        this.characters = allData.results || []; // Replace with complete dataset
        this.loadingMore = false;
      }
    } catch (error) {
      console.error('Error loading characters:', error);
      this.loading = false;
      this.loadingMore = false;
      this.characters = [];
      this.totalCount = 0;
      this.error = 'The servers are down at the moment, please try again later';
    }
  }

  /**
   * Mock method to demonstrate no-data state
   * Returns empty results to show no-data.png
   */
  async loadCharactersNoDataMock(search = '') {
    this.loading = true;
    this.loadingMore = false;
    this.searchTerm = search;
    this.error = '';

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    this.characters = [];
    this.totalCount = 0;
    this.loading = false;
  }

  /**
   * Mock method to demonstrate server error state
   * Throws error to show server-down.png
   */
  async loadCharactersServerErrorMock(search = '') {
    this.loading = true;
    this.loadingMore = false;
    this.searchTerm = search;
    this.error = '';

    try {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate server error
      throw new Error('Mock server error for demonstration');
    } catch (error) {
      console.error('Error loading characters:', error);
      this.loading = false;
      this.loadingMore = false;
      this.characters = [];
      this.totalCount = 0;
      this.error = 'error'; // Just set any truthy value to trigger error display
    }
  }

  /**
   * Debounced search to prevent excessive API calls
   * @param {string} searchTerm - Search term to debounce
   */
  debounceSearch(searchTerm) {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.loadCharacters(searchTerm);
    }, 600); // 600ms delay
  }

  /**
   * Handle search input changes
   * Triggers debounced search to prevent excessive API calls
   * @param {Event} e - Input event from search bar
   */
  handleSearch(e) {
    const searchTerm = e.target.value;
    this.searchTerm = searchTerm; // Update UI immediately
    this.debounceSearch(searchTerm);
  }

  /**
   * Handle character card clicks
   * Opens character profile popup
   * @param {CustomEvent} e - Character click event with characterId
   */
  handleCharacterClick(e) {
    const { characterId } = e.detail;
    this.selectedCharacterId = characterId;
  }

  /**
   * Handle character profile popup close
   * Clears selected character to hide popup
   */
  handleProfileClose() {
    this.selectedCharacterId = '';
  }

  render() {
    return html`
      <div class="header">
        <div class="title">
          <img src="/assets/icons/sw-logo.png" alt="Star Wars" />
        </div>
        <div class="search-container">
          <input
            class="search-bar"
            type="text"
            placeholder="Search characters..."
            .value=${this.searchTerm}
            @input=${this.handleSearch}
          />
        </div>
      </div>

      <div class="content">
        ${!this.loading && this.characters.length > 0
          ? html`
              <div class="character-count">
                ${this.loadingMore
                  ? html`Showing ${this.characters.length} of ${this.totalCount}
                    characters (loading more...)`
                  : html`Showing ${this.characters.length} characters`}
              </div>
            `
          : ''}
        ${this.error
          ? html`
              <div class="error">
                <div class="error-icon">
                  <img src="/assets/icons/server-down.png" alt="Server error" />
                </div>
                <div class="error-title">
                  The servers are down at the moment
                </div>
                <div class="error-subtitle">Please try again later</div>
              </div>
            `
          : !this.loading && this.characters.length === 0
            ? html`
                <div class="no-data">
                  <div class="no-data-icon">
                    <img src="/assets/icons/no-data.png" alt="No data" />
                  </div>
                  <div class="no-data-title">No character data available</div>
                  <div class="no-data-subtitle">Please contact support.</div>
                </div>
              `
            : html`
                <div class="character-grid">
                  <div
                    class="character-list"
                    @characterClick=${this.handleCharacterClick}
                  >
                    ${this.loading
                      ? html`
                          <!-- Show skeleton cards while loading first page -->
                          ${Array.from(
                            { length: 18 },
                            () => html`<skeleton-card></skeleton-card>`
                          )}
                        `
                      : ''}
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
                    ${this.loadingMore
                      ? html`
                          <!-- Show skeleton cards for remaining characters while background loading -->
                          ${Array.from(
                            {
                              length: Math.max(
                                0,
                                this.totalCount - this.characters.length
                              ),
                            },
                            () => html`<skeleton-card></skeleton-card>`
                          )}
                        `
                      : ''}
                  </div>
                </div>
              `}
      </div>

      ${this.selectedCharacterId
        ? html`
            <character-profile
              person-id=${this.selectedCharacterId}
              @profileClose=${this.handleProfileClose}
            ></character-profile>
          `
        : ''}
    `;
  }
}

customElements.define('home-page', HomePage);
