/** @odoo-module **/

import {
    registerClassPatchModel,
    registerInstancePatchModel,
    registerFieldPatchModel,
} from "@mail/model/model_core";
import {attr} from "@mail/model/model_field";

registerFieldPatchModel("mail.activity", "resource_booking/static/src/js/activity.js", {
    booking_id: attr({default: false}),
});

registerClassPatchModel("mail.activity", "resource_booking/static/src/js/activity.js", {
    /**
     * @override
     */
    convertData(data) {
        const res = this._super(data);
        if ("booking_id" in data) {
            res.booking_id = data.booking_id[0];
        }
        return res;
    },
});

registerInstancePatchModel(
    "mail.activity",
    "resource_booking/static/src/js/activity.js",
    {
        /**
         * In case the activity is linked to a resource booking, we want to open the calendar view instead.
         *
         * @override
         */
        async edit() {
            if (!this.booking_id) {
                await this._super();
            } else {
                const action = await this.async(() =>
                    this.env.services.rpc({
                        model: "mail.activity",
                        method: "action_create_calendar_event",
                        args: [[this.id]],
                    })
                );
                this.env.bus.trigger("do-action", {
                    action,
                });
            }
        },
    }
);
