import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/pokemonResponse.interface';
import { CreatePokemonDto } from '../pokemon/dto/create-pokemon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from '../common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly axiosAdapterHttp: AxiosAdapter
  ){}

  public async executeSeed(pokemonQuantity: number) {

    await this.pokemonModel.deleteMany({});

    let pokemonsArray: CreatePokemonDto[] = []

    const data = await this.axiosAdapterHttp.get<PokeResponse>(`https://pokeapi.co/api/v2/pokemon?limit=${pokemonQuantity}`);

    data.results.forEach(({name, url}) => {

      const segments = url.split('/');

      const numberId: number = +segments[segments.length -2];

      let pokemon: CreatePokemonDto = {
        name: name,
        pokemonNumber: numberId
      }

      pokemonsArray.push(pokemon);

    }); 

    await this.pokemonModel.insertMany(pokemonsArray);

    console.log(pokemonsArray);

    return `pokemons created: ${pokemonQuantity}`;

  }
}
