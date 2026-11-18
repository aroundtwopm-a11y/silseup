/** 15000 → "15,000원" */
export const won = (n: number) => `${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}원`;

/** 15000 → "월 15,000원" */
export const monthlyWon = (n: number) => `월 ${won(n)}`;
