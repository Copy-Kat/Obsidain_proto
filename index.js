const express = require("express")
const fs = require("fs")
const app = express()
const path = require("path")
const dirTree = require("directory-tree");

const port = 8008

const FilePath = path.join(__dirname, "Files");

app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, "public")))

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.get("/", (req, res) => {
	res.render("index", {
		isRaining: req.visitorWeather,
		pets: [
			{ name: "Meowsalot", species: "cat" },
			{ name: "Barksalot", species: "dog" },
		],
	});
});

app.post("/", (req, res) => {
    console.log(req.body)
})

// app.get("/files", (req, res) => {
// 	fs.readFile("./Files/test.html", "utf-8", (err, jsonString) => {
// 		if (err) {
// 			console.log("no files");
// 			return;
// 		}
// 		console.log(jsonString);
// 		res.send(jsonString);
// 	});
// });

// app.get("/files", (req, res) => {
// 	fs.readdir(FilePath, "utf-8", (err, files) => {
// 		if (err) {
// 			console.log("no files");
// 			return;
// 		}
// 		let fileList = [];
// 		files.forEach((file) => {fileList.push(path.extname(file))})
// 		console.log(fileList);
// 		res.send(fileList);
// 	});
// });

// app.get("/files", (req, res) => {
// 	fsFileTree(FilePath, (err, tree) => {
// 		if (err) {
// 			console.log("no files");
// 			return;
// 		}
// 		console.log(tree);
// 		res.json(tree);
// 	});
// });

app.get("/files", (req, res) => {
	const tree = dirTree("./Files");
	res.json(tree)
});

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})