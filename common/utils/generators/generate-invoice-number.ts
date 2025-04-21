const generateInvoiceNumber = () => {
  const timestamp = Date.now().toString();
  const randomNumber = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0'); // 4-digit random number
  return `INV-${timestamp}-${randomNumber}`;
};

export {generateInvoiceNumber};
