import Head from 'next/head'
import Image from 'next/image'
import HomeCss from '../styles/Home.module.css'
import Link from 'next/link'
import { useState } from 'react'
export default function Home({ pokemonListo, tipos }) {
  const [pokemon, setPokemon] = useState(pokemonListo);
  const filtrar = (elTipo) => {
    setPokemon(pokemonListo)
    if (elTipo === 'borrar') {
      setPokemon(pokemonListo)
    } else {
      let nuevoPokemon = pokemonListo.filter(pokemon => pokemon.types.some(tipo => tipo.type.name === elTipo)).map(tem2 => {
        let nuevosTem = { ...tem2 }

          return nuevosTem
      })
      setPokemon(nuevoPokemon)

    }
  }
  return (
    <>
      <div className={HomeCss.container}>
        <div className={HomeCss.filtros}>
          <button className={`${HomeCss.botonFiltro} ${HomeCss.botonTodos}`} onClick={() => filtrar("borrar")}>
            Mostrar Todos
          </button>
          <div className={HomeCss.botones}>
            {
              tipos.map((tipo, index) => {

                return (
                  <button key={tipo.name} className={`${HomeCss.botonFiltro} ${tipo.name}`} aria-label={tipo.name} onClick={() => filtrar(tipo.name)}>

                    {tipo.name}

                  </button>
                )
              })
            }
          </div>
        </div>

        <div className={HomeCss.titulo}>
          <h1>Pokemones</h1>
        </div>
        <div className={HomeCss.columnas}>
          <ul >
            {
              /*   pokemonListo.map((pokemon, index) => { */
              pokemon.map((pokemon, index) => {
                return (
                  <li key={pokemon.id}>
                    <Link scroll={false} href={{
                      pathname: '/pokemon/[name]',
                      query: { name: pokemon.name }
                    }}>
                      <a>
                        <div className={`${HomeCss.card} ${pokemon.types[0].type.name}`}>
                          <div className={HomeCss.nombreTipos}>
                            <h3>{pokemon.name}</h3>
                            <div className={HomeCss.tipos}>
                              {pokemon.types.map((tipo, index) => {
                                return (
                                  <p className={HomeCss.tipo}>{tipo.type.name}</p>
                                )
                              })}
                            </div>
                          </div>
                          <img
                            src={pokemon.image}
                            alt={pokemon.name}
                            width={100}
                            height={100}
                            className={HomeCss.imagen}
                          />
                        </div>
                      </a>
                    </Link>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
    </>
  )
}


export async function getServerSideProps(context) {


  const resTipos = await fetch('https://pokeapi.co/api/v2/type')
  const tipos = await resTipos.json()

  const traerPokemon = async (numero) => {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${numero}?limit=101&offset=0/`)
      .then(response => response.json())
      .then(data => data)
  }

  let arrayPokemon = [];
  for (let index = 1; index <= 20; index++) {
    let data = await traerPokemon(index);
    arrayPokemon.push(data);
  }

  let pokemonListo = arrayPokemon.map(pokemon => {
    return ({
      id: pokemon.id,
      name: pokemon.name,
      image: pokemon.sprites.other.dream_world.front_default,
      types: pokemon.types

    })
  });


  return {
    props: {
      tipos: tipos.results,
      pokemonListo
    }
  }
}