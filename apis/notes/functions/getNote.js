"use strict";
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");
const helper = require("./lib/helper");
const { NOTES_TABLE } = process.env;
const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
});
const documentClient = DynamoDBDocumentClient.from(dynamoDBClient);

module.exports.handler = async (event) => {
  console.log("NOTES_TABLE:", NOTES_TABLE);
  console.log("Path Parameters:", event.pathParameters);
  let { id } = event.pathParameters;
  try {
    const params = {
      TableName: NOTES_TABLE,
      Key: { id },
    };
    const result = await documentClient.send(new GetCommand(params));
    console.log("Result:", result);
    return helper.respond(200, result.Item);
  } catch (err) {
    console.log(err);
    return helper.respond(500, err.message);
  }
};
