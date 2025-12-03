-- Скрипт для полного сброса базы данных
-- ВНИМАНИЕ: Удалит все данные!

-- Отключаем проверку внешних ключей
SET session_replication_role = 'replica';

-- Удаляем все таблицы
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;

-- Удаляем все типы ENUM
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (
        SELECT typname FROM pg_type 
        WHERE typtype = 'e' 
        AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    ) 
    LOOP
        EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.typname) || ' CASCADE';
    END LOOP;
END $$;

-- Удаляем расширения
DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;

-- Включаем обратно проверку внешних ключей
SET session_replication_role = 'origin';



