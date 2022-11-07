import { Migration } from '@mikro-orm/migrations';

export class Migration20221104103129 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `users` modify `tax` tinyint(1) default true;');
  }

}
