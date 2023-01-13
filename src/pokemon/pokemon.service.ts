import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleException(error);
    }
  }

  async findAll() {
    const pokemonsFound = await this.pokemonModel.find();
    return pokemonsFound;
  }

  async findOne(term: string) {
    let pokemonFound: Pokemon;

    if (!isNaN(+term)) {
      pokemonFound = await this.pokemonModel.findOne({ no: term });
    }

    if (!pokemonFound && isValidObjectId(term)) {
      pokemonFound = await this.pokemonModel.findById(term);
    }

    if (!pokemonFound) {
      pokemonFound = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim(),
      });
    }

    if (!pokemonFound)
      throw new NotFoundException(
        `Pokemon with id, name or no "${term}" not found`,
      );

    return pokemonFound;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemonFound = await this.findOne(term);

    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    try {
      await pokemonFound.updateOne(updatePokemonDto, { new: true });

      return { ...pokemonFound.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleException(error);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (!deletedCount)
      throw new BadRequestException(`Pokemon with id ${id} not found`);
    return;
  }

  private handleException(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't createPokemon - check server logs`,
    );
  }
}
