
var mongoose = require( 'mongoose' );

var dbURI = "mongodb+srv://esmaozturk3766:3788@greenlife.shfklc2.mongodb.net/?retryWrites=true&w=majority&appName=greenlife";
mongoose.connect(dbURI);

mongoose.connection.on("connected",function() {
	console.log(dbURI + "adresindeki veritabanına bağlanıldı!\n");
});
//Bağlantı hatası olduğunda konsola hata bilgisini yazdır
mongoose.connection.on("error",function(err) {
	console.log("Mongoose bağlantı hatası\n" + err);
});
//Bağlantı  kesildiğinde konsola kesilme bilgisini yaz.
mongoose.connection.on("disconnected",function() {
	console.log("Mongoose bağlantısı kesildi!\n");
});
// Uygulama kapandığında kapat.
process.on("SIGINT",function(){
	mongoose.connection.close();
	console.log("Bağlantı kapatıldı.");
	process.exit(0);
});
require("./product");
require("./user");
require("./bag");


