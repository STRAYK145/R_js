/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
exports.up = function(knex) {
 return knex.schema
 .createTable("file", function (table) {
 table.increments("id").primary();
 table.string("data");
 table.string("contentType")
 })

};
/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
exports.down = function(knex) {

}; 