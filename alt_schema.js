const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        index: true
    },
    name: String,
    hours: [Number],
    updated_at: Date,
    created_at: Date,
    employees: [{
        id: {
            type: String,
            unique: true,
            index: true
        },
        first_name: String,
        last_name: String,
        pay_rate: Number,
        updated_at: Date,
        created_at: Date,
        laborEntries: [{
            id: {
                type: String,
                unique: true,
                index: true
            },
            clock_in: {
                type: Date,
                index: true
            },
            clock_out: {
                type: Date,
                index: true
            },
            pay_rate: Number,
            updated_at: Date,
            created_at: Date,
            checks: [{
                id: {
                    type: String,
                    unique: true,
                    index: true
                },
                closed: Boolean,
                closed_at: {
                    type: Date,
                    index: true
                },
                updated_at: Date,
                created_at: Date,
                orderedItems: [{
                    id: {
                        type: String,
                        unique: true,
                        index: true
                    },
                    cost: Number,
                    price: Number,
                    voided: Boolean,
                    updated_at: Date,
                    created_at: Date
                }]
            }]
        }]
    }]
});
