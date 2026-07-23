"use strict";

const noteTitle = document.getElementById("note-title");
const noteContent = document.getElementById("note-content");
const saveNote = document.getElementById("save-note");

const save = async () => {
  if (!noteTitle.value) return;

  const body = {
    title: noteTitle.value,
    content: noteContent.value
  }

  if (typeof noteId !== 'undefined') {
    body.id = noteId;
  }

  const options = {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-type": "application/json" }
  }

  const request = await fetch("/api", options);
  const result = await request.text();

  if (result) {
    window.location.href = "/editor/" + result;
  }

}

saveNote.addEventListener("click", save);
