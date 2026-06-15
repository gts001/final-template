// js/api.js

const API_KEY = '4f73ef66'; 
const BASE_URL = `https://www.omdbapi.com/?apikey=${API_KEY}&`;

export async function fetchData(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    

    if (data.Response === "False") throw new Error(data.Error);
    
    // Return the array of search results
    return data.Search; 
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}


export function getSaved() {
  const raw = localStorage.getItem('savedItems');
  return raw ? JSON.parse(raw) : [];
}

export function setSaved(items) {
  localStorage.setItem('savedItems', JSON.stringify(items));
}