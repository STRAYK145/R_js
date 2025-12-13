/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
exports.up = function(knex) {
 return knex.schema
 .createTable("otziv", function (table) {
 table.increments("id").primary();
 table.string("Name");
 table.string("TextOT")
 })

};
/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
exports.down = function(knex) {

}; 
