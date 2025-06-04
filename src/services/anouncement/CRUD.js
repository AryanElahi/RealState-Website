const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()
const createErrors = require ("http-errors")


async function creatAnnouncement(data, userId){
    data.userID = userId
    const newAnnoun = await prisma.property.create({
        data :
            data    
    })
    return newAnnoun
}
async function photo_adding (Uid, Url){
    return await prisma.property.update({
    where: {Uid : Uid},
    data : {photo : Url}
    })
}
async function getByStateCode (code) {
    return prisma.property.findFirst({
        where: {
            state_code : code
        }
    })
}
async function getByUid (code) {
    return prisma.property.findUnique({
        where: {
            Uid : code
        }
    })
}
async function getAllAnnouns () {
    return (await prisma.property.findMany({
            where: {reject : false}
}))
}
async function updateAnnoun (result){
    const code = await getByUid(result.Uid)
    return await prisma.property.update({
    where: {Uid : code.Uid},
    data : result
    })
}
async function deleteAnnoun (ID){
      const updated = await prisma.property.delete({
      where: {Uid: ID}
      })
    return (updated)
}
async function search(data) {
  const { full_name, address, price, ...rest } = data;

  const where = {
    ...rest,
    ...(full_name && {
      full_name: {
        contains: full_name,
        mode: 'insensitive'
      }
    }),
    ...(address && {
      address: {
        contains: address,
        mode: 'insensitive'
      }
    }),
    ...(price && {
      price: {
        lte: price
      }
    })
  };

  const user_announs = await prisma.property.findMany({
    where
  });

  return user_announs;
}
async function confirmed() {
const announs = await prisma.property.findMany({
    where: { check: true },
    orderBy: {
        id: 'desc'
    }
});
    const count = announs.length
    return ({"confirmed": announs, "number": count})
}
async function searchregion(name_e) {

const user_announs = await prisma.region.findMany({
    where: {
      name: {
        contains: name_e,
        mode: 'insensitive'
      }
    }
  });
    return user_announs;
}

module.exports = {
    creatAnnouncement,
    getAllAnnouns,
    updateAnnoun,
    deleteAnnoun,
    getByStateCode,
    getByUid,
    photo_adding,
    search,
    confirmed,
    searchregion
}