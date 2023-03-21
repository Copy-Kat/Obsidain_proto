const express = require("express")
const app = express()
const path = require("path")

const port = 8008

app.use(express.urlencoded({extended: true



}))
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

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})