export const calculatePaginationRange = (
  currentPage: number,
  totalPages: number,
  maxButtons: number = 5,
): { startPage: number; endPage: number } => {
  let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxButtons - 1);

  if (endPage - startPage < maxButtons - 1) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  return { startPage, endPage };
};
