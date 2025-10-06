// Base URL for the Star Wars API
export const SWAPI_BASE = 'https://swapi.dev/api';

/**
 * Fetches ALL characters by following pagination links
 * Used for background loading after first page is displayed
 * @param {string} search - Optional search term
 * @returns {Promise<Object>} Complete dataset with all characters
 */
export async function getAllPeople(search = '') {
  try {
    let allPeople = [];
    let nextUrl = `${SWAPI_BASE}/people/`;

    // Add search parameter if provided
    if (search) {
      nextUrl += `?search=${encodeURIComponent(search)}`;
    }

    // Follow pagination links to get all results
    while (nextUrl) {
      const response = await fetch(nextUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      allPeople = allPeople.concat(data.results);
      nextUrl = data.next; // SWAPI provides next page URL
    }

    return {
      results: allPeople,
      count: allPeople.length,
      next: null,
      previous: null,
    };
  } catch (error) {
    console.error('Error fetching all people:', error);
    throw error; // Re-throw to trigger error state in component
  }
}

/**
 * Fetches only the first page of characters (typically 10 results)
 * Used for progressive loading to show immediate results while loading the rest
 * @param {string} search - Optional search term
 * @returns {Promise<Object>} First page data with results, count, next, previous
 */
export async function getFirstPage(search = '') {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);

    const url = `${SWAPI_BASE}/people/${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching first page:', error);
    throw error; // Re-throw to trigger error state in component
  }
}

/**
 * Fetches detailed information for a specific character by ID
 * Used when displaying character profile popup
 * @param {string} personId - The character ID from SWAPI
 * @returns {Promise<Object|null>} Character details or null if error
 */
export async function getPerson(personId) {
  try {
    // Fetch individual character data using their ID
    const response = await fetch(`${SWAPI_BASE}/people/${personId}/`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching person:', error);
    return null;
  }
}

/**
 * Generic function to fetch any SWAPI resource by URL
 * Currently not implemented but available for future use
 * @param {string} url - Full URL to any SWAPI resource
 * @returns {Promise<Object|null>} Resource data or null
 */
export async function getResource(url) {
  return Promise.resolve(null);
}
