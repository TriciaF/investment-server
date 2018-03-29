'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    bday: { type: Date, required: true },
    email: { type: String, required: true },
    game: {
        level: { type: Number, default: 1 },
        initialFund: { type: Number, default: 5000 },
        currentFund: { type: Number, default: 5000 },
        risk: [{
            x: Number,
            y: Number
        }],
        year: { type: Number, default: 1 }
    }
});


UserSchema.virtual('riskArr').get(function() {
    return `${this.game.risk.x}${this.game.risk.y}`.trim();
});

// I'M SO LOST
UserSchema.methods.serialize = function() {
    return {
        username: this.username || '',
        firstName: this.firstName || '',
        lastName: this.lastName || '',
        id: this._id,
        bday: this.bday,
        email: this.email,
        level: this.game.level,
        initialFund: this.game.initialFund,
        currentFund: this.game.currentFund,
        risk: this.game.riskArr,
        year: this.game.year
    };
};

UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);

module.exports = { User };