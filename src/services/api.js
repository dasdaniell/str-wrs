export const SWAPI_BASE = 'https://swapi.dev/api';

export async function getPeople(page = 1, search = '') {
  try {
    const params = new URLSearchParams();
    if (page > 1) params.append('page', page);
    if (search) params.append('search', search);
    
    const url = `${SWAPI_BASE}/people/${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching people:', error);
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

export async function getPerson(personId) {
  try {
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

export async function getResource(url) {
  return Promise.resolve(null);
}


