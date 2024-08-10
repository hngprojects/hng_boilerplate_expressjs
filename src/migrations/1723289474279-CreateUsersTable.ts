import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1723289474279 implements MigrationInterface {
  name = "CreateUsersTable1723289474279";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_active"`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "deactivation_reason"`,
    );
    await queryRunner.query(
      `ALTER TABLE "faq" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "faq" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "is_superadmin" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_superadmin"`);
    await queryRunner.query(`ALTER TABLE "faq" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "faq" DROP COLUMN "created_at"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "deactivation_reason" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "is_active" boolean NOT NULL DEFAULT true`,
    );
  }
}
