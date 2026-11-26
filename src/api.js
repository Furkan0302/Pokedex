const API_URL = "https://pokeapi.co/api/v2/pokemon";

// Kontrollera HTTP-status innan svaret läses som JSON.
async function getJson(url, signal) {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }
  return response.json();
}

export function getPokemonList(signal) {
  return getJson(`${API_URL}?limit=151`, signal);
}

export function getPokemon(id, signal) {
  return getJson(`${API_URL}/${id}`, signal);
}

export function getPokemonId(url) {
  return url.split("/").filter(Boolean).at(-1);
}

export function getSprite(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}
