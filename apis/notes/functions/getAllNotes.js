"use strict";
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const helper = require("./lib/helper");
const { NOTES_TABLE } = process.env;
const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
});
const documentClient = DynamoDBDocumentClient.from(dynamoDBClient);

module.exports.handler = async (event) => {
  try {
    const params = {
      TableName: NOTES_TABLE,
    };
    const results = await documentClient.send(new ScanCommand(params));
    return helper.respond(200, results.Items);
  } catch (err) {
    console.log(err);
    return helper.respond(500, err.message);
  }
};
