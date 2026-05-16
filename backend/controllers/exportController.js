import { generateProject, getSupportedFrameworks } from "../services/export/generator.js";
import { zipFolder, cleanupFolder } from "../services/export/zip.js";
import path from "path";
import fs from "fs";

const SERVER_URL = process.env.SERVER_URL || "https://launch-ai.onrender.com";

export const downloadProject = async (req, res) => {
  let folderPath = null;

  try {
    const { data, framework } = req.body;

    // Validate request
    if (!data) {
      return res.status(400).json({
        success: false,
        error: "Missing required field: data",
      });
    }

    if (!framework) {
      return res.status(400).json({
        success: false,
        error: `Missing required field: framework. Supported: ${getSupportedFrameworks().join(", ")}`,
      });
    }

    if (!getSupportedFrameworks().includes(framework)) {
      return res.status(400).json({
        success: false,
        error: `Unsupported framework: ${framework}. Supported: ${getSupportedFrameworks().join(", ")}`,
      });
    }

    // Generate project
    console.log(`Generating ${framework} export for business type: ${data?.businessType}`);
    const generationResult = await generateProject(data, framework);
    folderPath = generationResult.folderPath;

    // Create ZIP
    console.log(`Creating ZIP archive for ${framework} project`);
    const zipDir = path.join(process.cwd(), "public", "exports");
    const zipResult = await zipFolder(folderPath, zipDir);

    // Construct download URL
    const downloadUrl = `${SERVER_URL}/exports/${zipResult.zipFileName}`;

    console.log(`Export complete: ${zipResult.zipFileName} (${zipResult.size} bytes)`);

    return res.status(200).json({
      success: true,
      framework,
      downloadUrl,
      fileName: zipResult.zipFileName,
      size: zipResult.size,
    });
  } catch (error) {
    console.error("Export error:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Failed to generate export",
    });
  } finally {
    // Cleanup source folder if generation was attempted
    if (folderPath) {
      setImmediate(async () => {
        try {
          await cleanupFolder(folderPath);
          console.log(`Cleaned up temporary folder: ${folderPath}`);
        } catch (error) {
          console.warn(`Failed to cleanup: ${error.message}`);
        }
      });
    }
  }
};

export const listFrameworks = (req, res) => {
  res.json({
    frameworks: getSupportedFrameworks(),
    description: "Supported export frameworks",
  });
};

export const exportStatus = (req, res) => {
  // Check if exports directory exists and has files
  const exportsDir = path.join(process.cwd(), "public", "exports");

  let files = [];
  if (fs.existsSync(exportsDir)) {
    files = fs
      .readdirSync(exportsDir)
      .filter((f) => f.endsWith(".zip"))
      .map((f) => ({
        name: f,
        path: `/exports/${f}`,
        size: fs.statSync(path.join(exportsDir, f)).size,
      }));
  }

  res.json({
    exportsDir,
    files,
    count: files.length,
  });
};
