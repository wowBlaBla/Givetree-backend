import { Migration } from '@mikro-orm/migrations';

export class Migration20221101094259 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `users` modify `tax` tinyint(1) not null;');

    this.addSql('alter table `refresh_tokens` modify `is_revoked` json not null;');

    this.addSql('alter table `socials` modify `user_id` int(11) unsigned null, modify `collection_id` int(11) unsigned null;');

    this.addSql('alter table `charity_property` modify `employee` int(11) default 0;');
  }

}
