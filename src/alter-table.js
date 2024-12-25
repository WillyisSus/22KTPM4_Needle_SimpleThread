let models = require("./models");
models.sequelize.sync({ alter: true }).then((results) => {
    console.log(results);
    console.log("tables created!");
});
