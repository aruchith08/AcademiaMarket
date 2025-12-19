
export const calculateEstimation = (pages: number, format: string, deadline: string, basePricePerPage: number = 10) => {
  const basePrice = pages * basePricePerPage;
  
  // No price difference for formats as per user request
  const formatMultiplier = 1.0;
  
  // Urgency Calculation remains as it handles deadline priority
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const diffHours = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  let urgencyFee = 0;
  if (diffHours > 0) {
    if (diffHours < 24) urgencyFee = 100;
    else if (diffHours < 72) urgencyFee = 50;
  }
  
  const total = (basePrice * formatMultiplier) + urgencyFee;
  
  return {
    base: Math.round(basePrice * formatMultiplier),
    urgency: urgencyFee,
    total: Math.round(total),
    details: `Standard Rate (₹${basePricePerPage}/pg x ${pages} pages) + ₹${urgencyFee} urgency fee.`
  };
};
