import type { Transaction_t } from "../schema";

export const downloadTransaction = (transaction: Transaction_t ) => {
    const jsonString = JSON.stringify(transaction);
    const blob = new Blob([jsonString], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transaction_${transaction.date.toISOString().split('T')[0]}_${crypto.randomUUID()}.json`
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
