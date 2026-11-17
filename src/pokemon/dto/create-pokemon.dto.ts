import { IsInt, IsPositive, IsString, MinLength } from "class-validator"

export class CreatePokemonDto {
    @IsInt({message:'debe ser un numero entero'})
    @IsPositive({message:'debe ser positivo'})
    no:number
    @IsString({message:'debe de ser string'})
    @MinLength(3, {message:'debe de tener menos 3 caracteres'})
    name:string



}
