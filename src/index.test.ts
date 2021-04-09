describe("Bot", () => {
  const mockClient = {
    once: jest.fn(),
    on: jest.fn(),
    login: jest.fn(),
  };
  const mockCreateCharacter = jest.fn().mockResolvedValue("character");
  const mockDeleteCharacter = jest.fn().mockResolvedValue("deleted");
  const mockListCharacters = jest.fn().mockResolvedValue("list");

  jest.spyOn(console, "log").mockImplementation(() => {});

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    jest.mock("discord.js", () => {
      return {
        Client: jest.fn().mockImplementation(() => {
          return mockClient;
        }),
      };
    });
    jest.mock("express", () => require("jest-express"));
    jest.mock("./character", () => ({
      createCharacter: mockCreateCharacter,
      deleteCharacter: mockDeleteCharacter,
      listCharacters: mockListCharacters,
    }));

    process.env.BOT_TOKEN = "bot token";

    require(".");
  });

  it("should login and setup client", () => {
    expect(mockClient.once).toBeCalledWith("ready", expect.any(Function));
    expect(mockClient.on).toBeCalledWith("message", expect.any(Function));
    expect(mockClient.login).toBeCalledWith("bot token");
  });

  describe('given a message "!ping" is received', () => {
    it("should respond with pong", async () => {
      const onMessage: Function = mockClient.on.mock.calls[0][1];
      const mockMessage = {
        content: "!ping",
        channel: {
          send: jest.fn(),
        },
      };
      await onMessage(mockMessage);

      expect(mockMessage.channel.send).toBeCalledWith("pong");
    });
  });

  describe('given a message "!create" is received', () => {
    it("should respond with the created character", async () => {
      const onMessage: Function = mockClient.on.mock.calls[0][1];
      const mockMessage = {
        author: {
          id: "1234",
        },
        content: "!create",
        channel: {
          send: jest.fn(),
        },
      };
      await onMessage(mockMessage);

      expect(mockCreateCharacter).toBeCalledWith("1234", undefined);
      expect(mockMessage.channel.send).toBeCalledWith("character");
    });

    describe("given a name is provided", () => {
      it("should respond with the created character", async () => {
        const onMessage: Function = mockClient.on.mock.calls[0][1];
        const mockMessage = {
          author: {
            id: "1234",
          },
          content: "!create Some Name",
          channel: {
            send: jest.fn(),
          },
        };
        await onMessage(mockMessage);

        expect(mockCreateCharacter).toBeCalledWith("1234", "Some Name");
        expect(mockMessage.channel.send).toBeCalledWith("character");
      });
    });
  });

  describe('given a message "!delete" is received', () => {
    it("should respond with the deleted character message", async () => {
      const onMessage: Function = mockClient.on.mock.calls[0][1];
      const mockMessage = {
        author: {
          id: "1234",
        },
        content: "!delete",
        channel: {
          send: jest.fn(),
        },
      };
      await onMessage(mockMessage);

      expect(mockDeleteCharacter).toBeCalledWith("1234", undefined);
      expect(mockMessage.channel.send).toBeCalledWith("deleted");
    });

    describe("given an id is provided", () => {
      it("should respond with the deleted character message", async () => {
        const onMessage: Function = mockClient.on.mock.calls[0][1];
        const mockMessage = {
          author: {
            id: "1234",
          },
          content: "!delete id456",
          channel: {
            send: jest.fn(),
          },
        };
        await onMessage(mockMessage);

        expect(mockDeleteCharacter).toBeCalledWith("1234", "id456");
        expect(mockMessage.channel.send).toBeCalledWith("deleted");
      });
    });
  });

  describe('given a message "!list" is received', () => {
    it("should respond with the list of characters", async () => {
      const onMessage: Function = mockClient.on.mock.calls[0][1];
      const mockMessage = {
        author: {
          id: "1234",
        },
        content: "!list",
        channel: {
          send: jest.fn(),
        },
      };
      await onMessage(mockMessage);

      expect(mockListCharacters).toBeCalledWith("1234");
      expect(mockMessage.channel.send).toBeCalledWith("list");
    });
  });
});
