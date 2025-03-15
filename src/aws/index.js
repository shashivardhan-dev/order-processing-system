// aws-factory.js (main file with credentials and factory)
import { SESClient } from "@aws-sdk/client-ses";
import { SQSClient } from "@aws-sdk/client-sqs";
import SesService from "./ses.js";
import SqsService from "./sqs.js";
import config from "../config/index.js";

class AwsServiceFactory {
  constructor() {
    this.region = config.awsRegion; 
    this.sesClient = new SESClient({ region: this.region });
    this.sqsClient = new SQSClient({ region: this.region });
    this.sqsUrl = config.sqsUrl; 
  }

  createSesService() {
    return new SesService(this.sesClient);
  }

  createSqsService() {
    return new SqsService(this.sqsClient, this.sqsUrl);
  }
}

const awsServiceFactory = new AwsServiceFactory();
export default awsServiceFactory;
