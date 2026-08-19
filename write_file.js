const fs = require("fs");
const filePath = process.argv[2];
const content = process.argv.slice(3).join(" ");
fs.writeFileSync(filePath, content, "utf8");
console.log("Written: " + filePath);
