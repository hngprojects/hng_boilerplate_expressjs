import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1723129047097 implements MigrationInterface {
  name = "CreateUsersTable1723129047097";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_5dec255234c5b7418f3d1e88ce4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation" DROP CONSTRAINT "FK_043292be3660aa8e5a46de7c4d7"`,
    );
    await queryRunner.query(
      `CREATE TABLE "squeeze" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "first_name" character varying, "last_name" character varying, "phone" character varying, "location" character varying, "job_title" character varying, "company" character varying, "interests" text, "referral_source" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9ff9af91fd97e582b9ad37c99e5" UNIQUE ("email"), CONSTRAINT "PK_3a8521260c51931d22354bc9b41" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "news_letter_subscriber" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, CONSTRAINT "PK_f1b123b524ae7f4d46e3a435663" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "blogId"`);
    await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "phoneNumber"`);
    await queryRunner.query(
      `ALTER TABLE "invitation" DROP COLUMN "orgInviteTokenId"`,
    );
    await queryRunner.query(`ALTER TABLE "comment" ADD "blog_id" uuid`);
    await queryRunner.query(`ALTER TABLE "comment" ADD "user_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "invitation" ADD "isGeneric" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation" ADD "isAccepted" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(`ALTER TABLE "invitation" DROP COLUMN "token"`);
    await queryRunner.query(
      `ALTER TABLE "invitation" ADD "token" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation" ALTER COLUMN "email" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_19494c2b9d227780622f8053d47" FOREIGN KEY ("blog_id") REFERENCES "blog"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_bbfe153fa60aa06483ed35ff4a7" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_bbfe153fa60aa06483ed35ff4a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_19494c2b9d227780622f8053d47"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation" ALTER COLUMN "email" SET NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "invitation" DROP COLUMN "token"`);
    await queryRunner.query(
      `ALTER TABLE "invitation" ADD "token" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation" DROP COLUMN "isAccepted"`,
    );
    await queryRunner.query(`ALTER TABLE "invitation" DROP COLUMN "isGeneric"`);
    await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "user_id"`);
    await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "blog_id"`);
    await queryRunner.query(
      `ALTER TABLE "invitation" ADD "orgInviteTokenId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "contact" ADD "phoneNumber" character varying(20) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "comment" ADD "blogId" uuid`);
    await queryRunner.query(`DROP TABLE "news_letter_subscriber"`);
    await queryRunner.query(`DROP TABLE "squeeze"`);
    await queryRunner.query(
      `ALTER TABLE "invitation" ADD CONSTRAINT "FK_043292be3660aa8e5a46de7c4d7" FOREIGN KEY ("orgInviteTokenId") REFERENCES "org_invite_token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_5dec255234c5b7418f3d1e88ce4" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
