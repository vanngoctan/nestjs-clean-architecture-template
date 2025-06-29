import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * TypeORM entity for User in MySQL database.
 * This class maps the domain User entity to a database table.
 */
@Entity('users')
export class UserModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  passwordHash: string;
}
