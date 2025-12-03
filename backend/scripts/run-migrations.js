const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

// Используем DATABASE_URL, если он указан, иначе отдельные переменные
let poolConfig

if (process.env.DATABASE_URL) {
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  }
} else {
  // Fallback на отдельные переменные
  const password = process.env.DB_PASSWORD
  if (!password || typeof password !== 'string') {
    console.error('Ошибка: DB_PASSWORD не указан в .env файле или имеет неверный тип')
    console.error('Укажите либо DATABASE_URL, либо отдельные переменные: DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD')
    process.exit(1)
  }

  poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: password,
  }
}

const pool = new Pool(poolConfig)

const migrationsDir = path.join(__dirname, '../src/migrations')

async function runMigrations() {
  const client = await pool.connect()
  
  try {
    // Получаем список файлов миграций в порядке
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort() // Сортировка по имени (001, 002, 003...)

    console.log(`Найдено ${files.length} миграций:`)
    files.forEach(file => console.log(`  - ${file}`))

    // Коды ошибок PostgreSQL, которые можно игнорировать (уже существует)
    const ignorableErrorCodes = [
      '42710', // duplicate_object - объект уже существует
      '42P07', // duplicate_table - таблица уже существует
      '42704', // undefined_object - объект не существует (для DROP)
      '42P16', // invalid_table_definition - для случаев, когда структура уже есть
    ]

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
        
        // Проверяем, можно ли игнорировать ошибку
        if (ignorableErrorCodes.includes(error.code)) {
          console.warn(`⚠ Миграция ${file}: объект уже существует, пропускаем (${error.code}: ${error.message})`)
          continue
        }
        
        console.error(`✗ Ошибка при выполнении ${file}:`, error.message)
        throw error
      }
    }

    console.log('\n✓ Все миграции выполнены успешно!')
  } catch (error) {
    console.error('Ошибка выполнения миграций:', error)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

runMigrations()



