const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

const migrationsDir = path.join(__dirname, '../src/migrations')

async function resetDatabase() {
  const client = await pool.connect()
  
  try {
    console.log('=== Сброс базы данных ===\n')

    // Получаем список всех таблиц
    const tablesResult = await client.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public'
    `)
    
    const tables = tablesResult.rows.map(row => row.tablename)
    
    if (tables.length > 0) {
      console.log('Удаление таблиц...')
      // Удаляем все таблицы с CASCADE
      for (const table of tables) {
        try {
          await client.query(`DROP TABLE IF EXISTS ${table} CASCADE`)
          console.log(`  ✓ Удалена таблица: ${table}`)
        } catch (error) {
          console.error(`  ✗ Ошибка при удалении ${table}:`, error.message)
        }
      }
    }

    // Удаляем все типы ENUM
    console.log('\nУдаление типов ENUM...')
    const enumsResult = await client.query(`
      SELECT typname FROM pg_type 
      WHERE typtype = 'e' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    `)
    
    for (const enumType of enumsResult.rows) {
      try {
        await client.query(`DROP TYPE IF EXISTS ${enumType.typname} CASCADE`)
        console.log(`  ✓ Удален тип: ${enumType.typname}`)
      } catch (error) {
        console.error(`  ✗ Ошибка при удалении ${enumType.typname}:`, error.message)
      }
    }

    // Удаляем расширения (кроме стандартных)
    console.log('\nУдаление расширений...')
    try {
      await client.query(`DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE`)
      console.log('  ✓ Удалено расширение: uuid-ossp')
    } catch (error) {
      console.error('  ✗ Ошибка при удалении расширений:', error.message)
    }

    console.log('\n=== Применение миграций ===\n')

    // Получаем список файлов миграций в порядке
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort() // Сортировка по имени (001, 002, 003...)

    console.log(`Найдено ${files.length} миграций:`)
    files.forEach(file => console.log(`  - ${file}`))

    for (const file of files) {
      const filePath = path.join(migrationsDir, file)
      const sql = fs.readFileSync(filePath, 'utf8')
      
      console.log(`\nВыполнение миграции: ${file}`)
      
      try {
        await client.query('BEGIN')
        await client.query(sql)
        await client.query('COMMIT')
        console.log(`✓ Миграция ${file} выполнена успешно`)
      } catch (error) {
        await client.query('ROLLBACK')
        console.error(`✗ Ошибка при выполнении ${file}:`, error.message)
        throw error
      }
    }

    console.log('\n✓ База данных успешно сброшена и пересоздана!')
  } catch (error) {
    console.error('Ошибка:', error)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

resetDatabase()





