---
to: src/presentation/modules/<%= kebabCase %>/<%= kebabCase %>.module.mongodb.ts
---
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { <%= pascalCase %>Controller } from './<%= kebabCase %>.controller';
import { Create<%= pascalCase %>UseCase } from '../../../application/use-cases/<%= kebabCase %>/create-<%= kebabCase %>.use-case';
import { Get<%= pascalCase %>ByIdUseCase } from '../../../application/use-cases/<%= kebabCase %>/get-<%= kebabCase %>-by-id.use-case';
import { <%= pascalCase %>Repository } from '../../../domain/repositories/<%= kebabCase %>.repository';
import { <%= pascalCase %>RepositoryImpl } from '../../../infrastructure/database/mongodb/repositories/<%= kebabCase %>.repository.impl';
import { <%= pascalCase %>Schema, <%= pascalCase %>MongooseSchema } from '../../../infrastructure/database/mongodb/schemas/<%= kebabCase %>.schema';

/**
 * MongoDB-specific <%= pascalCase %> Module
 * 
 * This module configures the <%= camelCase %> feature to use MongoDB via Mongoose.
 */
@Module({
  imports: [
    MongooseModule.forFeature([{ name: <%= pascalCase %>Schema.name, schema: <%= pascalCase %>MongooseSchema }]),
  ],
  controllers: [<%= pascalCase %>Controller],
  providers: [
    Create<%= pascalCase %>UseCase,
    Get<%= pascalCase %>ByIdUseCase,
    {
      provide: <%= pascalCase %>Repository,
      useClass: <%= pascalCase %>RepositoryImpl,
    },
  ],
  exports: [
    Create<%= pascalCase %>UseCase,
    Get<%= pascalCase %>ByIdUseCase,
  ],
})
export class <%= pascalCase %>Module {}
