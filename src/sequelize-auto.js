const env = process.env.NODE_ENV || "development";
const config = require("./config/config.json")[env];

const SequelizeAuto = require("sequelize-auto");
const auto = new SequelizeAuto(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: config.dialect,
        port: config.port,
        directory: "./models", // where to write files
        lang: "es6", // ES6 CJS modules
        caseModel: "p", // convert PascalCase
        caseFile: "p", // file names created for each model use PascalCase.js
        singularize: true, // convert plural table names to singular model names
        additional: {
            timestamps: false, // the timestamp attributes (updatedAt, createdAt)
            // ...options added to each model
        },
    }
);

auto.run().then((data) => {
    console.log(data.tables); // table and field list
    console.log(data.foreignKeys); // table foreign key list
    console.log(data.indexes); // table indexes
    console.log(data.hasTriggerTables); // tables that have triggers
    console.log(data.relations); // relationships between models
    console.log(data.text); // text of generated models
});
