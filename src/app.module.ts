import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module.js';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module.js';
import { SeedModule } from './seed/seed.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConfiguration } from './config/app.config.js';
import { joiValidationSchema } from './config/joi.validation.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      load:[EnvConfiguration], //mnuestro archivo de validacion (coverciones y mapeos)
   // validationSchema: joiValidationSchema //
    }),// DEBE IR SIEMPRE AL INCIIO
    ServeStaticModule.forRoot({
      rootPath: join(import.meta.dirname, '..', 'public'),
    }),
   MongooseModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    uri: configService.get<string>('MONGODB'),
    dbName:'pokemonsdb'
  }),
}),
    //debe estar corriendo el contenedor en docker 
    PokemonModule, CommonModule, SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {

  
}
