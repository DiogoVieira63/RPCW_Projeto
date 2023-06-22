var axios = require('axios');



module.exports.getAllFiles = (token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;  
    return axios.get(`${url}/meta/files`,{headers: { Cookie: `token=${token}` }});
}


module.exports.getOne = (id, token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.get(`${url}/meta/files/${id}`,{headers: { Cookie: `token=${token}` }});
}

module.exports.getAllByCourse = (id,token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;  
    return axios.get(`${url}/meta/files/course/${id}`,{headers: { Cookie: `token=${token}` }});
}


module.exports.insert= (file,body,token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.post(`${url}/meta/files`, {file: file, body: body},{headers: { Cookie: `token=${token}` }});

}

module.exports.getFile = (id, token) => { 
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.get(`${url}/meta/files/${id}`,{headers: { Cookie: `token=${token}` }});
}

module.exports.getAllCursos = (token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.get(`${url}/cursos`,{headers: { Cookie: `token=${token}` }});
}

module.exports.getOneCurso = (id,token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.get(`${url}/cursos/${id}`,{headers: { Cookie: `token=${token}` }});
}

module.exports.getMyCursos = (token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.get(`${url}/cursos/meuscursos`,{headers: { Cookie: `token=${token}` }});
}

module.exports.createCurso = (curso,token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.post(`${url}/cursos/create`, {curso: curso},{headers: { Cookie: `token=${token}` }});
}

module.exports.getProfile = (token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.get(`${url}/cursos/profile`,{headers: { Cookie: `token=${token}` }});
}

module.exports.getOnePost = (id,idpost,token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.get(`${url}/cursos/${id}/posts/${idpost}`,{headers: { Cookie: `token=${token}` }});
}

