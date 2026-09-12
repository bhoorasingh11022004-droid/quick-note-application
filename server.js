const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const notesFile = path.join(__dirname, "notes.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/notes", (req, res) => {
  fs.readFile(notesFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Cannot read notes" });
    res.json(JSON.parse(data || "[]"));
  });
});

app.post("/notes", (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      error: "Title and content are required"
    });
  }

  fs.readFile(notesFile, "utf8", (err, data) => {
    const notes = err ? [] : JSON.parse(data || "[]");

    const newNote = {
      id: Date.now(),
      title,
      content,
      createdAt: new Date().toISOString()
    };

    notes.push(newNote);

    fs.writeFile(
      notesFile,
      JSON.stringify(notes, null, 2),
      (err) => {
        if (err) {
          return res.status(500).json({
            error: "Cannot save note"
          });
        }

        res.status(201).json(newNote);
      }
    );
  });
});

app.delete("/notes/:id", (req, res) => {
  const id = Number(req.params.id);

  fs.readFile(notesFile, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Cannot read notes" });

    let notes = JSON.parse(data || "[]");

    notes = notes.filter(note => note.id !== id);

    fs.writeFile(
      notesFile,
      JSON.stringify(notes, null, 2),
      (err) => {
        if (err) {
          return res.status(500).json({
            error: "Cannot delete note"
          });
        }

        res.json({
          message: "Note deleted successfully"
        });
      }
    );
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
