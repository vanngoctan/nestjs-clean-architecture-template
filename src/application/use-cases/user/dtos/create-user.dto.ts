/**
 * Data Transfer Object for the input of the Create User use case
 */
export class CreateUserDto {
  email: string;
  name: string;
  password: string;
}

/**
 * Data Transfer Object for the output of the Create User use case
 */
export class CreatedUserDto {
  id: string | number;
  email: string;
  name: string;
}
