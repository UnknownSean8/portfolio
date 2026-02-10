import { ActionError, defineAction } from "astro:actions";
import { Resend } from "resend";
import { z } from "astro:schema";

const sendEmailSchema = z.object({
    email: z.string().email(),
    name: z.string(),
    subject: z.string(),
    html: z.string(),
});

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const server = {
    send: defineAction({
        input: sendEmailSchema,
        // accept: "form",
        handler: async (input) => {
            const { data, error } = await resend.emails.send({
                from: `${input.name} <onboarding@resend.dev>`,
                to: input.email,
                subject: input.subject,
                html: input.html,
            });

            if (error) {
                throw new ActionError({
                    code: "BAD_REQUEST",
                    message: error.message,
                });
            }

            return data;
        },
    }),
};
