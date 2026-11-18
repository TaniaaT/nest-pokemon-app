import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto.js';
import { UpdatePokemonDto } from './dto/update-pokemon.dto.js';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity.js';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDTO } from './dto/pagination.dto.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  private defafultLimit:number
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel:Model<Pokemon>,
    private readonly configServe:ConfigService){
      console.log(process.env.DEFAULT_LIMIT)
      this.defafultLimit=this.configServe.get('defaultLimit')!

    }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name=createPokemonDto.name.toLocaleLowerCase()
    try{
     const pokemon= await this.pokemonModel.create(createPokemonDto)
      return  pokemon;
    }catch(error:any){
     this.handleExceptions(error)
    }
  }

  findAll(pagination:PaginationDTO) {
    const {limit=this.defafultLimit,offset=0}=pagination
    return this.pokemonModel.find().limit(limit).skip(offset).sort({
      no:1 //ordene la columna "no"
    }).select('-__v') //omitir el campo, todos los campos menos ese 
  }

  async findOne(term: string) {
   let pokemon :Pokemon| null=null
  if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: +term });
} else if (isValidObjectId(term)) {
      // MongoID
      pokemon = await this.pokemonModel.findById(term);
    } else {
      //Name
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim(),
      });
    }
    if (!pokemon) throw new NotFoundException('no existe')
   return pokemon
  }

  async update(term:string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon=await this.findOne(term)
    if (updatePokemonDto.name) updatePokemonDto.name=updatePokemonDto.name.toLowerCase()
    try{
          await pokemon.updateOne(updatePokemonDto, {new:true})
      return {...pokemon.toJSON(),...updatePokemonDto}
    }catch(error:any){
    this.handleExceptions(error)
    }

    return `This action updates a #${term} pokemon`;
  }

  async remove(id: string) {
   /* const pokemon= await this.findOne(id)
    await pokemon.deleteOne()*/
    //aqui se elimina pero no se valida que exista el di, lo puede enviar con la misma estructura pero puede que no exista
    //const result =await this.pokemonModel.findByIdAndDelete(id)
    // return result
    //aqui si lo elimina validando que el id si exista
    const {deletedCount} = await this.pokemonModel.deleteOne({_id:id})//donde el id del modlo o de la bd sea lo mismo que nuestro parametro recibido en este caso id
    if (deletedCount==0){
      throw new BadRequestException('pokemon con ese id no esta en la base de datos')
    }
  }

  private handleExceptions(error:any){
      if(error.code===11000){
        throw new BadRequestException('pokemon existe en bd'+JSON.stringify
        (error.keyValue)
        )
      }
      console.log('error',error )
      throw new InternalServerErrorException('no se peude crasr el pokemon, revis els ervidpr')

  }


  async removeAll(){
    await this.pokemonModel.deleteMany()
  }
}
