var home        = require('../controllers/home'),
    express     = require('express'),
    homeRoutes;

homeRoutes = function () {
    var router = express.Router();

    /**
     * @api {get} / Index of 4l Trophy
     * @apiName index
     * @apiGroup core
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     */
    router.get('/', home.index);

    return router;
};

/*
  Expose homeRoutes
 */
module.exports = homeRoutes;