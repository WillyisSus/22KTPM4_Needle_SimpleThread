let models = require("./models");
models.sequelize.sync().then((results) => {
  console.log(results);
  console.log("tables created!");
});
