const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const cors = require("cors");
const multer = require("multer");

const app = express();
app.use(cors());

const dbpath = path.join(__dirname, "database.db");
let db = null;

const PORT = process.env.PORT || 5000;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });

    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const upload = multer({ storage });

app.get("/api/recordings", async (req, res) => {
  const getRecordingsQuery = "SELECT * FROM recordings";
  const recordingsArray = await db.all(getRecordingsQuery);
  res.send({ message: "success", data: recordingsArray });
});

app.get("/api/recordings/:id", async (req, res) => {
  const { id } = req.params;
  const getRecordingQuery = `SELECT * FROM recordings WHERE id=${id}`;
  const recording = await db.get(getRecordingQuery);

  if (!recording) {
    return res.status(404).send({ error: "Recording not found" });
  }

  const absolutePath = path.join(__dirname, recording.filepath);
  res.sendFile(absolutePath);
});


app.post("/api/upload", upload.single("video"), async (req, res) => {
  const video = req.file;
  const uploadDataQuery = `
    INSERT INTO recordings (filename, filepath, size, created_at) 
    VALUES ('${video.originalname}', '${video.path}', ${video.size}, CURRENT_TIMESTAMP)
  `;
  await db.run(uploadDataQuery);
  res.send({message: "Video Uploaded to server"});
});
