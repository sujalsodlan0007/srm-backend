"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeText = void 0;
const sanitizeText = (value) => {
    if (!value)
        return '';
    return value.replace(/<[^>]*>/g, '').trim();
};
exports.sanitizeText = sanitizeText;
