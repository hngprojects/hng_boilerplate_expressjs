import Flutterwave from "flutterwave-node-v3";
import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";
import config from "../../config";
import { Payment } from "../../models";
import AppDataSource from "../../data-source";
import { User } from "../../models";
import { Organization } from "../../models";

// Initialize Flutterwave
// const flw = new Flutterwave(config.FLW_PUBLIC_KEY, config.FLW_SECRET_KEY);
const flw = new Flutterwave("mockKey", "mockkey");

interface CustomerDetails {
  card_number: string;
  cvv: string;
  expiry_month: string;
  expiry_year: string;
  email: string;
  fullname: string;
  phone_number: string;
  currency: string;
  amount: number;
  payer_id: string;
  payer_type: "user" | "organization";
  userId: string;
}

/**
 * Initialize a payment with Flutterwave.
 *
 * @param {CustomerDetails} customerDetails - The customer's payment details.
 * @returns {Promise<object>} - The initialization response from Flutterwave.
 */
export const initializePayment = async (
  customerDetails: CustomerDetails,
): Promise<object> => {
  try {
    const { userId, ...detailsWithoutUserId } = customerDetails; // Destructure to remove userId
    const tx_ref = `flw-${uuidv4()}-${Date.now()}`;
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(detailsWithoutUserId),
      config.FLW_ENCRYPTION_KEY,
    ).toString();
    const response = await flw.Charge.card({
      ...detailsWithoutUserId,
      tx_ref,
      enckey: config.FLW_ENCRYPTION_KEY,
    });

    await saveTransactionToDatabase({
      ...customerDetails,
      description: `Payment of ${detailsWithoutUserId.amount} ${detailsWithoutUserId.currency} via Flutterwave`,
      metadata: { tx_ref, flutterwave_response: response },
    });
    return response;
  } catch (error) {
    console.error("Error initializing payment:", error);
    throw error;
  }
};

/**
 * Verify a payment with Flutterwave.
 *
 * @param {string} transactionId - The transaction ID to verify.
 * @returns {Promise<object>} - The verification response from Flutterwave.
 */
export const verifyPayment = async (transactionId: string): Promise<object> => {
  try {
    const response = await flw.Transaction.verify({ id: transactionId });

    // Update the payment status in the database
    if (response.status === "successful") {
      await updatePaymentStatus(transactionId, "completed");
    } else {
      await updatePaymentStatus(transactionId, "failed");
    }

    return response;
  } catch (error) {
    console.error("Error verifying payment:", error);
    await updatePaymentStatus(transactionId, "failed");
    throw error;
  }
};

/**
 * Save transaction details to the database.
 *
 * @param {Partial<Payment>} transactionDetails - The details of the transaction to save.
 */
async function saveTransactionToDatabase(
  transactionDetails: Partial<Payment>,
): Promise<void> {
  const paymentRepository = AppDataSource.getRepository(Payment);
  await paymentRepository.save({
    ...transactionDetails,
    status: "pending",
    provider: "flutterwave",
  });
}

/**
 * Update the payment status in the database.
 *
 * @param {string} transactionId - The transaction ID to update.
 * @param {'completed' | 'failed'} status - The new status of the payment.
 */
async function updatePaymentStatus(
  transactionId: string,
  status: "completed" | "failed",
): Promise<void> {
  const paymentRepository = AppDataSource.getRepository(Payment);
  await paymentRepository.update({ id: transactionId }, { status });
}
