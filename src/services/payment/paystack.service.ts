import Paystack from "paystack";
import { v4 as uuidv4 } from "uuid";
import config from "../../config";
import { Payment } from "../../models";
import AppDataSource from "../../data-source";

const paystack = new Paystack(config.PAYSTACK_SECRET_KEY);

interface CustomerDetails {
  email: string;
  amount: number;
  currency: string;
  //   userId: string;
}

export const initializePayment = async (
  customerDetails: CustomerDetails,
): Promise<object> => {
  try {
    // const { userId, ...detailsWithoutUserId } = customerDetails;
    const tx_ref = `pst-${uuidv4()}-${Date.now()}`;
    const payload = {
      email: customerDetails.email,
      amount: customerDetails.amount * 100, // Paystack expects amount in kobo
      currency: customerDetails.currency,
      reference: tx_ref,
    };

    const response = await paystack.transaction.initialize(payload);

    await saveTransactionToDatabase({
      ...customerDetails,
      description: `Payment of ${customerDetails.amount} ${customerDetails.currency} via Paystack`,
      metadata: { tx_ref, paystack_response: response },
      paymentServiceId: response.data.reference,
      status: "pending",
      provider: "paystack",
    });
    return response.data.authorization_url;
  } catch (error) {
    throw error;
  }
};

export const verifyPayment = async (reference: string): Promise<object> => {
  try {
    const response = await paystack.transaction.verify(reference);

    const paymentStatus =
      response.data.status === "success" ? "completed" : "failed";
    await updatePaymentStatus(reference, paymentStatus);

    return response;
  } catch (error) {
    throw error;
  }
};

const saveTransactionToDatabase = async (transactionData: any) => {
  const paymentRepository = AppDataSource.getRepository(Payment);
  const payment = paymentRepository.create(transactionData);
  await paymentRepository.save(payment);
};

const updatePaymentStatus = async (reference: string, status: string) => {
  const paymentRepository = AppDataSource.getRepository(Payment);
  const payment = await paymentRepository.findOneBy({ id: reference });
  if (payment) {
    payment.status = status as "pending" | "completed" | "failed";
    await paymentRepository.save(payment);
  }
};
