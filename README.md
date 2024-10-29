# UMaps Backend


Steps to run starting from new db:

1. `bun migration`
2. `bun start:bun`

Ensure you have a `.env` file in the root of the project with the correct database credentials.

Ensure that syncing is set to true in the env file.

# Database Access

The database client used is [TypeORM](https://typeorm.io/).

This allows it to be agnostic any postgres wrapper service used. Therefore, any postgres client can be used to access the database.

This project currently uses supabase and will leverage its auth system and practices. 
