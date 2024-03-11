from odoo import fields, models


class ResPartner(models.Model):
    _inherit = "res.partner"

    resource_booking_count = fields.Integer(
        compute="_compute_resource_booking_count", string="Resource booking count"
    )
    resource_booking_ids = fields.One2many(
        "resource.booking", "partner_id", string="Bookings"
    )

    def _compute_resource_booking_count(self):
        booking_data = self.env["resource.booking"].read_group(
            [("partner_id", "in", self.ids)], ["partner_id"], ["partner_id"]
        )
        data = {x["partner_id"][0]: x["partner_id_count"] for x in booking_data}
        for record in self:
            record.resource_booking_count = data.get(record.id, 0)

    def action_view_resource_booking(self):
        self.ensure_one()
        action = self.env["ir.actions.actions"]._for_xml_id(
            "resource_booking.resource_booking_action"
        )
        action["context"] = {
            "default_partner_id": self.id,
        }
        return action
