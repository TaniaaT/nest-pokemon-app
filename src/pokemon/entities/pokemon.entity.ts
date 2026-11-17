import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

@Schema()
export class Pokemon extends Document{ //añade metodos,funciones
    //mongo agrega un id unico, no es necesario agregar
    @Prop(
        {
            unique:true,
            index:true
        }
    )
    name:string
    @Prop(
        {
            unique:true,
            index:true
        }
    )
    no:number
}

export const PokemonSchema=SchemaFactory.createForClass(Pokemon)