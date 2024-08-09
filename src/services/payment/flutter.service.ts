import Flutterwave from "flutterwave-node-v3";
import { v4 as uuidv4 } from "uuid";
import config from "../../config";
import { Payment } from "../../models";
import AppDataSource from "../../data-source";

// Initialize Flutterwave
const flw = new Flutterwave(
  config.FLW_PUBLIC_KEY || "mock",
  config.FLW_SECRET_KEY || "mock",
);

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
    const payload = {
      ...detailsWithoutUserId,
      tx_ref,
      enckey: config.FLW_ENCRYPTION_KEY,
    };
    const response = await flw.Charge.card(payload);

    await saveTransactionToDatabase({
      ...customerDetails,
      description: `Payment of ${detailsWithoutUserId.amount} ${detailsWithoutUserId.currency} via Flutterwave`,
      metadata: { tx_ref, flutterwave_response: response },
      // status: response.data.status,
      id: response.data.metadata.data.id,
      status: "completed",
      provider: "flutterwave",
    });
    // console.log(response);
    return response;
  } catch (error) {
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
    const transactionIdNumber = Number(transactionId);
    const response = await flw.Transaction.verify({ id: transactionIdNumber });

    const paymentStatus =
      response.data.status === "successful" ? "completed" : "failed";
    await updatePaymentStatus(transactionIdNumber, paymentStatus);

    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
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
  await paymentRepository.save(transactionDetails);
}

/**
 * Update the payment status in the database.
 *
 * @param {string} transactionId - The transaction ID to update.
 * @param {'completed' | 'failed'} status - The new status of the payment.
 */
async function updatePaymentStatus(
  transactionIdNumber: number,
  status: "completed" | "failed",
): Promise<void> {
  const paymentRepository = AppDataSource.getRepository(Payment);
  await paymentRepository
    .createQueryBuilder()
    .update(Payment)
    .set({ status })
    .where(`metadata->'data'->>'id' = :transactionIdNumber`, {
      transactionIdNumber,
    })
    .execute();
}
