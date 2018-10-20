var express = require("express");
var Usuario = require("./models/usuario");
var Evento = require("./models/eventos");
var Pdf= require("./models/pdf");

var passport = require("passport");
var acl = require("express-acl");

var multer=require("multer");
/*const upload=multer({
    dest:'expedientes/'
});*/
var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, 'Archivo/');
    },
    filename: function (req, file, callback) {
      callback(null, file.fieldname + '.pdf');
    }
  });
  var upload = multer({ storage : storage });
var router = express.Router();

acl.config({
    baseUrl:'/',
    defaultRole:'usuario',
    decodedObjectName:'usuario',
    roleSearchPath: 'usuario.role'
  
});

router.use((req, res, next) =>{
    res.locals.currentUsuario = req.usuario;
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    if(req.session.passport){
        if(req.usuario){
            req.session.role = req.usuario.role;
        } else {
            req.session.role = "usuario";
        }
    }
    console.log(req.session);
    next();
});

router.use(acl.authorize);

router.get("/", (req, res, next) =>{
    Usuario.find()
        .sort({ createdAt: "descending"})
        .exec((err, usuarios) => {
            if(err){
                return next(err);
            }
            res.render("index", {usuarios: usuarios});
        });
});

router.get("/usuarios/:username",(req,res,next) =>{
    Usuario.findOne({ username: req.params.username } , (err,usuario) => {
        if(err){
            return next(err);
        }
        if(!usuario){
            return next(404);
        }
        res.render("profile",{ usuario:usuario });
    });
});

router.get("/signup", (req, res) =>{
    res.render("signup");
});

router.post("/signup",(req, res, next)=>{
    var username = req.body.username;
    var password = req.body.password;
    var role = req.body.role;

    Usuario.findOne({ username: username}, (err, usuario) =>{
        if(err){
            return next(err);
        }
        if(usuario){
            req.flash("error", "El nombre de usuario ya esta ocupado");
            return res.redirect("/signup");
        }
        var newUsuario = new Usuario({
            username: username,
            password: password,
            role: role
        });
        newUsuario.save(next);
        return res.redirect("/");
    });
});



router.get("/addevent", (req, res) =>{
    res.render("addevent");
});
//
router.post("/addevent",(req, res, next)=>{
    var Categoria = req.body.Categoria;
    var Nombre = req.body.Nombre;
    var Localizacion = req.body.Localizacion;
    var fecha=req.body.fecha;
    var Boletos = req.body.Boletos;

    Evento.findOne({ Categoria: Categoria }, (err, evento) =>{
        if(err){
            return next(err);
        }
        var newEvento = new Evento({
            Categoria: Categoria,
            Nombre:Nombre,
            Localizacion:Localizacion,
            fecha: fecha,
            Boletos:Boletos
        });
        newEvento.save(next);
        return res.redirect("/eventos");
    });
});

router.get("/eventos", (req, res, next) =>{
    Evento.find()
        .exec((err, eventos) => {
            if(err){
                return next(err);
            }
            res.render("eventos", {eventos: eventos});
        });
});


router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", passport.authenticate("login",{
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}));

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});
/*router.get("/addExp",(req,res)=>{
    res.sendFile(__dirname+"/expedientes/archivo.txt");
});*/
router.get("/addArc", (req, res) => {
    res.render("addArc");
});

router.post("/addArc",upload.single('doc'),(req, res)=>
{
    return res.redirect("/");

});
router.get("/edit", ensureAuthenticated,(req,res) => {
    res.render("edit");
});

router.post("/edit", ensureAuthenticated, (req, res, next) => {
    req.usuario.username = req.body.username;
    req.usuario.save((err) => {
        if(err){
            next(err);
            return;
        }
        req.flash("info", "Perfil actualizado!");
        res.redirect("/edit");
    });
});


function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        next();
    } else{
        req.flash("info", "Necesitas iniciar sesión para poder ver esta sección");
        res.redirect("/login");
    }
}


module.exports = router;