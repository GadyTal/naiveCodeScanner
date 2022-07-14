import { Project } from "ts-morph";
import type { SourceFile } from "ts-morph";
import { naiveScannerConfig } from "./config/naiveScannerConfig.consts";

interface NaiveScannerParams {
  extSourcesFilePath: string;
  sinksFilesPath: string;
  scannedAppTsConfigPath: string;
  scannedAppPath: string;
}

// TODO - make extSourcesFilePath and sinksFilesPath arrays and change the logic accordingly
export const naiveScan = (params: NaiveScannerParams) => {
  const {
    extSourcesFilePath,
    sinksFilesPath,
    scannedAppTsConfigPath,
    scannedAppPath,
  } = params;

  // Init ts-morph project
  const project = new Project({
    tsConfigFilePath: scannedAppTsConfigPath,
    skipAddingFilesFromTsConfig: true,
  });

  // add typescript sources files - can be done by searching only for store directory files
  const appSourceFiles: SourceFile[] =
    project.addSourceFilesAtPaths(scannedAppPath);

  // get files imported lambda - externalSources
  const filesImportedLambda: SourceFile[] = appSourceFiles.filter(
    (appSourceFile) =>
      !appSourceFile.isInNodeModules() &&
      appSourceFile.getImportDeclaration(extSourcesFilePath)
  );

  // get files imported lambda - externalSources and import DynamoDBClient - sink
  const apiHandlersUsingLambda: SourceFile[] = filesImportedLambda.filter(
    (fileImportedLambda) =>
      !fileImportedLambda.getImportDeclaration((importDeclaration) =>
        importDeclaration.getText().includes(sinksFilesPath)
      )
  );

  // Print API filesNames starting the flow to the store
  apiHandlersUsingLambda.forEach((apiHandler) => {
    console.log(apiHandler.getFilePath());
  });

  // Additional task
  // Added get-product-by-name.ts handler that using ScanCommand for selecting name to retrieve
  // attacker can manipulate by sending other scanOptions with the request
  // e.g - name"}],"ComparisonOperator": "GT","AttributeValueList":[{"S":*
  // it will be retrieve all data in the table
  // Solution: get name property by object, parse it and filter non-conventional names or dangerous chars by regex.
};

// Play
naiveScan({
  extSourcesFilePath: naiveScannerConfig.AWS_LAMBDA_IMPORT_PATH,
  sinksFilesPath: naiveScannerConfig.DYNAMIC_DB_CLIENT_IMPORT_PATH,
  scannedAppTsConfigPath: naiveScannerConfig.SERVERLESS_TS_APP_PATH,
  scannedAppPath: naiveScannerConfig.APP_FILES_PATH,
});
