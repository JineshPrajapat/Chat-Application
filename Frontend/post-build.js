const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, 'build', 'static', 'js');
const mainJsFile = fs.readdirSync(buildDir).find(file => file.startsWith('main') && file.endsWith('.js'));
const mainMapFile = fs.readdirSync(buildDir).find(file => file.startsWith('main') && file.endsWith('.js.map'));

if (mainJsFile && mainMapFile) {
    const mainJsFilePath = path.join(buildDir, mainJsFile);
    const mainMapFilePath = path.join(buildDir, mainMapFile);
    
    const newJsFileName = `787.${mainJsFile.split('.')[1]}.chunk.js`;
    const newMapFileName = `787.${mainJsFile.split('.')[1]}.chunk.js.map`;

    const newJsFilePath = path.join(buildDir, newJsFileName);
    const newMapFilePath = path.join(buildDir, newMapFileName);

    // Read the content of the main JS file and the map file
    const jsContent = fs.readFileSync(mainJsFilePath, 'utf-8');
    const mapContent = fs.readFileSync(mainMapFilePath, 'utf-8');

    // Write the content to the new files
    fs.writeFileSync(newJsFilePath, jsContent);
    fs.writeFileSync(newMapFilePath, mapContent);

    console.log(`Duplicated ${mainJsFile} to ${newJsFileName}`);
    console.log(`Duplicated ${mainMapFile} to ${newMapFileName}`);
} else {
    console.error('Main JS file or map file not found.');
}
