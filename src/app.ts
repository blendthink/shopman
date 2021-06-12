import {App, ExpressReceiver} from '@slack/bolt';
import serverlessExpress from '@vendia/serverless-express';
import {getPlaceList, createItem} from './util/notion';
import {generateModalAddItemView} from './util/slack';

// カスタムのレシーバーを初期化します
const expressReceiver = new ExpressReceiver(
    {
        signingSecret: process.env.SLACK_SIGNING_SECRET!,
        // `processBeforeResponse` オプションは、あらゆる FaaS 環境で必須です。
        // このオプションにより、Bolt フレームワークが `ack()` などでリクエストへの応答を返す前に
        // `app.message` などのメソッドが Slack からのリクエストを処理できるようになります。FaaS では
        // 応答を返した後にハンドラーがただちに終了してしまうため、このオプションの指定が重要になります。
        processBeforeResponse: true,
    }
);

// ボットトークンと、AWS Lambda に対応させたレシーバーを使ってアプリを初期化します。
const app = new App(
    {
        token: process.env.SLACK_BOT_TOKEN,
        receiver: expressReceiver,
    }
);

app.command('/add', async ({ack, body, say, context}) => {
    await ack();

    try {

        const placeList = await getPlaceList();
        const modalAddItemView = generateModalAddItemView(placeList);

        await app.client.views.open(
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

app.view('modal-add-item-view', async ({ack, view, client, body}) => {
    await ack();

    try {
        const values = view.state.values;
        const itemName = values['block_name']['action_name'].value!;
        const itemPlace = values['block_place']['action_place'].selected_option?.value!;

        await createItem(itemName, itemPlace);

        await client.chat.postMessage(
            {
                channel: `${body.user.id}`,
                text: '登録しました'
            }
        );

    } catch (error) {
        await client.chat.postMessage(
            {
                channel: `${body.user.id}`,
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
