import path from 'path';
import fs from 'fs/promises';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const pluginsDir = path.join(process.cwd(), 'components', 'plugins');
    const pluginList = [];
    
    const pluginFolders = await fs.readdir(pluginsDir);
    for (const folder of pluginFolders) {
      const manifestPath = path.join(pluginsDir, folder, 'manifest.json');
      const manifestContent = await fs.readFile(manifestPath, 'utf-8');
      const manifest = JSON.parse(manifestContent);
      pluginList.push(manifest);
    }
    
    res.status(200).json(pluginList);
  } catch (error) {
    console.error('Error loading plugins:', error);
    res.status(500).json({ message: 'Error loading plugins' });
  }
} 