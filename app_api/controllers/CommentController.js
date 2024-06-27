var mongoose =require("mongoose");
var Product = mongoose.model("product");

const createResponse =function(res,status,content){
    res.status(status).json(content);
};

const getComment= async function(req,res){
    try{
        await Product.findById(req.params.productid)
        .select("name comments")
        .exec()
        .then(function(product){
            var response, comment;
            if(!product){
                createResponse(res,404,{
                    status:"productid bulunamadı.",
                });
                return;
            }   else if(product.comments && product.comments.length > 0) {
                comment = product.comments.id(req.params.commentid);
                if(!comment){
                    createResponse(res,404,{
                        status:"commentid bulunamdı",
                    });
                }   else{
                    response = {
                        product: {
                            name: product.name,
                            id: req.params.productid,
                        },
                        comment:comment,
                    };
                    createResponse(res,200,response);
                }
            }   else{
                createResponse(res,404,{
                    status:"Hiç yorum yok",
                });
            }
        });
    } catch (error){
        createResponse(res,404,{
            status:"productid bulunamadı."
        });
    }
};
var calculateLastRating = function(incomingProduct){
    var i, numComments, avgRating, sumRating;
    if(incomingProduct.comments && incomingProduct.comments.length > 0){
        numComments = incomingProduct.comments.length;
        sumRating = 0;
        for( i= 0;i <numComments;i++){
            sumRating = sumRating +incomingProduct.comments[i].rating;
        }
        avgRating =Math.ceil(sumRating / numComments);
        incomingProduct.rating=avgRating;
        incomingProduct.save();
    }
};

var updateRating = function(productid){
    Product.findById(productid)
    .select("rating comments")
    .exec()
    .then(function(product){
        calculateLastRating(product);
    });
};

const createComment =function(req,res,incomingProduct){
    try{
        incomingProduct.comments.push(req.body);
        incomingProduct.save().then(function(product){
            var comment;
            updateRating(product._id);
            comment=product.comments[product.comments.length -1];
            createResponse(res,201,comment);
        });
    }   catch(error){
        createResponse(res,400,{status:"Yorum oluşturulamadı!"});
    }
};

const addComment=async function(req,res){
    try{
        await Product.findById(req.params.productid)
        .select("comments")
        .exec()
        .then((incomingProduct) =>{
            createComment(req,res,incomingProduct);
        });
    }catch(error){
        createResponse(res,400,{status:"Yorum ekleme başarısız."});
    }
};

const deleteComment=async function(req,res){
    try{
        await Product.findById(req.params.productid)
        .select("comments")
        .exec()
        .then(function(product){
            try{
                let comment=product.comments.id(req.params.commentid);
                comment.deleteOne();
                product.save().then(function(){
                    createResponse(res,200,{
                        status: comment.author +" isimli kişinin yaptığı yorum silindi!",
                    });
                });
            }   catch(error){
                createResponse(res,404,{status:"Yorum bulunamadı!"});
            }
        });
    }   catch(error){
        createResponse(res,400,{status:"Yorum silinemedi!"});
    }
};

const updateComment=async function(req,res){
    try{
        Product.findById(req.params.productid)
        .select("comments")
        .exec()
        .then(function(product){
            try{
                let comment =product.comments.id(req.params.commentid);
                comment.set(req.body);
                product.save().then(function(){
                    updateRating(product._id);
                    createResponse(res,200,comment);
                });
            }   catch{
                createResponse(res,400,{status:"Böyle bir yorum yok"});
            }
        });
    }   catch(error){
        createResponse(res,400,{status:"Yorum güncelleme başarısız!"});
    }
};

module.exports ={
    getComment,
    addComment,
    updateComment,
    deleteComment,
};