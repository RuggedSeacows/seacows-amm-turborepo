/* Create database */
drop database if exists "amm-indexer";
create database "amm-indexer";

/* Create user with password */
create user seacows with encrypted password 'seacows-dbpwd';

/* Grant privileges and rights */
grant all privileges on database "amm-indexer" to seacows;
alter user seacows createdb;
