const express = require("express"); 
const bodyParser = require("body-parser"); 
const app = express();
const exphbs = require("express-handlebars"); 
const upload = require("express-fileupload");

let urlencodedParser = bodyParser.urlencoded({ extended: false });

app.engine("hbs", exphbs());
app.set("view engine", "handlebars");
app.use(upload());

app.listen("3001", () => {
    console.log("Server started!");
  });

app.use("/photos", express.static(__dirname + "/Photos")); 
app.use("/styles", express.static(__dirname + "/Styles")); 

let schoolArray = [];

app.get("/", function (req, res) {
    res.render(`home.hbs`, { layout: false, schoolArray: schoolArray });
});

app.post("/goHome", urlencodedParser, function (req, res) {
  res.render(`home.hbs`, { layout: false, schoolArray: schoolArray });
})

app.post("/insertPage", urlencodedParser, function (req, res) {
    res.render(`create.hbs`, { layout: false});
})

app.post("/insertSchool", urlencodedParser, function (req, res) {
    let filepath = req.files.filename.name
    let name = req.body.name;
    let about = req.body.about;
    let location = req.body.location;
    let admission = req.body.admission;

    if (req.files) {
      let currentFolder = process.cwd(); 
      let file = req.files.filename,
        filename = file.name;
      file.mv(currentFolder + '/photos/' + filename, function (err) {
        if (err) {
          console.log("Error moving file")
        }
      });
  }

    schoolArray.push({ filepath: filepath, name: name, about: about, location: location, admission: admission})
    
    res.render(`home.hbs`, { layout: false, schoolArray: schoolArray});
})

let index; 
app.post("/updateSchool", urlencodedParser, function (req, res) {
  index = req.body.editNumber;
  
  let filepath = schoolArray[index].filepath
  let name = schoolArray[index].name
  let location = schoolArray[index].location
  let about =  schoolArray[index].about
  let admission =  schoolArray[index].admission
  
  res.render(`update.hbs`, { layout: false, filepath: filepath, name: name, location: location, about: about, admission: admission });
})

app.post("/editSchool", urlencodedParser, function (req, res) {
  let name = req.body.name;
  let about = req.body.about;
  let location = req.body.location;
  let admission = req.body.admission;

  schoolArray[index].name = name
  schoolArray[index].about = about
  schoolArray[index].location = location
  schoolArray[index].admission = admission
  
  res.render(`home.hbs`, { layout: false, schoolArray: schoolArray});
})

app.post("/viewSchool", urlencodedParser, function (req, res) {
  let inx = req.body.schoolNum;

  let filepath = schoolArray[inx].filepath
  let name = schoolArray[inx].name
  let location = schoolArray[inx].location
  let about =  schoolArray[inx].about
  let admission =  schoolArray[inx].admission

  res.render(`display.hbs`, { layout: false, filepath: filepath, name: name, location: location, about: about, admission: admission });
})


