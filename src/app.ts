import {App, ExpressReceiver} from '@slack/bolt';
import serverlessExpress from '@vendia/serverless-express';
import {SlackMapper} from './mapper/slackMapper';
import {NotionRepository} from './repository/notionRepository';
import {CALLBACK_ID_ADD_ITEM} from './const/slackConst';

const expressReceiver = new ExpressReceiver(
    {
        signingSecret: process.env.SLACK_SIGNING_SECRET!,
        processBeforeResponse: true,
    }
);

const app = new App(
    {
        token: process.env.SLACK_BOT_TOKEN,
        receiver: expressReceiver,
    }
);

const notionRepository = new NotionRepository();

app.command('/list', async ({ack, say}) => {
    await ack();

    try {
        const items = await notionRepository.getItems();
        const blocks = SlackMapper.toItemsBlocks(items);
        await say(
            {
                blocks: blocks
            }
        );
    } catch (e) {
        await say(`error: ${e}`);
    }
});

app.command('/add', async ({ack, body, say, context, client}) => {
    await ack();

    try {
        const placeList = await notionRepository.getPlaceList();

        const modalAddItemView = SlackMapper.toModalAddItemView(placeList);

        await client.views.open(
            {
                token: context.botToken,
                trigger_id: body.trigger_id,
                view: modalAddItemView
            }
        );
    } catch (e) {
        await say(`error: ${e}`);
    }
});

app.view(CALLBACK_ID_ADD_ITEM, async ({ack, view, client, body}) => {
    await ack();

    try {
        const item = SlackMapper.toItem(view);

        await notionRepository.createItem(item.name, item.place);

        await client.chat.postMessage(
            {
                channel: body.user.id,
                text: '登録しました'
            }
        );

    } catch (error) {
        await client.chat.postMessage(
            {
                channel: body.user.id,
                text: `エラー：${error}`
            }
        );
    }
});

// Lambda 関数のイベントを処理します
module.exports.handler = serverlessExpress(
    {
        app: expressReceiver.app,
    }
);
