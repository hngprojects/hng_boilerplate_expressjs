import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1721791646396 implements MigrationInterface {
    name = 'CreateUsersTable1721791646396'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "organization" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying NOT NULL, "name" character varying NOT NULL, "email" character varying, "industry" character varying, "type" character varying, "country" character varying, "address" character varying, "state" character varying, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "owner_id" uuid NOT NULL, CONSTRAINT "UQ_a08804baa7c5d5427067c49a31f" UNIQUE ("slug"), CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "phone" character varying NOT NULL, "avatarUrl" character varying NOT NULL, CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "price" integer NOT NULL, "category" character varying NOT NULL, "userId" uuid, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "help_center_topic" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "content" character varying NOT NULL, "author" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f1fd49531d0c8c8ecf09fca6e84" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notification_setting" ("id" SERIAL NOT NULL, "user_id" character varying NOT NULL, "email_notifications" boolean NOT NULL, "push_notifications" boolean NOT NULL, "sms_notifications" boolean NOT NULL, CONSTRAINT "UQ_d210b9143572b7e8179c15f5f2a" UNIQUE ("user_id"), CONSTRAINT "PK_af85fd153b97ee9eacb505453fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comment" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "blogId" uuid, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tag" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "like" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "blogId" uuid, "userId" uuid, CONSTRAINT "PK_eff3e46d24d416b52a7e0ae4159" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blog" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "content" character varying NOT NULL, "image_url" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "published_at" TIMESTAMP NOT NULL, "authorId" uuid, CONSTRAINT "PK_85c6532ad065a448e9de7638571" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "phone_number" character varying NOT NULL, "message" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "senderId" uuid, CONSTRAINT "PK_60793c2f16aafe0513f8817eae8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "job" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "user_id" character varying NOT NULL, "description" character varying NOT NULL, "location" character varying NOT NULL, "salary" character varying NOT NULL, "job_type" character varying NOT NULL, "company_name" character varying NOT NULL, CONSTRAINT "PK_98ab1c14ff8d1cf80d18703b92f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "isverified" boolean NOT NULL DEFAULT false, "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', "otp" integer NOT NULL, "otp_expires_at" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "is_deleted" boolean NOT NULL DEFAULT false, "deletedAt" TIMESTAMP, "profileId" uuid, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_9466682df91534dd95e4dbaa61" UNIQUE ("profileId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_organization_role_enum" AS ENUM('super_admin', 'admin', 'user')`);
        await queryRunner.query(`CREATE TABLE "user_organization" ("userId" uuid NOT NULL, "organizationId" uuid NOT NULL, "role" "public"."user_organization_role_enum" NOT NULL, CONSTRAINT "PK_6e6630567770ae6f0a76d05ce33" PRIMARY KEY ("userId", "organizationId"))`);
        await queryRunner.query(`CREATE TABLE "testimonial" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "client_name" character varying NOT NULL, "client_position" character varying NOT NULL, "testimonial" character varying NOT NULL, CONSTRAINT "PK_e1aee1c726db2d336480c69f7cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blog_tags_tag" ("blogId" uuid NOT NULL, "tagId" integer NOT NULL, CONSTRAINT "PK_163bef1f79bd1f15b07f75e072d" PRIMARY KEY ("blogId", "tagId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9572d27777384d535f77ed780d" ON "blog_tags_tag" ("blogId") `);
        await queryRunner.query(`CREATE INDEX "IDX_066934a149d9efba507443ce88" ON "blog_tags_tag" ("tagId") `);
        await queryRunner.query(`CREATE TABLE "blog_categories_category" ("blogId" uuid NOT NULL, "categoryId" integer NOT NULL, CONSTRAINT "PK_5f83120a485466f9e3fe7ada496" PRIMARY KEY ("blogId", "categoryId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_200fdd3b43e7dfde885cf71bd3" ON "blog_categories_category" ("blogId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f5665dcbec4177775b6edab2b9" ON "blog_categories_category" ("categoryId") `);
        await queryRunner.query(`CREATE TABLE "user_organizations_organization" ("userId" uuid NOT NULL, "organizationId" uuid NOT NULL, CONSTRAINT "PK_d89fbba617c90c71e2fc0bee26f" PRIMARY KEY ("userId", "organizationId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7ad3d8541fbdb5a3d137c50fb4" ON "user_organizations_organization" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8d7c566d5a234be0a646101326" ON "user_organizations_organization" ("organizationId") `);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_329b8ae12068b23da547d3b4798" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_5dec255234c5b7418f3d1e88ce4" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "FK_1b343f6df7583577dffcd777120" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "like" ADD CONSTRAINT "FK_e8fb739f08d47955a39850fac23" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog" ADD CONSTRAINT "FK_a001483d5ba65dad16557cd6ddb" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sms" ADD CONSTRAINT "FK_5e4a3ebde193729147d95e0822c" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_9466682df91534dd95e4dbaa616" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_organization" ADD CONSTRAINT "FK_29c3c8cc3ea9db22e4a347f4b5a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_organization" ADD CONSTRAINT "FK_7143f31467178a6164a42426c15" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog_tags_tag" ADD CONSTRAINT "FK_9572d27777384d535f77ed780d0" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "blog_tags_tag" ADD CONSTRAINT "FK_066934a149d9efba507443ce889" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog_categories_category" ADD CONSTRAINT "FK_200fdd3b43e7dfde885cf71bd3a" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "blog_categories_category" ADD CONSTRAINT "FK_f5665dcbec4177775b6edab2b9b" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_organizations_organization" ADD CONSTRAINT "FK_7ad3d8541fbdb5a3d137c50fb40" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_organizations_organization" ADD CONSTRAINT "FK_8d7c566d5a234be0a6461013269" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_organizations_organization" DROP CONSTRAINT "FK_8d7c566d5a234be0a6461013269"`);
        await queryRunner.query(`ALTER TABLE "user_organizations_organization" DROP CONSTRAINT "FK_7ad3d8541fbdb5a3d137c50fb40"`);
        await queryRunner.query(`ALTER TABLE "blog_categories_category" DROP CONSTRAINT "FK_f5665dcbec4177775b6edab2b9b"`);
        await queryRunner.query(`ALTER TABLE "blog_categories_category" DROP CONSTRAINT "FK_200fdd3b43e7dfde885cf71bd3a"`);
        await queryRunner.query(`ALTER TABLE "blog_tags_tag" DROP CONSTRAINT "FK_066934a149d9efba507443ce889"`);
        await queryRunner.query(`ALTER TABLE "blog_tags_tag" DROP CONSTRAINT "FK_9572d27777384d535f77ed780d0"`);
        await queryRunner.query(`ALTER TABLE "user_organization" DROP CONSTRAINT "FK_7143f31467178a6164a42426c15"`);
        await queryRunner.query(`ALTER TABLE "user_organization" DROP CONSTRAINT "FK_29c3c8cc3ea9db22e4a347f4b5a"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_9466682df91534dd95e4dbaa616"`);
        await queryRunner.query(`ALTER TABLE "sms" DROP CONSTRAINT "FK_5e4a3ebde193729147d95e0822c"`);
        await queryRunner.query(`ALTER TABLE "blog" DROP CONSTRAINT "FK_a001483d5ba65dad16557cd6ddb"`);
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "FK_e8fb739f08d47955a39850fac23"`);
        await queryRunner.query(`ALTER TABLE "like" DROP CONSTRAINT "FK_1b343f6df7583577dffcd777120"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_5dec255234c5b7418f3d1e88ce4"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_329b8ae12068b23da547d3b4798"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8d7c566d5a234be0a646101326"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7ad3d8541fbdb5a3d137c50fb4"`);
        await queryRunner.query(`DROP TABLE "user_organizations_organization"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f5665dcbec4177775b6edab2b9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_200fdd3b43e7dfde885cf71bd3"`);
        await queryRunner.query(`DROP TABLE "blog_categories_category"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_066934a149d9efba507443ce88"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9572d27777384d535f77ed780d"`);
        await queryRunner.query(`DROP TABLE "blog_tags_tag"`);
        await queryRunner.query(`DROP TABLE "testimonial"`);
        await queryRunner.query(`DROP TABLE "user_organization"`);
        await queryRunner.query(`DROP TYPE "public"."user_organization_role_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "job"`);
        await queryRunner.query(`DROP TABLE "sms"`);
        await queryRunner.query(`DROP TABLE "blog"`);
        await queryRunner.query(`DROP TABLE "like"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "tag"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`DROP TABLE "notification_setting"`);
        await queryRunner.query(`DROP TABLE "help_center_topic"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "profile"`);
        await queryRunner.query(`DROP TABLE "organization"`);
    }

}
