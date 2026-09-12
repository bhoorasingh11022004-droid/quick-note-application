function addNote() {
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  if (title.trim() === "" || content.trim() === "") {
    alert("Please enter title and note!");
    return;
  }

  const note = document.createElement("div");

  note.innerHTML = `
    <h3>${title}</h3>
    <p>${content}</p>
    <hr>
  `;

  document.getElementById("notesContainer").appendChild(note);

  document.getElementById("title").value = "";
  document.getElementById("content").value = "";
}
