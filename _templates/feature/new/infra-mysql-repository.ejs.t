---
to: src/infrastructure/database/mysql/repositories/<%= kebabCase %>.repository.impl.ts
---
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { <%= pascalCase %>Entity } from '../../../../domain/entities/<%= kebabCase %>.entity';
import { <%= pascalCase %>Repository } from '../../../../domain/repositories/<%= kebabCase %>.repository';
import { <%= pascalCase %>Model } from '../models/<%= kebabCase %>.model';

/**
 * MySQL implementation of the <%= pascalCase %>Repository
 * 
 * This class adapts between the domain entity and the ORM model.
 * It's part of the infrastructure layer and provides concrete data access.
 */
@Injectable()
export class <%= pascalCase %>RepositoryImpl implements <%= pascalCase %>Repository {
  constructor(
    @InjectRepository(<%= pascalCase %>Model)
    private <%= camelCase %>Repository: Repository<<%= pascalCase %>Model>,
  ) {}

  /**
   * Maps from ORM model to domain entity
   */
  private toEntity(<%= camelCase %>Model: <%= pascalCase %>Model): <%= pascalCase %>Entity {
    return new <%= pascalCase %>Entity({
      id: <%= camelCase %>Model.id,
      createdAt: <%= camelCase %>Model.createdAt,
      updatedAt: <%= camelCase %>Model.updatedAt,
      // Map additional properties here
    });
  }

  /**
   * Maps from domain entity to ORM model (partial, for updates)
   */
  private toModel(<%= camelCase %>Entity: Partial<<%= pascalCase %>Entity>): Partial<<%= pascalCase %>Model> {
    // Only map non-id properties for updates
    const { id, createdAt, ...rest } = <%= camelCase %>Entity;
    return {
      ...rest,
      // Map additional properties here
    };
  }

  /**
   * Creates a new <%= camelCase %> record
   */
  async create(<%= camelCase %>: <%= pascalCase %>Entity): Promise<<%= pascalCase %>Entity> {
    const createdModel = await this.<%= camelCase %>Repository.save(
      this.<%= camelCase %>Repository.create(this.toModel(<%= camelCase %>) as <%= pascalCase %>Model),
    );
    return this.toEntity(createdModel);
  }

  /**
   * Finds <%= ['a','e','i','o','u'].includes(camelCase[0].toLowerCase()) ? 'an' : 'a' %> <%= camelCase %> by its ID
   */
  async findById(id: string): Promise<<%= pascalCase %>Entity | null> {
    const <%= camelCase %> = await this.<%= camelCase %>Repository.findOne({ where: { id } });
    return <%= camelCase %> ? this.toEntity(<%= camelCase %>) : null;
  }

  /**
   * Finds all <%= camelCasePlural %>
   */
  async findAll(): Promise<<%= pascalCase %>Entity[]> {
    const <%= camelCasePlural %> = await this.<%= camelCase %>Repository.find();
    return <%= camelCasePlural %>.map(<%= camelCase %> => this.toEntity(<%= camelCase %>));
  }

  /**
   * Updates an existing <%= camelCase %>
   */
  async update(id: string, <%= camelCase %>: Partial<Omit<<%= pascalCase %>Entity, 'id'>>): Promise<<%= pascalCase %>Entity | null> {
    await this.<%= camelCase %>Repository.update(id, this.toModel(<%= camelCase %>));
    const updated = await this.<%= camelCase %>Repository.findOne({ where: { id } });
    return updated ? this.toEntity(updated) : null;
  }

  /**
   * Deletes <%= ['a','e','i','o','u'].includes(camelCase[0].toLowerCase()) ? 'an' : 'a' %> <%= camelCase %> by its ID
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.<%= camelCase %>Repository.delete(id);
    return result.affected! > 0;
  }
}
