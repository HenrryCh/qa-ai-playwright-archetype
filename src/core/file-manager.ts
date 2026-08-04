import * as fs from "fs";
import * as path from "path";

export class FileManager {

  saveTest(fileName: string, content: string): string {

    const folder = path.join(process.cwd(), "tests", "generated");

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    const filePath = path.join(folder, fileName);

    fs.writeFileSync(filePath, content, "utf8");

    return filePath;
  }

}