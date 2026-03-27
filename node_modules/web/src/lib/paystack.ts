/**
 * Mock Paystack integration for Workars MVP
 */
export const initiatePayment = async (amount: number, email: string, metadata: any) => {
  console.log(`[Paystack] Initiating payment of N${amount} for ${email}`, metadata);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate success
  return {
    status: 'success',
    reference: `WKRS-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    message: 'Approved'
  };
};

export const verifyPayment = async (reference: string) => {
  console.log(`[Paystack] Verifying payment reference: ${reference}`);
  return true;
};
