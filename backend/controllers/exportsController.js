import fs from "fs";
import path from "path";
import archiver from "archiver";

export const exportProject = async (req, res) => {
  try {
    const { data, framework } = req.body;

    const projectId = Date.now().toString();
    const outputPath = path.join("exports", projectId);
    fs.mkdirSync(outputPath, { recursive: true });

    if (framework === "html") {
      generateHTMLProject(data, outputPath);
    }

    if (framework === "react") {
      generateReactProject(data, outputPath);
    }

    if (framework === "angular") {
      generateAngularProject(data, outputPath);
    }

    const zipPath = `${outputPath}.zip`;

    await zipFolder(outputPath, zipPath);

    return res.json({
      success: true,
      downloadUrl: `/downloads/${projectId}.zip`
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
};