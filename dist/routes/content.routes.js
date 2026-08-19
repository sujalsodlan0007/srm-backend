"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/blogposts', (_req, res) => {
    res.json({ success: true, posts: [] });
});
router.get('/gallery', (_req, res) => {
    res.json({ success: true, items: [] });
});
router.get('/testimonials', (_req, res) => {
    res.json({ success: true, items: [] });
});
exports.default = router;
