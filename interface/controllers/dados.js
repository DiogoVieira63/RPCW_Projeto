var axios = require('axios');



module.exports.getAllFiles = (token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;  
    return axios.get(`${url}/meta/files`,{headers: { Cookie: `token=${token}` }});
}


module.exports.getOne = (id, token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.get(`${url}/meta/files/${id}`,{headers: { Cookie: `token=${token}` }});
}
module.exports.getOneDownload = (id, token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.get(`${url}/meta/files/download/${id}`,{headers: { Cookie: `token=${token}` }});
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

module.exports.editarCurso = (curso,body,token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.post(`${url}/cursos/edit/${curso}`,body,{headers: { Cookie: `token=${token}` }});
}

module.exports.getProfile = (token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.get(`${url}/cursos/profile`,{headers: { Cookie: `token=${token}` }});
}

module.exports.getOnePost = (id,idpost,token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.get(`${url}/cursos/${id}/posts/${idpost}`,{headers: { Cookie: `token=${token}` }});
}

module.exports.entrarCurso = (idCurso,token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.get(`${url}/cursos/${idCurso}/entrar`,{headers: { Cookie: `token=${token}` }});
}


module.exports.getTypesActives = (token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.get(`${url}/meta/types/active`,{headers: { Cookie: `token=${token}` }});
}

module.exports.rateFile = (idFile,rate,token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.post(`${url}/meta/files/${idFile}/rating`, {rate: rate},{headers: { Cookie: `token=${token}` }});
}

module.exports.rateFileEdit = (idFile,rate,token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.put(`${url}/meta/files/${idFile}/rating`, {rate: rate},{headers: { Cookie: `token=${token}` }});
}

module.exports.rateFileDelete = (idFile,token) => {
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.delete(`${url}/meta/files/${idFile}/rating`,{headers: { Cookie: `token=${token}` }});
}

module.exports.register = (user) => {
    console.log("user",user);
    let url = `http://localhost:${process.env.DADOS_PORT}`;
    return axios.post(`${url}/noticias`, {username: user});
}
