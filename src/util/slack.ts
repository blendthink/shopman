import {Option, View} from '@slack/bolt';

export const CALLBACK_ID_ADD_ITEM = "callback_add_item"

export function generateModalAddItemView(placeList: string[]): View {

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
        "callback_id": `${CALLBACK_ID_ADD_ITEM}`,
        "title": {
            "type": "plain_text",
            "text": "買い物リストに追加する"
        },
        "blocks": [
            {
                "type": "input",
                "block_id": "block_name",
                "label": {
                    "type": "plain_text",
                    "text": "名前"
                },
                "element": {
                    "type": "plain_text_input",
                    "action_id": "action_name",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "例）牛乳"
                    }
                }
            },
            {
                "type": "input",
                "block_id": "block_place",
                "label": {
                    "type": "plain_text",
                    "text": "場所",
                    "emoji": true
                },
                "element": {
                    "type": "static_select",
                    "action_id": "action_place",
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
