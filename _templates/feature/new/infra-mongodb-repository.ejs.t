---
to: src/infrastructure/database/mongodb/repositories/<%= kebabCase %>.repository.impl.ts
---
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { <%= pascalCase %>Entity } from '../../../../domain/entities/<%= kebabCase %>.entity';
import { <%= pascalCase %>Repository } from '../../../../domain/repositories/<%= kebabCase %>.repository';
import { <%= pascalCase %>Document, <%= pascalCase %>Schema } from '../schemas/<%= kebabCase %>.schema';

/**
 * MongoDB implementation of the <%= pascalCase %>Repository
 * 
 * This class adapts between the domain entity and the Mongoose document.
 * It's part of the infrastructure layer and provides concrete data access.
 */
@Injectable()
export class <%= pascalCase %>RepositoryImpl implements <%= pascalCase %>Repository {
  constructor(
    @InjectModel(<%= pascalCase %>Schema.name)
    private <%= camelCase %>Model: Model<<%= pascalCase %>Document>,
  ) {}

  /**
   * Maps from MongoDB document to domain entity
   */
  private toEntity(<%= camelCase %>: <%= pascalCase %>Document): <%= pascalCase %>Entity {
    return new <%= pascalCase %>Entity({
      id: <%= camelCase %>._id.toString(),
      createdAt: <%= camelCase %>.created_at,
      updatedAt: <%= camelCase %>.updated_at,
      // Map additional properties here
    });
  }

  /**
   * Creates a new <%= camelCase %> record
   */
  async create(<%= camelCase %>Entity: <%= pascalCase %>Entity): Promise<<%= pascalCase %>Entity> {
    const created = await this.<%= camelCase %>Model.create({
      _id: <%= camelCase %>Entity.id,
      // Map additional properties here
    });
    
    return this.toEntity(created);
  }

  /**
   * Finds <%= ['a','e','i','o','u'].includes(camelCase[0].toLowerCase()) ? 'an' : 'a' %> <%= camelCase %> by its ID
   */
  async findById(id: string): Promise<<%= pascalCase %>Entity | null> {
    const <%= camelCase %> = await this.<%= camelCase %>Model.findById(id).exec();
    return <%= camelCase %> ? this.toEntity(<%= camelCase %>) : null;
  }

  /**
   * Finds all <%= camelCasePlural %>
   */
  async findAll(): Promise<<%= pascalCase %>Entity[]> {
    const <%= camelCasePlural %> = await this.<%= camelCase %>Model.find().exec();
    return <%= camelCasePlural %>.map(<%= camelCase %> => this.toEntity(<%= camelCase %>));
  }

  /**
   * Updates an existing <%= camelCase %>
   */
  async update(id: string, <%= camelCase %>: Partial<Omit<<%= pascalCase %>Entity, 'id'>>): Promise<<%= pascalCase %>Entity | null> {
    const updated = await this.<%= camelCase %>Model
      .findByIdAndUpdate(
        id, 
        {
          // Map properties for update here
          ...(<%= camelCase %> as any),
          updated_at: new Date()
        },
        { new: true }
      )
      .exec();
      
    return updated ? this.toEntity(updated) : null;
  }

  /**
   * Deletes <%= ['a','e','i','o','u'].includes(camelCase[0].toLowerCase()) ? 'an' : 'a' %> <%= camelCase %> by its ID
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.<%= camelCase %>Model.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }
}
