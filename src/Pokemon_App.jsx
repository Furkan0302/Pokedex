import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import Pokedex from "./Pokedex.jsx";
import Pokemon from "./Poke.jsx";

function App() {
  return (
    <>
      <header className="header">
        <Link className="brand" to="/">
          <img src="/favicon.svg" alt="" width="34" height="34" />
          Pokédex
        </Link>
        <span className="header-note">Generation I</span>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Pokedex />} />
          <Route path="/:pokemonId" element={<Pokemon />} />
          <Route path="*" element={
            <section className="panel">
              <h1>Page not found</h1>
              <Link className="button" to="/">Back to Pokédex</Link>
            </section>
          } />
        </Routes>
      </main>
      <footer>Pokémon data and sprites provided by <a href="https://pokeapi.co/">PokéAPI</a>.</footer>
    </>
  );
}

export default App;
