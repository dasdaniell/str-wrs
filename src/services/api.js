// Base URL for the Star Wars API
export const SWAPI_BASE = 'https://swapi.dev/api';

/**
 * Fetches a specific page of people from SWAPI
 * Used for pagination when we need specific page results
 * @param {number} page - Page number to fetch (default: 1)
 * @param {string} search - Optional search term to filter results
 * @returns {Promise<Object>} Page data with results, count, next, previous
 */
export async function getPeople(page = 1, search = '') {
  try {
    // Build query parameters for the API request
    const params = new URLSearchParams();
    if (page > 1) params.append('page', page);
    if (search) params.append('search', search);
    
    // Construct the full URL with query parameters
    const url = `${SWAPI_BASE}/people/${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url);
    
    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Parse and return the JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching people:', error);
    // Return empty structure on error to prevent app crashes
    return { results: [], count: 0, next: null, previous: null };
  }
}

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
      previous: null
    };
  } catch (error) {
    console.error('Error fetching all people:', error);
    return { results: [], count: 0, next: null, previous: null };
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
    return { results: [], count: 0, next: null, previous: null };
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


