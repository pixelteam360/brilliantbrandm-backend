"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailSender = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const emailSender = (to, html, subject) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp-relay.brevo.com",
            port: 2525,
            secure: false,
            auth: {
                user: "88af50003@smtp-brevo.com",
                pass: "8bpBA0zPsrY473IZ",
            },
        });
        const mailOptions = {
            from: `<smt.team.pixel@gmail.com>`,
            to,
            subject,
            text: html.replace(/<[^>]+>/g, ""),
            html,
        };
        const info = yield transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.messageId}`);
        return info.messageId;
    }
    catch (error) {
        // @ts-ignore
        console.error(`Error sending email: ${error.message}`);
        throw new Error("Failed to send email. Please try again later.");
    }
});
exports.emailSender = emailSender;
