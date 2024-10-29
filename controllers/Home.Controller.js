const homeController = {};

homeController.index = (req, res) => {
    res.render('dashboard/home');
};

module.exports = homeController;