const pad = (value: number) => value.toString().padStart(10, "0");

const escapeText = (text: string) =>
  text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

export const buildSimplePdf = (title: string, sections: Array<{ heading: string; lines: string[] }>) => {
  const contentLines: string[] = [];
  contentLines.push("BT /F1 18 Tf 72 750 Td (" + escapeText(title) + ") Tj ET");
  let y = 720;
  sections.forEach((section) => {
    contentLines.push(`BT /F1 14 Tf 72 ${y} Td (${escapeText(section.heading)}) Tj ET`);
    y -= 20;
    section.lines.forEach((line) => {
      contentLines.push(`BT /F1 11 Tf 72 ${y} Td (${escapeText(line)}) Tj ET`);
      y -= 14;
    });
    y -= 10;
    if (y < 80) {
      contentLines.push("BT /F1 11 Tf 72 60 Td (Continued...) Tj ET");
      y = 720;
    }
  });
  const contentStream = contentLines.join("\n");
  const objects: string[] = [];
  const addObject = (body: string) => {
    objects.push(body);
    return objects.length;
  };

  addObject("<< /Type /Catalog /Pages 2 0 R >>");
  addObject("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  addObject("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>");
  addObject(`<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream`);
  addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((body, index) => {
    const objStr = `${index + 1} 0 obj\n${body}\nendobj\n`;
    offsets.push(pdf.length);
    pdf += objStr;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i < offsets.length; i++) {
    const entry = offsets[i] ?? 0;
    pdf += `${pad(entry)} 00000 n \n`;
  }
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf, "utf-8");
};
