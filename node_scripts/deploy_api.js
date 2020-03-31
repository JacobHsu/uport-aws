const { argParse, run } = require("./helpers");

async function deployAPI() {
  const args = argParse();
  // await run("./node_modules/.bin/sls", [ "deploy", "-v", "-s", args.env ]);
  // npm install serverless -g
  await run("sls", [ "deploy", "-v", "-s", args.env ]);
}

deployAPI();
