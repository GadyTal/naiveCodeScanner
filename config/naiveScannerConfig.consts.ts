export const naiveScannerConfig: Record<string, string> = {
  AWS_LAMBDA_IMPORT_PATH: "aws-lambda",
  DYNAMIC_DB_CLIENT_IMPORT_PATH: "DynamoDBClient",
  SERVERLESS_TS_APP_PATH: "../serverless-typescript-demo/tsconfig.json",
  APP_FILES_PATH: "../serverless-typescript-demo/**/*{.d.ts,.ts}",
};
