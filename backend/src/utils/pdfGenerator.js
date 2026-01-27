import PDFDocument from 'pdfkit';

export const generateMonthlyReportPdf = ({ res, user, month, expenses, summary }) => {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="expense-report-${month}.pdf"`);

  doc.pipe(res);

  doc
    .fontSize(20)
    .text('Expense Tracker - Monthly Report', { align: 'center' })
    .moveDown();

  doc.fontSize(12).text(`User: ${user.name} (${user.email})`);
  doc.text(`Month: ${month}`);
  doc.text(`Generated at: ${new Date().toLocaleString()}`);
  doc.moveDown();

  doc.fontSize(14).text('Summary', { underline: true });
  doc.fontSize(12).text(`Total Spent: $${summary.totalAmount.toFixed(2)}`);

  doc.moveDown().fontSize(12).text('By Category:');
  summary.byCategory.forEach((item) => {
    doc.text(`- ${item.category}: $${item.totalAmount.toFixed(2)}`);
  });

  doc.moveDown();
  doc.fontSize(14).text('Expenses', { underline: true }).moveDown(0.5);

  expenses.forEach((exp) => {
    doc
      .fontSize(12)
      .text(
        `${exp.date.toISOString().slice(0, 10)} - ${exp.title} - ${exp.category} - $${exp.amount.toFixed(2)}`
      );
    if (exp.description) {
      doc.fontSize(10).text(`  ${exp.description}`);
    }
  });

  doc.end();
};
