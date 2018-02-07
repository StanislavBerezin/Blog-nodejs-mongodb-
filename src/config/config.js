module.exports = {
  port: process.env.PORT || 8888,
  db:{
    port: 'mongodb://Netcoll:White!Test@netcoll-shard-00-00-muxth.mongodb.net:27017,netcoll-shard-00-01-muxth.mongodb.net:27017,netcoll-shard-00-02-muxth.mongodb.net:27017/test?ssl=true&replicaSet=Netcoll-shard-0&authSource=admin',
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