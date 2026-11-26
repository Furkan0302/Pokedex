import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPokemonList, getPokemonId, getSprite } from "./api.js";

function Pokedex() {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    async function loadPokemon() {
      try {
        const data = await getPokemonList(controller.signal);
        if (!controller.signal.aborted) {
          setPokemonList(data.results);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError("Could not load Pokémon. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadPokemon();
    return () => controller.abort();
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    if (selectedPokemon) navigate(`/${selectedPokemon}`);
  }

  return (
    <>
      <section className="intro">
        <p className="eyebrow">Kanto region · #001–151</p>
        <h1>Explore the Pokédex</h1>
        <p>Choose a Pokémon to view its details.</p>
      </section>
      {loading && <p role="status" className="status">Loading Pokémon...</p>}
      {error && <p role="alert" className="status error">{error}</p>}
      {!loading && !error && (
        <>
          <form className="panel picker" onSubmit={handleSubmit}>
            <label htmlFor="pokemon-select">Select a Pokémon</label>
            <div className="picker-controls">
              <select id="pokemon-select" value={selectedPokemon}
                onChange={(event) => setSelectedPokemon(event.target.value)}>
                <option value="">Choose a Pokémon</option>
                {pokemonList.map(({ name, url }) => {
                  const id = getPokemonId(url);
                  return <option key={id} value={id}>{name}</option>;
                })}
              </select>
              <button type="submit" disabled={!selectedPokemon}>View details</button>
            </div>
          </form>
          <h2 className="section-title">All Pokémon <span>({pokemonList.length})</span></h2>
          <div className="pokemon-grid">
            {pokemonList.map(({ name, url }) => {
              const id = getPokemonId(url);
              return (
                <Link className="pokemon-card" key={id} to={`/${id}`}>
                  <span className="number">#{id.padStart(3, "0")}</span>
                  <img src={getSprite(id)} alt="" loading="lazy" width="96" height="96" />
                  <h3 className="pokemon-name">{name}</h3>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}

export default Pokedex;
