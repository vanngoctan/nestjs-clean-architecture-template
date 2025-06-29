---
to: src/infrastructure/database/mysql/models/<%= kebabCase %>.model.ts
---
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * <%= pascalCase %> TypeORM Model
 * 
 * ORM model for the <%= pascalCase %> entity in MySQL database.
 * This is part of the infrastructure layer and handles persistence.
 */
@Entity('<%= snakeCasePlural %>')
export class <%= pascalCase %>Model {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  
  // Add your <%= pascalCase %> specific columns here
  // Example:
  // @Column()
  // name: string;
  
  // @Column({ nullable: true })
  // description: string;
}
