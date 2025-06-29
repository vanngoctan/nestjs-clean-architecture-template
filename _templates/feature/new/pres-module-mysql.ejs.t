---
to: src/presentation/modules/<%= kebabCase %>/<%= kebabCase %>.module.mysql.ts
---
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { <%= pascalCase %>Controller } from './<%= kebabCase %>.controller';
import { Create<%= pascalCase %>UseCase } from '../../../application/use-cases/<%= kebabCase %>/create-<%= kebabCase %>.use-case';
import { Get<%= pascalCase %>ByIdUseCase } from '../../../application/use-cases/<%= kebabCase %>/get-<%= kebabCase %>-by-id.use-case';
import { <%= pascalCase %>Repository } from '../../../domain/repositories/<%= kebabCase %>.repository';
import { <%= pascalCase %>RepositoryImpl } from '../../../infrastructure/database/mysql/repositories/<%= kebabCase %>.repository.impl';
import { <%= pascalCase %>Model } from '../../../infrastructure/database/mysql/models/<%= kebabCase %>.model';

/**
 * MySQL-specific <%= pascalCase %> Module
 * 
 * This module configures the <%= camelCase %> feature to use MySQL via TypeORM.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([<%= pascalCase %>Model]),
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
