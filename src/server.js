import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";
import Path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename)

const app = express();

app.use(express.static(Path.join(__dirname, "/build")))
app.use(bodyParser.json());

app.get("/api/project/:title", async (req, res) => {
    try {
        const client = await MongoClient.connect("mongodb://0.0.0.0:27017", { useNewUrlParser: true});
        console.log(req.params.title);
        const db = client.db("fullstackapp")
        const projectData = await db.collection("projects").findOne({title: req.params.title });
        res.status(200).json(projectData);
        client.close();
    }
    catch (error){
        console.log(error);
        res.status(500).json({ message: error });
        client.close();
    }
})

app.post("/api/createproject", async (req, res) => {
    try {
        const client = await MongoClient.connect("mongodb://0.0.0.0:27017", { useNewUrlParser: true});
        const db = client.db("fullstackapp")
        const result = await db.collection("projects").insertOne({ title: req.body.title, 
            content: req.body.content, identifier: req.body.identifier })
        res.status(200).json(result);
        client.close();
    }
    catch (error){
        console.log(error);
        res.status(500).json({ message: error });
        client.close();
    }
})

app.get('*', (req, res) => {
    res.sendFile(Path.join(__dirname + "build/index.html"))
})

app.listen(8000, () => console.log("listening on port 8000"));
