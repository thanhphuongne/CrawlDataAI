-- Use environment variables to set role and password
\set role_name :DB_USERNAME
\set role_password :DB_PASSWORD

-- Alter the role with the provided password
ALTER ROLE :"role_name" WITH PASSWORD :'role_password';