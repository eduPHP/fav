import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addPublicOnFeeds1620480651718 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'feeds',
      new TableColumn({
        name: 'public',
        type: 'bool',
        default: false,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('feeds', 'public')
  }
}
