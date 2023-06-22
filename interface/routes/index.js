var express = require('express');
var router = express.Router();
var Dados = require('../controllers/dados');
var Auth = require('../controllers/auth');
var axios = require('axios');
var multer = require('multer');


const upload = multer({ dest: 'public/fileStore'  , 
  limits: {
    fileSize: process.env.MAX_SIZE,
  },
  fileFilter(req, file, cb) {
    if (!process.env.ALLOWED_TYPES.includes(file.mimetype)) {
      cb(new Error('File type not allowed'))
    }
    else{
      cb(null, true)
    }
  }});


/* GET home page. */
function checkLoggin(req, res, next) {
  if (req.cookies['token']) {
    Dados.getProfile(req.cookies['token']).then(dados => {
      //console.log("Dados",dados.data);
      req.user = dados.data.user;
      req.cursos = dados.data.cursos;
      req.noticias = dados.data.noticias;
      console.log("Noticias",req.noticias);

      next();
    }).catch(err => {
      console.log("Erro",err);
      res.redirect('/no_login');
    });
  }
  else{
    res.redirect('/no_login');
  }
}

router.get('/',checkLoggin, function(req, res, next) {
  console.log('Página Inicial');
  Dados.getMyCursos(req.cookies['token'])
    .then(dados => {
      //console.log("Cursos",dados.data);
      data =  new Date().toISOString().substring(0, 16)
      let notificacoes = req.noticias.notificacao;
      let notificacoesNaoLidas = 0;
      for (let i = 0; i < notificacoes.length; i++) {
        if (notificacoes[i].lida == false){
          notificacoesNaoLidas++;
        }
      }
      console.log("Notificações",notificacoesNaoLidas);
    
      res.render('pagina_inicial', { cursos: dados.data, data: data, titulo: "Meus Cursos", notificacoes: notificacoesNaoLidas});
    })
    .catch(err => res.render('error', {error: err}));
  // Dados.getAllFiles(req.cookies['token'])
  //   .then(dados => {
  //     //console.log(dados.data);
  //     let actions = dados.data.user.level == "professor";
  //     //console.log("Actions",actions);
  //     res.render('list', { files: dados.data.lista, user: dados.data.user, actions: actions});
  //   })
  //   .catch(err => res.render('error', {error: err}));
});


router.get('/cursos/form',checkLoggin, function(req, res, next) {
  res.render('cursoForm');
});

router.get('/cursos/:curso/files/upload',checkLoggin, function(req, res, next) {

  Dados.getTypesActives(req.cookies['token'])
    .then(dados => {
      console.log("Tipos",dados.data);
      res.render('fileForm',{curso: req.params.curso, types: dados.data});
    }).catch(err => 
      res.render('error', {error: err
      }));
});


router.post('/cursos/:curso/files/:idFile/rate',checkLoggin, function(req, res, next) {


  if (req.body.rating == ""){
    Dados.rateFileDelete(req.params.idFile,req.cookies['token']).then(dados => {
      res.redirect('/cursos/'+req.params.curso);
      //res.jsonp(dados.data);
    }).catch(err => {
      res.status(500).jsonp({error: err});
    });
  }
  else{
    let cookie = req.cookies['token'];
    let rating = req.body.rating;
    Dados.rateFile(req.params.idFile,rating,cookie).then(dados => {
      res.redirect('/cursos/'+req.params.curso);
      //res.jsonp(dados.data);
    }).catch(err => {
      res.status(500).jsonp({error: err});
    });
  }
});

router.get('/download/:filename',checkLoggin, function(req, res) {
  Dados.getOneDownload(req.params.filename,req.cookies['token']).then(dados => {
    console.log("Dados",dados.data.meta);
    res.download(__dirname + "/../public/fileStore/" + req.params.filename,dados.data.meta.name);
  }).catch(err => {
    res.status(500).jsonp({error: err});
  });
});

