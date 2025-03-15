// sqs-service.js (SQS service implementation)
import {
    SendMessageCommand,
    ReceiveMessageCommand,
    DeleteMessageCommand,
  } from "@aws-sdk/client-sqs";
  import logger from "../logger/index.js";
  
  class SqsService {
    constructor(sqsClient, sqsUrl) {
      this.sqsClient = sqsClient;
      this.sqsUrl = sqsUrl;
    }
  
    async sendMessage(orderId) {
      const params = {
        MessageBody: JSON.stringify({ orderId }),
        QueueUrl: this.sqsUrl,
        MessageGroupId: "order",
      };
  
      try {
        const command = new SendMessageCommand(params);
        const data = await this.sqsClient.send(command);
        return data;
      } catch (error) {
        logger.error("Error while sending message", error);
      }
    }
  
    async receiveMessage() {
      const params = {
        QueueUrl: this.sqsUrl,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 5,
      };
  
      try {
        const command = new ReceiveMessageCommand(params);
        const data = await this.sqsClient.send(command);
        if (!data.Messages) return [];
        return data.Messages;
      } catch (error) {
        logger.error("Error while receiving message", error);
      }
    }
  
    async deleteMessage(receiptHandle) {
      const params = {
        QueueUrl: this.sqsUrl,
        ReceiptHandle: receiptHandle,
      };
  
      try {
        const command = new DeleteMessageCommand(params);
        const data = await this.sqsClient.send(command);
        return data;
      } catch (error) {
        logger.error("Error while deleting message", error);
      }
    }
  }
  
  export default SqsService;