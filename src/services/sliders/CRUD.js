const prisma = require("../../loader/prisma");

async function creatslider(data) {
    return prisma.slider.create({ data });
}

async function photo_adding_slider(id, urls) {
    return prisma.slider.update({
        where: { id },
        data: { photo: urls },
    });
}

async function getAllsliders() {
    return prisma.slider.findMany({ orderBy: { id: "asc" } });
}

async function updateslider(id, data) {
    return prisma.slider.update({
        where: { id },
        data,
    });
}

async function deleteslider(id) {
    return prisma.slider.delete({ where: { id } });
}

module.exports = {
    getAllsliders,
    deleteslider,
    updateslider,
    creatslider,
    photo_adding_slider,
};