router.post('/cursos/:curso/files/:idFile/rate/edit',checkLoggin, function(req, res, next) {

  if (req.body.rating == ""){
    Dados.rateFileDelete(req.params.idFile,req.cookies['token']).then(dados => {
      res.redirect('/cursos/'+req.params.curso);
      //res.jsonp(dados.data);
    }).catch(err => {
      res.status(500).jsonp({error: err});
    });
  }
  else{
    let cookie = req.cookies['token'];
    let rating = req.body.rating;
    Dados.rateFileEdit(req.params.idFile,rating,cookie).then(dados => {
      res.redirect('/cursos/'+req.params.curso);
      //res.jsonp(dados.data);
    }).catch(err => {
      res.status(500).jsonp({error: err});
    });
}

});







function getArrayLevel(user,curso){
  if (user.level == "aluno"){
    return curso.alunos;
  }
  else if (user.level == "professor"){
    return curso.professores;
  }
}


router.get('/cursos',checkLoggin, function(req, res, next) {
  console.log(req.cookies['token'])
  Dados.getAllCursos(req.cookies['token'])
    .then(dados => {
      let data = dados.data;
      for (var i = 0; i < data.length; i++) {
        let array = getArrayLevel(req.user,data[i]);
        if (array.includes(req.user.username)){
          data[i].isInscrito = true;
        }
        else{
          data[i].isInscrito = false;
        }
      }
      date =  new Date().toISOString().substring(0, 16)
      res.render('listacursos', { cursos: dados.data, data: date, titulo: "Lista de Cursos"});
    })
    .catch(err => res.render('error', {error: err}));
  // Dados.getAllCursos(req.cookies['token'])
  //   .then(dados => {
  //     //console.log("Cursos",dados.data);
  //     data =  new Date().toISOString().substring(0, 16)
  //     res.render('listacursos', { cursos: dados.data, data: data});
  //   })
  //   .catch(err => res.render('error', {error: err}));
});

router.get('/meuscursos',checkLoggin, function(req, res, next) {
  Dados.getMyCursos(req.cookies['token'])
    .then(dados => {
      //console.log("Cursos",dados.data);
      data =  new Date().toISOString().substring(0, 16)
      res.render('listacursos', { cursos: dados.data, data: data, titulo: "Meus Cursos"});
    })
    .catch(err => res.render('error', {error: err}));
});


router.get('/cursos/:id',checkLoggin, function(req, res, next) {
  Dados.getOneCurso(req.params.id,req.cookies['token'])
    .then(dados => {
      Dados.getAllByCourse(req.params.id,req.cookies['token'])
        .then(metas => {
          var files = metas.data.metas;
          let ratings = 0;
          let total = 0;

          for (var i = 0; i < metas.data.metas.length; i++) {
            for (var j = 0; j < files[i].ratings.length; j++) {
              if (files[i].ratings[j].id == req.user.username){
                files[i].rated = true;
                files[i].rating = files[i].ratings[j].value;
                ratings += files[i].ratings[j].value;
                total++;
              }
            }
          }
          if (total != 0){
            var average = ratings/total;
          }
 
          res.render('curso', { curso: dados.data.curso, metas: metas.data.metas, permission: dados.data.permission, level: req.user.level, average: average});
        })
        .catch(err => res.render('error', {error: err}));
    })
    .catch(err => res.render('error', {error: err}));
});

router.post('/cursos',checkLoggin, function(req, res, next) {
  Dados.createCurso(req.body,req.cookies['token']).then(dados => {
    res.redirect('/cursos');}
  ).catch(err => {
    res.status(500).jsonp({error: err});
  });
});



router.get('/register', function(req, res, next) {
  // TODO : Universidades disponiveis
  let universidades = ["Universidade do Minho","Universidade do Porto","Universidade de Lisboa"];
  let departamentos = ["Departamento de Informática","Departamento de Física","Departamento de Matemática"];
  res.render('register',{instituicoes: universidades, departamentos: departamentos, no_bar: true});
});

router.get('/no_login', function(req, res, next) {
  res.render('index',{no_bar: true});
});

router.get('/login', function(req, res, next) {
  res.render('login',{no_bar: true});
});


