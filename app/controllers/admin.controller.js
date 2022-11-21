const AdminService = require("../services/admin.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Create and Save a new Contact
exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name can not be empty"));
    }

    try {
        const adminService = new AdminService(MongoDB.client);
        const document = await adminService.create(req.body);
        return res.send(document);        
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the contact")
        );
    }
};

// Retrieve  all contacts of a user from the database
exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const adminService = new AdminService(MongoDB.client);
        const {name} = req.query;
        if (name) {
            documents = await adminService.findByName(name);
        } else {
            documents = await adminService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the contact")
        );
    }

    return res.send(documents);
};

// Find a single contact with an id
exports.findOne = async (req, res, next) => {
    let documents = [];
    try {
        const adminService = new AdminService(MongoDB.client);
        const document = await adminService.findById(req.params.id);
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

// Update a contact by the id in the request
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try {
        const adminService = new AdminService(MongoDB.client);
        const document = await adminService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Contact not found"));
        } 
        return res.send({message: "Contact was updated successfully" });
    } catch (error) {
        return next(
            new ApiError(500,`Error updating contact with id=${req.params.id}`)
        );
    }
};

// Delete a contact with the specified id in the request
exports.delete = async (req, res, next) => {
    try {
        const adminService = new AdminService(MongoDB.client);
        const document = await adminService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Contact not found"));
        } 
        return res.send({ message: "Contact was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500,`Could not delete contact with id=${req.params.id}`)
        );
    }
};

// Delete all contacts of a user from the dâtbase
exports.deleteAll = async (_req, res, next) => {
    try {
        const adminService = new AdminService(MongoDB.client);
        const deletedCount = await adminService.deleteAll();
        return res.send({
            message: `${deletedCount} contacts were deleted successfully`,
        });
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "An error occurred while removing all contacts")
        );
    }
};

// Find all favorite contacts of a user
exports.findAllFavorite = async (req, res, next) => {
    try {
        const adminService = new AdminService(MongoDB.client);
        const documents = await adminService.findFavorite();
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(500,"An error occurred while retieving favorite contacts")
        );
    }
};
