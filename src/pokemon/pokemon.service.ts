import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private defaultLimit: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ) { 

    this.defaultLimit = this.configService.getOrThrow<number>('defaultLimit');

  }

  public async create(createPokemonDto: CreatePokemonDto) {

    createPokemonDto.name = createPokemonDto.name?.toLocaleLowerCase();

    try {

      const pokemon = await this.pokemonModel.create(createPokemonDto);

      return pokemon;

    } catch (error: any) {

      this.handleException(error);

    }
  }

  public async findAll(paginationDto: PaginationDto) {

    const {limit = this.defaultLimit, offset = 0} = paginationDto;

    return (await this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({pokemonNumber: 1})
      .select('-_v'));

  }

  public async findOne(term: string): Promise<Pokemon> {

    console.log("consultando pokemon...");

    let pokemon: Pokemon | null = null;

    if (!isNaN(+term)) {

      pokemon = await this.pokemonModel.findOne({ pokemonNumber: +term }).exec();

    } else if (!pokemon && isValidObjectId(term)) {

      pokemon = await this.pokemonModel.findOne({ _id: term }).exec();

    } else {

      pokemon = await this.pokemonModel.findOne({ name: term.toLocaleLowerCase().trim() }).exec();

    }

    if (!pokemon) {
      throw new NotFoundException(`Pokemon with id or name: '${term}' not found...`);
    }

    return pokemon;

  }

  public async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon: Pokemon = await this.findOne(term);

    if (updatePokemonDto)
      updatePokemonDto.name = updatePokemonDto.name?.toLocaleLowerCase();

    try {

      const pokemonUpdated = await pokemon.updateOne(updatePokemonDto);

    } catch (error: any) {

      this.handleException(error);

    }

    return { ...pokemon.toJSON(), ...updatePokemonDto };

  }

  public async remove(term: string) {

    const {deletedCount } = await this.pokemonModel.deleteOne({_id: term}).exec();

    if (deletedCount === 0)
      throw new BadRequestException(`The id: '${term}' not exist in database...`);

    return true;
  }

  private handleException(error: any) {

    if (error.code === 11000) {

      throw new BadRequestException(`the id or name: ${JSON.stringify(error.keyValue)} already exist in the database.`);

    } else {

      console.log(error);

      throw new InternalServerErrorException(`problem executing command...`);

    }
  }

}
