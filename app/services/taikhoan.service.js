const { ObjectId } = require("mongodb");

class TaikhoanService {
    constructor(client) {
        this.Taikhoan = client.db().collection("TaiKhoan");
    }
   
    //-------------------------------------
    extractTkData(payload) {
        const taikhoan = {
            username: payload.username,
            pass: payload.pass,
            type:payload.type,
        };
        // Remove undefined fields
        Object.keys(taikhoan).forEach(
            (key) => taikhoan[key] === undefined && delete taikhoan[key]
        );
        return taikhoan;
    }
    async create (payload) {
        const taikhoan = this.extractTkData(payload);
        const result = await this.Taikhoan.findOneAndUpdate(
            taikhoan ,
            { $set: { type: taikhoan.type ===true  } },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }  
   
    async find(filter) {
        const cursor = await this.Taikhoan.find(filter);
        return await cursor.toArray();
    }

    async findByName(username) {
        return await this.find({
            username: { $regex: new RegExp(username), $options: "i"},
        });
    }

    async findById(id) {
        return await this.Taikhoan.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }
    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractTkData(payload);
        const result = await this.Taikhoan.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result.value;
    }
    
    async delete(id) {
        const result = await this.Taikhoan.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }

    // async findFavorite() {
    //     return await this.find({ favorite: true });
    // }

    async deleteAll() {
        const result = await this.Taikhoan.deleteMany({});
        return result.deletedCount;
    }
        
}

module.exports = TaikhoanService;