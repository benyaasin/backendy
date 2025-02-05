import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Create Categories Table
  await knex.schema.createTable('categories', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();
  });

  // Create Posts Table
  await knex.schema.createTable('posts', (table) => {
    table.increments('id').primary();
    table.integer('category_id').unsigned().references('id').inTable('categories');
    table.string('title').notNullable();
    table.text('content').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('published_at').nullable();
    table.timestamp('deleted_at').nullable();
  });

  // Create Comments Table
  await knex.schema.createTable('comments', (table) => {
    table.increments('id').primary();
    table.integer('post_id').unsigned().references('id').inTable('posts');
    table.text('content').notNullable();
    table.string('commenter_name').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('comments');
  await knex.schema.dropTableIfExists('posts');
  await knex.schema.dropTableIfExists('categories');
} 