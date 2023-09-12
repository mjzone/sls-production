"use strict";
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const helper = require("./lib/helper");
const { NOTES_TABLE } = process.env;
const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
});
const documentClient = DynamoDBDocumentClient.from(dynamoDBClient);

module.exports.handler = async (event) => {
  let { id } = event.pathParameters;
  if (!id) {
    return helper.respond(400, "Note id must NOT be empty");
  }
  try {
    const params = {
      TableName: NOTES_TABLE,
      Key: { id },
      ConditionExpression: "attribute_exists(id)",
    };
    await documentClient.send(new DeleteCommand(params));
    return helper.respond(200, `Note with id ${id} is deleted!`);
  } catch (err) {
    console.log(err);
    return helper.respond(500, err.message);
  }
};
