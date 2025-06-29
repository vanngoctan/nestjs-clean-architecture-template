---
to: src/presentation/modules/<%= kebabCase %>/<%= kebabCase %>.module.ts
---
import { Module } from '@nestjs/common';
import { <%= pascalCase %>Controller } from './<%= kebabCase %>.controller';
import { Create<%= pascalCase %>UseCase } from '../../../application/use-cases/<%= kebabCase %>/create-<%= kebabCase %>.use-case';
import { Get<%= pascalCase %>ByIdUseCase } from '../../../application/use-cases/<%= kebabCase %>/get-<%= kebabCase %>-by-id.use-case';

/**
 * <%= pascalCase %> Module for MySQL
 * 
 * This is the main module for the <%= camelCase %> feature when using MySQL.
 * Uncomment the database-specific imports and providers below based on your database choice.
 */
@Module({
  imports: [
    // Uncomment for MySQL:
    // TypeOrmModule.forFeature([<%= pascalCase %>Model]),
    
    // Uncomment for MongoDB:
    // MongooseModule.forFeature([{ name: <%= pascalCase %>Schema.name, schema: <%= pascalCase %>MongooseSchema }]),
  ],
  controllers: [<%= pascalCase %>Controller],
  providers: [
    Create<%= pascalCase %>UseCase,
    Get<%= pascalCase %>ByIdUseCase,
    
    // Uncomment for MySQL:
    // {
    //   provide: <%= pascalCase %>Repository,
    //   useClass: <%= pascalCase %>RepositoryImpl,
    // },
    
    // Uncomment for MongoDB:
    // {
    //   provide: <%= pascalCase %>Repository,
    //   useClass: <%= pascalCase %>RepositoryImpl,
    // },
  ],
  exports: [
    Create<%= pascalCase %>UseCase,
    Get<%= pascalCase %>ByIdUseCase,
  ],
})
export class <%= pascalCase %>Module {}
