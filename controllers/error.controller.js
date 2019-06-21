exports.get404 = (req, res, next) => {
  res.status(404).render("errors/404", {
    pageContent: "Error 404: Page not found",
    path: "/404"
  });
};

exports.get500 = (err, req, res, next) => {
  res.render("errors/500", {
    pageContent: "Error 500: Internal server error",
    path: "/500"
  });
};
