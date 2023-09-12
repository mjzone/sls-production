"use strict";
const { v4: uuidv4 } = require("uuid");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient,PutCommand } = require("@aws-sdk/lib-dynamodb");
const helper = require("./lib/helper");
const { NOTES_TABLE } = process.env;
const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
});
const documentClient = DynamoDBDocumentClient.from(dynamoDBClient);

module.exports.handler = async (event) => {
  let note = JSON.parse(event.body);
  if (!note.title.length || !note.body.length) {
    return helper.respond(400, "Title and body must NOT be empty");
  }
  try {
    note.id = uuidv4();
    const params = {
      TableName: NOTES_TABLE,
      Item: {
        id: note.id,
        title: note.title,
        body: note.body,
        createdAt: new Date().toJSON(),
      },
      ConditionExpression: "attribute_not_exists(id)",
    };

    await documentClient.send(new PutCommand(params));
    return helper.respond(201, note);
  } catch (err) {
    console.log(err);
    return helper.respond(500, err.message);
  }
};
