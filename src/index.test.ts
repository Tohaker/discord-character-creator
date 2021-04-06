describe("Bot", () => {
  const mockClient = {
    once: jest.fn(),
    on: jest.fn(),
    login: jest.fn(),
  };
  const mockCreateCharacter = jest.fn().mockResolvedValue("character");

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
});
