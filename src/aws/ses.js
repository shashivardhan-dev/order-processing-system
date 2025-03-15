// ses-service.js (SES service implementation)
import { SendEmailCommand } from "@aws-sdk/client-ses";
import logger from "../logger/index.js";
import config from "../config/index.js";

class SesService {
  constructor(sesClient) {
    this.sesClient = sesClient;
  }

  async sendOrderConfirmationEmail( order) {
    const params = {
      Destination: {
        ToAddresses: [order.userId.email],
      },
      Message: {
        Body:{
            Text: { 
                Data: `Order ${order._id?.toString()} is ${order.status}\nItems:\n${order.items.map(item => `${item.productId} - ${item.quantity} x $${item.price}`).join('\n')}\nTotal: $${order.items.reduce((total, item) => total + item.price * item.quantity, 0)}`
            },
            Html: {
                Data: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.5; color: #333;">
                        <h2 style="color: #4CAF50;">Your Order Status</h2>
                        <p><strong>Order ID:</strong> ${order._id?.toString()}</p>
                        <h3>Items Purchased:</h3>
                        <ul>
                            ${order.items.map(item => `<li>${item.productId} (x${item.quantity}) - $${(item.pricePerItem * item.quantity).toFixed(2)}</li>`).join('')}
                        </ul>
                        <p><strong>Total Amount:</strong> $${order.totalAmount}</p>
                        <p><strong>Status:</strong> 
                            <span style="color: ${order.status === 'Processed' ? '#4CAF50' : '#F44336'};">
                                ${order.status}
                            </span>
                        </p>
                        <p>Thank you for shopping with us!</p>
                    </div>
                `
            }
        },
        Subject: { Data: "Your Order Status" },
      },
      Source: config.sesSenderEmail,
    };

    try {
      const command = new SendEmailCommand(params);
      const a =  await this.sesClient.send(command);
   logger.info(`Email sent for order: ${order._id?.toString()}`);
    } catch (error) {
      logger.error("Error while sending email", error);
    }
  }
}

export default SesService;