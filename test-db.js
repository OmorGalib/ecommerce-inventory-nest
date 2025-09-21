const { Client } = require('pg');
const client = new Client({
  host: 'db-pybeythmpmcmdfpfzprw.supabase.co',
  port: 5432,
  user: 'postgres',
  password: 'your-password',
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => console.log('✅ Connected to Supabase!'))
  .catch(err => console.error('❌ Connection failed:', err))
  .finally(() => client.end());
