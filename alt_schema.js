const mongoose = require('mongoose');

// mongodb shell: mongo ds215502.mlab.com:15502/avero -u malcolm -p Vargo65

const orderedItemSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        index: true
    },
    name: String,
    cost: Number,
    price: Number,
    voided: Boolean,
    updated_at: Date,
    created_at: Date
});

const checkSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        index: true
    },
    name: String,
    closed: Boolean,
    closed_at: {
        type: Date,
        index: true
    },
    orderedItems: [orderedItemSchema],
    updated_at: Date,
    created_at: Date
});

const laborEntrySchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        index: true
    },
    name: String,
    clock_in: {
        type: Date,
        index: true
    },
    clock_out: {
        type: Date,
        Index: true
    },
    pay_rate: Number,
    updated_at: Date,
    created_at: Date
});

const employeeSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        index: true
    },
    first_name: String,
    last_name: String,
    pay_rate: Number,
    checks: [checkSchema],
    laborEntries: [laborEntrySchema],
    updated_at: Date,
    created_at: Date
});

const businessSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        index: true
    },
    name: String,
    hours: [Number],
    employees: [employeeSchema],
    updated_at: Date,
    created_at: Date
});

// http://mongoosejs.com/docs/2.7.x/docs/methods-statics.html

businessSchema.statics.insertEmployee = function(employee, cb) {
    return this.find({ id: employee.business_id }, (err, doc) => {
        doc.employees.push({
            id: employee.id,
            first_name: employee.first_name,
            last_name: employee.last_name,
            pay_rate: employee.pay_rate,
            checks: [],
            laborEntries: [],
            updated_at: Date,
            created_at: Date
        });
    }).exec(cb);
};

            

const querySchema = new mongoose.Schema({
    model: String,
    business_id: { type: String, default: null }
});

const Query = mongoose.model('Query', querySchema);
const Business = mongoose.model('Business', businessSchema);

module.exports = {
    Business,
    Query
};
