import { Names } from "fantasy-content-generator";
import { createCharacter, deleteCharacter, listCharacters } from "./character";

const mockDocument = {
  get: jest.fn(),
  update: jest.fn(),
  create: jest.fn(),
};

jest.mock("@google-cloud/firestore", () => {
  return {
    Firestore: jest.fn().mockImplementation(() => {
      return {
        doc: jest.fn(() => mockDocument),
      };
    }),
  };
});
jest.mock("fantasy-content-generator", () => ({
  Names: {
    generate: jest.fn(),
  },
}));

describe("Character", () => {
  Names.generate.mockReturnValue({
    formattedData: {
      name: "Some Name",
      race: "Human",
      gender: "Female",
    },
  });

  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(Date, "now").mockReturnValue(1111);

  let mockSnapshot;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSnapshot = {
      userId: "1234",
      created: new Date(),
      updated: new Date(),
      characters: [
        {
          id: "4567",
          name: "Previous Name",
          race: "Human",
          gender: "Female",
        },
      ],
    };
    mockDocument.get.mockResolvedValue({
      exists: true,
      data: () => mockSnapshot,
    });
    mockDocument.create.mockResolvedValue({ data: true });
  });

  describe("createCharacter", () => {
    describe("given no name is given", () => {
      describe("given the user has already created a character before", () => {
        it("should append the new character and update the document", async () => {
          const result = await createCharacter("1234");

          expect(mockDocument.get).toBeCalledTimes(1);
          expect(mockDocument.update).toBeCalledWith({
            updated: new Date(1111),
            characters: [
              {
                id: "4567",
                name: "Previous Name",
                race: "Human",
                gender: "Female",
              },
              {
                id: "0ba20ab",
                name: "Some Name",
                race: "Human",
                gender: "Female",
              },
            ],
          });
          expect(mockDocument.create).not.toBeCalled();
          expect(result).toBe(
            "New character successfully created:\n```fix\nName: Some Name \nRace: Human \nID: 0ba20ab \n```"
          );
        });
      });

      describe("given the user has not already created a character before", () => {
        beforeEach(() => {
          mockDocument.get.mockResolvedValue({
            exists: false,
          });
        });

        it("should create the new character and the document", async () => {
          const result = await createCharacter("1234");

          expect(mockDocument.get).toBeCalledTimes(1);
          expect(mockDocument.create).toBeCalledWith({
            userId: "1234",
            created: new Date(1111),
            updated: new Date(1111),
            characters: [
              {
                id: "0ba20ab",
                name: "Some Name",
                race: "Human",
                gender: "Female",
              },
            ],
          });
          expect(mockDocument.update).not.toBeCalled();
          expect(result).toBe(
            "Your first character successfully created:\n```fix\nName: Some Name \nRace: Human \nID: 0ba20ab \n```"
          );
        });

        describe("given the document creation fails", () => {
          beforeEach(() => {
            mockDocument.create.mockRejectedValue({ data: false });
          });

          it("should return an empty string", async () => {
            const result = await createCharacter("1234");

            expect(mockDocument.get).toBeCalledTimes(1);
            expect(mockDocument.create).toBeCalledWith({
              userId: "1234",
              created: new Date(1111),
              updated: new Date(1111),
              characters: [
                {
                  id: "0ba20ab",
                  name: "Some Name",
                  race: "Human",
                  gender: "Female",
                },
              ],
            });
            expect(mockDocument.update).not.toBeCalled();
            expect(result).toBe(
              "Something went wrong while creating your character, try again later."
            );
          });
        });
      });
    });

    describe("given a name is given", () => {
      describe("given the user has already created a character before", () => {
        it("should append the new character and update the document", async () => {
          const result = await createCharacter("1234", "New Name");

          expect(mockDocument.get).toBeCalledTimes(1);
          expect(mockDocument.update).toBeCalledWith({
            updated: new Date(1111),
            characters: [
              {
                id: "4567",
                name: "Previous Name",
                race: "Human",
                gender: "Female",
              },
              {
                id: "eb858c6",
                name: "New Name",
                race: "Human",
                gender: "Female",
              },
            ],
          });
          expect(mockDocument.create).not.toBeCalled();
          expect(result).toBe(
            "New character successfully created:\n```fix\nName: New Name \nRace: Human \nID: eb858c6 \n```"
          );
        });
      });

      describe("given the user has not already created a character before", () => {
        beforeEach(() => {
          mockDocument.get.mockResolvedValue({
            exists: false,
          });
        });

        it("should create the new character and the document", async () => {
          const result = await createCharacter("1234", "New Name");

          expect(mockDocument.get).toBeCalledTimes(1);
          expect(mockDocument.create).toBeCalledWith({
            userId: "1234",
            created: new Date(1111),
            updated: new Date(1111),
            characters: [
              {
                id: "eb858c6",
                name: "New Name",
                race: "Human",
                gender: "Female",
              },
            ],
          });
          expect(mockDocument.update).not.toBeCalled();
          expect(result).toBe(
            "Your first character successfully created:\n```fix\nName: New Name \nRace: Human \nID: eb858c6 \n```"
          );
        });
      });
    });
  });

  describe("deleteCharacter", () => {
    describe("given the document does not exist", () => {
      beforeEach(() => {
        mockDocument.get.mockResolvedValue({
          exists: false,
        });
      });

      it("should not update anything and return a message", async () => {
        const result = await deleteCharacter("1234", "4567");

        expect(mockDocument.update).not.toBeCalled();
        expect(result).toBe("You have no Characters to delete");
      });
    });

    describe("given the document exists", () => {
      describe("given the characterId is not provided", () => {
        it("should not update anything and return a message", async () => {
          const result = await deleteCharacter("1234");

          expect(mockDocument.update).not.toBeCalled();
          expect(result).toBe("You need to provide a valid Character ID");
        });
      });

      describe("given the characterId is not in the document", () => {
        it("should not update anything and return a message", async () => {
          const result = await deleteCharacter("1234", "9876");

          expect(mockDocument.update).not.toBeCalled();
          expect(result).toBe("You need to provide a valid Character ID");
        });
      });

      describe("given the characterId is in the document", () => {
        it("should update the document without the character", async () => {
          const result = await deleteCharacter("1234", "4567");

          expect(mockDocument.update).toBeCalledWith({
            updated: new Date(1111),
            characters: [],
          });
          expect(result).toBe("Successfully deleted Previous Name");
        });
      });
    });
  });

  describe("listCharacters", () => {
    describe("given the document does not exist", () => {
      beforeEach(() => {
        mockDocument.get.mockResolvedValue({
          exists: false,
        });
      });

      it("should return a message", async () => {
        const result = await listCharacters("1234");

        expect(result).toBe("No Characters found");
      });
    });

    describe("given the document exists", () => {
      describe("given there are no characters", () => {
        beforeEach(() => {
          mockSnapshot.characters = [];
        });

        it("should return a message", async () => {
          const result = await listCharacters("1234");

          expect(result).toBe("No Characters found");
        });
      });

      describe("given there are characters", () => {
        beforeEach(() => {
          mockSnapshot.characters.push({
            id: "7890",
            name: "Another Name",
            race: "Human",
            gender: "Male",
          });
        });

        it("should return the formatted characters", async () => {
          const result = await listCharacters("1234");

          expect(result).toBe(
            "1.\n```fix\nName: Previous Name \nRace: Human \nID: 4567 \n```\n2.\n```fix\nName: Another Name \nRace: Human \nID: 7890 \n```\n"
          );
        });
      });
    });
  });
});
