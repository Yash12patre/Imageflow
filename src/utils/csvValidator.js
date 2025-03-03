
export const validateCSV = (row) => {
  return (
    row['S. No.'] &&
    row['Product Name'] &&
    row['Input Image Urls']
  );
};