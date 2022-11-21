const TaikhoanService = require("../services/taikhoan.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Create and Save a new tk
exports.create = async (req, res, next) => {
    if (!req.body?.username) {
        return next(new ApiError(400, "Name can not be empty"));
    }

    try {
        const taikhoanService = new TaikhoanService(MongoDB.client);
        const document = await taikhoanService.create(req.body);
        return res.send(document);        
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the tk")
        );
    }
};

// Update a contact by the id in the request
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try {
        const taikhoanService = new TaikhoanService(MongoDB.client);
        const document = await taikhoanService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "TK not found"));
        } 
        return res.send({message: "TK was updated successfully" });
    } catch (error) {
        return next(
            new ApiError(500,`Error updating TK with id=${req.params.id}`)
        );
    }
};
exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const taikhoanService = new TaikhoanService(MongoDB.client);
        const {username} = req.query;
        if (username) {
            documents = await taikhoanService.findByName(username);
        } else {
            documents = await taikhoanService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the taikhoan")
        );
    }

    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    let documents = [];
    try {
        const taikhoanService = new TaikhoanService(MongoDB.client);
        const document = await taikhoanService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Contact not found"));
        } 
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500,`Error retrieving contact with id=${req.params.id}`)
        );
    }
};
// Delete a tk with the specified id in the request
exports.delete = async (req, res, next) => {
    try {
        const taikhoanService = new TaikhoanService(MongoDB.client);
        const document = await taikhoanService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "tk not found"));
        } 
        return res.send({ message: "tk was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500,`Could not delete tk with id=${req.params.id}`)
        );
    }
};

// Delete all tk of a user from the dâtbase
exports.deleteAll = async (_req, res, next) => {
    try {
        const taikhoanService = new TaikhoanService(MongoDB.client);
        const deletedCount = await taikhoanService.deleteAll();
        return res.send({
            message: `${deletedCount} tk were deleted successfully`,
        });
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "An error occurred while removing all tk")
        );
    }
};
