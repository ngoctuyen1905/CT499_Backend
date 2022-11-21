const { ObjectId } = require("mongodb");

class AdminService {
    constructor(client) {
        this.Admin = client.db().collection("admins");
    }
   
    //-------------------------------------
    extractadData(payload) {
        const admin = {
            name: payload.name,
            email: payload.email,
            address: payload.address,
            phone: payload.phone,
            favorite: payload.favorite,
        };
        // Remove undefined fields
        Object.keys(admin).forEach(
            (key) => admin[key] === undefined && delete admin[key]
        );
        return admin;
    }
    async create (payload) {
        const admin = this.extractadData(payload);
        const result = await this.Admin.findOneAndUpdate(
            admin ,
            { $set: { favorite: admin.favorite ===true  } },
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }  
   
    async find(filter) {
        const cursor = await this.Admin.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(name), $options: "i"},
        });
    }

    async findById(id) {
        return await this.Admin.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }
    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractadData(payload);
        const result = await this.Admin.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result.value;
    }
    
    async delete(id) {
        const result = await this.Admin.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }

    async findFavorite() {
        return await this.find({ favorite: true });
    }

    async deleteAll() {
        const result = await this.Admin.deleteMany({});
        return result.deletedCount;
    }
        
}

module.exports = AdminService;