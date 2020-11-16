import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm'

export class createPasswordResets1603244098882 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'password_resets',
        columns: [
          {
            name: 'id',
            type: 'integer',
            unsigned: true,
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'token',
            type: 'varchar',
          },
          {
            name: 'used_at',
            type: 'datetime',
            isNullable: true,
            default: null,
          },
          {
            name: 'created_at',
            type: 'datetime',
          },
          {
            name: 'user_id',
            type: 'integer',
            unsigned: true,
          },
        ],
      }),
    )

    await queryRunner.createForeignKey(
      'password_resets',
      new TableForeignKey({
        name: 'pw_reset_user_fk',
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('password_resets', 'pw_reset_user_fk')
    await queryRunner.dropTable('password_resets')
  }
}
