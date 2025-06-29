import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1701234567890 implements MigrationInterface {
  name = "Initial1701234567890";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS \`users\` (
                \`id\` varchar(36) NOT NULL,
                \`email\` varchar(255) NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`passwordHash\` varchar(255) NOT NULL,
                PRIMARY KEY (\`id\`),
                UNIQUE INDEX \`IDX_users_email\` (\`email\`)
            ) ENGINE=InnoDB
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS \`users\``);
  }
}
