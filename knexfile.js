"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const path_1 = __importDefault(require("path"));
const config = {
    development: {
        client: 'sqlite3',
        connection: {
            filename: path_1.default.resolve(__dirname, 'blog.sqlite')
        },
        useNullAsDefault: true,
        migrations: {
            directory: path_1.default.resolve(__dirname, 'migrations')
        }
    }
};
module.exports = config;
