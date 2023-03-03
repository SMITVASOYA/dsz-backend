const { Sequelize } = require('sequelize')
const models = require('../models/init-models')
const expressSession = require('express-session')
const SessionStore = require('express-session-sequelize')(expressSession.Store)
require('dotenv').config()
const mysql2 = require('mysql2')

const sequelize = new Sequelize(
  process.env.DB,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    logging: false,
    pool: {
      max: 1000,
    },
    dialect: 'mysql',
    dialectModule: mysql2,
    // dialectOptions: {
    //   socketPath: '/var/run/mysqld/mysqld.sock',
    // },
  }
)

const createPool = async () => {
  try {
    await sequelize.authenticate()
    // await sequelize.sync({ alter: true })
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}
createPool()

const db = models(sequelize)
// const sessionStore = new MySQLStore({}/* session store options */, sequelize);
const sequelizeSessionStore = new SessionStore({
  db: sequelize,
})

module.exports = {
  sequelize,
  db,
  sequelizeSessionStore,
  expressSession,
}
