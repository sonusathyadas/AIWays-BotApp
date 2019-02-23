import { BotFrameworkAdapter, TurnContext,Storage, ConversationState, UserState, MemoryStorage } from 'botbuilder';
import * as restify from 'restify';
import { config } from 'dotenv';
import * as path from 'path';
import { BotConfiguration, IEndpointService, IQnAService, ILuisService } from 'botframework-config';
import { QnAMaker, LuisRecognizer } from 'botbuilder-ai';
import { SampleBot } from './bot';

config(); //read configuration from .env file
// config({
//     path:path.join(__dirname, "..", ".env")
// });
const BOT_FILE = path.join(__dirname, '..', (process.env.botFilePath || ''));
const DEV_ENVIRONMENT = 'Development';
const BOT_CONFIGURATION = (process.env.NODE_ENV || DEV_ENVIRONMENT);

let server = restify.createServer();
server.listen(process.env.PORT || process.env.port || 3978, () => {
    console.log(`${server.name} listening on ${server.url}`);
});

//Loads bot configuration
let botConfig;
try {
    botConfig = BotConfiguration.loadSync(BOT_FILE, process.env.botFileSecret);
} catch (err) {
    console.error(`\nError reading bot file.`);
    process.exit();
}

//Create the adapter with the AppId and AppPassword
const endpointConfig = botConfig.findServiceByNameOrId(BOT_CONFIGURATION) as IEndpointService;
const adapter = new BotFrameworkAdapter({
    appId: endpointConfig.appId|| process.env.MICROSOFT_APP_ID,
    appPassword: endpointConfig.appPassword || process.env.MICROSOFT_APP_PASSWORD
});

const qnaMaker:QnAMaker = new QnAMaker({
    knowledgeBaseId:(botConfig.findServiceByNameOrId("bst-qna")as IQnAService).kbId,
    endpointKey:(botConfig.findServiceByNameOrId("bst-qna")as IQnAService).endpointKey,
    host:(botConfig.findServiceByNameOrId("bst-qna")as IQnAService).hostname
});
const luis:LuisRecognizer=new LuisRecognizer({
    applicationId:(botConfig.findServiceByNameOrId("bst-luis") as ILuisService).appId,
    endpoint:(botConfig.findServiceByNameOrId("bst-luis") as ILuisService).getEndpoint(),
    endpointKey:(botConfig.findServiceByNameOrId("bst-luis") as ILuisService).subscriptionKey
});
adapter.onTurnError= async(context:TurnContext,error)=>{
    console.error(`\n [onTurnError]: ${ error }`);
    await context.sendActivity(`Oops. Something went wrong!`);
}

const storage:Storage=new MemoryStorage();
var conversationState = new ConversationState(storage);
var userState = new UserState(storage);

//Create an instance of the bot
var bot:SampleBot =new SampleBot(conversationState, userState, qnaMaker, luis);

server.post("/api/messages", (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        await bot.onTurn(context);
    })
});

