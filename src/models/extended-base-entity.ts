import { BaseEntity, BeforeInsert, BeforeUpdate } from 'typeorm';
import { validateOrReject } from 'class-validator';

class ExtendedBaseEntity extends BaseEntity {
  @BeforeInsert()
  async validateOnInsert() {
    await validateOrReject(this);
  }

  @BeforeUpdate()
  async validateOnUpdate() {
    await validateOrReject(this, { skipMissingProperties: true });
  }
}

export default ExtendedBaseEntity;