router.get('/user/:id',checkLoggin, function(req, res, next) {
  let cookie = req.cookies['token'];
  axios.get('http://localhost:3001/auth/' + req.params.id + "?token=" + cookie).then(dados => {

    res.jsonp(dados.data);
  }
  ).catch(err => {
    res.status(500).jsonp({error: err});
  });
});

router.post('/login',function(req, res, next) {
  Auth.login(req.body).then(dados => {
    console.log("Cookie",dados.data.token);
    let day = 1000 * 60 * 60 * 24;
    res.cookie('token', dados.data.token, {maxAge: day});
    console.log("Cookie Saved");
    res.redirect('/');
  }
  ).catch(err => {
    res.status(500).jsonp({error: err});
  }); 
});

router.get('/loggout',function(req, res, next) {
  // remove cookie
  res.clearCookie('token');
  res.redirect('/');
});


function validateFile(req, res, next) {
  if (req.file) {
    // max_size = 20MB
    if (req.file.size > process.env.MAX_SIZE) { 
      res.status(500).jsonp({error: "File too large"});
    }
    console.log(process.env);
    // type of file not in list of allowed mimetypes
    if (!process.env.ALLOWED_TYPES.includes(req.file.mimetype)) {
      res.status(500).jsonp({error: "File type not allowed"});
    }
    next();
  }
  else{
    res.status(500).jsonp({error: "No file"});
  }
}

    


router.post('/files',checkLoggin,upload.single("file"),function(req, res, next) {
  console.log("Upload File");
  req.body.tag =  req.body.tag.slice(0, -1);
  Dados.insert(req.file,req.body,req.cookies['token']).then(dados => {
      console.log("File Uploaded");
      res.redirect('/');
  }
  ).catch(err => {
    res.render('error', {error: err});
    // res.status(500).jsonp({error: err});
  });
});

/*
router.get('/files/:id',checkLoggin, function(req, res, next) {
  let cookie = req.cookies['token'];
  Dados.getOne(req.params.id,cookie).then(dados => {
    
    //save file
    res.send(dados.data);
    
    //res.render('file', { file: dados.data });
  }
  ).catch(err => {
    res.status(500).jsonp({error: err});
  });
});
*/

router.post('/cursos/:id/entrar',checkLoggin, function(req, res, next) {
  let cookie = req.cookies['token'];
  Dados.entrarCurso(req.params.id,cookie).then(dados => {
    res.redirect('/cursos/'+req.params.id);
    //res.jsonp(dados.data);
  }
  ).catch(err => {
    res.status(500).jsonp({error: err});
  });
});



router.get('/profile',checkLoggin, function(req, res, next) {
    let cookie = req.cookies['token'];
    Dados.getProfile(cookie).then(dados => {
      console.log(dados.data);
      console.log("USER: "+dados.data.user)
      res.render('profile', {user: dados.data.user, cursos: dados.data.cursos});
    }
    ).catch(err => {
      res.render('error', {error: err});
    });
});

router.get('/profile/edit',checkLoggin, function(req, res, next) {
  let cookie = req.cookies['token'];
  Dados.getProfile(cookie).then(dados => {
    console.log(dados.data);
    let universidades = ["Universidade do Porto","Universidade de Lisboa","Universidade do Minho"];
    let departamentos = ["Departamento de Informática","Departamento de Física","Departamento de Matemática"];
    res.render('editProfile', {user: dados.data.user, cursos: dados.data.cursos, options: {university: universidades, department: departamentos}});
  }
  ).catch(err => {
    res.render('error', {error: err});
  });
});




router.post('/cursos/:id/edit',checkLoggin, function(req, res, next) {
  let cookie = req.cookies['token'];
  Dados.editCurso(req.params.id,req.body,cookie).then(dados => {
    res.redirect('/cursos/'+req.params.id);
    //res.jsonp(dados.data);
  }
  ).catch(err => {
    res.status(500).jsonp({error: err});
  });
});



router.post('/register',function(req, res, next) {
  Auth.register(req.body).then(dados => {
    Dados.register(req.body.email).then(dados => {
      res.redirect('/');
    }).catch(err => {
      res.render('error', {error: err});
    });
  }
  ).catch(err => {
    res.render('error', {error: err});
  });
});
module.exports = router;
