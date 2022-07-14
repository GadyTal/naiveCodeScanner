// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Nameentifier: MIT-0
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDbStore } from "../store/dynamodb/dynamodb-store";
import { ProductStore } from "../store/ProductStore";

const store: ProductStore = new DynamoDbStore();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const Name = event.pathParameters!.Name;
  if (Name === undefined) {
    console.warn("Missing 'Name' parameter in path");
    return {
      statusCode: 400,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: "Missing 'Name' parameter in path" }),
    };
  }
  try {
    console.info(`Fetching product ${Name}`);
    const result = await store.getProductByNameWithInjection(Name);
    if (!result) {
      console.warn(`No product with Name: ${Name}`);
      return {
        statusCode: 404,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: "Product not found" }),
      };
    }

    console.info(result);

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(error),
    };
  }
};
