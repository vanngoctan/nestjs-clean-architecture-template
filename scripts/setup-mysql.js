#!/usr/bin/env node
/**
 * This script creates the MySQL database if it doesn't exist
 * Usage: 
 *   npm run db:setup:mysql
 */
const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupMySqlDatabase() {
  const { 
    MYSQL_HOST, 
    MYSQL_PORT, 
    MYSQL_USER, 
    MYSQL_PASSWORD, 
    MYSQL_DATABASE 
  } = process.env;

  const connection = await mysql.createConnection({
    host: MYSQL_HOST || 'localhost',
    port: MYSQL_PORT || 3306,
    user: MYSQL_USER || 'root',
    password: MYSQL_PASSWORD || '',
  });

  try {
    console.log(`Creating database ${MYSQL_DATABASE} if it doesn't exist...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE}`);
    console.log(`Database ${MYSQL_DATABASE} created or already exists.`);
  } catch (error) {
    console.error('Error creating database:', error);
  } finally {
    await connection.end();
  }
}

setupMySqlDatabase();
