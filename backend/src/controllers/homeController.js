const express = require('express');
const router = express.Router();

// Home route
router.get('/', (req, res) => {
    res.send('<b>Diogo Mendes ➔ Open Weather Backend</b><br>Glartek Challenge FullStack ➔ LVL Junior');
});

module.exports = router;
