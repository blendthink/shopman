import {ViewOutput} from '@slack/bolt/dist/types/view';
import {Item} from '../data/item';
import {Option, View} from '@slack/bolt';
import {
    ACTION_ID_NAME, ACTION_ID_PLACE,
    BLOCK_ID_NAME,
    BLOCK_ID_PLACE,
    CALLBACK_ID_ADD_ITEM
} from '../const/slackConst';

export class SlackMapper {

    static toItem(
        view: ViewOutput
    ): Item {
        const views = view.state.values;
        const name = views[BLOCK_ID_NAME][ACTION_ID_NAME].value!;
        const place = views[BLOCK_ID_PLACE][ACTION_ID_PLACE].selected_option?.value!;
        return new Item(name, place);
    }

    static toModalAddItemView(
        placeList: string[]
    ): View {
        function generateOption(place: string): Option {
            return {
                "text": {
                    "type": "plain_text",
                    "text": `${place}`,
                    "emoji": true
                },
                "value": `${place}`
            };
        }

        const options = placeList.map(value => generateOption(value));

        return {
            "type": "modal",
            "callback_id": CALLBACK_ID_ADD_ITEM,
            "title": {
                "type": "plain_text",
                "text": "買い物リストに追加する"
            },
            "blocks": [
                {
                    "type": "input",
                    "block_id": BLOCK_ID_NAME,
                    "label": {
                        "type": "plain_text",
                        "text": "名前"
                    },
                    "element": {
                        "type": "plain_text_input",
                        "action_id": ACTION_ID_NAME,
                        "placeholder": {
                            "type": "plain_text",
                            "text": "例）牛乳"
                        }
                    }
                },
                {
                    "type": "input",
                    "block_id": BLOCK_ID_PLACE,
                    "label": {
                        "type": "plain_text",
                        "text": "場所",
                        "emoji": true
                    },
                    "element": {
                        "type": "static_select",
                        "action_id": ACTION_ID_PLACE,
                        "placeholder": {
                            "type": "plain_text",
                            "text": "例）冷蔵庫",
                            "emoji": true
                        },
                        "options": options
                    }
                }
            ],
            "submit": {
                "type": "plain_text",
                "text": "Submit"
            }
        };
    }
}
