const mongoose = require('mongoose');


const businessSchema = new mongoose.Schema({
    id: String,
    name: String,
    hours: [Number],
    updated_at: Date,
    created_at: Date
});

const menuItemSchema = new mongoose.Schema({
    id: String,
    business_id: String,
    name: String,
    cost: Number,
    price: Number,
    updated_at: Date,
    created_at: Date
});

const checkSchema = new mongoose.Schema({
    id: String,
    business_id: String,
    employee_id: String,    
    name: String,
    closed: Boolean,
    closed_at: Date,
    updated_at: Date,
    created_at: Date
});

const orderedItemSchema = new mongoose.Schema({
    id: String,
    business_id: String,
    employee_id: String,
    check_id: String,
    item_id: String,
    name: String,
    cost: Number,
    price: Number,
    voided: Boolean,
    updated_at: Date,
    created_at: Date
});

const employeeSchema = new mongoose.Schema({
    id: String,
    business_id: String,
    first_name: String,
    last_name: String,
    pay_rate: Number,
    updated_at: Date,
    created_at: Date
});

const laborEntrySchema = new mongoose.Schema({
    id: String,
    business_id: String,
    employee_id: String,
    name: String,
    clock_in: Date,
    clock_out: Date,
    pay_rate: Number,
    updated_at: Date,
    created_at: Date
});

const querySchema = new mongoose.Schema({
    model: String,
    business_id: { type: String, default: null },
    employee_id: { type: String, default: null }
});

const Query = mongoose.model('Query', querySchema);
const Business = mongoose.model('Business', businessSchema);
const MenuItem = mongoose.model('MenuItem', menuItemSchema);
const Check = mongoose.model('Check', checkSchema);
const Employee = mongoose.model('Employee', employeeSchema);
const LaborEntry = mongoose.model('LaborEntry', laborEntrySchema);
const OrderedItem = mongoose.model('OrderedItem', orderedItemSchema);

module.exports = {
    Business,
    MenuItem,
    Check,
    Employee,
    LaborEntry,
    OrderedItem,
    Query
};
