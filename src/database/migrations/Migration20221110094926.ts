import { Migration } from '@mikro-orm/migrations';

export class Migration20221110094926 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `users` add `nonce` int(11) not null default 0;');
  }

}
