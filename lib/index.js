"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_1 = require("botbuilder");
const restify = require("restify");
const dotenv_1 = require("dotenv");
const path = require("path");
const botframework_config_1 = require("botframework-config");
const botbuilder_ai_1 = require("botbuilder-ai");
const bot_1 = require("./bot");
dotenv_1.config();
const BOT_FILE = path.join(__dirname, '..', (process.env.botFilePath || ''));
const DEV_ENVIRONMENT = 'Development';
const BOT_CONFIGURATION = (process.env.NODE_ENV || DEV_ENVIRONMENT);
let server = restify.createServer();
server.listen(process.env.PORT || process.env.port || 3978, () => {
    console.log(`${server.name} listening on ${server.url}`);
});
let botConfig;
try {
    botConfig = botframework_config_1.BotConfiguration.loadSync(BOT_FILE, process.env.botFileSecret);
}
catch (err) {
    console.error(`\nError reading bot file.`);
    process.exit();
}
const endpointConfig = botConfig.findServiceByNameOrId(BOT_CONFIGURATION);
const adapter = new botbuilder_1.BotFrameworkAdapter({
    appId: endpointConfig.appId || process.env.MICROSOFT_APP_ID,
    appPassword: endpointConfig.appPassword || process.env.MICROSOFT_APP_PASSWORD
});
const qnaMaker = new botbuilder_ai_1.QnAMaker({
    knowledgeBaseId: botConfig.findServiceByNameOrId("bst-qna").kbId,
    endpointKey: botConfig.findServiceByNameOrId("bst-qna").endpointKey,
    host: botConfig.findServiceByNameOrId("bst-qna").hostname
});
const luis = new botbuilder_ai_1.LuisRecognizer({
    applicationId: botConfig.findServiceByNameOrId("bst-luis").appId,
    endpoint: botConfig.findServiceByNameOrId("bst-luis").getEndpoint(),
    endpointKey: botConfig.findServiceByNameOrId("bst-luis").subscriptionKey
});
adapter.onTurnError = (context, error) => __awaiter(this, void 0, void 0, function* () {
    console.error(`\n [onTurnError]: ${error}`);
    yield context.sendActivity(`Oops. Something went wrong!`);
});
const storage = new botbuilder_1.MemoryStorage();
var conversationState = new botbuilder_1.ConversationState(storage);
var userState = new botbuilder_1.UserState(storage);
var bot = new bot_1.SampleBot(conversationState, userState, qnaMaker, luis);
server.post("/api/messages", (req, res) => {
    adapter.processActivity(req, res, (context) => __awaiter(this, void 0, void 0, function* () {
        yield bot.onTurn(context);
    }));
});
//# sourceMappingURL=index.js.map