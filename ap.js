//jshint esversion:6

const express =require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const app=express();
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"));
app.set("view engine","ejs");

mongoose.set('strictQuery', false);//imp.

mongoose.connect("mongodb+srv://Shivanshu:Shibu@cluster0.snmd9gw.mongodb.net/todolistDB",{useNewUrlParser:true});
const itemsSchema={
    name:String
};

const Item=mongoose.model("Item",itemsSchema);

const item1=new Item({
    name:"Welcome to your todolist!"
});
const item2=new Item({
    name:"Submit button to add new item"
});
const item3=new Item({
    name:"Delete an item"
});
const defaultItems=[item1,item2,item3];


app.get("/",function(req, res){
var today= new Date();
var options ={
    weekday:"long",
    day:"numeric",
    month:"long"
};
var day =today.toLocaleDateString("en-US",options);

Item.find({},function(err,founditems){
    if(founditems.length===0)
    {
        Item.insertMany(defaultItems,function(err){
    if(err)
     console.log(err);
    else
     console.log("Successful log into the database");
});
    res.redirect("/");
    }
    else{
    res.render("list",{kindOfDay:day,newListItems:founditems});
    }
})

});  

app.listen(4000,function(){
  console.log("Server started on port 4000");
});


app.post("/",function(req,res){
 const itemName =req.body.NewItem;
 const item4=new Item(
    {
        name:itemName
    }
 )
 item4.save();
 res.redirect("/");
});


app.post("/delete",function(req,res){
   const checkboxid=req.body.checkbox;
   Item.findByIdAndRemove(checkboxid,function(err){
    if(!err)
    {
        console.log("Successfully Deleted");
    }
    res.redirect("/");
   })


});