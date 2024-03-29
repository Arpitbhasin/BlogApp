var express 			= require("express");
var methodOverride		=require("method-override");
var expressSanitizer 	=require("express-sanitizer");
var app 				= express();
var mongoose 			= require("mongoose");
var bodyParser 			= require("body-parser");

//App config
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


//Testing
//Hello whatsapp;

//Mongoose/Model Config
var blogSchema = new mongoose.Schema({
	title:String,
	image:String,
	body: String,
	created: {type:Date , default: Date.now}
});
var Blog = mongoose.model("Blog",blogSchema);

//RESTful Routes
app.get("/",function(req,res){
	res.redirect("/blogs");
});
//INDEX Route
app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log(err);
		}else{
			res.render("index",{blogs:blogs});
		}
	});
});

//NEW Routes
app.get("/blogs/new",function(req,res){
	res.render("new");
});

//CREATE Route
app.post("/blogs",function(req,res){
	//create blog
	/*console.log(req.body);*/
	req.body.blog.body = req.sanitize(req.body.blog.body);
	/*console.log("===========");
	console.log(req.body);*/

	Blog.create(req.body.blog, function(err,newBlog){
		if(err){
			console.log(err);
			res.render("new");
		}else{
			res.redirect("/blogs");
		}
	});
});

//SHOW Route
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			console.log(err);
			res.redirect("/blogs");
		}else{
			res.render("show",{blog:foundBlog }); 
		}
	});
});

//EDIT Route
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			console.log(err);
			res.redirect("/blogs");
		}else{
			res.render("edit",{blog:foundBlog});
		}
	});
});
//UPDATE Route
app.put("/blogs/:id",function(req,res){
		req.body.blog.body = req.sanitize(req.body.blog.body);

	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updateBlog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs/"+req.params.id );
		}
	})		
});

//DELETE Route
app.delete("/blogs/:id",function(req,res){
	//destroy route
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	});
	//redirect somewhere
});

app.listen(3000,function(){
	console.log("Server is running on port 3000");
});
