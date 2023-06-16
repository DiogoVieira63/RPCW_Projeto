var express = require("express");
var router = express.Router();
var jsonFile = require("jsonfile");
var fs = require("fs");

const url = "mongodb://127.0.0.1/PGRE";
const Curso = require("../controllers/curso");

const ObjectId = require("mongoose").Types.ObjectId;
var jwt = require('jsonwebtoken');

const Permission = require("./utils/permission");
const verifyProfessor = Permission.professor;
const verifyJWT = Permission.token;
const verifyCourse = Permission.course;



router.post("/create"/*,verifyJWT,verifyProfessor*/,function (req, res, nxt) {
    var curso = req.body;
    var username = "EDU";//user.username;req.
    Curso.insert(curso,username)
    .then((curso) => {
        res.status(201).jsonp(curso);
    }).catch((err) => {
        nxt(err);
    });
});

// removeStudent
router.delete("/:curso/removealuno/:studentid",/*verifyJWT,verifyRegente*/function (req, res, nxt) {
  // remover metas que apenas pertencem a este curso, depois
  Curso.removeAluno(req.params.curso, req.params.studentid)
  .then((curso) => {
      res.status(201).jsonp(curso);
  }).catch((err) => {
      nxt(err);
  });
});

router.delete("/:curso/removeprofessor/:profid",/*verifyJWT,verifyRegente*/function (req, res, nxt) {
  // remover metas que apenas pertencem a este curso, depois
  Curso.removeProfessor(req.params.curso, req.params.profid)
  .then((curso) => {
      res.status(201).jsonp(curso);
  }).catch((err) => {
      nxt(err);
  });
});


router.delete("/remove/:curso",/*verifyJWT,verifyRegente*/function (req, res, nxt) {
  // remover metas que apenas pertencem a este curso, depois
  Curso.removeCurso(req.params.curso)
  .then((curso) => {
      res.status(201).jsonp(curso);
  }).catch((err) => {
      nxt(err);
  });
});

// verificar se é prof?
router.post("/:curso/addpost"/*,verifyJWT,verifyProfessor,verifyCourse*/,function (req, res, nxt) {
  var curso = req.params.curso;
  var post = req.body;
  // var username = req.user.username;
  Curso.addPost(curso,post)
  .then((curso) => {
      res.status(201).jsonp(curso);
  }).catch((err) => {
      nxt(err);
  });
});




router.post("/:curso/:post/addcomment"/*,verifyJWT,verifyCourse*/,function (req, res, nxt) {
  var curso = req.params.curso;
  var post = req.params.post;
  var comment = req.body.comment;
  // var username = req.user.username;
  Curso.addCommentPost(curso,post,comment)
  .then((curso) => {
      res.status(201).jsonp(curso);
  }).catch((err) => {
      nxt(err);
  });
});

// VERIFICAR SE USER FEZ O COMENTARIO
router.post("/:curso/:post/:idcomment/editcomment"/*,verifyJWT,verifyCourse*/,function (req, res, nxt) {
  var curso = req.params.curso;
  var post = req.params.post;
  var idcomment = req.params.idcomment;

  var comment = req.body.comment;
  // var username = req.user.username;
  Curso.editCommentPost(curso,post,idcomment,comment)
  .then((curso) => {
      res.status(201).jsonp(curso);
  }).catch((err) => {
      nxt(err);
  });
});


router.delete("/:curso/:post/:idcomment/removecomment"/*,verifyJWT,verifyCourse*/,function (req, res, nxt) {
  var curso = req.params.curso;
  var post = req.params.post;
  var idcomment = req.params.idcomment;
  // var username = req.user.username;
  Curso.removeCommentPost(curso,post,idcomment)
  .then((curso) => {
      res.status(201).jsonp(curso);
  }).catch((err) => {
      nxt(err);
  });
});

router.post("/:curso/:post/edit"/*,verifyJWT,verifyProfessor*/,function (req, res, nxt) {
  var curso = req.params.curso;
  var idpost = req.params.post;
  var post = req.body;
  // var username = req.user.username;
  Curso.editPost(curso,idpost,post)
  .then((curso) => {
      res.status(201).jsonp(curso);
  }).catch((err) => {
      nxt(err);
  });
});

router.get("/",verifyJWT,function (req, res) {
    Curso.getAll().then((data) => {
        console.log("Cursos",data);  
        res.jsonp(data);
    }).catch((err) => {
        console.log(err);
        res.status(500).jsonp({error: err});
    });
});

module.exports = router;
