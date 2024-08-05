import AppDataSource from "../data-source";
import { User } from "../models";
import { Parser } from "json2csv";
import PDFDocument from "pdfkit";
import { PassThrough } from "stream";

class exportService {
  static async getUserById(id: string) {
    const userRepository = AppDataSource.getRepository(User);
    return userRepository.findOne({ where: { id } });
  }

  static generateCSV(users: User[]): string {
    const json2csvParser = new Parser();
    return json2csvParser.parse(users);
  }

  static async generatePDF(users: User[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const stream = new PassThrough();
      const buffers: Buffer[] = [];

      doc.pipe(stream);

      stream.on("data", (chunk) => buffers.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(buffers)));
      stream.on("error", reject);

      users.forEach((user) => {
        doc.text(`ID: ${user.id}`);
        doc.text(`First Name: ${user.first_name}`);
        doc.text(`Last Name: ${user.last_name}`);
        doc.text(`Phone Number: ${user.phone}`);
        doc.text(`Email: ${user.email}`);
        doc.moveDown();
      });

      doc.end();
    });
  }
}

export { exportService };
