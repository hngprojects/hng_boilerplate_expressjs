import Paystack from "paystack";
import { v4 as uuidv4 } from "uuid";
import config from "../../config";
import { Payment, Organization, BillingPlan } from "../../models";
import AppDataSource from "../../data-source";

const paystack = new Paystack(config.PAYSTACK_SECRET_KEY);

export const initializePayment = async (customerDetails: {
  organization_id?: string;
  plan_id?: string;
  full_name?: string;
  billing_option?: "monthly" | "yearly";
  redirect_url?: string;
}): Promise<object> => {
  try {
    const tx_ref = `pst-${uuidv4()}-${Date.now()}`;
    // Fetch billing plan and organization details
    const billingPlanRepository = AppDataSource.getRepository(BillingPlan);
    const organizationRepository = AppDataSource.getRepository(Organization);

    const billingPlan = await billingPlanRepository.findOneBy({
      id: customerDetails.plan_id,
    });
    const organization = await organizationRepository.findOneBy({
      id: customerDetails.organization_id,
    });

    if (!billingPlan || !organization) {
      throw new Error("Billing plan or organization not found");
    }

    const payload = {
      email: organization?.email || "hng@gmail.com",
      amount: (billingPlan?.price || 1000) * 100, // Paystack expects amount in kobo
      currency: "NGN",
    };

    const response = await paystack.transaction.initialize(payload);

    await saveTransactionToDatabase({
      ...customerDetails,
      description: `Payment of ${billingPlan.price || 1000} ${billingPlan.currency || "NGN"} via Paystack`,
      metadata: { tx_ref, paystack_response: response },
      paymentServiceId: response.data.reference,
      currency: billingPlan.currency || "NGN",
      amount: billingPlan.price || 1000,
      status: "pending",
      provider: "paystack",
    });

    return {
      status: 200,
      message: "Payment initiated successfully",
      data: {
        payment_url: response.data.authorization_url,
      },
    };
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
