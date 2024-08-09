import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1723149365089 implements MigrationInterface {
  name = "CreateUsersTable1723149365089";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "notification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" character varying NOT NULL, "isRead" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "secret" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "is_2fa_enabled" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "backup_codes" text`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "is_active" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "deactivation_reason" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "news_letter_subscriber" ADD "isSubscribe" boolean NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_categories_category" DROP CONSTRAINT "FK_f5665dcbec4177775b6edab2b9b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" DROP CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03"`,
    );
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "category" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" ADD CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_tags_tag" DROP CONSTRAINT "FK_066934a149d9efba507443ce889"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tag" DROP CONSTRAINT "PK_8e4052373c579afc1471f526760"`,
    );
    await queryRunner.query(`ALTER TABLE "tag" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "tag" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "tag" ADD CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "billing_plan" DROP CONSTRAINT "FK_e5f604154fb0c0cb99c9739fc69"`,
    );
    await queryRunner.query(
      `ALTER TABLE "billing_plan" ALTER COLUMN "organizationId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_tags_tag" DROP CONSTRAINT "PK_163bef1f79bd1f15b07f75e072d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_tags_tag" ADD CONSTRAINT "PK_9572d27777384d535f77ed780d0" PRIMARY KEY ("blogId")`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_066934a149d9efba507443ce88"`,
    );
    await queryRunner.query(`ALTER TABLE "blog_tags_tag" DROP COLUMN "tagId"`);
    await queryRunner.query(
      `ALTER TABLE "blog_tags_tag" ADD "tagId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_tags_tag" DROP CONSTRAINT "PK_9572d27777384d535f77ed780d0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_tags_tag" ADD CONSTRAINT "PK_163bef1f79bd1f15b07f75e072d" PRIMARY KEY ("blogId", "tagId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_categories_category" DROP CONSTRAINT "PK_5f83120a485466f9e3fe7ada496"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_categories_category" ADD CONSTRAINT "PK_200fdd3b43e7dfde885cf71bd3a" PRIMARY KEY ("blogId")`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f5665dcbec4177775b6edab2b9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_categories_category" DROP COLUMN "categoryId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_categories_category" ADD "categoryId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_categories_category" DROP CONSTRAINT "PK_200fdd3b43e7dfde885cf71bd3a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_categories_category" ADD CONSTRAINT "PK_5f83120a485466f9e3fe7ada496" PRIMARY KEY ("blogId", "categoryId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_066934a149d9efba507443ce88" ON "blog_tags_tag" ("tagId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f5665dcbec4177775b6edab2b9" ON "blog_categories_category" ("categoryId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "billing_plan" ADD CONSTRAINT "FK_e5f604154fb0c0cb99c9739fc69" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_1ced25315eb974b73391fb1c81b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_tags_tag" ADD CONSTRAINT "FK_066934a149d9efba507443ce889" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_categories_category" ADD CONSTRAINT "FK_f5665dcbec4177775b6edab2b9b" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blog_categories_category" DROP CONSTRAINT "FK_f5665dcbec4177775b6edab2b9b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_tags_tag" DROP CONSTRAINT "FK_066934a149d9efba507443ce889"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_1ced25315eb974b73391fb1c81b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "billing_plan" DROP CONSTRAINT "FK_e5f604154fb0c0cb99c9739fc69"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f5665dcbec4177775b6edab2b9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_066934a149d9efba507443ce88"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_categories_category" DROP CONSTRAINT "PK_5f83120a485466f9e3fe7ada496"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_categories_category" ADD CONSTRAINT "PK_200fdd3b43e7dfde885cf71bd3a" PRIMARY KEY ("blogId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_categories_category" DROP COLUMN "categoryId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_categories_category" ADD "categoryId" integer NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f5665dcbec4177775b6edab2b9" ON "blog_categories_category" ("categoryId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_categories_category" DROP CONSTRAINT "PK_200fdd3b43e7dfde885cf71bd3a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_categories_category" ADD CONSTRAINT "PK_5f83120a485466f9e3fe7ada496" PRIMARY KEY ("blogId", "categoryId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_tags_tag" DROP CONSTRAINT "PK_163bef1f79bd1f15b07f75e072d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_tags_tag" ADD CONSTRAINT "PK_9572d27777384d535f77ed780d0" PRIMARY KEY ("blogId")`,
    );
    await queryRunner.query(`ALTER TABLE "blog_tags_tag" DROP COLUMN "tagId"`);
    await queryRunner.query(
      `ALTER TABLE "blog_tags_tag" ADD "tagId" integer NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_066934a149d9efba507443ce88" ON "blog_tags_tag" ("tagId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_tags_tag" DROP CONSTRAINT "PK_9572d27777384d535f77ed780d0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_tags_tag" ADD CONSTRAINT "PK_163bef1f79bd1f15b07f75e072d" PRIMARY KEY ("blogId", "tagId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "billing_plan" ALTER COLUMN "organizationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "billing_plan" ADD CONSTRAINT "FK_e5f604154fb0c0cb99c9739fc69" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tag" DROP CONSTRAINT "PK_8e4052373c579afc1471f526760"`,
    );
    await queryRunner.query(`ALTER TABLE "tag" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "tag" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "tag" ADD CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_tags_tag" ADD CONSTRAINT "FK_066934a149d9efba507443ce889" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" DROP CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03"`,
    );
    await queryRunner.query(`ALTER TABLE "category" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "category" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "category" ADD CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_categories_category" ADD CONSTRAINT "FK_f5665dcbec4177775b6edab2b9b" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "news_letter_subscriber" DROP COLUMN "isSubscribe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "deactivation_reason"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_active"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "backup_codes"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_2fa_enabled"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "secret"`);
    await queryRunner.query(`DROP TABLE "notification"`);
  }
}
