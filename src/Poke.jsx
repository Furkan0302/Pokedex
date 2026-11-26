import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPokemon } from "./api.js";

function PokemonDetails({ pokemonId }) {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadDetails() {
      try {
        const data = await getPokemon(pokemonId, controller.signal);
        if (!controller.signal.aborted) setPokemon(data);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError("Could not load this Pokémon. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadDetails();
    return () => controller.abort();
  }, [pokemonId]);

  if (loading) return <p role="status" className="status">Loading Pokémon...</p>;
  if (error) return <p role="alert" className="status error">{error}</p>;
  if (!pokemon) return null;

  const { id, name, species, height, weight, types, sprites } = pokemon;
  const image = sprites.other?.["official-artwork"]?.front_default || sprites.front_default;

  return (
    <article className="panel detail-card">
      <div className="detail-image">
        {image ? <img src={image} alt={name} /> : <p>No image available.</p>}
      </div>
      <div className="detail-info">
        <p className="eyebrow">#{String(id).padStart(3, "0")}</p>
        <h1 className="pokemon-name">{name}</h1>
        <dl className="facts">
          <div><dt>Species</dt><dd className="pokemon-name">{species.name}</dd></div>
          {/* PokéAPI anger höjd i decimeter och vikt i hektogram. */}
          <div><dt>Height</dt><dd>{height / 10} m</dd></div>
          <div><dt>Weight</dt><dd>{weight / 10} kg</dd></div>
        </dl>
        <h2>Types</h2>
        <div className="types">
          {types.map(({ type }) => (
            <span key={type.name} className={`type type-${type.name}`}>{type.name}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

function Pokemon() {
  const { pokemonId } = useParams();
  const id = Number(pokemonId);
  const validId = /^\d+$/.test(pokemonId) && Number.isInteger(id) && id >= 1 && id <= 151;

  return (
    <>
      <Link className="back-link" to="/">← Back to Pokédex</Link>
      {validId ? <PokemonDetails key={id} pokemonId={id} /> : (
        <section className="panel">
          <h1>Pokémon not found</h1>
          <p>Choose one of the original 151 Pokémon.</p>
        </section>
      )}
    </>
  );
}

export default Pokemon;
