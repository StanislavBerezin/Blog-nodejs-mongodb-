module.exports = {
  port: process.env.PORT || 8888,
  db:{
    port: '',
    password: '123'
  },


  auth: {

    jwtSecret: process.env.JWT_SECRET || "acerTulebaeva",
    jwtExtraSecret: process.env.JWT_SECRET || "russkiyBogatir",
    jwtFindBy: "superSecretTulebaeva",
    google:{

      googleID: "id_goes_here",
      googleSecret: "id_goes_here",
      
    }


  }
}
