import { Migration } from "@mikro-orm/migrations";

export class Migration20220914041839 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      "create table `users` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `email` varchar(255) not null, `password` varchar(255) not null, `first_name` varchar(255) null, `last_name` varchar(255) null) default character set utf8mb4 engine = InnoDB;",
    );
    this.addSql(
      "alter table `users` add unique `users_email_unique`(`email`);",
    );

    this.addSql(
      "create table `posts` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `title` varchar(255) not null, `body` varchar(255) not null, `author_id` int(11) unsigned not null) default character set utf8mb4 engine = InnoDB;",
    );
    this.addSql(
      "alter table `posts` add index `posts_author_id_index`(`author_id`);",
    );

    this.addSql(
      "create table `refresh_tokens` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `user_id` int(11) unsigned not null, `is_revoked` json not null, `expires` datetime not null) default character set utf8mb4 engine = InnoDB;",
    );
    this.addSql(
      "alter table `refresh_tokens` add index `refresh_tokens_user_id_index`(`user_id`);",
    );

    this.addSql(
      "alter table `posts` add constraint `posts_author_id_foreign` foreign key (`author_id`) references `users` (`id`) on update cascade on delete CASCADE;",
    );

    this.addSql(
      "alter table `refresh_tokens` add constraint `refresh_tokens_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on update cascade on delete CASCADE;",
    );
  }
}
