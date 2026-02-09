import type { Transaction_t } from "../schema";

export const downloadTransaction = (transaction: Transaction_t ) => {
  const filename = `transaction_${transaction.date.toISOString().split('T')[0]}_${crypto.randomUUID()}.json`;
  const jsonString = JSON.stringify(transaction);
  const blob = new Blob([jsonString], {type: "application/json"});
  const file = new File([blob], filename, {type: 'application/json' });

  if (navigator.share && navigator.canShare({ files: [file] })) {
    navigator.share({
      files: [file],
      title: 'Transaction'
    }).catch((err) => {
      console.log(`An error occurred ${err}. Continuing with file download.`)
      downloadFile(blob, filename);
    });
  } else {
    downloadFile(blob, filename);
  }
}


const downloadFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
