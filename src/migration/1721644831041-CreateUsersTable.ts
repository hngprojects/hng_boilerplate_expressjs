import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1721644831041 implements MigrationInterface {
    name = 'CreateUsersTable1721644831041'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "organization" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "phone" character varying NOT NULL, "avatarUrl" character varying NOT NULL, CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "userId" uuid, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "help_center_topic" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "content" character varying NOT NULL, "author" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f1fd49531d0c8c8ecf09fca6e84" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notification_setting" ("id" SERIAL NOT NULL, "user_id" character varying NOT NULL, "email_notifications" boolean NOT NULL, "push_notifications" boolean NOT NULL, "sms_notifications" boolean NOT NULL, CONSTRAINT "UQ_d210b9143572b7e8179c15f5f2a" UNIQUE ("user_id"), CONSTRAINT "PK_af85fd153b97ee9eacb505453fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('super_admin', 'admin', 'user')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "isverified" boolean NOT NULL DEFAULT false, "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', "otp" integer NOT NULL, "otp_expires_at" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "resetPasswordToken" character varying, "resetPasswordExpires" TIMESTAMP, "profileId" uuid, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_9466682df91534dd95e4dbaa61" UNIQUE ("profileId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "phone_number" character varying NOT NULL, "message" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "senderIdId" uuid, CONSTRAINT "PK_60793c2f16aafe0513f8817eae8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_organizations_organization" ("userId" uuid NOT NULL, "organizationId" uuid NOT NULL, CONSTRAINT "PK_d89fbba617c90c71e2fc0bee26f" PRIMARY KEY ("userId", "organizationId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7ad3d8541fbdb5a3d137c50fb4" ON "user_organizations_organization" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8d7c566d5a234be0a646101326" ON "user_organizations_organization" ("organizationId") `);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_329b8ae12068b23da547d3b4798" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_9466682df91534dd95e4dbaa616" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sms" ADD CONSTRAINT "FK_943ad51b121cba3c48d0dae1fe3" FOREIGN KEY ("senderIdId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_organizations_organization" ADD CONSTRAINT "FK_7ad3d8541fbdb5a3d137c50fb40" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_organizations_organization" ADD CONSTRAINT "FK_8d7c566d5a234be0a6461013269" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_organizations_organization" DROP CONSTRAINT "FK_8d7c566d5a234be0a6461013269"`);
        await queryRunner.query(`ALTER TABLE "user_organizations_organization" DROP CONSTRAINT "FK_7ad3d8541fbdb5a3d137c50fb40"`);
        await queryRunner.query(`ALTER TABLE "sms" DROP CONSTRAINT "FK_943ad51b121cba3c48d0dae1fe3"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_9466682df91534dd95e4dbaa616"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_329b8ae12068b23da547d3b4798"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8d7c566d5a234be0a646101326"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7ad3d8541fbdb5a3d137c50fb4"`);
        await queryRunner.query(`DROP TABLE "user_organizations_organization"`);
        await queryRunner.query(`DROP TABLE "sms"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "notification_setting"`);
        await queryRunner.query(`DROP TABLE "help_center_topic"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "profile"`);
        await queryRunner.query(`DROP TABLE "organization"`);
    }

}
