"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onboarding = void 0;
const crypto_1 = __importDefault(require("crypto"));
const redis_1 = __importDefault(require("../../../../lib/redis"));
const prisma_1 = require("../../../../lib/prisma");
;
const jwt_1 = require("../../../../lib/jwt");
const sendEmail_1 = require("../../../../lib/sendEmail");
const crypto_2 = require("../../../../lib/crypto");
const emailTemp_1 = require("../../../../lib/emailTemp");
const onboarding = async (req, res) => {
    try {
        const userId = req.auth?.userId;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        const { step, data } = req.body;
        if (!step || !data)
            return res.status(400).json({ message: "Invalid request" });
        const redisKey = `onboarding:${userId}`;
        await redis_1.default.hSet(redisKey, step.toString(), JSON.stringify(data));
        await redis_1.default.expire(redisKey, 3600);
        if (step === 1) {
            const { password } = data;
            const hashed = await (0, crypto_2.hashPassword)(password);
            await prisma_1.prisma.user.update({
                where: { id: userId },
                data: { password: hashed },
            });
        }
        if (step < 1 || step > 3) {
            return res.status(400).json({ message: "Invalid step" });
        }
        if (step === 3) {
            const stepsData = await redis_1.default.hGetAll(redisKey);
            const merged = Object.values(stepsData)
                .map((v) => JSON.parse(v))
                .reduce((acc, curr) => ({ ...acc, ...curr }), {});
            const userRecord = await prisma_1.prisma.user.findUnique({ where: { id: userId } });
            const email = userRecord?.email;
            if (!email)
                return res.status(400).json({ message: "User email missing" });
            const { name, orgName, country, phone, userType, industry, teamSize, hqCountry, website, bio, } = merged;
            const user = await prisma_1.prisma.user.update({
                where: { id: userId },
                data: {
                    userType,
                    name: name || orgName || "",
                    country: country || hqCountry || null,
                    phone,
                    organization: orgName || null,
                    industry: industry || null,
                    teamSize: teamSize || null,
                    website: website || null,
                    bio: bio || null,
                },
            });
            const accessToken = (0, jwt_1.signAccess)({ sub: user.id, role: user.role });
            const refreshToken = crypto_1.default.randomBytes(32).toString("hex");
            const hashedRefresh = await (0, crypto_2.hashPassword)(refreshToken);
            const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
            await prisma_1.prisma.refreshToken.create({
                data: {
                    jti: crypto_1.default.randomUUID(),
                    hashedToken: hashedRefresh,
                    expiresAt: refreshExpiresAt,
                    userId: user.id,
                },
            });
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 15 * 60 * 1000, // 15 min
            });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            await (0, sendEmail_1.sendEmail)({
                to: email,
                subject: "Onboarding Complete. Welcome Aboard!",
                html: (0, emailTemp_1.composeEmailTemplate)({
                    subject: "Onboarding Complete. Welcome Aboard!",
                    title: "Welcome Aboard!",
                    subtitle: "Your TicTask onboarding is complete",
                    body1: `
            <p>Hi ${name || orgName || ""},</p>
            <p>Your onboarding is complete — you can now start being productive with TicTask!</p>
            <p>Click below to access your dashboard:</p>
            <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Go to Dashboard</a>
          `,
                    body2: `<p>If you did not expect this email, please contact our support team immediately.</p>`,
                    closingRemark: `<p>All the best!,<br/>The TicTask Team</p>`
                }),
            });
            await redis_1.default.del(redisKey);
            return res.json({
                message: "Onboarding complete. Session created.",
                redirect: "/dashboard",
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
            });
        }
        return res.json({
            message: `Step ${step} saved`,
            redirect: step < 3 ? `/onboarding?step=${step + 1}` : "/dashboard",
        });
    }
    catch (err) {
        console.error("❌ Onboarding Error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.onboarding = onboarding;
