import { Firestore } from "@google-cloud/firestore";
import { Names } from "fantasy-content-generator";
import md5 from "md5";
import { Character, Document } from "./types";

const firestore = new Firestore();

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
    return true;
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
    return true;
  } catch (e) {
    console.log(`Failed to create document: ${e}`);
    return false;
  }
};
