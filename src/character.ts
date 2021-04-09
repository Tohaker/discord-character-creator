import { Firestore } from "@google-cloud/firestore";
import { Names } from "fantasy-content-generator";
import md5 from "md5";
import { Character, Document } from "./types";

const firestore = new Firestore();

const formatCharacter = (title: string, character: Character) =>
  `${title}\n\`\`\`fix\nName: ${character.name} \nRace: ${character.race} \nID: ${character.id} \n\`\`\``;

export const createCharacter = async (userId: string, name?: string) => {
  const document = firestore.doc(`users/${userId}`);
  const snapshot = await document.get();

  const {
    formattedData: { name: genName, gender, race },
  } = Names.generate();
  const newCharacter: Character = {
    id: undefined,
    name: name || genName,
    gender,
    race,
  };

  const characterId = md5(JSON.stringify(newCharacter)).substr(0, 7);
  newCharacter.id = characterId;

  if (snapshot.exists) {
    console.log(`Document for user ${userId} already exists`);
    await document.update({
      updated: new Date(Date.now()),
      characters: [...snapshot.data().characters, newCharacter],
    });
    return formatCharacter("New character successfully created:", newCharacter);
  }

  try {
    const now = new Date(Date.now());
    const body: Document = {
      userId,
      created: now,
      updated: now,
      characters: [newCharacter],
    };

    console.log(`Creating new document for user ${userId}`);
    await document.create(body);
    return formatCharacter(
      "Your first character successfully created:",
      newCharacter
    );
  } catch (e) {
    console.log(`Failed to create document: ${e}`);
    return "Something went wrong while creating your character, try again later.";
  }
};

export const deleteCharacter = async (userId: string, characterId?: string) => {
  const document = firestore.doc(`users/${userId}`);
  const snapshot = await document.get();

  if (!snapshot.exists) {
    return "You have no Characters to delete";
  }

  const characters: Character[] = snapshot.data()?.characters;
  const toDelete = characters?.find((c) => c.id === characterId);

  if (!characterId || !toDelete) {
    return "You need to provide a valid Character ID";
  }

  const newCharacters = characters.filter((c) => c.id !== characterId);
  await document.update({
    updated: new Date(Date.now()),
    characters: newCharacters,
  });

  return `Successfully deleted ${toDelete.name}`;
};
