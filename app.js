const express = require('express')
const app = express()
require('dotenv').config()
// const mysql = require('mysql');
require('./startup/routes')(app)
const cron = require('node-cron')
const { db } = require('./startup/db')
const cors = require("cors")

const { sequelize } = require('./startup/db')
const createProductList = require('./startup/createProductList')
const axios = require('axios')


app.use(cors())
app.get('/', async (req, res) => {
  try {
    // let data = await sequelize.query('SELECT * from employee LIMIT 1')
    // console.log(data)
    res.json('HELLO')
  } catch (err) {
    console.log(err)
  }
})

cron.schedule('*/6 * * * *', async () => {
  try {
    const config = {
      method: 'get',
      url: `https://mapi.indiamart.com/wservce/crm/crmListing/v2/?glusr_crm_key=${process.env.INDIAMART_CRM_KEY}`,
    }

    const result = await axios(config)
    console.log(result.data, 31)
    let queryArray = []
    if (result.data.TOTAL_RECORDS > 0) {
      queryArray = result.data.RESPONSE
    }

    for (let i = 0; i < queryArray.length; i++) {
      const existingClient = await db.client.findOne({
        where: { client_mobile: queryArray[i].SENDER_MOBILE },
      })
      console.log(
        '🚀 ~ file: app.js:40 ~ cron.schedule ~ existingClient:',
        existingClient
      )
      let client = existingClient ? existingClient.dataValues : null
      if (!existingClient) {
        const payload = {
          client_email: queryArray[i].SENDER_EMAIL,
          client_name: queryArray[i].SENDER_NAME,
          client_mobile: queryArray[i].SENDER_MOBILE,
          client_billing_address: queryArray[i].SENDER_ADDRESS,
          client_city: queryArray[i].SENDER_CITY,
          client_state: queryArray[i].SENDER_STATE,
          client_country_iso: queryArray[i].SENDER_COUNTRY_ISO,
          client_company_name: queryArray[i].SENDER_COMPANY,
          client_alternate_email: queryArray[i].SENDER_EMAIL_ALT,
          client_alternate_mobile:
            queryArray[i].SENDER_MOBILE_ALT == ''
              ? queryArray[i].SENDER_PHONE
              : queryArray[i].SENDER_MOBILE_ALT,
        }

        let newClient = db.client.build(payload)
        newClient = await newClient.save()
        client = newClient.dataValues
        console.log('🚀 ~ file: app.js:65 ~ cron.schedule ~ client:', client)
      }

      const queryPayload = {
        client_id: client.client_id,
        query_source: 'indiamart',
        query_create_time: queryArray[i].QUERY_TIME,
        query_subject: queryArray[i].SUBJECT,
        query_product: queryArray[i].QUERY_PRODUCT_NAME,
        query_message: queryArray[i].QUERY_MESSAGE.replace(
          /(<([^>]+)>)/gi,
          ' '
        ),
        query_state: 'new',
        query_data: JSON.stringify(queryArray[i]),
      }

      const newQuery = db.query.build(queryPayload)
      await newQuery.save()

      const cntQueries = await db.query.count({
        where: {
          client_id: queryPayload.client_id,
        },
      })

      if (cntQueries > 1) {
        const client = await db.client.findByPk(queryPayload.client_id)
        await client.update({
          client_isNew: 'old',
        })
      }
    }
  } catch (error) {
    console.log(error)
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
