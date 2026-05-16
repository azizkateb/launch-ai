import path from "path";
import { fileURLToPath } from "url";
import { generateHTMLProject } from "./html.js";
import { generateReactProject } from "./react.js";
import { generateAngularProject } from "./angular.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const FRAMEWORKS = {
  html: {
    name: "html",
    generator: generateHTMLProject,
    folderName: (timestamp) => `html-${timestamp}`,
  },
  react: {
    name: "react",
    generator: generateReactProject,
    folderName: (timestamp) => `react-${timestamp}`,
  },
  angular: {
    name: "angular",
    generator: generateAngularProject,
    folderName: (timestamp) => `angular-${timestamp}`,
  },
};

export async function generateProject(data, framework) {
  try {
    // Validate framework
    if (!FRAMEWORKS[framework]) {
      throw new Error(`Unsupported framework: ${framework}. Supported: ${Object.keys(FRAMEWORKS).join(", ")}`);
    }

    // Validate data
    if (!data || typeof data !== "object") {
      throw new Error("Invalid data: must be a non-null object");
    }

    // Create unique folder
    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2, 8);
    const folderName = `${FRAMEWORKS[framework].folderName(timestamp)}-${random}`;

    // Use backend/public/exports or system temp
    const baseDir = path.join(process.cwd(), "public", "exports");
    const outputDir = path.join(baseDir, folderName);

    console.log(`Generating ${framework} project in ${outputDir}`);

    // Call framework-specific generator
    const frameworkConfig = FRAMEWORKS[framework];
    await frameworkConfig.generator(data, outputDir);

    console.log(`Successfully generated ${framework} project at ${outputDir}`);

    return {
      framework,
      folderPath: outputDir,
      folderName,
      timestamp,
    };
  } catch (error) {
    console.error("Project generation error:", error);
    throw error;
  }
}

export function getSupportedFrameworks() {
  return Object.keys(FRAMEWORKS);
}
