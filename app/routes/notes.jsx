import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import NewNote, { links as newNoteLinks } from "~/components/NewNote";
import NoteList, { links as noteListLinks } from "~/components/NotesList";
import { getStoredNotes, storeNotes } from "~/data/notes";

export default function NotesPage() {
  const notes = useLoaderData();

  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  );
}

export async function loader() {
  const notes = await getStoredNotes();
  return notes;
  //* Remix does this under the hood
  // return new Response(JSON.stringify(notes), {headers: {"Content-Type": "application/json"}});
  //* Alternate response
  // return json(notes);
}

export async function action({ request }) {
  const formData = await request.formData();
  const noteData = Object.fromEntries(formData);
  //* alternate method
  // const noteData = {
  //   title: formData.get("title"),
  //   content: formData.get("content"),
  // };
  //TODO Add validation...
  const existingNotes = await getStoredNotes();
  noteData.id = new Date().toISOString();
  const updatedNotes = existingNotes.concat(noteData);
  await storeNotes(updatedNotes);
  return redirect("/notes");
}

export function links() {
  return [...newNoteLinks(), ...noteListLinks()];
}
