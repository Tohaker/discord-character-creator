import { Firestore } from "@google-cloud/firestore";
import FCG from "fantasy-content-generator";
import { createCharacter } from "./character";

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

// const mockFirestore = Firestore as jest.MockedClass<typeof Firestore>;
// const mockGenerate = FCG.Names.generate as jest.MockedFunction<any>;

describe("Character", () => {
  FCG.Names.generate.mockReturnValue({
    formattedData: {
      name: "Some Name",
      race: "Human",
      gender: "Female",
    },
  });

  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(Date, "now").mockReturnValue(1111);

  const mockSnapshot = {
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

  beforeEach(() => {
    jest.clearAllMocks();

    mockDocument.get.mockResolvedValue({
      exists: true,
      data: () => mockSnapshot,
    });
    mockDocument.create.mockResolvedValue({ data: true });
  });

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
              id: "b669995",
              name: "Some Name",
              race: "Human",
              gender: "Female",
            },
          ],
        });
        expect(mockDocument.create).not.toBeCalled();
        expect(result).toBe(true);
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
              id: "b669995",
              name: "Some Name",
              race: "Human",
              gender: "Female",
            },
          ],
        });
        expect(mockDocument.update).not.toBeCalled();
        expect(result).toBe(true);
      });

      describe("given the document creation fails", () => {
        beforeEach(() => {
          mockDocument.create.mockRejectedValue({ data: false });
        });

        it("should return false", async () => {
          const result = await createCharacter("1234");

          expect(mockDocument.get).toBeCalledTimes(1);
          expect(mockDocument.create).toBeCalledWith({
            userId: "1234",
            created: new Date(1111),
            updated: new Date(1111),
            characters: [
              {
                id: "b669995",
                name: "Some Name",
                race: "Human",
                gender: "Female",
              },
            ],
          });
          expect(mockDocument.update).not.toBeCalled();
          expect(result).toBe(false);
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
              id: "94ad592",
              name: "New Name",
              race: "Human",
              gender: "Female",
            },
          ],
        });
        expect(mockDocument.create).not.toBeCalled();
        expect(result).toBe(true);
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
              id: "94ad592",
              name: "New Name",
              race: "Human",
              gender: "Female",
            },
          ],
        });
        expect(mockDocument.update).not.toBeCalled();
        expect(result).toBe(true);
      });
    });
  });
});
