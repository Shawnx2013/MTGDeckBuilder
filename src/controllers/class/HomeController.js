const Controller = require('./Controller.js');

class HomeController extends Controller{
    constructor(service){
        super(service);
    }
    async index(req,res){
        const params = Object.keys(req.query);
        if(params.length > 0) {
            const results = await this.service.search(req.query);
            res.render('index', {session:req.session,search:results});
        }else{
            res.render('index', {session:req.session,search:false});
        }
    }
}
module.exports = HomeController;