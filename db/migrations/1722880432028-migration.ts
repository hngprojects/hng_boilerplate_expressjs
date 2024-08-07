import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1722880432028 implements MigrationInterface {
  name = "Migration1722880432028";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "notification_settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "user_id" character varying NOT NULL, "mobile_notifications" boolean NOT NULL DEFAULT true, "email_notifications_activity_workspace" boolean NOT NULL DEFAULT false, "email_notifications_always_send_email" boolean NOT NULL DEFAULT false, "email_notifications_email_digests" boolean NOT NULL DEFAULT true, "email_notifications_announcement__and_update_emails" boolean NOT NULL DEFAULT true, "slack_notifications_activity_workspace" boolean NOT NULL DEFAULT true, "slack_notifications_always_send_email" boolean NOT NULL DEFAULT true, "slack_notifications_email_digests" boolean NOT NULL DEFAULT true, "slack_notifications_announcement__and_update_emails" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_91a7ffebe8b406c4470845d4781" UNIQUE ("user_id"), CONSTRAINT "UQ_91a7ffebe8b406c4470845d4781" UNIQUE ("user_id"), CONSTRAINT "PK_d131abd7996c475ef768d4559ba" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "message" character varying NOT NULL, "is_read" boolean NOT NULL DEFAULT false, "userId" uuid, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_692a909ee0fa9383e7859f9b406"`,
    );
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TABLE "notification_settings"`);
  }
}
