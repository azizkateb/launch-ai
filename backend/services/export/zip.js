import archiver from "archiver";
import fs from "fs";
import path from "path";

export async function zipFolder(folderPath, outputDir = null) {
  return new Promise((resolve, reject) => {
    try {
      // Validate folder exists
      if (!fs.existsSync(folderPath)) {
        return reject(new Error(`Folder not found: ${folderPath}`));
      }

      // Use output directory or temp location
      const zipDir = outputDir || path.dirname(folderPath);
      const zipFileName = `project_${Date.now()}.zip`;
      const zipPath = path.join(zipDir, zipFileName);

      // Ensure output directory exists
      fs.mkdirSync(zipDir, { recursive: true });

      // Create write stream
      const output = fs.createWriteStream(zipPath);
      const archive = archiver("zip", { zlib: { level: 9 } });

      // Handle stream errors
      output.on("error", (err) => {
        reject(new Error(`Failed to write zip: ${err.message}`));
      });

      archive.on("error", (err) => {
        reject(new Error(`Failed to create archive: ${err.message}`));
      });

      // Pipe archive to file
      archive.pipe(output);

      // Get the folder name for the root directory in zip
      const folderName = path.basename(folderPath);

      // Add folder contents to archive
      archive.directory(folderPath, folderName);

      // Finalize archive
      archive.finalize();

      // Resolve when finished
      output.on("close", () => {
        resolve({
          zipPath,
          zipFileName,
          size: archive.pointer(),
        });
      });
    } catch (error) {
      reject(new Error(`ZIP generation error: ${error.message}`));
    }
  });
}

export async function cleanupFolder(folderPath) {
  try {
    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true, force: true });
    }
  } catch (error) {
    console.warn(`Failed to cleanup folder ${folderPath}:`, error.message);
  }
}
