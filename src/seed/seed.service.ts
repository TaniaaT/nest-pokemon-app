import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface.js';
import { PokemonService } from '../pokemon/pokemon.service.js';
import { AxiosAdapter } from '../common/adapters/axios.adapter.js';

@Injectable()
export class SeedService {

  constructor(private readonly pokemonService:PokemonService, private readonly httpAdapter:AxiosAdapter){}

 async executeSeed(){ // INSER MUCHOS NO PUDE HACERLO DE LA MANERA QUE SE DIJO PERO
  //ESTA ES LA MANERA https://www.udemy.com/course/nest-framework/learn/lecture/32954412#questions/17971902
  this.pokemonService.removeAll()
  //const {data}=await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')
  const data=await this.httpAdapter.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')
  data.results.forEach(({name,url}) => {
    const segments= url.split('/')
    const noPoke:number=+segments[segments.length-2]
   this.pokemonService.create({"name":name,"no":noPoke})
   //insertArray.push({"name":name,"no":noPoke})
  });
 // return data.results
  return 'seed executednpm'
 }
}
