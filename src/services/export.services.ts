import AppDataSource from "../data-source";
import { User } from "../models/user";
import { Parser } from "json2csv";
import PDFDocument from "pdfkit";
import fs from "fs";

class ExportService {
  static async getUserById(id: string) {
    const userRepository = AppDataSource.getRepository(User);
    return userRepository.findOne({ where: { id } });
  }

  static generateCSV(users: User[]): string {
    const json2csvParser = new Parser();
    return json2csvParser.parse(users);
  }

  static generatePDF(users: User[]): Buffer {
    const doc = new PDFDocument();
    const filePath = "users.pdf";
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    users.forEach((user) => {
      doc.text(`ID: ${user.id}`);
      doc.text(`Name: ${user.name}`);
      doc.text(`Email: ${user.email}`);
      doc.moveDown();
    });

    doc.end();

    return fs.readFileSync(filePath);
  }
}

export default ExportService;
