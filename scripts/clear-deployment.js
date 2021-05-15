const log_scraper = require('cloudwatch-log-scraper');
const aws = require('aws-sdk')
const ddb = new aws.DynamoDB({region: 'eu-west-1'})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function deleteTable (tableName) {
    const tableDescription = await ddb.describeTable({TableName: tableName}).promise()

    console.log(`Got table description for ${tableName}`)

    const ttlDescription = await ddb.describeTimeToLive({TableName: tableName}).promise()

    console.log(`Got ttl description for ${tableName}`)

    await ddb.deleteTable({TableName: tableName}).promise()
    console.log(`Started deletion of ${tableName}`)

    let deleted = false

    while (!deleted) {
        try {
            await ddb.describeTable({TableName: tableName}).promise()
            console.log(`Delete not yet done, waiting 1s`)
            await sleep(1000)
        } catch (err) {
            deleted = true
            console.log(`Successfully deleted ${tableName}`)
        }
    }

    let createTableParams = {
        TableName: tableName,
        AttributeDefinitions: tableDescription.Table.AttributeDefinitions,
        KeySchema: tableDescription.Table.KeySchema,
        BillingMode: tableDescription.Table.BillingModeSummary.BillingMode
    };
    await ddb.createTable(createTableParams).promise()

    console.log(`Started creation of ${tableName}`)

    let created = false
    while (!created) {
        try {
            const tabDesc = await ddb.describeTable({TableName: tableName}).promise()
            if (tabDesc.Table.TableStatus === "ACTIVE") {
                created = true
                console.log(`Successfully created ${tableName}`)
            } else {
                await sleep(1000)
                console.log(`Creation not yet done, status not active, waiting 1s`)
            }
        } catch (err) {
            await sleep(1000)
            console.log(`Creation not yet done, resource not found, waiting 1s`)
        }
    }

    if (ttlDescription.TimeToLiveDescription.TimeToLiveStatus === "ENABLED") {

        let updateTTLParams = {
            TableName: tableName,
            TimeToLiveSpecification: {
                AttributeName: ttlDescription.TimeToLiveDescription.AttributeName,
                Enabled: true
            }
        };

        await ddb.updateTimeToLive(updateTTLParams).promise()
        console.log(`Started TTL update of ${tableName}`)
    }
}

async function main() {
    const scraper = new log_scraper.LogScraper('eu-west-1');

    const group = '/aws/lambda/wt-collision-count-test-watchtower-monitor'
    await scraper.clearLogGroup(group)

    await deleteTable('Watchtower-test-MonitoredEvents')
    await deleteTable('Watchtower-test-InstanceCheckpoints')

}

main()