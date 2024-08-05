import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1722811767677 implements MigrationInterface {
  name = "Migration1722811767677";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "help-center-topics" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "title" character varying NOT NULL, "content" character varying NOT NULL, "author" character varying NOT NULL DEFAULT 'ADMIN', CONSTRAINT "PK_32c3c0df30f2cc32072e81bff20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "testimonial" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "client_name" character varying NOT NULL, "client_position" character varying NOT NULL, "testimonial" character varying NOT NULL, CONSTRAINT "PK_e1aee1c726db2d336480c69f7cb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "email_queue" ("id" SERIAL NOT NULL, "templateId" character varying NOT NULL, "recipient" character varying NOT NULL, "variables" json NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b6c031a57087af131ed0176e17c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organization" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "slug" character varying NOT NULL, "name" character varying NOT NULL, "email" character varying, "industry" character varying, "type" character varying, "country" character varying, "address" character varying, "state" character varying, "description" text, "owner_id" uuid NOT NULL, CONSTRAINT "UQ_a08804baa7c5d5427067c49a31f" UNIQUE ("slug"), CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_organization_user_role_enum" AS ENUM('admin', 'vendor')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_organization" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" uuid NOT NULL, "organizationId" uuid NOT NULL, "user_role" "public"."user_organization_user_role_enum" NOT NULL DEFAULT 'vendor', CONSTRAINT "PK_43802f205cc8bae1aa9bada68d1" PRIMARY KEY ("id", "userId", "organizationId"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "job" ADD "user_id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_organization" ADD CONSTRAINT "FK_29c3c8cc3ea9db22e4a347f4b5a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_organization" ADD CONSTRAINT "FK_7143f31467178a6164a42426c15" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_organization" DROP CONSTRAINT "FK_7143f31467178a6164a42426c15"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_organization" DROP CONSTRAINT "FK_29c3c8cc3ea9db22e4a347f4b5a"`,
    );
    await queryRunner.query(`ALTER TABLE "job" DROP COLUMN "user_id"`);
    await queryRunner.query(`DROP TABLE "user_organization"`);
    await queryRunner.query(
      `DROP TYPE "public"."user_organization_user_role_enum"`,
    );
    await queryRunner.query(`DROP TABLE "organization"`);
    await queryRunner.query(`DROP TABLE "email_queue"`);
    await queryRunner.query(`DROP TABLE "testimonial"`);
    await queryRunner.query(`DROP TABLE "help-center-topics"`);
  }
}
