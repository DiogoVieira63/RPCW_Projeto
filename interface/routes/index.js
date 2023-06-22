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
    console.log(req.body);
    next();
  }
  else{
    res.redirect('/no_login');
  }
}

router.get('/',checkLoggin, function(req, res, next) {
  console.log('Página Inicial');
  console.log(req.cookies['token'])
  Dados.getMyCursos(req.cookies['token'])
    .then(dados => {
      //console.log("Cursos",dados.data);
      data =  new Date().toISOString().substring(0, 16)
      res.render('pagina_inicial', { cursos: dados.data, data: data, titulo: "Meus Cursos"});
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
  console.log("FileForm");
  res.render('fileForm',{curso: req.params.curso});
});

router.get('/cursos/:id/posts/:idpost',checkLoggin, function(req, res, next) {
  // console.log(req.cookies['token'])
  Dados.getOnePost(req.params.id,req.params.idpost,req.cookies['token'])
    .then(dados => {
      Dados.getOne(dados.data.id_meta,req.cookies['token']).then(file => {
        res.render('post',{post: dados.data, meta: file.data.meta});
      }
      ).catch(err => {
        res.status(500).jsonp({error: err});
      });
    })
    .catch(err => res.render('error', {error: err}));
});

router.get('/cursos',checkLoggin, function(req, res, next) {
  console.log(req.cookies['token'])
  Dados.getAllCursos(req.cookies['token'])
    .then(dados => {
      //console.log("Cursos",dados.data);
      data =  new Date().toISOString().substring(0, 16)
      res.render('listacursos', { cursos: dados.data, data: data, titulo: "Lista de Cursos"});
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
  console.log(req.cookies['token'])
  Dados.getMyCursos(req.cookies['token'])
    .then(dados => {
      //console.log("Cursos",dados.data);
      data =  new Date().toISOString().substring(0, 16)
      res.render('listacursos', { cursos: dados.data, data: data, titulo: "Meus Cursos"});
    })
    .catch(err => res.render('error', {error: err}));
});



router.get('/cursos/:id/edit',checkLoggin, function(req, res, next) {
  Dados.getOneCurso(req.params.id,req.cookies['token'])
    .then(dados => {
      data =  new Date().toISOString().substring(0, 16)
      console.log(dados.data)
      Auth.getNames(dados.data.professores,req.cookies['token']).then(nomes => {
        let vis = ["privado","publico","convite"];
        res.render('editcurso', { curso: dados.data, options: {visibility: vis}, profs:nomes.data})
      })
      .catch(err => res.render('error', {error: err}));
    })
    .catch(err => res.render('error', {error: err}));
});

router.get('/cursos/:id/alunos',checkLoggin, function(req, res, next) {
  console.log(req.cookies['token'])
  Dados.getOneCurso(req.params.id,req.cookies['token'])
    .then(dados => {
      data =  new Date().toISOString().substring(0, 16)
      console.log(dados.data)
      
      Auth.getNames(dados.data.alunos,req.cookies['token']).then(nomes => {
        data =  new Date().toISOString().substring(0, 16)
        res.render('alunos', {curso: dados.data.nome, alunos:nomes.data, data:data})
      })
      .catch(err => res.render('error', {error: err}));
      // console.log(dados.data)
      // res.render('curso', { curso: dados.data, metas: metas.data.metas, data: data})
    })
    .catch(err => res.render('error', {error: err}));
});

router.get('/cursos/:id',checkLoggin, function(req, res, next) {
  console.log(req.cookies['token'])
  Dados.getOneCurso(req.params.id,req.cookies['token'])
    .then(dados => {
      data =  new Date().toISOString().substring(0, 16)
      console.log(dados.data)
      Dados.getAllByCourse(req.params.id,req.cookies['token'])
        .then(metas => {
          Auth.getNames(dados.data.professores,req.cookies['token']).then(nomes => {
            console.log("Users: "+ nomes.data)

            console.log("METAS: "+ metas.data)
            console.log("NAMES: ", nomes.data)
            res.render('curso', { curso: dados.data, profs:nomes.data,metas: metas.data.metas, data: data})
          })
          .catch(err => res.render('error', {error: err}));
          // console.log(dados.data)
          // res.render('curso', { curso: dados.data, metas: metas.data.metas, data: data})

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
  res.render('register',{instituicoes: universidades, departamentos: departamentos});
});

router.get('/no_login', function(req, res, next) {
  res.render('index');
});

router.get('/login', function(req, res, next) {
  res.render('login');
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
    // console.log(dados.data);
    let universidades = ["Universidade do Porto","Universidade de Lisboa","Universidade do Minho"];
    let departamentos = ["Departamento de Informática","Departamento de Física","Departamento de Matemática"];
    res.render('editProfile', {user: dados.data.user, cursos: dados.data.cursos, options: {university: universidades, department: departamentos}});
  }
  ).catch(err => {
    res.render('error', {error: err});
  });
});

router.post('/profile/edit',function(req, res, next) {
  let cookie = req.cookies['token'];
  Auth.update(req.body, cookie).then(dados => {
    let day = 1000 * 60 * 60 * 24;
    res.cookie('token', dados.data.token, {maxAge: day});
    console.log("Cookie Saved");
    res.redirect('/profile');
  }
  ).catch(err => {
    res.render('error', {error: err});
  });
});

router.post('/register',function(req, res, next) {
  Auth.register(req.body).then(dados => {
    res.redirect('/');
  }
  ).catch(err => {
    res.render('error', {error: err});
  });
});
module.exports = router;
