const prisma = require("../../../loader/prisma");
const { omitPassword } = require("../../../utils/sanitize");

async function promotToAdmin(phone) {
    const updated = await prisma.user.update({
        where: { phone },
        data: { admin: true },
    });
    return omitPassword(updated);
}

module.exports = {
    promotToAdmin,
};
